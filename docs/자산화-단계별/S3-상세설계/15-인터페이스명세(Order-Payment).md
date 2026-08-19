# 인터페이스 명세 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Spec  
>
> **작성 목적**: GWT(⑬)의 예외를 에러코드로, 세부UC(⑭)의 행위를 endpoint로 변환하여  
> API 계약(요청·응답·에러)을 확정한다. Frontend와 Backend 간의 명시적 계약 문서.
>
> **흐름 내 위치**:
> ```
> ⑬ GWT + ⑭ 세부UC → ⑮ 인터페이스 명세 → ⑯ 시퀀스
> ```

---

## API 목록 요약

| # | Method | Path | 설명 | 채널 |
|---|---|---|---|---|
| 1 | POST | /api/v1/cart/items | 장바구니 담기 | mobile |
| 2 | GET | /api/v1/cart | 장바구니 조회 | mobile |
| 3 | PATCH | /api/v1/cart/items/{cartItemId}/quantity | 수량 변경 | mobile |
| 4 | DELETE | /api/v1/cart/items/{cartItemId} | 장바구니 삭제 | mobile |
| 5 | POST | /api/v1/orders/sheet | 주문서 생성 | mobile |
| 6 | POST | /api/v1/orders/{orderSheetId}/pay | 결제 요청 | mobile |
| 7 | POST | /api/v1/orders/{orderId}/cancel | 고객 주문 취소 | mobile |
| 8 | POST | /api/v1/orders/{orderId}/confirm | 구매확정 | mobile |
| 9 | PUT | /api/v1/orders/{orderId}/shipping-address | 배송지 변경 | mobile |
| 10 | POST | /api/v1/orders/{orderId}/claims | 반품/교환 신청 | mobile |
| 11 | GET | /api/v1/members/me/orders | 내 주문 목록 | mobile |
| 12 | GET | /api/v1/payment-methods | 결제수단 목록 | mobile |
| 13 | POST | /api/v1/payment-methods | 결제수단 등록 | mobile |
| 14 | DELETE | /api/v1/payment-methods/{methodId} | 결제수단 삭제 | mobile |
| 15 | GET | /api/v1/members/me/claims | 내 클레임 목록 | mobile |
| 16 | GET | /api/v1/members/me/claims/{claimId} | 내 클레임 상세 | mobile |
| 17 | GET | /api/v1/members/me/orders/{orderId} | 내 주문 상세 | mobile |
| 18 | POST | /api/v1/claims/{claimId}/shipping-payment | 클레임 배송비 결제 | mobile |
| 19 | PUT | /api/v1/cart/items/{cartItemId}/option | 장바구니 옵션 변경 | mobile |
| 19-1 | GET | /api/v1/orders/{orderSheetId}/coupon-combinations | 쿠폰 조합별 할인 계산 (캐시) | mobile |
| 19-2 | POST | /api/v1/orders/{orderSheetId}/calculate | 쿠폰 확정 재계산 (Phase 2) | mobile |
| 20 | GET | /api/admin/v1/orders | 주문 검색 (어드민) | admin |
| 21 | GET | /api/admin/v1/orders/{orderId} | 주문 상세 | admin |
| 22 | POST | /api/admin/v1/orders/{orderId}/force-cancel | 예외 취소 | admin |
| 23 | GET | /api/admin/v1/claims | 클레임 목록 | admin |
| 24 | POST | /api/admin/v1/claims/{claimId}/start | 클레임 처리 시작 | admin |
| 25 | POST | /api/admin/v1/claims/{claimId}/complete | 클레임 완료 (환불 진행) | admin |
| 26 | POST | /api/admin/v1/claims/{claimId}/reject | 클레임 반려 | admin |
| 27 | POST | /api/admin/v1/claims/{claimId}/refund | 환불 처리 (수동) | admin |
| 28 | POST | /api/admin/v1/claims/{claimId}/dispose | 폐기 처리 | admin |
| 29 | POST | /api/admin/v1/claims/{claimId}/request-return-payment | 반송 배송비 추가결제 요청 | admin |
| 30 | GET | /api/partner/v1/orders | 입점사 주문 목록 | partner |
| 31 | GET | /api/partner/v1/orders/{orderId} | 입점사 주문 상세 | partner |
| 32 | POST | /api/partner/v1/orders/{orderId}/ship | 출고 처리 | partner |
| 33 | GET | /api/partner/v1/shipping | 배송 관리 (출고+회수+재배송 통합) | partner |
| 34 | POST | /api/partner/v1/shipping/{orderId} | 출고/재배송 운송장 등록 | partner |
| 35 | POST | /api/partner/v1/shipping/{claimId}/pickup | 수거 운송장 등록 | partner |
| 36 | POST | /api/partner/v1/claims/{claimId}/pickup-confirm | 입고 확인 → 품질점검 시작 | partner |
| 37 | POST | /api/partner/v1/claims/{claimId}/inspect-pass | 품질점검 합격 (수거완료) | partner |
| 38 | POST | /api/partner/v1/claims/{claimId}/inspect-reject | 품질점검 거부 (수거거부) | partner |
| 39 | POST | /api/partner/v1/claims/{claimId}/return-ship | 반송 운송장 등록 | partner |
| 40 | GET | /api/partner/v1/claims | 클레임 현황 (통합) | partner |

