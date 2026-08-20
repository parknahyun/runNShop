# 클래스 설계 — 주문·결제 도메인

> **단계**: 상세설계 (S3)  
> **문서범위**: Bolt (Order + Payment)  
> **문서종류**: Design  
>
> **작성 목적**: 시퀀스(⑯)에 등장한 참여 객체를 클래스 구조로 전환한다.  
> "어떤 클래스가 어떤 책임을 갖고, 어떤 메서드를 제공하는가"를 확정하여  
> 구현(코드) 단계의 직접 입력이 된다.
>
> **흐름 내 위치**:
> ```
> ⑯ 시퀀스 (참여 객체) → ⑲ 클래스 설계 → 구현
> ```

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
│   │   └── ShippingService.kt
│   ├── repository/
│   │   └── ShippingRepository.kt
│   ├── domain/
│   │   └── Shipping.kt
│   └── dto/
│       ├── RegisterTrackingRequest.kt
│       └── ShippingResponse.kt
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

## 2. Payment 도메인 — 패키지 구조

```
com.runnshop.payment/
├── payment/
│   ├── controller/
│   │   └── PaymentInternalController.kt
│   ├── service/
│   │   └── PaymentService.kt
│   ├── repository/
│   │   ├── PaymentRepository.kt
│   │   └── PaymentLogRepository.kt
│   ├── domain/
│   │   ├── Payment.kt
│   │   └── PaymentLog.kt
│   └── dto/
│       ├── PaymentRequest.kt
│       └── PaymentResponse.kt
├── refund/
│   ├── service/
│   │   └── RefundService.kt
│   └── dto/
│       └── RefundRequest.kt
├── method/
│   ├── controller/
│   │   └── PaymentMethodController.kt
│   ├── service/
│   │   └── PaymentMethodService.kt
│   ├── repository/
│   │   ├── PaymentMethodRepository.kt
│   │   └── CardRestrictionRepository.kt
│   ├── domain/
│   │   ├── PaymentMethod.kt
│   │   └── CardRestriction.kt
│   └── dto/
│       ├── RegisterMethodRequest.kt
│       └── MethodListResponse.kt
├── pg/
│   ├── PgClient.kt                  (interface)
│   └── TossPaymentsClient.kt        (구현)
└── event/
    ├── PaymentEventPublisher.kt
    └── PaymentEventListener.kt
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

### ShippingService

```kotlin
@Service
@Transactional
class ShippingService(
    private val orderRepository: OrderRepository,
    private val shippingRepository: ShippingRepository,
    private val orderHistoryRepository: OrderHistoryRepository
) {
    fun shipOrder(vendorId: String, orderId: String)
    fun registerTracking(vendorId: String, orderId: String, request: RegisterTrackingRequest)
    fun getShippingList(vendorId: String, filter: ShippingFilter): ShippingListResponse
    fun updateDeliveryStatus(orderId: String, status: String)  // 택배사 API 배치
}
```

### ClaimService

```kotlin
@Service
@Transactional
class ClaimService(
    private val orderRepository: OrderRepository,
    private val claimRepository: ClaimRepository,
    private val paymentPublicApi: PaymentPublicApi,
    private val eventPublisher: OrderEventPublisher
) {
    fun createClaim(memberId: String, orderId: String, request: CreateClaimRequest): ClaimResponse

    // ── Admin (#23~#29) ──
    fun getAdminClaims(filter: AdminClaimFilter): ClaimListResponse                                    // #23 GET /api/admin/v1/claims
    fun startProcessing(adminId: String, claimId: String)                                              // #24 POST .../start
    fun completeClaim(adminId: String, claimId: String, memo: String)                                  // #25 POST .../complete (환불 진행)
    fun rejectClaim(adminId: String, claimId: String, reason: String)                                  // #26 POST .../reject
    fun refundClaim(adminId: String, claimId: String, refundMethod: String, bankAccount: BankAccountInfo?): ClaimResponse
    // #27 POST .../refund — refundMethod: ORIGINAL(원결제수단) / BANK_TRANSFER(계좌이체, bankAccount 필수). PG 환불 실행은 Payment 도메인(RefundService)에 위임
    fun dispose(adminId: String, claimId: String, reason: String): ClaimResponse                       // #28 POST .../dispose — PICKUP_REJECTED 건 폐기 결정
    fun requestReturnPayment(adminId: String, claimId: String, returnShippingFee: Int): ClaimResponse   // #29 POST .../request-return-payment — 수거거부 건 반송배송비 추가결제 요청(알림톡)

    // ── Partner (#35~#40) ──
    fun registerPickupTracking(vendorId: String, claimId: String, deliveryCompany: String, trackingNo: String): ClaimResponse
    // #35 POST /api/partner/v1/shipping/{claimId}/pickup — 수거 운송장 등록 → status: PICKUP
    fun confirmPickup(vendorId: String, claimNo: String)                                               // #36 POST .../pickup-confirm — 입고 확인 → INSPECTING
    fun inspectPass(vendorId: String, claimId: String, tagIntact: Boolean?, memo: String): ClaimResponse
    // #37 POST .../inspect-pass — 품질점검 합격 → PICKED_UP
    // tagIntact: 판정 근거(택 부착 여부). claimType=EXCHANGE 전용 기준, claimType=RETURN이면 null(사용감·파손 등은 memo로 기술)
    fun inspectReject(vendorId: String, claimId: String, tagIntact: Boolean?, rejectReason: String): ClaimResponse
    // #38 POST .../inspect-reject — 품질점검 거부 → PICKUP_REJECTED (rejectReason 필수)
    // tagIntact: inspectPass와 동일한 EXCHANGE 전용/RETURN=null 규칙
    fun returnShip(vendorId: String, claimId: String, deliveryCompany: String, trackingNo: String): ClaimResponse
    // #39 POST .../return-ship — 반송 운송장 등록 → RETURN_SHIPPING (반송배송비 결제 완료 건 대상)
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

## 4. Payment 도메인 — 클래스 상세

### PaymentService

```kotlin
@Service
@Transactional
class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentLogRepository: PaymentLogRepository,
    private val pgClient: PgClient,
    private val eventPublisher: PaymentEventPublisher
) {
    fun requestPayment(request: PaymentRequest): PaymentResponse
    fun handlePgCallback(pgTransactionId: String, result: PgResult)
    // 내부: 재시도 로직 (최대 3회, 지수 백오프)
}
```

### RefundService

```kotlin
@Service
@Transactional
class RefundService(
    private val paymentRepository: PaymentRepository,
    private val paymentLogRepository: PaymentLogRepository,
    private val pgClient: PgClient
) {
    fun fullRefund(orderId: String, amount: Int)
    fun partialRefund(orderId: String, amount: Int)
    fun manualRefund(adminId: String, paymentId: String)
}
```

### PaymentMethodService

```kotlin
@Service
@Transactional
class PaymentMethodService(
    private val methodRepository: PaymentMethodRepository,
    private val cardRestrictionRepository: CardRestrictionRepository,
    private val pgClient: PgClient
) {
    fun registerMethod(memberId: String, request: RegisterMethodRequest): MethodResponse
    fun deleteMethod(memberId: String, methodId: String)
    fun getMyMethods(memberId: String): List<MethodResponse>
    fun checkCardRestriction(cardHash: String): Boolean
    fun restrictCard(cardHash: String)
    fun releaseExpiredRestrictions()  // 익일 00:00 배치
}
```

### PaymentMethodController

```kotlin
@RestController
@RequestMapping("/api/v1/payment-methods")
class PaymentMethodController(private val paymentMethodService: PaymentMethodService) {

    @GetMapping
    fun getMyMethods(
        @RequestHeader("X-Member-Id") memberId: String
    ): ApiResponse<List<MethodResponse>>

    @PostMapping
    fun registerMethod(
        @RequestHeader("X-Member-Id") memberId: String,
        @RequestBody request: RegisterMethodRequest
    ): ApiResponse<MethodResponse>

    @DeleteMapping("/{methodId}")
    fun deleteMethod(
        @RequestHeader("X-Member-Id") memberId: String,
        @PathVariable methodId: String
    ): ApiResponse<Unit>
}
```

### PgClient (도메인 경계 — 외부 시스템 계약)

```kotlin
interface PgClient {
    fun requestApproval(request: PgApprovalRequest): PgApprovalResponse
    fun requestRefund(request: PgRefundRequest): PgRefundResponse
    fun issueBillingKey(request: PgBillingRequest): PgBillingResponse
    fun revokeBillingKey(billingKey: String)
}
```

### PaymentEventPublisher

```kotlin
@Component
class PaymentEventPublisher(private val outboxRepository: OutboxRepository) {
    fun publishPaymentApproved(payment: Payment)
    fun publishPaymentFailed(payment: Payment, reason: String)
}
```

### PaymentEventListener

```kotlin
@Component
class PaymentEventListener(
    private val refundService: RefundService
) {
    @EventListener
    fun onOrderCancelled(event: OrderCancelledEvent)
    @EventListener
    fun onClaimCompleted(event: ClaimCompletedEvent)
}
```

---

## 5. 도메인 간 PublicApi (interface)

### CatalogPublicApi (Order가 호출)

```kotlin
interface CatalogPublicApi {
    fun getProductInfo(productId: String, skuId: String): ProductInfo
    fun getProductInfoBatch(productIds: List<String>): Map<String, ProductInfo>
    fun reserveStock(items: List<StockReserveItem>): StockReservationResult
    fun restoreStock(items: List<StockRestoreItem>)
}
```

### PaymentPublicApi (Order가 호출)

```kotlin
interface PaymentPublicApi {
    fun requestPayment(orderId: String, amount: Int, method: String): PaymentResult
}
```

### MemberPublicApi (Order가 호출)

```kotlin
interface MemberPublicApi {
    fun getAddresses(memberId: String): List<AddressInfo>
    fun getPointBalance(memberId: String): PointInfo
}
```

### PromotionPublicApi (Order가 호출)

```kotlin
interface PromotionPublicApi {
    fun getAvailableCoupons(memberId: String, items: List<CouponCheckItem>): CouponListInfo
}
```

---

## 6. 도메인 엔티티 (핵심 속성)

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

### Payment

```kotlin
@Entity
@Table(name = "pay_payment")
class Payment(
    @Id val id: String,
    val orderId: String,
    val platformOrderId: String,
    val memberId: String,
    val pgProvider: String = "TOSS",
    var pgToken: String? = null,
    val paymentMethod: String,
    val amount: Int,
    val pointAmount: Int = 0,
    var status: PaymentStatus,
    var approvedAt: Instant? = null,
    var cancelledAt: Instant? = null,
    var refundedAt: Instant? = null,
    val createdAt: Instant,
    var updatedAt: Instant
) {
    fun approve(pgToken: String) { this.status = PaymentStatus.PAID; this.pgToken = pgToken; this.approvedAt = Instant.now() }
    fun cancel() { this.status = PaymentStatus.CANCELLED; this.cancelledAt = Instant.now() }
    fun refund() { this.status = PaymentStatus.REFUNDED; this.refundedAt = Instant.now() }
    fun partialRefund() { this.status = PaymentStatus.PARTIAL_REFUNDED }
}
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
    var responsibility: ClaimResponsibility? = null,
    val channel: ClaimChannel = ClaimChannel.SELF,
    var pickupAddressId: String? = null,
    val exchangeSkuId: String? = null,       // 교환 대상 SKU (Catalog 도메인 FK, claimType=EXCHANGE 전용, 선출고 시 사용)
    var tagIntact: Boolean? = null,          // 품질점검 판정 근거 — 택(TAG) 부착 여부 (claimType=EXCHANGE 전용, RETURN이면 null)
    val createdAt: Instant,
    var updatedAt: Instant
) {
    fun registerPickupTracking() { this.status = ClaimStatus.PICKUP }
    fun startInspecting() { this.status = ClaimStatus.INSPECTING }
    fun passInspection(tagIntact: Boolean?) { this.status = ClaimStatus.PICKED_UP; this.tagIntact = tagIntact }
    fun rejectInspection(tagIntact: Boolean?) { this.status = ClaimStatus.PICKUP_REJECTED; this.tagIntact = tagIntact }
    fun requestReturnPayment() { this.status = ClaimStatus.RETURN_PAYMENT_PENDING }
    fun startReturnShipping() { this.status = ClaimStatus.RETURN_SHIPPING }
    fun completeReturnDelivery() { this.status = ClaimStatus.RETURN_DELIVERED }
    fun refund() { this.status = ClaimStatus.REFUNDED }
    fun dispose() { this.status = ClaimStatus.DISPOSED }
    fun complete() { this.status = ClaimStatus.COMPLETED }
    fun reject(reason: String) { this.status = ClaimStatus.REJECTED }
    fun canDispose(): Boolean = this.status == ClaimStatus.PICKUP_REJECTED
}

enum class ClaimType { CANCEL, RETURN, EXCHANGE }

enum class ClaimStatus {
    RECEIVED,               // 접수
    PAYMENT_PENDING,        // 수거 배송비 결제대기
    PAYMENT_EXPIRED,        // 배송비 결제 만료 (접수 후 24시간)
    PICKUP,                 // 수거중 (수거 운송장 등록됨)
    INSPECTING,             // 입고 확인 → 품질점검중
    PICKED_UP,              // 품질점검 합격 (수거완료)
    PICKUP_REJECTED,        // 품질점검 거부 (수거거부)
    REFUNDED,               // 환불완료
    RETURN_PAYMENT_PENDING, // 반송 배송비 추가결제 대기
    RETURN_SHIPPING,        // 반송 운송장 등록 → 반송중
    RETURN_DELIVERED,       // 반송 배송완료
    DISPOSED,               // 폐기
    COMPLETED,              // 클레임 완료
    REJECTED                // 클레임 반려
}

enum class ClaimResponsibility { CUSTOMER, VENDOR, PLATFORM }

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

## 근거

| 항목 | 출처 |
|---|---|
| 클래스 도출 | 시퀀스(⑯) 참여 객체 |
| 메서드 시그니처 | 인터페이스 명세(⑮) 27개 endpoint |
| 패키지 구조 | 컴포넌트(③) 도메인 모듈 구조 |
| 도메인 간 계약 | 도메인정의서(⑤) 경계 규칙, 이벤트 플로우(⑫) |
| 엔티티 속성 | ERD(⑨) Order 6테이블, Payment 4테이블 |
| 이벤트 처리 | ADR-006 Outbox 패턴 |
| PG 추상화 | ADR-005 PG 토큰화 |
