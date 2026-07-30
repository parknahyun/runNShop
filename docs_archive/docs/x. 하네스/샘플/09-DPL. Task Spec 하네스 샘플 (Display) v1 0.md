# ⑨ Task Spec(작업지시서) — Harness 샘플 (Display 도메인)

> 어드민 전시(Display) 도메인 — **섹션종류 관리 → 템플릿 관리 → 페이지 관리** 전체 체인 예시.
> 실구현 착수 순서 원칙(BE 먼저 → FE는 완성된 API에 연결, Batch는 해당 도메인 BE 확정 후 병행 가능)에
> 맞춰 **의존관계 순서대로** 번호를 매겼다. FE 3종은 실제 구현된 코드를 역으로 문서화한 것이고,
> BE·BATCH는 화면정의서·ERD·Bounded Context에 이미 있는 설계를 Task Spec으로 재배열한 것이다.

```
빌드 순서 (依存)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
①SEC-BE ──┬──▶ ②SEC-FE
          │
          └──▶ ③TPL-BE ──┬──▶ ④TPL-FE (①②③ 모두 필요)
                          │
                          └──▶ ⑤PAGE-BE ──┬──▶ ⑥PAGE-FE (③④⑤ 모두 필요)
                                          │
                                          └──▶ ⑦PAGE-BATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 샘플 1. TSK-DPL-SEC-001-BE — 섹션종류 관리 API

```yaml
task_id: TSK-DPL-SEC-001-BE
task_name: 섹션종류 관리 API 구현 (마스터 CRUD + 필드 스키마)
dev_type: BE
domain: Display (Catalog 하위)
app: runNshop-api
decision_type: A                    # 표준 — 섹션종류 정의는 운영 설정 성격

source_screen: ADM-020-010          # ⑤ 섹션종류 관리
source_domain: DOM-CATALOG
source_entity: cat_display_section_type, cat_display_section_field   # ⑥ 2026-07-06 ERD 신규 반영
source_policy: (해당 정책 없음 — 운영 설정 화면)

reference_impl: 없음 — 전시 도메인 체인의 시작점, 이후 템플릿·페이지 BE의 참고 대상
depends_on: []
assignee: AI(Kiro)
status: TODO
```

### AI 코딩 지시 (BE)

```
1. DTO:
   CreateSectionTypeRequest(sectionCode, sectionName, type, description, previewColor,
     sortOrder, itemCount, layoutType)
   UpdateSectionTypeRequest(sectionName, description, previewColor, sortOrder, itemCount,
     layoutType, status)              # sectionCode는 수정 불가
   SaveFieldsRequest(fields: FieldDefinition[])
   FieldDefinition(fieldKey, label, fieldType, required, defaultValue, placeholder)

2. Repository: SectionTypeRepository
   - INSERT/UPDATE cat_display_section_type (신규 테이블, 잠정명)
   - INSERT/UPDATE cat_display_section_field (신규 테이블, section_type_id FK, 잠정명)
   invariants: sectionCode UNIQUE, 섹션종류 내 fieldKey UNIQUE

3. Service: SectionTypeService
   HARD:
     - HC-DPL-SEC-001: sectionCode는 등록 후 수정 불가
     - HC-DPL-SEC-002: fieldKey는 필드 등록 후 수정 불가 (AddFieldModal 스펙 그대로)
     - HC-DPL-SEC-003: 물리적 DELETE 금지 (TC-001) — 삭제 요청은 status=DEPRECATED 전환
     - HC-DPL-SEC-004: 템플릿에서 사용 중인 섹션종류를 DEPRECATED 전환 시 409 응답
       (사용 여부는 TSK-DPL-TPL-001-BE의 템플릿 영역 테이블 조회로 판단, force=true 파라미터로만 강제 허용)

4. Controller: SectionTypeController
   GET    /api/admin/v1/display/section-types                     (목록, 필터: keyword/status)
   POST   /api/admin/v1/display/section-types                     (등록)
   PUT    /api/admin/v1/display/section-types/{sectionCode}       (기본정보 수정)
   PUT    /api/admin/v1/display/section-types/{sectionCode}/fields (필드 일괄 저장)
   DELETE /api/admin/v1/display/section-types/{sectionCode}       (DEPRECATED 전환)
   어드민 로그인 필수, role=[ADMIN, MD]

