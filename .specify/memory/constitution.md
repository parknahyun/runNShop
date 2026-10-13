<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: 없음 (I~VIII 유지)
- Added sections: Core Principle IX (Issue → Branch → PR 워크플로우, NON-NEGOTIABLE)
- Modified sections: 개발 워크플로 및 품질 게이트 (브랜치 규칙을 `{type}/{issue-number}-{slug}`로 대체,
  PR 게이트에 원칙 IX 추가, Spec Kit 흐름에 이슈 선행 명시), Governance (준수 검토에 강제 수단 점검 추가)
- Removed sections: 없음
- 1.0.0 이력: 최초 작성 (템플릿 플레이스홀더 전부 대체)
- Source: docs/deliverables (conventions C1~C9, D4 범위, D7 제약사항, D8 NFR, DO-ADR)
- Follow-up TODOs:
  - TODO(ADMIN_PARTNER_STACK): C3는 어드민/입점사를 Next.js 14로, D7(CT-1-3/4)은 Next.js 15 + React 19로 기술.
    본 헌법은 D7(제약사항)을 우선 적용했으며 C3 정정 필요.
  - TODO(PARTNER_THEME): C3는 입점사 테마를 orange, D7은 teal로 기술. C7 디자인시스템(partner) 기준 확정 필요.
  - TODO(ERROR_ENVELOPE): D7 CT-7-4는 성공 응답 {code, data}, C6 §6.3은 에러 응답 {code, message, errors, traceId}.
    두 규격은 모순되지 않으나 C1 §3.5(traceId 없음)와의 정합 확인 필요.
  - TODO(API_VERSION_OVERLAP): C6 §9는 구버전 6개월 병행, D8 NFR-MA-04는 최소 1개월 병행. 기준 통일 필요.
- Templates requiring review: .specify/templates/plan-template.md (Constitution Check 항목 동기화 권장)
-->
# runNshop Constitution

runNshop은 러닝 전문 B2C 이커머스 플랫폼(고객웹·어드민·입점사 3채널, 12개 도메인)이다.
본 헌법은 `docs/deliverables`의 승인된 설계 산출물(컨벤션 C1~C9, 제약사항 D7, NFR D8, ADR)에서
추출한 불변 규칙이며, 모든 spec·plan·tasks·구현은 본 헌법을 따라야 한다.

## Core Principles

### I. 서버 신뢰와 보안 기본선 (NON-NEGOTIABLE)
- 모든 유효성 검증·금액 계산·권한 판단은 서버에서 수행해야 한다(MUST). 클라이언트가 전달한 금액은
  무시하고 서버가 재계산한다. FE 검증을 통과해도 BE 검증은 생략할 수 없다.
- PII(이름·전화번호·이메일·카드번호)는 항상 마스킹하여 노출해야 한다(MUST). Mock 데이터와 로그도
  동일하다(홍*동, 010-****-5678, h**@example.com, ****-1234).
- 시크릿(API Key·Password)을 코드에 하드코딩해서는 안 된다(MUST NOT). 환경변수(`${ENV_VAR}`)를
  사용하고 `.env` 파일은 `.gitignore`에 포함한다.
- 카드번호·CVV는 서버에 저장하지 않는다(MUST NOT). PG 빌링키(토큰)만 보관한다(ADR-005, PCI DSS).
- 에러 응답에 스택트레이스·쿼리 등 내부 정보를 노출해서는 안 된다(MUST NOT).
- 수량은 1~99 범위, 열거형 미정의 값은 400으로 거부한다.

**근거**: C1 보안컨벤션, NFR-SE-04/05/07/09/15/16/17/20/22는 프로토타입 단계에서도 적용 대상이다.

### II. 도메인 경계 및 앱 분리
- 12개 도메인(order, catalog, member, payment, promotion, settlement, vendor, notification,
  community, search, config, audit)은 `com.runnshop.{domain}` 패키지로 분리한다(MUST).
- 다른 도메인의 Service/Repository/Entity를 직접 import해서는 안 된다(MUST NOT). 동기 호출은
  `{Domain}PublicApi` 인터페이스, 상태 전파는 이벤트로만 한다. 순환 의존은 금지한다.
