# 인터페이스 명세 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Spec  
>
> **작성 목적**: GWT(DJ)의 예외를 에러코드로, 세부UC(DK)의 행위를 endpoint로 변환하여  
> API 계약(요청·응답·에러)을 확정한다. Frontend와 Backend 간의 명시적 계약 문서.
>
> **흐름 내 위치**:
> ```
> DJ GWT + DK 세부UC → DL 인터페이스 명세 → DM 시퀀스
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
| 10-1 | POST | /api/v1/claims/{claimId}/cancel | 클레임 자진 취소 (본문 §10-1, 시퀀스 §7-2) | mobile |
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
| 24-1 | POST | /api/admin/v1/claims/{claimId}/blame-decision | 귀책 판정 (API-026, 본문 §19-1) | admin |
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
| 39-1 | POST | /api/partner/v1/claims/{claimId}/exchange-ship | 교환상품 선출고 운송장 등록 | partner |
| 39-2 | POST | /api/admin/v1/claims/{claimId}/return-delivered | 반송 배송완료 확인 (택배사 콜백/배치) | admin |
| 40 | GET | /api/partner/v1/claims | 클레임 현황 (통합) | partner |
| 41 | GET | /api/v1/members/me/payments | 내 결제 이력 조회 | mobile |
| 42 | GET | /api/admin/v1/payments/search | CS 결제 검색 | admin |
| 43 | GET | /api/admin/v1/payments/{paymentId}/pg-logs | PG 거래 로그 조회 | admin |
| 44 | POST | /api/partner/v1/shipping/{shipmentId}/reship | 배송 실패 재발송 처리 | partner/admin |

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
| 설명 | 배송지·약관 검증 → 주문 생성(ORDER_RECEIVED) → Catalog 재고 선점(동기, 성공 시 PAYMENT_PENDING) → Payment에 결제 요청 전달(동기 호출이나 PG 승인 자체는 기다리지 않고 "접수됨"만 확인) 까지 처리 후 즉시 200 응답한다. **PG 승인 성공/실패 결과는 이 응답에 포함되지 않는다** — 이후 Payment가 비동기로 발행하는 PAYMENT_APPROVED/PAYMENT_FAILED 이벤트를 Order가 소비해 주문 상태를 PAYMENT_COMPLETED 또는 PAYMENT_FAILED로 확정한다(REQ-ORD-012~014, 시퀀스 §4/§16 참조). |

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
    "orderId": "ord-001",
    "totalPayment": 415000,
    "status": "PAYMENT_PENDING",
    "message": "결제 진행중입니다"
  }
}
```

