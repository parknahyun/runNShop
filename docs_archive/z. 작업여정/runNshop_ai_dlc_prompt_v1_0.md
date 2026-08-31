# runNshop AI-DLC 전제 조건 프롬프트

> 작성 주체: 3TOP 2본부  
> 문서 버전: v1.0  
> 작성일: 2026.06.25  
> 목적: 다음 프로젝트 또는 신규 세션 시작 시 AI 에이전트에게 전달하는 전제 조건

---

## Part 1. 기본 설정 프롬프트 (세션 시작 시 입력)

```
당신은 3TOP의 runNshop 러닝 전문 e커머스 플랫폼 설계 및 개발을 지원하는
AI 에이전트입니다. 아래 전제 조건을 숙지하고 모든 작업에 적용하세요.

─────────────────────────────────────────────
[프로젝트 기본 정보]
─────────────────────────────────────────────
- 프로젝트명: runNshop
- 회사: 3TOP
- 플랫폼: 러닝 전문 e커머스 (오픈마켓 + 직매입 혼합)
- 프레임워크: AI-DLC 9대 공정
- 현재 단계: v1.0 기본 설계 완료 → API 명세 ~ 오픈 단계

─────────────────────────────────────────────
[기술 스택]
─────────────────────────────────────────────
- Backend: Spring Boot + Kotlin
- Frontend: React + Next.js
- DB: PostgreSQL + MyBatis
- Cache: Redis
- Search: Elasticsearch
- File: AWS S3
- Event: Outbox Pattern (→ Kafka MSA 전환 예정)
- Deploy: Docker Compose (1단계) → Kubernetes (2단계)
- Monitoring: Prometheus + Grafana
- CI/CD: Harness.io (CI·CD·Test Intelligence·Feature Flag)

─────────────────────────────────────────────
[3개 애플리케이션]
─────────────────────────────────────────────
- 고객 웹: www.runNshop.com (모바일 360px) / /api/v1/
- 플랫폼 어드민: admin.runNshop.com (PC) / /api/admin/v1/
- 입점사 BO: partners.runNshop.com (PC) / /api/partner/v1/

─────────────────────────────────────────────
[아키텍처]
─────────────────────────────────────────────
- Modular Monolith (12개 Bounded Context)
- Order·Catalog·Member·Payment·Promotion·Settlement
- Vendor·Notification·Community·Search·Config·Audit
- 107개 DB 테이블 + 5개 복제 테이블
- Order가 오케스트레이터 역할

─────────────────────────────────────────────
[핵심 정책 요약]
─────────────────────────────────────────────
- 주문 상태: TEMP→PROCESSING→PAYMENT_COMPLETED→PREPARING
  →IN_DELIVERY→DELIVERED→CONFIRMED
  클레임: RETURN_REQUESTED·RETURNING·RETURN_WITHDRAWN·RETURNED
          EXCHANGE_REQUESTED·EXCHANGING·EXCHANGE_WITHDRAWN·EXCHANGED
- 재고 선점: PG 인증 완료 후 PG 결제 요청 시 (Redis TTL 30분)
- 할인 순서: 행사가→수량할인→쿠폰→장바구니할인→포인트
- 회원 등급: New(0.5%)·Runner(1.0%)·Pacer(1.5%)·Elite(2.0%) 포인트 적립
- 정산: 익월5일 확정·익월15일 지급 / 직매입 제외
- 배송: 출고 1영업일 이내 / 구매확정 7일 자동
- 클레임: 취소(PREPARING 이전)·반품·교환(배송완료 10일 이내)
- SNS: 네이버·Apple (1단계)
- 입점사 인증: 2FA 필수·세션 3시간·동시 2세션

─────────────────────────────────────────────
[산출물 참조 파일 (v1.0)]
─────────────────────────────────────────────
- 정책서: runNshop_policy_v1_0.md
- Bounded Context: runNshop_bounded_context_v1_0.md
- Modular Monolith: runNshop_modular_monolith_v1_0.md
- ERD: runNshop_erd_v1_0.md
- 이벤트 흐름: runNshop_event_flow_v1_0.mmd
- 업무 프로세스: runNshop_business_process_v1_0.md
- 화면 정의서: runNshop_screen_definition_v1_0.md
- 요구사항 정의서: runNshop_requirements_v1_0.md

─────────────────────────────────────────────
[작업 규칙]
─────────────────────────────────────────────
1. 모든 산출물은 위 v1.0 기준 문서와 정합성을 유지할 것
2. 신규 결정 사항은 반드시 관련 문서에 동시 반영할 것
3. 불일치 발견 시 즉시 보고하고 확정 방향을 요청할 것
4. 상태값·API URL·테이블명은 기존 정의를 준수할 것
5. 물리적 DELETE 금지 (소프트 삭제만 허용)
6. 파일명 규칙: runNshop_{산출물명}_v{x}_{y}.{확장자}
```

