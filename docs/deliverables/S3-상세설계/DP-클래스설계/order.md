# 클래스 설계 — Order 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Order) | **문서종류**: Design
> 도메인 간 공용 계약(PublicApi)은 [common.md](common.md) 참조

---

## 1. Order 도메인 — 패키지 구조

```
com.runnshop.order/
├── cart/
│   ├── controller/
│   │   └── CartController.kt
│   ├── service/
│   │   └── CartService.kt
│   ├── repository/
│   │   └── CartRepository.kt
│   ├── domain/
│   │   └── CartItem.kt
│   └── dto/
│       ├── AddToCartRequest.kt
│       ├── UpdateQuantityRequest.kt
│       └── CartResponse.kt
├── order/
│   ├── controller/
│   │   ├── OrderController.kt
│   │   ├── AdminOrderController.kt
│   │   └── PartnerOrderController.kt
│   ├── service/
│   │   ├── OrderService.kt
│   │   └── OrderSheetService.kt
│   ├── repository/
│   │   ├── PlatformOrderRepository.kt
│   │   ├── OrderRepository.kt
│   │   └── OrderHistoryRepository.kt
│   ├── domain/
│   │   ├── PlatformOrder.kt
│   │   ├── Order.kt
│   │   ├── OrderItem.kt
│   │   └── OrderHistory.kt
│   └── dto/
│       ├── OrderSheetRequest.kt
│       ├── OrderSheetResponse.kt
│       ├── PayRequest.kt
│       ├── CancelRequest.kt
│       └── OrderListResponse.kt
├── shipping/
│   ├── controller/
│   │   └── ShippingController.kt
│   ├── service/
│   │   └── ShipmentService.kt
│   ├── repository/
│   │   └── ShipmentRepository.kt
│   ├── domain/
│   │   └── Shipment.kt              (ORDER/CLAIM 공용 — ord_shipment)
│   └── dto/
│       ├── RegisterTrackingRequest.kt
│       ├── ReshipRequest.kt         (v6 후속 — REQ-ORD-062)
│       └── ShipmentResponse.kt
├── claim/
│   ├── controller/
│   │   ├── ClaimController.kt
│   │   ├── AdminClaimController.kt
│   │   └── PartnerClaimController.kt
│   ├── service/
│   │   └── ClaimService.kt
│   ├── repository/
│   │   └── ClaimRepository.kt
│   ├── domain/
│   │   └── Claim.kt
│   └── dto/
│       ├── CreateClaimRequest.kt
│       ├── ClaimProcessRequest.kt
│       └── ClaimResponse.kt
├── publicapi/
│   ├── CatalogPublicApi.kt          (interface)
│   ├── PaymentPublicApi.kt          (interface)
│   ├── MemberPublicApi.kt           (interface)
│   └── PromotionPublicApi.kt        (interface)
└── event/
    ├── OrderEventPublisher.kt
    └── OrderEventListener.kt
```

---
## 3. Order 도메인 — 클래스 상세

### CartController

```kotlin
@RestController
@RequestMapping("/api/v1/cart")
class CartController(private val cartService: CartService) {

    @PostMapping("/items")
    fun addToCart(
        @RequestHeader("X-Member-Id") memberId: String,
        @RequestBody request: AddToCartRequest
    ): ApiResponse<CartItemResponse>

    @GetMapping
    fun getCart(
        @RequestHeader("X-Member-Id") memberId: String
    ): ApiResponse<CartResponse>

    @PatchMapping("/items/{cartItemId}/quantity")
    fun updateQuantity(
        @PathVariable cartItemId: String,
        @RequestBody request: UpdateQuantityRequest
    ): ApiResponse<CartItemResponse>

    @DeleteMapping("/items/{cartItemId}")
    fun removeItem(
        @PathVariable cartItemId: String
    ): ApiResponse<Unit>
}
```

### CartService

```kotlin
@Service
@Transactional
class CartService(
    private val cartRepository: CartRepository,
    private val catalogPublicApi: CatalogPublicApi
) {
    fun addToCart(memberId: String, request: AddToCartRequest): CartItemResponse
    fun getCart(memberId: String): CartResponse
    fun updateQuantity(cartItemId: String, quantity: Int): CartItemResponse
    fun removeItem(cartItemId: String)
    fun mergeCarts(guestId: String, memberId: String)
}
```

### OrderController

