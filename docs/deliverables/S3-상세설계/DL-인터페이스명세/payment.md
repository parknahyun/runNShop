# 인터페이스 명세 — Payment 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Payment) | **문서종류**: Design
> Order 관련 API는 [DL-인터페이스명세/order.md](order.md) 참조

---

## 12. GET /api/v1/payment-methods — 결제수단 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/payment-methods |
| 인증 | Bearer {memberId} (필수) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": [
    { "methodId": "pm-001", "methodType": "CARD", "displayName": "****-1234", "cardCompany": "신한카드", "isDefault": true }
  ]
}
```

---

## 13. POST /api/v1/payment-methods — 결제수단 등록

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/payment-methods |
| 인증 | Bearer {memberId} (필수) |
| 설명 | PG 토큰 발급 후 저장 (카드번호 서버 미저장) |

#### Request Body

```json
{ "pgBillingKey": "pg-token-abc123", "methodType": "CARD", "displayName": "****-1234", "cardCompany": "신한카드" }
```

#### Response 201

```json
{
  "code": "SUCCESS",
  "data": { "methodId": "pm-002", "displayName": "****-1234" }
}
```

---

## 14. DELETE /api/v1/payment-methods/{methodId} — 결제수단 삭제

| 항목 | 내용 |
|---|---|
| Method | DELETE |
| Path | /api/v1/payment-methods/{methodId} |
| 인증 | Bearer {memberId} (필수) |

#### Response 200

```json
{ "code": "SUCCESS", "data": null }
```

---

## 41. GET /api/v1/members/me/payments — 내 결제 이력 조회

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/members/me/payments |
| 인증 | Bearer {memberId} (필수) |
| Query | `?from=&to=&page=1&size=10&sort=paidAt&direction=desc` |
| 설명 | 본인 결제 건만 최신순으로 반환 (REQ-PAY-020) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "payments": [
      { "paymentId": "pay-001", "platformOrderNo": "ORD-20260626-001", "amount": 152000, "paymentMethod": "신용카드 (****-1234)", "status": "PAID", "paidAt": "2026-06-26 09:14" }
    ],
    "pagination": { "page": 1, "size": 10, "totalCount": 3, "totalPages": 1 }
  }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 401 | UNAUTHORIZED | 인증이 필요합니다 | 토큰 누락/만료 |

---

## 42. GET /api/admin/v1/payments/search — CS 결제 검색

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/admin/v1/payments/search |
| 인증 | Admin Bearer (필수) |
| Query | `?status=ALL&platformOrderNo=&pgTransactionNo=&from=&to=&page=1&size=10&sort=paidAt&direction=desc` |
| 설명 | 상태·기간·주문번호·PG거래번호 필터로 결제 건 검색 (REQ-PAY-021) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "payments": [
      { "paymentId": "pay-001", "platformOrderNo": "ORD-20260626-001", "customerName": "홍*동", "amount": 152000, "pgTransactionNo": "PG-20260626-99001", "status": "PAID", "paidAt": "2026-06-26 09:14" }
    ],
    "pagination": { "page": 1, "size": 10, "totalCount": 1, "totalPages": 1 }
  }
}
```

> `pgTransactionNo`는 `pay_payment_log.pg_transaction_id`에서 조인해 채운다(`pay_payment` 자체 컬럼이 아님).

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | INVALID_DATE_RANGE | 조회 기간이 올바르지 않습니다 (from > to) | from > to |

---

## 43. GET /api/admin/v1/payments/{paymentId}/pg-logs — PG 거래 로그 조회

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/admin/v1/payments/{paymentId}/pg-logs |
| 인증 | Admin Bearer (필수) |
| 설명 | 해당 결제 건의 PG 요청·응답 전체 이력 조회. PII 마스킹 처리 (REQ-PAY-022) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "paymentId": "pay-001",
    "logs": [
      { "at": "2026-06-26 09:14:01", "direction": "REQUEST", "pgTransactionNo": "PG-20260626-99001", "payload": { "cardNo": "****-****-****-1234", "amount": 152000 } },
      { "at": "2026-06-26 09:14:02", "direction": "RESPONSE", "pgTransactionNo": "PG-20260626-99001", "payload": { "resultCode": "0000", "approvalNo": "12345678" } }
    ]
  }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 404 | PAYMENT_NOT_FOUND | 결제 건을 찾을 수 없습니다 | 존재하지 않는 paymentId |

---