---

## 1. POST /api/v1/cart/items — 장바구니 담기

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/cart/items |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 상품을 장바구니에 추가. 동일 상품+옵션 존재 시 수량 합산 |

#### Request Body

```json
{
  "productId": "prod-001",
  "skuId": "sku-001",
  "quantity": 2
}
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "cartItemId": "cart-001",
    "productId": "prod-001",
    "skuId": "sku-001",
    "quantity": 2,
    "unitPrice": 152000,
    "totalCartCount": 5
  }
}
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | CART_FULL | 장바구니가 가득 찼습니다 (최대 50개) | 50개 초과 | AC-ORD-005 |
| 400 | PRODUCT_NOT_AVAILABLE | 현재 구매할 수 없는 상품입니다 | 품절·판매중지 | AC-ORD-008 |
| 400 | INVALID_QUANTITY | 수량은 1~99 사이여야 합니다 | 수량 범위 초과 | — |
| 401 | UNAUTHORIZED | 로그인이 필요합니다 | 토큰 없음/만료 | — |

---

## 2. GET /api/v1/cart — 장바구니 조회

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/cart |
| 인증 | Bearer {memberId} (필수) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "total_count": 3,
    "vendors": [
      {
        "vendor_id": 10,
        "vendor_name": "나이키코리아",
        "shipping_fee": 3000,
        "free_threshold": 50000,
        "items": [
          {
            "cart_item_id": 1,
            "product_id": 101,
            "product_name": "나이키 페가수스 41",
            "image_url": "https://...",
            "color": "블랙",
            "size": "265",
            "price_original": 179000,
            "price_sale": 152000,
            "quantity": 1,
            "stock": 7,
            "status": "ON_SALE"
          }
        ]
      }
    ],
    "summary": {
      "total_product_price": 469000,
      "total_discount": -48000,
      "cart_discount": -3000,
      "total_shipping_fee": 0,
      "total_payment": 418000,
      "point_balance": 5200,
      "coupon_benefit_text": "사용 가능 쿠폰 2장"
    }
  }
}
```

---

## 3. PATCH /api/v1/cart/items/{cartItemId}/quantity — 수량 변경

| 항목 | 내용 |
|---|---|
| Method | PATCH |
| Path | /api/v1/cart/items/{cartItemId}/quantity |
| 인증 | Bearer {memberId} (필수) |

#### Request Body

