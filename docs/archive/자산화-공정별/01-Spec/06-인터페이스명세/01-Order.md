# Order 도메인 인터페이스 명세 (초안)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-API-ORDER-001 |
| Scope | Bolt (Order 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 구현 단계 | **본개발** (1차 대상 — 실제 DB·상태머신·트랜잭션 구현) |
| 입력 자산 | EARS(01-Order-*.md 4파일), GWT(01-Order-*.md 4파일), 용어집, API 설계규칙 |

> **본개발 전환 (2026-07-30 확정)**:
> - Order·Payment = **본개발** (실제 구현)
> - 연관 도메인 (Catalog·Promotion·Notification·Settlement·Config) = **Mock 유지**
>   (PublicApi 호출 시 항상 성공 응답 반환, 본개발은 2차 이후에 순차 진행)
> - 오케스트레이션: Order BE가 담당 (FE → Order BE 단일 API 호출)
> - BFF: Order 도메인은 인증 후 페이지 → BFF 미적용 (SEO 불필요)

---

## 공통 응답 구조

```yaml
# 성공
{ "code": "SUCCESS", "data": { ... } }

# 에러
{ "code": "ERROR_CODE", "message": "사용자 메시지", "detail": "디버그 정보" }
```

## 공통 헤더

| 헤더 | 값 | 설명 |
|---|---|---|
| Authorization | Bearer {userId} | 사용자 식별 토큰 |

### 인증 방식

- **본개발**: `POST /auth/login` → JWT(accessToken) 발행 → 이후 요청에 `Bearer {accessToken}` 포함. 서버가 JWT에서 주체(memberId/vendorId/adminId)와 역할을 추출.
- **프로토타입**: 로그인 없이 **토큰 값 자체를 사용자 ID로 사용**. 서버가 Path Prefix로 역할을 판별하고 토큰 값을 ID로 해석.

```
# 고객웹 (/api/v1/**)
Authorization: Bearer M001    ← M001을 memberId로 해석

# 입점사 (/api/partner/v1/**)
Authorization: Bearer V001    ← V001을 vendorId로 해석

# 어드민 (/api/admin/v1/**)
Authorization: Bearer A001    ← A001을 adminId로 해석
```

> 본개발 전환 시 MockAuthFilter → 실제 JWT 파서로 교체. API 호출 방식(Authorization 헤더) 자체는 변경 없음.

---

## 1. 장바구니 (Cart)

### POST /api/v1/cart/merge — 비회원 장바구니 병합

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-066 |
| 채널 | 고객웹 (M) |
| 인증 | 필수 (로그인 직후 1회 호출) |
| 설명 | 비회원 상태에서 localStorage에 담아둔 장바구니를 로그인 후 서버 장바구니로 병합. 동일 상품은 수량 합산(최대 수량 초과 시 최대 수량으로 제한). 병합 직후 유효성 재검사 수행. |

**Request:**
```yaml
Body:
  items: # localStorage에서 가져온 비회원 장바구니 데이터
    - productId: string (required)
      skuId: string (required)
      quantity: integer (required, min:1)
```

**Response (200):**
```yaml
data:
  merged: integer # 병합된 항목 수
  skipped: integer # 품절 등으로 건너뛴 항목 수
  cart: # 병합 후 전체 장바구니 (GET /api/v1/cart 응답과 동일 구조)
    vendors: [...]
    summary: { ... }
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| PRODUCT_SOLDOUT | 병합 대상 중 품절 상품 | 200 (부분 성공, skipped에 포함) | AC-ORD-013 |
| CART_MAX_ITEMS | 병합 결과 50종 초과 | 422 | AC-ORD-023 |

> **FE 가이드**: 로그인 완료 시점에 localStorage에 비회원 장바구니가 있으면 이 API를 호출하고, 응답 수신 후 localStorage를 비운다. 비회원 장바구니가 비어 있으면 호출하지 않는다.

---

### POST /api/v1/cart/items — 장바구니 담기

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-059, REQ-ORD-104 |
| 채널 | 고객웹 (M) |
| 인증 | 필수 |

**Request:**
```yaml
Body:
  productId: string (required) # 상품 ID
  skuId: string (required)     # SKU (옵션 조합)
  quantity: integer (required, min:1, max:10) # 수량
```

**Response (200):**
```yaml
data:
  cartItemId: string
  productId: string
  skuId: string
  quantity: integer
  unitPrice: integer
  addedAt: datetime
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| PRODUCT_STOPPED | 판매중지 상품 | 422 | AC-ORD-002 |
| PRODUCT_SOLDOUT | 품절 상품 | 422 | AC-ORD-003 |
| OPTION_INVALID | 옵션 미존재 | 422 | AC-ORD-004 |
| CART_MAX_ITEMS | 최대 50종 초과 | 422 | AC-ORD-023 |
| CART_MAX_QTY | 동일 상품 최대 10개 초과 | 422 | AC-ORD-024 |

---

### GET /api/v1/cart — 장바구니 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-060, REQ-ORD-064, REQ-ORD-065 |
| 채널 | 고객웹 (M) |
| 인증 | 필수 |

**Response (200):**
```yaml
data:
  vendors: # 벤더별 그룹핑
    - vendorId: string
      vendorName: string
      shippingFee: integer # 묶음배송 기준 적용
      freeShippingThreshold: integer | null # 무료배송 기준금액 (null=없음)
      freeShippingApplied: boolean # 상품 무료배송(⑥-a) 적용 여부
      items:
        - cartItemId: string
          productId: string
          skuId: string
          productName: string
          optionName: string # "블랙 / XL"
          thumbnail: string # 상품 이미지 URL
          quantity: integer
          originalPrice: integer # 정상가
          # ▼ 상품 단위 할인 (벤더 관할)
          appliedEvent: # ① 행사가 또는 수량구간 (택1, 자동)
            type: string | null # INSTANT_DISCOUNT | QTY_TIER_DISCOUNT | null
            name: string | null # "여름 세일 30%" / "3개↑ 10%"
            discountAmount: integer
          appliedProductCoupon: # ② 상품 쿠폰 (고객 선택, ①과 중복 가능)
            couponId: string | null
            couponName: string | null
            discountAmount: integer
          salePrice: integer # ①+② 적용 후 단가
          status: string # AVAILABLE | SOLDOUT | PRICE_CHANGED

  # ▼ 플랫폼 단위 할인 (운영자 관할) — vendors 바깥
  platformDiscounts:
    cartDiscount: # ③ 장바구니 가격할인 (자동, 1건만)
      applied: boolean
      name: string | null # "5만원↑ 5,000원 할인"
      discountAmount: integer
      condition: string | null # "5만원 이상 구매 시"
    cartCoupon: # ④ 장바구니 쿠폰 (고객 선택, 1건만)
      couponId: string | null
      couponName: string | null
      discountAmount: integer
    orderFreeShipping: # ⑥-b 주문 무료배송
      applied: boolean
      condition: string | null # "5만원↑ 전체 무료배송"

  # ▼ 적용 가능한 할인 안내 (미적용 상태)
  availableDiscounts:
    productCoupons: # 다운로드·적용 가능한 상품 쿠폰
      - couponId: string
        productId: string
        couponName: string
        discountType: string # RATE | AMOUNT
        discountValue: integer
        condition: string
    cartCoupons: # 사용 가능한 장바구니 쿠폰
      - couponId: string
        couponName: string
        discountType: string
        discountValue: integer
        minOrderAmount: integer
    nearConditions: # "N원 더 담으면" 안내
      - type: string # CART_DISCOUNT | FREE_SHIPPING | QTY_TIER
        message: string # "12,000원 더 담으면 장바구니 할인!"
        remainingAmount: integer | null
        remainingQty: integer | null

  summary:
    totalOriginalPrice: integer # 정상가 합계
    totalProductDiscount: integer # ①+② 합계
    totalPlatformDiscount: integer # ③+④ 합계
    totalItemPrice: integer # 정상가 - 전체 할인
    totalShippingFee: integer # 배송비 합계 (할인 적용 후)
    estimatedPaymentAmount: integer # 상품 + 배송비
    availablePoints: integer # 사용 가능 포인트
    pointEarnEstimate: integer # 구매 시 적립 예상
```

---

### PATCH /api/v1/cart/items/{cartItemId}/quantity — 수량 변경

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-061 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  quantity: integer (required, min:1, max:10)
```

**Response (200):**
```yaml
data:
  cartItemId: string
  quantity: integer
  originalPrice: integer # 정상가 (단가)
  # ▼ 상품 단위 할인 (수량 변경으로 적용/해제 가능)
  appliedEvent: # ① 행사가 또는 수량구간 (택1, 자동)
    type: string | null # INSTANT_DISCOUNT | QTY_TIER_DISCOUNT | null
    name: string | null # "3개↑ 10% 할인" (수량 변경으로 새로 적용/해제)
    discountAmount: integer
  appliedProductCoupon: # ② 상품 쿠폰 (기존 적용 유지 여부)
    couponId: string | null
    couponName: string | null
    discountAmount: integer
  salePrice: integer # ①+② 적용 후 단가
  subtotal: integer # salePrice × quantity

  # ▼ 플랫폼 단위 (수량 변경으로 조건 충족/미달 변동)
  platformDiscounts:
    cartDiscount: { applied, name, discountAmount, condition }
    cartCoupon: { couponId, couponName, discountAmount }
    orderFreeShipping: { applied, condition }

  # ▼ 수량 기준 안내 (넛지)
  nearConditions:
    - type: string # QTY_TIER | CART_DISCOUNT | FREE_SHIPPING
      message: string # "2개 더 담으면 수량할인 적용!"
      remainingQty: integer | null
      remainingAmount: integer | null

  summary:
    totalOriginalPrice: integer
    totalProductDiscount: integer # ①+② 합계
    totalPlatformDiscount: integer # ③+④ 합계
    totalItemPrice: integer
    totalShippingFee: integer
    estimatedPaymentAmount: integer
```

---

### DELETE /api/v1/cart/items/{cartItemId} — 장바구니 삭제

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-062 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  deleted: true
  cartItemId: string
  # ▼ 삭제로 인해 변경된 할인 (상품 + 플랫폼 모두)
  affectedDiscounts:
    # 상품 단위 — 삭제된 상품에 걸려 있던 할인
    lostProductDiscounts:
      - type: string # INSTANT_DISCOUNT | QTY_TIER_DISCOUNT | PRODUCT_COUPON
        name: string # "수량구간 10% 할인"
        lostAmount: integer # 삭제로 사라진 할인금액
    # 플랫폼 단위 — 삭제로 주문 총액 감소 → 조건 미달
    affectedPlatformDiscounts:
      - type: string # CART_DISCOUNT | CART_COUPON | ORDER_FREE_SHIPPING
        name: string # "5만원↑ 5,000원 할인"
        status: string # LOST (조건 미달로 해제) | REDUCED (금액 감소)
        lostAmount: integer
        message: string # "이 상품 삭제 시 장바구니 할인 5,000원이 해제됩니다"

  platformDiscounts: # 삭제 후 현재 적용 상태
    cartDiscount: { applied, name, discountAmount, condition }
    cartCoupon: { couponId, couponName, discountAmount }
    orderFreeShipping: { applied, condition }

  summary:
    totalOriginalPrice: integer
    totalProductDiscount: integer
    totalPlatformDiscount: integer
    totalItemPrice: integer
    totalShippingFee: integer
    estimatedPaymentAmount: integer
```

---

## 2. 주문서 (Checkout)

### POST /api/v1/checkout — 주문서 생성 (장바구니 → 주문서)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-063, REQ-ORD-003 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  cartItemIds: string[] (required, min:1) # 선택된 장바구니 항목
```

**Response (200):**
```yaml
data:
  orderId: string # TEMP 상태 주문 생성
  items: # 주문서에 포함된 상품 (벤더별 그룹핑)
    - vendorId: string
      vendorName: string
      vendorLogo: string | null # 입점사 로고 URL
      shippingFee: integer # 해당 벤더 배송비
      freeShippingThreshold: integer | null # 무료배송 기준금액
      shippingPolicy: string | null # "3만원 이상 무료배송" 안내 문구
      orderItems:
        - orderItemId: string
          productId: string
          skuId: string
          productName: string
          optionName: string # "블랙 / XL"
          thumbnail: string # 상품 이미지 URL
          quantity: integer
          originalPrice: integer # 정상가 (단가)
          # ▼ 상품 단위 할인
          appliedEvent: # ① 행사가 또는 수량구간 (택1, 자동)
            type: string | null # INSTANT_DISCOUNT | QTY_TIER_DISCOUNT
            name: string | null
            discountAmount: integer
          appliedProductCoupon: # ② 상품 쿠폰 (고객 선택)
            couponId: string | null
            couponName: string | null
            discountAmount: integer
          salePrice: integer # ①+② 적용 후 단가
          subtotal: integer # salePrice × quantity
  shippingAddresses: # 등록된 배송지 목록
    - addressId: string
      label: string # "집", "회사"
      recipientName: string
      phone: string # 마스킹: 010-****-5678
      address: string
      addressDetail: string
      zipCode: string
      isDefault: boolean
  paymentMethods: # 사용 가능 결제수단
    - methodId: string
      type: string # CARD | EASY_PAY
      displayName: string # "신한 ****-1234" | "카카오페이"
      isDefault: boolean
  # ▼ 플랫폼 단위 할인 (자동 적용 상태)
  platformDiscounts:
    cartDiscount: # ③ 장바구니 가격할인
      applied: boolean
      name: string | null
      discountAmount: integer
      condition: string | null
    orderFreeShipping: # ⑥-b 주문 무료배송
      applied: boolean
      condition: string | null
  # ▼ 고객 선택 가능 할인/쿠폰
  availableProductCoupons: # 상품별 적용 가능 쿠폰
    - couponId: string
      productId: string
      couponName: string
      discountType: string # RATE | AMOUNT
      discountValue: integer
      expiresAt: datetime
  availableCartCoupons: # 장바구니 쿠폰 (1건 선택)
    - couponId: string
      couponName: string
      discountType: string # RATE | AMOUNT
      discountValue: integer
      minOrderAmount: integer
      expiresAt: datetime
  availablePoints: integer # 사용 가능 포인트
  pricing: # 금액 요약
    totalOriginalPrice: integer # 정상가 합계
    totalProductDiscount: integer # ①+② 합계
    totalPlatformDiscount: integer # ③ (쿠폰·포인트 미적용 초기값)
    totalItemPrice: integer # 정상가 - 전체 할인
    totalShippingFee: integer # 배송비 (기본 배송지 기준)
    estimatedPaymentAmount: integer # 예상 결제금액 (쿠폰·포인트 적용 전)
  requiredAgreements: # 필수 약관
    - id: string
      title: string # "구매 동의", "개인정보 제3자 제공"
      required: boolean
      contentUrl: string # 약관 전문 조회 URL
```

---

### GET /api/v1/orders/{orderId}/checkout — 주문서 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-002 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  orderId: string
  status: "TEMP"
  items: # POST /checkout 응답의 items와 동일 구조 (벤더별 그룹핑 + 할인 상세)
    - vendorId: string
      vendorName: string
      shippingFee: integer
      freeShippingApplied: boolean
      orderItems:
        - orderItemId: string
          productName: string
          optionName: string
          thumbnail: string
          quantity: integer
          originalPrice: integer
          appliedEvent: { type, name, discountAmount }
          appliedProductCoupon: { couponId, couponName, discountAmount }
          salePrice: integer
          subtotal: integer
  selectedAddress: { addressId, recipientName, phone, address, zipCode } | null
  selectedPaymentMethod: string | null # CARD | EASY_PAY
  # ▼ 고객이 선택/입력한 플랫폼 할인
  appliedCartCoupon: { couponId, couponName, discountAmount } | null # ④
  pointUsed: integer # ⑤
  # ▼ 자동 적용된 플랫폼 할인
  platformDiscounts:
    cartDiscount: { applied, name, discountAmount, condition } # ③
    orderFreeShipping: { applied, condition } # ⑥-b
  pricing:
    totalOriginalPrice: integer
    totalProductDiscount: integer # ①+②
    totalPlatformDiscount: integer # ③+④
    pointUsed: integer # ⑤
    totalShippingFee: integer # ⑥ 반영 후
    finalPaymentAmount: integer # 최종 결제금액 (포인트 차감 후)
  agreements: # 약관 동의 상태
    - id: string
      title: string
      required: boolean
      agreed: boolean
```

---

### PUT /api/v1/orders/{orderId}/shipping-address — 배송지 선택

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-072 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  addressId: string (required)
```

**Response (200):**
```yaml
data:
  orderId: string
  shippingFee: integer # 재계산된 배송비
  platformDiscounts:
    orderFreeShipping: { applied, condition } # 배송지 변경으로 무료배송 조건 변동 가능
  finalPaymentAmount: integer
```

---

### PUT /api/v1/orders/{orderId}/points — 포인트 사용

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-073, REQ-ORD-074 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  pointAmount: integer (required, min:0)
```

**Response (200):**
```yaml
data:
  pointUsed: integer # ⑤ 적용된 포인트
  pricing:
    totalProductDiscount: integer # ①+②
    totalPlatformDiscount: integer # ③+④
    pointUsed: integer # ⑤
    totalShippingFee: integer
    finalPaymentAmount: integer # 최종 결제금액 (포인트 차감 후)
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| POINT_EXCEED_BALANCE | 보유 포인트 초과 | 422 | AC-ORD-037 |
| POINT_EXCEED_AMOUNT | 결제 금액 초과 | 422 | AC-ORD-038 |

---

### PUT /api/v1/orders/{orderId}/cart-coupon — 장바구니 쿠폰 적용

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-103 |
| 채널 | 고객웹 (M) |
| 설명 | 고객이 장바구니 쿠폰(④)을 선택 적용. 1건만 적용 가능. null 전송 시 해제. |

**Request:**
```yaml
Body:
  couponId: string | null # null = 쿠폰 해제
```

**Response (200):**
```yaml
data:
  appliedCartCoupon:
    couponId: string | null
    couponName: string | null
    discountAmount: integer
  pricing:
    totalProductDiscount: integer
    totalPlatformDiscount: integer # ③+④ 재계산
    pointUsed: integer
    totalShippingFee: integer
    finalPaymentAmount: integer
```

---

### PUT /api/v1/orders/{orderId}/payment-method — 결제수단 선택

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-075 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  paymentMethod: string (required) # CARD | EASY_PAY
```

**Response (200):**
```yaml
data:
  orderId: string
  paymentMethod: string
```

---

## 3. 주문결제 (OrderPayment)

### POST /api/v1/orders/{orderId}/payment — 결제 요청

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-001, REQ-ORD-076 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  agreements: # 필수 약관 동의
    - id: string
      agreed: boolean
```

**Response (200):**
```yaml
data:
  orderId: string
  status: "PROCESSING"
  pgRedirectUrl: string | null # PG 결제창 URL (있으면 리다이렉트)
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| AGREEMENT_REQUIRED | 필수 약관 미동의 | 422 | AC-ORD-041 |
| STOCK_SOLDOUT | 재고선점 실패 | 422 | AC-ORD-068 |

---

### GET /api/v1/orders/{orderId}/payment-status — 결제 처리 상태 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-077 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  orderId: string
  status: "PROCESSING" | "PAYMENT_COMPLETED" | "CANCELLED"
  step: string # STOCK_RESERVING | PG_APPROVING | COMPLETED | FAILED
  estimatedSeconds: integer | null
  failReason: string | null
```

---

## 4. 주문내역 (OrderHistory)

### GET /api/v1/members/me/orders — 고객 주문내역 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-014, REQ-ORD-015 |
| 채널 | 고객웹 (M) |

**Query:**
```yaml
page: integer (default:0)
size: integer (default:20, max:50)
status: string (optional) # 상태 필터
```

**Response (200):**
```yaml
data:
  content:
    - orderId: string
      status: string
      totalAmount: integer
      orderDate: datetime
      items:
        - productName: string
          quantity: integer
          thumbnail: string
  page: { number, size, totalElements, totalPages }
```

---

### GET /api/v1/members/me/orders/{orderId} — 주문상세 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-014, REQ-ORD-080, REQ-ORD-097 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  orderId: string
  status: string
  orderDate: datetime
  items:
    - productName: string
      optionName: string
      quantity: integer
      unitPrice: integer
      actualPaidAmount: integer
  shipping:
    recipientName: string
    phone: string # 마스킹: 010-****-5678
    address: string
    carrier: string | null
    trackingNumber: string | null
    deliveredAt: datetime | null
  payment:
    method: string
    amount: integer
    pointUsed: integer
    couponDiscount: integer
    approvedAt: datetime | null
    receiptUrl: string | null # 영수증 조회 URL
  benefits: # 혜택 적용 내역
    coupons: [{ name, discount }]
    pointUsed: integer
  history: # 변경 이력
    - fromStatus: string
      toStatus: string
      changedAt: datetime
      reason: string | null
```

---

## 5. 주문 취소 (Cancel)

### POST /api/v1/members/me/orders/{orderId}/cancel — 고객 취소

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-006, REQ-ORD-007 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  reason: string (required) # 취소 사유
```

**Response (200):**
```yaml
data:
  orderId: string
  status: "CANCELLED"
  cancelledAt: datetime
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| CANCEL_NOT_ALLOWED | PAYMENT_COMPLETED 이외 상태 | 422 | AC-ORD-047 |

---

### POST /api/admin/v1/orders/{orderId}/cancel — admin 예외 취소

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-008, REQ-ORD-009 |
| 채널 | Admin (A) |

**Request:**
```yaml
Body:
  reason: string (required)
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| CANCEL_NOT_ALLOWED | PAYMENT_COMPLETED 이외 상태 | 422 | AC-ORD-049, 050 |

---

## 6. 구매확정 (Confirm)

### POST /api/v1/members/me/orders/{orderId}/confirm — 구매확정

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-017 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  orderId: string
  status: "CONFIRMED"
  confirmedAt: datetime
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| CONFIRM_NOT_ALLOWED | DELIVERED 이외 상태 | 422 | AC-ORD-057 |

---

## 7. 배송관리 (Delivery) — Partner

### POST /api/partner/v1/orders/{orderId}/ship — 출고 처리

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-018, REQ-ORD-019 |
| 채널 | Partner (P) |

**Response (200):**
```yaml
data:
  orderId: string
  status: "PREPARING"
  shippedAt: datetime
```

---

### POST /api/partner/v1/orders/{orderId}/tracking — 운송장 등록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-020, REQ-ORD-021 |
| 채널 | Partner (P) |

**Request:**
```yaml
Body:
  carrier: string (required) # 택배사 코드
  trackingNumber: string (required) # 운송장번호
```

**Response (200):**
```yaml
data:
  orderId: string
  status: "IN_DELIVERY"
  carrier: string
  trackingNumber: string
```

---

### POST /api/partner/v1/orders/tracking/bulk — 엑셀 일괄 운송장 등록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-022, REQ-ORD-023 |
| 채널 | Partner (P) |

**Request:**
```yaml
Content-Type: multipart/form-data
Body:
  file: Excel file (.xlsx)
```

**Response (200):**
```yaml
data:
  success: integer # 처리 성공 건수
  failed: integer # 실패 건수
  errors: # 실패 상세
    - orderId: string
      reason: string # "NOT_PREPARING" 등
```

---

## 8. 배송추적 (Tracking)

### GET /api/v1/members/me/orders/{orderId}/tracking — 배송추적

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-028 |
| 채널 | 고객웹 (M) |

**Response (200):**
```yaml
data:
  carrier: string
  trackingNumber: string
  status: string # IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED
  history:
    - datetime: datetime
      location: string
      description: string
```

---

## 9. 클레임 — 고객 (Claim)

### POST /api/v1/members/me/orders/{orderId}/claims/return — 반품 신청

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-039, REQ-ORD-040 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  reason: string (required)
  evidenceUrls: string[] (optional) # 증빙 이미지
```

**Response (200):**
```yaml
data:
  claimId: string
  claimType: "RETURN"
  status: "RECEIVED"
  createdAt: datetime
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| CLAIM_PERIOD_EXPIRED | 배송완료 후 10일 초과 | 422 | AC-ORD-113 |

---

### POST /api/v1/members/me/orders/{orderId}/claims/exchange — 교환 신청

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-046, REQ-ORD-090 |
| 채널 | 고객웹 (M) |

**Request:**
```yaml
Body:
  reason: string (required)
  desiredSkuId: string (required) # 희망 교환 옵션
  evidenceUrls: string[] (optional)
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| CLAIM_PERIOD_EXPIRED | 배송완료 후 10일 초과 | 422 | AC-ORD-121 |

---

## 10. 클레임 — Admin

### GET /api/admin/v1/orders/{orderId}/claims — 클레임 목록 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-047~051 |
| 채널 | Admin (A) |

### POST /api/admin/v1/claims/{claimId}/start — 처리시작

### POST /api/admin/v1/claims/{claimId}/complete — 완료처리

### POST /api/admin/v1/claims/{claimId}/reject — 반려확정

### PUT /api/admin/v1/claims/{claimId}/responsibility — 귀책 수정

**Request (귀책 수정):**
```yaml
Body:
  responsibility: string (required) # CUSTOMER | VENDOR | PLATFORM
```

---

## 11. 클레임 — Partner

### GET /api/partner/v1/claims — 클레임 목록 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-031~038, 041~045 |
| 채널 | Partner (P) |

### POST /api/partner/v1/claims/{claimId}/pickup-tracking — 수거 운송장 등록

### POST /api/partner/v1/claims/{claimId}/pickup-complete — 수거 완료

### POST /api/partner/v1/claims/{claimId}/stock-restore — 재고 수동 복구

### POST /api/partner/v1/claims/{claimId}/exchange-ship — 교환 출고

### POST /api/partner/v1/claims/{claimId}/objection — 귀책 이의제기

**Error (이의제기):**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| OBJECTION_ALREADY_FILED | 이미 1회 등록됨 | 422 | AC-ORD-109 |

---

## 12. Admin 주문관리

### GET /api/admin/v1/orders — 주문 목록 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-013 |
| 채널 | Admin (A) |

**Query:**
```yaml
page, size, status, vendorId, dateFrom, dateTo, keyword
```

### POST /api/admin/v1/orders/{orderId}/cart-add — 장바구니 담아주기

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-012 |

---

## 13. Partner 주문관리

### GET /api/partner/v1/orders — 결제상태별 주문 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-ORD-094 |
| 채널 | Partner (P) |

**Query:**
```yaml
paymentStatus: string # PAYMENT_COMPLETED | CANCELLED | REFUNDED
page, size
```

---

## Error Catalog (Order 도메인 전체)

| code | HTTP | 설명 | 대응 GWT |
|---|---|---|---|
| PRODUCT_STOPPED | 422 | 판매중지 상품 | AC-ORD-002 |
| PRODUCT_SOLDOUT | 422 | 품절 | AC-ORD-003 |
| OPTION_INVALID | 422 | 옵션 미존재 | AC-ORD-004 |
| CART_MAX_ITEMS | 422 | 장바구니 최대 종류 초과 | AC-ORD-023 |
| CART_MAX_QTY | 422 | 동일 상품 최대 수량 초과 | AC-ORD-024 |
| POINT_EXCEED_BALANCE | 422 | 보유 포인트 초과 | AC-ORD-037 |
| POINT_EXCEED_AMOUNT | 422 | 결제 금액 초과 | AC-ORD-038 |
| AGREEMENT_REQUIRED | 422 | 필수 약관 미동의 | AC-ORD-041 |
| STOCK_SOLDOUT | 422 | 재고선점 실패(품절) | AC-ORD-068 |
| CANCEL_NOT_ALLOWED | 422 | 취소 불가 상태 | AC-ORD-047,049,050 |
| CONFIRM_NOT_ALLOWED | 422 | 구매확정 불가 상태 | AC-ORD-057 |
| CLAIM_PERIOD_EXPIRED | 422 | 클레임 기한 초과(10일) | AC-ORD-113,121 |
| OBJECTION_ALREADY_FILED | 422 | 이의제기 중복 | AC-ORD-109 |
| STOCK_RESTORE_DUPLICATE | 422 | 재고복구 중복 | AC-ORD-107 |
| DELIVERY_ADDRESS_CHANGE_NOT_ALLOWED | 422 | 배송지 변경 불가 (IN_DELIVERY 이후) | AC-ORD-083,084 |
| TRACKING_EDIT_NOT_ALLOWED | 422 | 운송장 수정 불가 (IN_DELIVERY 이후) | AC-ORD-086 |
| EXCHANGE_OUT_OF_STOCK | 422 | 교환 대상 재고 없음 | AC-ORD-115 |
| EXCHANGE_SHIP_IRREVERSIBLE | 422 | 교환출고 되돌리기 불가 | AC-ORD-118 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — EARS 100개 + GWT 134개 기반 API 도출 |
