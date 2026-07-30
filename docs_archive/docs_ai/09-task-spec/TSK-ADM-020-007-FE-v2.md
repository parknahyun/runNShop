# TSK-ADM-020-007-FE — 전시 페이지 관리(Page) 화면 구현 (v2, 표준양식 v1.1 적용)

> v1(원본: `docs/x. 하네스/샘플/09-DPL...` 샘플 6) 검증 결과: 이 화면은 Section/Template과 달리
> **`.spec.md` 자체가 이미 정확**했다(요약카드 5개·테이블 7컬럼·탭 4개 전부 실제 코드와 일치).
>
> 다만 이후 "등록 플로우" 항목을 실제 `AddPageModal.tsx`와 재대조한 결과 추가 gap 4건 발견:
> ① `AddTemplateModal` 구조를 "그대로 적용"이라고만 적어놔서 마크업 스켈레톤 자체가 어디에도
> 없었음(reference_impl 파일을 직접 열어봐야만 알 수 있었음) — 스켈레톤을 명시적으로 옮겨적음.
> ② 그 reference와 실제로 다른 점(overlay 클릭 닫기 차단 여부)이 있는데 문서화가 안 돼 있었음
> — 오히려 Template 쪽이 가이드 규칙(overlay 클릭 차단)을 어기고 있어서 "그대로 적용"을 문자
> 그대로 따르면 안 됨. ③ 상태 select가 3개(DRAFT/SCHEDULED/PUBLISHED)로 하드코딩된 것,
> ④ Slug 미입력 시 페이지명 기반 자동 생성 — 둘 다 원본엔 언급 없었음.

```yaml
task_id: TSK-ADM-020-007-FE
task_name: 전시 페이지 관리(Page) 화면 구현
dev_type: FE
domain: Display (Catalog 하위)
app: runNshop-admin
decision_type: A

source_api: TSK-DPL-001-BE 참조 (화면정의서 API 목록 43~51)
source_screen: ADM-020-007

reference_impl: template/AddTemplateModal.tsx (2-Step 그리드 카드 선택 패턴),
                page/mockData.ts의 getSectionLabel·getSectionColor
                (✅ v1은 이 함수들을 section/mockData.ts 소속이라고 잘못 인용했었으나, 실제로는
                이 화면 자신의 mockData.ts에 있다 — TSK-ADM-020-008-FE-v2 검증 시 교차 확인됨)
depends_on: [TSK-DPL-001-BE, TSK-ADM-020-008-FE, TSK-ADM-020-010-FE]
cross_module_deps:
  - display/section/mockData.ts의 MOCK_SECTIONS — page/mockData.ts의
    getSectionLabel/getSectionColor 함수가 내부적으로 참조 (섹션편집기 탭에서 섹션 라벨/색상 표시)
  - display/template/mockData.ts의 MOCK_TEMPLATES — AddPageModal.tsx가 직접 import
    (등록 Step1의 템플릿 선택 그리드, status==='ACTIVE'만 필터)
  - 상태 배지: 전용 컴포넌트(PageStatusBadge.tsx)는 있지만 내부적으로 data-product-status
    재사용(PUBLISHED→ON_SALE 등) — Section/Template과 동일한 예외 패턴
assignee: AI(Kiro)
status: DONE                        # 이미 구현됨 — 프로토타입 Mock 기준 역작성 샘플 v2
```

### AI 코딩 지시 (FE)