5. 예외 처리:
   - {code: SECTION_CODE_DUPLICATE, http: 409, condition: "sectionCode 중복", message_key: "error.display.section_code_duplicate"}
   - {code: FIELD_KEY_DUPLICATE, http: 422, condition: "동일 섹션종류 내 fieldKey 중복", message_key: "error.display.field_key_duplicate"}
   - {code: SECTION_TYPE_IN_USE, http: 409, condition: "사용 중인 섹션종류 DEPRECATED 시도, force=false", message_key: "error.display.section_type_in_use"}

6. 이벤트: 없음

생성 대상 파일:
  - SectionTypeController.kt / SectionTypeService.kt / SectionTypeRepository.kt
  - CreateSectionTypeRequest.kt / UpdateSectionTypeRequest.kt / SaveFieldsRequest.kt

금지 사항:
  - sectionCode / fieldKey를 UPDATE 쿼리 대상 컬럼에 포함
  - DELETE 물리 삭제 쿼리 작성
```

### 작업결과물 확인 (BE)

```
자동 확인:
  □ Gradle build 성공 / ktlint 오류 없음
  □ 단위 테스트 통과 (등록 / sectionCode 중복 / fieldKey 중복 / 사용중 DEPRECATED 시도 4케이스 이상)
  □ 커버리지 ≥ 80%

크로스 확인:
  □ sectionCode·fieldKey immutable 여부 코드 대조
  □ 물리 삭제 쿼리 없음 확인 (TC-001)
  □ 필드 일괄 저장이 "기존 필드 전체 교체"로 동작하는지 확인
    (FieldsTab.spec.md: "로컬 state 기반 CRUD, 최종 저장 시 API 일괄 전송"과 일치해야 함)

✅ 설계 확정 완료 (2026-07-06):
  cat_display_section_type / cat_display_section_field 테이블을 ERD에 신규 반영함
  (decision_log 2026-07-06 참조). 착수 가능.
```

---

## 샘플 2. TSK-ADM-020-010-FE — 섹션종류 관리 화면

```yaml
task_id: TSK-ADM-020-010-FE
task_name: 섹션종류 관리 화면 구현
dev_type: FE
domain: Display (Catalog 하위)
app: runNshop-admin
decision_type: A

source_api: TSK-DPL-SEC-001-BE 참조 (⑧ API정의서 미작성)
source_screen: ADM-020-010          # ⑤ 섹션종류 관리 (6개 스펙 파일)

reference_impl: 없음 — InnerTabs 상세(등록/상세 공용) 패턴의 최초 도입 화면.
                이후 템플릿 상세(④)가 이 패턴을 그대로 재사용
depends_on: [TSK-DPL-SEC-001-BE]
assignee: AI(Kiro)
status: DONE                        # 이미 구현됨 — 프로토타입 Mock 기준 역작성 샘플
```

### AI 코딩 지시 (FE)

```
1. 목록: FilterBar(키워드/상태) + 요약카드(전체/활성/비활성)
   + Table(타입코드/라벨/대분류/프리뷰 색상칩/상태/필드수/최종수정)

2. reference_impl 없음 → InnerTabs 상세 구조 신규 설계
   ("상세/등록: 동일한 InnerTabs 구조" — SectionTypePage.spec.md 명시)

3. API 연동:
   GET    /api/admin/v1/display/section-types
   POST   /api/admin/v1/display/section-types
   PUT    /api/admin/v1/display/section-types/{sectionCode}
   PUT    /api/admin/v1/display/section-types/{sectionCode}/fields
   DELETE /api/admin/v1/display/section-types/{sectionCode}

4. 상세/등록 모달: 기본정보 탭 + 필드관리 탭 (InnerTabs)
   필드관리 탭: 추가/편집/삭제/순서변경(↑↓)은 전부 로컬 state에서만 처리,
   "저장" 클릭 시에만 PUT .../fields 1회 호출 (필드별 즉시 API 호출 금지)

5. AddFieldModal: 필드 키(등록 후 불변) + 라벨 + 타입(11종: 이미지/상품/텍스트/링크/색상/숫자/
   날짜시간/노출선택/이미지배열/상품배열/텍스트배열) + 필수·선택 + 기본값(타입별 UI 분기) +
   플레이스홀더(텍스트 타입만 노출)

6. 유효성 검증: sectionCode 필수, fieldKey camelCase 형식

