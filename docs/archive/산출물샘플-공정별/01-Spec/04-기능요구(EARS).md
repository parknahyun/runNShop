# 샘플: 기능요구사항 EARS (Spec, Bolt 단위)

> Bolt: 주문결제.

```
REQ-ORDER-PAY-001 [Event-driven]
WHEN 고객이 주문서에서 "결제하기" 버튼을 클릭하면,
THE 시스템은 SHALL 재고를 선점하고 PG 결제 요청을 생성한다.

REQ-ORDER-PAY-002 [Event-driven]
WHEN PG로부터 결제 승인 응답을 수신하면,
THE 시스템은 SHALL 주문 상태를 TEMP에서 PAID로 전환하고 ORDER_PAID 이벤트를 발행한다.

REQ-ORDER-PAY-003 [Unwanted]
WHEN PG로부터 결제 실패 또는 타임아웃 응답을 수신하면,
THE 시스템은 SHALL 선점된 재고를 즉시 복원하고 주문을 PAYMENT_FAILED로 전환한다.

REQ-ORDER-PAY-004 [State-driven]
WHILE 주문이 이미 PAID 상태인 동안,
THE 시스템은 SHALL 동일 주문에 대한 중복 결제 요청을 거부한다(멱등성).

REQ-ORDER-PAY-005 [Ubiquitous]
THE 시스템은 SHALL 결제수단 원본 정보(카드번호 등)를 저장하지 않고 PG 토큰만 저장한다.
```

---
근거: 이 샘플에서 신규 작성(원본 근거 없음 — 확인 필요). REQ-ORDER-PAY-005는 `01-Spec/02-제약사항.md` CON-PAY-002와 연동.