- 각 도메인은 자기 테이블만 직접 접근한다. `common/`은 순수 유틸에 한정한다.
- Controller는 앱별로 분리(`Customer*`/`Admin*`/`Partner*Controller`)하고 Service는 공유한다.
  하나의 Controller에 다중 URL 매핑을 두어서는 안 된다(MUST NOT).
- 앱(mobile/admin/partner/api)은 독립 빌드·실행 가능해야 하며, 앱 간 직접 코드 의존은 금지한다.
  공유 코드는 `packages/`를 통해 명시적으로 관리한다.

**근거**: C3 아키텍처컨벤션, D7 CT-2, NFR-MA-03(ArchUnit으로 검증). 향후 서비스 분리 가능성을 확보한다.

### III. 계약 우선 API (Contract-First)
- API 계약(Request/Response)을 먼저 정의하고 구현은 계약을 따른다(MUST). Entity를 직접 노출하지
  않고 별도 DTO(`{Action}Request`, `{Entity}Response`)를 사용한다.
- Path Prefix는 `/api/v1/**`(고객), `/api/admin/v1/**`(어드민), `/api/partner/v1/**`(입점사)로
  고정한다. 리소스는 복수형 kebab-case 명사이며, 업무 행위만 `POST /{resource}/{id}/{action}`을 허용한다.
- JSON 프로퍼티·Path/Query 파라미터는 camelCase, Enum은 UPPER_SNAKE_CASE, ID는 ULID 문자열,
  금액은 KRW 정수, 일시는 ISO 8601(Offset 포함)로 한다.
- 성공 응답은 `{ "code": "SUCCESS", "data": ... }`, 목록은 `data.items` + `data.pagination`
  (page 1-based, size 최대 100), 에러는 `{ code, message, errors?, traceId? }`를 따른다.
- 결제·주문생성 등 중복 실행이 문제되는 POST는 `Idempotency-Key`(ULID, 유효 24시간)를 지원한다.
- Breaking Change(필드 제거·타입 변경·응답 구조 변경)는 URL 버전을 올린다.
- Mock/프로토타입 API도 실제 운영 계약과 동일해야 하며, Mock이 임의의 API를 만들어서는 안 된다.

**근거**: C6 API설계컨벤션, D7 CT-3/CT-7-4.

### IV. 이벤트 기반 정합성
- 이벤트는 "발생한 사실"이며 `{DOMAIN}_{PAST_TENSE_ACTION}`(예: `ORDER_PAID`) 형식이다. 상태를
  소유한 도메인만 해당 이벤트를 발행한다. Command 형식 이름(`PAY_ORDER`)은 금지한다.
- 이벤트 Envelope는 `eventId, eventType, eventVersion, occurredAt, producer, correlationId, payload`를
  필수로 포함한다. 필드 제거·타입 변경은 `eventVersion`을 올리고 Consumer를 먼저 배포한다.
- 실 프로젝트에서 발행은 Outbox 패턴(비즈니스 변경과 동일 트랜잭션)을 따르고, 전달 보장은
  At-Least-Once이다. Consumer는 `eventId` UNIQUE 기반 `processed_event`로 멱등 처리해야 한다(MUST).
- Consumer 재시도는 기본 3회 지수 백오프(1·2·4초)이며, 소진 시 DLQ로 보낸다. Consumer 간 의존은 금지한다.
- 즉시 결과가 필요한 호출(결제 요청, 재고 선점)은 동기 PublicApi, 상태 전파(환불, 정산 등록)는
  비동기 이벤트로 한다(ADR-002). 이벤트만으로 현재 상태를 단정하지 않는다.
- 프로토타입에서는 in-process `ApplicationEvent`(Best-effort)를 허용한다.

**근거**: C5 이벤트설계컨벤션, ADR-006, DI 이벤트플로우(이벤트 카탈로그의 Single Source of Truth).

### V. 데이터 모델링 표준
- 테이블은 `{domain_prefix}_{entity}` 소문자 snake_case 단수형(`ord_order`, `pay_payment`)이다.
- PK는 `id varchar(26)`(ULID)이며 Auto Increment는 금지한다. 물리 FK 제약은 사용하지 않고
  애플리케이션에서 무결성을 관리하되, FK 컬럼에는 반드시 인덱스를 생성한다.
