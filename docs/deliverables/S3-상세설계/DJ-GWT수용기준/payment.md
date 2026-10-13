# GWT 수용기준 — Payment 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Payment) | **문서종류**: Spec
> Order 관련 시나리오는 [order.md](order.md) 참조

---

## ID 규칙

```
AC-{DOMAIN}-{SEQ}
```
- AC: Acceptance Criteria
- DOMAIN: ORD(주문) / PAY(결제)
- SEQ: 3자리 순번

---

## 3. 결제 완료 처리 Bolt

> (Order 도메인 관련 나머지 항목은 [order.md](order.md) 참조)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-001 | 정상 | REQ-PAY-001 | Order에서 결제 요청을 수신했다 | Payment가 PG에 승인을 요청한다 | PG 승인 성공 응답 수신, 상태→PAID |
| AC-PAY-002 | 정상 | REQ-PAY-002 | PG 승인이 성공했다 | 결제 상태가 PAID로 전환된다 | PAYMENT_APPROVED 이벤트가 Order에 발행된다 |
| AC-PAY-003 | 정상 | REQ-PAY-006 | PG에 승인 요청을 보냈다 | 응답이 도착한다 | 요청·응답 전체가 pay_payment_log에 기록된다 |
| AC-PAY-004 | 정상 | REQ-PAY-007 | PG 승인 요청 금액이 100,000원이다 | 주문 결제 요청 금액과 비교한다 | 금액이 일치하면 승인 진행, 불일치 시 거부 |

---

## 4. 결제 실패 처리 Bolt

> (Order 도메인 관련 나머지 항목은 [order.md](order.md) 참조)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-005 | 정상 | REQ-PAY-003 | PG 승인이 실패했다 (1회차) | 시스템이 재시도한다 | 최대 3회까지 재시도 (retry_count 증가) |
| AC-PAY-006 | 경계값 | REQ-PAY-003 | PG 승인이 3회 연속 실패했다 | 3회차 실패 응답을 수신한다 | 결제 상태→CANCELLED, PAYMENT_FAILED 이벤트 발행 |
| AC-PAY-007 | 예외 | REQ-PAY-005 | PG에 승인 요청을 보냈다 | 30초 내 응답이 없다 | 타임아웃 처리, 재시도 프로세스 시작 |

---

## 9. 환불 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-008 | 정상 | REQ-PAY-008 | 결제가 PAID 상태이다 | ORDER_CANCELLED 이벤트를 수신한다 | PG에 전액 환불 요청, 상태→REFUNDED |
| AC-PAY-009 | 정상 | REQ-PAY-009 | 결제가 PAID 상태이다 | CLAIM_COMPLETED 이벤트를 수신한다 | PG에 부분 환불 요청, 상태→PARTIAL_REFUNDED |
| AC-PAY-010 | 정상 | REQ-PAY-010 | PG 환불 요청이 성공했다 (전액) | 환불 응답을 수신한다 | 결제 상태→REFUNDED |
| AC-PAY-011 | 정상 | REQ-PAY-010 | PG 부분 환불이 성공했다 | 환불 응답을 수신한다 | 결제 상태→PARTIAL_REFUNDED |
| AC-PAY-026 | 정상 | REQ-PAY-024 | 주문 상품 결제금액 40,000원 + 배송비 3,000원(합계 43,000원), 클레임(부분 반품)이 완료되었다 | Payment가 부분 환불 금액을 계산한다 | 배송비 3,000원은 차감하지 않고 상품 결제금액 40,000원만을 기준으로 환불 금액이 산정된다 |
| AC-PAY-012 | 예외 | REQ-PAY-011 | PG 자동 환불이 실패했다 | 환불 실패 응답을 수신한다 | CS 담당자에게 알림, 수동 환불 대기 상태 전환 |
| AC-PAY-013 | 정상 | REQ-PAY-012 | 수동 환불 대기 상태이다 | CS 담당자가 수동 환불을 처리한다 | PG 재환불 요청, 결과 기록 |
| AC-PAY-014 | 정상 | REQ-PAY-013 | 환불을 처리한다 | — | 원칙적으로 원결제 수단으로 환불된다. 단, 원결제 수단 환불이 불가능한 경우 CS 담당자 승인 하에 계좌이체(수동)로 대체할 수 있다 |

---

## 10. 결제수단 관리 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-015 | 정상 | REQ-PAY-014 | 고객이 신용카드 정보를 입력했다 | 결제수단을 등록한다 | PG 토큰 발급, pay_payment_method에 저장 (카드번호 미저장) |
| AC-PAY-016 | 정상 | REQ-PAY-015 | 고객이 등록된 결제수단이 있다 | 결제수단을 삭제한다 | 토큰 무효화, 목록에서 제거 (is_deleted=true) |
| AC-PAY-017 | 정상 | REQ-PAY-016 | 고객이 결제수단 2개를 등록했다 | 결제수단 목록을 조회한다 | 본인 수단만 마스킹(****-1234)하여 반환 |
| AC-PAY-018 | 정상 | REQ-PAY-017 | — | 결제수단 등록 시 | 카드번호·CVV는 서버에 저장되지 않는다 (PG 토큰만 보유) |