생성 대상 파일:
  - section/SectionTypePage.tsx (목록)
  - section/SectionTypeDetail.tsx (상세)
  - section/AddSectionTypeModal.tsx (등록)
  - section/mockData.ts
  - section/tabs/BasicInfoTab.tsx / FieldsTab.tsx / AddFieldModal.tsx

금지 사항:
  - fieldKey를 편집 모드에서 입력 가능하게 구현 (스펙상 명시적 불변)
  - 필드 추가/삭제를 즉시 API 호출로 구현 (스펙: 로컬 state 후 일괄 저장)
```

### 작업결과물 확인 (FE)

```
자동 확인:
  □ tsc 오류 없음 / next build 성공

수동 시나리오 확인:
  □ 섹션종류 등록 → 필드 3~4개 추가 → 저장 → 목록 fieldCount 반영 확인
  □ 필드 편집 시 필드 키 입력란이 비활성화(readonly)되는지 확인
  □ 필드 순서 변경(↑↓) 후 저장 시 sortOrder 반영 확인
  □ DEPRECATED 상태 섹션종류가 목록에서 배지로 구분 표시되는지 확인

설계 정합성 확인:
  □ ADM-020-010 화면정의서(6개 스펙 파일) 필드 누락 없음
```

---

## 샘플 3. TSK-DPL-TPL-001-BE — 전시 템플릿 관리 API

```yaml
task_id: TSK-DPL-TPL-001-BE
task_name: 전시 템플릿 관리 API 구현
dev_type: BE
domain: Display (Catalog 하위)
app: runNshop-api
decision_type: A

source_api: (⑧ API정의서 미작성 — 화면정의서 52~55번 API 기준)
source_screen: ADM-020-008
source_domain: DOM-CATALOG
source_entity: cat_display_template, cat_display_area

reference_impl: TSK-DPL-SEC-001-BE (Controller/Service/Repository 3계층 패턴 동일 적용)
depends_on: [TSK-DPL-SEC-001-BE]     # 영역의 sectionType이 섹션종류 sectionCode를 참조
assignee: AI(Kiro)
status: TODO
```

### AI 코딩 지시 (BE)

```
1. DTO:
   CreateTemplateRequest(templateName, templateType, description, sections: TemplateAreaInput[])
   TemplateAreaInput(sectionName, sectionType, sortOrder)
   UpdateTemplateRequest(templateName, description, status, sections: TemplateAreaInput[])
     → sections는 전체 교체(replace) 방식 ("수정 제약 없음, 복사 방식이므로 자유 편집" — 스펙 명시)

2. Repository: DisplayTemplateRepository
   - INSERT/UPDATE cat_display_template
   - 저장 시 cat_display_area 전체 DELETE 후 재INSERT (diff 아님, 전체 교체)
   invariants: template_code UNIQUE, (template_id, area_code) UNIQUE (uk_template_area)

3. Service: DisplayTemplateService
   HARD:
     - HC-DPL-TPL-001: sections[].sectionType은 존재하는 섹션종류(sectionCode)만 허용
       (TSK-DPL-SEC-001-BE 조회로 존재 여부 검증)
     - HC-DPL-TPL-002: usedPageCount > 0 && status='ACTIVE'인 템플릿은 기본정보·영역 수정(PUT)과
       삭제(DELETE) 모두 금지 — 삭제만이 아니라 수정 자체를 막는다 (decision_log 2026-06-30,
       "운영 안정성 확보" 목적). 상태를 INACTIVE로 먼저 전환해야 수정 가능
     - TC-001: 물리적 DELETE 금지 → 삭제 요청은 status=DEPRECATED 전환

4. Controller: DisplayTemplateController
   GET    /api/admin/v1/display/templates
   POST   /api/admin/v1/display/templates
   PUT    /api/admin/v1/display/templates/{id}
   DELETE /api/admin/v1/display/templates/{id}
   어드민 로그인 필수, role=[ADMIN, MD]

5. 예외 처리:
   - {code: SECTION_TYPE_NOT_FOUND, http: 422, condition: "존재하지 않는 sectionType 참조", message_key: "error.display.section_type_not_found"}
   - {code: TEMPLATE_IN_USE, http: 409, condition: "usedPageCount>0 && status=ACTIVE 템플릿 수정/삭제 시도", message_key: "error.display.template_in_use"}
   - {code: TEMPLATE_NAME_DUPLICATE, http: 409, condition: "templateName 중복", message_key: "error.display.template_name_duplicate"}

