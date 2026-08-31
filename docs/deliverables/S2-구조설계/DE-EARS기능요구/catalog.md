# EARS 기능요구사항 — Catalog

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Spec
>
> **작성 목적**: 상위 유스케이스(⑥)와 메뉴구조도(⑦)를 기반으로, Catalog 도메인의 기능요구를 EARS 패턴으로 정형화한다.
> **흐름 내 위치**: ⑥ 상위 UC → ⑦ 메뉴구조도 → **⑧ EARS** → ⑨ ERD → ⑩ 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | SPEC-EARS-CATALOG-001 |
| 상태 | **Draft** |
| 작성일 | 2026-07-08 |
| 갱신일 | 2026-07-08 |

---

## PublicApi (Order 연동)

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-001 | Event-driven | WHEN Order 도메인이 상품 정보를 요청하면, THE 시스템은 SHALL 상품 ID 기반으로 이름·가격·상태·판매자 정보를 반환한다. | PublicApi: 상품 정보 조회 | 도메인정의서 §4: Order→Catalog 동기 |
| REQ-CAT-002 | Event-driven | WHEN Order 도메인이 재고 차감을 요청하면, THE 시스템은 SHALL 해당 SKU의 available_quantity를 요청 수량만큼 차감한다. | 재고 선점 (동기) | 도메인정의서 §4: 재고 선점 계약 |
| REQ-CAT-003 | Unwanted | IF 재고 차감 요청 시 available_quantity < 요청 수량이면, THEN THE 시스템은 SHALL 차감을 거부하고 INSUFFICIENT_STOCK 응답을 반환한다. | 재고 선점 (동기) | 불변식: 가용 재고 ≥ 0 |
| REQ-CAT-004 | Event-driven | WHEN Order 도메인으로부터 ORDER_CANCELLED 이벤트를 수신하면, THE 시스템은 SHALL 해당 SKU의 available_quantity를 복원한다. | 재고 복원 (비동기) | 도메인정의서 §4: 취소 시 복원 |
| REQ-CAT-005 | Ubiquitous | THE 시스템은 SHALL 모든 재고 변동을 cat_stock_history에 기록한다 (변동사유·수량·시점). | 재고 선점/복원 | 감사 추적 정책 |
| REQ-CAT-006 | Event-driven | WHEN 재고 변동이 발생하면, THE 시스템은 SHALL StockChanged 이벤트를 발행한다. | 이벤트 발행 | 도메인정의서 "의존·이벤트 발행" |
| REQ-CAT-007 | Event-driven | WHEN Order 도메인이 복수 SKU의 가용 재고를 확인 요청하면, THE 시스템은 SHALL 각 SKU별 available_quantity를 반환한다. | PublicApi: 재고 확인 | 장바구니/결제 전 검증 |

---

## 등록·심사

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-008 | Event-driven | WHEN 판매자가 상품 초안을 작성하면, THE 시스템은 SHALL 상품을 DRAFT 상태로 생성한다. | 상품 초안 작성 | 도메인정의서 "상품 등록" |
| REQ-CAT-009 | Event-driven | WHEN 판매자가 심사 요청을 하면, THE 시스템은 SHALL 상품 상태를 DRAFT→REVIEW_REQUESTED로 전환한다. | 심사 요청 | 심사 프로세스 정책 |
| REQ-CAT-010 | Event-driven | WHEN 관리자(MD)가 심사를 착수하면, THE 시스템은 SHALL 상태를 REVIEW_REQUESTED→UNDER_REVIEW로 전환한다. | 심사 착수 | 심사 프로세스 정책 |
| REQ-CAT-011 | Event-driven | WHEN 관리자(MD)가 심사를 승인하면, THE 시스템은 SHALL 상태를 UNDER_REVIEW→ON_SALE로 전환하고 ProductApproved 이벤트를 발행한다. | 심사 승인 | 심사 프로세스 정책 |
| REQ-CAT-012 | Event-driven | WHEN 관리자(MD)가 심사를 반려하면, THE 시스템은 SHALL 상태를 UNDER_REVIEW→REJECTED로 전환하고 reject_reason을 기록한다. | 심사 반려 | 심사 프로세스 정책 |
| REQ-CAT-013 | Event-driven | WHEN 판매자가 반려된 상품을 수정하면, THE 시스템은 SHALL 상태를 REJECTED→DRAFT로 전환한다. | 반려 후 재작성 | 심사 프로세스 정책 |

---

## 상품정보관리

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-014 | Event-driven | WHEN 판매자가 상품 기본정보를 수정하면, THE 시스템은 SHALL 변경 사항을 저장하고 ProductUpdated 이벤트를 발행한다. | 기본정보 수정 | 도메인정의서 "상품 정보 관리" |
| REQ-CAT-015 | Event-driven | WHEN 판매자가 상품 이미지를 등록하면, THE 시스템은 SHALL 이미지를 cat_product_image에 저장하고 sort_order를 부여한다. | 이미지 관리 | 상품 상세 구성 |
| REQ-CAT-016 | Ubiquitous | THE 시스템은 SHALL 상품당 이미지를 최대 10장까지 허용한다. | 이미지 관리 | 정책서 §3 이미지 제한 |
| REQ-CAT-017 | Event-driven | WHEN 판매자가 옵션그룹·옵션값을 설정하면, THE 시스템은 SHALL 해당 조합으로 SKU를 자동 생성한다. | 옵션 설정 | SKU 생성 규칙 |
| REQ-CAT-018 | Event-driven | WHEN 판매자/관리자가 단종 처리하면, THE 시스템은 SHALL 상태를 ON_SALE/SOLD_OUT→DISCONTINUED로 전환한다. | 단종 처리 | 운영 정책: 영구 판매 중단 |