---

## Part 2. 단계별 작업 프롬프트

### 2.1 API 명세 작성 시작 프롬프트

```
[API 명세 작성 전제 조건]

형식: Markdown 상세 명세 (필드명·타입·필수여부·설명·예시값)
범위: 도메인별 순서로 진행
작성 단위: 1개 API당 다음 항목 포함
    - API명·Method·URL
    - Path/Query/Body Parameter
    - Response (성공·실패)
    - 오류 코드

작성 순서 (도메인별 우선순위):
    1순위: Auth·Member (인증·회원)
    2순위: Catalog·Promotion (상품·프로모션)
    3순위: Order·Payment (주문·결제)
    4순위: Claim·Settlement (클레임·정산)
    5순위: Vendor·Notification (입점사·알림)
    6순위: Community·Search·Config·Audit

공통 규칙:
    - 인증: Authorization: Bearer {token}
    - 페이징: page·size·sort 파라미터 표준화
    - 응답 래퍼: { code, message, data }
    - 오류 코드: ERR_{DOMAIN}_{001} 형식
    - 날짜: ISO 8601 (yyyy-MM-dd'T'HH:mm:ss)
```

---

### 2.2 코드 구현 시작 프롬프트 (Kiro용)

```
[코드 구현 전제 조건]

구현 순서 (의존성 기준):
    1단계: Config·Common (권한·코드·Outbox·공통)
    2단계: Vendor·Catalog·Member (기초 도메인)
    3단계: Order·Payment (핵심 거래)
    4단계: Promotion·Settlement (혜택·정산)
    5단계: Notification·Community·Search·Audit (운영)

구현 규칙:
    - 언어: Kotlin
    - 패키지: com.top3.running.module.{domain}
    - 레이어: api → application → domain → infrastructure
    - 도메인 간 통신: PublicApi Interface만 허용
    - DB 접근: MyBatis Mapper
    - 이벤트: Outbox Pattern
    - 테스트: 단위 테스트 필수·통합 테스트 권장

파일 생성 규칙:
    - Controller: {Domain}Controller.kt
    - Service: {Domain}Service.kt
    - PublicApi: {Domain}PublicApi.kt
    - Mapper: {Domain}Mapper.kt
    - Batch: {Domain}Batch.kt

Steering 파일 위치: .kiro/steering.md

Harness 파이프라인:
    - develop 머지 → dev 자동 배포
    - main 머지 → staging 자동 배포
    - prod 배포 → 수동 승인 후 Canary 진행
    - 에러율 5% 초과 → 자동 롤백
    - 결제 실패율 2% 초과 → 즉시 자동 롤백

Feature Flag (Harness FF SDK):
    - P2·P3 기능 점진적 오픈
    - 등급별 순차 오픈 (Elite → Pacer → Runner → New)
```

---

### 2.3 테스트 프롬프트 (Harness Test Intelligence 기반)

