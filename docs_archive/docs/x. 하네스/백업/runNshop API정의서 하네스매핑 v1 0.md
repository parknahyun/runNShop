# runNshop API 정의서 템플릿 (Harness Engineering 기반)

- **문서버전**: v1.0
- **작성자**: 페페
- **작성일**: 2026-07-03
- **목적**: AI(Kiro) 코딩을 위한 API 정의서 표준 양식 및 6개 Harness 매핑 기준 정의
- **적용범위**: 12개 비즈니스 도메인 (Vendor / Catalog / Member / Order / Payment / Promotion / Settlement / Notification / Community / Search / Config / Audit)

---

## 0. 개요: 하네스와 문서 섹션의 관계

본 문서의 10개 섹션은 **6개 Harness(AI가 참조하는 논리적 제약 단위)** 를 문서 작성 편의를 위해 펼쳐놓은 체크리스트입니다.

| 섹션 | 소속 Harness | 비고 |
|---|---|---|
| 1. Context | **Context Harness** | 원본 하네스 |
| 2. Endpoint | Context Harness 하위 | 독립 하네스 아님 |
| 3~4. Request / Response | **Requirements Validation Harness** | 원본 하네스 |
| 5. Domain Constraint | **Domain Constraint Harness** | 원본 하네스 |
| 6. Data Contract | **Data Contract Harness** | ★ 신규 추가 |
| 7. Sequence | Context Harness 확장 | Context의 시간축 확장판 |
| 8. Output Schema | **Output Schema Harness** | 원본 하네스 |
| 9. Feedback Loop | **Feedback Loop Harness** | 원본 하네스 |
| 10. 비기능 요구사항 | Domain Constraint Harness 하위 | HARD Constraint의 일종 |

```
6개 Harness (실질 단위)
├── Context Harness ─────────────── (Endpoint, Sequence 포함)
├── Requirements Validation Harness ── (Request/Response)
├── Domain Constraint Harness ──────── (HARD/SOFT, 비기능요구사항 포함)
├── Data Contract Harness ──────────── (신규)
├── Output Schema Harness
└── Feedback Loop Harness
```

> 실패 원인 역추적 시에는 10개 섹션이 아닌 **6개 Harness 단위**로 분류하여 확인한다. (섹션 단위는 너무 세분화되어 원인 분류가 어려움)

---

## 1. 문서 헤더 (필수 메타정보)

```yaml
api_id: ORD-001
api_name: 주문 생성
version: v1.0
domain: Order              # 12개 도메인 중 택1
type: C                    # A(표준/운영) / B(협상·클레임·프로모션) / C(개발주도) / D(사업주도)
author: 페페
last_updated: 2026-07-03
kiro_target: true          # AI 코딩 대상 여부
```

---

## 2. Context Harness

- **소속 도메인**:
- **Bounded Context 범위**: (이 API가 커버하는 시작~끝 지점)
- **호출 주체 도메인**:
- **의존 도메인**:
- **발행 이벤트**:
- **시퀀스 참조 ID**: (예: SEQ-ORDER-001, 전체 플로우 중 몇 번째 Step인지)

### 2-1. Endpoint 명세

```yaml
method:
path:
auth:                      # 예: JWT required
role:                      # 예: [MEMBER, ADMIN]
rate_limit:
```

### 2-2. Sequence 연동 (트랜잭션/이벤트 경계)

```yaml
transaction_scope:         # 이 API가 커버하는 트랜잭션 범위
event_publish_timing:      # 커밋 전 / 커밋 후 (Outbox 여부)
async_or_sync:
downstream_trigger:        # 이후 어느 도메인이 이어받는지
```

> 시퀀스 다이어그램(Mermaid) 원본은 `runNshop_event_flow_v1_0.md`에 두고, 여기서는 참조 ID만 연결한다.
> 다이어그램에는 반드시 ① 트랜잭션 경계 ② 이벤트 발행 시점 ③ HARD Constraint 발동 지점 ④ 동기/비동기 구분이 표시되어야 한다.

---

## 3. Requirements Validation Harness — Request

| 필드 | 타입 | 필수 | 제약조건 | 비고 |
|---|---|---|---|---|
| | | | | |

**교차 필드 검증 (Cross-field Validation)**
```yaml
- rule:
```

---

## 4. Requirements Validation Harness — Response

```yaml
success:
  status:
  body:

error_catalog:
  - code:
    http:
    condition:
    message_key:          # 다국어 키 (하드코딩 금지)
```

---

## 5. Domain Constraint Harness

```yaml
HARD:
  - id: HC-XXX-001
    rule:
    reason:
    wrong_pattern:          # Kiro가 흔히 저지르는 잘못된 구현 예시

SOFT:
  - id: SC-XXX-001
    rule:
    reason:
```