---

## 11. 카드 제한 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-019 | 정상 | REQ-PAY-018 | 동일 카드로 2회 연속 결제 실패했다 | 3회째 실패한다 | 해당 카드 당일 결제 차단, 고객에게 안내 |
| AC-PAY-020 | 경계값 | REQ-PAY-018, REQ-PAY-023 | 동일 카드로 2회 실패 후 1회 성공했다 | 다시 실패한다 | 연속 카운트 리셋 → 1회 실패 (차단 안 됨) |
| AC-PAY-021 | 정상 | REQ-PAY-019 | 카드가 당일 차단 상태이다 | 익일 00:00이 된다 | 제한 자동 해제 (released_at 기록) |
| AC-PAY-027 | 정상 | REQ-PAY-023 | 카드의 pay_card_fail_counter가 0이다 | PG 콜백으로 결제 1회 실패를 수신한다 | pay_card_fail_counter가 1로 증가한다 (3회 미도달, 카드 제한은 발생하지 않음) |
| AC-PAY-028 | 정상 | REQ-PAY-023 | 카드의 pay_card_fail_counter가 2인 상태에서 결제가 진행 중이다 | PG 콜백으로 결제 성공을 수신한다 | 결제 상태→PAID, pay_card_fail_counter가 0으로 리셋되고 PAYMENT_APPROVED 이벤트가 발행된다 |

---

## 15. 어드민 환불·폐기·반송 Bolt

> (Order 도메인 관련 나머지 항목은 [order.md](order.md) 참조)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-022 | 정상 | REQ-PAY-013 | 원결제수단 환불이 불가능하여 CS 담당자가 계좌이체 대체를 승인했다 | 어드민이 계좌이체 환불을 진행한다 | 입금정보(은행/계좌/예금주) 시스템 저장, 수동 이체 후 환불완료 처리 |

---

## 17. 조회 Bolt (Payment)

| ID | 카테고리 | 대응 EARS | Given | When | Then |
|---|---|---|---|---|---|
| AC-PAY-023 | 정상 | REQ-PAY-020 | 고객이 결제 3건을 보유하고 있다 | 고객이 결제 이력을 조회한다 | 본인 결제 건만 최신순으로 반환된다 |
| AC-PAY-024 | 정상 | REQ-PAY-021 | CS 담당자가 결제를 검색한다 | 상태·기간·주문번호·PG거래번호 필터를 적용한다 | 해당 조건에 맞는 결제 내역만 반환된다 |
| AC-PAY-025 | 정상 | REQ-PAY-022 | CS 담당자가 특정 결제 건의 PG 거래 로그를 조회한다 | 조회를 실행한다 | 해당 결제의 전체 요청·응답 이력이 PII 마스킹되어 반환된다 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 시나리오 도출 | EARS(DD) REQ-ORD-001~076, REQ-PAY-001~024 → GWT 변환 (바텀업 재검증분 REQ-ORD-063~076, REQ-PAY-023~024 포함) |
| 경계값 수치 | 정책서 (50개 장바구니, D+7 자동확정, 반품 10일, 재시도 3회, 30초 타임아웃, 배송비결제 24시간) |
| 예외 시나리오 | EARS Unwanted/Optional 패턴 + 화면레이아웃(DN) 정책 미결 사항 |
| 상태 전이 | 상태머신(DH) v6 — Order 10상태(배송 실행은 ord_shipment로 분리; PREPARING에서 shipment(OUTBOUND) DELIVERED 이벤트 구독으로 DELIVERED 파생전환, IN_DELIVERY 상태 없음). Claim 11상태(RECEIVED→PAYMENT_PENDING(고객귀책) 또는 RECEIVED→INSPECTING(입점사귀책, shipment(PICKUP) 생성·DELIVERED 후 전환)→PICKED_UP/PICKUP_REJECTED→REFUNDED→COMPLETED/DISPOSED/RETURN_PAYMENT_PENDING→COMPLETED(shipment(RETURN) DELIVERED 후 배치가 직접 전환, RETURN_SHIPPING/RETURN_DELIVERED 경유 없음)). Claim은 CS "처리시작(IN_PROGRESS)" 단계 없이 RECEIVED에서 귀책판정으로 곧바로 분기한다. 신규 shipment.status(PENDING/IN_TRANSIT/DELIVERED/FAILED/CANCELLED, order/claim 공용, shipment_type=OUTBOUND/PICKUP/RETURN/EXCHANGE_OUT). responsibility는 CUSTOMER/VENDOR 2종 |
