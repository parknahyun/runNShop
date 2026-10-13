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

도메인별 파일로 분리되어 있습니다.

| 구분 | 파일 |
|---|---|
| Order 도메인 (장바구니·주문·클레임·배송 API) | [order.md](order.md) |
| Payment 도메인 (결제수단·결제이력 API) | [payment.md](payment.md) |

---

## API 목록 요약

| # | Method | Path | 설명 | 채널 |
|---|---|---|---|---|
| 1 | POST | /api/mobile/v1/my/cart/items | 장바구니 담기 | mobile |
| 2 | GET | /api/mobile/v1/my/cart | 장바구니 조회 | mobile |
| 3 | PATCH | /api/mobile/v1/my/cart/items/{cartItemId}/quantity | 수량 변경 | mobile |
| 4 | DELETE | /api/mobile/v1/my/cart/items/{cartItemId} | 장바구니 삭제 | mobile |
| 5 | POST | /api/mobile/v1/my/orders/sheet | 주문서 생성 | mobile |
| 6 | POST | /api/mobile/v1/my/orders/{orderSheetId}/pay | 결제 요청 | mobile |
| 7 | POST | /api/mobile/v1/my/orders/{orderId}/cancel | 고객 주문 취소 | mobile |
| 8 | POST | /api/mobile/v1/my/orders/{orderId}/confirm | 구매확정 | mobile |
| 9 | PUT | /api/mobile/v1/my/orders/{orderId}/shipping-address | 배송지 변경 | mobile |
| 10 | POST | /api/mobile/v1/my/orders/{orderId}/claims | 반품/교환 신청 | mobile |
| 10-1 | POST | /api/mobile/v1/my/claims/{claimId}/cancel | 클레임 자진 취소 (본문 §10-1, 시퀀스 §7-2) | mobile |
| 11 | GET | /api/mobile/v1/my/orders | 내 주문 목록 | mobile |
| 12 | GET | /api/mobile/v1/my/payment-methods | 결제수단 목록 | mobile |
| 13 | POST | /api/mobile/v1/my/payment-methods | 결제수단 등록 | mobile |
| 14 | DELETE | /api/mobile/v1/my/payment-methods/{methodId} | 결제수단 삭제 | mobile |
| 15 | GET | /api/mobile/v1/my/claims | 내 클레임 목록 | mobile |
| 16 | GET | /api/mobile/v1/my/claims/{claimId} | 내 클레임 상세 | mobile |
| 17 | GET | /api/mobile/v1/my/orders/{orderId} | 내 주문 상세 | mobile |
| 18 | POST | /api/mobile/v1/my/claims/{claimId}/shipping-payment | 클레임 배송비 결제 | mobile |
| 19 | PUT | /api/mobile/v1/my/cart/items/{cartItemId}/option | 장바구니 옵션 변경 | mobile |
| 19-1 | GET | /api/mobile/v1/my/orders/{orderSheetId}/coupon-combinations | 쿠폰 조합별 할인 계산 (캐시) | mobile |
| 19-2 | POST | /api/mobile/v1/my/orders/{orderSheetId}/calculate | 쿠폰 확정 재계산 (Phase 2) | mobile |
| 20 | GET | /api/admin/v1/orders | 주문 검색 (어드민) | admin |
| 21 | GET | /api/admin/v1/orders/{orderId} | 주문 상세 | admin |
| 22 | POST | /api/admin/v1/orders/{orderId}/force-cancel | 예외 취소 | admin |
| 23 | GET | /api/admin/v1/claims | 클레임 목록 | admin |
| 24 | POST | /api/admin/v1/claims/{claimId}/start | 클레임 처리 시작 (API-050, 본문 §19) | admin |
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
| 41 | GET | /api/mobile/v1/my/payments | 내 결제 이력 조회 | mobile |
| 42 | GET | /api/admin/v1/payments/search | CS 결제 검색 | admin |
| 43 | GET | /api/admin/v1/payments/{paymentId}/pg-logs | PG 거래 로그 조회 | admin |
| 44 | POST | /api/partner/v1/shipping/{shipmentId}/reship | 배송 실패 재발송 처리 | partner/admin |

---

## 공통 규칙 (C6 API설계컨벤션 준수)

> 이하 개별 API의 에러 응답 테이블은 `code`/`message`/`조건`/`대응 GWT` 컬럼만 표기하여 가독성을 확보한다.
> **모든 에러 응답은 아래 Envelope을 따르며**, 개별 API 섹션에서 생략된 `errors[]`/`traceId`도 실제 응답에는 포함된다(C6 §6.3).

### 1. 에러 응답 Envelope (전체 형태)

```json
{
  "code": "STOCK_NOT_AVAILABLE",
  "message": "재고가 부족합니다",
  "errors": [
    { "field": "skuId", "code": "INSUFFICIENT_STOCK", "message": "요청 수량이 재고를 초과합니다." }
  ],
  "traceId": "trc_01HXYZ..."
}
```

- `errors[]`: 필드 단위 유효성 검증 실패 시에만 포함(예: `INVALID_QUANTITY`, `TERMS_NOT_AGREED`, `ADDRESS_REQUIRED` 등 입력값 문제). 단일 비즈니스 규칙 위반(예: `CLAIM_PERIOD_EXPIRED`)은 `errors[]` 없이 `code`+`message`만으로 충분.
- `traceId`: 운영 환경에서 항상 포함(로그 추적용). 프로토타입 Mock 응답에도 `trc_` 접두 ULID를 고정 포함한다.