6. 이벤트: 없음 (페이지는 템플릿을 "복사"하므로 템플릿 변경이 기존 페이지에 전파되지 않음 — TemplatePage.spec.md 명시)

생성 대상 파일:
  - DisplayTemplateController.kt / DisplayTemplateService.kt / DisplayTemplateRepository.kt
  - CreateTemplateRequest.kt / UpdateTemplateRequest.kt / TemplateAreaInput.kt

금지 사항:
  - 템플릿 수정을 기존 페이지에 전파하는 로직 추가 (복사 원칙 위반)
  - usedPageCount를 매 요청마다 전체 스캔으로 재계산 (집계 컬럼·인덱스 활용 검토)
```

### 작업결과물 확인 (BE)

```
자동 확인:
  □ Gradle build 성공 / ktlint 오류 없음
  □ 단위 테스트 통과 (등록 / 미존재 섹션타입 참조 / 사용중 템플릿 삭제시도 3케이스 이상)
  □ 커버리지 ≥ 80%

크로스 확인:
  □ HC-DPL-TPL-001~002 구현 여부 코드 대조
  □ usedPageCount>0 && ACTIVE 템플릿에 대해 PUT 요청도 409로 차단되는지 확인 (DELETE만 막으면 미달)
  □ 템플릿 저장 시 cat_display_page 관련 테이블에 어떤 쓰기도 발생하지 않는지 확인 (복사 원칙)
  □ 물리 삭제 쿼리 없음 확인

