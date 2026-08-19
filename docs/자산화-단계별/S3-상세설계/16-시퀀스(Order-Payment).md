# 시퀀스 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Design  
>
> **작성 목적**: 인터페이스 명세(⑮)의 API를 호출 순서·참여 객체·트랜잭션 경계로 구체화한다.  
> "이 API가 호출되면 내부에서 어떤 순서로 어떤 객체가 상호작용하는가"를 확정한다.
>
> **흐름 내 위치**:
> ```
> ⑮ 인터페이스 명세 → ⑯ 시퀀스 → ⑰ 화면 레이아웃 / ⑲ 클래스 설계
> ```

---

## 1. POST /api/v1/cart/items — 장바구니 담기

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/cart/items — 장바구니 담기

actor 고객 as Client
participant "CartController" as CC
participant "CartService" as CS
participant "CatalogPublicApi" as CAT
participant "CartRepository" as CR
database "DB (ord_cart)" as DB

Client -> CC : POST /api/v1/cart/items\n{productId, skuId, quantity}
activate CC

CC -> CS : addToCart(memberId, request)
activate CS

CS -> CAT : getProductInfo(productId, skuId)
activate CAT
CAT --> CS : {name, price, status, stock}
deactivate CAT

alt 상품 판매중지 or 품절
  CS --> CC : PRODUCT_NOT_AVAILABLE
  CC --> Client : 400 에러 응답
else 정상

  CS -> CR : findByMemberAndSku(memberId, skuId)
  activate CR
  CR -> DB : SELECT
  DB --> CR : 기존 cartItem (nullable)
  CR --> CS : Optional<CartItem>
  deactivate CR

  alt 기존 존재 → 수량 합산
    CS -> CR : save(existingItem.addQuantity(quantity))
  else 신규 → 새 아이템
    CS -> CS : 장바구니 개수 검증 (50개 초과?)
    alt 50개 초과
      CS --> CC : CART_FULL
      CC --> Client : 400 에러 응답
    else
      CS -> CR : save(newCartItem)
    end
  end

  CR -> DB : INSERT/UPDATE
  DB --> CR : OK
  CS --> CC : CartItemResponse
  deactivate CS
  CC --> Client : 200 SUCCESS
  deactivate CC
end

@enduml
```

---

## 2. GET /api/v1/cart — 장바구니 조회

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title GET /api/v1/cart — 장바구니 조회

actor 고객 as Client
participant "CartController" as CC
participant "CartService" as CS
participant "CartRepository" as CR
participant "CatalogPublicApi" as CAT
database "DB (ord_cart)" as DB

Client -> CC : GET /api/v1/cart
activate CC

CC -> CS : getCart(memberId)
activate CS

CS -> CR : findAllByMember(memberId)
activate CR
CR -> DB : SELECT WHERE member_id AND is_deleted=false
DB --> CR : List<CartItem>
CR --> CS : cartItems
deactivate CR

CS -> CAT : getProductInfoBatch(productIds)
activate CAT
CAT --> CS : Map<productId, ProductInfo>
deactivate CAT

CS -> CS : 입점사별 그룹핑 + summary 계산\n(할인, 배송비, 포인트잔액)

CS --> CC : CartResponse
deactivate CS
CC --> Client : 200 SUCCESS
deactivate CC

@enduml
```

---

## 3. POST /api/v1/orders/sheet — 주문서 생성

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/sheet — 주문서 생성

actor 고객 as Client
participant "OrderController" as OC
participant "OrderSheetService" as OSS
participant "CartRepository" as CR
participant "MemberPublicApi" as MEM
participant "PromotionPublicApi" as PROMO
database "DB" as DB

Client -> OC : POST /api/v1/orders/sheet\n{cartItemIds}
activate OC

OC -> OSS : createSheet(memberId, cartItemIds)
activate OSS

OSS -> CR : findByIds(cartItemIds)
CR -> DB : SELECT
DB --> CR : cartItems
CR --> OSS : cartItems

OSS -> MEM : getAddresses(memberId)
MEM --> OSS : addresses

OSS -> MEM : getPointBalance(memberId)
MEM --> OSS : pointInfo

OSS -> PROMO : getAvailableCoupons(memberId, items)
PROMO --> OSS : coupons

OSS -> OSS : 입점사별 그룹 + 금액 계산\n(상품할인, 배송비, 결제수단)

OSS --> OC : OrderSheetResponse
deactivate OSS
OC --> Client : 200 SUCCESS
deactivate OC

