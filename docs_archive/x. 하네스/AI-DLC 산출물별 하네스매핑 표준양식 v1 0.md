# AI-DLC 산출물별 Harness 매핑 표준양식

- **문서버전**: v1.0
- **작성자**: 페페
- **작성일**: 2026-07-03
- **목적**: SI 방법론 8단계 산출물 각각에 AI 코딩을 위한 Harness 보강 항목을 정의
- **적용범위**: 12개 비즈니스 도메인

---

## 0. 전체 구조

### SI 방법론 8단계와 Harness 보강 배치

```
단계        산출물              AI 보강 항목                        매핑 Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
① 요구사항정의  요구사항 정의서    HARD Constraint, 검증시나리오       Domain Constraint, Feedback Loop
② 정책서       비즈니스 정책서    정책 코드화, 변경영향 범위          Domain Constraint (원천)
③ 도메인정의   BC·모듈 설계서    도메인 경계, 통신 규칙, 의존 방향    Context Harness (원천)
④ 업무흐름     프로세스 정의서    트랜잭션 경계, 이벤트 발행점        Context Harness (시간축)
⑤ 화면정의     화면 정의서        컴포넌트-API 매핑, 상태관리         Requirements Validation
⑥ ERD         엔티티 정의서      불변식, 상태전이 머신               Data Contract Harness
⑦ 기술정의     기술스택 정의서    코드 생성 규칙, 레이어 제약         Output Schema Harness (원천)
⑧ API정의서   API 정의서         6개 Harness 전체 종합·참조          전체 (종합)
              ├─ Sequence        API별 호출 순서·트랜잭션 경계        Context Harness (시간축)
              └─ Data Contract   API별 영속성 계약·쿼리 조건          Data Contract Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Harness 정보의 누적 흐름

```
①요구사항 → ②정책서 → ③도메인정의 → ④업무흐름 → ⑤화면정의 → ⑥ERD → ⑦기술정의 → ⑧API정의서
   │           │           │              │             │          │          │           │
   │           │           │              │             │          │          │           ▼
   │           │           │              │             │          │          │    [6개 Harness 종합]
   │           │           │              │             │          │          │      ├─ Sequence
   │           │           │              │             │          │          │      └─ Data Contract
   │           │           │              │             │          │          └── Output Schema 원천
   │           │           │              │             │          └── Data Contract
   │           │           │              │             └── Req Validation (UI 입출력)
   │           │           │              └── Context (시간축: 트랜잭션·이벤트)
   │           │           └── Context 원천 (공간축: 도메인 경계·의존·통신)
   │           └── Domain Constraint 원천 (HARD/SOFT 정책 근거)
   └── Domain Constraint + Feedback Loop (규칙·검증)
```

> **원칙**: 각 단계에서 해당 Harness 정보를 **원천 작성**하고,
> API 정의서는 이를 **종합·참조**한다. 중복 작성하지 않는다.
> Sequence·Data Contract는 앞 단계의 큰 그림을 참고 입력으로 받되, API 단위로 직접 작성한다.

---

## 1. ① 요구사항 정의서 — 표준양식

### 기본 섹션 (일반 방법론)

```
요구사항 ID    : FR-{도메인}-{SEQ}
요구사항명     : 
분류           : 기능(FR) / 비기능(NFR) / 제약(CR)
우선순위       : P1(Must) / P2(Should) / P3(Nice)
도메인         : 
상태           : DRAFT / REVIEW / CONFIRMED / CHANGED
변경 이력      : 
요청 부서      : 
관련 화면      : 
관련 업무흐름   : 

[설명]
(비즈니스 배경 포함 상세 설명)

[상세 규칙]
• 규칙 1
• 규칙 2

[수용 기준 - Acceptance Criteria]
AC-1: 
AC-2: 
AC-3: 

[비기능 요구사항] (해당 시)
• 성능: 
• 보안: 
• 데이터: 
```

### AI 보강 섹션

```
[AI-H1] HARD Constraint                    ← Domain Constraint Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| ID | 규칙 | 이유 | wrong_pattern |
|----|------|------|---------------|
| HC-{DOM}-{SEQ} | | | AI가 흔히 잘못하는 패턴 |

[AI-H2] 검증 시나리오 (Given-When-Then)     ← Feedback Loop Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| # | 시나리오 | Given | When | Then |
|---|---------|-------|------|------|
| 1 | 정상 케이스 | | | |
| 2 | 실패 케이스 | | | |
| 3 | 엣지 케이스 | | | |

※ SOFT Constraint 안내:
  SOFT 규칙(권고·정책)은 ② 정책서의 [AI-H3]에서 rule_expression으로 작성한다.
  여기서는 HARD(위반 시 시스템 오류)만 정의하고, SOFT는 "POL-{DOM}-{SEQ} 참조"로 표기한다.
```

### 작성 기준
- AC 중 **위반 시 시스템 오류**가 되는 것 → HARD로 승격
- `wrong_pattern`은 AI(LLM) 학습 편향으로 흔히 저지르는 구현 실수
- 검증 시나리오는 AC보다 구체적·실행 가능하게 (테스트 코드 생성 기준)
- 단순 CRUD면 AI 보강 불필요

---

## 2. ② 정책서 — 표준양식

### 기본 섹션 (일반 방법론)

```
정책 ID        : POL-{도메인}-{SEQ}
정책명          : 
적용 도메인     : 
적용 대상       : 고객 / 입점사 / 플랫폼 / 전체
우선순위        : 
상태            : DRAFT / CONFIRMED / CHANGED
변경 이력       : 

[정책 내용]
(상세 비즈니스 규칙)