---

## 6. Data Contract Harness ★신규

```yaml
persistence:
  soft_delete:              # true/false
  immutable_fields:         # 생성 후 수정 금지 컬럼
  status_transition:        # 상태 전이 허용 규칙 (Map 형태)
  audit_fields:             # Audit 도메인 연동 자동기록 컬럼

query_condition:
  default_scope:            # 기본 조회 필터 (예: deleted_at IS NULL)
  specific:
    - name:
      condition:
      reason:

index_hint:
  - columns: []
    reason:
```

---

## 7. Output Schema Harness

```yaml
layer:                      # Controller / Application / Domain / Infrastructure
pattern:                    # Command / Query (CQRS 구분)
expected_classes:
  -
transaction_annotation:     # @Transactional 위치
event_publishing:
  timing:
  method:                   # Spring ApplicationEvent (Outbox Pattern v1)
```

---

## 8. Feedback Loop Harness

```yaml
test_scenarios:
  - name:
    given:
    when:
    then: []

quality_gate:
  p95_latency:
  error_rate:
  test_coverage:
```

---

## 9. 비기능 요구사항 (Domain Constraint Harness 하위)

```yaml
idempotency:                # 중복 요청 방지 방식
concurrency:                # 동시성 제어 방식 (낙관적/비관적 락 등)
i18n:                       # 다국어 메시지 키 사용 원칙
logging:                    # PII 마스킹 대상 필드
```

---

## 10. 작성 체크리스트

API 정의서 작성 완료 전 아래 항목을 모두 확인한다.

- [ ] Context Harness: 도메인 경계와 의존 도메인이 명확한가
- [ ] Sequence: 트랜잭션 경계와 이벤트 발행 시점이 다이어그램에 표시되어 있는가
- [ ] Requirements: 교차 필드 검증까지 포함했는가
- [ ] Domain Constraint: HARD/SOFT를 분리했고, 각각 reason이 있는가
- [ ] Data Contract: soft_delete, 상태전이, 기본조회조건을 명시했는가
- [ ] Output Schema: 생성될 클래스명과 트랜잭션 위치를 지정했는가
- [ ] Feedback Loop: 실패 시나리오(에러케이스)까지 테스트 시나리오에 포함했는가
- [ ] 비기능: PII 로깅 마스킹 대상이 명시되어 있는가

---

## 부록: 예시 (Order 도메인 — 주문 생성 API)

```yaml
api_id: ORD-001
api_name: 주문 생성
domain: Order
type: C

context:
  bounded_context: "주문 생성 ~ 결제 요청 직전"
  caller_domains: [Frontend, Member]
  dependency_domains: [Catalog, Member]
  event_trigger: ORDER_CREATED
  sequence_ref: SEQ-ORDER-001

endpoint:
  method: POST
  path: /api/v1/orders
  auth: JWT required
  role: [MEMBER]

request:
  vendorId: {type: Long, required: true, constraint: "vendors 존재 + status=ACTIVE"}
  items: {type: Array, required: true, min_size: 1, max_size: 50}
  deliveryAddressId: {type: Long, required: true, constraint: "로그인 회원 소유 주소만"}

response:
  success: {status: 201, body: {orderId: Long, orderNo: String, status: "TEMP", totalAmount: Long}}
  errors:
    - {code: ORDER_001, http: 400, condition: "items 빈 배열"}
    - {code: ORDER_002, http: 409, condition: "재고 부족"}
    - {code: ORDER_003, http: 403, condition: "타인 주소 접근"}

constraint:
  HARD:
    - {id: HC-ORD-001, rule: "주문 생성 트랜잭션 내 재고 차감 금지", reason: "재고는 PG 결제 요청 시점에 예약"}
    - {id: HC-ORD-002, rule: "orderNo는 Order 도메인만 생성 가능"}

data_contract:
  soft_delete: true
  immutable_fields: [orderNo, createdAt]
  status_transition: {TEMP: [PAID, CANCELLED_TIMEOUT]}
  default_scope: "deleted_at IS NULL"

output_schema:
  layer: Application
  pattern: Command
  expected_classes: [CreateOrderCommand, CreateOrderCommandHandler, OrderRepository, OrderJpaRepositoryImpl]

feedback_loop:
  test_scenarios:
    - {name: "정상 생성", then: ["status=TEMP", "재고차감 없음"]}
    - {name: "재고부족", then: ["409", "ORDER_002"]}
  quality_gate: {p95_latency: 200ms, test_coverage: 90%}
```

---

*본 문서는 runNshop v1.0 산출물 13번째 파일(`runNshop_API정의서_하네스매핑_v1_0.md`)로, Bounded Context 확정 후 12개 도메인 API 정의서 작성 시 표준 템플릿으로 사용한다.*
