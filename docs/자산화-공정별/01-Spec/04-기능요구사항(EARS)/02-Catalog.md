# Catalog 도메인 기능요구사항 (EARS)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-EARS-CATALOG-001 |
| Scope | Bolt (Catalog 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 입력 자산 | 도메인기능표(02-Catalog.md), runNshop_policy_v1_2.md §3/§4, 용어집, 도메인간-우선업무-의존관계.md |

> **Catalog 도메인 핵심 책임**: 상품 정보의 전체 생명주기와 가격·재고를 관리한다.
>
> **1차 본개발 관계**: Order·Payment가 1차 본개발 대상이며, Catalog는 PublicApi(상품조회·재고선점/복원)를
> 정의하고 Mock 구현으로 제공한다. Catalog 자체의 본개발은 2차 이후에 순차 진행.
>
> **Order가 Catalog에서 호출하는 것** (Phase 0 최우선):
> - 상품 판매상태·재고·옵션 확인
> - 상품명·이미지·옵션명·정상가 조회
> - 재고 선점 (주문 시)
> - 재고 복원 (취소·실패 시)

---

## PublicApi — Order 연동 (Phase 0 최우선)

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-001 | Event-driven | C | WHEN Order 도메인이 상품 유효성 확인을 요청하면, THE 상품시스템 SHALL 해당 상품의 판매상태(ON_SALE/SOLD_OUT/DISCONTINUED)·옵션 유효성·재고 존재 여부를 확인하여 반환한다 | Order REQ-ORD-059, 정책서 §3 | P1 |
| REQ-CAT-002 | Event-driven | C | WHEN Order 도메인이 상품 정보 조회를 요청하면, THE 상품시스템 SHALL 상품명·대표이미지URL·옵션명·정상가(판매가)를 반환한다 | Order REQ-ORD-060 | P1 |
| REQ-CAT-003 | Event-driven | C | WHEN Order 도메인이 재고 선점을 동기 호출하면(skuId, qty), THE 상품시스템 SHALL 먼저 해당 SKU가 원자적 연산 대상(행사 상품 — Redis 관리)인지 확인하고, 대상이면 Redis DECR로 차감하며, 대상이 아니면 DB 비관적 락(SELECT FOR UPDATE)으로 차감하여 선점 결과(성공/실패)를 즉시 반환한다 | Order REQ-ORD-057, 정책서 §4, ADR-015 | P1 |
| REQ-CAT-004 | Unwanted | C | IF 재고 선점 요청 시 해당 SKU의 가용 재고가 요청 수량 미만이면, THEN THE 상품시스템 SHALL 선점을 실패 처리하고 현재 가용 재고 수량을 반환한다 | Order REQ-ORD-058 | P1 |
| REQ-CAT-005 | Event-driven | C | WHEN Order 도메인으로부터 재고 복원 이벤트(StockReleaseRequested)를 비동기 수신하면(skuId, qty, reason), THE 상품시스템 SHALL 해당 SKU가 Redis 대상이면 Redis INCR로 복원하고, 아니면 DB에서 재고를 복원(증가)한다 | Order REQ-ORD-006(취소), REQ-ORD-078(타임아웃), REQ-ORD-035(반품) | P1 |
| REQ-CAT-006 | Ubiquitous | C | THE 상품시스템 SHALL 재고 선점/복원 처리 시 동시 요청에 대한 원자성을 보장한다. 일반 상품은 DB 비관적 락(SELECT FOR UPDATE), 행사 상품은 Redis 원자적 연산(DECR/Lua)을 사용한다. 행사 상품 대상은 admin에서 행사 시작 시 지정하고, 행사 종료 시 Redis 잔여량을 DB에 동기화한다 | 정책서 §4, 이커머스 표준, ADR-015(확정) | P1 |
| REQ-CAT-007 | Event-driven | C | WHEN Order 도메인이 SKU별 재고 수량 확인을 요청하면, THE 상품시스템 SHALL 해당 SKU의 현재 가용 재고 수량을 반환한다 | Order REQ-ORD-064(유효성 재검사) | P1 |

---

## 상품관리 — 등록·심사

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-010 | Event-driven | P | WHEN 판매자가 상품 등록 마법사(기본정보→가격→이미지→상세소개→SKU→완료)를 완성하여 심사요청을 제출하면, THE 상품시스템 SHALL 상품 정보를 저장하고 상태를 REVIEW_REQUESTED로 전환한다 | 정책서 §3 | P1 |
| REQ-CAT-011 | Event-driven | P | WHEN 판매자가 상품 등록 중 임시저장을 요청하면, THE 상품시스템 SHALL 현재까지 입력된 정보를 저장하고 상태를 DRAFT로 유지한다 | 정책서 §3 | P2 |
| REQ-CAT-012 | Event-driven | A | WHEN 관리자(MD)가 REVIEW_REQUESTED 상태의 상품에 대해 승인을 실행하면, THE 상품시스템 SHALL 상품 상태를 ON_SALE로 전환하고 판매를 시작한다 | 정책서 §3 | P1 |
| REQ-CAT-013 | Event-driven | A | WHEN 관리자(MD)가 REVIEW_REQUESTED 상태의 상품에 대해 반려를 실행하면, THE 상품시스템 SHALL 반려 사유를 기록하고 상품 상태를 REJECTED로 전환한다 | 정책서 §3 | P1 |
| REQ-CAT-014 | Ubiquitous | A | THE 상품시스템 SHALL 상품 심사 시 반려 사유 입력을 필수로 요구한다 | 정책서 §3 | P1 |
| REQ-CAT-015 | Event-driven | B | WHEN 반려일로부터 30일이 초과하면, THE 상품시스템 SHALL 해당 상품을 자동 삭제(DRAFT→삭제) 처리한다 | 정책서 §3.1 | P2 |

---

## 상품관리 — 상품정보관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-020 | Event-driven | A+P | WHEN 관리자 또는 판매자가 상품 기본정보(상품명·설명·카테고리·브랜드 등)를 수정하여 저장하면, THE 상품시스템 SHALL 변경 사항을 저장하고 변경 이력을 기록한다 | 정책서 §3 | P1 |
| REQ-CAT-021 | Event-driven | A+P | WHEN 관리자 또는 판매자가 상품 판매상태를 변경(ON_SALE↔SOLD_OUT↔DISCONTINUED)하면, THE 상품시스템 SHALL 상태를 전환하고 변경 이력을 기록한다 | 정책서 §3 | P1 |
| REQ-CAT-022 | Event-driven | P | WHEN 판매자가 상품 이미지를 추가·삭제·순서변경하여 저장하면, THE 상품시스템 SHALL 이미지 정보를 갱신하고 리사이징 변형을 생성한다 | 정책서 §3 | P2 |
| REQ-CAT-023 | Event-driven | P | WHEN 판매자가 옵션(SKU) 그룹을 설정(색상/사이즈 등 옵션 조합)하여 저장하면, THE 상품시스템 SHALL SKU를 자동 생성하고 저장한다 | 정책서 §3 | P1 |
| REQ-CAT-024 | Ubiquitous | A+P | THE 상품시스템 SHALL 상품 정보 변경 시 변경 이벤트를 발행하여 연관 도메인(Search·Display 등)에 알린다 | 정책서 §3 | P2 |

---

## 상품관리 — 분류체계관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-030 | Event-driven | A | WHEN 관리자가 표준 카테고리를 등록(이름·부모 카테고리·레벨)하면, THE 상품시스템 SHALL 카테고리를 생성하고 트리 구조에 반영한다 | 정책서 §3 | P2 |
| REQ-CAT-031 | Event-driven | A | WHEN 관리자가 전시 카테고리를 등록하고 표준 카테고리와 매핑하면, THE 상품시스템 SHALL 전시 카테고리를 생성하고 표준 카테고리와의 다대다 매핑을 저장한다 | 정책서 §3 | P2 |
| REQ-CAT-032 | Event-driven | A | WHEN 관리자가 브랜드를 등록(브랜드명·로고·소개)하면, THE 상품시스템 SHALL 브랜드 정보를 저장한다 | 정책서 §3 | P2 |

---

## 재고·가격관리

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-040 | Event-driven | P | WHEN 판매자가 SKU별 재고 수량을 수정(인라인 편집)하여 저장하면, THE 상품시스템 SHALL 재고 수량을 갱신한다 | 정책서 §4 | P1 |
| REQ-CAT-041 | Event-driven | A | WHEN 관리자가 입출고를 등록(사유·메모·수량)하면, THE 상품시스템 SHALL 재고를 조정하고 입출고 이력을 기록한다 | 정책서 §4 | P2 |
| REQ-CAT-042 | Event-driven | P | WHEN 판매자가 상품 가격(정가·판매가·공급가)을 변경하여 저장하면, THE 상품시스템 SHALL 가격을 갱신하고 가격 변경 이력을 기록한다 | 정책서 §4 | P1 |
| REQ-CAT-043 | State-driven | C | WHILE SKU의 가용 재고가 0인 동안, THE 상품시스템 SHALL 해당 SKU를 품절 상태로 표시한다 | 정책서 §4 | P1 |

---

## 고객 조회

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-050 | Event-driven | M | WHEN 고객이 상품 상세 페이지를 요청하면, THE 상품시스템 SHALL 상품명·이미지·가격·옵션·재고상태·상세소개·평점을 반환한다 | 정책서 §3 | P1 |
| REQ-CAT-051 | Event-driven | M | WHEN 고객이 카테고리 탐색을 요청하면, THE 상품시스템 SHALL 전시 카테고리 트리와 해당 카테고리의 상품 목록을 반환한다 | 정책서 §3 | P2 |
| REQ-CAT-052 | Event-driven | M | WHEN 고객이 상품에 찜하기(관심상품 등록)를 요청하면, THE 상품시스템 SHALL Member 도메인에 관심상품 등록 요청을 전달한다(데이터 소유권: Member 도메인) | — (이커머스 표준), 소유권 확정: Member | P3 |

---

## 고객 응대

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-060 | Event-driven | A+P | WHEN 관리자 또는 판매자가 상품 문의에 답변을 등록하면, THE 상품시스템 SHALL Community 도메인에 답변 등록 요청을 전달한다(데이터 소유권: Community 도메인, Catalog는 진입점만 제공) | 정책서 §3, 소유권 확정: Community | P3 |

---

## 연동지원

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-CAT-070 | Event-driven | C | WHEN Community 도메인으로부터 평점 갱신 이벤트를 수신하면, THE 상품시스템 SHALL 해당 상품의 평점 캐시를 갱신한다 | 정책서 §3 | P3 |
| REQ-CAT-071 | Event-driven | B | WHEN 검색 인덱스 동기화 배치가 실행되면, THE 상품시스템 SHALL 변경된 상품 데이터를 Search 도메인에 동기화한다 | — (연동 표준) | P3 |

---

## 요약

| 영역 | ID 범위 | 수량 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| PublicApi (Order 연동) | REQ-CAT-001~007 | 7 | 7 | 0 | 0 |
| 등록·심사 | REQ-CAT-010~015 | 6 | 4 | 2 | 0 |
| 상품정보관리 | REQ-CAT-020~024 | 5 | 3 | 2 | 0 |
| 분류체계관리 | REQ-CAT-030~032 | 3 | 0 | 3 | 0 |
| 재고·가격관리 | REQ-CAT-040~043 | 4 | 3 | 1 | 0 |
| 고객 조회 | REQ-CAT-050~052 | 3 | 1 | 1 | 1 |
| 고객 응대 | REQ-CAT-060 | 1 | 0 | 0 | 1 |
| 연동지원 | REQ-CAT-070~071 | 2 | 0 | 0 | 2 |
| **합계** | | **31** | **18** | **9** | **4** |

---

## 채널 범례

| 코드 | 채널 | 설명 |
|---|---|---|
| A | Admin | 플랫폼 관리자 (runNshop-admin) |
| P | Partner | 입점 판매자 (runNshop-partner) |
| M | Mobile | 고객 앱 (runNshop-mobile) |
| B | Batch | 배치/스케줄러 (화면 없음) |
| C | Consumer | 비동기 이벤트 컨슈머 / 도메인 간 PublicApi (화면 없음) |

---

## 우선순위 기준

| 등급 | 기준 | 해당 범위 |
|---|---|---|
| P1 | Order 연동 필수 + 상품 핵심 플로우 | PublicApi 전체, 상품 등록·승인, SKU·재고·가격, 고객 상세 |
| P2 | 운영 필수 — 부재 시 상품 관리 지장 | 분류체계, 이미지, 입출고 이력, 카테고리 탐색, 임시저장 |
| P3 | 부가 기능 — 부재 시 우회 가능 | 찜하기, 문의 답변, 평점 캐시, 검색 동기화 |

---

## Human Review

| # | 항목 | 사유 | 우선순위 |
|---|---|---|---|
| ~~1~~ | ~~재고 선점 동시성 처리 방식~~ | **해결(ADR-015 확정)** — 1+3 혼용: 일반 상품=DB 비관적 락, 행사 상품=Redis DECR. 행사 대상은 admin에서 시작/종료 관리. 행사 종료 시 Redis→DB 동기화 | ~~중~~ |
| ~~2~~ | ~~찜하기 데이터 소유권~~ | **해결** — Member 도메인이 소유. Catalog는 상품상세 화면의 진입점(♡ 버튼)만 제공하고, Member에 등록 요청 전달 | ~~낮음~~ |
| ~~3~~ | ~~상품문의 도메인 경계~~ | **해결** — Community 도메인이 소유. Catalog 상품상세의 문의 탭은 진입점만 제공, 데이터·답변 로직은 Community 소관 | ~~낮음~~ |

---

## 근거 자료 출처 매핑

| 정책 출처 | 관련 요구사항 ID | 핵심 근거 |
|---|---|---|
| Order EARS (REQ-ORD-057~060, 064) | REQ-CAT-001~007 | Order가 호출하는 PublicApi의 근거 |
| `runNshop_policy_v1_2.md` §3 | REQ-CAT-010~032, 050~060 | 상품 생명주기·분류·고객 조회 |
| `runNshop_policy_v1_2.md` §4 | REQ-CAT-040~043 | 재고·가격 관리 |
| 도메인간-우선업무-의존관계.md | REQ-CAT-001~007 | Phase 0 PublicApi 계약 |
| 도메인기능표 02-Catalog.md | 전체 | 소분류→EARS 매핑 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — 도메인기능표 49개 소분류 중 Order 연동 필수 + 핵심 운영 기능 기준 31개 EARS 도출 |