[적용 조건]
• 조건 1
• 조건 2

[예외 처리]
• 예외 1 → 처리 방안
```

### AI 보강 섹션

```
[AI-H3] 정책 코드화 (실행 가능한 규칙)      ← Domain Constraint Harness (원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
constraint_type: HARD / SOFT
rule_expression: |
  (의사코드 또는 조건식으로 표현)
  예: IF order.total < 50000 THEN shipping_fee = 3000
      IF vendor.grade == "Elite" THEN commission_rate -= 1.5%

applies_to:
  - req_id: FR-{DOM}-{SEQ}      # 이 정책이 적용되는 요구사항
  - req_id: FR-{DOM}-{SEQ}

wrong_pattern: |
  AI가 이 정책을 잘못 해석하는 패턴
  예: 수수료 감면을 절대값으로 적용 (퍼센트 포인트가 아닌 퍼센트로 계산)

[AI-H4] 변경 영향 범위                      ← Context Harness (전파 추적)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
affected_domains: [Order, Payment, Settlement]
affected_apis: [ORD-001, PAY-003]
affected_batches: [SettlementCalculateBatch]
change_frequency: 높음 / 보통 / 낮음

※ change_frequency가 "높음"이면:
  → 정책값을 하드코딩 금지, Config 테이블 또는 상수 분리 필수
```

### 작성 기준
- 정책서는 **Domain Constraint의 원천** → 요구사항의 HARD/SOFT 근거가 됨
- `rule_expression`: 자연어 정책을 AI가 코드로 옮길 수 있는 수준으로 표현
- `affected_domains`: 정책 변경 시 어디를 수정해야 하는지 (AI 재구현 범위)
- 변경 빈번 정책은 반드시 **Config 분리** 지시 포함

---

## 3. ③ 도메인 정의서 (BC·모듈 설계) — 표준양식

### 기본 섹션 (일반 방법론)

```
도메인 ID       : DOM-{도메인명}          (예: DOM-ORDER)
도메인명        : Order
핵심 책임       : 주문 생명주기 오케스트레이션
레이어          : 거래 / 상품 / 고객 / 혜택 / 파트너 / 운영
상태            : CONFIRMED

[도메인 범위 (Bounded Context)]
• 시작: 주문서 진입
• 종료: 구매확정
• 소유 엔티티: ord_platform_order, ord_order, ord_order_item, ord_cart
• 소유 이벤트: ORDER_CREATED, ORDER_CONFIRMED, ORDER_CANCELLED

[도메인 간 관계]
• 동기 호출 대상: Catalog(재고확인), Member(포인트확인), Promotion(할인계산)
• 비동기 이벤트 발행 대상: Payment, Notification, Settlement
• 복제 테이블 참조: cat_product_replica, mbr_member_replica
```

### AI 보강 섹션

```
[AI-H5] 도메인 경계 규칙                     ← Context Harness (공간축 원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
boundary_rules:
  - "Order 도메인은 Catalog 테이블에 직접 접근 금지 (PublicApi 또는 복제 테이블만 허용)"
  - "Order 도메인이 Payment 로직을 직접 수행 금지 (이벤트 발행으로 위임)"
  - "타 도메인이 ord_ 테이블에 직접 INSERT/UPDATE 금지"

wrong_patterns:
  - "OrderService에서 cat_sku_stock 테이블 직접 UPDATE"
  - "PaymentService에서 ord_order.status를 직접 변경"
  - "Repository에서 타 도메인 prefix 테이블 JOIN"

[AI-H6] 모듈 간 통신 계약                    ← Context Harness (공간축 원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
communications:
  - target: Catalog
    type: SYNC_API
    interface: "CatalogPublicApi.checkStock(skuId, qty)"
    failure_action: "주문 거부"
    
  - target: Payment
    type: ASYNC_EVENT
    event: ORDER_CREATED
    outbox: true
    consumer: "PaymentEventConsumer.onOrderCreated()"
    failure_action: "재시도 3회 → DLQ"

  - target: Member
    type: REPLICA_TABLE
    table: mbr_member_replica
    sync: "MemberReplicaSyncBatch (1분)"
    usage: "주문서 회원 정보 표시 (READ ONLY)"

[AI-H7] 의존 방향 제약                       ← Context Harness (공간축 원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
allowed_dependencies:              # 이 도메인이 의존할 수 있는 대상
  - Catalog (동기)
  - Member (동기 + 복제)
  - Promotion (동기)

forbidden_dependencies:            # 절대 의존하면 안 되는 방향
  - Settlement → Order 직접 호출 금지 (Settlement는 이벤트만 수신)
  - Notification → Order 직접 호출 금지

dependency_direction: |
  Order → Catalog ✅
  Order → Payment ✅ (이벤트)
  Payment → Order ❌ (역방향 금지, 이벤트로만 응답)
```

### 작성 기준
- 도메인정의서는 **Context Harness의 공간축 원천** (누가 누구와 어떻게 통신하는가)
- `boundary_rules`: AI가 코드 생성 시 모듈 경계를 넘지 않도록 하는 제약
- `wrong_patterns`: AI가 흔히 저지르는 도메인 경계 위반 패턴
- `communications`: AI가 PublicApi / Event / Replica 중 어떤 방식으로 구현할지 결정 근거
- `forbidden_dependencies`: AI가 역방향 의존을 만들지 못하도록 차단

---

## 4. ④ 업무흐름 정의서 — 표준양식

### 기본 섹션 (일반 방법론)

```
프로세스 ID     : BPM-{도메인}-{SEQ}
프로세스명      : 
도메인          : 
시작 이벤트     : 
종료 조건       : 
참여자          : 고객 / 시스템 / 입점사 / 어드민

[텍스트 시나리오]
Step 1. 
Step 2. 
Step 3. 

[다이어그램] (Mermaid flowchart)
(기존 업무흐름 다이어그램)

[예외 흐름]
E1. ~ 시 → 처리
E2. ~ 시 → 처리
```

### AI 보강 섹션

```
[AI-H8] 트랜잭션 경계 정의                   ← Context Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
transactions:
  - id: TX-{DOM}-{SEQ}
    scope: "Step 2 ~ Step 4"
    type: DB_TRANSACTION          # DB_TRANSACTION / SAGA / EVENTUAL
    rollback_trigger: "Step 3 실패 시"
    compensation: "재고 복원 + 쿠폰 복원"

[AI-H9] 이벤트 발행·수신 지점                ← Context Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
events:
  - step: "Step 4 완료 후"
    event_name: ORDER_CREATED
    publish_timing: AFTER_COMMIT    # BEFORE_COMMIT / AFTER_COMMIT
    async: true
    consumer_domain: [Payment, Notification]
    outbox: true                    # Outbox Pattern 적용 여부

[AI-H10] 동기/비동기 구분                    ← Context Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| Step | 호출 대상 | 동기/비동기 | 실패 시 처리 |
|------|----------|-----------|------------|
| Step 2 | Catalog 재고확인 | 동기 | 주문 거부 |
| Step 5 | Notification 알림 | 비동기 | 재시도 3회 |

[AI-H11] 타임아웃·배치 트리거                 ← Context Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
timeouts:
  - condition: "TEMP 상태 30분 경과"
    action: "CANCELLED 전환"
    trigger: TempOrderTimeoutBatch
    schedule: "매 5분"
```

### 작성 기준
- 업무흐름은 **Context Harness의 시간축 원천** → API 정의서 Sequence의 참고 입력
- 다이어그램에 반드시 표시: ① 트랜잭션 경계 ② 이벤트 발행 시점 ③ 동기/비동기
- `compensation`: 실패 보상 로직 (AI가 rollback 코드 생성 근거)
- `outbox: true`이면 AI는 Outbox 테이블 저장 + Consumer 코드 생성

---

## 5. ⑤ 화면 정의서 — 표준양식

### 기본 섹션 (일반 방법론)

```
화면 ID         : {APP}-{SEQ}-{SUB}       (예: CUS-040-01)
화면명          : 장바구니
앱              : 고객웹 / 어드민 / 입점사BO
화면 유형       : 목록 / 상세 / 등록 / 수정 / 팝업
접근 권한       : 

[레이아웃]
(와이어프레임 또는 구조도)

[UI 요소]
| # | 요소 | 타입 | 동작 | 비고 |
|---|------|------|------|------|

[화면 전환]
• 버튼 A → CUS-041 (주문서)
• 뒤로가기 → CUS-010 (홈)
```

### AI 보강 섹션

```
[AI-H12] 컴포넌트-API 매핑                    ← Requirements Validation Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| UI 요소/영역 | 호출 API | 시점 | 비고 |
|-------------|---------|------|------|
| 화면 진입 | GET /api/v1/cart | onMount | 장바구니 목록 |
| 수량 변경 | PUT /api/v1/cart/{id} | onChange (debounce 500ms) | |
| 삭제 버튼 | DELETE /api/v1/cart/{id} | onClick | 확인 팝업 후 |
| 주문하기 버튼 | POST /api/v1/orders/sheet | onClick | 선택 상품만 |

[AI-H13] 유효성 검증 규칙 (프론트)            ← Requirements Validation Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| 필드/동작 | 검증 규칙 | 메시지 | 시점 |
|----------|----------|--------|------|
| 수량 입력 | 1~99, 정수만 | "1~99 사이 숫자를 입력하세요" | onChange |
| 주문하기 | 선택 상품 1개 이상 | "상품을 선택해주세요" | onClick |
| 주문하기 | 품절 상품 미포함 | "품절 상품은 주문할 수 없습니다" | onClick |

[AI-H14] 화면 상태 관리                       ← Requirements Validation Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
states:
  - name: cartItems
    source: GET /api/v1/cart
    refresh_trigger: ["담기", "수량변경", "삭제", "로그인머지"]
  - name: isAllSelected
    derived: "cartItems 전체 checked 여부"
  - name: totalAmount
    derived: "선택된 items의 (가격 × 수량) 합산"

loading_states:
  - api: GET /api/v1/cart
    skeleton: true                # 스켈레톤 UI 적용
  - api: PUT /api/v1/cart/{id}
    optimistic: true              # 낙관적 업데이트 적용
```

### 작성 기준
- 화면정의서는 **Requirements Validation의 UI 측 원천**
- `컴포넌트-API 매핑`: AI가 어떤 API를 어떤 시점에 호출하는 코드를 생성하는 근거
- `유효성 검증`: 프론트 검증 로직 자동 생성 기준 (백엔드 검증과 분리)
- `화면 상태 관리`: React 상태 설계 기준 (AI가 useState/useQuery 구조 결정)
- optimistic update, skeleton 등 UX 패턴도 명시

---

## 6. ⑥ ERD (엔티티 정의서) — 표준양식

### 기본 섹션 (일반 방법론)

```
테이블명        : {prefix}_{entity_name}   (예: ord_cart)
도메인          : 
설명            : 

[컬럼 정의]
| # | 컬럼명 | 타입 | 필수 | 기본값 | 설명 |
|---|--------|------|------|--------|------|

[인덱스]
| 인덱스명 | 컬럼 | 유형 | 비고 |
|---------|------|------|------|

[관계]
• FK: {컬럼} → {참조 테이블}.{참조 컬럼}
```

### AI 보강 섹션

```
[AI-H15] 데이터 불변식                        ← Data Contract Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
invariants:
  - "quantity >= 1 (0이면 soft_delete 처리)"
  - "member_id + sku_id UNIQUE (중복 행 금지)"
  - "is_deleted=TRUE인 행은 조회 기본 제외"

[AI-H16] 상태 전이 머신 (해당 엔티티만)       ← Data Contract Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
status_field: order_status
transitions:
  TEMP: [PAID, CANCELLED_TIMEOUT]
  PAID: [PREPARING, CANCEL_REQUESTED]
  PREPARING: [IN_DELIVERY, CANCEL_REQUESTED]
  IN_DELIVERY: [DELIVERED]
  DELIVERED: [CONFIRMED, RETURN_REQUESTED, EXCHANGE_REQUESTED]
  
forbidden_transitions:              # AI가 절대 허용하면 안 되는 전이
  - from: DELIVERED
    to: PREPARING
    reason: "배송완료 후 출고 전 상태로 되돌릴 수 없음"
  - from: CONFIRMED
    to: any
    reason: "구매확정은 최종 상태"

[AI-H17] 소프트 삭제·감사 규칙                ← Data Contract Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
soft_delete: true
immutable_fields: [order_no, created_at, member_id]  # 생성 후 수정 금지
audit_trigger: true                 # Audit 도메인 자동 기록 대상 여부
default_query_scope: "is_deleted = FALSE"

[AI-H18] 복제 테이블 규칙 (해당 시)           ← Data Contract Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
is_replica: false / true
sync_source: {원본 도메인}.{원본 테이블}
sync_method: BATCH / EVENT
sync_schedule: "매 1분 (CodeSyncBatch)"
write_allowed: false                # 복제 테이블 직접 쓰기 금지
```

### 작성 기준
- ERD는 **Data Contract Harness의 원천**
- `invariants`: AI가 Repository/Service에서 항상 보장해야 할 조건
- `상태 전이`: AI가 status 변경 코드 작성 시 허용 전이만 구현하도록 제한
- `forbidden_transitions`: wrong_pattern의 데이터 버전 (AI가 흔히 허용하는 잘못된 전이)
- `immutable_fields`: AI가 UPDATE 쿼리에서 제외해야 할 컬럼
- 상태 전이가 없는 테이블(장바구니, 설정 등)은 [AI-H16] 생략

---

## 7. ⑦ 기술 정의서 (기술스택·아키텍처) — 표준양식

### 기본 섹션 (일반 방법론)

```
문서명          : 기술 스택 정의서
프로젝트        : 
버전            : 
상태            : CONFIRMED

[기술 스택]
| 항목 | 기술 | 버전 |
|------|------|------|
| 백엔드 | Kotlin + Spring Boot | 3.3 |
| 프론트 | Next.js + TypeScript | 14/15 |
| DB | PostgreSQL | |
| ORM | MyBatis | |
| 캐시 | Redis | |
| 검색 | Elasticsearch | |

[프로젝트 구조]
(폴더 트리)

[실행 환경]
| 앱 | 포트 | 실행 명령 |
|----|------|---------|

[배포 구조]
(Docker Compose / K8s 등)
```

### AI 보강 섹션

```
[AI-H19] 코드 생성 규칙 (레이어·패턴)         ← Output Schema Harness (원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
code_generation_rules:
  backend:
    layer_structure:
      - Controller: "API 진입점, 요청 검증, 응답 변환"
      - Service: "비즈니스 로직, 트랜잭션 관리"
      - Repository: "데이터 접근 (MyBatis Mapper)"
      - DTO: "요청/응답 데이터 클래스"
    naming:
      controller: "{Domain}{Role}Controller"     # 예: CustomerProductController
      service: "{Domain}Service"
      repository: "{Domain}Repository"
      dto: "{Action}{Domain}Request/Response"
    package: "com.runnshop.{domain}.{layer}"
    
  frontend:
    apps:
      - name: runNshop-mobile
        framework: "Next.js 14 (App Router)"
        styling: "Tailwind CSS"
        structure: "app/{route}/page.tsx + components/"
      - name: runNshop-admin
        framework: "Next.js 15 (CSR SPA)"
        styling: "순수 CSS (globals.css, BEM)"
        structure: "src/{domain}/{Feature}Tab.tsx"
      - name: runNshop-partner
        framework: "Next.js 15 (CSR SPA)"
        styling: "순수 CSS (globals.css, 틸 테마)"
        structure: "src/{domain}/{Feature}Tab.tsx"

[AI-H20] 프로토타입 단계 제약                  ← Output Schema Harness (원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
prototype_rules:
  - "Controller → MockLoader → JSON 반환 (Service 로직 미구현)"
  - "POST/PUT/DELETE: API 호출은 하되, 실제 저장 없이 성공 응답"
  - "Mock 파일 위치: resources/mock/{v1|admin|partner}/"
  - "Mock 파일명: {domain}__{METHOD}_{path}.json"
  - "화면 간 네비게이션은 모두 정상 동작"
  - "유효성 검증은 실제와 동일하게 구현"

production_rules:                  # 본개발 전환 시
  - "MockLoader → 실제 Service 교체"
  - "Service → Repository → MyBatis Mapper"
  - "@Transactional 위치: Service 레벨"
  - "이벤트 발행: Outbox 테이블 INSERT (같은 트랜잭션)"

[AI-H21] 공통 기술 제약 (프레임워크 레벨)      ← Output Schema Harness (원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
technical_constraints:
  - id: TC-001
    rule: "물리적 DELETE 전면 금지 (soft_delete만 허용)"
    applies_to: "전체"
    
  - id: TC-002
    rule: "도메인 간 직접 테이블 접근 금지"
    applies_to: "Repository 레이어"
    wrong_pattern: "OrderRepository에서 cat_ 테이블 조회"
    
  - id: TC-003
    rule: "복제 테이블은 READ ONLY (INSERT/UPDATE 금지)"
    applies_to: "Repository 레이어"
    
  - id: TC-004
    rule: "하드코딩 금지 (모든 데이터는 API를 통해)"
    applies_to: "Frontend 전체"
    
  - id: TC-005
    rule: "에러 메시지 다국어 키 사용 (하드코딩 문자열 금지)"
    applies_to: "Backend Response"

  - id: TC-006
    rule: "동일 로직 3개 앱 사용 → 하나의 메서드에 3개 URL 매핑"
    applies_to: "Controller"
    wrong_pattern: "동일 로직을 3개 Controller에 각각 구현"

[AI-H22] 앱별 UI 패턴 제약                    ← Output Schema Harness (원천)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ui_patterns:
  mobile:
    layout: "Header + Content + BottomNav"
    nav_rule: "장바구니·주문서·결제·로그인 시 BottomNav 숨김"
    popup: "Layer Popup (로그인·공지), Bottom Sheet (옵션·필터)"
    
  admin:
    layout: "NavBar (Top, 풀다운) + TabBar (LRU 최대9) + TabContent"
    mdi: true                       # Multi Document Interface
    detail: "Layer Popup"
    home_tab: "고정, 닫기 불가"
    
  partner:
    layout: "NavBar (Top, 풀다운) + TabBar (LRU 최대9) + TabContent"
    mdi: true
    detail: "Layer Popup"
    theme: "틸 (teal)"
```

### 작성 기준
- 기술정의서는 **Output Schema Harness의 원천** → AI가 코드를 어떤 구조로 생성할지 결정
- `code_generation_rules`: AI가 파일 생성 시 네이밍·위치·패턴을 따르도록 강제
- `prototype_rules`: 프로토타입 단계에서 AI가 절대 넘지 않을 경계 (실 DB 접근 등)
- `technical_constraints`: 프레임워크 레벨에서 모든 도메인에 공통 적용되는 제약
- `ui_patterns`: 앱별 UI 구조 제약 (AI가 레이아웃·팝업 방식을 결정하는 근거)

---

## 8. ⑧ API 정의서 — 표준양식 (서브산출물 포함)

### 기본 섹션 + Harness 종합

API 정의서는 ①~⑦에서 축적된 Harness 정보를 **종합·참조**하는 최종 문서.

```
[문서 헤더]
api_id: {DOM}-{SEQ}
api_name: 
domain: 
type: A/B/C/D
source_req: FR-{DOM}-{SEQ}         # ① 원천 요구사항
source_policy: POL-{DOM}-{SEQ}     # ② 적용 정책
source_domain: DOM-{DOM}           # ③ 도메인 정의 참조
source_process: BPM-{DOM}-{SEQ}    # ④ 업무흐름 참조
source_screen: {APP}-{SEQ}         # ⑤ 화면 참조
source_entity: {prefix}_{table}    # ⑥ ERD 참조
source_tech: TC-{SEQ}             # ⑦ 기술 제약 참조
```

### 6개 Harness 종합 (참조 기반)

```
[Context Harness] — ③ 도메인정의(공간축) 참조 + ⑧ API별 Sequence 직접 작성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bounded_context: (③에서 참조)
dependencies: (③에서 참조)
communications: (③에서 참조)

# ↓ 아래는 API 정의서에서 직접 작성 (④ 업무흐름을 참고 입력으로)
# → Sequence 서브산출물(SEQ-{DOM}-{SEQ})로 별도 작성
sequence_ref: SEQ-{DOM}-{SEQ}      # Sequence 서브산출물 참조

endpoint:
  method: 
  path: 
  auth: 
  role: []

[Requirements Validation Harness] — ⑤ 화면정의에서 도출
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
request:
  | 필드 | 타입 | 필수 | 제약조건 |
  |------|------|------|---------|
  # ⑤ 화면정의의 UI 규칙(컴포넌트-API 매핑·검증)을 API 필드 단위로 전개

response:
  success: {status: , body: }
  error_catalog:
    - {code: , http: , condition: , message_key: }

cross_field_rules:
  - rule: (①에서 상속)

[Domain Constraint Harness] — ①② 에서 상속
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARD: (① 요구사항 HARD + ② 정책 코드화에서 복사)
SOFT: (② 정책서에서 복사)

[Data Contract Harness] — ⑥ ERD 참고 + ⑧ API별 직접 작성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 도메인 레벨 (⑥ ERD에서 참조)
invariants: (⑥ AI-H15 참조)
state_transition: (⑥ AI-H16 참조)
soft_delete: (⑥ AI-H17 참조)

# API 레벨 (Data Contract 서브산출물로 별도 작성)
# → Data Contract 서브산출물(DC-{DOM}-{SEQ})로 별도 작성
data_contract_ref: DC-{DOM}-{SEQ}  # Data Contract 서브산출물 참조

[Output Schema Harness] — ⑦ 기술정의에서 상속 + API 고유 상세
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
layer: (⑦ code_generation_rules 기반)
pattern: Command / Query
expected_classes: []               # API별 구체 클래스명
transaction_annotation: @Transactional 위치
event_publishing: {timing: , method: }

[Feedback Loop Harness] — ① 에서 상속 + API별 분배
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
test_scenarios: (① 검증시나리오를 API 단위로 분배)
quality_gate: {p95_latency: , test_coverage: }
```

### 작성 기준
- **"참조"로 표시된 항목은 원천 문서에서 가져온다** (중복 작성 금지)
- Output Schema만 API 정의서 고유 (코드 레벨 산출물 지정)
- `source_*` 헤더로 역추적 경로 보장
- Sequence·Data Contract는 복잡도가 높은 API에 한해 서브산출물로 별도 작성

---

## 8-1. Sequence 서브산출물 — 표준양식

Sequence는 **API 정의서의 서브산출물**로, Context Harness의 시간축을 API 단위로 구체화한다.
단순 CRUD(조회만 하거나 단일 테이블 단순 쓰기)는 작성 생략 가능.

### 기본 섹션

```
Sequence ID    : SEQ-{DOM}-{SEQ}
API            : {DOM}-{SEQ}  ({API명})
업무흐름 참조  : BPM-{DOM}-{SEQ}   ← ④ 업무흐름을 참고 입력으로 사용
작성일         : 
```

### AI 보강 섹션

```
[AI-H23] Sequence 다이어그램 (API별)          ← Context Harness (시간축)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
transaction_scope: "이 API가 커버하는 트랜잭션 범위"
event_publish_timing: AFTER_COMMIT    # BEFORE_COMMIT / AFTER_COMMIT
involved_domains: []                  # 이 API가 호출하는 도메인 목록

[Mermaid Sequence Diagram]
sequenceDiagram
  actor 호출자
  participant {Dom}API as {도메인명}API
  participant {Dom2}API as {도메인명2}API
  participant OutboxTable

  호출자->>+{Dom}API: POST /api/v1/{resource}

  rect rgb(200, 250, 200)
    Note over {Dom}API,OutboxTable: @Transactional 범위
    {Dom}API->>+{Dom2}API: 동기 호출 (성공/실패 즉시 반영)
    {Dom2}API-->>-{Dom}API: 응답

    alt 동기 호출 실패
      {Dom}API-->>호출자: 400 / 409 오류 반환
    end

    {Dom}API->>OutboxTable: 이벤트 INSERT (AFTER_COMMIT)
  end

  {Dom}API-->>-호출자: 200 OK

wrong_patterns:
  - "트랜잭션 외부에서 외부 API 동기 호출 (실패 시 보상 불가)"
  - "BEFORE_COMMIT 이벤트 발행 (DB 롤백 시 이벤트 취소 불가)"
  - "비동기 이벤트를 동기 호출로 대체 (강결합)"
```

### 작성 기준
- ④ 업무흐름의 전체 플로우에서 **이 API가 담당하는 슬라이스**만 추출
- `transaction_scope`: @Transactional 어노테이션 범위와 일치해야 함
- `event_publish_timing`: Outbox 패턴 적용 시 반드시 AFTER_COMMIT
- Mermaid 다이어그램 `rect` 블록으로 트랜잭션 경계를 명시
- 실패 분기(alt/opt)를 포함하여 AI가 예외 처리 코드를 생성하는 근거로 활용

---

## 8-2. Data Contract 서브산출물 — 표준양식

Data Contract는 **API 정의서의 서브산출물**로, Data Contract Harness를 API 단위로 구체화한다.
⑥ ERD의 도메인 레벨 불변식·전이 규칙을 참조하여, 이 API가 읽고 쓰는 필드를 상세 정의한다.

### 기본 섹션

```
Data Contract ID : DC-{DOM}-{SEQ}
API              : {DOM}-{SEQ}  ({API명})
ERD 참조         : {prefix}_{table}   ← ⑥ ERD를 참고 입력으로 사용
작성일           : 
```

### AI 보강 섹션

```
[AI-H24] Data Contract (API별)                ← Data Contract Harness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 도메인 레벨 규칙 참조 (⑥ ERD에서 원천 작성된 내용)
invariants_ref: AI-H15           # 불변식 원천
state_transition_ref: AI-H16     # 상태 전이 원천
soft_delete_ref: AI-H17          # 소프트 삭제 규칙 원천

# API 레벨 영속성 계약 (여기서 직접 작성)
persistence:
  target_tables:
    - {prefix}_{table}           # INSERT/UPDATE 대상 테이블
    - {prefix}_outbox            # 이벤트 발행 시 필수

  read_fields:
    | 필드 | 테이블 | 조건 | 비고 |
    |------|--------|------|------|
    | field_name | table_name | WHERE 조건 | |

  write_fields:
    | 필드 | 테이블 | 액션 | 비고 |
    |------|--------|------|------|
    | field_name | table_name | INSERT/UPDATE | |

  default_query_scope: "is_deleted = FALSE AND ..."
  index_hint:
    - idx_{table}_{col}: "사용 이유 (예: 회원별 주문 목록 조회)"

transaction_annotation: "@Transactional(readOnly = false)"
isolation_level: READ_COMMITTED   # 기본; REPEATABLE_READ 필요 시 명시

wrong_patterns:
  - "is_deleted = TRUE 행 조회 필터 누락"
  - "immutable_fields(order_no 등) UPDATE 쿼리 포함"
  - "복제 테이블에 INSERT/UPDATE"
  - "Outbox 테이블을 트랜잭션 외부에서 INSERT"
```

### 작성 기준
- ⑥ ERD의 불변식·전이 규칙을 **참조**하고, 이 API 고유의 쿼리 조건을 **직접 작성**
- `read_fields` / `write_fields`: AI가 MyBatis Mapper XML을 생성하는 직접 근거
- `index_hint`: AI가 불필요한 풀스캔 쿼리를 생성하지 않도록 인덱스 활용 방향 지시
- `default_query_scope`: 모든 SELECT에 공통으로 붙는 WHERE 조건 (AI가 자주 누락)
- `wrong_patterns`: 이 API 특유의 실수 패턴 (도메인 레벨 wrong_pattern을 보완)

---

## 9. Harness 원천-참조 매핑 요약

| Harness | 원천 작성 단계 | API 정의서에서 | 중복 여부 |
|---------|--------------|--------------|----------|
| Context (공간축: 경계·통신) | ③ 도메인정의 | 참조 | 원천이 정본 |
| Context (시간축: 트랜잭션·이벤트) | ④ 업무흐름 (도메인 레벨) | **Sequence 서브산출물로 API별 직접 작성** | 업무흐름=큰 그림, Sequence=API 단위 상세 |
| Domain Constraint (HARD) | ① 요구사항 + ② 정책서 | 참조 (복사) | 원천이 정본 |
| Domain Constraint (SOFT) | ② 정책서 | 참조 | 원천이 정본 |
| Requirements Validation (UI) | ⑤ 화면정의 (UI 규칙·컴포넌트 매핑) | API Request/Response 필드로 전개 (중복 아닌 구체화) | 화면=UI 이벤트·시점, API=필드·타입·제약 |
| Data Contract | ⑥ ERD (도메인 레벨) | **Data Contract 서브산출물로 API별 직접 작성** | ERD=불변식·전이규칙, Data Contract=쿼리조건·persistence |
| Output Schema (구조·패턴) | ⑦ 기술정의 | 상속 + API별 상세 | 기술=공통규칙, API=구체클래스 |
| Feedback Loop | ① 요구사항 | API별 분배 | 요구사항=전체, API=분배 |

### 서브산출물 2단계 작성 원칙 (Sequence, Data Contract)

```
도메인 레벨 (큰 그림)                    API 레벨 서브산출물 (상세)
━━━━━━━━━━━━━━━━━━━━                  ━━━━━━━━━━━━━━━━━━━━━━
④ 업무흐름: 전체 플로우 정의      →    Sequence(SEQ-{DOM}-{SEQ}) 직접 작성
  • 어떤 순서로 진행되는가                • 이 API의 트랜잭션 범위
  • 어떤 도메인이 참여하는가              • 이 API가 발행하는 이벤트
  • 실패 시 보상 방향                     • commit 전/후 타이밍
                                         • Mermaid Sequence Diagram

⑥ ERD: 엔티티 규칙 정의          →    Data Contract(DC-{DOM}-{SEQ}) 직접 작성
  • 상태전이 허용 규칙                    • 이 API가 읽는/쓰는 필드
  • 불변식, soft_delete                   • 기본 조회 조건 (WHERE)
  • immutable_fields                      • 이 API의 트랜잭션 어노테이션 위치
                                         • 인덱스 힌트
```

> **결론**: Sequence·Data Contract는 앞 단계(④⑥)의 도메인 레벨 규칙을 **참고 입력**으로 받되,
> API 정의서(⑧) 단계에서 API 단위로 **서브산출물로 직접 작성**한다.

### 중복 제거 원칙

```
✅ 올바른 방식:
  정책서에 HARD Constraint 원천 작성
  → 요구사항에서 "POL-ORD-001 참조" 표기
  → API 정의서에서 "HC-ORD-001 (출처: POL-ORD-001)" 참조

❌ 잘못된 방식:
  정책서·요구사항·API 정의서 3곳에 같은 규칙을 각각 작성
  → 변경 시 3곳 수정 필요 → 불일치 발생
```

---

## 10. 단계별 작성 체크리스트

### ① 요구사항 정의서
- [ ] AC가 검증 가능한 형태인가
- [ ] HARD Constraint에 wrong_pattern을 작성했는가
- [ ] 검증 시나리오에 실패·엣지 케이스가 포함되어 있는가
- [ ] SOFT 규칙은 ② 정책서 참조로 처리했는가 (중복 작성 금지)

### ② 정책서
- [ ] 정책을 rule_expression(조건식)으로 코드화했는가
- [ ] 변경 빈번 정책에 Config 분리 지시가 있는가
- [ ] affected_domains(영향 범위)를 명시했는가

### ③ 도메인 정의서
- [ ] 도메인 경계 규칙(boundary_rules)을 정의했는가 (AI-H5)
- [ ] 모듈 간 통신 계약(SYNC/ASYNC/REPLICA)을 명시했는가 (AI-H6)
- [ ] 의존 방향 제약(forbidden_dependencies)을 작성했는가 (AI-H7)
- [ ] wrong_patterns(경계 위반 패턴)을 기술했는가

### ④ 업무흐름 정의서
- [ ] 트랜잭션 경계를 다이어그램에 표시했는가 (AI-H8)
- [ ] 이벤트 발행 시점(BEFORE/AFTER COMMIT)을 명시했는가 (AI-H9)
- [ ] 동기/비동기 구분과 실패 시 처리를 작성했는가 (AI-H10)
- [ ] 타임아웃·배치 트리거를 정의했는가 (AI-H11)

### ⑤ 화면 정의서
- [ ] 컴포넌트-API 매핑을 작성했는가 (AI-H12)
- [ ] 프론트 유효성 검증 규칙을 정의했는가 (AI-H13)
- [ ] 화면 상태(state) 소스와 갱신 트리거를 명시했는가 (AI-H14)

### ⑥ ERD
- [ ] 데이터 불변식(invariants)을 작성했는가 (AI-H15)
- [ ] 상태 전이가 있으면 forbidden_transitions를 정의했는가 (AI-H16)
- [ ] immutable_fields를 명시했는가 (AI-H17)
- [ ] 복제 테이블이면 write_allowed: false를 표기했는가 (AI-H18)

### ⑦ 기술 정의서
- [ ] 코드 생성 규칙(네이밍·레이어·패키지)을 정의했는가 (AI-H19)
- [ ] 프로토타입 단계 제약을 명시했는가 (AI-H20)
- [ ] 공통 기술 제약(TC-*)에 wrong_pattern이 있는가 (AI-H21)
- [ ] 앱별 UI 패턴 제약을 작성했는가 (AI-H22)

### ⑧ API 정의서 (본문)
- [ ] source_* 헤더로 원천 문서를 역참조할 수 있는가
- [ ] Output Schema(레이어·클래스명)를 지정했는가
- [ ] ①~⑦ 보강 항목을 참조로 연결했는가 (중복 아닌 참조)

### ⑧-1. Sequence 서브산출물
- [ ] 트랜잭션 범위(rect 블록)를 Mermaid에 표시했는가 (AI-H23)
- [ ] 이벤트 발행 타이밍(AFTER_COMMIT)을 명시했는가
- [ ] 실패 분기(alt/opt)를 포함했는가
- [ ] wrong_patterns(이 API 특유의 실수 패턴)을 작성했는가

### ⑧-2. Data Contract 서브산출물
- [ ] read_fields / write_fields 테이블을 완성했는가 (AI-H24)
- [ ] default_query_scope(기본 WHERE 조건)를 명시했는가
- [ ] index_hint를 작성했는가
- [ ] wrong_patterns(이 API 특유의 실수 패턴)을 작성했는가

---

## 11. 실패 역추적 가이드

AI 코딩 결과가 기대와 다를 때, 아래 순서로 **원천 문서**를 점검한다.

```
문제 유형                                점검 원천          보강 항목
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"비즈니스 규칙이 다르게 구현됨"        → ② 정책서         AI-H3 rule_expression
"도메인 경계 위반 (타 모듈 직접 접근)"  → ③ 도메인정의     AI-H5 boundary_rules
"통신 방식이 다름 (동기↔비동기)"       → ③ 도메인정의     AI-H6 communications
"의존 방향이 역전됨"                   → ③ 도메인정의     AI-H7 forbidden_dependencies
"트랜잭션 범위가 틀림"                 → Sequence 서브산출물  AI-H23 transaction_scope
"API 호출 순서가 다름"                 → Sequence 서브산출물  AI-H23 Mermaid diagram
"이벤트 발행 타이밍이 틀림"            → Sequence 서브산출물  AI-H23 event_publish_timing
"상태 전이가 잘못됨"                   → ⑥ ERD           AI-H16 forbidden_transitions
"쿼리 조건이 누락됨 (is_deleted 등)"   → Data Contract 서브산출물  AI-H24 default_query_scope
"읽기·쓰기 필드가 틀림"               → Data Contract 서브산출물  AI-H24 read/write_fields
"프론트 검증이 빠짐"                   → ⑤ 화면정의       AI-H13 유효성 규칙
"파일 위치·네이밍이 다름"              → ⑦ 기술정의       AI-H19 code_generation_rules
"프로토타입에서 실DB 접근"             → ⑦ 기술정의       AI-H20 prototype_rules
"UI 레이아웃 구조가 다름"              → ⑦ 기술정의       AI-H22 ui_patterns
"엣지 케이스 누락"                     → ① 요구사항       AI-H2 검증 시나리오
"Config가 하드코딩됨"                  → ② 정책서         AI-H4 change_frequency
```

---

## 12. 기존 산출물 보강 전략 (점진적 적용)

한 번에 전체를 보강하지 않고, **AI 오류 빈도 순서**로 우선 적용한다.

```
우선순위 1 (즉시): AI 오류율 최고
  • ② 정책서 → AI-H3 정책 코드화 (rule_expression)
  • ① 요구사항 → AI-H1 HARD Constraint + wrong_pattern
  • ③ 도메인정의 → AI-H5 경계 규칙 + AI-H6 통신 계약

우선순위 2 (1~2주 내): 구현 품질 직결
  • Sequence 서브산출물 → AI-H23 Mermaid Sequence (트랜잭션 경계·이벤트 타이밍)
  • ⑥ ERD → AI-H16 상태 전이 (forbidden_transitions)
  • ⑦ 기술정의 → AI-H19 코드 생성 규칙 + AI-H20 프로토타입 제약

우선순위 3 (도메인별 순차): 데이터·프론트 품질
  • Data Contract 서브산출물 → AI-H24 read/write fields + query scope
  • ⑤ 화면정의 → AI-H12 컴포넌트-API 매핑
  • ① 요구사항 → AI-H2 검증 시나리오 (엣지 케이스)

우선순위 4 (선택): 고급 최적화
  • ⑥ ERD → AI-H15 불변식, AI-H18 복제 규칙
  • ⑤ 화면정의 → AI-H14 상태 관리 (optimistic update 등)
  • ⑦ 기술정의 → AI-H22 앱별 UI 패턴 제약
```

---

*본 문서는 SI 방법론 8단계 산출물의 AI 코딩 보강 표준양식을 정의한다.*
*기존 산출물 양식을 변경하지 않고, 각 단계에 Harness 보강 섹션을 추가하는 방식이다.*
*API 정의서는 ①~⑦ 보강 항목을 종합·참조하는 최종 문서로, 중복 작성을 금지한다.*
*Sequence·Data Contract는 API 정의서의 서브산출물로, 복잡도가 높은 API에 한해 작성한다.*
