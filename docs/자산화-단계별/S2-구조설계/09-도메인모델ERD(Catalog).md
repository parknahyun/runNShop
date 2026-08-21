# 도메인 모델 (ERD) — Catalog

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Design
>
> **작성 목적**: EARS(⑧)에서 도출된 엔티티·속성·관계를 테이블 설계로 구체화한다.
> **흐름 내 위치**: ⑧ EARS → **⑨ 도메인 모델(ERD)** → ⑩ 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (DBA/아키텍트 검토)

| 항목 | 내용 |
|---|---|
| ID | DESIGN-ERD-CATALOG-001 |
| 상태 | **Draft** |
| 작성일 | 2026-07-08 |
| 갱신일 | 2026-07-08 |

---

## 테이블 구조

```
cat_product (상품 마스터)
  ├── cat_product_image (상품 이미지)
  ├── cat_product_option_group (옵션그룹)
  │     └── cat_product_option_value (옵션값)
  └── cat_sku (SKU: 재고 관리 단위)
        ├── cat_stock_history (재고 이력)
        └── cat_price_history (가격 이력)

cat_category (표준 카테고리)
cat_display_category (전시 카테고리)
cat_category_mapping (카테고리 N:M 매핑)
cat_brand (브랜드 마스터)

cat_display_page (전시 페이지)
  └── cat_display_section (전시 섹션)
cat_display_template (전시 템플릿)
```

---

## DBML

