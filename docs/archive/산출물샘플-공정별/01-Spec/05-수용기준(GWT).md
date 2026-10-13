# 샘플: 수용기준 GWT (Spec, Bolt 단위)

> Bolt: 주문결제. 각 시나리오는 `04-기능요구(EARS).md`의 REQ ID와 1:1 이상 대응한다.

| ID | 카테고리 | Given | When | Then |
|---|---|---|---|---|
| AC-ORDER-PAY-001 | 정상 | 재고가 충분하고 주문이 TEMP 상태다 | 고객이 결제하기를 클릭하고 PG가 승인한다 | 주문이 PAID로 전환되고 ORDER_PAID 이벤트가 발행된다 |
| AC-ORDER-PAY-002 | 정상 | 주문이 PAID로 전환됐다 | Settlement 도메인이 ORDER_PAID를 구독한다 | 정산 대상 목록에 해당 주문이 포함된다 |
| AC-ORDER-PAY-003 | 경계값 | 재고가 정확히 1개 남아있다 | 동시에 2명이 결제를 시도한다 | 1명만 성공하고 나머지는 "품절" 응답을 받는다 |
| AC-ORDER-PAY-004 | 예외 | 주문이 TEMP 상태다 | PG가 결제 실패를 응답한다 | 재고가 복원되고 주문이 PAYMENT_FAILED로 전환된다 |
| AC-ORDER-PAY-005 | 예외 | 주문이 이미 PAID다 | 동일 주문 결제 API가 재호출된다(중복 클릭) | 409 응답, 재결제 처리 안 됨 |
| AC-ORDER-PAY-006 | 예외(Unwanted) | 재고 선점 요청 중이다 | PG 응답이 5초 이상 지연된다 | 타임아웃 처리 후 자동 재시도 3회, 모두 실패 시 PAYMENT_FAILED |

---
근거: 이 샘플에서 신규 작성(원본 근거 없음 — 확인 필요).