```json
{ "quantity": 3 }
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": { "cartItemId": "cart-001", "quantity": 3, "subtotal": 456000 }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | INVALID_QUANTITY | 수량은 1~99 사이여야 합니다 | 범위 초과 |
| 400 | EXCEED_STOCK | 재고 수량을 초과합니다 | 재고 부족 |
| 404 | CART_ITEM_NOT_FOUND | 장바구니 항목을 찾을 수 없습니다 | 존재하지 않는 ID |

---

## 4. DELETE /api/v1/cart/items/{cartItemId} — 장바구니 삭제

| 항목 | 내용 |
|---|---|
| Method | DELETE |
| Path | /api/v1/cart/items/{cartItemId} |
| 인증 | Bearer {memberId} (필수) |

#### Response 200

```json
{ "code": "SUCCESS", "data": null }
```

---

## 5. POST /api/v1/orders/sheet — 주문서 생성

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/orders/sheet |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 장바구니 선택 상품으로 주문서 생성. 배송지·쿠폰·포인트·결제수단 정보 반환 |

#### Request Body

```json
{ "cartItemIds": [1, 2, 3] }
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "order_sheet_id": "OS-20260626-001",
    "orderer": { "name": "홍길동", "phone": "010-****-5678", "email": "runner@runNshop.com" },
    "addresses": [ { "address_id": 1, "recipient": "홍길동", "phone": "010-****-5678", "zip_code": "06234", "address": "서울특별시 강남구 테헤란로 123", "address_detail": "런앤샵타워 5층", "is_default": true } ],
    "orders": [ { "vendor_id": 10, "vendor_name": "나이키코리아", "items": [...] } ],
    "coupons": { "available_count": 2, "items": [...] },
    "point": { "balance": 5200, "usable": 5200, "min_use": 1000 },
    "payment_methods": [ { "type": "CARD", "label": "신용카드" } ],
    "price_summary": { "total_product_price": 469000, "product_discount": -48000, "cart_discount": -3000, "coupon_discount": 0, "point_used": 0, "shipping_fee": 0, "total_payment": 418000 },
    "terms": [ { "term_id": "T001", "title": "구매조건 확인 및 결제 진행에 동의", "required": true } ]
  }
}
```

---

## 6. POST /api/v1/orders/{orderSheetId}/pay — 결제 요청

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/orders/{orderSheetId}/pay |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 주문서 기반 결제 실행. 재고 선점 → PG 결제 승인 → 주문 확정 |

#### Request Body

```json
{
  "addressId": 1,
  "couponId": "CPN-001",
  "pointUsed": 3000,
  "paymentMethodType": "CARD",
  "termsAgreed": ["T001", "T002", "T003"]
}
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "platformOrderId": "pord-ulid-001",
    "totalPayment": 415000,
    "paidAt": "2026-06-26T09:15:00Z"
  }
}
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | ADDRESS_REQUIRED | 배송지를 입력해주세요 | 배송지 미선택 | AC-ORD-012 |
| 400 | TERMS_NOT_AGREED | 필수 약관에 동의해주세요 | 필수 약관 미동의 | — |
| 400 | STOCK_NOT_AVAILABLE | 재고가 부족합니다 | 재고 선점 실패 | — |
| 400 | PAYMENT_FAILED | 결제에 실패했습니다 | PG 승인 실패 (3회 재시도 후) | AC-PAY-006 |
| 408 | PAYMENT_TIMEOUT | 결제 처리 시간이 초과되었습니다 | PG 타임아웃 | AC-PAY-007 |

---

## 7. POST /api/v1/orders/{orderId}/cancel — 고객 주문 취소

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/orders/{orderId}/cancel |
| 인증 | Bearer {memberId} (필수) |

#### Request Body

```json
{ "cancelReason": "CUSTOMER_REQUEST" }
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": { "orderId": "ord-001", "status": "CANCELLED", "refundAmount": 152000 }
}
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | CANCEL_NOT_ALLOWED | 출고 준비 중에는 취소할 수 없습니다. 반품 신청을 이용해주세요 | PREPARING 이후 상태 | AC-ORD-018 |
| 403 | FORBIDDEN | 본인 주문만 취소할 수 있습니다 | 타인 주문 | — |

---

## 8. POST /api/v1/orders/{orderId}/confirm — 구매확정

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/orders/{orderId}/confirm |
| 인증 | Bearer {memberId} (필수) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": { "orderId": "ord-001", "status": "CONFIRMED", "pointEarned": 1520 }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | CONFIRM_NOT_ALLOWED | 배송완료 상태에서만 구매확정이 가능합니다 | DELIVERED 아닌 상태 |

---

## 9. PUT /api/v1/orders/{orderId}/shipping-address — 배송지 변경

| 항목 | 내용 |
|---|---|
| Method | PUT |
| Path | /api/v1/orders/{orderId}/shipping-address |
| 인증 | Bearer {memberId} (필수) |

#### Request Body

```json
{
  "recipientName": "홍길동",
  "phone": "010-1234-5678",
  "zipCode": "06234",
  "address": "서울특별시 강남구 테헤란로 123",
  "addressDetail": "런앤샵타워 5층"
}
```

#### Response 200

```json
{ "code": "SUCCESS", "data": null }
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | ADDRESS_CHANGE_NOT_ALLOWED | 출고 후에는 변경할 수 없습니다 | PREPARING 이후 | AC-ORD-025 |

---

## 10. POST /api/v1/orders/{orderId}/claims — 반품/교환 신청

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/orders/{orderId}/claims |
| 인증 | Bearer {memberId} (필수) |

#### Request Body

```json
{
  "claimType": "RETURN",
  "reason": "단순 변심",
  "detailReason": "사이즈가 맞지 않습니다"
}
```

#### Response 201