```dbml
Table cat_product {
  id varchar [pk, note: 'ULID']
  name varchar [not null, note: '상품명']
  vendor_id varchar [not null, note: '판매자 ID (멀티벤더)']
  category_id varchar [not null, note: 'cat_category.id 참조']
  brand_id varchar [note: 'cat_brand.id 참조']
  status varchar [not null, note: 'DRAFT / REVIEW_REQUESTED / UNDER_REVIEW / ON_SALE / SOLD_OUT / DISCONTINUED / REJECTED']
  reject_reason text [note: '반려 사유 (REJECTED 시 필수)']
  price_original int [not null, note: '원가 (매입가)']
  price_sale int [not null, note: '판매가 (고객 노출)']
  price_supply int [not null, note: '공급가 (벤더 정산 기준)']
  description text [note: '상품 상세 설명 (HTML/Markdown)']
  avg_rating decimal [default: 0, note: '평균 평점 (RatingUpdated 연동)']
  review_count int [default: 0, note: '리뷰 수']
  created_at timestamp [not null]
  updated_at timestamp [not null]
  is_deleted boolean [default: false]

  indexes {
    vendor_id [name: 'idx_product_vendor']
    category_id [name: 'idx_product_category']
    brand_id [name: 'idx_product_brand']
    (status, created_at) [name: 'idx_product_status_date']
    name [name: 'idx_product_name']
  }

  note: '상품 마스터. REQ-CAT-008~018'
}

Table cat_product_image {
  id varchar [pk, note: 'ULID']
  product_id varchar [not null, ref: > cat_product.id]
  image_url varchar [not null, note: 'CDN 경로']
  sort_order int [not null, default: 0, note: '정렬 순서']
  image_type varchar [not null, default: 'DETAIL', note: 'MAIN / DETAIL / THUMBNAIL']
  created_at timestamp [not null]

  indexes {
    product_id [name: 'idx_pimg_product']
    (product_id, sort_order) [name: 'idx_pimg_sort']
  }

  note: 'REQ-CAT-015~016: 상품 이미지 (최대 10장)'
}

Table cat_product_option_group {
  id varchar [pk, note: 'ULID']
  product_id varchar [not null, ref: > cat_product.id]
  name varchar [not null, note: '옵션그룹명 (예: 색상, 사이즈)']
  sort_order int [not null, default: 0]
  created_at timestamp [not null]

  indexes {
    product_id [name: 'idx_optgrp_product']
  }

  note: '옵션그룹. REQ-CAT-017'
}

Table cat_product_option_value {
  id varchar [pk, note: 'ULID']
  option_group_id varchar [not null, ref: > cat_product_option_group.id]
  value varchar [not null, note: '옵션값 (예: Red, XL)']
  sort_order int [not null, default: 0]
  created_at timestamp [not null]

  indexes {
    option_group_id [name: 'idx_optval_group']
  }

  note: '옵션값. REQ-CAT-017'
}

Table cat_sku {
  id varchar [pk, note: 'ULID']
  product_id varchar [not null, ref: > cat_product.id]
  option_values_json varchar [note: 'JSON: 선택된 옵션값 조합 (예: {"색상":"Red","사이즈":"XL"})']
  stock_quantity int [not null, default: 0, note: '총 재고 수량']
  available_quantity int [not null, default: 0, note: '가용 재고 (stock - 선점분)']
  is_redis_target boolean [default: false, note: '고빈도 조회 대상 (Redis 캐시)']
  sku_code varchar [note: '외부 SKU 코드']
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    product_id [name: 'idx_sku_product']
    (product_id, option_values_json) [unique, name: 'uq_sku_option']
    is_redis_target [name: 'idx_sku_redis']
  }

  note: 'SKU: 재고 관리 단위. REQ-CAT-002~007, REQ-CAT-022~024, REQ-CAT-031'
}

Table cat_category {
  id varchar [pk, note: 'ULID']
  parent_id varchar [note: '상위 카테고리 (NULL이면 루트)']
  name varchar [not null, note: '카테고리명']
  depth int [not null, default: 1, note: '깊이 레벨']
  sort_order int [not null, default: 0]
  is_active boolean [default: true]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    parent_id [name: 'idx_cat_parent']
    (depth, sort_order) [name: 'idx_cat_depth_sort']
  }

  note: '표준 카테고리 (트리). REQ-CAT-019'
}

Table cat_display_category {
  id varchar [pk, note: 'ULID']
  parent_id varchar [note: '상위 전시 카테고리']
  name varchar [not null, note: '전시 카테고리명']
  depth int [not null, default: 1]
  sort_order int [not null, default: 0]
  is_active boolean [default: true]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    parent_id [name: 'idx_dcat_parent']
  }

  note: '전시 카테고리 (트리). REQ-CAT-020'
}

Table cat_category_mapping {
  id varchar [pk, note: 'ULID']
  category_id varchar [not null, ref: > cat_category.id]
  display_category_id varchar [not null, ref: > cat_display_category.id]
  created_at timestamp [not null]

  indexes {
    (category_id, display_category_id) [unique, name: 'uq_cat_dcat']
  }

  note: '표준↔전시 카테고리 N:M 매핑. REQ-CAT-021'
}

Table cat_brand {
  id varchar [pk, note: 'ULID']
  name varchar [not null, note: '브랜드명']
  logo_url varchar [note: '브랜드 로고']
  is_active boolean [default: true]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    name [unique, name: 'uq_brand_name']
  }

  note: '브랜드 마스터'
}

Table cat_stock_history {
  id varchar [pk, note: 'ULID']
  sku_id varchar [not null, ref: > cat_sku.id]
  change_type varchar [not null, note: 'RESERVE / RESTORE / MANUAL_ADJUST / RESTOCK']
  change_quantity int [not null, note: '변동 수량 (+/-)']
  after_stock int [not null, note: '변동 후 총 재고']
  after_available int [not null, note: '변동 후 가용 재고']
  reason varchar [note: '변동 사유 (order_id 등)']
  created_at timestamp [not null]

  indexes {
    sku_id [name: 'idx_sthist_sku']
    (sku_id, created_at) [name: 'idx_sthist_sku_date']
  }

  note: 'REQ-CAT-005: 모든 재고 변동 이력 기록'
}

Table cat_price_history {
  id varchar [pk, note: 'ULID']
  product_id varchar [not null, ref: > cat_product.id]
  price_type varchar [not null, note: 'ORIGINAL / SALE / SUPPLY']
  before_price int [not null]
  after_price int [not null]
  changed_by varchar [not null, note: '변경자 (vendor_id 또는 admin_id)']
  reason varchar [note: '변경 사유']
  created_at timestamp [not null]

  indexes {
    product_id [name: 'idx_phist_product']
    (product_id, created_at) [name: 'idx_phist_product_date']
  }

  note: 'REQ-CAT-025: 가격 변경 이력 기록'
}

Table cat_display_page {
  id varchar [pk, note: 'ULID']
  title varchar [not null, note: '페이지 제목']
  slug varchar [not null, note: 'URL 슬러그']
  status varchar [not null, note: 'DRAFT / DRAFT_EDIT / PUBLISHED / SCHEDULED / RESERVED / CLOSED / CANCELLED']
  template_id varchar [ref: > cat_display_template.id]
  scheduled_at timestamp [note: '예약 게시 시각']
  published_at timestamp [note: '실제 게시 시각']
  closed_at timestamp [note: '종료 시각']
  created_by varchar [not null, note: '생성자 (admin_id)']
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    status [name: 'idx_dpage_status']
    slug [unique, name: 'uq_dpage_slug']
    scheduled_at [name: 'idx_dpage_scheduled']
  }

  note: '전시 페이지. 상태머신 별도 정의'
}

Table cat_display_section {
  id varchar [pk, note: 'ULID']
  page_id varchar [not null, ref: > cat_display_page.id]
  section_type varchar [not null, note: 'BANNER / PRODUCT_LIST / CATEGORY_GRID / CUSTOM_HTML']
  title varchar [note: '섹션 제목']
  content_json text [note: '섹션 콘텐츠 (상품ID 목록, 배너 URL 등)']
  sort_order int [not null, default: 0]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    page_id [name: 'idx_dsec_page']
    (page_id, sort_order) [name: 'idx_dsec_sort']
  }

  note: '전시 섹션'
}

Table cat_display_template {
  id varchar [pk, note: 'ULID']
  name varchar [not null, note: '템플릿명']
  layout_json text [not null, note: '레이아웃 정의 (섹션 배치 규칙)']
  is_active boolean [default: true]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    name [unique, name: 'uq_template_name']
  }

  note: '전시 템플릿'
}
```

