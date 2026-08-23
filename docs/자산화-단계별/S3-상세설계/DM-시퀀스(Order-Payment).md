# 시퀀스 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Design  
>
> **작성 목적**: 인터페이스 명세(DL)의 API를 호출 순서·참여 객체·트랜잭션 경계로 구체화한다.  
> "이 API가 호출되면 내부에서 어떤 순서로 어떤 객체가 상호작용하는가"를 확정한다.
>
> **흐름 내 위치**:
> ```
> DL 인터페이스 명세 → DM 시퀀스 → DN 화면 레이아웃 / DP 클래스 설계
> ```

---

## 공통 규칙 (C3 아키텍처컨벤션 / C5 이벤트설계컨벤션 준수)

### 1. Controller 네이밍 (C3 §4.2)

> 모든 시퀀스의 Controller participant는 **앱별로 분리된 이름**을 사용한다 (Service는 공유).
> `{App}{Domain}Controller` 형식 — 예: `CustomerOrderController`(고객웹), `AdminOrderController`(어드민), `PartnerOrderController`(입점사).
> 이하 다이어그램의 `CustomerCartController`, `CustomerOrderController`, `CustomerClaimController`, `CustomerClaimPaymentController`, `PartnerOrderController`, `PartnerShippingController`, `PartnerClaimController`, `AdminOrderController`, `AdminClaimController`가 이 규칙을 따른다.

### 2. EventPublisher = Outbox 패턴 표현 (C5 §5.1)

> 본 문서의 시퀀스에서 `Service -> EventPublisher : publish(EVENT_NAME)` 호출은
> **"비즈니스 데이터 변경과 동일 트랜잭션 내에서 Outbox 테이블에 이벤트를 저장하는 행위"**를 축약 표현한 것이다.
> 즉 `EventPublisher.publish(...)`는 `outboxRepository.save(OutboxEvent(...))`와 동일 트랜잭션에서 실행되며,
> 실제 Broker(또는 프로토타입의 in-process ApplicationEventPublisher) 발행은 별도의 **Outbox Publisher**가
> Outbox 테이블을 polling(1초 주기)하여 비동기로 수행한다(C5 §5.1~§5.3).
>
> ```
> [Service 트랜잭션]                    [Outbox Publisher (비동기, 별도 프로세스)]
> 1. 비즈니스 데이터 변경                  Outbox 테이블 polling
> 2. EventPublisher.publish(...)   ──▶   → Broker 발행 (프로토타입: ApplicationEvent)
>    = Outbox 테이블 INSERT               → 발행 완료 시 Outbox row 삭제
> 3. COMMIT (1·2 원자적)
> ```
>
> 프로토타입 단계에서는 C5 §5.3에 따라 Outbox 테이블 대신 in-process `ApplicationEventPublisher`를 사용하므로,
> 아래 다이어그램의 `EventPublisher` 참여자는 실 프로젝트 전환 시 `OutboxEventPublisher`(Outbox INSERT) + `OutboxPublisher`(polling·발행) 2단계로 분리된다.
> 컨슈머 측 멱등 처리(`processed_event` 테이블, eventId UNIQUE)는 C5 §6.1을 따른다.

---

## 1. [API] POST /api/v1/cart/items — 장바구니 담기

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/cart/items — 장바구니 담기

actor 고객 as Client
participant "CustomerCartController" as CC
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

## 2. [API] GET /api/v1/cart — 장바구니 조회

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title GET /api/v1/cart — 장바구니 조회

actor 고객 as Client
participant "CustomerCartController" as CC
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

## 3. [API] POST /api/v1/orders/sheet — 주문서 생성

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/sheet — 주문서 생성

actor 고객 as Client
participant "CustomerOrderController" as OC
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

## 4. [API] POST /api/v1/orders/{orderSheetId}/pay — 결제 요청

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderSheetId}/pay — 결제 요청

actor 고객 as Client
participant "CustomerOrderController" as OC
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

== 주문 접수 (동기) ==
OS -> OR : updateStatus(ORDER_RECEIVED)
OR -> DB : UPDATE status

== 재고 선점 (동기) ==
OS -> CAT : reserveStock(items)
activate CAT
alt 재고 부족
  CAT --> OS : STOCK_NOT_AVAILABLE
  OS -> OR : updateStatus(STOCK_FAILED)
  OS --> OC : 400 에러
  OC --> Client : 400 STOCK_NOT_AVAILABLE
else 재고 선점 성공
  CAT --> OS : 선점 성공
  deactivate CAT
  OS -> OR : updateStatus(PAYMENT_PENDING)

  == 결제 요청 접수 (동기 — PG 승인은 비동기) ==
  OS -> PAY : requestPayment(orderId, amount, method, cardHash)
  activate PAY
  PAY -> PAY : checkCardRestriction(cardHash)\n(REQ-PAY-018, pay_card_restriction 조회)
  alt 카드 당일 차단 상태
    PAY --> OS : CARD_RESTRICTED
    OS --> OC : CARD_RESTRICTED
    OC --> Client : 400 에러\n"카드가 당일 결제 제한 상태입니다"
  else 정상
    PAY -> PAY : PG 승인 요청 큐 등록\n(재시도 최대 3회, 타임아웃 30초 — Payment 내부 비동기 처리)
    PAY --> OS : 접수됨 (paymentId)
    deactivate PAY
    OS --> OC : 202 접수 (status=PAYMENT_PENDING)
    OC --> Client : 200 SUCCESS\n"결제 진행 중" 화면 즉시 이동
  end
end
deactivate OS
deactivate OC

