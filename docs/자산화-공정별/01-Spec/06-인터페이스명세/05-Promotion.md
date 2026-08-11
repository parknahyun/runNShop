# Promotion 도메인 인터페이스 명세 (초안)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-API-PROMOTION-001 |
| Scope | Bolt (Promotion 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 구현 단계 | **Mock** (1차 본개발: Order·Payment. Promotion은 PublicApi Mock 제공) |
| 입력 자산 | EARS(05-Promotion.md), GWT(05-Promotion.md), 프로모션-할인유형-적용순서.md |

---

## 1. Internal PublicApi (Order 연동 — Phase 0)

### GET /api/internal/promotion/products/{productId}/discount — 상품별 할인 계산

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-001, REQ-PRM-007 |
| 호출자 | Order BE (동기) |

**Query:**
```yaml
skuId: string (required)
qty: integer (required)
```

**Response (200):**
```yaml
data:
  productId: string
  skuId: string
  appliedDiscount:
    type: string | null # INSTANT_DISCOUNT | QTY_TIER_DISCOUNT | null
    name: string | null # "여름 세일 20%"
    discountAmount: integer # 할인금액 (0이면 할인 없음)
    discountedUnitPrice: integer # 할인 적용 후 단가
  originalPrice: integer
```

---

### POST /api/internal/promotion/cart-discount/evaluate — 장바구니 할인 조건 평가

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-002 |
| 호출자 | Order BE (동기) |

**Request:**
```yaml
Body:
  orderTotalAmount: integer (required) # 상품 할인 적용 후 주문 총액
  productIds: string[] (required)
```

**Response (200):**
```yaml
data:
  eligible: boolean # 조건 충족 여부
  discount:
    name: string | null # "5만원 이상 5,000원 할인"
    discountAmount: integer # 0이면 미충족
    condition: string | null # "50,000원 이상 구매 시"
    remainingAmount: integer | null # 조건까지 부족한 금액 (넛지용)
```

---

### POST /api/internal/promotion/coupons/{couponId}/validate — 쿠폰 유효성 검증

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-003, REQ-PRM-004 |
| 호출자 | Order BE (동기) |

**Request:**
```yaml
Body:
  memberId: string (required)
  productIds: string[] (required)
  orderAmount: integer (required)
```

**Response (200):**
```yaml
data:
  valid: boolean
  discountAmount: integer # 유효 시 할인금액
  invalidReason: string | null # EXPIRED | USAGE_EXCEEDED | MIN_ORDER_NOT_MET | PRODUCT_MISMATCH
```

---

### GET /api/internal/promotion/coupons/available — 사용 가능 쿠폰 목록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-005 |
| 호출자 | Order BE (동기) |

**Query:**
```yaml
memberId: string (required)
productIds: string[] (required)
```

**Response (200):**
```yaml
data:
  productCoupons: # 상품 쿠폰
    - couponId: string
      productId: string
      couponName: string
      discountType: string # RATE | AMOUNT
      discountValue: integer
      expiresAt: datetime
  cartCoupons: # 장바구니 쿠폰
    - couponId: string
      couponName: string
      discountType: string
      discountValue: integer
      minOrderAmount: integer
      expiresAt: datetime
```

---

### GET /api/internal/promotion/products/{productId}/qty-discount — 수량구간 조건 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-006 |
| 호출자 | Order BE (동기) |

**Response (200):**
```yaml
data:
  productId: string
  tiers:
    - minQty: integer # 3
      discountRate: integer # 10 (%)
    - minQty: integer # 5
      discountRate: integer # 15
```

---

## 2. Admin API

### POST /api/admin/v1/promotions/instant-discount — 행사가 등록·활성화

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-010 |

**Request:**
```yaml
Body:
  name: string (required)
  productIds: string[] (required)
  discountType: string # RATE | AMOUNT
  discountValue: integer (required)
  startAt: datetime (required)
  endAt: datetime (required)
  limitQty: integer | null # 수량 한정 (null=무제한)
  activate: boolean # true=즉시 활성화
```

---

### POST /api/admin/v1/promotions/qty-discount — 수량 할인 등록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-020, REQ-PRM-021 |

**Request:**
```yaml
Body:
  name: string (required)
  productIds: string[] (required)
  tiers:
    - minQty: integer
      discountRate: integer
  startAt: datetime
  endAt: datetime
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| EXCLUSIVE_DISCOUNT_CONFLICT | 동일 상품에 행사가 이미 ACTIVE | 422 | AC-PRM-005, 020 |

---

### POST /api/admin/v1/promotions/cart-discount — 장바구니 할인 등록

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-PRM-030, REQ-PRM-031, REQ-PRM-032 |

**Request:**
```yaml
Body:
  name: string (required)
  conditionAmount: integer (required) # N만원 이상
  discountAmount: integer (required) # M원 할인
  startAt: datetime
  endAt: datetime
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| CART_DISCOUNT_LIMIT | 이미 1건 ACTIVE | 422 | AC-PRM-023 |
| VENDOR_NOT_ALLOWED | 벤더가 등록 시도 | 403 | AC-PRM-022 |

---

## Error Catalog

| code | HTTP | 설명 | 대응 GWT |
|---|---|---|---|
| EXCLUSIVE_DISCOUNT_CONFLICT | 422 | 행사가↔수량할인 택1 위반 | AC-PRM-005, 020 |
| CART_DISCOUNT_LIMIT | 422 | 장바구니 할인 1건 초과 | AC-PRM-023 |
| VENDOR_NOT_ALLOWED | 403 | 벤더의 장바구니 할인 등록 시도 | AC-PRM-022 |
| COUPON_EXPIRED | 200 (valid=false) | 유효기간 만료 | AC-PRM-010 |
| COUPON_USAGE_EXCEEDED | 200 (valid=false) | 사용횟수 초과 | AC-PRM-011 |
| COUPON_MIN_ORDER_NOT_MET | 200 (valid=false) | 최소주문금액 미달 | AC-PRM-012 |
| CART_COUPON_LIMIT | 422 | 장바구니 쿠폰 1건 초과 | AC-PRM-032 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — Internal PublicApi 5개 + Admin 주요 endpoint |
