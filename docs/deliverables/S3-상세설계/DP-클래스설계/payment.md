# 클래스 설계 — Payment 도메인

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Payment) | **문서종류**: Design
> 도메인 간 공용 계약(PublicApi)은 [common.md](common.md) 참조

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
│   │   ├── CardRestrictionRepository.kt
│   │   └── CardFailCounterRepository.kt
│   ├── domain/
│   │   ├── PaymentMethod.kt
│   │   ├── CardRestriction.kt
│   │   └── CardFailCounter.kt       (v2 신규 — REQ-PAY-023)
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
## 4. Payment 도메인 — 클래스 상세

### PaymentService

> (2026-08-21 배선 보완) `CardFailCounter`(REQ-PAY-023) 엔티티·리포지토리는 있었으나 `PaymentService`가 이를 호출하는 배선이 없었다. §16-4-1(Payment 내부 PG콜백 처리) 시퀀스에 맞춰 `handlePgCallback`을 구체화하고, 카드 당일제한 조회(`checkCardRestriction`)는 §16-4(결제 요청)의 위치대로 `requestPayment`에서 호출되도록 배선한다.

```kotlin
@Service
@Transactional
class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentLogRepository: PaymentLogRepository,
    private val cardFailCounterRepository: CardFailCounterRepository,
    private val paymentMethodService: PaymentMethodService,
    private val pgClient: PgClient,
    private val eventPublisher: PaymentEventPublisher
) {
    fun requestPayment(request: PaymentRequest): PaymentResponse
    // §16-4 — 최초 진입 시 paymentMethodService.checkCardRestriction(request.cardHash) 호출(REQ-PAY-018)
    //   true(당일 차단 상태) → CARD_RESTRICTED 응답, 이후 로직 미진행
    //   false → PG 승인 요청 큐 등록 (재시도 최대 3회, 타임아웃 30초 — 결과는 handlePgCallback으로 비동기 수신)

    fun handlePgCallback(paymentId: String, result: PgResult)
    // §16-4-1 — PG 콜백(승인/실패 웹훅) 또는 재시도 소진 시 호출. cardHash는 paymentRepository.findById(paymentId)로 조회한 결제수단에서 얻는다.
    //   승인 성공: paymentRepository.updateStatus(PAID)
    //             → cardFailCounterRepository.resetFailCount(cardHash) (REQ-PAY-023 — 카운터 0 초기화)
    //             → eventPublisher.publishPaymentApproved(payment)
    //   승인 실패(재시도 3회 소진, REQ-PAY-004):
    //             → cardFailCounterRepository.incrementFailCount(cardHash) → consecutiveFailCount 반환
    //             → consecutiveFailCount >= 3이면 paymentMethodService.restrictCard(cardHash) 호출(REQ-PAY-018, pay_card_restriction 생성)
    //               후 cardFailCounterRepository.resetFailCount(cardHash)로 카운터 재초기화
    //             → eventPublisher.publishPaymentFailed(payment, reason)
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
    // PaymentService.requestPayment()가 결제 요청 접수 시점에 호출 (REQ-PAY-018, §16-4)
    fun restrictCard(cardHash: String)
    // cardRestrictionRepository에 당일 제한 레코드 생성. PaymentService.handlePgCallback()이
    // 연속실패 3회 도달 시 호출 (REQ-PAY-018, §16-4-1)
    fun releaseExpiredRestrictions()  // 익일 00:00 배치
}
```

> v2 배선 정리(2026-08-21): incrementFailCount/resetFailCount(consecutiveFailCount 갱신)는
> PaymentService가 cardFailCounterRepository를 직접 호출하는 방식으로 이동(§16-4-1) — 중복 소유 방지.
> 본 서비스는 카드 제한(pay_card_restriction) 생성·조회만 담당한다.

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

### CardFailCounter

> v2 신규 엔티티 (REQ-PAY-023). 카드별 연속 결제실패 횟수를 추적한다. `pay_card_fail_counter`(card_hash PK)는 카드당 1행을 upsert 방식으로 갱신하며, 결제 성공 시 0으로 리셋, 3회 연속 실패 시 `pay_card_restriction`(당일 제한) 레코드를 생성한다.

```kotlin
@Entity
@Table(name = "pay_card_fail_counter")
class CardFailCounter(
    @Id val cardHash: String,
    var consecutiveFailCount: Int = 0,
    var updatedAt: Instant
) {
    fun increment(): Int {
        this.consecutiveFailCount += 1
        this.updatedAt = Instant.now()
        return this.consecutiveFailCount
    }
    fun reset() {
        this.consecutiveFailCount = 0
        this.updatedAt = Instant.now()
    }
    fun hasReachedLimit(): Boolean = this.consecutiveFailCount >= 3
}
```

### CardFailCounterRepository

> `PaymentService.handlePgCallback()`(§16-4-1)이 직접 호출하는 upsert형 리포지토리. 카드당 1행을 갱신하며 호출부에서 별도 조회 없이 바로 증감시킨다.

```kotlin
interface CardFailCounterRepository {
    fun incrementFailCount(cardHash: String): Int
    // find-or-create(cardHash) → CardFailCounter.increment() → save → 갱신된 consecutiveFailCount 반환
    fun resetFailCount(cardHash: String)
    // find-or-create(cardHash) → CardFailCounter.reset() → save
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

## 도메인 엔티티 (핵심 속성)

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