### 2. HTTP Status 코드 사용 기준 (C6 §7)

| HTTP | 적용 대상 | 본 문서 내 해당 코드 |
|---|---|---|
| 400 | 요청 자체의 유효성 검증 실패 (필수값 누락·형식 오류) | `INVALID_QUANTITY`, `TRACKING_NO_REQUIRED`, `ADDRESS_REQUIRED`, `TERMS_NOT_AGREED`, `REASON_REQUIRED`, `EXCHANGE_SKU_REQUIRED`, `CLAIM_PHOTO_REQUIRED`, `INSPECT_PHOTO_REQUIRED`, `NOT_EXCHANGE_CLAIM`, `INVALID_DATE_RANGE`, `PAYMENT_FAILED`(PG 승인 거절) |
| 409 | 리소스/상태 충돌 (재고 부족, 이미 처리된 상태, 중복 요청) | `STOCK_NOT_AVAILABLE`, `EXCEED_STOCK`, `OPTION_SOLD_OUT`, `PRODUCT_NOT_AVAILABLE`, `CANCEL_NOT_ALLOWED`, `CONFIRM_NOT_ALLOWED`, `ADDRESS_CHANGE_NOT_ALLOWED`, `SHIP_NOT_ALLOWED`, `CLAIM_NOT_ALLOWED`, `CLAIM_CANCEL_NOT_ALLOWED`, `CLAIM_ALREADY_DECIDED`, `EXCHANGE_STOCK_UNAVAILABLE`, `CARD_RESTRICTED`, `RESHIP_NOT_ALLOWED`, `RETURN_DELIVER_NOT_ALLOWED`, `INVALID_STATUS` |
| 422 | 비즈니스 규칙 위반 (기한 초과, 한도 초과, 조합 불일치) | `CLAIM_PERIOD_EXPIRED`, `PAYMENT_EXPIRED`, `CART_FULL`, `EXCHANGE_SKU_MISMATCH`, `COUPON_NOT_APPLICABLE`, `COUPON_EXPIRED`, `POINT_EXCEED` |
| 404 | 리소스 없음 | `CART_ITEM_NOT_FOUND`, `CLAIM_NOT_FOUND`, `PAYMENT_NOT_FOUND`, `SHIPMENT_NOT_FOUND` |

> 아래 개별 API 에러 테이블의 HTTP 컬럼은 위 기준에 따라 정정되어 있다. (예: 기존 400으로 뭉뚱그려졌던 재고부족/상태충돌류 → 409, 기한초과류 → 422)
>
> **2026-08-24 동기화**: 시퀀스(DM)가 이 정정을 반영하지 못하고 20건에서 옛 400을 그대로 쓰고 있던 것을 DL 기준으로 정정. 또한 시퀀스(DM) §12/§13/§14/§15/§20/§21이 실제로 분기하던 `INVALID_STATUS`(상태 충돌, 409)가 이 문서 §18/§33/§34/§35/§37/§38에 누락되어 있어 추가함 — 상태 충돌류이므로 위 409 분류를 따름.

### 3. Pagination (목록 API 공통, C6 §6.2)

목록 조회 API는 Query Parameter로 `sort`(필드명, camelCase)와 `direction`(`asc`|`desc`)을 추가로 지원하며,
Response는 `totalCount` 단일 필드 대신 `pagination` 객체를 포함한다.

```json
{
  "code": "SUCCESS",
  "data": {
    "orders": [ ... ],
    "pagination": { "page": 1, "size": 10, "totalCount": 12, "totalPages": 2 }
  }
}
```

> 배열 필드명은 도메인 가독성을 위해 `orders`/`claims`/`payments` 등 리소스명을 유지한다(C6 예시의 `items`는 범용 표기이며, 도메인 문서에서는 리소스명 사용을 허용).
> `sort` 기본값은 API별로 다르며 각 섹션의 Query 예시에 명시한다. `direction` 기본값은 `desc`.

### 4. Idempotency-Key (C6 §4)

금액이 오가거나 중복 실행 시 부작용이 있는 POST API는 `Idempotency-Key: {ULID}` 헤더를 지원한다(유효기간 24시간, 동일 Key 재요청 시 최초 처리 결과를 그대로 반환).

| API | 대상 이유 |
|---|---|
| #5 POST /api/mobile/v1/my/orders/sheet | 주문서 중복 생성 방지 |
| #6 POST /api/mobile/v1/my/orders/{orderSheetId}/pay | 결제 요청 중복 접수 방지 (재고 이중 선점·이중 결제 방지) |
| #31 POST /api/mobile/v1/my/claims/{claimId}/shipping-payment | 배송비 결제 중복 접수 방지 |

---

## 근거

| 항목 | 출처 |
|---|---|
| Endpoint 도출 | 세부 유스케이스(DK) API 호출 행위 |
| 에러코드 도출 | GWT(DJ) 예외 시나리오 Then절 |
| Path Prefix | 컴포넌트(D9) 인증 규칙: v1(고객), admin/v1(관리자), partner/v1(입점사) |
| 응답 구조 | 코딩 표준 `{ "code": "SUCCESS", "data": {...} }` |
| 응답 필드 | 화면 레이아웃(DN) + mock JSON 데이터 |