```kotlin
@RestController
@RequestMapping("/api/v1/orders")
class OrderController(
    private val orderSheetService: OrderSheetService,
    private val orderService: OrderService
) {
    @PostMapping("/sheet")
    fun createSheet(
        @RequestHeader("X-Member-Id") memberId: String,
        @RequestBody request: OrderSheetRequest
    ): ApiResponse<OrderSheetResponse>

    @PostMapping("/{orderSheetId}/pay")
    fun placeOrder(
        @RequestHeader("X-Member-Id") memberId: String,
        @PathVariable orderSheetId: String,
        @RequestBody request: PayRequest
    ): ApiResponse<PayResponse>

    @PostMapping("/{orderId}/cancel")
    fun cancelOrder(
        @RequestHeader("X-Member-Id") memberId: String,
        @PathVariable orderId: String,
        @RequestBody request: CancelRequest
    ): ApiResponse<CancelResponse>

    @PostMapping("/{orderId}/confirm")
    fun confirmOrder(
        @RequestHeader("X-Member-Id") memberId: String,
        @PathVariable orderId: String
    ): ApiResponse<ConfirmResponse>

    @PutMapping("/{orderId}/shipping-address")
    fun changeShippingAddress(
        @PathVariable orderId: String,
        @RequestBody request: ChangeAddressRequest
    ): ApiResponse<Unit>

    @GetMapping
    fun getMyOrders(
        @RequestHeader("X-Member-Id") memberId: String,
        @RequestParam page: Int,
        @RequestParam size: Int,
        @RequestParam status: String?
    ): ApiResponse<OrderListResponse>
}
```

### OrderService

```kotlin
@Service
@Transactional
class OrderService(
    private val platformOrderRepository: PlatformOrderRepository,
    private val orderRepository: OrderRepository,
    private val orderHistoryRepository: OrderHistoryRepository,
    private val catalogPublicApi: CatalogPublicApi,
    private val paymentPublicApi: PaymentPublicApi,
    private val eventPublisher: OrderEventPublisher
) {
    fun placeOrder(memberId: String, sheetId: String, request: PayRequest): PayResponse
    fun cancelOrder(memberId: String, orderId: String, reason: String): CancelResponse
    fun forceCancel(adminId: String, orderId: String, reason: String): CancelResponse
    fun confirmOrder(memberId: String, orderId: String): ConfirmResponse
    fun autoConfirmBatch(): Int  // D+7 자동구매확정 배치
    fun changeShippingAddress(orderId: String, request: ChangeAddressRequest)
    fun getMyOrders(memberId: String, page: Int, size: Int, status: String?): OrderListResponse
    fun getAdminOrders(filter: AdminOrderFilter): OrderListResponse
    fun getPartnerOrders(vendorId: String, filter: PartnerOrderFilter): OrderListResponse
}
```

### ShipmentService

> v6 리팩토링: 배송 실행 상태를 `order.status`/`claim.status`에서 분리하여 `ord_shipment`(Shipment)로 일원화.
> Order(OUTBOUND)와 Claim(PICKUP/RETURN/EXCHANGE_OUT) 양쪽의 배송 실행을 공통으로 처리한다.

```kotlin
@Service
@Transactional
class ShipmentService(
    private val shipmentRepository: ShipmentRepository,
    private val orderRepository: OrderRepository,
    private val orderHistoryRepository: OrderHistoryRepository
) {
    fun createShipment(refType: ShipmentRefType, refId: String, shipmentType: ShipmentType): Shipment
    // Shipment 생성 → status: PENDING
    // Order 발송: refType=ORDER, shipmentType=OUTBOUND (기존 shipOrder 대체)
    // Claim 수거/반송: refType=CLAIM, shipmentType=PICKUP/RETURN/EXCHANGE_OUT

    fun registerTracking(shipmentId: String, carrier: String, trackingNo: String): Shipment
    // PENDING → IN_TRANSIT (운송장 등록)

    fun confirmDelivered(shipmentId: String): Shipment
    // IN_TRANSIT → DELIVERED

    fun markFailed(shipmentId: String): Shipment
    // IN_TRANSIT → FAILED (배송 실패/미배달)

    fun reship(shipmentId: String, carrier: String, trackingNo: String): Shipment
    // FAILED → PENDING → IN_TRANSIT (재발송, 신규 운송장으로 즉시 재등록)

    fun getShippingList(vendorId: String, filter: ShippingFilter): ShippingListResponse
    fun getShipments(refType: ShipmentRefType, refId: String): List<ShipmentResponse>
}
```