```json
{
  "code": "SUCCESS",
  "data": { "claimId": "clm-001", "claimType": "RETURN", "status": "RECEIVED" }
}
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | CLAIM_PERIOD_EXPIRED | 기한이 초과되었습니다 (배송완료 후 10일 이내) | 10일 초과 | AC-ORD-032 |
| 400 | CLAIM_NOT_ALLOWED | 배송완료 후에만 신청할 수 있습니다 | DELIVERED 아닌 상태 | — |

---

## 11. GET /api/v1/members/me/orders — 내 주문 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/members/me/orders |
| 인증 | Bearer {memberId} (필수) |
| Query | `?page=1&size=10&status=ALL` |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 5,
    "orders": [
      { "orderId": "ord-001", "platformOrderNo": "ORD-20260626-001", "productName": "나이키 페가수스 41", "status": "DELIVERED", "amount": 152000, "orderDate": "2026-06-26" }
    ]
  }
}
```

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

## 15. GET /api/admin/v1/orders — 주문 검색 (어드민)

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/admin/v1/orders |
| 인증 | Admin Bearer (필수) |
| Query | `?keyword=&status=ALL&from=2026-06-01&to=2026-06-30&page=1&size=10` |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 12,
    "orders": [
      { "orderId": "ord-001", "platformOrderNo": "ORD-20260626-001", "productName": "나이키 페가수스 41", "customer": "홍*동", "vendorName": "나이키코리아", "status": "PAYMENT_COMPLETED", "amount": 152000, "orderDate": "2026-06-26 09:15" }
    ]
  }
}
```

---

## 16. GET /api/admin/v1/orders/{orderId} — 주문 상세

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/admin/v1/orders/{orderId} |
| 인증 | Admin Bearer (필수) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "orderId": "ord-001",
    "platformOrderNo": "ORD-20260626-001",
    "status": "PAYMENT_COMPLETED",
    "customer": "홍*동",
    "vendorName": "나이키코리아",
    "amount": 152000,
    "orderDate": "2026-06-26 09:15",
    "items": [ { "productName": "나이키 페가수스 41", "optionName": "블랙/265", "quantity": 1, "unitPrice": 152000, "subtotal": 152000 } ],
    "payment": { "method": "신용카드", "pgProvider": "토스페이먼츠", "transactionId": "TXN-001", "paidAt": "2026-06-26 09:15" },
    "shipping": { "recipientName": "홍*동", "phone": "010-****-5678", "address": "[06234] 서울 강남구 테헤란로 123", "carrier": "CJ대한통운", "trackingNumber": "1234567890" },
    "history": [ { "fromStatus": "PROCESSING", "toStatus": "PAYMENT_COMPLETED", "changedBy": "SYSTEM", "createdAt": "2026-06-26 09:15" } ]
  }
}
```

---

## 17. POST /api/admin/v1/orders/{orderId}/force-cancel — 예외 취소

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/orders/{orderId}/force-cancel |
| 인증 | Admin Bearer (필수) |

#### Request Body

```json
{ "reason": "고객 CS 요청에 의한 예외 취소" }
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": { "orderId": "ord-001", "status": "CANCELLED", "refundAmount": 152000 }
}
```

---

## 18. GET /api/admin/v1/claims — 클레임 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/admin/v1/claims |
| 인증 | Admin Bearer (필수) |
| Query | `?keyword=&claimType=ALL&status=ALL&blameType=ALL&from=&to=&page=1&size=10` |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 8,
    "claims": [
      { "claimId": "clm-001", "claimNo": "CLM-20260626-001", "platformOrderNo": "ORD-20260626-001", "claimType": "RETURN", "status": "RECEIVED", "blameType": "CUSTOMER", "channel": "SELF", "refundAmount": 152000, "createdAt": "2026-06-26 10:30", "completedAt": null }
    ]
  }
}
```

---

## 19. POST /api/admin/v1/claims/{claimId}/start — 클레임 처리 시작

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/start |
| 인증 | Admin Bearer (필수) |

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "IN_PROGRESS" } }
```

---

## 20. POST /api/admin/v1/claims/{claimId}/complete — 클레임 완료

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/complete |
| 인증 | Admin Bearer (필수) |

#### Request Body

```json
{ "memo": "수거 확인 완료. 환불 처리 진행" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "COMPLETED" } }
```

---

## 21. POST /api/admin/v1/claims/{claimId}/reject — 클레임 반려

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/reject |
| 인증 | Admin Bearer (필수) |

#### Request Body

