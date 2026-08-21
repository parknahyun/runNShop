# EARS 기능요구사항 — Promotion

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Spec
>
> **작성 목적**: 상위 유스케이스(⑥)와 메뉴구조도(⑦)를 기반으로, Promotion 도메인의 기능요구를 EARS 패턴으로 정형화한다.
> **흐름 내 위치**: ⑥ 상위 UC → ⑦ 메뉴구조도 → **⑧ EARS** → ⑨ ERD → ⑩ 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (기획자·현업 검토·확인)

| 항목 | 내용 |
|---|---|
| ID | SPEC-EARS-PROMOTION-002 |
| 상태 | **Draft** |
| 작성일 | 2026-07-08 |
| 갱신일 | 2026-07-08 |

> **참조**: 본 문서는 `자산화-공정별/01-Spec/04-기능요구사항(EARS)/05-Promotion.md` (SPEC-EARS-PROMOTION-001, 25개 EARS)를 구조설계 단계 형식으로 재배치한 것이다. EARS ID와 내용은 동일하며, 상위 유스케이스(⑥)와의 매핑을 추가하였다.

---

## PublicApi — Order 연동 (Phase 0 최우선)

| ID | 패턴 | 요구사항 | 상위UC 매핑 | 도출 근거 |
|---|---|---|---|---|
| REQ-PRM-001 | Event-driven | WHEN Order 도메인이 상품별 할인 계산을 요청하면, THE 프로모션시스템 SHALL 행사가(즉시할인) 또는 수량구간 할인(택1)을 계산하여 반환한다 | 할인 계산(Order) | Order REQ-ORD-059/064 |
| REQ-PRM-002 | Event-driven | WHEN Order 도메인이 장바구니 할인 조건 평가를 요청하면, THE 프로모션시스템 SHALL 조건 충족 여부를 판단하고 할인금액을 반환한다 | 장바구니 할인 평가(Order) | Order REQ-ORD-103 |
| REQ-PRM-003 | Event-driven | WHEN Order 도메인이 쿠폰 유효성 검증을 요청하면, THE 프로모션시스템 SHALL 사용 가능 여부를 검증하고 할인금액을 반환한다 | 쿠폰 사용 | Order 장바구니쿠폰 API |
| REQ-PRM-004 | Unwanted | IF 쿠폰 검증 시 유효기간 만료·사용횟수 초과·최소주문금액 미달·적용상품 불일치 중 해당하면, THEN THE 프로모션시스템 SHALL 사용 불가 사유를 반환한다 | 쿠폰 사용 | Order REQ-ORD-103 |
| REQ-PRM-005 | Event-driven | WHEN Order 도메인이 사용 가능 쿠폰 목록을 요청하면, THE 프로모션시스템 SHALL 해당 회원의 적용 가능 쿠폰 목록을 반환한다 | 쿠폰 사용 | Order 주문서 생성 |
| REQ-PRM-006 | Event-driven | WHEN Order 도메인이 수량구간 할인 조건 조회를 요청하면, THE 프로모션시스템 SHALL 구간별 수량·할인율을 반환한다 | 할인 계산(Order) | Order REQ-ORD-106 |
| REQ-PRM-007 | Ubiquitous | THE 프로모션시스템 SHALL 동일 상품에 행사가와 수량구간 할인을 동시 등록할 수 없도록 한다 (택1) | 행사가 등록, 수량구간 등록 | 할인유형 적용순서 §4 |

---

## 행사가·할인관리

