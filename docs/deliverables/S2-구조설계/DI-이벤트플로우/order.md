# 이벤트 플로우 — Order 도메인 (발행 이벤트)

> 상위 문서: [readme.md](readme.md)
> **단계**: 구조설계 | **문서범위**: Domain 간 (Order가 발행하는 이벤트) | **문서종류**: Design
> Payment 발행 이벤트는 [payment.md](payment.md) 참조. Envelope 공통 구조·이벤트 카탈로그(발행/수신 관계)·흐름 다이어그램은 [readme.md](readme.md) 참조

---

## 이벤트 스키마 (Order 발행)

### ORDER_CANCELLED

```json
{
  "eventId": "evt_01HXYZ003",
  "eventType": "ORDER_CANCELLED",
  "eventVersion": 1,
  "occurredAt": "2026-08-11T11:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "vendorId": "vnd_01HXYZ001",
    "cancelReason": "CUSTOMER_REQUEST",
    "totalAmount": 35000,
    "items": [
      { "productId": "prod_01HXYZ001", "skuId": "sku_01HXYZ001", "quantity": 2 }
    ]
  }
}
```

### ORDER_CONFIRMED

```json
{
  "eventId": "evt_01HXYZ004",
  "eventType": "ORDER_CONFIRMED",
  "eventVersion": 1,
  "occurredAt": "2026-08-18T00:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "vendorId": "vnd_01HXYZ001",
    "totalAmount": 35000,
    "confirmedAt": "2026-08-18T00:00:00Z",
    "items": [
      { "productId": "prod_01HXYZ001", "skuId": "sku_01HXYZ001", "quantity": 2, "amount": 35000 }
    ]
  }
}
```

### CLAIM_COMPLETED

```json
{
  "eventId": "evt_01HXYZ005",
  "eventType": "CLAIM_COMPLETED",
  "eventVersion": 1,
  "occurredAt": "2026-08-20T15:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ002",
  "payload": {
    "claimId": "clm_01HXYZ001",
    "orderId": "ord_01HXYZ001",
    "claimType": "RETURN",
    "refundAmount": 17500,
    "items": [
      { "productId": "prod_01HXYZ001", "skuId": "sku_01HXYZ001", "quantity": 1 }
    ]
  }
}
```

### ORDER_PAID

```json
{
  "eventId": "evt_01HXYZ010",
  "eventType": "ORDER_PAID",
  "eventVersion": 1,
  "occurredAt": "2026-08-11T10:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "vendorId": "vnd_01HXYZ001",
    "totalAmount": 418000,
    "paymentMethod": "CARD",
    "paidAt": "2026-08-11T10:00:00Z",
    "items": [
      { "productId": "prod_01HXYZ001", "skuId": "sku_01HXYZ001", "quantity": 1, "amount": 152000 }
    ]
  }
}
```

### STOCK_FAILED

```json
{
  "eventId": "evt_01HXYZ011",
  "eventType": "STOCK_FAILED",
  "eventVersion": 1,
  "occurredAt": "2026-08-11T10:00:05Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "failedItems": [
      { "productId": "prod_01HXYZ001", "skuId": "sku_01HXYZ001", "requestedQuantity": 2, "availableStock": 0 }
    ]
  }
}
```

### SHIPPING_STARTED

```json
{
  "eventId": "evt_01HXYZ012",
  "eventType": "SHIPPING_STARTED",
  "eventVersion": 1,
  "occurredAt": "2026-08-12T10:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "orderId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "vendorId": "vnd_01HXYZ001",
    "carrier": "CJ대한통운",
    "trackingNo": "1234567890",
    "shippedAt": "2026-08-12T10:00:00Z"
  }
}
```

### SHIPMENT_DELIVERED

> v4 (2026-08-24): `DELIVERY_COMPLETED`에서 이름 변경. `ord_shipment`(v6) 도입 이후 실제 트리거는 shipment 상태 전이이므로 `shipmentId`·`shipmentType`·`refType`/`refId`를 추가했다.

```json
{
  "eventId": "evt_01HXYZ013",
  "eventType": "SHIPMENT_DELIVERED",
  "eventVersion": 1,
  "occurredAt": "2026-08-14T14:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ001",
  "payload": {
    "shipmentId": "shp_01HXYZ001",
    "shipmentType": "OUTBOUND",
    "refType": "ORDER",
    "refId": "ord_01HXYZ001",
    "platformOrderId": "pord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "vendorId": "vnd_01HXYZ001",
    "deliveredAt": "2026-08-14T14:00:00Z"
  }
}
```

### CLAIM_PAYMENT_EXPIRED

```json
{
  "eventId": "evt_01HXYZ018",
  "eventType": "CLAIM_PAYMENT_EXPIRED",
  "eventVersion": 1,
  "occurredAt": "2026-08-21T09:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ002",
  "payload": {
    "claimId": "clm_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "paymentType": "PICKUP",
    "amount": 5000,
    "expiredAt": "2026-08-21T09:00:00Z"
  }
}
```

### CLAIM_RECEIVED

```json
{
  "eventId": "evt_01HXYZ014",
  "eventType": "CLAIM_RECEIVED",
  "eventVersion": 1,
  "occurredAt": "2026-08-15T10:30:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ002",
  "payload": {
    "claimId": "clm_01HXYZ001",
    "orderId": "ord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "claimType": "RETURN",
    "reason": "사이즈가 맞지 않습니다",
    "responsibility": "CUSTOMER",
    "items": [
      { "productId": "prod_01HXYZ001", "skuId": "sku_01HXYZ001", "quantity": 1 }
    ]
  }
}
```

### CLAIM_SHIPPING_PAID

```json
{
  "eventId": "evt_01HXYZ015",
  "eventType": "CLAIM_SHIPPING_PAID",
  "eventVersion": 1,
  "occurredAt": "2026-08-15T11:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ002",
  "payload": {
    "claimId": "clm_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "paymentType": "PICKUP",
    "amount": 5000,
    "couponApplied": false,
    "paidAt": "2026-08-15T11:00:00Z"
  }
}
```

### CLAIM_RETURN_SHIPPING_PAID

```json
{
  "eventId": "evt_01HXYZ016",
  "eventType": "CLAIM_RETURN_SHIPPING_PAID",
  "eventVersion": 1,
  "occurredAt": "2026-08-20T09:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ002",
  "payload": {
    "claimId": "clm_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "paymentType": "RETURN",
    "amount": 5000,
    "couponApplied": false,
    "paidAt": "2026-08-20T09:00:00Z"
  }
}
```

### CLAIM_REFUNDED

```json
{
  "eventId": "evt_01HXYZ017",
  "eventType": "CLAIM_REFUNDED",
  "eventVersion": 1,
  "occurredAt": "2026-08-18T15:00:00Z",
  "producer": "order-service",
  "correlationId": "cor_01HXYZ002",
  "payload": {
    "claimId": "clm_01HXYZ001",
    "orderId": "ord_01HXYZ001",
    "memberId": "mbr_01HXYZ001",
    "refundAmount": 169000,
    "refundMethod": "CARD",
    "refundedAt": "2026-08-18T15:00:00Z"
  }
}
```
