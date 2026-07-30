# AI 활용 개발 공정 프롬프트 라이브러리

**버전: 1.0 (초안)**  
**관련 문서: AI 활용 개발 공정 가이드 5.2 프롬프트 엔지니어링 표준**  
**기준 프로젝트: runNshop (B2C 커머스 플랫폼)**

---

## 개요

본 문서는 AI 활용 개발 공정 가이드 5.2절에 정의된 6가지 프롬프트 구성 요소(역할·컨텍스트·작업·출력형식·제약조건·품질기준)를 공정별로 적용한 샘플 모음입니다.

---

## 활용 규칙

> * 아래 샘플은 구조 참고용이며, 실제 사용 시 [컨텍스트]에 해당 Bolt의 구체적 산출물을 첨부
> * 프로젝트 진행 중 반복 사용되는 프롬프트는 Asset Registry에 등록하여 팀 공유
> * 3회 이상 동일 패턴으로 반려가 발생하면 해당 샘플의 [제약조건] 또는 [품질기준]을 개선하여 버전 갱신
> * 신규 공정 샘플 추가 시 본 문서에 섹션을 추가하고 버전을 올림

---

## 목차

| # | 공정 | 산출물 | 비고 |
|---|------|--------|------|
| 1 | Proposal | 문제 정의서 (BPIO) | Initiative 단위 |
| 2 | Spec | 기능요구사항 (EARS) | Bolt 단위 |
| 3 | Spec | 수용기준 (GWT) | Bolt 단위 |
| 4 | Spec | 인터페이스 명세 | Bolt 단위 |
| 5 | Design | 시퀀스 다이어그램 | Bolt 단위 |
| 6 | Design | ERD (DBML) | Domain 단위 |
| 7 | Tasks | WBS 작업 분해 | Bolt 단위 |
| 8 | Code | 코드 구현 | Bolt 단위 |

---

## 1. Proposal — 문제 정의서 (BPIO)

```
[역할]
당신은 커머스 사업의 시니어 비즈니스 분석가입니다.

[컨텍스트]
- 플랫폼 정책서 v3.6 (첨부)
- 최근 3개월 CS 이슈 로그 (첨부)
- 팀 OKR 문서 (첨부)
- 과거 유사 프로젝트 장애 이력 (리스크 자산)

[작업]
위 자료를 분석하여 "주문 분할배송 미지원으로 인한 CS 증가" 문제에 대한 
문제 정의서를 BPIO(Background-Problem-Impact-Opportunity) 구조로 작성하세요.

[출력형식]
- 4개 섹션: Background / Problem / Impact / Opportunity
- 각 섹션은 2~5문장으로 구성
- Impact는 정량 지표(CS 건수, 비용 등) 포함
- Opportunity는 기대 효과를 측정 가능한 수치로 제시

[제약조건]
- 정책서에 명시된 현행 배송 정책 범위 내에서 문제를 정의
- 해결 방안은 이 단계에서 제시하지 않음 (문제 정의에 집중)
- 용어집 기준 용어 사용

[품질기준]
- 5.1 품질 평가 기준의 완전성·일관성을 우선 충족
- 각 서술에 근거 자료 출처(CS 로그 날짜, 정책서 몇 장) 명시
```

---

## 2. Spec — 기능요구사항 (EARS)