```json
{ "rejectReason": "고객 귀책 사유에 해당하지 않음" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "REJECTED" } }
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | REASON_REQUIRED | 반려 사유를 입력해주세요 | 사유 누락 |

---

## 22. GET /api/partner/v1/orders — 입점사 주문 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/partner/v1/orders |
| 인증 | Partner Bearer (필수) |
| Query | `?status=ALL&from=&to=&keyword=&page=1&size=10` |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 10,
    "orders": [
      { "orderId": "ord-001", "platformOrderNo": "ORD-20260626-001", "productName": "나이키 페가수스 41", "customerName": "홍*동", "quantity": 1, "amount": 152000, "status": "PAYMENT_COMPLETED", "orderDate": "2026-06-26" }
    ]
  }
}
```

---

## 23. GET /api/partner/v1/orders/{orderId} — 입점사 주문 상세

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/partner/v1/orders/{orderId} |
| 인증 | Partner Bearer (필수) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "orderId": "ord-001",
    "platformOrderNo": "ORD-20260626-001",
    "status": "PAYMENT_COMPLETED",
    "productName": "나이키 페가수스 41",
    "customerName": "홍*동",
    "quantity": 1,
    "amount": 152000,
    "orderDate": "2026-06-26",
    "history": [ { "at": "2026-06-26 09:15", "action": "주문 접수", "memo": "결제 완료" } ]
  }
}
```

---

## 24. POST /api/partner/v1/orders/{orderId}/ship — 출고 처리

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/orders/{orderId}/ship |
| 인증 | Partner Bearer (필수) |

#### Response 200

```json
{ "code": "SUCCESS", "data": { "orderId": "ord-001", "status": "PREPARING" } }
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | SHIP_NOT_ALLOWED | 결제완료 상태에서만 출고 처리할 수 있습니다 | PAYMENT_COMPLETED 아닌 상태 |

---

## 25. GET /api/partner/v1/shipping — 배송 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/partner/v1/shipping |
| 인증 | Partner Bearer (필수) |
| Query | `?status=ALL&keyword=&page=1&size=10` |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 5,
    "items": [
      { "orderId": "ord-001", "platformOrderNo": "ORD-20260626-001", "productName": "나이키 페가수스 41", "customerName": "홍*동", "status": "PREPARING", "deliveryCompany": null, "trackingNo": null, "shippedAt": null }
    ]
  }
}
```

---

## 26. POST /api/partner/v1/shipping/{orderId} — 운송장 등록

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/shipping/{orderId} |
| 인증 | Partner Bearer (필수) |

#### Request Body

```json
{ "deliveryCompany": "CJ대한통운", "trackingNo": "1234567890" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "orderId": "ord-001", "status": "IN_DELIVERY", "shippedAt": "2026-06-27 10:00" } }
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | TRACKING_NO_REQUIRED | 운송장번호를 입력해주세요 | 번호 누락 |

---

## 27. POST /api/partner/v1/claims/{claimId}/pickup-confirm — 입고 확인

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/claims/{claimId}/pickup-confirm |
| 인증 | Partner Bearer (필수) |

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "pickupConfirmedAt": "2026-06-30 14:00" } }
```

---

## 30. GET /api/v1/members/me/orders/{orderId} — 내 주문 상세

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/members/me/orders/{orderId} |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 본인 주문 상세 (입점사별 상품, 결제정보, 배송정보, 주문이력) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "orderId": "ord-001",
    "platformOrderNo": "ORD-20260626-001",
    "status": "DELIVERED",
    "orderDate": "2026-06-26 09:15",
    "orders": [
      {
        "vendorName": "나이키코리아",
        "vendorStatus": "DELIVERED",
        "items": [
          { "productName": "나이키 페가수스 41", "optionName": "블랙/265", "orderQuantity": 1, "claimInProgress": 0, "claimCompleted": 0, "amount": 152000 }
        ]
      }
    ],
    "payment": { "totalProductPrice": 469000, "productDiscount": -48000, "cartDiscount": -3000, "shippingFee": 0, "totalPayment": 418000, "method": "신용카드 (****-1234)", "paidAt": "2026-06-26 09:15" },
    "shipping": { "recipientName": "홍*동", "phone": "010-****-5678", "address": "[06234] 서울 강남구 테헤란로 123 런앤샵타워 5층", "memo": "부재 시 문 앞에" },
    "history": [ { "at": "2026-06-26 09:15", "event": "주문 접수" }, { "at": "2026-06-26 09:15", "event": "결제 완료" } ]
  }
}
```

---

## 31. POST /api/v1/claims/{claimId}/shipping-payment — 클레임 배송비 결제

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/claims/{claimId}/shipping-payment |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 클레임 수거/반송 배송비 결제. PG SDK 인증 후 서버 확인. 쿠폰 적용 가능 |

