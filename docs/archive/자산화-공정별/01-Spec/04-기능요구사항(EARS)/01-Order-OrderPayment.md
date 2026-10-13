# Order 도메인 기능요구사항 — 주문결제·연동 (EARS)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-EARS-ORDER-001 (분리 파일 2/4) |
| Scope | Bolt (Order 도메인 — OrderPayment/Integration) |
| 상태 | DRAFT-v2 |
| 작성일 | 2026-07-30 |
| 입력 자산 | 도메인기능표(01-Order.md), runNshop_policy_v1_2.md §5/§7.1/§11.4/§12.3, 용어집 |

> 이 파일은 주문 생성(TEMP)부터 결제완료·취소·구매확정까지의 핵심 플로우와,
> Payment/Catalog/Notification 등 타 도메인과의 이벤트 연동을 다룬다.
>
> **관련 파일**: `01-Order-Cart.md`(장바구니·주문서), `01-Order-Delivery.md`(배송관리),
> `01-Order-Claim.md`(클레임처리)
>
> **HR#3 2계층 주문구조(해결 확정)**: `ord_platform_order`(고객 주문 단위)와 `ord_order`
> (입점사별 처리 단위) 구분은 용어집에서 확정 완료. EARS에서는 "주문"으로 단일 서술하며,
> 물리적 분리는 Design 단계(상태머신·ERD)에서 반영한다.

---

## 주문결제

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-ORD-001 | Event-driven | M | WHEN 고객이 주문서에서 결제를 요청하면, THE 주문시스템 SHALL 주문 상태를 TEMP에서 PROCESSING으로 전환하고 Payment 도메인에 결제요청 이벤트를 발행한다 | 정책서 §7.1 | P1 |
| REQ-ORD-002 | Event-driven | M | WHEN 고객이 주문서 화면을 로드하면, THE 주문시스템 SHALL 장바구니 상품·배송지·결제수단 정보를 조합하여 주문서 데이터를 반환한다 | 정책서 5장 | P1 |
| REQ-ORD-003 | Ubiquitous | M | THE 주문시스템 SHALL 주문 생성 시 주문 상태를 TEMP로 설정한다 | 정책서 5장 | P1 |
| REQ-ORD-006 | Event-driven | M | WHEN 고객이 PAYMENT_COMPLETED 상태의 주문에 대해 취소 신청 폼(취소 사유 포함)을 제출하면, THE 주문시스템 SHALL 취소 사유를 기록하고 Payment 도메인에 결제취소 요청 이벤트를 발행하고 재고를 자동 복구하며 주문 상태를 CANCELLED로 전환한다(부분취소 불가 — 전체취소 후 재주문) ※ | 정책서 5장 | P1 |
| REQ-ORD-007 | State-driven | M | WHILE 주문이 PAYMENT_COMPLETED 상태인 동안, THE 주문시스템 SHALL 고객의 단순 취소 요청을 허용한다 | 정책서 5장 | P1 |
| REQ-ORD-008 | Event-driven | A | WHEN CS 담당자가 PAYMENT_COMPLETED 상태 주문에 대해 예외 취소를 실행하면, THE 주문시스템 SHALL 사유를 기록하고 Payment 도메인에 결제취소 요청 이벤트를 발행하며 주문 상태를 CANCELLED로 전환한다 | 정책서 5장 | P1 |
| REQ-ORD-009 | Unwanted | A | IF 예외 취소 대상 주문이 PAYMENT_COMPLETED 이외의 상태이면, THEN THE 주문시스템 SHALL 취소를 거부하고 현재 상태 및 불가 사유를 표시한다 | 정책서 5장 | P2 |
| REQ-ORD-012 | Event-driven | A | WHEN CS 담당자가 "장바구니 담아주기" 버튼을 실행하면, THE 주문시스템 SHALL 해당 상품을 고객 장바구니에 추가하여 재구매를 유도한다 | 정책서 5장 | P3 |
| REQ-ORD-013 | Event-driven | A | WHEN 관리자가 주문 목록을 조회하면, THE 주문시스템 SHALL 주문상품·결제정보·배송정보·변경이력 탭별 상세 데이터를 제공한다 | 정책서 5장 | P3 |
| REQ-ORD-014 | Event-driven | M | WHEN 고객이 주문내역 화면을 요청하면, THE 주문시스템 SHALL 본인의 주문 목록과 주문별 상세 정보를 조회하여 반환한다 | 정책서 5장 | P3 |
| REQ-ORD-015 | Ubiquitous | M | THE 주문시스템 SHALL 주문내역 조회 시 본인(로그인 고객)의 주문만 반환한다 | 정책서 5장 | P1 |
| REQ-ORD-017 | Event-driven | M | WHEN 고객이 주문상세 화면에서 구매확정 버튼을 누르면, THE 주문시스템 SHALL 주문 상태를 DELIVERED에서 CONFIRMED로 전환하고 정산 대상에 포함시킨다 | 정책서 5장 | P1 |
| REQ-ORD-077 | Event-driven | M | WHEN PROCESSING 상태 중 고객이 주문 처리 상태 조회를 요청하면, THE 주문시스템 SHALL 현재 처리 단계와 예상 소요시간을 반환한다 | 정책서 §7.1 | P2 |
| REQ-ORD-078 | Unwanted | C | IF PROCESSING 상태에서 3분(타임아웃)을 초과하면, THEN THE 주문시스템 SHALL 처리를 실패로 전환하고 선점 재고를 복원하며 고객에게 실패 안내를 반환한다 | 정책서 §7.1 | P1 |
| REQ-ORD-079 | Event-driven | M | WHEN 자동구매확정 D-1 시점이 되면, THE 주문시스템 SHALL Notification 도메인에 구매확정 예고 알림 발송을 요청한다 | 정책서 §11.4 | P2 |
| REQ-ORD-080 | Event-driven | M | WHEN 고객이 혜택 적용 내역을 조회하면, THE 주문시스템 SHALL 주문상세에서 쿠폰·할인·포인트 적용 결과를 표시한다 | 정책서 §12.3 | P3 |
| REQ-ORD-097 | Event-driven | M | WHEN 고객이 주문상세에서 영수증 조회를 요청하면, THE 주문시스템 SHALL 해당 주문의 결제 영수증(결제수단·금액·승인번호·일시)을 조회하여 출력 가능한 형식으로 반환한다 | 정책서 누락 — 이커머스 표준 필수(전자상거래법 증빙 제공 의무) | P2 |