```
[역할]
당신은 B2C 커머스 플랫폼의 시니어 요구사항 분석가입니다.

[컨텍스트]
- 첨부된 화면 프로토타입: "주문취소 화면" (Figma 캡처)
- 용어집: docs_ai/glossary.md
- 정책서 6.3장 "취소·반품 정책"
- 기존 유스케이스 초안: "고객이 배송 전 주문을 취소한다"

[작업]
위 입력자료를 기반으로 "주문취소" Bolt의 기능요구사항을 EARS 패턴으로 작성하세요.

[출력형식]
- EARS 5가지 패턴(Ubiquitous, Event-driven, State-driven, Optional, Unwanted) 중 
  해당하는 패턴을 선택
- 각 요구사항은 "WHEN [트리거], THE [시스템] SHALL [동작]" 형식
- 요구사항 ID: REQ-ORDER-CANCEL-001 ~ 순번

[제약조건]
- 용어집에 정의된 용어만 사용 (신규 용어 발견 시 별도 표기)
- 정책서 6.3장의 취소 불가 조건(배송 시작 후)을 반드시 반영
- 결제 환불 로직은 Payment 도메인 Bolt로 분리 — 이 Bolt에서는 "환불 요청 이벤트 발행"까지만 범위

[품질기준]
- 5.1 품질 평가 기준의 완전성·추적성을 우선 충족
- 각 요구사항에 입력자료 출처(정책서 몇 장, 화면 어느 영역) 명시
```

---

## 3. Spec — 수용기준 (GWT)

```
[역할]
당신은 B2C 커머스 플랫폼의 QA 리드입니다.

[컨텍스트]
- 기능요구사항: REQ-ORDER-CANCEL-001 ~ 005
- 화면 프로토타입: "주문취소 화면"
- 정책서 6.3장 "취소·반품 정책" (취소 불가 조건 포함)
- 상태머신: PAID → CANCEL_REQUESTED → CANCELLED

[작업]
"주문취소" Bolt의 수용기준을 Given-When-Then 형식으로 작성하세요.
정상 시나리오, 경계값 시나리오, 예외 시나리오를 모두 포함합니다.

[출력형식]
- 각 시나리오에 ID 부여: AC-ORDER-CANCEL-001 ~
- 형식:
  Given: [사전 조건]
  When: [사용자 행위 또는 시스템 이벤트]
  Then: [기대 결과]
- 카테고리별 그룹핑: 정상 / 경계값 / 예외

[제약조건]
- 하나의 GWT 시나리오는 하나의 상태 전이만 검증
- 상태머신에 정의되지 않은 전이는 Unwanted 시나리오로 작성
- 정량적 기준이 있는 경우 구체적 수치 명시 (예: "3영업일 이내")

[품질기준]
- 5.1 품질 평가 기준의 완전성·추적성을 우선 충족
- 모든 EARS 요구사항이 최소 1개 이상의 GWT에 매핑
- 각 GWT에 대응하는 요구사항 ID 명시
```

---

## 4. Spec — 인터페이스 명세

```
[역할]
당신은 B2C 커머스 플랫폼의 시니어 API 설계자입니다.

[컨텍스트]
- 기능요구사항: REQ-ORDER-CANCEL-001 ~ 005
- 화면 프로토타입: "주문취소 화면" (입력 필드, 버튼 액션 확인)
- 기존 API 문서: /api/v1/orders 관련 엔드포인트
- API 설계 규칙: .kiro/steering/api-design-rules.md

[작업]
"주문취소" Bolt에 필요한 API 인터페이스 명세를 작성하세요.

[출력형식]
- OpenAPI 3.0 YAML 형식
- 각 엔드포인트별: Method, Path, Summary, Request Body, Response (200/4xx/5xx)
- 공통 응답 구조: { "code": "SUCCESS", "data": { ... } }
- 에러 응답 구조: { "code": "ERROR_CODE", "message": "...", "detail": "..." }

[제약조건]
- Path Prefix 규칙 준수: 고객웹은 /api/v1/**, 어드민은 /api/admin/v1/**
- 기존 API와 네이밍 패턴 일관성 유지 (camelCase 필드명)
- Request/Response에 화면 프로토타입의 모든 입력/표시 항목이 매핑
- 취소 사유 코드는 Enum으로 정의

[품질기준]
- 5.1 품질 평가 기준의 일관성·실행가능성을 우선 충족
- 화면 프로토타입 ↔ API 필드 간 누락 0건
- 기존 API 문서와 네이밍·구조 모순 0건
```

---

## 5. Design — 시퀀스 다이어그램