```
1. 화면정의서 ADM-020-007 기준 목록 레이아웃 구성 — 정확한 목록 (v1과 동일, 실제 코드와 일치 확인됨):
   FilterBar(키워드/유형/상태/기간) + SummaryBar(전체/게시중/예약/미게시/폐기 — 5개)
   + Table(페이지ID/페이지명/유형/상태/기간/영역수/최종수정 — 7컬럼) + Pagination

2. reference_impl(AddTemplateModal) 구조를 그대로 재사용해서 만든다 — 마크업 스켈레톤:
   `.detail-modal-overlay` > `.detail-modal.detail-modal--sm`(필드 수가 적은 등록 모달이므로
   `--sm` 변형을 붙인다) > `.detail-modal__header`(`.detail-modal__title` + `.step-indicator`
   [`__dot`×2 + `__line` + `__label`] + `.detail-modal__close`) + `.detail-modal__body` >
   `.add-form`(step별 조건부 렌더) > `.add-form__footer`(이전/취소/다음|등록)
   ⚠ **reference_impl을 그대로 복사하면 안 되는 지점**: `AddTemplateModal`의 오버레이는
   `<div className="detail-modal-overlay" onClick={onClose}>`로 배경 클릭 시 닫히게 돼 있는데,
   이는 "서브 모달 overlay 클릭 닫기 차단(데이터 유실 방지)" 가이드 규칙 위반이다(reference_impl
   쪽의 기존 결함이므로 이것만은 따라가지 않는다). **오버레이 div에 `onClick` 핸들러를 붙이지
   않는다** — `<div className="detail-modal-overlay">`로 배경 클릭이 아무 동작도 하지 않게 만든다.

3. API 연동 (화면정의서 43~51번 API 목록):
   GET /api/admin/v1/display/pages          → 목록 조회
   POST /api/admin/v1/display/pages         → 등록 (AddPageModal)
   PUT /api/admin/v1/display/pages/{id}     → 수정 (BasicInfoTab 편집모드)
   DELETE /api/admin/v1/display/pages/{id}  → 삭제
   PUT .../areas/{area_id}                  → 섹션편집기 탭 저장
   GET/POST/PUT .../schedules               → 예약 목록/등록/취소 (ScheduleTab)

4. 등록 플로우: 2-Step 모달을 만든다
   Step1: 유형 필터 select(전체유형+TEMPLATE_TYPE_LABEL) + `.template-grid`를 배치한다.
   그리드는 2열로 만든다(`gridTemplateColumns: repeat(2, 250px)` — reference_impl의
   템플릿-등록용 그리드는 3열이지만 이 화면은 2열로 만든다). 활성 템플릿 카드(`.template-card`,
   섹션 0개면 "섹션 없음" 배지 / 있으면 섹션별 색상 배지)를 나열한다.
   `selectedTemplate` 초기값은 활성 템플릿 배열의 첫 번째로 자동 선택해둔다 — "빈 템플릿으로
   시작" 같은 옵션은 만들지 않는다(reference_impl엔 있지만 이 화면엔 필요 없음, 템플릿 미선택
   상태를 허용하지 않기 위함). 선택 템플릿의 섹션 구성을 복사해 초기 섹션을 생성한다
   (nextSectionId로 채번)
   Step2: 페이지명*, Slug(선택 — **비워두면 페이지명을 소문자+공백을하이픈으로 바꿔 자동 생성**),
   유형(select, PAGE_TYPE_LABEL 전체), **상태(select, DRAFT/SCHEDULED/PUBLISHED 3개만 하드코딩
   — PAGE_STATUS_LABEL 전체를 매핑하면 안 됨, DEPRECATED로는 등록 불가)**, 시작/종료 일시*
   상태를 PUBLISHED로 등록하면 publishedAt이 현재시각으로 자동 설정, 그 외엔 빈 문자열
   등록 버튼 활성 조건은 pageName 공백 아님 && startAt/endAt 모두 입력 && endAt >= startAt로만
   만든다 — 템플릿 선택 여부는 이 조건에 넣지 않는다("다음" 버튼도 마찬가지로 템플릿 미선택으로
   막지 않는다). `selectedTemplate` 초기값을 항상 첫 번째 활성 템플릿으로 채워두기 때문에
   별도 검증 없이도 항상 선택된 상태가 보장된다.

5. 상세 탭 구성: 기본정보 / 섹션편집기 / 미리보기 / 변경이력 (실제 컴포넌트 키: basic/sections/preview/logs)
   섹션편집기: 좌측 섹션 목록(순서이동/숨김/삭제/추가) + 우측 필드 타입별 입력 폼
   미리보기: 모바일 프레임 내 섹션 블록 시각화
   ※ tabs/DataMappingTab.tsx 파일은 존재하지만 이 InnerTabs에 연결하지 않는다
   (decision_log 2026-07-06 #3 — 의도적 제외, 누락 아님)

6. 유효성 검증: 화면정의서 필드 제약 그대로
   (페이지명 필수, 시작/종료 일시 필수 + 종료 ≥ 시작)

7. 에러 처리: 상태 배지(PageStatusBadge)로 상태 시각화, API 실패 시 에러 메시지 노출

8. cross_module_deps 연결 확인 — 섹션편집기의 섹션 라벨/색상이 section 도메인 데이터와 일치하는지,
   템플릿 선택 그리드가 template 도메인의 ACTIVE 템플릿만 보여주는지 확인

생성 대상 파일:
  - page/Pages.tsx (목록)
  - page/AddPageModal.tsx (등록, 2-Step)
  - page/PageDetail.tsx (상세, 4탭)
  - page/PageStatusBadge.tsx (상태 배지)
  - page/mockData.ts (타입 + 필터 + Mock 데이터 + getSectionLabel/getSectionColor)
  - page/tabs/BasicInfoTab.tsx, SectionsTab.tsx, ScheduleTab.tsx
  (DataMappingTab.tsx는 파일은 존재하나 이 Task 범위에서 굳이 새로 만들 필요 없음 — 이미 있고 미연결 상태 유지)

금지 사항:
  - 템플릿을 선택하지 않고 섹션 없이 페이지 생성 (템플릿 선택은 필수 1단계)
  - 예약 페이지(SCHEDULED)를 직접 수정 (정책 3.12: 취소 후 재등록만 허용)
  - 상태 코드 하드코딩 (PAGE_TYPE_LABEL / PAGE_STATUS_LABEL 맵 사용)
  - getSectionLabel/getSectionColor를 section 도메인에 새로 만듦 (이미 이 화면 자신의
    mockData.ts에 있음 — 위치 착각하지 말 것)
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
  □ [v2] cross_module_deps 두 건(section/template 데이터 참조)이 실제로 연결되는지 확인
  □ [v2] 등록 모달 배경(overlay) 클릭 시 닫히지 않는지 확인 (AddTemplateModal과 다른 점)
  □ [v2] 등록 Step2 상태 select에 폐기(DEPRECATED) 옵션이 없는지 확인 (3개만: 미게시/예약/게시중)
  □ [v2] Slug를 비워두고 등록 시 페이지명 기반으로 자동 생성되는지 확인

설계 정합성 확인:
  □ ADM-020-007 화면정의서 필드·API 매핑 누락 없음
  □ admin-guide.md / coding-standards.md(순수 CSS, BEM) 위반 없음

⚠ 미해결 이슈 (ERD:1046-1051에 이미 기록, decision_log 2026-07-06 #1과 동일):
  정책서(§3.12)는 상태 7종, ERD도 이와 일치하도록 정정됨. 현재 프로토타입(mockData.ts)은
  4종(PUBLISHED/SCHEDULED/DRAFT/DEPRECATED)으로 단순화 — 여전히 다름. "Mock을 정책서 구조로
  전환" vs "정책서를 Mock 수준으로 단순화" 결정 필요. 이 Task Spec은 현재 프로토타입 Mock
  기준으로 작성된 임시 버전이다.
```