> 이 응답은 PG 승인 완료를 의미하지 않는다. 최종 결제 성공/실패는 클라이언트가 주문 상세(#17 `GET /api/v1/members/me/orders/{orderId}`) 조회 또는 푸시 알림으로 확인한다(status가 `PAYMENT_COMPLETED`/`PAYMENT_FAILED`로 갱신됨).

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | ADDRESS_REQUIRED | 배송지를 입력해주세요 | 배송지 미선택 | AC-ORD-012 |
| 400 | TERMS_NOT_AGREED | 필수 약관에 동의해주세요 | 필수 약관 미동의 | — |
| 400 | STOCK_NOT_AVAILABLE | 재고가 부족합니다 | 재고 선점 실패 | — |
| 400 | CARD_RESTRICTED | 카드가 당일 결제 제한 상태입니다 | 동일 카드 3회 연속 결제 실패로 당일 차단됨 (Payment가 접수 단계에서 동기 반환) | REQ-PAY-018(제한 규칙), REQ-PAY-023(카운터 저장·리셋 메커니즘) |

> PG 승인 실패(`PAYMENT_FAILED`)·타임아웃은 이 API의 동기 에러가 아니다. 재고 선점 성공 후에는 Payment 결제 요청 접수(큐 등록)까지만 동기로 확인하며, PG 승인 결과는 §16(컨슈머)에서 비동기로 반영된다.

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
  "detailReason": "사이즈가 맞지 않습니다",
  "responsibility": "CUSTOMER",
  "images": []
}
```

> `claimType=EXCHANGE` 예시 — 교환 대상 SKU(`exchangeSkuId`)를 함께 전달한다.

```json
{
  "claimType": "EXCHANGE",
  "reason": "사이즈 교환",
  "detailReason": "270 사이즈로 교환 원합니다",
  "exchangeSkuId": "sku-002",
  "responsibility": "CUSTOMER",
  "images": []
}
```

> `exchangeSkuId`: 교환 대상 SKU ID. `claimType=EXCHANGE`일 때 **필수** (Catalog 도메인 SKU 참조, 선출고 시 사용)

> `responsibility`: `CUSTOMER`(단순변심 등) / `VENDOR`(상품불량 등). `images`: 첨부 이미지 URL 배열, 최대 3장. **`responsibility=VENDOR`일 때 최소 1장 필수**(REQ-ORD-058), CUSTOMER는 선택. 서버는 이 이미지를 `uploaded_by=CUSTOMER`로 저장하며, "최대 3장" 제한은 이후 품질점검 거부(#38)에서 판매자가 첨부하는 사진(`uploaded_by=VENDOR`)과 완전히 독립적으로 적용된다(REQ-ORD-075).

```json
{
  "claimType": "RETURN",
  "reason": "상품불량",
  "detailReason": "박음질이 뜯어져 있습니다",
  "responsibility": "VENDOR",
  "images": ["https://cdn.runnshop.com/claims/img-001.jpg"]
}
```

#### Response 201

```json
{
  "code": "SUCCESS",
  "data": { "claimId": "clm-001", "claimType": "RETURN", "status": "RECEIVED" }
}
```

> `claimType=EXCHANGE`인 경우 `data`에 `exchangeSkuId`가 함께 반환된다: `{ "claimId": "clm-002", "claimType": "EXCHANGE", "status": "RECEIVED", "exchangeSkuId": "sku-002" }`

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | CLAIM_PERIOD_EXPIRED | 기한이 초과되었습니다 (배송완료 후 10일 이내) | 10일 초과 | AC-ORD-032 |
| 400 | CLAIM_NOT_ALLOWED | 배송완료 후에만 신청할 수 있습니다 | DELIVERED 아닌 상태 | — |
| 400 | EXCHANGE_SKU_REQUIRED | 교환할 옵션(SKU)을 선택해주세요 | claimType=EXCHANGE인데 exchangeSkuId 누락 | REQ-ORD-056 |
| 400 | EXCHANGE_SKU_MISMATCH | 교환은 동일 상품 내 옵션 변경만 가능합니다 | claimType=EXCHANGE인데 exchangeSkuId의 productId가 원 주문 상품(productId)과 다름 | REQ-ORD-070 |
| 400 | CLAIM_PHOTO_REQUIRED | 상품 상태를 확인할 수 있는 사진을 1장 이상 첨부해주세요 | responsibility=VENDOR인데 images가 빈 배열 | REQ-ORD-058 |

---

## 10-1. POST /api/v1/claims/{claimId}/cancel — 클레임 자진 취소

> 신규 (시퀀스 §7-2 대응). 고객이 마이페이지 클레임상세에서 접수한 클레임을 스스로 취소한다. CS 귀책판정(#19-1) 또는 수거(PICKUP) 프로세스가 시작되기 전, 즉 `RECEIVED`/`PAYMENT_PENDING` 상태에서만 허용한다.

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/v1/claims/{claimId}/cancel |
| 인증 | Bearer {memberId} (필수) |
| 설명 | 클레임 상태가 `RECEIVED` 또는 `PAYMENT_PENDING`일 때만 자진 취소를 허용한다. 취소 시 상태 → `REJECTED`(사유="고객 자진 철회"), 고객에게 알림톡 발송. `INSPECTING` 등 CS 귀책판정 이후 상태에서는 거부한다(REQ-ORD-073, REQ-ORD-071). |

#### Request Body

없음 (Body 없이 호출)

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "REJECTED" } }
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 GWT |
|---|---|---|---|---|
| 400 | CLAIM_CANCEL_NOT_ALLOWED | 귀책 판정/수거 시작 이후에는 취소할 수 없습니다 | claim.status가 `RECEIVED`/`PAYMENT_PENDING`이 아님 (예: `INSPECTING` 이후) | REQ-ORD-071 |
| 403 | FORBIDDEN | 본인 클레임만 취소할 수 있습니다 | 타인 클레임 | — |

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
    "history": [ { "fromStatus": "PAYMENT_PENDING", "toStatus": "PAYMENT_COMPLETED", "changedBy": "SYSTEM", "createdAt": "2026-06-26 09:15" } ]
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
| Query | `?keyword=&claimType=ALL&status=ALL&responsibility=ALL&from=&to=&page=1&size=10` |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 8,
    "claims": [
      { "claimId": "clm-001", "claimNo": "CLM-20260626-001", "platformOrderNo": "ORD-20260626-001", "claimType": "RETURN", "status": "RECEIVED", "responsibility": "CUSTOMER", "channel": "SELF", "refundAmount": 152000, "createdAt": "2026-06-26 10:30", "completedAt": null }
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
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "RECEIVED" } }
```