note right of PAY
  PG 승인 성공/실패 결과는 이 응답에 포함되지 않는다.
  Payment가 비동기로 PAYMENT_APPROVED/PAYMENT_FAILED
  이벤트를 발행하면 §16에서 소비해 최종 상태를 확정한다.
  PG 콜백 처리 자체는 §4-1 참조.
end note

@enduml
```

---

## 4-1. [컨슈머] Payment 내부 — PG 콜백 처리 (비동기, 카드 실패 카운터 포함)

> 신규 (2026-08-21 바텀업 재검증): §4에서 "Payment 내부 비동기 처리"로 블랙박스 처리했던 부분을 구체화. REQ-PAY-023(카드 연속실패 카운터)이 여기서 실제로 호출된다.

- **트리거**: PG사 콜백(승인/실패 웹훅) 또는 Payment 자체 재시도 루프 종료
- **상태전이**: Payment `PENDING` → `PAID`(승인) / 재시도 소진 시 그대로 유지하며 `PAYMENT_FAILED` 이벤트만 발행(REQ-PAY-004). `pay_card_fail_counter` 증가(실패) 또는 0 리셋(성공)

```plantuml
@startuml
title [컨슈머] Payment 내부 — PG 콜백 처리 (카드 실패 카운터 포함)

participant "PgWebhookListener" as Webhook
participant "PaymentService" as PaySvc
participant "PaymentRepository" as PayRepo
participant "CardFailCounterRepository" as CFC
participant "EventPublisher" as Event

Webhook -> PaySvc : handlePgCallback(paymentId, result)
activate PaySvc

alt PG 승인 성공
    PaySvc -> PayRepo : updateStatus(PAID)
    PaySvc -> CFC : resetFailCount(cardHash)\n(REQ-PAY-023 — 성공 시 카운터 0으로 초기화)
    PaySvc -> Event : publish(PAYMENT_APPROVED)
else PG 승인 실패 (재시도 3회 소진, REQ-PAY-004)
    PaySvc -> CFC : incrementFailCount(cardHash)
    CFC --> PaySvc : consecutiveFailCount
    alt consecutiveFailCount >= 3
        PaySvc -> PayRepo : createCardRestriction(cardHash, today)\n(REQ-PAY-018, pay_card_restriction 생성)
        PaySvc -> CFC : resetFailCount(cardHash)\n(제한 레코드 생성 후 카운터 초기화)
    end
    PaySvc -> Event : publish(PAYMENT_FAILED)
end

deactivate PaySvc
@enduml
```

---

## 5. [API] POST /api/v1/orders/{orderId}/cancel — 고객 주문 취소

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderId}/cancel — 고객 주문 취소

actor 고객 as Client
participant "CustomerOrderController" as OC
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

## 6. [API] POST /api/v1/orders/{orderId}/confirm — 구매확정

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderId}/confirm — 구매확정

actor 고객 as Client
participant "CustomerOrderController" as OC
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

## 7. [API] POST /api/v1/orders/{orderId}/claims — 반품/교환 신청

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/orders/{orderId}/claims — 반품/교환 신청

actor 고객 as Client
participant "CustomerClaimController" as CC
participant "ClaimService" as CS
participant "OrderRepository" as OR
participant "ClaimRepository" as CR
participant "EventPublisher" as EP
database "DB (ord_*)" as DB

Client -> CC : POST /api/v1/orders/{orderId}/claims\n{claimType, reason, detailReason, responsibility, images[], exchangeSkuId?}
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
else responsibility=VENDOR 인데 images가 빈 배열
  CS --> CC : CLAIM_PHOTO_REQUIRED (REQ-ORD-058)
  CC --> Client : 400 에러
else claimType=EXCHANGE 인데 exchangeSkuId의 productId가 원 주문 상품과 다름
  CS --> CC : EXCHANGE_SKU_MISMATCH (REQ-ORD-070)
  CC --> Client : 400 에러
else 정상
  CS -> CR : save(newClaim{status=RECEIVED, submitted_responsibility=request.responsibility})
  CR -> DB : INSERT ord_claim
  note right of CR: submitted_responsibility는 고객 자진신고값으로 보존(REQ-ORD-076)\nCS 귀책판정(§7-1)의 최종 responsibility와 별도 컬럼
  CS -> CR : saveImages(claimId, images, uploadedBy=CUSTOMER)
  CR -> DB : INSERT ord_claim_image (uploaded_by=CUSTOMER, 최대 3장, REQ-ORD-075)
  DB --> CR : OK

  CS -> EP : publish(CLAIM_RECEIVED)
  note right of EP: Notification* → 고객 알림톡+이메일\n("클레임 접수 완료")

  CS --> CC : ClaimResponse(claimId, status)
  deactivate CS
  CC --> Client : 201 CREATED
  deactivate CC
end

@enduml
```

---

## 7-1. [API] POST /api/admin/v1/claims/{claimId}/blame-decision — 귀책 판정

> 신규 (2026-08-21 바텀업 재검증): 인터페이스명세(DL) §19-1에는 있었지만 시퀀스가 없던 것을 보완. CUSTOMER/VENDOR 분기와 EXCHANGE 재고선점 실패(REQ-ORD-069)까지 포함한 전체 분기를 다룬다.

- **트리거**: CS 담당자가 클레임 접수 내용을 확인하고 귀책을 확정
- **상태전이**: Claim `RECEIVED` → `PAYMENT_PENDING`(CUSTOMER) / `RECEIVED` 유지 + shipment(PICKUP) 생성 → 이후 §12/§14 경유 `INSPECTING`(VENDOR)

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/admin/v1/claims/{claimId}/blame-decision — 귀책 판정

