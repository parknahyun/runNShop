# 클래스 설계 — 도메인 간 공용 계약 (PublicApi)

> 상위 문서: [readme.md](readme.md)
> **단계**: 상세설계 (S3) | **문서범위**: Bolt (Order + Payment 공통) | **문서종류**: Design
> Order 도메인 클래스는 [order.md](order.md), Payment 도메인 클래스는 [payment.md](payment.md) 참조

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