#### Request Body

```json
{
  "paymentType": "PICKUP",
  "paymentMethodId": "pm-001",
  "couponId": "CPN-003",
  "amount": 5000
}
```

> paymentType: `PICKUP`(수거 배송비) 또는 `RETURN`(반송 배송비)

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": { "claimId": "clm-001", "paymentType": "PICKUP", "paidAmount": 0, "couponApplied": true, "status": "PICKUP" }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | PAYMENT_EXPIRED | 결제 기한이 초과되었습니다 | 24시간 초과 → 자동취소 |
| 400 | PAYMENT_FAILED | 결제에 실패했습니다 | PG 승인 실패 |
| 404 | CLAIM_NOT_FOUND | 클레임을 찾을 수 없습니다 | 존재하지 않는 클레임 |

---

## 32. PUT /api/v1/cart/items/{cartItemId}/option — 장바구니 옵션 변경

| 항목 | 내용 |
|---|---|
| Method | PUT |
| Path | /api/v1/cart/items/{cartItemId}/option |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 장바구니 상품의 옵션(색상/사이즈) 변경. 품절 = 실재고 − 장바구니 선점수량 ≤ 0 |

#### Request Body

```json
{ "skuId": "sku-002" }
```

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": { "cartItemId": "cart-001", "skuId": "sku-002", "color": "화이트", "size": "265", "stock": 5 }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | OPTION_SOLD_OUT | 해당 옵션은 품절입니다 | 잔여수량 ≤ 0 |
| 404 | CART_ITEM_NOT_FOUND | 장바구니 항목을 찾을 수 없습니다 | 존재하지 않는 ID |

---

## 32-1. GET /api/v1/orders/{orderSheetId}/coupon-combinations — 쿠폰 조합별 할인 계산

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/orders/{orderSheetId}/coupon-combinations |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 쿠폰 팝업 진입 시 호출. 적용 가능한 모든 쿠폰 조합별 할인 결과를 미리 계산하여 반환 (FE 캐시용). 가장 유리한 조합을 `recommended`로 표시 |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "currentDiscount": {
      "productDiscountType": "INSTANT",
      "productDiscount": -48000,
      "cartDiscountType": "CONDITION",
      "cartDiscount": -3000
    },
    "recommended": {
      "productCouponId": "CPN-002",
      "cartCouponId": "CPN-003",
      "shippingCouponId": null,
      "totalPayment": 401300
    },
    "productCoupons": [
      { "couponId": "CPN-001", "name": "신규회원 10%", "discount": -41800, "diff": +6200, "favorable": false },
      { "couponId": "CPN-002", "name": "VIP 15%", "discount": -62700, "diff": -14700, "favorable": true }
    ],
    "cartCoupons": [
      { "couponId": "CPN-003", "name": "여름 러닝 5,000원", "discount": -5000, "diff": -2000, "favorable": true }
    ],
    "shippingCoupons": [
      { "couponId": "CPN-004", "name": "무료배송", "discount": -3000 }
    ],
    "combinations": [
      { "productCouponId": null, "cartCouponId": null, "shippingCouponId": null, "productDiscount": -48000, "cartDiscount": -3000, "shippingDiscount": 0, "totalPayment": 418000 },
      { "productCouponId": "CPN-002", "cartCouponId": "CPN-003", "shippingCouponId": null, "productDiscount": -62700, "cartDiscount": -5000, "shippingDiscount": 0, "totalPayment": 401300 }
    ]
  }
}
```

> `diff`: 현재 할인 대비 차이 (음수 = 추가 할인, 양수 = 할인 감소)
> `favorable`: true면 현재보다 유리
> `recommended`: 가장 유리한 조합 (FE에서 기본 선택 상태로 표시)

---

## 32-2. POST /api/v1/orders/{orderSheetId}/calculate — 쿠폰 확정 재계산 (Phase 2)

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/orders/{orderSheetId}/calculate |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 쿠폰 팝업 [적용하기] 클릭 시 호출. 선택된 쿠폰 조합으로 서버 재계산 (정합성 검증 + 최종 금액 확정) |

#### Request Body

```json
{
  "productCouponId": "CPN-002",
  "cartCouponId": "CPN-003",
  "shippingCouponId": null,
  "pointUsed": 3000
}
```

> couponId가 null이면 기본 할인(즉시/조건) 유지

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "productDiscountType": "COUPON",
    "productDiscount": -62700,
    "cartDiscountType": "COUPON",
    "cartDiscount": -5000,
    "shippingDiscount": 0,
    "pointDiscount": -3000,
    "totalPayment": 398300
  }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | COUPON_EXPIRED | 쿠폰이 만료되었습니다 | 팝업 열린 동안 쿠폰 만료 |
| 400 | COUPON_NOT_APPLICABLE | 적용 조건을 충족하지 않습니다 | 최소주문금액 미달 등 |
| 400 | POINT_EXCEED | 사용 가능 포인트를 초과했습니다 | 잔액 부족 |

---

## 33. POST /api/admin/v1/claims/{claimId}/refund — 환불 처리 (수동)

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/refund |
| 인증 | Admin Bearer (필수) |
| 설명 | 품질점검 합격 후 환불 처리. 원결제수단 또는 계좌이체(수동) |

#### Request Body

```json
{
  "refundMethod": "ORIGINAL",
  "bankAccount": null
}
```

> refundMethod: `ORIGINAL`(원결제수단) 또는 `BANK_TRANSFER`(계좌이체)
> bankAccount: refundMethod가 BANK_TRANSFER일 때 필수 `{ "bankName": "국민은행", "accountNo": "123-456-789", "holderName": "홍길동" }`

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "REFUNDED", "refundAmount": 169000 } }
```

