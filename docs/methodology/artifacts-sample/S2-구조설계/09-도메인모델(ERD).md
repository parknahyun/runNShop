# 샘플: 도메인 모델 (ERD)

> **단계**: 구조설계
> **문서범위**: Domain
> **문서종류**: Design
>
> **작성 목적**: EARS(⑧)에서 도출된 엔티티·속성·관계를 테이블 설계로 구체화한다.
> "이 도메인이 어떤 데이터를 어떤 구조로 소유하는가"를 확정하여, 상태머신(⑩)·클래스 설계(⑲)의 직접 입력이 된다.
>
> **흐름 내 위치**:
> ```
> ⑧ EARS(기능요구) → ⑨ 도메인 모델(ERD) → ⑩ 상태머신 → ⑪ 비즈니스 프로세스
> ```
>
> **작성 주체**: 시니어 개발자 + AI 협업 (DBA/아키텍트 검토)

---

## 도출 방법

| 입력 | 어떻게 ERD로 변환하는가 |
|---|---|
| EARS의 주어/목적어 | → 엔티티 후보 (명사 추출) |
| EARS의 동사 | → 관계·이벤트 (생성/변경/조회) |
| EARS의 상태 전환 (Event/State) | → status 컬럼 후보 |
| 도메인정의서(⑤) 소유 데이터 | → 테이블 목록 검증 |
| 정책서 수치·제약 | → 컬럼 제약조건 (NOT NULL, 길이, default) |

---

## 작성 규칙

| 규칙 | 설명 |
|---|---|
| **DBML 형식** | 관계·인덱스·노트를 코드로 표현, 도구 호환성 확보 |
| **테이블 접두사** | 도메인정의서 §3 접두사 규칙 준수 (`ord_`, `pay_`, `cat_`...) |
| **PK는 ULID** | 정렬 가능 + 분산 환경 충돌 방지 |
| **감사 컬럼 필수** | 모든 테이블에 `created_at`, `updated_at` |
| **status 컬럼** | 상태머신(⑩)의 입력이 됨 — 허용 값 목록을 note에 명시 |
| **스냅샷 원칙** | 주문 시점의 가격·상품명은 스냅샷으로 저장 (원본 변경과 무관) |
| **soft delete** | 법적 보관 의무 테이블은 `is_deleted` 논리 삭제 |
| **FK는 논리적** | 모듈러 모놀리스에서 물리 FK 없이 컬럼명으로 관계 표현 (MSA 전환 대비) |

---

## 샘플: Order 도메인

### 2계층 주문 구조

```
ord_platform_order (고객 주문 단위, 1:N)
  └── ord_order (입점사별 처리 단위)
        ├── ord_order_item (주문상품 라인)
        ├── ord_shipping (배송정보)
        ├── ord_claim (클레임)
        └── ord_order_history (상태변경 이력)

ord_cart (장바구니, 독립)
```

### DBML

```dbml
Table ord_platform_order {
  id varchar [pk, note: 'ULID']
  member_id varchar [not null, note: '주문자']
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
  vendor_id varchar [not null, note: '입점사 ID']
  status varchar [not null, note: 'PROCESSING/PAYMENT_COMPLETED/PREPARING/IN_DELIVERY/DELIVERED/CONFIRMED/CANCELLED']
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
  id varchar [pk]
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

  note: '장바구니. 동일 상품+옵션은 수량 합산'
}

Table ord_shipping {
  id varchar [pk]
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
  id varchar [pk]
  order_id varchar [not null, ref: > ord_order.id]
  claim_type varchar [not null, note: 'CANCEL / RETURN / EXCHANGE']
  status varchar [not null, note: 'RECEIVED/IN_PROGRESS/COMPLETED/REJECTED']
  reason varchar [not null]
  responsibility varchar [note: 'CUSTOMER/VENDOR/PLATFORM']
  extra_shipping_fee int [default: 0]
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_claim_order']
    (claim_type, status) [name: 'idx_claim_type_status']
  }
}

Table ord_order_history {
  id varchar [pk]
  order_id varchar [not null, ref: > ord_order.id]
  from_status varchar [not null]
  to_status varchar [not null]
  changed_by varchar [not null, note: 'member_id / admin_id / SYSTEM']
  reason varchar
  created_at timestamp [not null]

  indexes {
    order_id [name: 'idx_history_order']
  }
}
```

---

## 샘플: Payment 도메인

