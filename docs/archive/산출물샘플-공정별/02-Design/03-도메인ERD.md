# 샘플: 도메인·ERD (Design, Domain: Order/Payment, DBML)

> **선행 산출물**: 상위 유스케이스(엔티티 후보 도출)
> **Scope**: Domain (현행화: Bolt)
> **2계층 주문구조**: `ord_platform_order`(고객 주문 단위) + `ord_order`(입점사별 처리 단위) 분리

---

## Order 도메인

```dbml
Table ord_platform_order {
  id varchar [pk, note: 'ULID']
  member_id varchar [not null, ref: > member.id, note: '주문자']
  status varchar [not null, note: 'TEMP / SPLIT_TO_ORDERS']
  total_amount int [not null, note: '결제 요청 총액']
  point_used int [default: 0, note: '포인트 사용액']
  coupon_discount int [default: 0, note: '쿠폰 할인액']
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
  vendor_id varchar [not null, note: '입점사 ID']
  status varchar [not null, note: 'PROCESSING/PAYMENT_COMPLETED/PREPARING/IN_DELIVERY/DELIVERED/CONFIRMED/CANCELLED']
  total_amount int [not null, note: '해당 입점사 상품 합계']
  shipping_fee int [default: 0]
  cancel_reason varchar [note: '취소 사유 (CANCELLED 시)']
  confirmed_at timestamp [note: '구매확정 일시']
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
  id varchar [pk]
  order_id varchar [not null, ref: > ord_order.id]
  product_id varchar [not null, note: 'Catalog 상품 ID']
  sku_id varchar [not null, note: 'SKU (옵션 조합)']
  product_name varchar [not null, note: '주문 시점 스냅샷']
  option_name varchar [note: '옵션명 스냅샷']
  quantity int [not null]
  unit_price int [not null, note: '주문 시점 단가']
  actual_paid_amount int [not null, note: '할인·쿠폰·포인트 안분 후 실결제금액 (부분반품 환불 기준)']
  created_at timestamp [not null]

  indexes {
    order_id [name: 'idx_oitem_order']
  }

  note: '주문상품 라인. 결제 시점 스냅샷 저장 (가격 변동 무관)'
}

Table ord_cart {
  id varchar [pk]
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

  note: '장바구니. 동일 상품+옵션은 수량 합산 (unique 제약)'
}

Table ord_shipping {
  id varchar [pk]
  order_id varchar [not null, ref: > ord_order.id]
  recipient_name varchar [not null]
  phone varchar [not null, note: '마스킹: 010-****-5678']
  address varchar [not null]
  address_detail varchar
  zip_code varchar [not null]
  carrier varchar [note: '택배사 코드']
  tracking_number varchar [note: '운송장번호']
  shipped_at timestamp [note: '출고 일시']
  delivered_at timestamp [note: '배송완료 일시']
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_shipping_order']
  }

  note: '배송정보. PREPARING에서 운송장 등록 → IN_DELIVERY 전환'
}

Table ord_claim {
  id varchar [pk]
  order_id varchar [not null, ref: > ord_order.id]
  claim_type varchar [not null, note: 'CANCEL / RETURN / EXCHANGE']
  status varchar [not null, note: 'RECEIVED/IN_PROGRESS/COMPLETED/REJECTED']
  reason varchar [not null]
  evidence_url varchar [note: '증빙 이미지 URL']
  responsibility varchar [note: 'CUSTOMER/VENDOR/PLATFORM']
  extra_shipping_fee int [default: 0, note: '추가배송비 (고객 귀책 시)']
  objection_reason varchar [note: '판매자 이의제기 사유 (1회 제한)']
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_claim_order']
    (claim_type, status) [name: 'idx_claim_type_status']
  }

  note: '클레임. ord_order 상태와 독립적으로 진행 (CONFIRMED 후에도 클레임 가능)'
}

Table ord_order_history {
  id varchar [pk]
  order_id varchar [not null, ref: > ord_order.id]
  from_status varchar [not null]
  to_status varchar [not null]
  changed_by varchar [not null, note: '변경 주체 (member_id / admin_id / SYSTEM)']
  reason varchar
  created_at timestamp [not null]

  indexes {
    order_id [name: 'idx_history_order']
  }

  note: '주문 상태 변경 이력. 감사(audit) 목적'
}
```

## Payment 도메인

