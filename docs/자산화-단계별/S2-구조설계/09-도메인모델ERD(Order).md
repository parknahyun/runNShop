# 도메인 모델 (ERD) — Order

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Design
>
> **작성 목적**: EARS(⑧)에서 도출된 엔티티·속성·관계를 테이블 설계로 구체화한다.
> **흐름 내 위치**: ⑧ EARS → **⑨ 도메인 모델(ERD)** → ⑩ 상태머신
> **작성 주체**: 시니어 개발자 + AI 협업 (DBA/아키텍트 검토)

| 항목 | 내용 |
|---|---|
| ID | DESIGN-ERD-ORDER-001 |
| 상태 | **Finalized** |
| 작성일 | 2026-08-11 |
| 갱신일 | 2026-08-11 |

---

## 2계층 주문 구조

```
ord_platform_order (고객 주문 단위, 1:N)
  └── ord_order (입점사별 처리 단위)
        ├── ord_order_item (주문상품 라인)
        ├── ord_shipping (배송정보)
        ├── ord_claim (클레임)
        └── ord_order_history (상태변경 이력)

ord_cart (장바구니, 독립)
```

---

## DBML

```dbml
Table ord_platform_order {
  id varchar [pk, note: 'ULID']
  member_id varchar [not null, note: '주문자 (Member 도메인)']
  status varchar [not null, note: 'TEMP / SPLIT_TO_ORDERS']
  total_amount int [not null, note: '결제 요청 총액']
  point_used int [default: 0]
  coupon_discount int [default: 0]
  created_at timestamp [not null]
  updated_at timestamp [not null]
  is_deleted boolean [default: false]

  indexes {
    member_id [name: 'idx_porder_member']
    created_at [name: 'idx_porder_created']
  }

  note: '고객이 보는 주문 단위. 결제완료 즉시 입점사별 ord_order로 분할'
}

Table ord_order {
  id varchar [pk, note: 'ULID']
  platform_order_id varchar [not null, ref: > ord_platform_order.id]
  vendor_id varchar [not null, note: '입점사 ID (Vendor 도메인)']
  status varchar [not null, note: 'PROCESSING / PAYMENT_COMPLETED / PREPARING / IN_DELIVERY / DELIVERED / CONFIRMED / CANCELLED / PAYMENT_FAILED']
  total_amount int [not null]
  shipping_fee int [default: 0]
  cancel_reason varchar
  confirmed_at timestamp
  created_at timestamp [not null]
  updated_at timestamp [not null]
  is_deleted boolean [default: false]

  indexes {
    platform_order_id [name: 'idx_order_platform']
    vendor_id [name: 'idx_order_vendor']
    (status, created_at) [name: 'idx_order_status_date']
  }

  note: '입점사별 처리 단위. 배송·정산·클레임의 기본 단위'
}

Table ord_order_item {
  id varchar [pk, note: 'ULID']
  order_id varchar [not null, ref: > ord_order.id]
  product_id varchar [not null, note: 'Catalog 상품 ID']
  sku_id varchar [not null, note: 'SKU (옵션 조합)']
  product_name varchar [not null, note: '주문 시점 스냅샷']
  option_name varchar
  quantity int [not null]
  unit_price int [not null, note: '주문 시점 단가']
  actual_paid_amount int [not null, note: '할인 안분 후 실결제금액']
  created_at timestamp [not null]

  indexes {
    order_id [name: 'idx_oitem_order']
  }
}

Table ord_cart {
  id varchar [pk, note: 'ULID']
  member_id varchar [not null]
  product_id varchar [not null]
  sku_id varchar [not null]
  vendor_id varchar [not null]
  quantity int [not null, default: 1]
  added_at timestamp [not null]
  is_deleted boolean [default: false]

  indexes {
    member_id [name: 'idx_cart_member']
    (member_id, product_id, sku_id) [unique, name: 'uq_cart_member_sku']
  }

  note: '장바구니. 동일 상품+옵션은 수량 합산 (REQ-ORD-005)'
}

Table ord_shipping {
  id varchar [pk, note: 'ULID']
  order_id varchar [not null, ref: > ord_order.id]
  recipient_name varchar [not null]
  phone varchar [not null, note: '마스킹: 010-****-5678']
  address varchar [not null]
  address_detail varchar
  zip_code varchar [not null]
  carrier varchar
  tracking_number varchar
  shipped_at timestamp
  delivered_at timestamp
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_shipping_order']
  }
}

Table ord_claim {
  id varchar [pk, note: 'ULID']
  order_id varchar [not null, ref: > ord_order.id]
  claim_type varchar [not null, note: 'CANCEL / RETURN / EXCHANGE']
  status varchar [not null, note: 'RECEIVED / IN_PROGRESS / COMPLETED / REJECTED']
  reason varchar [not null]
  responsibility varchar [note: 'CUSTOMER / VENDOR / PLATFORM']
  extra_shipping_fee int [default: 0]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_claim_order']
    (claim_type, status) [name: 'idx_claim_type_status']
  }
}

Table ord_order_history {
  id varchar [pk, note: 'ULID']
  order_id varchar [not null, ref: > ord_order.id]
  from_status varchar [not null]
  to_status varchar [not null]
  changed_by varchar [not null, note: 'member_id / admin_id / SYSTEM']
  reason varchar
  created_at timestamp [not null]

  indexes {
    order_id [name: 'idx_history_order']
  }

  note: 'REQ-ORD-039: 모든 상태 변경 이력 기록'
}
```

---

## 불변식 (Invariants)

| 불변식 | 검증 시점 | 도출 근거 |
|---|---|---|
| `SUM(ord_order_item.actual_paid_amount) == ord_order.total_amount` | 주문 생성 시 | 부분반품 환불 기준 정합성 |
| `ord_cart` 동일 member+sku는 unique | 담기 시 | REQ-ORD-005: 수량 합산, 중복 라인 방지 |
| `ord_platform_order.total_amount == SUM(ord_order.total_amount) + SUM(ord_order.shipping_fee)` | 주문 분할 시 | 플랫폼주문↔입점사주문 금액 정합 |
| `ord_order.status` 전이는 상태머신(⑩) 허용 전이만 가능 | 상태 변경 시 | 금지 전이 위반 방지 |

---

## Soft Delete 정책

| 테이블 | 정책 | 사유 |
|---|---|---|
| ord_cart | `is_deleted = true`, 30일 보관 후 배치 물리 삭제 | 비즈니스 데이터 아님 |
| ord_platform_order | `is_deleted = true`, 영구 보관 | 법적 보관 의무 (전자상거래법 5년) |
| ord_order | `is_deleted = true`, 영구 보관 | 법적 보관 의무 |
| ord_order_item | 물리 삭제 없음 | 주문 이력 일부 |
| ord_shipping | 물리 삭제 없음 | 배송 증빙 |
| ord_claim | 물리 삭제 없음 | 클레임 이력 |
| ord_order_history | 물리 삭제 없음 | 감사 로그 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 엔티티 도출 | `08-EARS기능요구(Order).md` 주어/목적어 명사 추출 |
| 테이블 접두사 `ord_` | `05-도메인정의서.md` 스키마 그룹핑 |
| 2계층 주문구조 | 도메인정의서 §4: Order-Vendor 관계 + 정산 단위 요구 |
| 장바구니 50개 제한 | REQ-ORD-004 |
| 스냅샷 원칙 (product_name, unit_price) | REQ-ORD-009 |
| 반품 기한 10일 | REQ-ORD-030 |
