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
    private val eventPublisher: OrderEventPublisher
) {
    fun createClaim(memberId: String, orderId: String, request: CreateClaimRequest): ClaimResponse
    fun startProcessing(adminId: String, claimId: String)
    fun completeClaim(adminId: String, claimId: String, memo: String)
    fun rejectClaim(adminId: String, claimId: String, reason: String)
    fun confirmPickup(vendorId: String, claimNo: String)
    fun getAdminClaims(filter: AdminClaimFilter): ClaimListResponse
    fun getPartnerClaims(vendorId: String, claimType: String, filter: PartnerClaimFilter): ClaimListResponse
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
