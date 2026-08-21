# Catalog 도메인 인터페이스 명세 (초안)

| 항목 | 내용 |
|---|---|
| 산출물 ID | SPEC-API-CATALOG-001 |
| Scope | Bolt (Catalog 도메인) |
| 상태 | DRAFT-v1 |
| 작성일 | 2026-07-30 |
| 구현 단계 | **Mock** (1차 본개발: Order·Payment. Catalog는 PublicApi Mock 제공) |
| 입력 자산 | EARS(02-Catalog.md), GWT(02-Catalog.md), 도메인간-우선업무-의존관계.md |

> **Catalog API 2종류**:
> - **Internal PublicApi** (`/api/internal/catalog/`): Order BE가 in-process 호출. 화면 노출 없음.
> - **External API** (`/api/v1/`, `/api/partner/v1/`, `/api/admin/v1/`): 화면에서 직접 호출.

---

## 1. Internal PublicApi (Order 연동 — Phase 0)

### GET /api/internal/catalog/products/{productId}/validity — 상품 유효성 확인

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-001 |
| 호출자 | Order BE (동기, in-process) |

**Response (200):**
```yaml
data:
  productId: string
  saleStatus: string # ON_SALE | SOLD_OUT | DISCONTINUED
  skus:
    - skuId: string
      optionName: string # "빨강 / M"
      available: boolean # 재고 1개 이상
      stock: integer
```

---

### GET /api/internal/catalog/products/{productId} — 상품 정보 조회

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-002 |
| 호출자 | Order BE (동기) |

**Response (200):**
```yaml
data:
  productId: string
  productName: string
  thumbnail: string # 대표 이미지 URL
  originalPrice: integer # 정상가
  vendorId: string
  vendorName: string
  skus:
    - skuId: string
      optionName: string
      salePrice: integer # 현재 판매가 (행사가 적용 후)
      stock: integer
```

---

### POST /api/internal/catalog/stocks/reserve — 재고 선점 (동기)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-003, REQ-CAT-004, REQ-CAT-006 |
| 호출자 | Order BE (동기, 즉시 응답 필수) |
| 동시성 | 일반=DB FOR UPDATE, 행사=Redis DECR (ADR-015) |

**Request:**
```yaml
Body:
  orderId: string (required)
  items:
    - skuId: string (required)
      qty: integer (required, min:1)
```

**Response (200):**
```yaml
data:
  result: string # SUCCESS | PARTIAL_FAIL | FAIL
  reservationId: string
  items:
    - skuId: string
      requested: integer
      reserved: integer # 실제 선점된 수량
      availableStock: integer # 현재 가용 재고
      success: boolean
```

**Error:**
| code | 조건 | HTTP | 대응 GWT |
|---|---|---|---|
| STOCK_INSUFFICIENT | 가용 재고 < 요청 수량 | 200 (result=FAIL) | AC-CAT-008, 009 |

---

### POST /api/internal/catalog/stocks/release — 재고 복원 (비동기 이벤트 수신)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-005 |
| 호출자 | Order 도메인 이벤트 (StockReleaseRequested, 비동기 Outbox) |
| 동시성 | 일반=DB UPDATE, 행사=Redis INCR |

> 이 API는 직접 HTTP 호출이 아닌 **이벤트 컨슈머**가 처리합니다.
> 이벤트 스키마:
```yaml
eventType: StockReleaseRequested
payload:
  orderId: string
  reason: string # CANCELLED | TIMEOUT | RETURN
  items:
    - skuId: string
      qty: integer
```

---

### GET /api/internal/catalog/skus/{skuId}/stock — SKU 재고 확인

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-007 |
| 호출자 | Order BE (동기) |

**Response (200):**
```yaml
data:
  skuId: string
  availableStock: integer
  isEventProduct: boolean # Redis 대상 여부
```

---

## 2. 고객 API (Mobile)

### GET /api/v1/products/{productId} — 상품 상세 (고객)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-050 |
| 채널 | 고객웹 (M) |
| 인증 | 불필요 (SEO 대상 — BFF/SSR) |

**Response (200):**
```yaml
data:
  productId: string
  productName: string
  images: string[] # 이미지 URL 목록
  originalPrice: integer
  salePrice: integer
  discountRate: integer | null
  vendorId: string
  vendorName: string
  category:
    id: string
    name: string
  brand:
    id: string
    name: string
  options:
    - skuId: string
      optionName: string
      stock: integer # 0이면 품절 표시
      salePrice: integer
  description: string # 상세 소개 HTML
  rating: number # 평점 (4.5)
  reviewCount: integer
  seoMeta: # BFF/SSR용 SEO 메타
    title: string
    description: string
    ogImage: string
```

---

### GET /api/v1/categories — 카테고리 탐색 (고객)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-051 |
| 채널 | 고객웹 (M) |
| 인증 | 불필요 (SEO 대상) |

**Response (200):**
```yaml
data:
  categories:
    - id: string
      name: string
      depth: integer
      children: [...] # 재귀 구조
  products: # 선택된 카테고리의 상품 목록
    content: [...]
    page: { number, size, totalElements }
```

---

## 3. Partner API (입점사)

### POST /api/partner/v1/products — 상품 등록 (심사요청)

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-010 |
| 채널 | Partner (P) |

**Request:**
```yaml
Body:
  productName: string (required)
  categoryId: string (required)
  brandId: string (required)
  originalPrice: integer (required)
  salePrice: integer (required)
  description: string (required)
  images: string[] (required, min:1)
  options: # SKU 옵션
    - optionName: string
      additionalPrice: integer
      stock: integer
  submitForReview: boolean # true=심사요청, false=임시저장
```

**Response (200):**
```yaml
data:
  productId: string
  status: string # REVIEW_REQUESTED | DRAFT
```

---

### PATCH /api/partner/v1/products/{productId}/inventory — 재고 수정

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-040 |
| 채널 | Partner (P) |

**Request:**
```yaml
Body:
  skus:
    - skuId: string
      stock: integer (min:0)
```

---

## 4. Admin API

### POST /api/admin/v1/products/{productId}/approve — 상품 승인

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-012 |
| 채널 | Admin (A) |

**Response (200):**
```yaml
data:
  productId: string
  status: "ON_SALE"
```

---

### POST /api/admin/v1/products/{productId}/reject — 상품 반려

| 항목 | 내용 |
|---|---|
| 대응 EARS | REQ-CAT-013, REQ-CAT-014 |
| 채널 | Admin (A) |

**Request:**
```yaml
Body:
  reason: string (required) # 반려 사유 필수
```

**Error:**
| code | 조건 | HTTP |
|---|---|---|
| REASON_REQUIRED | 반려 사유 미입력 | 422 |

---

## Error Catalog

| code | HTTP | 설명 | 대응 GWT |
|---|---|---|---|
| STOCK_INSUFFICIENT | 200 (result=FAIL) | 가용 재고 부족 | AC-CAT-008, 009 |
| PRODUCT_NOT_FOUND | 404 | 상품 미존재 | AC-CAT-005 |
| REASON_REQUIRED | 422 | 반려 사유 미입력 | AC-CAT-018 |

---

## 변경 이력

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| DRAFT-v1 | 2026-07-30 | 초판 — Internal PublicApi 5개 + External API 주요 endpoint |