| ID | 패턴 | 요구사항 | 상위UC 매핑 | 도출 근거 |
|---|---|---|---|---|
| REQ-PRM-010 | Event-driven | WHEN 관리자가 행사가(즉시할인)를 활성화하면, THE 프로모션시스템 SHALL ACTIVE로 전환하고 대상 상품 판매가를 할인 적용가로 반영한다 | 행사가 등록 | 정책서 §9 |
| REQ-PRM-011 | Event-driven | WHEN 행사 종료일이 도래하면, THE 프로모션시스템 SHALL ENDED로 전환하고 가격을 자동 복원한다 | 행사 종료·가격 복원 | 정책서 §3.7 |
| REQ-PRM-012 | Event-driven | WHEN 행사가 수량이 소진되면, THE 프로모션시스템 SHALL 행사를 종료하고 가격을 복원한다 | 수량 소진 종료 | 정책서 §9.1-1 |
| REQ-PRM-013 | Event-driven | WHEN 행사가 종료로 가격이 변경되면, THE 프로모션시스템 SHALL 가격 변경 안내를 제공한다 | — (고객 화면 안내) | 정책서 §3.10 |
| REQ-PRM-020 | Event-driven | WHEN 관리자가 수량 할인을 활성화하면, THE 프로모션시스템 SHALL ACTIVE로 전환한다 | 수량구간 할인 등록 | 정책서 §9 |
| REQ-PRM-021 | Ubiquitous | THE 프로모션시스템 SHALL 수량 할인 등록 시 동일 상품에 행사가가 ACTIVE이면 등록을 거부한다 | 수량구간 할인 등록 | 할인유형 적용순서 §4 |
| REQ-PRM-030 | Event-driven | WHEN 관리자가 장바구니 할인 정책을 활성화하면, THE 프로모션시스템 SHALL ACTIVE로 전환한다 | 장바구니 할인 등록 | 정책서 §9 |
| REQ-PRM-031 | Ubiquitous | THE 프로모션시스템 SHALL 장바구니 할인은 플랫폼 운영자만 등록할 수 있다 | 장바구니 할인 등록 | 할인유형 적용순서 §4 |
| REQ-PRM-032 | Ubiquitous | THE 프로모션시스템 SHALL 장바구니 가격할인은 동시에 1건만 ACTIVE를 허용한다 | 장바구니 할인 등록 | 할인유형 적용순서 §4 |

---

## 쿠폰관리

| ID | 패턴 | 요구사항 | 상위UC 매핑 | 도출 근거 |
|---|---|---|---|---|
| REQ-PRM-039 | Event-driven | WHEN MD가 직매입 상품(vendor.is_platform_direct=TRUE)의 쿠폰을 직접 등록하면, THE 프로모션시스템 SHALL 승인 게이트(PENDING_APPROVAL)를 생략하고 즉시 ACTIVE 상태로 전환한다 | 쿠폰 직접 등록 (플랫폼 직매입) | 정책서 §9.0 |
| REQ-PRM-040 | Event-driven | WHEN 판매자가 쿠폰을 등록하면, THE 프로모션시스템 SHALL PENDING_APPROVAL 상태로 전환한다 | 쿠폰 등록 | 정책서 §9 |
| REQ-PRM-041 | Event-driven | WHEN 관리자가 쿠폰을 승인하면, THE 프로모션시스템 SHALL ACTIVE로 전환한다 | 쿠폰 승인/반려 | 정책서 §9 |
| REQ-PRM-042 | Event-driven | WHEN 관리자가 쿠폰을 반려하면, THE 프로모션시스템 SHALL REJECTED로 전환한다 | 쿠폰 승인/반려 | 정책서 §9 |
| REQ-PRM-043 | Event-driven | WHEN 관리자가 쿠폰 적용 대상을 설정하면, THE 프로모션시스템 SHALL 타겟팅 정보를 저장한다 | 쿠폰 타겟팅 | 정책서 §9 |
| REQ-PRM-044 | Event-driven | WHEN 관리자가 특정 회원에게 쿠폰을 임의 발행하면, THE 프로모션시스템 SHALL 즉시 지급한다 | 쿠폰 임의발행 | 정책서 §9 |
| REQ-PRM-045 | Event-driven | WHEN 판매자가 ACTIVE 쿠폰을 비활성화하면, THE 프로모션시스템 SHALL EXPIRED로 조기 전환한다 | 쿠폰 비활성화 | 정책서 §9 |
| REQ-PRM-046 | Event-driven | WHEN 고객이 쿠폰 다운로드를 요청하면, THE 프로모션시스템 SHALL 발급한도 내에서 발급한다 | 쿠폰 다운로드 | 정책서 §9 |
| REQ-PRM-047 | Event-driven | WHEN 쿠폰 유효기간이 만료되면, THE 프로모션시스템 SHALL 일괄 EXPIRED 처리한다 | 쿠폰 만료 처리 | 정책서 §9 |
| REQ-PRM-048 | Ubiquitous | THE 프로모션시스템 SHALL 장바구니 쿠폰은 동시에 1건만 적용을 허용한다 | 쿠폰 사용 | 할인유형 적용순서 §4 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 유스케이스 도출 | `06-상위유스케이스(Promotion).md` |
| EARS 원본 | `자산화-공정별/01-Spec/04-기능요구사항(EARS)/05-Promotion.md` |
| 할인 규칙 | `프로모션-할인유형-적용순서.md` §3, §4 |
| 정책 근거 | `runNshop_policy_v1_2.md` §3.7, §3.10, §9 |
| 메뉴·화면 대응 | `07-메뉴구조도(IA).md` Promotion 관련 화면 |
