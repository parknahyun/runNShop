# TSK-DPL-001-BE — 전시 페이지 등록 API 구현 (v2, 원천 현행화 반영)

> v1(원본: `docs/x. 하네스/샘플/09-DPL...` 샘플 5) 대비 변경: `source_domain: DOM-CATALOG`가
> 이제 `docs_ai/03-도메인/Catalog-Display.md`에서 정의됨. `source_tech`는 v1이 "TC-001"만
> 인용했는데, TC-ID 체계는 검토 끝에 **도입하지 않기로 결정**했다 — 이 v2는 실제 원본
> (요구사항/정책서/ERD)을 직접 인용한다.

```yaml
task_id: TSK-DPL-001-BE
task_name: 전시 페이지 등록 API 구현
dev_type: BE
domain: Display (Catalog 하위)
app: runNshop-api
decision_type: A

source_api: (⑧ API정의서 미작성 — 화면정의서 44번 API + ERD 기준 신규 도출)
source_screen: ADM-020-007
source_domain: DOM-CATALOG          # ✅ docs_ai/03-도메인/Catalog-Display.md에서 정의됨
source_entity: cat_display_page, cat_display_page_area, cat_display_template
source_policy: POL-DPL-001          # 정책서 3.12 전시 페이지 상태 정책 (원본 그대로 — 이미 정확)
source_tech:                        # [v2] TC-ID 체계 대신 원본 직접 인용
  - "물리적 DELETE 금지: 요구사항 FR-COM-005 / 정책서 §19.1 / ERD 설계원칙(line 35)"
  - "도메인 간 직접 테이블 접근 금지: 도메인정의서 §1 설계원칙 '데이터 소유권' (line 37)"

reference_impl: TSK-DPL-TPL-001-BE
depends_on: [TSK-DPL-TPL-001-BE]    # 템플릿 등록 API 선행 (template_id FK)
cross_module_deps:                   # [v1.1 신규 필드]
  - template_id가 cat_display_template.status='ACTIVE'인지 확인해야 함(HC-DPL-002) — Template
    도메인 조회. 도메인 간 직접 접근 금지 원칙(도메인정의서 §1)에 따라 직접 SQL 조회가 아니라
    Template 도메인 내부 API로 확인
assignee: AI(Kiro)
status: TODO
```

### AI 코딩 지시 (BE)

```
1. DTO:
   CreateDisplayPageRequest(templateId, pageType, pageName, pageUrl, status, displayFrom, displayTo)
   CreateDisplayPageResponse(pageId, pageName, status, createdAt)
   → pageUrl은 UNIQUE (ERD cat_display_page.page_url UNIQUE) — 중복 시 409

2. Repository: DisplayPageRepository
   - INSERT cat_display_page (status 기본값 DRAFT)
   - 템플릿(cat_display_template)의 섹션 구성을 복사하여 cat_display_page_area N건 INSERT
   invariants: page_url UNIQUE, template_id FK 존재해야 함
   state_transition: 초기 상태 DRAFT만 허용 (등록 시 PUBLISHED/SCHEDULED 직접 지정 금지)

3. Service: DisplayPageService.createPage()
   HARD:
     - HC-DPL-001: page_url 중복 등록 금지
     - HC-DPL-002: template_id가 ACTIVE 상태인 템플릿만 선택 가능 (cross_module_deps 참조)
     - HC-DPL-003: displayFrom ≤ displayTo
   SOFT: POL-DPL-001 (전시 페이지 상태 정책 — DRAFT로 시작, 게시는 별도 흐름)

4. Controller: DisplayPageController
   POST /api/admin/v1/display/pages, 어드민 로그인 필수, role=[ADMIN, MD]

5. 예외 처리:
   - {code: PAGE_URL_DUPLICATE, http: 409, condition: "page_url 중복", message_key: "error.display.page_url_duplicate"}
   - {code: TEMPLATE_NOT_ACTIVE, http: 422, condition: "비활성 템플릿 선택", message_key: "error.display.template_not_active"}
   - {code: INVALID_PERIOD, http: 400, condition: "displayTo < displayFrom", message_key: "error.display.invalid_period"}

6. 이벤트: 없음 (등록은 타 도메인에 즉시 영향 없음. 게시 시점에만 캐시 무효화 이벤트 검토)

생성 대상 파일:
  - DisplayPageController.kt / DisplayPageService.kt / DisplayPageRepository.kt
  - CreateDisplayPageRequest.kt / CreateDisplayPageResponse.kt

금지 사항:
  - 등록 API에서 status를 PUBLISHED로 직접 저장 (게시는 별도 승인/전환 흐름)
  - cat_display_page_schedule 관련 로직 포함 (이 Task 범위 아님, 예약 등록 API로 분리)
  - cat_display_template에 직접 SQL 조회 (cross_module_deps 참조 — Template 도메인 API 경유)
```

### 작업결과물 확인 (BE)

```
자동 확인:
  □ Gradle build 성공 / ktlint 오류 없음
  □ 단위 테스트 통과 (정상 등록 / URL 중복 / 비활성 템플릿 / 기간 역전 4케이스)
  □ 커버리지 ≥ 80%

크로스 확인:
  □ HC-DPL-001~003 3건 전체 구현 여부 코드 대조
  □ 등록 시 status가 항상 DRAFT로 저장되는지 확인 (PUBLISHED 직접 저장 경로 없음)
  □ 템플릿 섹션 복사 로직이 cat_display_page_area에 정확히 반영되는지 확인
  □ Catalog 도메인 경계 위반 없음 (타 도메인 테이블 직접 접근 없음 — 도메인정의서 §1)
  □ [v2] source_domain(DOM-CATALOG) 인용이 docs_ai/03-도메인과 실제로 연결되는지 확인

⚠ 미해결 이슈 (ERD:1046-1051에 이미 기록, decision_log 2026-07-06 #1):
  정책서(3.12)·ERD는 2026-07-06 크로스체크로 정합 완료 (7개 상태, cat_display_page_schedule로
  PUBLISHED/SCHEDULED를 별도 행으로 관리하는 2-row 스왑 구조). 그러나 현재 화면 Mock은 여전히
  4종 상태(PUBLISHED/SCHEDULED/DRAFT/DEPRECATED)를 단일 행에 두는 구조라 정책서·ERD와 다름.
  "Mock을 정책서 구조로 전환" vs "정책서를 Mock 수준으로 단순화" 결정 필요 — 결정 전 착수 시
  본개발 단계에서 재작업 위험. 이 Task Spec은 "현재 프로토타입 Mock 기준"으로 작성된 임시 버전이다.
```