---

## 불변식 (Invariants)

| 불변식 | 검증 시점 | 도출 근거 |
|---|---|---|
| `cat_sku.available_quantity ≥ 0` | 재고 차감 시 | REQ-CAT-003: 가용 재고 미만 차감 불가 |
| `cat_sku.available_quantity ≤ cat_sku.stock_quantity` | 재고 변동 시 | 논리적 제약: 가용 ≤ 총재고 |
| `cat_product_image` 동일 product_id 건수 ≤ 10 | 이미지 등록 시 | REQ-CAT-016: 상품당 최대 10장 |
| `cat_product.status = REJECTED`일 때 `reject_reason IS NOT NULL` | 상태 전이 시 | REQ-CAT-012: 반려 사유 필수 |
| `cat_display_page.slug` 전역 유니크 | 페이지 생성 시 | URL 충돌 방지 |
| `cat_category_mapping` (category_id, display_category_id) 유니크 | 매핑 생성 시 | REQ-CAT-021: 중복 매핑 방지 |

---

## Soft Delete 정책

| 테이블 | 정책 | 사유 |
|---|---|---|
| cat_product | `is_deleted = true` | 주문 이력 참조 유지 (물리 삭제 불가) |
| cat_product_image | 물리 삭제 허용 | CDN 파일 별도 관리 |
| cat_sku | `is_deleted = true` (미지원 시 product와 동일) | 재고 이력 참조 유지 |
| cat_stock_history | 물리 삭제 없음, 영구 보존 | 감사 이력 |
| cat_price_history | 물리 삭제 없음, 영구 보존 | 감사 이력 |
| cat_category / cat_display_category | `is_active = false` | 기존 매핑 참조 보존 |
| cat_brand | `is_active = false` | 기존 상품 참조 보존 |
| cat_display_page | 물리 삭제 없음 | 게시 이력 보존 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 엔티티 도출 | `08-EARS기능요구(Catalog).md` 주어/목적어 명사 추출 |
| 테이블 접두사 `cat_` | `05-도메인정의서.md` 스키마 그룹핑 |
| 재고 불변식 | REQ-CAT-003, REQ-CAT-005 |
| 이미지 제한 | REQ-CAT-016 |
| 가격 이력 | REQ-CAT-025 |
| 상태값 목록 | `10-상태머신(Catalog).md` (상호 참조) |
| Redis 캐시 대상 | REQ-CAT-031 |