actor "CS 담당자" as Admin
participant "AdminClaimController" as ACC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "CatalogPublicApi" as CAT
participant "ShipmentService" as Ship
participant "EventPublisher" as EP

Admin -> ACC : POST /api/admin/v1/claims/{claimId}/blame-decision\n{responsibility}
activate ACC

ACC -> CS : decideResponsibility(adminId, claimId, responsibility)
activate CS

CS -> CR : findById(claimId)
CR --> CS : claim(submitted_responsibility, claimType)

alt responsibility == CUSTOMER
  CS -> CR : updateResponsibility(responsibility)\nupdateStatus(PAYMENT_PENDING)
  note right of CR: submitted_responsibility는 그대로 유지(불변, REQ-ORD-076)\nresponsibility만 CS 확정값으로 갱신 — 고객 신고와 달라도 됨(REQ-ORD-066)
  CS -> EP : publish(CLAIM_SHIPPING_PAID 대기 알림)
else responsibility == VENDOR
  alt claimType == EXCHANGE
    CS -> CAT : reserveStock(exchangeSkuId)
    alt 재고 없음
      CAT --> CS : StockInsufficientException
      CS --> ACC : EXCHANGE_STOCK_UNAVAILABLE (REQ-ORD-069)
      ACC --> Admin : 409 에러\n"교환 가능한 재고가 없습니다"
    else 재고 확보
      CAT --> CS : success
      CS -> Ship : createShipment(refType=CLAIM, shipmentType=EXCHANGE_OUT)
      CS -> Ship : createShipment(refType=CLAIM, shipmentType=PICKUP)
      CS -> CR : updateResponsibility(responsibility)
      CS -> EP : publish(CLAIM_EXCHANGE_SHIPPED)
    end
  else claimType == RETURN/CANCEL
    CS -> Ship : createShipment(refType=CLAIM, shipmentType=PICKUP)
    CS -> CR : updateResponsibility(responsibility)
  end
end

CS --> ACC : ClaimResponse(responsibility, status)
deactivate CS
ACC --> Admin : 200 SUCCESS
deactivate ACC

@enduml
```

---

## 7-2. [API] POST /api/v1/claims/{claimId}/cancel — 고객 클레임 자진 취소

> 신규 (2026-08-21 바텀업 재검증): REQ-ORD-073/071 대응. RECEIVED/PAYMENT_PENDING 상태까지만 허용, INSPECTING 이후는 거부.

- **트리거**: 고객이 마이페이지 클레임상세에서 취소 요청
- **상태전이**: Claim `RECEIVED`/`PAYMENT_PENDING` → `REJECTED`(사유="고객 자진 철회")

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/claims/{claimId}/cancel — 고객 클레임 자진 취소

actor 고객 as Client
participant "CustomerClaimController" as CC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "NotificationPublicApi" as Noti

Client -> CC : POST /api/v1/claims/{claimId}/cancel
activate CC

CC -> CS : cancelClaim(memberId, claimId)
activate CS

CS -> CR : findById(claimId)
CR --> CS : claim(status)

alt status NOT IN [RECEIVED, PAYMENT_PENDING]
  CS --> CC : CLAIM_CANCEL_NOT_ALLOWED (REQ-ORD-071)
  CC --> Client : 400 에러\n"귀책 판정/수거 시작 이후에는 취소할 수 없습니다"
else 정상
  CS -> CR : updateStatus(REJECTED, reason="고객 자진 철회")
  CS -> Noti : sendKakaoAlimtalk("클레임 취소 완료")
  CS --> CC : ClaimResponse(status=REJECTED)
  deactivate CS
  CC --> Client : 200 SUCCESS
  deactivate CC
end

@enduml
```

---

## 8. [API] POST /api/partner/v1/orders/{orderId}/ship — 출고 처리

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/orders/{orderId}/ship — 출고 처리

actor 입점사 as Partner
participant "PartnerOrderController" as POC
participant "ShippingService" as SS
participant "OrderRepository" as OR
participant "ShipmentRepository" as SR
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

  SS -> SR : save(shipment{refType=ORDER, refId=orderId, type=OUTBOUND, status=PENDING})
  SR -> DB : INSERT ord_shipment
  DB --> SR : OK
  note right of SR: 배송 실행(운송장 등록·이동·완료)은\nord_shipment(v6, §3)가 전담.\n운송장 등록은 §9에서 PENDING→IN_TRANSIT 전이

  SS --> POC : ShipResponse(status=PREPARING)
  deactivate SS
  POC --> Partner : 200 SUCCESS
  deactivate POC
end

@enduml
```

---

## 9. [API] POST /api/partner/v1/shipping/{orderId} — 운송장 등록

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/shipping/{orderId} — 운송장 등록

actor 입점사 as Partner
participant "PartnerShippingController" as SC
participant "ShippingService" as SS
participant "ShipmentRepository" as SR
participant "EventPublisher" as EP
database "DB (ord_*)" as DB

Partner -> SC : POST /api/partner/v1/shipping/{orderId}\n{deliveryCompany, trackingNo}
activate SC

SC -> SS : registerTracking(vendorId, orderId, request)
activate SS

alt 운송장번호 누락
  SS --> SC : TRACKING_NO_REQUIRED
  SC --> Partner : 400 에러
else
  SS -> SR : updateStatus(refType=ORDER, refId=orderId, type=OUTBOUND,\nstatus=IN_TRANSIT, carrier, trackingNumber, shippedAt)
  SR -> DB : UPDATE ord_shipment (PENDING → IN_TRANSIT)
  DB --> SR : OK
  note right of SR: 주문 자체(ord_order.status)는 변경 없음 — PREPARING 유지.\n"배송 중" 표시는 PREPARING + shipment(OUTBOUND).status=IN_TRANSIT\n조인으로 화면에서 계산(상태머신DG v6 참조). 배송완료 파생 전환은 §19 배치 참조.

  SS -> EP : publish(SHIPPING_STARTED)
  note right of EP: Notification* → 고객 알림톡\n("상품 발송, 송장번호")

  SS --> SC : TrackingResponse(shipmentStatus=IN_TRANSIT, shippedAt)
  deactivate SS
  SC --> Partner : 200 SUCCESS
  deactivate SC
end

@enduml
```