> 클레임 11상태 모델(DG)에는 별도의 `IN_PROGRESS` 상태가 없다. "처리 시작"은 CS가 클레임 상세를 열어 확인 중임을 표시하는 UI 동작일 뿐, 클레임 상태는 `RECEIVED`로 유지되며 이후 귀책 판정(§19-1 `blame-decision`)에서 `PAYMENT_PENDING`/`INSPECTING`으로 분기한다.

---

## 19-1. POST /api/admin/v1/claims/{claimId}/blame-decision — 귀책 판정 (API-026)

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/blame-decision |
| 인증 | Admin Bearer (필수) |
| 설명 | 고객이 신청 시 제출한 `responsibility`를 CS가 최종 확정한다(고객 제출값과 달라도 CS 판정이 최종, 덮어쓰기 가능 — REQ-ORD-066). `CUSTOMER` 판정 시 상태 → `PAYMENT_PENDING`(수거 배송비 결제 대기). `VENDOR` 판정 시 상태 → `INSPECTING` + shipment(PICKUP) 자동생성. `claimType=EXCHANGE`이고 `VENDOR` 판정인 경우 교환 SKU 재고를 즉시 선점하고 shipment(EXCHANGE_OUT)를 병행 생성해 선출고한다(맞교환 원칙, REQ-ORD-056). |

#### Request Body

```json
{ "responsibility": "VENDOR" }
```

> `responsibility`: `CUSTOMER`(단순변심 등) | `VENDOR`(상품불량 등). 고객이 신청 시 제출한 값을 참고값으로만 쓰고 CS가 최종 확정한다(REQ-ORD-066).

#### Response 200

`CUSTOMER` 판정:
```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "responsibility": "CUSTOMER", "status": "PAYMENT_PENDING" } }
```

`VENDOR` 판정 (`claimType=RETURN`):
```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "responsibility": "VENDOR", "status": "INSPECTING", "shipment": { "shipmentType": "PICKUP", "status": "PENDING" } } }
```

`VENDOR` 판정 (`claimType=EXCHANGE`, 교환 SKU 즉시 선출고):
```json
{ "code": "SUCCESS", "data": { "claimId": "clm-002", "responsibility": "VENDOR", "status": "INSPECTING", "shipment": { "shipmentType": "PICKUP", "status": "PENDING" }, "exchangeShipment": { "shipmentType": "EXCHANGE_OUT", "status": "PENDING" } } }
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 |
|---|---|---|---|---|
| 400 | CLAIM_ALREADY_DECIDED | 이미 귀책 판정이 완료된 클레임입니다 | claim.status ≠ RECEIVED | — |
| 409 | EXCHANGE_STOCK_UNAVAILABLE | 교환 가능한 재고가 없습니다 | `claimType=EXCHANGE`인 클레임의 귀책판정 시점에 `exchangeSkuId` 재고 선점 실패 (선출고 전 단계에서 판정 자체를 차단; 이전에는 39-1 exchange-ship 시점 에러로 잘못 배치돼 있었음) | REQ-ORD-069 |

> `EXCHANGE_STOCK_UNAVAILABLE`은 이 endpoint(귀책판정 시점)에서만 반환된다. 39-1(exchange-ship, 운송장 등록)은 이미 재고 선점이 끝난 뒤의 배송 등록 단계이므로 이 에러가 발생하지 않는다.

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
{ "code": "SUCCESS", "data": { "orderId": "ord-001", "status": "PREPARING", "shipment": { "shipmentType": "OUTBOUND", "status": "IN_TRANSIT", "carrier": "CJ대한통운", "trackingNumber": "1234567890", "shippedAt": "2026-06-27 10:00" } } }
```