- 금액은 `int`(KRW), 일시는 `timestamp`(UTC 저장, KST 표시), 상태는 `varchar(30)` UPPER_SNAKE_CASE이다.
  상태값의 허용 범위는 상태머신(DH)이 Single Source of Truth이다. "미정"을 NULL로 표현하지 않는다.
- 일반 Entity는 `id, created_at, updated_at, is_deleted`를 가진다. 이력·스냅샷·매핑 테이블은
  문서화된 예외 컬럼 규칙을 따른다. Soft Delete는 필요한 Entity에만 적용한다.
- 주문·결제 시점의 상품명·단가는 스냅샷으로 저장한다(MUST).
- 주문은 2계층(`ord_platform_order` → `ord_order`)이며 결제는 platform order 단위, 배송·정산·클레임은
  order 단위로 처리한다(ADR-003).

**근거**: C4 데이터모델링컨벤션, ADR-003.

### VI. 프로토타입-실 구현 전환 가능성
- Service는 Repository interface에만 의존한다(MUST). 프로토타입은 `@Profile("prototype")`
  `Mock*Repository`(JSON 로딩), 실 구현은 `Jpa*Repository`로 교체하며 Controller·Service 코드는 바뀌지 않아야 한다.
- 프로토타입의 Mutation API는 영속화 없이 성공 응답만 반환하되, FE는 반드시 실제 API를 호출한다.
  FE에서 데이터를 하드코딩하거나 Mock 데이터를 직접 생성해서는 안 된다(MUST NOT).
- Mock 파일은 `api/runNshop-api/src/main/resources/mock/{v1|admin|partner}/`에
  `{domain}__{METHOD}_{path}.json`으로 둔다.
- 프로토타입 한정 예외(인증/인가·HTTPS·JWT·성능·가용성 측정 제외)는 C1 §4와 D8 "프로토타입 단계
  적용 범위"에 열거된 항목에 한한다. 실 프로젝트 전환 시 해당 예외는 즉시 해제된다.

**근거**: C3 §4.3~4.4, C9 §8, D7 CT-2-3/CT-5, D8 프로토타입 적용 범위.

### VII. 코드 품질과 테스트 (NON-NEGOTIABLE)
- 유지보수성 NFR(NFR-MA-01~05)은 프로토타입에서도 적용된다. Line Coverage ≥ 80%, 메서드 Cyclomatic
  Complexity ≤ 15(초과 시 리뷰 필수), 클린 빌드 ≤ 3분.
- 도메인 간 직접 참조 금지는 ArchUnit 등 아키텍처 테스트로 자동 검증한다.
- 요구사항은 EARS(DD)와 GWT 수용기준(DJ)으로 추적 가능해야 하며, 구현은 GWT를 통과하는 테스트로 입증한다.
- 포매팅·Import 정렬은 Prettier/ESLint(TS)와 ktlint(Kotlin)에 위임한다. 네이밍은 C9를 따른다
  (클래스·컴포넌트 PascalCase, 함수·변수 camelCase, 상수 UPPER_SNAKE_CASE, Boolean `is/has/can/should`).
- 검증·예외는 계층별로 분리한다. FE는 형식·UX, BE는 무결성·업무 규칙·보안을 맡는다. 전역 예외 처리는
  `@ControllerAdvice`, 비즈니스 예외는 도메인별 Exception 클래스를 사용한다.
- 화면 컴포넌트는 API 호출을 직접 구현하지 않고 API Client(`lib/api.ts`) 또는 Hook을 통한다.
- 스타일은 mobile은 Tailwind + Design Token, admin·partner는 BEM 순수 CSS(`globals.css`)이다.

**근거**: C9 코딩컨벤션, D8 NFR-MA.

### VIII. 용어·UX 일관성
- 도메인 명칭은 C2의 영문 12개 명칭을 코드·API Path·이벤트·Mock 파일명에서 동일하게 쓰고 임의 축약
  (`ord`, `pmt` 등)을 금지한다. UI는 표준 한글 명칭을 쓰며 "입점사"를 유일한 명칭으로 한다
  (셀러/판매자/파트너 혼용 금지).