### ShippingController

> (2026-08-21 배선 확인·보완) `ShipmentService.reship()`는 이미 존재했으나 이를 호출하는 컨트롤러 계층이 문서에 없었다. §16-22 시퀀스에 맞춰 보완.

```kotlin
@RestController
@RequestMapping("/api/partner/v1/shipping")
class ShippingController(private val shipmentService: ShipmentService) {

    @PostMapping("/{orderId}")
    fun registerTracking(
        @RequestHeader("X-Vendor-Id") vendorId: String,
        @PathVariable orderId: String,
        @RequestBody request: RegisterTrackingRequest
    ): ApiResponse<ShipmentResponse>
    // §16-9 — orderId로 shipment(refType=ORDER, shipmentType=OUTBOUND) 조회 후
    // shipmentService.registerTracking(shipmentId, request.deliveryCompany, request.trackingNo) 호출 (PENDING→IN_TRANSIT)

    @PostMapping("/{shipmentId}/reship")
    fun reship(
        @RequestHeader("X-Vendor-Id") vendorId: String,
        @PathVariable shipmentId: String,
        @RequestBody request: ReshipRequest
    ): ApiResponse<ShipmentResponse>
    // §16-22 (REQ-ORD-062) — shipmentService.reship(shipmentId, request.carrier, request.trackingNo) 호출
    // FAILED 상태만 허용, 그 외 상태는 RESHIP_NOT_ALLOWED
}
```

### ClaimService