@enduml
```

---

## 4. POST /api/v1/orders/{orderSheetId}/pay — 결제 요청

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderSheetId}/pay — 결제 요청

actor 고객 as Client
participant "OrderController" as OC
participant "OrderService" as OS
participant "CatalogPublicApi" as CAT
participant "PaymentPublicApi" as PAY
participant "OrderRepository" as OR
database "DB (ord_*)" as DB

Client -> OC : POST /api/v1/orders/{sheetId}/pay\n{addressId, couponId, pointUsed, paymentMethod, termsAgreed}
activate OC

OC -> OS : placeOrder(memberId, sheetId, request)
activate OS

== 유효성 검증 ==
OS -> OS : 배송지·약관 검증
alt 검증 실패
  OS --> OC : ADDRESS_REQUIRED / TERMS_NOT_AGREED
  OC --> Client : 400 에러
end

== 주문 생성 ==
OS -> OR : save(platformOrder + orders)
OR -> DB : INSERT ord_platform_order, ord_order, ord_order_item
DB --> OR : OK

== 재고 선점 ==
OS -> CAT : reserveStock(items)
activate CAT
alt 재고 부족
  CAT --> OS : STOCK_NOT_AVAILABLE
  OS -> OR : updateStatus(CANCELLED)
  OS --> OC : 400 에러
else
  CAT --> OS : 선점 성공
  deactivate CAT
end

== 결제 요청 (동기) ==
OS -> PAY : requestPayment(orderId, amount, method)
activate PAY
PAY -> PAY : PG 승인 요청\n(재시도 최대 3회, 타임아웃 30초)
alt PG 승인 성공
  PAY --> OS : PAYMENT_APPROVED
  OS -> OR : updateStatus(PAYMENT_COMPLETED)
  OR -> DB : UPDATE status
  OS --> OC : 성공 응답
  OC --> Client : 200 SUCCESS
else PG 실패 (3회 재시도 소진)
  PAY --> OS : PAYMENT_FAILED
  OS -> CAT : restoreStock(items)
  OS -> OR : updateStatus(PAYMENT_FAILED)
  OS --> OC : PAYMENT_FAILED
  OC --> Client : 400 에러
end
deactivate PAY
deactivate OS
deactivate OC

@enduml
```

---

## 5. POST /api/v1/orders/{orderId}/cancel — 고객 주문 취소

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderId}/cancel — 고객 주문 취소

actor 고객 as Client
participant "OrderController" as OC
participant "OrderService" as OS
participant "OrderRepository" as OR
participant "PaymentPublicApi" as PAY
participant "CatalogPublicApi" as CAT
database "DB (ord_*)" as DB

Client -> OC : POST /api/v1/orders/{orderId}/cancel\n{cancelReason}
activate OC

OC -> OS : cancelOrder(memberId, orderId, reason)
activate OS

OS -> OR : findById(orderId)
OR -> DB : SELECT
DB --> OR : order
OR --> OS : order

alt 주문 상태 != PAYMENT_COMPLETED
  OS --> OC : CANCEL_NOT_ALLOWED
  OC --> Client : 400 에러
else 취소 가능

  OS -> OR : updateStatus(CANCELLED, reason)
  OR -> DB : UPDATE + INSERT ord_order_history
  DB --> OR : OK

  OS -> PAY : requestRefund(orderId, amount) [비동기 이벤트: ORDER_CANCELLED]
  OS -> CAT : restoreStock(items) [비동기 이벤트: ORDER_CANCELLED]

  OS --> OC : CancelResponse(refundAmount)
  deactivate OS
  OC --> Client : 200 SUCCESS
  deactivate OC
end

@enduml
```

---

## 6. POST /api/v1/orders/{orderId}/confirm — 구매확정

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderId}/confirm — 구매확정

actor 고객 as Client
participant "OrderController" as OC
participant "OrderService" as OS
participant "OrderRepository" as OR
participant "EventPublisher" as EP
database "DB (ord_*)" as DB

Client -> OC : POST /api/v1/orders/{orderId}/confirm
activate OC

OC -> OS : confirmOrder(memberId, orderId)
activate OS

OS -> OR : findById(orderId)
OR -> DB : SELECT
DB --> OR : order
OR --> OS : order

alt 주문 상태 != DELIVERED
  OS --> OC : CONFIRM_NOT_ALLOWED
  OC --> Client : 400 에러
else
  OS -> OR : updateStatus(CONFIRMED)
  OR -> DB : UPDATE + INSERT ord_order_history
  DB --> OR : OK

  OS -> EP : publish(ORDER_CONFIRMED)
  note right of EP: Settlement → 정산 등록\nMember → 포인트 적립

  OS --> OC : ConfirmResponse(pointEarned)
  deactivate OS
  OC --> Client : 200 SUCCESS
  deactivate OC
end

@enduml
```