```
[테스트 전제 조건]

테스트 실행 주체: Harness Test Intelligence (TI)
    - 변경 코드 영향 범위 자동 분석
    - 영향받는 테스트만 선별 실행 (시간 40~80% 절감)
    - 실패 원인 자동 분류·리포트

테스트 레이어:
    - 단위 테스트: JUnit 5 + MockK (서비스 레이어)
    - 통합 테스트: TestContainers + PostgreSQL·Redis·ES
    - API 테스트: RestAssured (도메인별 주요 시나리오)
    - E2E 테스트: Playwright (업무 프로세스 12개 기반)

커버리지 기준:
    - 단위 테스트: 80% 이상 (배포 블로킹)
    - 통합 테스트: 핵심 도메인 100% (Order·Payment·Settlement)

E2E 시나리오 우선순위:
    P1 (배포 블로킹)
        1. 회원가입 → 로그인 → 주문 → 결제 → 구매확정
        2. 장바구니 → 쿠폰 → 결제 실패 → 보상 처리
        3. 주문 취소 → 재고 복구 → 환불
    P2 (경고)
        4. 반품 신청 → 수거 → 귀책 판단 → 환불
        5. 교환 신청 → 철회 → 복귀
        6. 정산 계산 → 이의제기 → 수용
    P3 (모니터링)
        7. 입점사 심사 → 온보딩 → 상품 등록
        8. 회원 등급 산정 → 쿠폰 지급

Kiro 역할:
    - 단위 테스트 코드 자동 생성
    - 통합 테스트 코드 자동 생성
    Harness가 실행·관리·리포트 담당
```

---

## Part 3. 팀 구성 기반 역할 분담 프롬프트

### 3.1 팀 구조 (제안)

```
[팀 구성 및 AI 에이전트 역할]

역할별 담당 및 AI 활용 방식:

┌─────────────────────────────────────────────┐
│ 페페 (Tech Lead·PO)                          │
│  → 전체 방향·의사결정·최종 승인              │
│  → AI: 기술 검토·의사결정 지원              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Backend 개발자 (2~3명)                       │
│  → Spring Boot·Kotlin 구현                  │
│  → AI(Kiro): 도메인별 코드 생성·리뷰        │
│  → 참조: ERD·BC·Modular Monolith·API 명세   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Frontend 개발자 (1~2명)                      │
│  → React·Next.js 구현                       │
│  → AI(Kiro): 화면 컴포넌트 생성·리뷰        │
│  → 참조: 화면 정의서·와이어프레임·API 명세  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ QA 담당 (1명)                                │
│  → 테스트 설계·실행·버그 관리               │
│  → AI: 테스트 케이스 생성·자동화 스크립트   │
│  → 참조: 요구사항 정의서·업무 프로세스      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ DevOps (1명, 파트타임 가능)                  │
│  → Harness 파이프라인 설정·관리             │
│  → Docker·Kubernetes·AWS 설정              │
│  → AI: 인프라 코드 생성·검토                │
│  → 참조: Modular Monolith·배포 전략         │
└─────────────────────────────────────────────┘
```

### 3.2 팀원별 AI 에이전트 프롬프트 전달 규칙

```
[신규 팀원 AI 세션 시작 시 전달 파일]

공통 (전원):
    - runNshop_ai_dlc_prompt_v1_0.md (본 문서)
    - runNshop_requirements_v1_0.md

Backend 개발자:
    + runNshop_bounded_context_v1_0.md
    + runNshop_erd_v1_0.md
    + runNshop_modular_monolith_v1_0.md
    + runNshop_event_flow_v1_0.mmd
    + API 명세서 (작성 완료 후)

Frontend 개발자:
    + runNshop_screen_definition_v1_0.md
    + runNshop_wireframe_v1_0.html
    + API 명세서 (작성 완료 후)

QA:
    + runNshop_business_process_v1_0.md
    + runNshop_requirements_qa_v1_0.md

전달 방법:
    파일 업로드 or 텍스트 복사·붙여넣기 후
    "위 문서를 기반으로 작업합니다" 입력
```

---

## Part 3-1. 도구 체계

```
역할별 도구 분담

Claude ────── 설계·명세·문서화·크로스체크
Kiro ──────── 코드 생성·테스트 코드 생성
GitHub ─────── PR·코드 리뷰·형상관리
Harness ────── 테스트 실행·빌드·배포·Feature Flag
Prometheus ─── 운영 모니터링·알림

전체 흐름
    Claude(명세) → Kiro(구현) → GitHub(PR)
    → Harness TI(테스트) → Harness CI(빌드)
    → Harness CD(배포) → Prometheus(모니터링)
```

### Harness 파이프라인 전체 구조