---

## 34. POST /api/admin/v1/claims/{claimId}/dispose — 폐기 처리

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/dispose |
| 인증 | Admin Bearer (필수) |
| 설명 | 수거거부(PICKUP_REJECTED) 건에 대해 폐기 결정 |

#### Request Body

```json
{ "reason": "상품 심각 훼손으로 반송 불가" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "DISPOSED" } }
```

---

## 35. POST /api/admin/v1/claims/{claimId}/request-return-payment — 반송 배송비 추가결제 요청

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/request-return-payment |
| 인증 | Admin Bearer (필수) |
| 설명 | 수거거부 건에 대해 고객에게 반송 배송비 추가결제 요청. 고객 알림톡 발송 |

#### Request Body

```json
{ "returnShippingFee": 5000 }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "PAYMENT_PENDING", "paymentType": "RETURN" } }
```

---

## 36. POST /api/partner/v1/shipping/{claimId}/pickup — 수거 운송장 등록

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/shipping/{claimId}/pickup |
| 인증 | Partner Bearer (필수) |
| 설명 | 클레임 수거를 위한 택배사 + 운송장 등록 |

#### Request Body

```json
{ "deliveryCompany": "CJ대한통운", "trackingNo": "9876543210" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "PICKUP", "shippedAt": "2026-06-29 09:00" } }
```

---

## 37. POST /api/partner/v1/claims/{claimId}/inspect-pass — 품질점검 합격

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/claims/{claimId}/inspect-pass |
| 인증 | Partner Bearer (필수) |
| 설명 | 품질점검 합격 처리. 상태 → PICKED_UP(수거완료) |

#### Request Body

```json
{ "memo": "상품 상태 양호. 환불 가능" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "PICKED_UP" } }
```

---

## 38. POST /api/partner/v1/claims/{claimId}/inspect-reject — 품질점검 거부

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/claims/{claimId}/inspect-reject |
| 인증 | Partner Bearer (필수) |
| 설명 | 품질점검 불합격. 상태 → PICKUP_REJECTED(수거거부). 사유 필수 |

#### Request Body

```json
{ "rejectReason": "상품 택 제거 및 사용 흔적으로 반품 불가" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "PICKUP_REJECTED" } }
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | REASON_REQUIRED | 거부 사유를 입력해주세요 | 사유 누락 |

---

## 39. POST /api/partner/v1/claims/{claimId}/return-ship — 반송 운송장 등록

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/claims/{claimId}/return-ship |
| 인증 | Partner Bearer (필수) |
| 설명 | 수거거부 후 반송 배송비 결제 완료된 건에 대해 반송 운송장 등록 |

#### Request Body

```json
{ "deliveryCompany": "CJ대한통운", "trackingNo": "1111222233" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "RETURN_SHIPPING" } }
```

---

## 40. GET /api/partner/v1/claims — 클레임 현황 (통합)

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/partner/v1/claims |
| 인증 | Partner Bearer (필수) |
| Query | `?claimType=ALL&status=ALL&from=&to=&keyword=&page=1&size=10` |
| 설명 | 취소/반품/교환 통합 목록. 입점사 자기 건만 반환 |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 8,
    "claims": [
      { "claimId": "clm-001", "claimNo": "CLM-20260628-001", "platformOrderNo": "ORD-20260622-008", "claimType": "RETURN", "productName": "호카 클리프턴 9", "customerName": "이*미", "status": "PICKUP", "shippingFee": 5000, "shippingFeeStatus": "PAID", "createdAt": "2026-06-28" }
    ]
  }
}
```