---

## 7. POST /api/v1/orders/{orderId}/claims — 반품/교환 신청

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderId}/claims — 반품/교환 신청

actor 고객 as Client
participant "ClaimController" as CC
participant "ClaimService" as CS
participant "OrderRepository" as OR
participant "ClaimRepository" as CR
database "DB (ord_*)" as DB

Client -> CC : POST /api/v1/orders/{orderId}/claims\n{claimType, reason, detailReason}
activate CC

CC -> CS : createClaim(memberId, orderId, request)
activate CS

CS -> OR : findById(orderId)
OR -> DB : SELECT
DB --> OR : order
OR --> CS : order

CS -> CS : 유효성 검증
alt 주문 상태 != DELIVERED
  CS --> CC : CLAIM_NOT_ALLOWED
  CC --> Client : 400 에러
else 배송완료 후 10일 초과
  CS --> CC : CLAIM_PERIOD_EXPIRED
  CC --> Client : 400 에러
else 정상
  CS -> CR : save(newClaim{status=RECEIVED})
  CR -> DB : INSERT ord_claim
  DB --> CR : OK

  CS --> CC : ClaimResponse(claimId, status)
  deactivate CS
  CC --> Client : 201 CREATED
  deactivate CC
end

@enduml
```

---

## 8. POST /api/partner/v1/orders/{orderId}/ship — 출고 처리

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/orders/{orderId}/ship — 출고 처리

actor 판매자 as Partner
participant "PartnerOrderController" as POC
participant "ShippingService" as SS
participant "OrderRepository" as OR
database "DB (ord_*)" as DB

Partner -> POC : POST /api/partner/v1/orders/{orderId}/ship
activate POC

POC -> SS : shipOrder(vendorId, orderId)
activate SS

SS -> OR : findByIdAndVendor(orderId, vendorId)
OR -> DB : SELECT
DB --> OR : order
OR --> SS : order

alt 상태 != PAYMENT_COMPLETED
  SS --> POC : SHIP_NOT_ALLOWED
  POC --> Partner : 400 에러
else
  SS -> OR : updateStatus(PREPARING)
  OR -> DB : UPDATE + INSERT ord_order_history
  DB --> OR : OK

  SS --> POC : ShipResponse(status=PREPARING)
  deactivate SS
  POC --> Partner : 200 SUCCESS
  deactivate POC
end

@enduml
```

---

## 9. POST /api/partner/v1/shipping/{orderId} — 운송장 등록

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/shipping/{orderId} — 운송장 등록

actor 판매자 as Partner
participant "ShippingController" as SC
participant "ShippingService" as SS
participant "OrderRepository" as OR
participant "ShippingRepository" as SR
database "DB (ord_*)" as DB

Partner -> SC : POST /api/partner/v1/shipping/{orderId}\n{deliveryCompany, trackingNo}
activate SC

SC -> SS : registerTracking(vendorId, orderId, request)
activate SS

alt 운송장번호 누락
  SS --> SC : TRACKING_NO_REQUIRED
  SC --> Partner : 400 에러
else
  SS -> SR : save(shipping{carrier, trackingNumber, shippedAt})
  SR -> DB : INSERT/UPDATE ord_shipping
  DB --> SR : OK

  SS -> OR : updateStatus(IN_DELIVERY)
  OR -> DB : UPDATE + INSERT ord_order_history
  DB --> OR : OK

  SS --> SC : TrackingResponse(status=IN_DELIVERY, shippedAt)
  deactivate SS
  SC --> Partner : 200 SUCCESS
  deactivate SC
end