> v6: order.status는 `IN_DELIVERY`로 전환되지 않고 `PREPARING`을 유지한다. 배송 실행은 신규 `ord_shipment`(shipmentType=OUTBOUND)로 표현되며, "배송 중" 화면 표시는 `PREPARING + shipment.status=IN_TRANSIT` 조인으로 계산한다(REQ-ORD-059).

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
          { "productName": "나이키 페가수스 41", "optionName": "블랙/265", "orderQuantity": 1, "claimInProgress": 0, "claimCompleted": 0, "claimableQuantity": 1, "amount": 152000 }
        ]
      }
    ],
    "payment": { "totalProductPrice": 469000, "productDiscount": -48000, "cartDiscount": -3000, "shippingFee": 0, "totalPayment": 418000, "method": "신용카드 (****-1234)", "paidAt": "2026-06-26 09:15" },
    "shipping": { "recipientName": "홍*동", "phone": "010-****-5678", "address": "[06234] 서울 강남구 테헤란로 123 런앤샵타워 5층", "memo": "부재 시 문 앞에" },
    "history": [ { "at": "2026-06-26 09:15", "event": "주문 접수" }, { "at": "2026-06-26 09:15", "event": "결제 완료" } ]
  }
}
```

> `claimableQuantity`(재신청 가능 수량) = `orderQuantity` − 진행 중/완료된 클레임 수량. `REJECTED`(반려)·`PAYMENT_EXPIRED`(배송비 결제 만료)로 종료된 클레임은 차감 대상에서 제외하여 원래 구매수량 그대로 재신청 가능하도록 복원한다(REQ-ORD-067, REQ-ORD-074). 반품/교환 신청 화면(#10)은 이 값을 참조해 신청 가능 최대 수량을 노출한다.

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
  "data": { "claimId": "clm-001", "paymentType": "PICKUP", "paidAmount": 0, "couponApplied": true, "status": "INSPECTING" }
}
```

> v6: 수거 배송비 결제 완료 시 `status`는 `PICKUP`이 아니라 `INSPECTING`으로 전환된다(shipment(PICKUP)가 `ord_shipment`에 자동 생성되며 배송 실행은 그쪽에서 추적). `paymentType=RETURN`(반송 배송비 결제)인 경우 `status`는 변경 없이 `RETURN_PAYMENT_PENDING`을 유지한다.

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
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "RETURN_PAYMENT_PENDING", "paymentType": "RETURN" } }
```

> `status`는 `RETURN_PAYMENT_PENDING`(반송 배송비 결제대기)으로 전환된다. 수거 배송비 결제대기 상태인 `PAYMENT_PENDING`과는 구분되는 별도 상태이므로 혼동하지 않는다.

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
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "shipment": { "shipmentType": "PICKUP", "status": "IN_TRANSIT", "carrier": "CJ대한통운", "trackingNumber": "9876543210", "shippedAt": "2026-06-29 09:00" } } }
```

> v6: 이 endpoint는 `ord_shipment`(shipmentType=PICKUP)를 PENDING→IN_TRANSIT으로 전환할 뿐, claim.status는 변경하지 않는다(귀책판정 시점에 이미 INSPECTING 또는 PAYMENT_PENDING 상태).

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
{ "memo": "상품 상태 양호. 환불 가능", "tagIntact": true }
```

> `tagIntact`: 택(TAG) 부착 유지 여부. `claimType=EXCHANGE` 건의 판정 근거 (REQ-ORD-057). RETURN 건은 생략 가능

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "PICKED_UP", "tagIntact": true } }
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
{ "rejectReason": "상품 택 제거 및 사용 흔적으로 반품 불가", "tagIntact": false, "images": ["https://cdn.runnshop.com/claims/inspect-001.jpg"] }
```