---

## 10. [배치] 클레임 자동완료 — REFUNDED/DISPOSED → COMPLETED

- **트리거**: 스케줄러 (매 시간 정각)
- **상태전이**: Claim `REFUNDED` → `COMPLETED`, Claim `DISPOSED` → `COMPLETED` (배치 자동 전환)
- **비고**: 14상태 모델(DG)에는 어드민이 직접 호출하는 "클레임 완료" API가 없다. `PICKED_UP → REFUNDED`는 §13(환불 처리), `PICKUP_REJECTED → DISPOSED`는 §20(폐기 처리)에서 각각 어드민이 수행하고, `REFUNDED`/`DISPOSED`에 도달한 클레임은 본 배치가 주기적으로 스캔해 `COMPLETED`로 자동 전환한다. `RETURN_PAYMENT_PENDING → COMPLETED`(shipment(RETURN) DELIVERED 기준) 자동전환은 택배사 반송완료 확인과 같은 배치에서 처리하므로 §19를 참조.

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title [배치] 클레임 자동완료 (REFUNDED/DISPOSED → COMPLETED)

participant "Scheduler\n(ClaimAutoCompleteBatch)" as Batch
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "CatalogPublicApi" as CAT
participant "MemberPublicApi" as MEM
participant "EventPublisher" as EP
participant "NotificationPublicApi" as Noti
database "DB (ord_claim)" as DB

Batch -> CS : autoCompleteClaims()
activate CS

CS -> CR : findByStatusIn([REFUNDED, DISPOSED])
CR -> DB : SELECT
DB --> CR : List<Claim>
CR --> CS : claims

loop 각 클레임
  CS -> CR : updateStatus(COMPLETED)
  CR -> DB : UPDATE
  DB --> CR : OK

  CS -> EP : publish(CLAIM_COMPLETED)

  alt claimType == RETURN && 이전상태 == REFUNDED
    CS -> CAT : restoreStock(claimId, originalSkuItems)
    note right of CAT: RETURN: 원 SKU 재고 복원\n(EXCHANGE는 §14 검수합격 시점에 선반영됨)
  end
  CS -> MEM : restorePoints(claimId)\n(사용 포인트 복원, 해당 시)

  CS -> Noti : sendKakaoAlimtalk("클레임 완료 안내")
end

deactivate CS
@enduml
```

---

## 11. [API] POST /api/admin/v1/orders/{orderId}/force-cancel — CS 예외 취소

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

## 12. [API] POST /api/v1/claims/{claimId}/shipping-payment — 클레임 배송비 결제

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/v1/claims/{claimId}/shipping-payment — 클레임 배송비 결제

actor 고객 as Client
participant "CustomerClaimPaymentController" as CPC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "ClaimPaymentRepository" as CPR
participant "ShipmentRepository" as SR
participant "PromotionPublicApi" as PROMO
participant "PaymentPublicApi" as PAY
participant "CatalogPublicApi" as CAT
participant "CourierApi\n(택배사 외부API)" as Courier
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

alt 상태 not in (PAYMENT_PENDING, RETURN_PAYMENT_PENDING)
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

  CS -> CPR : save(claimPayment{status=PAID, paymentType})
  CPR -> DB : INSERT ord_claim_payment

  alt paymentType == PICKUP
    CS -> SR : save(shipment{refType=CLAIM, refId=claimId, type=PICKUP, status=PENDING})
    SR -> DB : INSERT ord_shipment
    DB --> SR : OK
    note right of CR: claim.status는 PAYMENT_PENDING 유지 (변경 없음).\n수거 shipment 입고확인 시 §19 배치가\nshipmentRepo.updateStatus(DELIVERED) + claimRepo.updateStatus(INSPECTING)을\n함께 호출해 파생 전환한다.

    CS -> EP : publish(CLAIM_SHIPPING_PAID)
    note right of EP: Notification* → 고객 알림톡+이메일\n("배송비 결제 완료, 수거 진행")

    alt claimType == EXCHANGE
      CS -> CAT : reserveExchangeStock(claimId, exchangeSkuItems)
      activate CAT
      CAT --> CS : success
      deactivate CAT

      CS -> Courier : requestReShipment(claimId, address)\n(교환상품 선출고 — 원상품 수취 이전, 맞교환 원칙)
      Courier --> CS : trackingRegistered

      CS -> SR : save(shipment{refType=CLAIM, refId=claimId, type=EXCHANGE_OUT, status=IN_TRANSIT, trackingNo})
      SR -> DB : INSERT ord_shipment
      DB --> SR : OK
      note right of SR: 귀책판정 완료 시점(본 케이스는 고객귀책+배송비결제 완료 시점)에\nshipment(EXCHANGE_OUT) 병렬 생성 — 맞교환 원칙(REQ-ORD-056).\nclaim.status에는 영향 없음(§10 배치 참조)

      CS -> EP : publish(CLAIM_EXCHANGE_SHIPPED)
      note right of EP: Notification* → 교환상품 발송 알림톡\n(원 SKU 재고 복원은 §14 검수합격 시점)
    end
  else paymentType == RETURN
    CS -> CR : recordReturnPaymentPaid(claimId)
    CR -> DB : UPDATE ord_claim (returnPaymentPaidAt)
    note right of CR: 상태는 RETURN_PAYMENT_PENDING 유지 (변경 없음)

    CS -> SR : save(shipment{refType=CLAIM, refId=claimId, type=RETURN, status=PENDING})
    SR -> DB : INSERT ord_shipment
    DB --> SR : OK
    note right of SR: 입점사 [반송운송장등록] 시 PENDING→IN_TRANSIT.\n택배사 반송완료 확인 시 §19 배치가 shipmentRepo.updateStatus(DELIVERED)\n호출 → 이어서 같은 배치가 claim을 COMPLETED로 자동전환

    CS -> EP : publish(CLAIM_RETURN_SHIPPING_PAID)
    note right of EP: Notification* → 고객 알림톡+이메일\n("반송 배송비 결제 완료")
  end

  CS --> CPC : PaymentResult
  deactivate CS
  CPC --> Client : 200 SUCCESS
  deactivate CPC
end

@enduml
```