@enduml
```

---

## 10. POST /api/admin/v1/claims/{claimId}/complete — 클레임 완료 처리

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/admin/v1/claims/{claimId}/complete — 클레임 완료

actor "CS 담당자" as Admin
participant "AdminClaimController" as ACC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "EventPublisher" as EP
database "DB (ord_claim)" as DB

Admin -> ACC : POST /api/admin/v1/claims/{claimId}/complete\n{memo}
activate ACC

ACC -> CS : completeClaim(adminId, claimId, memo)
activate CS

CS -> CR : findById(claimId)
CR -> DB : SELECT
DB --> CR : claim
CR --> CS : claim

alt 상태 != IN_PROGRESS
  CS --> ACC : 400 에러 (상태 불일치)
else
  CS -> CR : updateStatus(COMPLETED)
  CR -> DB : UPDATE
  DB --> CR : OK

  CS -> EP : publish(CLAIM_COMPLETED)
  note right of EP
    Payment → 부분/전액 환불
    Catalog → 재고 복원
    Member → 포인트 복원
  end note

  CS --> ACC : ClaimResponse(status=COMPLETED)
  deactivate CS
  ACC --> Admin : 200 SUCCESS
  deactivate ACC
end

@enduml
```

---

## 11. POST /api/admin/v1/orders/{orderId}/force-cancel — CS 예외 취소

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/admin/v1/orders/{orderId}/force-cancel — CS 예외 취소

actor "CS 담당자" as Admin
participant "AdminOrderController" as AOC
participant "OrderService" as OS
participant "OrderRepository" as OR
participant "EventPublisher" as EP
database "DB (ord_*)" as DB

Admin -> AOC : POST /api/admin/v1/orders/{orderId}/force-cancel\n{reason}
activate AOC

AOC -> OS : forceCancel(adminId, orderId, reason)
activate OS

OS -> OR : findById(orderId)
OR -> DB : SELECT
DB --> OR : order
OR --> OS : order

OS -> OR : updateStatus(CANCELLED, reason, changedBy=adminId)
OR -> DB : UPDATE + INSERT ord_order_history
DB --> OR : OK

OS -> EP : publish(ORDER_CANCELLED)
note right of EP
  Payment → 환불 요청
  Catalog → 재고 복원
end note

OS --> AOC : CancelResponse(status=CANCELLED, refundAmount)
deactivate OS
AOC --> Admin : 200 SUCCESS
deactivate AOC

@enduml
```

---

## 12. POST /api/v1/claims/{claimId}/shipping-payment — 클레임 배송비 결제

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/claims/{claimId}/shipping-payment — 클레임 배송비 결제

actor 고객 as Client
participant "ClaimPaymentController" as CPC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "ClaimPaymentRepository" as CPR
participant "PromotionPublicApi" as PROMO
participant "PaymentPublicApi" as PAY
participant "EventPublisher" as EP
database "DB (ord_claim*)" as DB

Client -> CPC : POST /api/v1/claims/{claimId}/shipping-payment\n{paymentType, paymentMethodId, couponId, amount}
activate CPC

CPC -> CS : payShippingFee(memberId, claimId, request)
activate CS

CS -> CR : findById(claimId)
CR -> DB : SELECT
DB --> CR : claim
CR --> CS : claim

alt 상태 != PAYMENT_PENDING
  CS --> CPC : INVALID_STATUS
  CPC --> Client : 400 에러
else 결제 기한 24시간 초과
  CS --> CPC : PAYMENT_EXPIRED
  CPC --> Client : 400 에러
else 정상

  alt 쿠폰 적용
    CS -> PROMO : applyCoupon(couponId, amount)
    PROMO --> CS : discountedAmount (0원 가능)
  end

  alt 실결제금액 > 0
    CS -> PAY : requestPayment(claimId, paidAmount, method)
    activate PAY
    alt PG 실패
      PAY --> CS : PAYMENT_FAILED
      CS --> CPC : 400 에러
      CPC --> Client : 400 에러
    else 성공
      PAY --> CS : approved
      deactivate PAY
    end
  end

  CS -> CPR : save(claimPayment{status=PAID})
  CPR -> DB : INSERT ord_claim_payment
  CS -> CR : updateStatus(PICKUP)
  CR -> DB : UPDATE ord_claim

  CS -> EP : publish(CLAIM_SHIPPING_PAID)

  CS --> CPC : PaymentResult
  deactivate CS
  CPC --> Client : 200 SUCCESS
  deactivate CPC
end

@enduml
```

---

## 13. POST /api/admin/v1/claims/{claimId}/refund — 환불 처리

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/admin/v1/claims/{claimId}/refund — 환불 처리

actor "CS 담당자" as Admin
participant "AdminClaimController" as ACC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "PaymentPublicApi" as PAY
participant "EventPublisher" as EP
database "DB (ord_claim)" as DB

Admin -> ACC : POST /api/admin/v1/claims/{claimId}/refund\n{refundMethod, bankAccount}
activate ACC

ACC -> CS : processRefund(adminId, claimId, request)
activate CS