> `tagIntact`: 택(TAG) 부착 유지 여부. `claimType=EXCHANGE` 건은 택 제거·훼손이 거부 사유인 경우 `false`로 전달 (REQ-ORD-057). RETURN 건은 생략 가능
> `images`: 상품 상태(훼손/택 제거 등)를 확인할 수 있는 증빙 사진 URL 배열. **`claimType=EXCHANGE` 건은 최소 1장 필수**(REQ-ORD-072, REQ-ORD-058 VENDOR귀책 사진 필수와 대칭). RETURN 건은 선택. 서버는 이 이미지를 `uploaded_by=VENDOR`로 저장하며, 고객 접수 시 첨부한 사진(`uploaded_by=CUSTOMER`, #10)과는 별도로 최대 3장 제한이 독립 적용된다(REQ-ORD-075).

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "PICKUP_REJECTED", "tagIntact": false } }
```

#### Error Responses

| HTTP | code | message | 조건 | 대응 |
|---|---|---|---|---|
| 400 | REASON_REQUIRED | 거부 사유를 입력해주세요 | 사유 누락 | — |
| 400 | INSPECT_PHOTO_REQUIRED | 상품 상태를 확인할 수 있는 사진을 1장 이상 첨부해주세요 | `claimType=EXCHANGE`인데 `images`가 빈 배열(0장) | REQ-ORD-072 |

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
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "RETURN_PAYMENT_PENDING", "shipment": { "shipmentType": "RETURN", "status": "IN_TRANSIT", "carrier": "CJ대한통운", "trackingNumber": "1111222233" } } }
```

> v6: 이 endpoint는 `ord_shipment`(shipmentType=RETURN)를 PENDING→IN_TRANSIT으로 전환할 뿐, claim.status는 `RETURN_PAYMENT_PENDING`을 그대로 유지한다(반송 배송비 결제 완료 후 진입한 상태). shipment(RETURN)이 DELIVERED로 전환되어야 배치가 클레임을 COMPLETED로 자동전환한다(39-2. 참조).

---

## 39-1. POST /api/partner/v1/claims/{claimId}/exchange-ship — 교환상품 선출고 운송장 등록

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/claims/{claimId}/exchange-ship |
| 인증 | Partner Bearer (필수) |
| 설명 | `claimType=EXCHANGE` 건이 귀책판정되어 `INSPECTING` 상태로 전환될 때(또는 그 이전), 교환 대상 SKU(`exchange_sku_id`)를 원상품 수취 이전에 선출고하기 위한 택배사 + 운송장 등록 (REQ-ORD-056, 맞교환 원칙: 선출고 후 수취). 재고 선점은 이 endpoint 이전 §19-1(`blame-decision`)에서 이미 완료된 상태이므로 이 endpoint는 재고를 다시 확인하지 않는다. 반송 운송장 등록(39.)과 동일한 패턴 |

#### Request Body

```json
{ "deliveryCompany": "CJ대한통운", "trackingNo": "4444555566" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "exchangeSkuId": "sku-002", "shipment": { "shipmentType": "EXCHANGE_OUT", "status": "IN_TRANSIT", "carrier": "CJ대한통운", "trackingNumber": "4444555566", "shippedAt": "2026-06-29 09:30" } } }
```

> v6: 이 endpoint는 `ord_shipment`(shipmentType=EXCHANGE_OUT)를 PENDING→IN_TRANSIT으로 전환할 뿐, claim.status는 변경하지 않는다. shipment(EXCHANGE_OUT)의 DELIVERED 전환은 claim.status에 영향을 주지 않는다(교환상품 발송 완료로 종료, 원상품 수취는 별도 shipment(PICKUP)로 추적).

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | TRACKING_NO_REQUIRED | 운송장번호를 입력해주세요 | 번호 누락 |
| 400 | NOT_EXCHANGE_CLAIM | 교환 클레임이 아닙니다 | claimType≠EXCHANGE |