- 상태값의 코드·UI 표시 매핑은 C2와 상태머신(DH)을 따른다.
- UI 문구는 C8을 따른다. mobile은 친근한 "~해 주세요/~됐어요", admin·partner는 사무적인
  "~합니다/~됩니다"를 쓰고, 버튼 의미(확인/완료/저장/적용/취소/뒤로/삭제)를 혼용하지 않는다.
- 사용성 NFR을 준수한다. 고객웹 320~428px, 어드민·입점사 1280px 기준(1024px까지 대응),
  WCAG 2.1 AA(주요 흐름), 한국어 단일(메시지 키 분리).
- 미구현 화면도 라우팅은 정상 동작하며 PlaceholderPage를 표시한다. 존재하지 않는 리소스는 NotFound를 표시한다.

**근거**: C2 용어컨벤션, C8 UXWriting컨벤션, C7 디자인시스템, D8 NFR-US.

### IX. Issue → Branch → PR 워크플로우 (NON-NEGOTIABLE)
- 요구사항·스펙·버그는 구현 전에 GitHub 이슈로 등록해야 한다(MUST). 이슈 없이 구현을 시작해서는 안 된다(MUST NOT).
  구현 중 요구사항이 바뀌면 코드보다 이슈를 먼저 갱신한다.
- `main`(`master`)에 직접 커밋·푸시해서는 안 된다(MUST NOT). 모든 작업은 `{type}/{issue-number}-{slug}`
  브랜치(type: feat, fix, docs, refactor, chore)에서 수행한다. 예: `feat/12-product-review-list`.
- 모든 커밋 메시지는 이슈 번호를 참조해야 한다(MUST). 예: `feat: 리뷰 목록 추가 (#12)`.
- 작업 완료 요청은 PR로만 한다(MUST). PR 본문에는 `Closes #{issue-number}`와 PR 템플릿 항목이 있어야 한다.
- PR 머지는 사용자(리뷰어)의 승인 후에만 수행한다. 에이전트가 임의로 머지해서는 안 된다(MUST NOT).
- 강제 수단: `CLAUDE.md`(규칙), `.claude/hooks/workflow-guard.js`(main 커밋·푸시, PR 머지, `Closes #N` 누락 차단),
  `.github/pull_request_template.md` 및 `.github/ISSUE_TEMPLATE/`(양식). 사람의 직접 작업까지 막으려면
  GitHub `main` 브랜치 보호 규칙(PR 필수·리뷰 승인 필수)을 함께 적용한다.

**근거**: 요구사항-구현-검증의 추적성 확보와 `main`의 항상 배포 가능한 상태 유지.

## 기술 스택 및 제약

- **Back-end**: Spring Boot 3.3.x + Kotlin 1.9.x + Java 21, Gradle Kotlin DSL. API 서버는 단일
  Spring Boot 애플리케이션이며 도메인별 패키지로 분리한다.
- **Front-end**: 고객웹은 Next.js 14 + React 18 + Tailwind CSS, 어드민·입점사는 Next.js 15 +
  React 19 + 순수 CSS(BEM). TypeScript 5.4+ strict mode. (버전 불일치는 Sync Impact Report의 TODO 참조)
- **모노레포**: `api/runNshop-api`, `apps/runNshop-{mobile,admin,partner}`, `packages/`(향후), `docs/`.
- **포트**: mobile 3000, admin 3001, partner 3002, api 8080.
- **환경**: local(`.env.local`, Mock) / dev / staging / prod를 독립 구성하고 설정은 환경변수로 외부화한다.
- **외부 연동**: PG 실연동은 Out-of-Scope이며 Mock 처리한다. 택배사·SMS·이메일도 Mock 처리하고 발송 로그만 기록한다.
- **실 프로젝트 전환 시 보안 기준**: JWT(Access 30분/Refresh 14일, HttpOnly Secure Cookie), bcrypt cost ≥ 12,
  RBAC(CUSTOMER/VENDOR/ADMIN/SUPER_ADMIN), 어드민 2FA, TLS 1.2+, 민감정보 AES-256, 감사 로그, Rate Limiting,
  CORS 화이트리스트(`*` 금지), gitleaks·SAST·의존성 스캔.