---

## 13. [API] POST /api/admin/v1/claims/{claimId}/refund — 환불 처리

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

## 14. [API] POST /api/partner/v1/claims/{claimId}/inspect-pass — 품질점검 합격

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/claims/{claimId}/inspect-pass — 품질점검 합격

actor 입점사 as Partner
participant "PartnerClaimController" as PCC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "CatalogPublicApi" as CAT
participant "EventPublisher" as EP
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
  note right of CS
    합격 판정 기준(DG v4)
    RETURN: 상품 상태 양호(훼손 없음)
    EXCHANGE: 택(TAG) 유지 여부
  end note

  CS -> CR : updateStatus(PICKED_UP, memo)
  CR -> DB : UPDATE ord_claim
  DB --> CR : OK

  alt claimType == EXCHANGE
    CS -> CAT : restoreStock(claimId, originalSkuItems)
    activate CAT
    CAT --> CS : success
    deactivate CAT
    note right of CAT: 원상품 재고 복원\n(교환 SKU는 §12 귀책판정 완료 시점에 shipment(EXCHANGE_OUT)으로\n이미 선출고·차감됨 — 맞교환 원칙)

    CS -> EP : publish(CLAIM_COMPLETED)
    note right of EP
      Notification* → 교환 완료 알림 (원상품 회수·검수 종료)
      claimType=EXCHANGE는 환불 대상이 아니므로
      §13(환불) 없이 §10 배치에서 최종 COMPLETED 반영
    end note
  else claimType == RETURN
    note right of CS: 원 SKU 재고복원·CLAIM_COMPLETED 발행은\n어드민 환불(§13, PICKED_UP→REFUNDED) 이후\n§10 배치(REFUNDED→COMPLETED)에서 수행
  end

  CS --> PCC : InspectResult(status=PICKED_UP)
  deactivate CS
  PCC --> Partner : 200 SUCCESS
  deactivate PCC
end

@enduml
```

---

## 15. [API] POST /api/partner/v1/claims/{claimId}/inspect-reject — 품질점검 거부

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/claims/{claimId}/inspect-reject — 품질점검 거부

actor 입점사 as Partner
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

## 16. [컨슈머] PAYMENT_APPROVED/PAYMENT_FAILED 이벤트 수신 — 결제 완료·실패 후처리

> v2 (2026-08-21 현행화): 재고선점은 §4(결제 요청)에서 이미 완료된 상태이므로 이 컨슈머는 재고 호출을 하지 않는다. 상태전이도 REQ-ORD-013/014에 맞게 `PAYMENT_PENDING→PAYMENT_COMPLETED`/`PAYMENT_FAILED`로 정정(구모델 `ORDER_RECEIVED`/`ORDER_FAILED` 제거).

- **트리거**: Payment 도메인 → `PAYMENT_APPROVED` 또는 `PAYMENT_FAILED` 이벤트 발행
- **세부UC 참조**: [주문접수] UC-ORD-004 결제완료 후처리
- **상태전이**: Order `PAYMENT_PENDING` → `PAYMENT_COMPLETED`(승인) / `PAYMENT_FAILED`(실패, REQ-ORD-014)

```plantuml
@startuml
title [컨슈머] PAYMENT_APPROVED/PAYMENT_FAILED 수신 — 결제 완료·실패 후처리

participant "EventListener\n(OrderPaymentEventListener)" as Listener
participant "OrderService" as Service
participant "OrderRepository" as Repo
participant "CatalogPublicApi" as Catalog
participant "EventPublisher" as Event
participant "NotificationPublicApi" as Noti

alt PAYMENT_APPROVED 수신
    Listener -> Service : handlePaymentApproved(orderId, paymentId)
    activate Service
    Service -> Repo : findById(orderId)
    Repo --> Service : Order(status=PAYMENT_PENDING)
    Service -> Repo : updateStatus(PAYMENT_COMPLETED)
    Service -> Event : publish(ORDER_PAID)
    Service -> Noti : sendKakaoAlimtalk("주문확인")
    Service -> Noti : sendEmail("주문확인")
    deactivate Service