---

## 근거

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/members/me/claims |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 본인이 접수한 클레임(취소/반품/교환) 목록을 최신순으로 반환 |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 3,
    "claims": [
      {
        "claimId": "clm-001",
        "claimNo": "CLM-20260628-001",
        "claimType": "RETURN",
        "claimTypeLabel": "반품",
        "status": "IN_PROGRESS",
        "statusLabel": "처리중",
        "orderId": "ord-003",
        "platformOrderNo": "ORD-20260622-008",
        "productName": "호카 클리프턴 9",
        "imageUrl": "https://placehold.co/80x80/f5f5f5/333?text=Clifton9",
        "optionName": "오렌지 / 275",
        "quantity": 1,
        "refundAmount": 169000,
        "reason": "사이즈가 맞지 않습니다",
        "createdAt": "2026-06-28",
        "updatedAt": "2026-06-29"
      }
    ]
  }
}
```

---

## 29. GET /api/v1/members/me/claims/{claimId} — 내 클레임 상세

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/members/me/claims/{claimId} |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 클레임 상세 정보 (상품정보, 사유, 수거정보, 환불정보, 처리 타임라인) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "claimId": "clm-001",
    "claimNo": "CLM-20260628-001",
    "claimType": "RETURN",
    "claimTypeLabel": "반품",
    "status": "IN_PROGRESS",
    "statusLabel": "처리중",
    "orderId": "ord-003",
    "platformOrderNo": "ORD-20260622-008",
    "productName": "호카 클리프턴 9",
    "imageUrl": "https://...",
    "optionName": "오렌지 / 275",
    "quantity": 1,
    "amount": 169000,
    "refundAmount": 169000,
    "reason": "사이즈가 맞지 않습니다",
    "detailReason": "정사이즈보다 작게 나와서 반품으로 변경했습니다.",
    "responsibility": "CUSTOMER",
    "responsibilityLabel": "구매자 귀책",
    "returnShippingFee": 5000,
    "createdAt": "2026-06-28 10:30",
    "pickup": {
      "carrier": "CJ대한통운",
      "trackingNo": "9876543210",
      "status": "수거중",
      "requestedAt": "2026-06-29 09:00"
    },
    "refund": {
      "method": "신용카드 (****-1234)",
      "status": "환불 대기",
      "expectedAt": "수거 확인 후 3~5영업일"
    },
    "timeline": [
      { "at": "2026-06-28 10:30", "event": "반품 신청", "description": "고객이 반품을 접수했습니다." },
      { "at": "2026-06-28 14:00", "event": "접수 확인", "description": "CS 담당자가 접수를 확인했습니다." },
      { "at": "2026-06-29 09:00", "event": "수거 요청", "description": "CJ대한통운 수거가 요청되었습니다." }
    ]
  }
}
```

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 404 | CLAIM_NOT_FOUND | 클레임을 찾을 수 없습니다 | 존재하지 않거나 타인 클레임 |

---

## admin/partner 주문상세 탭별 Sub-API 정책

> admin 주문상세(§11 InnerTabs) 및 partner 주문상세(§13)에서 사용하는 탭별 데이터는 **단일 상세 API 응답에 모두 포함**하여 반환한다.
> 별도 sub-API 호출 없이 프론트에서 탭 전환 시 캐싱된 데이터를 표시한다.
>
> | API | 응답 포함 데이터 |
> |---|---|
> | `GET /api/admin/v1/orders/{orderId}` | `items[]`(주문상품), `payment`(결제정보), `shipping`(배송정보), `claims[]`(CS·클레임), `inquiries[]`(주문문의), `history[]`(변경이력) |
> | `GET /api/partner/v1/orders/{orderId}` | `items[]`(주문상품), `shipping`(배송정보), `claims[]`(클레임), `history[]`(변경이력) |

---

## 근거

| 항목 | 출처 |
|---|---|
| Endpoint 도출 | 세부 유스케이스(⑭) API 호출 행위 |
| 에러코드 도출 | GWT(⑬) 예외 시나리오 Then절 |
| Path Prefix | 컴포넌트(③) 인증 규칙: v1(고객), admin/v1(관리자), partner/v1(입점사) |
| 응답 구조 | 코딩 표준 `{ "code": "SUCCESS", "data": {...} }` |
| 응답 필드 | 화면 레이아웃(⑰) + mock JSON 데이터 |