> `EXCHANGE_STOCK_UNAVAILABLE`(교환 재고 없음)은 이 endpoint의 에러가 아니다 — 재고 선점은 귀책판정(§19-1 `blame-decision`) 시점에 이미 끝났어야 하므로, 재고 부족은 그때 차단된다(REQ-ORD-069). 이 endpoint는 운송장 등록만 수행한다.

---

## 39-2. POST /api/admin/v1/claims/{claimId}/return-delivered — 반송 배송완료 확인

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/admin/v1/claims/{claimId}/return-delivered |
| 인증 | System/Admin Bearer (필수) — 택배사 배송완료 콜백 수신 또는 배송추적 배치가 호출 |
| 설명 | v6: `RETURN_SHIPPING`/`RETURN_DELIVERED`는 더 이상 claim.status가 아니다. 이 endpoint는 `ord_shipment`(shipmentType=RETURN, 즉 claim.status=RETURN_PAYMENT_PENDING 건에 연결된 shipment)가 IN_TRANSIT 상태일 때 택배사로부터 배송완료를 수신(또는 배치가 택배사 API 조회 결과 확인)하면 shipment.status를 DELIVERED로 전환한다. claim.status 자체는 이 시점에는 RETURN_PAYMENT_PENDING을 유지하며, 이후 별도 배치(shipment DELIVERED 이벤트 구독)가 클레임을 COMPLETED로 자동전환한다 |

#### Request Body

```json
{ "deliveryCompany": "CJ대한통운", "trackingNo": "1111222233", "deliveredAt": "2026-07-01 11:20", "source": "CARRIER_CALLBACK" }
```

> `source`: `CARRIER_CALLBACK`(택배사 콜백 수신) 또는 `BATCH_CHECK`(배송추적 배치의 상태 조회 결과)

#### Response 200

```json
{ "code": "SUCCESS", "data": { "claimId": "clm-001", "status": "RETURN_PAYMENT_PENDING", "shipment": { "shipmentType": "RETURN", "status": "DELIVERED", "deliveredAt": "2026-07-01 11:20" } } }
```