---

## 연동 (도메인 간 이벤트)

| ID | 패턴 | 채널 | 요구사항 | 출처 | 우선순위 |
|---|---|---|---|---|---|
| REQ-ORD-055 | Event-driven | C | WHEN Payment 도메인으로부터 결제완료 이벤트를 수신하면, THE 주문시스템 SHALL 주문 상태를 PROCESSING에서 PAYMENT_COMPLETED로 전환하고 후속 처리(주문 확정 알림 등)를 트리거한다 | 정책서 §7.1, 5장 | P1 |
| REQ-ORD-056 | Unwanted | C | IF 결제완료 이벤트 수신 시 해당 주문이 PROCESSING 상태가 아니거나 주문번호가 존재하지 않으면, THEN THE 주문시스템 SHALL 이벤트를 무시하고 이상 로그를 기록한다 | 정책서 §7.1, 5장 | P1 |
| REQ-ORD-057 | Event-driven | C | WHEN 결제가 요청되어 TEMP→PROCESSING 전환 시 재고선점이 필요하면, THE 주문시스템 SHALL Catalog 도메인에 재고선점 이벤트를 발행하여 비동기로 재고를 확보한다 | 정책서 5장, §7.1 | P1 |
| REQ-ORD-058 | Unwanted | C | IF Catalog 도메인으로부터 재고선점 실패 응답을 수신하면, THEN THE 주문시스템 SHALL 주문 생성을 실패 처리하고 고객에게 품절 안내를 반환한다 | 정책서 5장 | P1 |
| REQ-ORD-095 | Event-driven | C | WHEN Payment 도메인으로부터 결제실패 이벤트를 수신하면, THE 주문시스템 SHALL 주문 상태를 PROCESSING에서 CANCELLED로 전환하고 선점 재고를 복원하며 고객에게 결제 실패 사유를 안내한다 | 정책서 §7.1, §12.2 | P1 |
| REQ-ORD-096 | Event-driven | C | WHEN PROCESSING 상태에서 후속 처리 실패(재고선점 실패 또는 타임아웃)로 주문이 CANCELLED로 전환되면, THE 주문시스템 SHALL Payment 도메인에 승인취소 이벤트를 발행한다 | 정책서 §7.1 | P1 |
| REQ-ORD-093 | Event-driven | C | WHEN 포인트·쿠폰 금액이 확정되면, THE 주문시스템 SHALL 할인·차감 금액을 최종 PG 승인요청에 반영하여 Payment 도메인에 전달한다 | 정책서 §12.3 | P1 |
| REQ-ORD-094 | Event-driven | P | WHEN 입점사가 결제상태별 주문 조회를 요청하면, THE 주문시스템 SHALL 결제완료/결제대기/취소/환불 상태로 필터링한 주문 목록(주문상품 중심)을 반환한다 | — (도메인기능표 이관건, 소유권 확정: Order — 목적이 주문상품 확인) | P3 |

---

## 요약

| 영역 | ID 범위 | 수량 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| 주문결제 | REQ-ORD-001~017, 077~080, 097 | 17 | 9 | 4 | 4 |
| 연동 | REQ-ORD-055~058, 093~096 | 8 | 7 | 0 | 1 |
| **합계** | | **25** | **16** | **4** | **5** |

---

## Human Review

| # | 항목 | 사유 | 우선순위 |
|---|---|---|---|
| ~~1~~ | ~~HR#3 2계층 주문구조 미반영~~ | **해결(2026-07-30)** — 용어집에서 확정. EARS는 "주문" 단일 표현 유지, Design에서 물리 분리 | ~~높음~~ |
| 2 | 비동기 주문 처리 3분 타임아웃 | REQ-ORD-078 — 정책서 §7.1 근거이나 "3분"이 적정한지 NFR 연동 확인 필요 | 낮음 |