CS -> CR : findById(claimId)
CR -> DB : SELECT
DB --> CR : claim
CR --> CS : claim

alt 상태 != PICKED_UP
  CS --> ACC : INVALID_STATUS (수거완료 상태만 환불 가능)
  ACC --> Admin : 400 에러
else 정상

  alt refundMethod == ORIGINAL
    CS -> PAY : requestRefund(orderId, amount)
    activate PAY
    PAY --> CS : refundSuccess
    deactivate PAY
  else refundMethod == BANK_TRANSFER
    CS -> CS : 입금정보 저장 (bankAccount)\n이체는 담당자 수동 진행
  end

  CS -> CR : updateStatus(REFUNDED)
  CR -> DB : UPDATE ord_claim

  CS -> EP : publish(CLAIM_REFUNDED)
  note right of EP: → Notification(환불완료 알림톡+이메일)

  CS --> ACC : RefundResult
  deactivate CS
  ACC --> Admin : 200 SUCCESS
  deactivate ACC
end

@enduml
```

---

## 14. POST /api/partner/v1/claims/{claimId}/inspect-pass — 품질점검 합격

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/claims/{claimId}/inspect-pass — 품질점검 합격

actor 판매자 as Partner
participant "PartnerClaimController" as PCC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
database "DB (ord_claim)" as DB

Partner -> PCC : POST /api/partner/v1/claims/{claimId}/inspect-pass\n{memo}
activate PCC

PCC -> CS : inspectPass(vendorId, claimId, memo)
activate CS

CS -> CR : findById(claimId)
CR -> DB : SELECT
DB --> CR : claim
CR --> CS : claim

alt 상태 != INSPECTING
  CS --> PCC : INVALID_STATUS (품질점검 상태만 합격 가능)
  PCC --> Partner : 400 에러
else 정상
  CS -> CR : updateStatus(PICKED_UP, memo)
  CR -> DB : UPDATE ord_claim
  DB --> CR : OK

  CS --> PCC : InspectResult(status=PICKED_UP)
  deactivate CS
  PCC --> Partner : 200 SUCCESS
  deactivate PCC
end

@enduml
```

---

## 15. POST /api/partner/v1/claims/{claimId}/inspect-reject — 품질점검 거부

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/claims/{claimId}/inspect-reject — 품질점검 거부

actor 판매자 as Partner
participant "PartnerClaimController" as PCC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
database "DB (ord_claim)" as DB

Partner -> PCC : POST /api/partner/v1/claims/{claimId}/inspect-reject\n{rejectReason}
activate PCC

PCC -> CS : inspectReject(vendorId, claimId, rejectReason)
activate CS

alt rejectReason 누락
  CS --> PCC : REASON_REQUIRED
  PCC --> Partner : 400 에러
else

  CS -> CR : findById(claimId)
  CR -> DB : SELECT
  DB --> CR : claim
  CR --> CS : claim

  alt 상태 != INSPECTING
    CS --> PCC : INVALID_STATUS
    PCC --> Partner : 400 에러
  else 정상
    CS -> CR : updateStatus(PICKUP_REJECTED, rejectReason)
    CR -> DB : UPDATE ord_claim
    DB --> CR : OK

    CS --> PCC : InspectResult(status=PICKUP_REJECTED)
    deactivate CS
    PCC --> Partner : 200 SUCCESS
    deactivate PCC
  end
end

@enduml
```

---

## 작성 규칙

| 규칙 | 설명 |
|---|---|
| 1 시퀀스 = 1 API endpoint | 인터페이스 명세의 endpoint와 1:1 |
| 참여자 = 클래스 후보 | Controller, Service, Repository, PublicApi, EventPublisher |
| 트랜잭션 경계 표시 | Service 레벨에서 @Transactional |
| 에러 분기 포함 | 인터페이스 명세의 에러 응답과 대응 |
| 도메인 경계 명시 | 타 도메인 호출은 PublicApi(동기) 또는 EventPublisher(비동기)로 표현 |

---

## 근거

| 항목 | 출처 |
|---|---|
| API endpoint | 인터페이스 명세(⑮) 27개 API 중 주요 11개 상세화 |
| 에러 분기 | GWT(⑬) 예외 시나리오 |
| 도메인 간 호출 | 이벤트 플로우(⑫) 동기/비동기 판단 |
| 참여 객체 | ERD(⑨) 엔티티 + 컴포넌트(③) 모듈 구조 |
| 상태 전이 | 상태머신(⑩) 전이 규칙 |
