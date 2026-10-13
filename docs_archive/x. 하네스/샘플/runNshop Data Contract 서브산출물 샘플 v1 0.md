# runNshop Data Contract 서브산출물 샘플

- **문서버전**: v1.0
- **작성일**: 2026-07-03
- **목적**: ⑧ API정의서 서브산출물 Data Contract 표준양식 작성 예시 (Order 도메인 주문 생성)

---

## 문서 헤더

```yaml
data_contract_id: DC-ORD-001
api_id: ORD-001
api_name: 주문 생성
domain: Order
erd_참조:
  - ord_order          # 주문 헤더
  - ord_order_item     # 주문 상품
  - ord_platform_order # 플랫폼 주문 묶음
  - ord_outbox         # Outbox 이벤트
작성일: 2026-07-03
```

---

## [AI-H24] Data Contract (API별)               ← Data Contract Harness

### 도메인 레벨 규칙 참조 (⑥ ERD 원천)

```yaml
invariants_ref: AI-H15
# 적용 불변식:
#   - "quantity >= 1 (0이면 soft_delete 처리)"
#   - "member_id + 주문번호 UNIQUE (중복 주문 금지)"
#   - "is_deleted=TRUE인 행은 조회 기본 제외"

state_transition_ref: AI-H16
# 이 API가 설정하는 초기 상태: TEMP
# TEMP → 다음 전이: [PAID, CANCELLED_TIMEOUT]

soft_delete_ref: AI-H17
# soft_delete: true
# immutable_fields: [order_no, created_at, member_id]
```

---

### API 레벨 영속성 계약 (직접 작성)

#### 대상 테이블

```yaml
persistence:
  target_tables:
    - ord_platform_order   # INSERT (플랫폼 주문 묶음)
    - ord_order            # INSERT (입점사별 주문)
    - ord_order_item       # INSERT (주문 상품 라인)
    - ord_outbox           # INSERT (ORDER_CREATED 이벤트)
```

#### read_fields (이 API가 조회하는 필드)

| 필드 | 테이블 | 조건 | 비고 |
|------|--------|------|------|
| sku_id, stock_qty | cat_sku_stock_replica | WHERE sku_id IN (:skuIds) AND is_deleted = FALSE | CatalogPublicApi 내부 조회 (복제 테이블 READ ONLY) |
| member_id, grade, point_balance | mbr_member_replica | WHERE member_id = :memberId AND is_deleted = FALSE | 포인트 잔액 확인 |
| coupon_id, discount_type, discount_value, min_order_amount, expired_at | prm_coupon | WHERE coupon_id = :couponId AND used = FALSE AND expired_at > NOW() | PromotionPublicApi 내부 조회 |

#### write_fields (이 API가 기록하는 필드)

| 필드 | 테이블 | 액션 | 비고 |
|------|--------|------|------|
| platform_order_id (PK), member_id, total_amount, shipping_fee, discount_amount, final_amount, created_at | ord_platform_order | INSERT | 플랫폼 주문 묶음 생성 |
| order_id (PK), platform_order_id (FK), vendor_id, order_status, subtotal, created_at | ord_order | INSERT | 입점사별 주문 (1건 이상) |
| order_item_id (PK), order_id (FK), sku_id, product_name, option_name, quantity, unit_price, total_price | ord_order_item | INSERT | 주문 상품 라인 (N건) |
| outbox_id (PK), event_type, payload (JSON), created_at, published = FALSE | ord_outbox | INSERT | ORDER_CREATED 이벤트 |

#### 쿼리 제약

```yaml
  default_query_scope:
    read: "is_deleted = FALSE"          # 복제 테이블 조회 시 필수
    write: "해당 없음 (INSERT only)"

  index_hint:
    - idx_ord_order_platform_order_id:
        reason: "입점사별 주문 목록 조회 시 platform_order_id 기준 필터"
    - idx_ord_order_item_order_id:
        reason: "주문 상품 라인 조회 시 order_id 기준 필터"
    - idx_ord_outbox_published:
        reason: "Outbox Publisher가 미발행 이벤트를 polling할 때 사용"

  transaction_annotation: "@Transactional(readOnly = false)"
  isolation_level: READ_COMMITTED       # 기본; 재고 예약은 CatalogPublicApi가 별도 처리
```

---

### wrong_patterns (이 API 특유의 실수 패턴)

```yaml
wrong_patterns:
  - pattern: "ord_order_item INSERT 누락"
    description: "ord_order만 생성하고 ord_order_item 생성을 빠뜨리는 경우"
    result: "주문 상품 없이 빈 주문이 생성됨"

  - pattern: "ord_outbox INSERT를 @Transactional 외부에서 실행"
    description: "주문 INSERT 후 트랜잭션 커밋, 이후 별도로 outbox INSERT"
    result: "주문 성공 + outbox 실패 시 이벤트 영구 누락 → Payment 미처리"

  - pattern: "cat_sku_stock 직접 UPDATE (재고 직접 차감)"
    description: "CatalogPublicApi를 거치지 않고 복제 테이블에 직접 쓰기"
    result: "도메인 경계 위반 + 복제 테이블 데이터 오염"

  - pattern: "immutable_fields(order_no) 후속 UPDATE 허용"
    description: "주문번호를 생성 후 재할당하는 UPDATE 쿼리 생성"
    result: "정합성 파괴, 감사 추적 불가"

  - pattern: "is_deleted 필터 없이 복제 테이블 조회"
    description: "WHERE 조건에 is_deleted = FALSE 누락"
    result: "탈퇴 회원·삭제 상품의 데이터가 주문에 포함"

  - pattern: "ord_platform_order 없이 ord_order 생성"
    description: "플랫폼 주문 묶음 없이 입점사 주문만 INSERT"
    result: "FK 위반 또는 플랫폼 레벨 주문 집계 불가"
```

---

## 작성 기준 메모

- `read_fields`: 실제 SQL의 SELECT 절·FROM 절·WHERE 절을 근거로 작성 → MyBatis Mapper XML 생성의 직접 입력
- `write_fields`: INSERT INTO ... VALUES 에 들어갈 컬럼 목록 → DTO-Entity 매핑 자동 생성 근거
- `ord_outbox`는 주문 생성 트랜잭션과 **반드시 같은 트랜잭션**에 포함 (Outbox Pattern 원칙)
- `isolation_level`: 재고 예약 동시성은 CatalogPublicApi 내부(낙관적 잠금)가 처리하므로 Order 측은 READ_COMMITTED로 충분
- 복제 테이블(cat_sku_stock_replica, mbr_member_replica)은 **READ ONLY** — write_fields에 절대 포함 금지