```kotlin
@Service
@Transactional
class ClaimService(
    private val orderRepository: OrderRepository,
    private val claimRepository: ClaimRepository,
    private val shipmentService: ShipmentService,
    private val paymentPublicApi: PaymentPublicApi,
    private val eventPublisher: OrderEventPublisher
) {
    fun createClaim(memberId: String, orderId: String, request: CreateClaimRequest): ClaimResponse

    // ── Customer (자진취소) ──
    fun cancelClaim(memberId: String, claimId: String): ClaimResponse
    // POST /api/v1/claims/{claimId}/cancel — 고객 클레임 자진취소 (§16-7-2, REQ-ORD-071/073)
    // claim.status가 RECEIVED/PAYMENT_PENDING이 아니면 ClaimCancelNotAllowedException 발생
    //   (귀책판정/수거 시작 이후 — INSPECTING 이상은 취소 불가)
    // 정상 시 claim.cancel() 호출 → status: REJECTED, reason="고객 자진 철회"

    // ── Admin (#23~#29) ──
    fun getAdminClaims(filter: AdminClaimFilter): ClaimListResponse                                    // #23 GET /api/admin/v1/claims
    fun startProcessing(adminId: String, claimId: String)                                              // #24 POST .../start
    fun decideResponsibility(adminId: String, claimId: String, responsibility: ClaimResponsibility): ClaimResponse
    // (신규 — 인터페이스명세 미정의, 후속 추가 필요) CS 귀책판정(override). 고객 자진신고를 CS가 덮어씀 (REQ-ORD-066)
    // claim.decideResponsibility(responsibility) 호출
    //   CUSTOMER → claim.status: RECEIVED→PAYMENT_PENDING (수거배송비 결제 알림톡 발송)
    //   VENDOR   → claim.status 변경 없음(RECEIVED 유지) + shipmentService.createShipment(CLAIM, claimId, PICKUP) 생성
    //              이후 registerPickupTracking(#35)에서 운송장 등록, confirmPickup(#36)에서 INSPECTING 전환
    fun completeClaim(adminId: String, claimId: String, memo: String)                                  // #25 POST .../complete (환불 진행)
    fun rejectClaim(adminId: String, claimId: String, reason: String)                                  // #26 POST .../reject
    fun refundClaim(adminId: String, claimId: String, refundMethod: String, bankAccount: BankAccountInfo?): ClaimResponse
    // #27 POST .../refund — refundMethod: ORIGINAL(원결제수단) / BANK_TRANSFER(계좌이체, bankAccount 필수). PG 환불 실행은 Payment 도메인(RefundService)에 위임
    fun dispose(adminId: String, claimId: String, reason: String): ClaimResponse                       // #28 POST .../dispose — PICKUP_REJECTED 건 폐기 결정
    fun requestReturnPayment(adminId: String, claimId: String, returnShippingFee: Int): ClaimResponse   // #29 POST .../request-return-payment — 수거거부 건 반송배송비 추가결제 요청(알림톡)

    // ── Partner (#35~#40) ──
    // v6: 수거/반송 배송 실행은 Shipment(ord_shipment)로 이관. Claim.status는 더 이상 PICKUP/RETURN_SHIPPING/RETURN_DELIVERED를 갖지 않는다.
    fun registerPickupTracking(vendorId: String, claimId: String, deliveryCompany: String, trackingNo: String): ClaimResponse
    // #35 POST /api/partner/v1/shipping/{claimId}/pickup
    // shipmentService.createShipment(CLAIM, claimId, PICKUP) 후 registerTracking(shipmentId, deliveryCompany, trackingNo) → shipment: PENDING→IN_TRANSIT
    // (claim.status는 변경하지 않음 — RECEIVED/PAYMENT_PENDING 등 결제 흐름 상태 유지)
    fun confirmPickup(vendorId: String, claimNo: String): ClaimResponse
    // #36 POST .../pickup-confirm — 입고 확인
    // shipmentService.confirmDelivered(shipmentId)로 PICKUP shipment를 DELIVERED 처리한 뒤,
    // claim.startInspecting()으로 클레임 상태를 INSPECTING 전환 (shipment 배송완료와 클레임 상태전이를 분리된 메서드로 처리)
    fun inspectPass(vendorId: String, claimId: String, tagIntact: Boolean?, memo: String): ClaimResponse
    // #37 POST .../inspect-pass — 품질점검 합격 → PICKED_UP
    // tagIntact: 판정 근거(택 부착 여부). claimType=EXCHANGE 전용 기준, claimType=RETURN이면 null(사용감·파손 등은 memo로 기술)
    fun inspectReject(vendorId: String, claimId: String, tagIntact: Boolean?, rejectReason: String): ClaimResponse
    // #38 POST .../inspect-reject — 품질점검 거부 → PICKUP_REJECTED (rejectReason 필수)
    // tagIntact: inspectPass와 동일한 EXCHANGE 전용/RETURN=null 규칙
    fun returnShip(vendorId: String, claimId: String, deliveryCompany: String, trackingNo: String): ClaimResponse
    // #39 POST .../return-ship — 반송 운송장 등록 (반송배송비 결제 완료 건 대상)
    // shipmentService.createShipment(CLAIM, claimId, RETURN) 후 registerTracking(shipmentId, deliveryCompany, trackingNo) → shipment: PENDING→IN_TRANSIT
    // (claim.status는 RETURN_PAYMENT_PENDING에서 변경하지 않음 — 반송 배송 진행상태는 Shipment.status로 추적)
    fun getPartnerClaims(vendorId: String, claimType: String, filter: PartnerClaimFilter): ClaimListResponse  // #40 GET /api/partner/v1/claims
}
```

### OrderEventPublisher

```kotlin
@Component
class OrderEventPublisher(private val outboxRepository: OutboxRepository) {
    fun publishOrderCancelled(order: Order)
    fun publishOrderConfirmed(order: Order)
    fun publishClaimCompleted(claim: Claim)
}
```

### OrderEventListener

```kotlin
@Component
class OrderEventListener(private val orderService: OrderService) {
    @EventListener
    fun onPaymentApproved(event: PaymentApprovedEvent)
    @EventListener
    fun onPaymentFailed(event: PaymentFailedEvent)
}
```

---

## 도메인 엔티티 (핵심 속성)

### CartItem

```kotlin
@Entity
@Table(name = "ord_cart")
class CartItem(
    @Id val id: String,
    val memberId: String,
    val productId: String,
    val skuId: String,
    val vendorId: String,
    var quantity: Int,
    val addedAt: Instant,
    var isDeleted: Boolean = false
) {
    fun addQuantity(amount: Int) { this.quantity += amount }
    fun updateQuantity(newQuantity: Int) { this.quantity = newQuantity }
    fun softDelete() { this.isDeleted = true }
}
```

### Order