---

## 분류체계

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-019 | Event-driven | WHEN 관리자가 표준 카테고리를 생성·수정·삭제하면, THE 시스템은 SHALL cat_category 트리 구조를 갱신한다. | 표준 카테고리 관리 | 분류체계 정책 |
| REQ-CAT-020 | Event-driven | WHEN 관리자가 전시 카테고리를 생성·수정·삭제하면, THE 시스템은 SHALL cat_display_category 트리 구조를 갱신한다. | 전시 카테고리 관리 | 전시 분류 정책 |
| REQ-CAT-021 | Ubiquitous | THE 시스템은 SHALL 표준 카테고리와 전시 카테고리를 cat_category_mapping을 통해 N:M 매핑 관리한다. | 카테고리-상품 매핑 | 분류체계 정책 |

---

## 재고·가격

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-022 | Event-driven | WHEN 판매자가 SKU 재고 수량을 변경하면, THE 시스템은 SHALL stock_quantity와 available_quantity를 갱신하고 cat_stock_history를 기록한다. | 재고 수량 설정 | 재고 운영 |
| REQ-CAT-023 | Event-driven | WHEN SKU의 available_quantity가 0이 되면, THE 시스템은 SHALL 해당 상품 상태를 ON_SALE→SOLD_OUT으로 자동 전환한다. | 품절 자동 전환 | 자동 상태 전환 정책 |
| REQ-CAT-024 | Event-driven | WHEN SOLD_OUT 상품의 available_quantity가 1 이상으로 복원되면, THE 시스템은 SHALL 상태를 SOLD_OUT→ON_SALE로 자동 전환한다. | 재입고 판매 재개 | 자동 상태 전환 정책 |
| REQ-CAT-025 | Event-driven | WHEN 판매자가 가격을 변경하면, THE 시스템은 SHALL 변경 전후 가격을 cat_price_history에 기록한다. | 가격 설정 | 감사 추적 정책 |

---

## 고객조회

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-026 | Event-driven | WHEN 고객이 카테고리별 상품 목록을 조회하면, THE 시스템은 SHALL ON_SALE/SOLD_OUT 상태 상품만 페이징하여 반환한다. | 상품 목록 조회 | 전시 정책 |
| REQ-CAT-027 | Event-driven | WHEN 고객이 상품 상세를 조회하면, THE 시스템은 SHALL 상품 기본정보·이미지·옵션·SKU 가용재고를 반환한다. | 상품 상세 조회 | 상품 상세 페이지 |
| REQ-CAT-028 | Event-driven | WHEN 고객이 키워드·필터로 상품을 검색하면, THE 시스템은 SHALL 카테고리·가격·브랜드 필터를 적용하여 결과를 반환한다. | 상품 검색 | 검색 기능 |

---

## 고객응대

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-029 | Event-driven | WHEN 고객이 품절 상품에 재입고 알림을 신청하면, THE 시스템은 SHALL 해당 SKU 재입고 시 알림을 발송한다. | 재입고 알림 신청 | 고객 경험 정책 |

---

## 연동

| ID | 패턴 | 요구사항 | 상위UC | 도출 근거 |
|---|---|---|---|---|
| REQ-CAT-030 | Event-driven | WHEN Promotion 도메인으로부터 RatingUpdated 이벤트를 수신하면, THE 시스템은 SHALL 해당 상품의 평균 평점·리뷰 수를 갱신한다. | 연동 수신 | 도메인정의서: Review→Catalog |
| REQ-CAT-031 | Ubiquitous | THE 시스템은 SHALL 고빈도 재고 조회 대상 SKU(is_redis_target=true)를 Redis 캐시로 관리한다. | PublicApi 성능 | NFR 성능 요구 |
| REQ-CAT-032 | Event-driven | WHEN Promotion 도메인으로부터 DISPLAY_PRICE_CHANGED 이벤트를 수신하면, THE 시스템은 SHALL 해당 상품의 display_sale_price·display_discount_rate·active_event_id를 갱신하고 Search에 동기화한다. | 연동 수신 | 상품 목록 할인가 사전 계산 전략 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 유스케이스 도출 | `DC-상위유스케이스(Catalog).md` |
| 재고 연동 규칙 | `DB-도메인정의서.md` §4: Order→Catalog 의존 관계 |
| 심사 프로세스 | 정책서 §3 상품 심사 정책 |
| 전시 정책 | 정책서 §4 카테고리 운영 정책 |
| 가격·재고 감사 | 감사 추적 정책 (price_history, stock_history) |
| 메뉴·화면 대응 | `DD-메뉴구조도(IA).md` Catalog 관련 화면 |
| Redis 캐시 | `D8-NFR.md` 성능 요구사항 |