> v6: 응답의 `status`는 `RETURN_DELIVERED`가 아니라 여전히 `RETURN_PAYMENT_PENDING`이다(claim.status는 이 API로 전환되지 않음). 배송완료 확인은 `shipment.status=DELIVERED`로만 표현되며, 클레임 완료(COMPLETED) 전환은 이 이벤트를 구독하는 별도 배치가 수행한다.

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | RETURN_DELIVER_NOT_ALLOWED | 반송 배송 중(이동중) 상태에서만 배송완료 처리할 수 있습니다 | shipment(RETURN).status가 IN_TRANSIT 아님 |
| 404 | CLAIM_NOT_FOUND | 클레임을 찾을 수 없습니다 | 존재하지 않는 claimId |

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
      { "claimId": "clm-001", "claimNo": "CLM-20260628-001", "platformOrderNo": "ORD-20260622-008", "claimType": "RETURN", "productName": "호카 클리프턴 9", "customerName": "이*미", "status": "INSPECTING", "shippingFee": 5000, "shippingFeeStatus": "PAID", "createdAt": "2026-06-28" }
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
        "status": "RECEIVED",
        "statusLabel": "접수됨",
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
    "status": "RECEIVED",
    "statusLabel": "접수됨",
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
    "shipment": {
      "shipmentType": "PICKUP",
      "carrier": "CJ대한통운",
      "trackingNumber": "9876543210",
      "status": "IN_TRANSIT",
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

> v6: 기존 `pickup` 객체를 `shipment` 객체로 대체(신규 `ord_shipment` 엔티티 반영). `shipmentType`은 클레임 유형에 따라 `PICKUP`/`RETURN`/`EXCHANGE_OUT`이며, `status`는 `PENDING`/`IN_TRANSIT`/`DELIVERED`/`FAILED`/`CANCELLED` 중 하나다.

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

## 41. GET /api/v1/members/me/payments — 내 결제 이력 조회

| 항목 | 내용 |
|---|---|
| Method | GET |
| Path | /api/v1/members/me/payments |
| 인증 | Bearer {memberId} (필수) |
| Query | `?from=&to=&page=1&size=10` |
| 설명 | 본인 결제 건만 최신순으로 반환 (REQ-PAY-020) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 3,
    "payments": [
      { "paymentId": "pay-001", "platformOrderNo": "ORD-20260626-001", "amount": 152000, "paymentMethod": "신용카드 (****-1234)", "status": "PAID", "paidAt": "2026-06-26 09:14" }
    ]
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
| Query | `?status=ALL&platformOrderNo=&pgTransactionNo=&from=&to=&page=1&size=10` |
| 설명 | 상태·기간·주문번호·PG거래번호 필터로 결제 건 검색 (REQ-PAY-021) |

#### Response 200

```json
{
  "code": "SUCCESS",
  "data": {
    "totalCount": 1,
    "payments": [
      { "paymentId": "pay-001", "platformOrderNo": "ORD-20260626-001", "customerName": "홍*동", "amount": 152000, "pgTransactionNo": "PG-20260626-99001", "status": "PAID", "paidAt": "2026-06-26 09:14" }
    ]
  }
}
```

> `pgTransactionNo`는 `pay_payment_log.pg_transaction_id`에서 조인해 채운다(`pay_payment` 자체 컬럼이 아님).

#### Error Responses

| HTTP | code | message | 조건 |
|---|---|---|---|
| 400 | INVALID_DATE_RANGE | 조회 기간이 올바르지 않습니다 | from > to |

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

## 44. POST /api/partner/v1/shipping/{shipmentId}/reship — 배송 실패 재발송 처리

| 항목 | 내용 |
|---|---|
| Method | POST |
| Path | /api/partner/v1/shipping/{shipmentId}/reship |
| 인증 | Partner Bearer 또는 Admin Bearer (필수) |
| 설명 | `FAILED` 상태의 shipment(`shipment_type` 공용 — OUTBOUND/PICKUP/RETURN/EXCHANGE_OUT 모두 대상)를 재발송 처리한다. 배송상태 갱신 배치(BAT-003, 60분 주기)가 `FAILED`로 전환시킨 건을 판매자 또는 CS 담당자가 새 운송장으로 재등록한다 (REQ-ORD-062). |

#### Request Body

```json
{ "carrier": "CJ대한통운", "trackingNo": "5555666677" }
```

#### Response 200

```json
{ "code": "SUCCESS", "data": { "shipmentId": "shp-001", "status": "IN_TRANSIT", "carrier": "CJ대한통운", "trackingNumber": "5555666677" } }
```

> 상태전이: `ord_shipment.status` `FAILED` → `PENDING`(재발송 등록 접수) → `PENDING`에 운송장 등록 시 `IN_TRANSIT`. 재발송 이후에는 §19 배치가 다시 60분 주기로 추적한다. shipment_type이 무엇이든(출고/수거/반송/교환선출고) 동일 로직이 적용된다.

#### Error Responses

| HTTP | code | message | 조건 | 대응 |
|---|---|---|---|---|
| 400 | RESHIP_NOT_ALLOWED | FAILED 상태만 재발송 가능합니다 | shipment.status ≠ FAILED | 시퀀스(DM) §22 |
| 400 | TRACKING_NO_REQUIRED | 운송장번호를 입력해주세요 | 번호 누락 | — |
| 404 | SHIPMENT_NOT_FOUND | 배송 건을 찾을 수 없습니다 | 존재하지 않는 shipmentId | — |

---

## 근거

| 항목 | 출처 |
|---|---|
| Endpoint 도출 | 세부 유스케이스(DK) API 호출 행위 |
| 에러코드 도출 | GWT(DJ) 예외 시나리오 Then절 |
| Path Prefix | 컴포넌트(D9) 인증 규칙: v1(고객), admin/v1(관리자), partner/v1(입점사) |
| 응답 구조 | 코딩 표준 `{ "code": "SUCCESS", "data": {...} }` |
| 응답 필드 | 화면 레이아웃(DN) + mock JSON 데이터 |