else PAYMENT_FAILED 수신 (PG 3회 재시도 소진)
    Listener -> Service : handlePaymentFailed(orderId, paymentId, reason)
    activate Service
    Service -> Repo : findById(orderId)
    Repo --> Service : Order(status=PAYMENT_PENDING)
    Service -> Catalog : restoreStock(items)
    Service -> Repo : updateStatus(PAYMENT_FAILED)
    Service -> Noti : sendKakaoAlimtalk("결제 실패 안내")
    deactivate Service
end
@enduml
```

---

## 17. [배치] D+7 자동구매확정 — 배송완료 후 7일 경과

- **트리거**: 스케줄러 (매일 02:00)
- **세부UC 참조**: [구매확정] UC-ORD-006 자동구매확정
- **상태전이**: Order `DELIVERED` → `CONFIRMED` (Payment 상태는 변경 없음 — 정산은 Settlement 도메인이 `ORDER_CONFIRMED` 이벤트를 구독해 비동기 처리)

```plantuml
@startuml
title [배치] D+7 자동구매확정

participant "Scheduler\n(AutoConfirmBatch)" as Batch
participant "OrderService" as Service
participant "OrderRepository" as Repo
participant "EventPublisher" as Event
participant "NotificationPublicApi" as Noti

Batch -> Service : autoConfirmDelivered()
activate Service

Service -> Repo : findDeliveredBefore(now - 7days)
Repo --> Service : List<Order>

loop 각 주문
    Service -> Repo : updateStatus(CONFIRMED)
    Service -> Event : publish(ORDER_CONFIRMED)
    note right: → Settlement(정산 확정)\n→ Member(포인트 적립)
    Service -> Noti : sendKakaoAlimtalk("자동구매확정 안내")
end

deactivate Service
@enduml
```

---

## 18. [배치] 배송비결제 24시간 만료 — 미결제 클레임 자동취소

- **트리거**: 스케줄러 (매 시간 정각)
- **세부UC 참조**: [클레임접수] UC-ORD-012 배송비 결제기한 만료
- **상태전이**: Claim `PAYMENT_PENDING` → `PAYMENT_EXPIRED`

```plantuml
@startuml
title [배치] 배송비결제 24시간 만료

participant "Scheduler\n(ShippingPaymentExpiryBatch)" as Batch
participant "ClaimService" as Service
participant "ClaimRepository" as Repo
participant "ClaimPaymentRepository" as PayRepo
participant "EventPublisher" as Event
participant "NotificationPublicApi" as Noti

Batch -> Service : expireUnpaidShippingFees()
activate Service

Service -> PayRepo : findPendingExpiredBefore(now)
PayRepo --> Service : List<ClaimPayment>(status=PENDING, expired_at < now)

loop 각 미결제 건
    Service -> Repo : updateClaimStatus(PAYMENT_EXPIRED)
    Service -> PayRepo : updatePaymentStatus(EXPIRED)
    Service -> Event : publish(CLAIM_PAYMENT_EXPIRED)
    Service -> Noti : sendKakaoAlimtalk("배송비 미결제로 클레임 취소")
end

deactivate Service
@enduml
```

---

## 18-1. [배치] RECEIVED 24시간 CS 미처리 리마인드

> 신규 (2026-08-21 바텀업 재검증): REQ-ORD-068 대응. 지금까지는 화면 대시보드 집계 표시만 있고 실제 발송 배치가 없었다.

- **트리거**: 스케줄러 (매 시간 정각)
- **세부UC 참조**: [클레임접수] CS 접수확인 SLA
- **상태전이**: 없음 (알림만 발송, claim.status는 RECEIVED 유지)

```plantuml
@startuml
title [배치] RECEIVED 24시간 CS 미처리 리마인드

participant "Scheduler\n(ClaimReceivedSlaBatch)" as Batch
participant "ClaimService" as Service
participant "ClaimRepository" as Repo
participant "NotificationPublicApi" as Noti

Batch -> Service : remindUnprocessedReceived()
activate Service

Service -> Repo : findByStatusAndCreatedBefore(RECEIVED, now - 24h)
Repo --> Service : List<Claim>

loop 각 미처리 클레임 (last_reminded_at이 24h 이상 지났거나 NULL인 건만)
    Service -> Noti : sendAdminAlert("접수 24시간 경과 미처리 클레임", claimId)
    Service -> Repo : updateLastRemindedAt(now)
    note right of Noti: CS 대시보드 "미처리임박" 집계(DN-화면레이아웃)의 실제 발송 트리거
end

deactivate Service
@enduml
```

---

## 19. [배치] 배송상태 갱신 — 택배사 API 조회 (60분 주기)

- **트리거**: 스케줄러 (매 60분)
- **세부UC 참조**: [배송관리] UC-ORD-008 배송상태 동기화
- **상태전이**: `ord_shipment.status` `IN_TRANSIT` → `DELIVERED`/`FAILED` (v6, 배송 실행 전용·order/claim 공용). 파생 전환: Order `PREPARING` → `DELIVERED`(shipment type=OUTBOUND 구독), Claim `PAYMENT_PENDING`/`INSPECTING` 진입(shipment type=PICKUP 구독), Claim `RETURN_PAYMENT_PENDING` → `COMPLETED`(shipment type=RETURN 구독)

```plantuml
@startuml
title [배치] 배송상태 갱신 (60분 주기, v6 — ord_shipment 전용)

participant "Scheduler\n(ShipmentStatusSyncBatch)" as Batch
participant "ShipmentService" as Service
participant "ShipmentRepository" as Repo
participant "CourierApi\n(택배사 외부API)" as Courier
participant "ClaimRepository" as ClaimRepo
participant "OrderRepository" as OrderRepo
participant "EventPublisher" as Event
participant "NotificationPublicApi" as Noti