```
[브랜치 전략]
    feature/* → develop → staging → main → prod

[파이프라인별 트리거]
    develop 머지
        → Harness TI: 영향 테스트 선별 실행
        → 단위·통합·API 테스트
        → Docker 빌드 → ECR 푸시
        → dev 서버 자동 배포

    staging 머지
        → 전체 테스트 실행 (E2E 포함)
        → staging 자동 배포
        → QA 검증

    main 머지 (prod 배포)
        → 수동 승인 (페페 최종 확인)
        → Canary 배포 (5%→25%→50%→100%)
        → Prometheus 모니터링 연동
        → 이상 감지 시 자동 롤백 기준
            에러율 5% 초과
            결제 실패율 2% 초과
            P99 응답시간 5초 초과

[Feature Flag]
    SDK: Harness FF SDK (Kotlin·React)
    활용 시나리오
        → P2·P3 기능 단계적 오픈
        → 등급별 순차 오픈 (Elite→Pacer→Runner→New)
        → AI 코치 베타 서비스
        → 2단계 결제 수단 (카카오페이·네이버페이·토스)
```

---

## Part 4. 개선점 적용 체크리스트

이번 프로젝트에서 도출한 10개 개선점을 다음 프로젝트에 적용하기 위한 체크리스트.

### 착수 시 확정 항목

```
□ 1. 산출물 순서 확정
      정책 → 요구사항 초안 → 도메인·ERD → 업무 프로세스
      → 화면·API → 크로스체크 → 요구사항 최종

□ 2. 다이어그램 도구 사전 확정
      □ Mermaid (텍스트 기반·직접 편집 가능)
      □ draw.io (GUI 기반)
      □ 기타: ____

□ 3. 레인 배치 기준 명문화
      고객 레인: UI 직접 입력·선택·확인 행위
      시스템 레인: 서버·DB·외부 API 처리
      Notification 레인: 외부 발송 처리

□ 4. 파일명·버전 규칙 확정
      {프로젝트}_{산출물}_v{x}_{y}.{확장자}
```

### 설계 진행 중 체크 항목

```
□ 5. 정책 수치 조기 확정 체크리스트
      □ 등급별 혜택 수치 (배송·적립률·쿠폰)
      □ 타임아웃 값 (세션·토큰·선점)
      □ 제한 수치 (재시도·실패횟수·최대개수)
      □ 기간 기준 (유효기간·보존기간·산정주기)

□ 6. 상태값 완전성 체크리스트
      □ 정상 흐름의 모든 상태
      □ 예외 흐름 상태 (철회·보류·오류)
      □ 배치 처리 상태 (자동 전환)

□ 7. 미확정 항목 레지스터 운영
      항목명 | 현재 상태 | 결정 기한 | 담당자
      즉시 파악·단계별 해소
```

### 산출물 완료 시 체크 항목

```
□ 8. 크로스체크 공정 편입
      □ 정책서 ↔ 프로세스
      □ 프로세스 ↔ BC
      □ 3문서 동시 (정책·BC·프로세스)
      □ Monolith ↔ Event Flow
      □ ERD ↔ 전체 산출물

□ 9. 테이블 목록 실시간 관리
      테이블 추가 시 즉시 목록 갱신
      번호·도메인·비고 동시 업데이트

□ 10. 세션 종료 시 핵심 확정사항 저장
       확정 항목 요약 → 다음 세션 첫 입력으로 활용
```

---

## Part 5. 다음 세션 시작 템플릿

```
[다음 세션 시작 시 복사·붙여넣기 템플릿]

안녕하세요. runNshop 프로젝트를 이어서 진행합니다.

[이전 세션 완료 산출물]
- 정책서 v1.0, BC v1.0, Modular Monolith v1.0
- ERD v1.0 (107테이블), 이벤트 흐름 v1.0
- 화면 정의서 v1.0 (158화면·470 API)
- 업무 프로세스 v1.0 (12개 프로세스)
- 요구사항 정의서 v1.0 (62개)

[이전 세션 미확정 항목]
- (해당 항목 기재)

[이번 세션 목표]
- (목표 기재 예: API 명세 작성 - Auth·Member 도메인)

[작업 규칙 재확인]
- v1.0 산출물과 정합성 유지
- 변경 시 관련 문서 동시 반영
- 불일치 발견 시 즉시 보고
```

---

*Confidential | 3TOP | AI-DLC 전제 조건 프롬프트 v1.0 | 2026.06.25*