```dbml
Table pay_payment {
  id varchar [pk, note: 'ULID']
  order_id varchar [not null, note: 'ord_order.id 참조']
  platform_order_id varchar [not null, note: '역추적용']
  pg_provider varchar [not null, default: 'TOSS']
  pg_token varchar [note: 'PG 발급 토큰 (카드번호 원본 저장 금지)']
  payment_method varchar [not null, note: 'CARD / POINT_CARD']
  amount int [not null, note: 'PG 승인 요청 금액']
  point_amount int [default: 0]
  status varchar [not null, note: 'PENDING/PAID/CANCELLED/REFUNDED/PARTIAL_REFUNDED']
  approved_at timestamp
  cancelled_at timestamp
  created_at timestamp [not null]
  updated_at timestamp [not null]

  indexes {
    order_id [name: 'idx_payment_order']
    (status, created_at) [name: 'idx_payment_status_date']
  }

  note: '결제 트랜잭션. 1 order : 1 payment'
}

Table pay_payment_log {
  id varchar [pk]
  payment_id varchar [not null, ref: > pay_payment.id]
  event_type varchar [not null, note: 'REQUEST/APPROVE/FAIL/RETRY/CANCEL/REFUND']
  pg_transaction_id varchar [note: 'PG측 거래번호 (멱등 판별)']
  raw_response text [note: 'PG 원본 응답 (PII 마스킹)']
  retry_count int [default: 0, note: '최대 3회']
  created_at timestamp [not null]

  indexes {
    payment_id [name: 'idx_plog_payment']
    pg_transaction_id [name: 'idx_plog_pg_tx']
  }
}

Table pay_card_restriction {
  id varchar [pk]
  card_hash varchar [not null, note: '카드 식별 해시 (원본 미저장)']
  restricted_date date [not null]
  fail_count int [not null, default: 3]
  released_at timestamp [note: '익일 00:00 자동 해제']
  created_at timestamp [not null]

  indexes {
    (card_hash, restricted_date) [unique, name: 'uq_card_date']
  }

  note: '동일 카드 3회 연속 실패 시 당일 제한'
}
```

---

## 불변식 (Invariants)

| 불변식 | 검증 시점 | 도출 근거 |
|---|---|---|
| `pay_payment.amount == ord_order.total_amount - point_used - coupon_discount` | 결제 요청 시 | EARS: 금액 불일치 시 즉시 취소 |
| `SUM(ord_order_item.actual_paid_amount) == ord_order.total_amount` | 주문 생성 시 | 부분반품 환불 기준 정합성 |
| `ord_cart` 동일 member+sku는 unique | 담기 시 | EARS: 수량 합산, 중복 라인 방지 |
| `ord_claim.objection_reason` NULL→값 전이는 1회만 | 이의제기 시 | 정책서: 이의제기 1회 제한 |

---

## Soft Delete 정책

| 테이블 | 정책 | 사유 |
|---|---|---|
| ord_cart | `is_deleted = true` | 30일 보관 후 배치 물리 삭제 |
| ord_platform_order, ord_order | `is_deleted = true` | 법적 보관 의무 (영구) |
| pay_payment, pay_payment_log | 물리 삭제 없음 | 결제 데이터 영구 보존 |

---

## 작성 팁

| 팁 | 설명 |
|---|---|
| **status 컬럼 = 상태머신(⑩)의 입력** | 허용 값 목록을 note에 전부 나열해야 상태머신 작성이 빠름 |
| **스냅샷 vs 참조** | 주문 시점에 확정되는 값(가격·상품명)은 스냅샷, 최신 값이 필요한 것(회원등급)은 참조 |
| **인덱스는 조회 패턴에서** | 상위UC·EARS에서 "조회 조건"이 나오면 그게 인덱스 후보 |
| **도메인 간 FK는 논리적** | 물리 FK 없이 컬럼명으로 관계 표현 — 스키마 분리(MSA 전환) 대비 |
| **1 도메인 = 1 파일** | Payment 테이블이 Order 파일에 있으면 안 됨. 각자 도메인 파일로 분리 |
| **불변식 반드시 명시** | 코드에서 검증해야 할 규칙을 문서화해야 구현 시 누락 방지 |

---

## 근거

| 항목 | 출처 |
|---|---|
| 엔티티 도출 | EARS(⑧) 주어/목적어 명사 추출 |
| 테이블 접두사 | 도메인정의서(⑤) §3 소유 데이터 |
| 제약조건 수치 | 정책서 (장바구니 50개, 카드 3회 제한 등) |
| 2계층 주문구조 | 도메인정의서 §4 Order-Vendor 관계 + 정산 단위 요구 |