Batch -> Service : syncShipmentStatus()
activate Service

Service -> Repo : findByStatus(IN_TRANSIT)
Repo --> Service : List<Shipment>(shipment_type IN [OUTBOUND, PICKUP, RETURN, EXCHANGE_OUT])

loop 각 배송건
    Service -> Courier : getTrackingStatus(trackingNo)
    Courier --> Service : TrackingResult

    alt 배송완료
        Service -> Repo : updateStatus(DELIVERED)
        Repo -> Repo : (DB) UPDATE ord_shipment

        alt shipment_type == OUTBOUND
            Service -> Event : publish(SHIPMENT_DELIVERED, refType=ORDER, refId=orderId)
            note right of Event: order.status는 이 배치가 직접 갱신하지 않는다.\nOrderService가 이벤트를 구독해 파생 전환(아래 == 섹션 참조) — 2단계 분리
            Service -> Noti : sendKakaoAlimtalk("배송완료 안내")
        else shipment_type == PICKUP
            Service -> ClaimRepo : updateStatus(INSPECTING)
            note right of ClaimRepo: claim.status PAYMENT_PENDING 또는 RECEIVED(입점사귀책)\n→ INSPECTING. shipmentRepo.updateStatus(DELIVERED)와\n같은 트랜잭션에서 함께 호출(§12 참조)
            Service -> Noti : sendKakaoAlimtalk("수거완료, 품질점검 진행 안내")
        else shipment_type == RETURN
            note right of Service: claim.status는 변경하지 않음(RETURN_PAYMENT_PENDING 유지)\nCOMPLETED 자동전환은 아래 "클레임 자동완료" 섹션에서 별도 처리
            Service -> Noti : sendKakaoAlimtalk("반송 배송완료 안내")
        else shipment_type == EXCHANGE_OUT
            note right of Service: claim.status 영향 없음\n(교환상품 발송 완료, 맞교환 원칙 — §12/§14 참조)
            Service -> Noti : sendKakaoAlimtalk("교환상품 배송완료 안내")
        end
    else 배송실패/반송 신호
        Service -> Repo : updateStatus(FAILED)
        Repo -> Repo : (DB) UPDATE ord_shipment
        Service -> Noti : sendKakaoAlimtalk("배송 실패 안내, CS 확인 요청")
    else 상태변경 없음
        note right: skip
    end
end

== 주문 배송완료 파생 전환 (OrderService, SHIPMENT_DELIVERED 이벤트 구독) ==

Event -> OrderRepo : updateStatus(DELIVERED)\n(shipment type=OUTBOUND 구독분만, orderId 기준)
OrderRepo -> OrderRepo : (DB) UPDATE ord_order
note right of OrderRepo: D+7 자동확정 타이머 시작(§17), 고객 알림톡

== 클레임 자동완료 (RETURN_PAYMENT_PENDING → COMPLETED, shipment(RETURN) DELIVERED 기준 배치 자동전환) ==

Service -> ClaimRepo : findByStatusWithReturnShipmentDelivered(RETURN_PAYMENT_PENDING)
ClaimRepo --> Service : List<Claim>(연관 shipment(RETURN).status = DELIVERED)

loop 각 클레임 (CLAIM_REFUNDED류 알림톡 발행 패턴 참고)
    Service -> ClaimRepo : updateStatus(COMPLETED)
    Service -> Event : publish(CLAIM_COMPLETED)
    Service -> Noti : sendKakaoAlimtalk("클레임 완료 안내")
end

deactivate Service
@enduml
```

---

## 20. [API] POST /api/admin/v1/claims/{claimId}/dispose — 폐기 처리

- **트리거**: 어드민 수동 처리 (품질점검 불합격 건 중 반송 불가 판단)
- **상태전이**: Claim `PICKUP_REJECTED` → `DISPOSED`

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/admin/v1/claims/{claimId}/dispose — 폐기 처리

actor "CS 담당자" as Admin
participant "AdminClaimController" as ACC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "EventPublisher" as EP
database "DB (ord_claim)" as DB

Admin -> ACC : POST /api/admin/v1/claims/{claimId}/dispose\n{reason}
activate ACC

ACC -> CS : disposeClaim(adminId, claimId, reason)
activate CS

CS -> CR : findById(claimId)
CR -> DB : SELECT
DB --> CR : claim
CR --> CS : claim

alt 상태 != PICKUP_REJECTED
  CS --> ACC : INVALID_STATUS (품질점검 거부 건만 폐기 가능)
  ACC --> Admin : 400 에러
else 정상
  CS -> CR : updateStatus(DISPOSED, reason)
  CR -> DB : UPDATE ord_claim

  CS -> EP : publish(CLAIM_DISPOSED)
  note right of EP: Notification* → 고객 알림톡\n("상품 폐기 처리됨")\nDISPOSED→COMPLETED 자동전환은 §10 배치 참조

  CS --> ACC : ClaimResponse(status=DISPOSED)
  deactivate CS
  ACC --> Admin : 200 SUCCESS
  deactivate ACC
end

@enduml
```

---

## 21. [API] POST /api/admin/v1/claims/{claimId}/request-return-payment — 반송 배송비 추가결제 요청

- **트리거**: 어드민 수동 처리 (품질점검 불합격 건 중 반송 가능 판단)
- **상태전이**: Claim `PICKUP_REJECTED` → `RETURN_PAYMENT_PENDING`

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/admin/v1/claims/{claimId}/request-return-payment — 반송 배송비 추가결제 요청