```kotlin
@Entity
@Table(name = "ord_order")
class Order(
    @Id val id: String,
    val platformOrderId: String,
    val vendorId: String,
    var status: OrderStatus,
    val totalAmount: Int,
    val shippingFee: Int,
    var cancelReason: String? = null,
    var confirmedAt: Instant? = null,
    val createdAt: Instant,
    var updatedAt: Instant
) {
    fun cancel(reason: String) { this.status = OrderStatus.CANCELLED; this.cancelReason = reason }
    fun confirm() { this.status = OrderStatus.CONFIRMED; this.confirmedAt = Instant.now() }
    fun canCancel(): Boolean = this.status == OrderStatus.PAYMENT_COMPLETED
    fun canConfirm(): Boolean = this.status == OrderStatus.DELIVERED
}
```

### Shipment

> v6 리팩토링 신규 엔티티. 배송 실행(운송장/배송상태)을 `order.status`/`claim.status`에서 분리하여 일원화한 테이블.
> `refType`/`refId`로 Order(OUTBOUND)와 Claim(PICKUP/RETURN/EXCHANGE_OUT)을 모두 참조한다.

```kotlin
@Entity
@Table(name = "ord_shipment")
class Shipment(
    @Id val id: String,
    val refType: ShipmentRefType,   // ORDER / CLAIM
    val refId: String,              // orderId 또는 claimId
    val shipmentType: ShipmentType,
    var status: ShipmentStatus,
    var carrier: String? = null,
    var trackingNumber: String? = null,
    var shippedAt: Instant? = null,
    var deliveredAt: Instant? = null,
    val createdAt: Instant,
    var updatedAt: Instant
) {
    fun registerTracking(carrier: String, trackingNumber: String) {
        this.carrier = carrier
        this.trackingNumber = trackingNumber
        this.status = ShipmentStatus.IN_TRANSIT
        this.shippedAt = Instant.now()
    }
    fun confirmDelivered() { this.status = ShipmentStatus.DELIVERED; this.deliveredAt = Instant.now() }
    fun markFailed() { this.status = ShipmentStatus.FAILED }
    fun reship(carrier: String, trackingNumber: String) {
        this.status = ShipmentStatus.PENDING
        this.carrier = carrier
        this.trackingNumber = trackingNumber
        this.status = ShipmentStatus.IN_TRANSIT
        this.shippedAt = Instant.now()
    }
    fun canRegisterTracking(): Boolean = this.status == ShipmentStatus.PENDING
    fun canReship(): Boolean = this.status == ShipmentStatus.FAILED
}

enum class ShipmentRefType { ORDER, CLAIM }
enum class ShipmentType { OUTBOUND, PICKUP, RETURN, EXCHANGE_OUT }
enum class ShipmentStatus { PENDING, IN_TRANSIT, DELIVERED, FAILED, CANCELLED }
```

### Claim