```
[역할]
당신은 이커머스 도메인의 시니어 시스템 설계자입니다.

[컨텍스트]
- 기능요구사항: REQ-ORDER-CANCEL-001 ~ 005 (Spec 산출물)
- 인터페이스 명세: POST /api/v1/orders/{orderId}/cancel (Spec 산출물)
- ERD: Order 도메인 엔티티 (orders, order_items, order_status_history)
- 상태머신: PAID → CANCEL_REQUESTED → CANCELLED
- 이벤트 플로우: OrderCancelled 이벤트 → Payment 도메인 구독

[작업]
"주문취소" Bolt의 시퀀스 다이어그램을 작성하세요. 
정상 흐름 1개 + 예외 흐름 2개(취소 불가 상태, 환불 실패)를 포함합니다.

[출력형식]
- PlantUML 형식
- 참여자(participant): Customer(모바일), API Gateway, OrderService, 
  OrderRepository, EventBus, PaymentService
- 메시지에 번호 부여 (1, 1.1, 1.2 ...)
- 비동기 이벤트는 점선 화살표(->>)로 표기
- alt/else 블록으로 예외 흐름 분기

[제약조건]
- OrderService 내부에서 상태 전이 검증 후 상태 변경 → 이벤트 발행 순서 준수
- DB 트랜잭션 경계를 note로 표기
- PaymentService 호출은 이벤트 기반(동기 호출 금지) — 이벤트 플로우 산출물과 일치시킬 것
- 화면 프로토타입의 "취소 사유 선택" UI 요소를 API 파라미터로 반영

[품질기준]
- 5.1 품질 평가 기준의 일관성·실행가능성을 우선 충족
- ERD의 컬럼명과 시퀀스 내 데이터 필드명이 불일치하면 안 됨
- 인터페이스 명세의 Request/Response와 시퀀스 메시지가 1:1 대응
```

---

## 6. Design — ERD (DBML)

```
[역할]
당신은 B2C 커머스 플랫폼의 데이터 모델링 전문가입니다.

[컨텍스트]
- 화면정의서: Order 도메인 관련 화면 목록 (주문목록, 주문상세, 주문취소)
- 용어집: docs_ai/glossary.md
- 기능요구사항: Order 도메인 전체 EARS (REQ-ORDER-*)
- 상태머신: 주문 상태 전이 다이어그램
- 기존 스키마: (없음 — 신규 설계)

[작업]
Order 도메인의 ERD를 DBML 형식으로 작성하세요.

[출력형식]
- DBML 형식 (dbdiagram.io 호환)
- 각 테이블: 테이블명, 컬럼(타입, nullable, default), PK/FK, 인덱스
- 테이블 간 관계: 1:N, N:M 표기
- 각 테이블 상단에 // 주석으로 대응하는 유스케이스/화면 명시

[제약조건]
- 용어집의 한글 용어와 영문 컬럼명 매핑표를 ERD 하단에 포함
- 상태 컬럼은 상태머신의 상태값을 ENUM으로 정의
- soft delete(deleted_at) 패턴 적용
- 감사(audit) 컬럼: created_at, created_by, updated_at, updated_by 필수 포함
- 개인정보 컬럼은 // PII 주석 표기

[품질기준]
- 5.1 품질 평가 기준의 완전성·일관성을 우선 충족
- 화면에 표시되는 모든 데이터가 ERD 컬럼에 매핑 가능
- 상태머신의 모든 상태가 ENUM 값에 포함
```

---

## 7. Tasks — WBS 작업 분해