⚠ 미해결 이슈 (decision_log 2026-07-06 #2, 결정 대기 중):
  ERD의 cat_display_area(area_code, area_type FIXED/FLEXIBLE) + cat_display_content 구조는
  이 화면 Mock의 TemplateSection(sectionName/sectionType/sortOrder 3필드)보다 세분화되어 있어
  구조가 다름. "ERD로 통일" vs "ERD를 Mock 수준으로 단순화" 중 결정 필요 — 결정 전 착수 시
  본개발 단계에서 재작업 위험.

  추가로, HC-DPL-TPL-002(사용중 템플릿 편집 제한)는 decision_log 2026-06-30 결정
  ("usedPageCount>0 && status==='ACTIVE' 시 기본정보·영역 전체 편집 불가")을 반영한 것으로,
  단순 "삭제 금지"보다 범위가 넓다 — 위 3번 항목대로 수정 API에도 동일 검증 추가할 것.
```

---

## 샘플 4. TSK-ADM-020-008-FE — 전시 템플릿 관리 화면

```yaml
task_id: TSK-ADM-020-008-FE
task_name: 전시 템플릿 관리 화면 구현
dev_type: FE
domain: Display (Catalog 하위)
app: runNshop-admin
decision_type: A

source_api: TSK-DPL-TPL-001-BE 참조
source_screen: ADM-020-008

reference_impl: section/SectionTypePage.tsx (InnerTabs 목록+상세 패턴), section/mockData.ts
                (getSectionLabel·getSectionColor 헬퍼 재사용)
depends_on: [TSK-DPL-TPL-001-BE, TSK-ADM-020-010-FE]
assignee: AI(Kiro)
status: DONE                        # 이미 구현됨 — 프로토타입 Mock 기준 역작성 샘플
```

### AI 코딩 지시 (FE)

```
1. 목록: FilterBar(키워드/유형/상태)
   + Table(템플릿ID/템플릿명/유형/영역수/적용 페이지수/상태/최종수정)

2. reference_impl(SectionTypePage) 그대로 적용 — InnerTabs 상세 구조 재사용.
   "빈 템플릿으로 시작" 옵션만 신규 추가 (섹션종류 관리에는 없던 옵션)

3. API 연동:
   GET    /api/admin/v1/display/templates
   POST   /api/admin/v1/display/templates
   PUT    /api/admin/v1/display/templates/{id}
   DELETE /api/admin/v1/display/templates/{id}
   섹션종류 select 옵션은 GET .../section-types 결과 사용,
   라벨/색상 표시는 section/mockData.ts의 getSectionLabel·getSectionColor 재사용 (신규 구현 금지)

4. 템플릿 추가(AddTemplateModal): 2-Step
   Step1 기존 템플릿 선택(복사 기반, 유형필터 + 3열 그리드) 또는 "빈 템플릿으로 시작"
   Step2 기본 정보 탭 + 영역 목록 탭

5. 상세 모달: 기본정보 / 영역 목록 / 페이지 목록(읽기전용) 3탭
   영역 추가/편집: 섹션종류 select(sectionCode만 표시) → 영역명 기본값 `{섹션종류 라벨}_{번호}`

6. 유효성 검증: 템플릿명 필수, 영역별 섹션종류 필수 선택

생성 대상 파일:
  - template/TemplatePage.tsx / TemplateDetail.tsx / AddTemplateModal.tsx / mockData.ts
  - template/tabs/BasicInfoTab.tsx / SectionsTab.tsx / PagesTab.tsx

금지 사항:
  - 페이지 목록 탭에서 페이지 수정 가능하게 구현 (읽기 전용 명시)
  - 섹션종류 select에 DEPRECATED 상태 섹션종류 노출 (ACTIVE만 노출)
```

### 작업결과물 확인 (FE)

```
자동 확인:
  □ tsc 오류 없음 / next build 성공

수동 시나리오 확인:
  □ "빈 템플릿으로 시작" 선택 시 영역 0개로 등록 → 이후 영역 추가 가능
  □ 기존 템플릿 복사 선택 시 영역 구성 그대로 복사되어 Step2에 반영
  □ 영역 추가 시 섹션종류 select에 등록된 sectionCode 전체(ACTIVE만) 노출
  □ 페이지 목록 탭 읽기 전용(수정 버튼 없음) 확인

설계 정합성 확인:
  □ ADM-020-008 화면정의서 필드·API(52~55) 매핑 누락 없음
```

---

## 샘플 5. TSK-DPL-001-BE — 전시 페이지 등록 API

```yaml
task_id: TSK-DPL-001-BE
task_name: 전시 페이지 등록 API 구현
dev_type: BE
domain: Display (Catalog 하위)
app: runNshop-api
decision_type: A

source_api: (⑧ API정의서 미작성 — 화면정의서 44번 API + ERD 기준 신규 도출)
source_screen: ADM-020-007
source_domain: DOM-CATALOG          # cat_display_page는 Catalog 도메인 소유 (ERD #37)
source_entity: cat_display_page, cat_display_page_area, cat_display_template
source_policy: POL-DPL-001          # 정책서 3.12 전시 페이지 상태 정책

reference_impl: TSK-DPL-TPL-001-BE
depends_on: [TSK-DPL-TPL-001-BE]    # 템플릿 등록 API 선행 (template_id FK)
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
     - HC-DPL-002: template_id가 ACTIVE 상태인 템플릿만 선택 가능
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
  □ Catalog 도메인 경계 위반 없음 (타 도메인 테이블 직접 접근 없음, AI-H5)

⚠ 미해결 이슈 (decision_log 2026-07-06 #1, 결정 대기 중):
  정책서(3.12)·ERD는 2026-07-06 크로스체크로 정합 완료 (7개 상태, cat_display_page_schedule로
  PUBLISHED/SCHEDULED를 별도 행으로 관리하는 2-row 스왑 구조). 그러나 현재 화면 Mock은 여전히
  4종 상태(PUBLISHED/SCHEDULED/DRAFT/DEPRECATED)를 단일 행에 두는 구조라 정책서·ERD와 다름.
  "Mock을 정책서 구조로 전환" vs "정책서를 Mock 수준으로 단순화" 결정 필요 — 결정 전 착수 시
  본개발 단계에서 재작업 위험. 이 Task Spec은 "현재 프로토타입 Mock 기준"으로 작성된 임시 버전.
```

---

## 샘플 6. TSK-ADM-020-007-FE — 전시 페이지 관리 화면

```yaml
task_id: TSK-ADM-020-007-FE
task_name: 전시 페이지 관리(EventPage) 화면 구현
dev_type: FE
domain: Display (Catalog 하위)
app: runNshop-admin
decision_type: A

source_api: TSK-DPL-001-BE 참조 (화면정의서 API 목록 43~51)
source_screen: ADM-020-007

reference_impl: template/AddTemplateModal.tsx (2-Step 그리드 카드 선택 패턴),
                section/mockData.ts + template/mockData.ts (getSectionLabel·getSectionColor,
                MOCK_TEMPLATES 재사용)
depends_on: [TSK-DPL-001-BE, TSK-ADM-020-008-FE, TSK-ADM-020-010-FE]
assignee: AI(Kiro)
status: DONE                        # 이미 구현됨 — 프로토타입 Mock 기준 역작성 샘플
```

### AI 코딩 지시 (FE)

```
1. 화면정의서 ADM-020-007 기준 목록 레이아웃 구성
   FilterBar(키워드/유형/상태/기간) + SummaryBar(전체·게시중·예약·미게시·폐기)
   + Table(페이지ID/페이지명/유형/상태/기간/영역수/최종수정) + Pagination

2. reference_impl(AddTemplateModal) 그대로 적용 — 2-Step 등록(템플릿 그리드 선택 → 기본정보)

3. API 연동 (화면정의서 43~51번 API 목록):
   GET /api/admin/v1/display/pages          → 목록 조회
   POST /api/admin/v1/display/pages         → 등록 (AddEventPageModal)
   PUT /api/admin/v1/display/pages/{id}     → 수정 (BasicInfoTab 편집모드)
   DELETE /api/admin/v1/display/pages/{id}  → 삭제
   PUT .../areas/{area_id}                  → 섹션편집기 탭 저장
   GET/POST/PUT .../schedules               → 예약 목록/등록/취소 (ScheduleTab)

4. 등록 플로우: 2-Step (AddEventPageModal)
   Step1 템플릿 선택(유형 필터 + 활성 템플릿 그리드 카드, 250x120px 2열)
   → 선택 템플릿의 섹션 구성을 복사하여 초기 섹션 생성 (nextSectionId 채번)
   Step2 기본 정보(페이지명*, Slug, 유형, 상태, 시작/종료 일시*)
   등록 버튼 활성 조건: pageName 공백 아님 && startAt/endAt 모두 입력 && endAt >= startAt

5. 상세 탭 구성: 기본정보 / 섹션편집기 / 미리보기 / 변경이력
   섹션편집기: 좌측 섹션 목록(순서이동/숨김/삭제/추가) + 우측 필드 타입별 입력 폼
   미리보기: 모바일 프레임 내 섹션 블록 시각화

6. 유효성 검증: 화면정의서 필드 제약 그대로
   (페이지명 필수, 시작/종료 일시 필수 + 종료 ≥ 시작)

7. 에러 처리: 상태 배지(PageStatusBadge)로 상태 시각화, API 실패 시 에러 메시지 노출

생성 대상 파일:
  - display-page/EventPage.tsx (목록)
  - display-page/AddEventPageModal.tsx (등록, 2-Step)
  - display-page/EventPageDetail.tsx (상세, 4탭)
  - display-page/PageStatusBadge.tsx (상태 배지)
  - display-page/mockData.ts (타입 + 필터 + Mock 데이터)
  - display-page/tabs/BasicInfoTab.tsx, SectionsTab.tsx, ScheduleTab.tsx, DataMappingTab.tsx

금지 사항:
  - 템플릿을 선택하지 않고 섹션 없이 페이지 생성 (템플릿 선택은 필수 1단계)
  - 예약 페이지(SCHEDULED)를 직접 수정 (정책 3.12: 취소 후 재등록만 허용)
  - 상태 코드 하드코딩 (PAGE_TYPE_LABEL / EVENT_PAGE_STATUS_LABEL 맵 사용)
```

### 작업결과물 확인 (FE)

```
자동 확인:
  □ tsc 오류 없음 / next build 성공

수동 시나리오 확인:
  □ 템플릿 선택 → 섹션 자동 복사 → 등록 정상 동작
  □ 목록 필터(유형/상태/기간/키워드) 조합 동작
  □ SummaryBar 건수가 필터 결과와 일치
  □ 상세 4개 탭 전환 정상 동작, 섹션편집기 순서변경/숨김 반영
  □ 종료일시 < 시작일시 입력 시 등록 버튼 비활성화 확인

설계 정합성 확인:
  □ ADM-020-007 화면정의서 필드·API 매핑 누락 없음
  □ admin-guide.md / coding-standards.md(순수 CSS, BEM) 위반 없음

⚠ 미해결 이슈 (decision_log 2026-07-06 #1, 결정 대기 중, TSK-DPL-001-BE와 동일):
  정책서(3.12)의 상태값은 DRAFT/DRAFT_EDIT/PUBLISHED/SCHEDULED/RESERVED/CLOSED/CANCELLED(7종)이고
  ERD도 2026-07-06 크로스체크로 이와 일치하도록 정정됨. 현재 프로토타입(mockData.ts)은
  PUBLISHED/SCHEDULED/DRAFT/DEPRECATED(4종)로 단순화되어 있어 여전히 다름 — 결정 필요.

  DataMappingTab.tsx가 작성되어 있으나 이 화면(EventPageDetail)의 InnerTabs에 연결되지 않음
  (decision_log 2026-07-06 #3). "데이터 맵핑" 탭이 화면정의서·상세 탭 구성에 없는 이유가 이것.
```

---

## 샘플 7. TSK-DPL-EVT-001-BATCH — 전시 페이지 예약 자동 전환 배치

```yaml
task_id: TSK-DPL-EVT-001-BATCH
task_name: DisplayPageScheduleBatch (예약 전시 페이지 자동 전환)
dev_type: BATCH
domain: Display (Catalog 하위)
app: runNshop-api
decision_type: A

source_domain: DOM-CATALOG          # Bounded Context 문서에 이미 정의됨 (매 5분)
source_entity: cat_display_page, cat_display_page_schedule
source_policy: POL-DPL-001

reference_impl: 없음 — Bounded Context(runNshop_bounded_context_v1_0.md:339),
                Modular Monolith(runNshop_modular_monolith_v1_0.md:189)에
                배치명·주기가 이미 확정되어 있음. Task Spec은 이를 실행 지시로 재배열.
depends_on: [TSK-DPL-001-BE]         # 예약 등록 API(TSK-DPL-002-BE, 별도 Task)는 이 문서 범위 밖
assignee: AI(Kiro)
status: TODO
```

### AI 코딩 지시 (BATCH)

```
1. 트리거: 스케줄 매 5분 (fixedDelay 또는 cron), cat_display_page_schedule 중
   status='PENDING' AND scheduled_at <= NOW() 인 행 폴링

2. 멱등성: schedule.id를 멱등키로 사용.
   전환 처리 시 status를 PENDING → APPLIED로 즉시 UPDATE (재조회 시 재처리 방지)
   조건부 유니크 인덱스(uk_page_pending)로 페이지당 PENDING 1건만 존재함을 전제로 함

3. 비즈니스 로직:
   - 원본 페이지(page_id)를 비활성화 처리
   - 예약 페이지(scheduled_page_id)를 PUBLISHED로 전환
   - cat_display_page_schedule.applied_at = NOW(), status = APPLIED
   HARD: HC-DPL-004 페이지당 PENDING 예약 1개 초과 금지 (DB 유니크 인덱스로 이미 보장,
         배치 로직에서 중복 처리 가정 금지)

4. 실패 처리: 전환 중 예외 발생 시 해당 schedule 건만 스킵 + ERROR 로그,
   다음 주기(5분 후) 재시도. 3회 연속 실패 시 관리자 알림(Notification 도메인 이벤트 발행)

5. 로그: Trace ID 발급(배치 실행 단위), 처리 건수/실패 건수/스킵 건수 로그

생성 대상 파일:
  - DisplayPageScheduleBatch.kt
  - DisplayPageScheduleBatchTest.kt

금지 사항:
  - status UPDATE 없이 다음 폴링에서 동일 schedule 중복 처리
  - 실패 건을 무시하고 로그 없이 넘어감 (반드시 ERROR 로그 + 3회 연속 시 알림)
```

### 작업결과물 확인 (BATCH)

```
자동 확인:
  □ 스케줄 등록 확인 (5분 주기, BC 문서 명시 주기와 일치)
  □ 단위 테스트 통과 (정상 전환 / 중복 폴링 시 재처리 안됨 / 전환 중 예외 발생 시 스킵 3케이스)

자동+수동 확인:
  □ 멱등성 테스트 — 동일 schedule.id 2회 폴링 → 전환 1회만 발생 (status APPLIED 이후 재처리 없음)
  □ 페이지당 PENDING 1건 제약 위반 시도 → DB 유니크 인덱스 위반으로 등록 단계에서 차단 확인 (배치가 아닌 BE 책임)
  □ 3회 연속 실패 시 관리자 알림 발행 확인
  □ 로그에 Trace ID·처리/실패/스킵 건수 기록 확인
```