```kotlin
@Entity
@Table(name = "ord_claim")
class Claim(
    @Id val id: String,
    val orderId: String,
    val claimType: ClaimType,
    var status: ClaimStatus,
    val reason: String,
    val detailReason: String? = null,
    val submittedResponsibility: ClaimResponsibility,  // 고객이 신청 시 자진신고한 귀책값. 생성 시 설정, 이후 불변(REQ-ORD-076)
    var responsibility: ClaimResponsibility? = null,   // CS 확정 귀책값. decideResponsibility()로만 갱신되며 submittedResponsibility와 달라질 수 있음(REQ-ORD-066)
    val channel: ClaimChannel = ClaimChannel.SELF,
    var pickupAddressId: String? = null,
    val exchangeSkuId: String? = null,       // 교환 대상 SKU (Catalog 도메인 FK, claimType=EXCHANGE 전용, 선출고 시 사용)
    var tagIntact: Boolean? = null,          // 품질점검 판정 근거 — 택(TAG) 부착 여부 (claimType=EXCHANGE 전용, RETURN이면 null)
    val createdAt: Instant,
    var updatedAt: Instant
) {
    val images: List<ClaimImage> = emptyList()
    // ord_claim_image 1:N (최대 3장). responsibility=VENDOR 신청 시 최소 1장 필수, CUSTOMER는 선택 (REQ-ORD-058)

    // v6: 수거중/반송중 상태는 Shipment(ord_shipment)로 이관 — registerPickupTracking/startReturnShipping/completeReturnDelivery 제거.
    fun decideResponsibility(responsibility: ClaimResponsibility) {
        this.responsibility = responsibility
        if (responsibility == ClaimResponsibility.CUSTOMER) this.status = ClaimStatus.PAYMENT_PENDING
        // VENDOR: status는 RECEIVED 그대로 유지 — shipment(PICKUP) 생성은 ClaimService에서 별도 처리, INSPECTING 전환은 confirmPickup()에서 수행
        // 주의: 이 메서드는 responsibility만 갱신한다. submittedResponsibility는 절대 건드리지 않음 —
        // 고객 자진신고값은 생성 시점 값 그대로 보존되며(불변, REQ-ORD-076), CS 확정값(responsibility)과 별도 컬럼으로 공존한다.
    }
    // CS 귀책판정(override) — 고객이 신청 시 제출한 responsibility 값을 CS 판정으로 덮어씀 (REQ-ORD-066)

    // startInspecting()은 shipment(PICKUP)가 DELIVERED됐을 때 ClaimService.confirmPickup()에서 호출되는 별도 메서드로 유지.
    fun startInspecting() { this.status = ClaimStatus.INSPECTING }
    fun passInspection(tagIntact: Boolean?) { this.status = ClaimStatus.PICKED_UP; this.tagIntact = tagIntact }
    fun rejectInspection(tagIntact: Boolean?) { this.status = ClaimStatus.PICKUP_REJECTED; this.tagIntact = tagIntact }
    fun requestReturnPayment() { this.status = ClaimStatus.RETURN_PAYMENT_PENDING }
    fun refund() { this.status = ClaimStatus.REFUNDED }
    fun dispose() { this.status = ClaimStatus.DISPOSED }
    fun complete() { this.status = ClaimStatus.COMPLETED }
    fun reject(reason: String) { this.status = ClaimStatus.REJECTED }
    fun cancel() { this.reject("고객 자진 철회") }
    // 고객 자진취소(§16-7-2, REQ-ORD-071/073). RECEIVED/PAYMENT_PENDING 상태에서만 호출 가능 —
    // 상태 검증은 ClaimService.cancelClaim()이 선행 수행하며, 위반 시 ClaimCancelNotAllowedException을 던진다.
    fun canDispose(): Boolean = this.status == ClaimStatus.PICKUP_REJECTED
    fun canCancel(): Boolean = this.status == ClaimStatus.RECEIVED || this.status == ClaimStatus.PAYMENT_PENDING
}

enum class ClaimType { CANCEL, RETURN, EXCHANGE }

enum class ClaimStatus {
    RECEIVED,               // 접수
    PAYMENT_PENDING,        // 수거 배송비 결제대기
    PAYMENT_EXPIRED,        // 배송비 결제 만료 (접수 후 24시간)
    INSPECTING,             // 입고 확인 → 품질점검중
    PICKED_UP,              // 품질점검 합격 (수거완료)
    PICKUP_REJECTED,        // 품질점검 거부 (수거거부)
    REFUNDED,               // 환불완료
    RETURN_PAYMENT_PENDING, // 반송 배송비 추가결제 대기
    DISPOSED,               // 폐기
    COMPLETED,              // 클레임 완료
    REJECTED                // 클레임 반려
}
// v6: PICKUP/RETURN_SHIPPING/RETURN_DELIVERED 제거(11상태) — 수거/반송 배송 진행상태는 Shipment.status로 추적

enum class ClaimResponsibility { CUSTOMER, VENDOR }
// v6: PLATFORM 제거 — 귀책은 CUSTOMER/VENDOR 2종만

enum class ClaimChannel { SELF, CS }
```

### ClaimPayment

```kotlin
@Entity
@Table(name = "ord_claim_payment")
class ClaimPayment(
    @Id val id: String,
    val claimId: String,
    val paymentType: ClaimPaymentType,  // PICKUP(수거배송비) / RETURN(반송배송비)
    val amount: Int,
    val couponId: String? = null,
    val couponDiscount: Int = 0,
    val paidAmount: Int,
    var status: ClaimPaymentStatus,
    var pgTransactionId: String? = null,
    var paidAt: Instant? = null,
    var expiredAt: Instant? = null,      // 결제 만료 시각 (접수 후 24시간)
    val createdAt: Instant
) {
    fun pay(pgTransactionId: String) { this.status = ClaimPaymentStatus.PAID; this.pgTransactionId = pgTransactionId; this.paidAt = Instant.now() }
    fun expire() { this.status = ClaimPaymentStatus.EXPIRED; this.expiredAt = Instant.now() }
}

enum class ClaimPaymentType { PICKUP, RETURN }
enum class ClaimPaymentStatus { PENDING, PAID, EXPIRED }
```