```dbml
Table pay_payment {
  id varchar [pk, note: 'ULID']
  order_id varchar [not null, ref: > ord_order.id]
  platform_order_id varchar [not null, note: '역추적용']
  pg_provider varchar [not null, default: 'TOSS', note: 'CONS-004: 토스페이먼츠 단일']
  pg_token varchar [note: 'PG 발급 토큰 (카드번호 원본 저장 금지, REQ-PAY-007)']
  payment_method varchar [not null, note: 'CARD / POINT_CARD (복합결제)']
  amount int [not null, note: 'PG 승인 요청 금액']
  point_amount int [default: 0, note: '포인트 차감 금액']
  status varchar [not null, note: 'PENDING/PAID/CANCELLED/REFUNDED/PARTIAL_REFUNDED']
  approved_at timestamp
  cancelled_at timestamp
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_payment_order']
    (status, created_at) [name: 'idx_payment_status_date']
  }

  note: '결제 트랜잭션. 1 order : 1 payment (부분결제 미지원)'
}

Table pay_payment_log {
  id varchar [pk]
  payment_id varchar [not null, ref: > pay_payment.id]
  event_type varchar [not null, note: 'REQUEST/APPROVE/FAIL/RETRY/CANCEL/REFUND']
  pg_transaction_id varchar [note: 'PG측 거래번호 (멱등 판별, REQ-PAY-035)']
  raw_response text [note: 'PG 원본 응답(디버깅용), PII 마스킹 처리']
  retry_count int [default: 0, note: '비동기 재시도 횟수 (최대 3, REQ-PAY-004)']
  created_at timestamp [not null]

  indexes {
    payment_id [name: 'idx_plog_payment']
    pg_transaction_id [name: 'idx_plog_pg_tx']
  }

  note: '결제 이벤트 로그. 재시도 이력 추적'
}

Table pay_card_restriction {
  id varchar [pk]
  card_hash varchar [not null, note: '카드 식별 해시 (원본 미저장)']
  restricted_date date [not null, note: '제한 적용일']
  fail_count int [not null, default: 3]
  released_at timestamp [note: '자동 해제 시각 (익일 00:00)']
  created_at timestamp [not null]

  indexes {
    (card_hash, restricted_date) [unique, name: 'uq_card_date']
  }

  note: '이상거래 방지: 동일 카드 3회 연속 실패 시 당일 제한 (REQ-PAY-031~033)'
}
```

---

## 불변식 (Invariants)

| 불변식 | 검증 시점 | 근거 |
|---|---|---|
| `pay_payment.amount == ord_order.total_amount - point_used - coupon_discount` | 결제 요청 시 | REQ-PAY-006 (불일치 시 즉시 취소) |
| `ord_order_item.SUM(actual_paid_amount) == ord_order.total_amount` | 주문 생성 시 | 부분반품 환불 기준 정합성 |
| `ord_cart` 동일 member+sku는 unique | 담기 시 | REQ-ORD-100 (수량 합산, 중복 라인 방지) |
| `ord_claim.objection_reason` NULL→값 전이는 1회만 | 이의제기 시 | REQ-ORD-038 |

## soft delete 정책

| 테이블 | 정책 | 사유 |
|---|---|---|
| ord_cart | `is_deleted = true` | 장바구니 삭제는 논리 삭제 (30일 보관 후 배치 물리 삭제) |
| ord_platform_order, ord_order | `is_deleted = true` | 주문 데이터 영구 보존 (법적 보관 의무) |
| pay_payment, pay_payment_log | 물리 삭제 없음 | 결제 데이터 영구 보존 |

## 감사 컬럼

모든 테이블에 `created_at`, `updated_at` 포함. 상태 변경 이력은 `ord_order_history` 테이블로
별도 관리 (변경 주체·사유·시각 기록).

---

## Human Review 필요 항목

| # | 항목 | 사유 |
|---|---|---|
| 1 | pay_payment_log의 raw_response PII 마스킹 규칙 | 구체적 마스킹 로직 미정 |
| 2 | ord_platform_order → ord_order 분할 시점 | "결제완료 즉시 분할" vs "비동기 분할" 미확정 (상태머신 ① 참고) |

---
근거: `01-Spec/04-기능요구사항(EARS)/01-Order-*.md`, `04-Payment.md`(EARS 전체), 용어집(2계층
주문구조), 제약사항(CONS-004/005/012/027). 이 샘플에서 신규 구조화 — 실제 정책서·ERD 대조 필요.