```
[역할]
당신은 애자일 프로젝트의 시니어 테크리드입니다.

[컨텍스트]
- Design 산출물 전체: 시퀀스, ERD, 클래스 설계, 인터페이스 명세 ("주문취소" Bolt)
- DoD 템플릿: docs_ai/task-spec-standard.md
- 의존성 맵: Order 도메인 Bolt 간 선후관계
- 팀 구성: FE 1명, BE 1명 (AI 활용)

[작업]
"주문취소" Bolt의 WBS를 Epic > Story > Task 수준으로 분해하고, 
각 Task의 예상 소요 시간을 산정하세요.

[출력형식]
- 계층 구조: Epic → Story → Task
- 각 Task: ID, 제목, 담당(FE/BE), 예상시간, 선행 Task ID, DoD 체크 항목
- 형식: 마크다운 테이블
- 전체 합산 시간 표기

[제약조건]
- 한 Task는 최대 4시간(반나절)을 초과하지 않음
- FE/BE 작업이 병렬 진행 가능한 경우 명시
- API Mock 작성 Task를 FE Task 앞에 배치 (FE 블로킹 방지)
- 단위 테스트 Task를 구현 Task 바로 다음에 배치

[품질기준]
- 5.1 품질 평가 기준의 실행가능성·추적성을 우선 충족
- 모든 Task가 Design 산출물의 특정 요소(시퀀스 메시지, ERD 테이블, 클래스 메서드)에 매핑
- 의존성 맵과 선행 Task ID가 모순 없음
```

---

## 8. Code — 코드 구현

```
[역할]
당신은 Kotlin/Spring Boot 기반 커머스 백엔드 시니어 개발자입니다.

[컨텍스트]
- 클래스 설계: OrderCancelService, OrderCancelController (Design 산출물)
- 인터페이스 명세: POST /api/v1/orders/{orderId}/cancel
- ERD: orders, order_items, order_status_history
- 시퀀스: 주문취소 정상 흐름 + 예외 흐름
- 코딩 컨벤션: .kiro/steering/coding-standards.md
- Mock 데이터 규칙: .kiro/steering/mock-data-rules.md
- 기존 API 스펙 샘플: api/runNshop-api/src/main/resources/mock/

[작업]
"주문취소" Bolt의 백엔드 코드를 구현하세요.
- Controller: OrderCancelController
- Service: OrderCancelService
- Mock JSON: order__POST_orders_{orderId}_cancel.json

[출력형식]
- Kotlin 소스 파일 (패키지: com.runnshop.order.cancel)
- Controller → Service → MockLoader 구조
- Mock JSON 파일은 표준 응답 구조 { "code": "SUCCESS", "data": {...} }

[제약조건]
- 프로토타입 단계: 실제 DB 연동 없이 MockLoader로 JSON 반환
- 상태 전이 검증 로직은 Service에 구현 (비즈니스 로직 분리)
- API Path Prefix 규칙 준수 (/api/v1/**)
- 에러 응답도 Mock으로 처리 (취소 불가 상태일 때 4xx 응답)
- 시퀀스 다이어그램의 메시지 순서와 코드 호출 순서 일치

[품질기준]
- 5.1 품질 평가 기준의 정책 준수·실행가능성을 우선 충족
- 컴파일 성공, Lint 통과
- 인터페이스 명세의 Request/Response와 실제 DTO 클래스 필드 1:1 대응
- Mock JSON의 필드가 ERD 컬럼과 일관
```

---

## 부록: 프롬프트 구성 요소 Quick Reference

| 구성 요소 | 핵심 질문 | 빠짐없이 포함할 것 |
|-----------|-----------|-------------------|
| 역할(Role) | AI가 누구인가? | 도메인 + 시니어 레벨 + 전문 분야 |
| 컨텍스트(Context) | 무엇을 참고하는가? | 첨부 파일 목록, 이전 산출물 ID |
| 작업(Task) | 무엇을 만드는가? | 산출물명 + Bolt/Domain 범위 |
| 출력형식(Format) | 어떤 모양인가? | 형식(PlantUML, DBML, YAML 등) + 구조 |
| 제약조건(Constraints) | 하면 안 되는 것은? | 도메인 경계, 정책 위반 금지 사항 |
| 품질기준(Quality) | 얼마나 좋아야 하는가? | 5.1 기준 중 우선 항목 + 구체적 0건 조건 |

---

## 변경 이력

v1.0 (2026-07-23): 초판 작성 — 8개 공정별 샘플(Proposal BPIO, Spec EARS/GWT/인터페이스, Design 시퀀스/ERD, Tasks WBS, Code 구현)