- **범위**: 12개 도메인 전체 구현이 In-Scope이며 진행 순서는 1차 거래(Order+Payment) → 2차 상품 →
  3차 고객 → 4차 파트너·운영이다.
- **주요 성능 기준(본 구현)**: 상품 목록 p95 ≤ 1초, 주문·결제 p95 ≤ 5초, 검색 p95 ≤ 500ms,
  동시 접속 1,000명, 가용률 ≥ 99.5%.

## 개발 워크플로 및 품질 게이트

- **산출물 우선**: 구현은 `docs/deliverables`의 승인된 산출물(S0 착수 → S1 범위정의 → S2 구조설계 →
  S3 상세설계 → S4 구현 → S5 테스트 → S6 안정화)을 근거로 한다. 산출물과 구현이 충돌하면 산출물을
  먼저 현행화한 뒤 구현한다. 사실관계는 `docs/reference/as-is`가 `working`보다 우선한다.
- **Spec Kit 흐름**: spec → plan → tasks → implement 순서를 따르며, 각 spec/plan은 관련 컨벤션(C1~C9)과
  EARS 요구(REQ-*)·상태머신·이벤트플로우를 참조한다. plan의 Constitution Check는 Core Principles I~IX를 대상으로 한다.
  모든 spec은 대응 GitHub 이슈를 가져야 하며, tasks는 이슈·브랜치·PR 단위로 연결한다(원칙 IX).
- **브랜치**: `{type}/{issue-number}-{slug}` (type: feat, fix, docs, refactor, chore). 원칙 IX를 따른다.
- **ADR**: 기술적 결정과 제약 예외는 ADR에 사유·대안·결과를 기록한다.
- **PR 게이트**: PR은 (1) 원칙 I~IX 준수, (2) 테스트·커버리지·복잡도 기준, (3) Lint/ktlint 통과,
  (4) 시크릿·PII 노출 부재, (5) 계약(Mock 포함) 일치, (6) `Closes #N` 이슈 연결을 검증해야 병합할 수 있다.
- **실 프로젝트 보안 검증**: SAST(PR 시), 의존성 점검(주 1회), Secret Scan(pre-commit),
  인증/인가 우회 테스트(배포 전), 외부 침투 테스트(연 1회).
- **승인선**: PM과 Tech Lead의 공동 승인이 단일 승인선이다.

## Governance

- 본 헌법은 다른 모든 개발 관행에 우선한다. 컨벤션 문서(C1~C9)와 충돌할 경우 본 헌법의 원칙을 먼저
  적용하고, 컨벤션 문서는 개정 절차를 통해 정정한다.
- **개정 절차**: 변경 제안(사유·영향 범위·마이그레이션 계획) → PM & Tech Lead 공동 승인 → 헌법 개정과
  영향받는 산출물(컨벤션·plan/spec/tasks 템플릿 포함) 현행화 → 버전 증가.
- **예외 승인**: 원칙·제약 위반이 불가피하면 ADR에 사유를 기록하고 PM & Tech Lead가 공동 승인하며
  영향받는 산출물을 현행화한다. 승인 없는 위반은 병합할 수 없다. 복잡도 증가는 정당화되어야 한다.
- **버전 정책**(Semantic Versioning): MAJOR는 원칙의 삭제·재정의 등 하위 비호환 변경, MINOR는 원칙·섹션의
  추가 또는 실질적 확장, PATCH는 문구 명확화·오탈자 등 비의미적 수정이다.
- **준수 검토**: 모든 PR·리뷰는 본 헌법 준수를 확인한다. 각 Bolt/파트(1~4차) 종료 시 헌법과 구현의
  정합성을 점검하고, 프로토타입 → 실 프로젝트 전환 시 프로토타입 한정 예외의 해제를 점검한다.
  원칙 IX의 강제 수단(훅·템플릿·브랜치 보호)이 유효한지 함께 점검한다.

**Version**: 1.1.0 | **Ratified**: 2026-10-13 | **Last Amended**: 2026-10-13