actor "CS 담당자" as Admin
participant "AdminClaimController" as ACC
participant "ClaimService" as CS
participant "ClaimRepository" as CR
participant "EventPublisher" as EP
database "DB (ord_claim)" as DB

Admin -> ACC : POST /api/admin/v1/claims/{claimId}/request-return-payment\n{amount}
activate ACC

ACC -> CS : requestReturnPayment(adminId, claimId, amount)
activate CS

CS -> CR : findById(claimId)
CR -> DB : SELECT
DB --> CR : claim
CR --> CS : claim

alt 상태 != PICKUP_REJECTED
  CS --> ACC : INVALID_STATUS (품질점검 거부 건만 반송 요청 가능)
  ACC --> Admin : 400 에러
else 정상
  CS -> CR : updateStatus(RETURN_PAYMENT_PENDING, amount)
  CR -> DB : UPDATE ord_claim

  CS -> EP : publish(CLAIM_RETURN_PAYMENT_REQUESTED)
  note right of EP: Notification* → 고객 알림톡\n("반송 배송비 결제 필요")\n고객 결제는 §12(paymentType=RETURN)에서 처리\n24시간 미결제 시 §18 배치가 PAYMENT_EXPIRED로 자동취소

  CS --> ACC : ClaimResponse(status=RETURN_PAYMENT_PENDING)
  deactivate CS
  ACC --> Admin : 200 SUCCESS
  deactivate ACC
end

@enduml
```

---

## 22. [API] POST /api/partner/v1/shipping/{shipmentId}/reship — 배송 실패 재발송 처리 (신규)

> v6 후속 보완 (2026-08-21): REQ-ORD-062 대응. FAILED 상태의 shipment(어떤 shipment_type이든 공통)를 재발송 처리한다.

- **트리거**: 입점사 또는 CS 담당자 수동 처리 (§19 배치가 FAILED로 전환한 건)
- **상태전이**: `ord_shipment.status` `FAILED` → `PENDING` → (운송장 재등록 시) `IN_TRANSIT`

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontSize 11
title POST /api/partner/v1/shipping/{shipmentId}/reship — 배송 실패 재발송 처리

actor "입점사 / CS 담당자" as Actor
participant "PartnerShippingController" as SC
participant "ShipmentService" as Service
participant "ShipmentRepository" as Repo
database "DB (ord_shipment)" as DB

Actor -> SC : POST /api/partner/v1/shipping/{shipmentId}/reship\n{carrier, trackingNo}
activate SC

SC -> Service : reship(shipmentId, carrier, trackingNo)
activate Service

Service -> Repo : findById(shipmentId)
Repo --> Service : Shipment

alt 상태 != FAILED
  Service --> SC : RESHIP_NOT_ALLOWED (FAILED 상태만 재발송 가능)
  SC --> Actor : 400 에러
else 정상
  Service -> Repo : updateStatus(PENDING)
  Repo -> DB : UPDATE ord_shipment
  Service -> Repo : registerTracking(carrier, trackingNo)
  Repo -> DB : UPDATE ord_shipment (carrier, trackingNo)
  Service -> Repo : updateStatus(IN_TRANSIT)
  Repo -> DB : UPDATE ord_shipment
  note right: 이후 §19 배치가 다시 추적(60분 주기)

  Service --> SC : ShipmentResponse(status=IN_TRANSIT)
  deactivate Service
  SC --> Actor : 200 SUCCESS
  deactivate SC
end

@enduml
```

---

## 작성 규칙

| 규칙 | 설명 |
|---|---|
| 1 시퀀스 = 1 트리거 | API endpoint, 이벤트 수신, 스케줄 배치 각각 1개 시퀀스 |
| 태그로 유형 구분 | `[API]` 사용자 요청, `[컨슈머]` 이벤트 수신, `[배치]` 스케줄러 |
| 참여자 = 클래스 후보 | Controller/Listener/Scheduler, Service, Repository, PublicApi, EventPublisher |
| 트랜잭션 경계 표시 | Service 레벨에서 @Transactional |
| 에러 분기 포함 | 인터페이스 명세의 에러 응답과 대응 |
| 도메인 경계 명시 | 타 도메인 호출은 PublicApi(동기) 또는 EventPublisher(비동기)로 표현 |
| Controller 네이밍 | 앱별 분리 — `{App}{Domain}Controller` (C3 §4.2, 상단 공통 규칙 §1 참조) |
| EventPublisher 표현 | Outbox 패턴 축약 표현 — 비즈니스 변경과 동일 트랜잭션 (C5 §5.1, 상단 공통 규칙 §2 참조) |

---

## 근거

| 항목 | 출처 |
|---|---|
| API endpoint | 인터페이스 명세(DL) 27개 API 중 주요 15개 상세화 |
| 컨슈머 시퀀스 | 이벤트 플로우(DI) PAYMENT_APPROVED 수신 액션 |
| 배치 시퀀스 | EARS(DE) REQ-ORD-006(D+7 자동확정), REQ-ORD-041(24시간 만료) |
| 에러 분기 | GWT(DJ) 예외 시나리오 |
| 도메인 간 호출 | 이벤트 플로우(DI) 동기/비동기 판단 |
| 참여 객체 | ERD(DF) 엔티티 + 컴포넌트(D9) 모듈 구조 |
| 상태 전이 | 상태머신(DG) 전이 규칙 |
| Controller 네이밍 | C3 아키텍처컨벤션 §4.2 (앱별 Controller 분리) |
| Outbox 패턴 | C5 이벤트설계컨벤션 §5.1 (비즈니스 변경 + Outbox 저장 = 동일 트랜잭션) |
