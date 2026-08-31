# 이벤트 플로우 — Payment 도메인 (발행 이벤트)

> 상위 문서: [readme.md](readme.md)
> **단계**: 구조설계 | **문서범위**: Domain 간 (Payment가 발행하는 이벤트) | **문서종류**: Design
> Order 발행 이벤트는 [order.md](order.md) 참조. Envelope 공통 구조·이벤트 카탈로그(발행/수신 관계)·흐름 다이어그램은 [readme.md](readme.md) 참조

---

## 이벤트 스키마 (Payment 발행)

### PAYMENT_APPROVED

```json
{
  "eventId": "evt_01HXYZ001",
  "eventType": "PAYMENT_APPROVED",
  "eventVersion": 1,
  "occurredAt": "2026-08-11T10:00:00Z",
  "producer": "payment-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "paymentId": "pay_01HXYZ001",
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "amount": 35000,
    "paymentMethod": "CARD",
    "pgTransactionId": "toss-tx-12345",
    "approvedAt": "2026-08-11T10:00:00Z"
  }
}
```

### PAYMENT_FAILED

```json
{
  "eventId": "evt_01HXYZ002",
  "eventType": "PAYMENT_FAILED",
  "eventVersion": 1,
  "occurredAt": "2026-08-11T10:00:30Z",
  "producer": "payment-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "paymentId": "pay_01HXYZ001",
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "amount": 35000,
    "failReason": "CARD_DECLINED",
    "retryCount": 3
  }
}
```