### ClaimImage

```kotlin
@Entity
@Table(name = "ord_claim_image")
class ClaimImage(
    @Id val id: String,
    val claimId: String,
    val imageUrl: String,
    val uploadedBy: Uploader,       // CUSTOMER(접수 시 첨부, §16-7) / VENDOR(품질점검 등 입점사 첨부 근거)
    val sortOrder: Int = 0,
    val createdAt: Instant
)
// 클레임 첨부 이미지. 최대 3장. responsibility=VENDOR(상품불량 등) 신청 시 최소 1장 필수(REQ-ORD-058), CUSTOMER 귀책은 선택

enum class Uploader { CUSTOMER, VENDOR }
```

---

---

## 작성 규칙

| 규칙 | 설명 |
|---|---|
| 시퀀스 참여자 = 클래스 | 1:1 대응 |
| Controller는 로직 없음 | 요청 수신·응답 반환만 (Thin Controller) |
| Service에 비즈니스 로직 | 검증·조합·트랜잭션 관리 |
| PublicApi = interface | 도메인 간 계약, 구현은 제공 도메인에서 |
| Entity는 행위를 가짐 | `order.cancel(reason)` — Rich Domain Model |
| PgClient = interface | 외부 시스템(PG) 경계, 구현은 인프라 레이어 |

---

---

## 근거

| 항목 | 출처 |
|---|---|
| 클래스 도출 | 시퀀스(DM) 참여 객체 |
| 메서드 시그니처 | 인터페이스 명세(DL) 27개 endpoint |
| 패키지 구조 | 컴포넌트(D9) 도메인 모듈 구조 |
| 도메인 간 계약 | 도메인정의서(DB) 경계 규칙, 이벤트 플로우(DI) |
| 엔티티 속성 | ERD(DF) Order 10테이블(v6: ord_shipment 신설, ord_claim_image 포함), Payment 5테이블(v2: pay_card_fail_counter 신설 포함) |
| 이벤트 처리 | ADR-006 Outbox 패턴 |
| PG 추상화 | ADR-005 PG 토큰화 |
| 클레임 첨부 이미지(ClaimImage) | ERD(DF) Order `ord_claim_image`, REQ-ORD-058 (VENDOR귀책 사진 1장 이상 필수) |
| 카드 연속실패 카운터(CardFailCounter) | ERD(DF) Payment `pay_card_fail_counter`, REQ-PAY-023 (바텀업 검토 보완, 2026-08-21) |
| CS 귀책판정 override(decideResponsibility) | REQ-ORD-066 (고객 자진신고를 CS가 덮어씀), 상태머신(DH) RECEIVED→PAYMENT_PENDING/INSPECTING 전이 (바텀업 검토 보완, 2026-08-21) |
| PaymentService ↔ CardFailCounter 배선(handlePgCallback/requestPayment) | 시퀀스(DM) §4(결제 요청)·§4-1(PG콜백 처리), REQ-PAY-018/023 — 엔티티만 있고 호출부가 없던 배선 결함 수정 (2026-08-21) |
| Claim.submittedResponsibility(불변) | 시퀀스(DM) §7(클레임 신청)·§7-1(귀책판정), REQ-ORD-076 — 고객 자진신고값과 CS 확정값(responsibility) 분리 보존 (2026-08-21) |
| ClaimImage.uploadedBy | 시퀀스(DM) §7 saveImages(uploadedBy=CUSTOMER) — 첨부 이미지의 등록 주체(CUSTOMER/VENDOR) 구분 (2026-08-21) |
| 클레임 자진취소(ClaimService.cancelClaim/Claim.cancel) | 시퀀스(DM) §7-2, REQ-ORD-071/073 — RECEIVED/PAYMENT_PENDING만 허용, 이후 상태는 ClaimCancelNotAllowedException (2026-08-21) |
| ShippingController(registerTracking/reship) | 시퀀스(DM) §9·§22, REQ-ORD-062 — ShipmentService.reship()은 기존에 있었으나 호출하는 컨트롤러 배선이 문서에 없던 결함 보완 (2026-08-21) |
