# TSK-ADM-020-008-FE — 전시 템플릿 관리 화면 (v2, 표준양식 v1.1 적용)

> v1(`TSK-ADM-020-008-FE.md`) 검증에서 발견된 gap을 반영해 재작성.

```yaml
task_id: TSK-ADM-020-008-FE
task_name: 전시 템플릿 관리 화면 구현
dev_type: FE
domain: Display (Catalog 하위)
app: runNshop-admin
decision_type: A

source_api: TSK-DPL-TPL-001-BE 참조
source_screen: ADM-020-008

reference_impl: section/Sections.tsx (InnerTabs 목록+상세 패턴, 필터+요약카드+테이블+
                페이지네이션 구조 동일하게 재사용)
                ※ v1에서 "section/mockData.ts의 getSectionLabel·getSectionColor 헬퍼 재사용"이라고
                했으나, 이 두 함수는 **section/mockData.ts엔 없고 page/mockData.ts에
                있다**(페이지 관리 화면의 섹션편집기 탭이 씀 — ADM-020-007 검증 시 확인).
                Template의 SectionsTab.tsx는 이 헬퍼를 쓰지 않고 `MOCK_SECTIONS`
                (section/mockData.ts)를 직접 import해서 자체적으로 필터/매핑한다 — v1의 인용은
                파일도 틀리고(section이 아니라 page) 화면도 틀렸다(Template이 아니라 Page).
depends_on: [TSK-DPL-TPL-001-BE, TSK-ADM-020-010-FE]
cross_module_deps:
  - section/mockData.ts의 MOCK_SECTIONS를 직접 import — 섹션 select 옵션(ACTIVE만)과
    영역 목록에 표시되는 섹션 설명(description)에 사용. 헬퍼 함수 없이 원본 배열을 그대로
    filter/find 한다 (section 도메인에 새 export를 추가하지 않음)
  - 상태 배지: 전용 StatusBadge 컴포넌트 파일 없음. 기존 data-product-status 속성을 재사용해서
    ACTIVE→ON_SALE, INACTIVE→DRAFT, DEPRECATED→DISCONTINUED로 매핑 (section 화면과 동일 패턴)
assignee: AI(Kiro)
status: DONE                        # 이미 구현됨 — 프로토타입 Mock 기준 역작성 샘플 v2
```

### AI 코딩 지시 (FE)

```
1. 화면 구성 — 정확한 목록 (요약·생략 금지):

   필터 항목 (FilterBar):
     - 키워드 입력 (placeholder: "템플릿ID 또는 템플릿명 검색")
     - 유형 select: 전체 유형 / 메인 / 카테고리 / 기획전 / 이벤트 (ALL 포함 5개)
     - 상태 select: 전체 상태 / 활성 / 비활성 / 폐기 (ALL 포함 4개)
     - 조회 버튼

   요약카드 (SummaryBar) — v1에서 완전히 빠졌던 부분. 정확히 4개, section 화면과 동일 구성:
     - 전체 (기본) / 활성 (summary-card--info) / 비활성 (summary-card--muted) / 폐기 (summary-card--warn)

   테이블 컬럼 — 정확히 7개, 이 순서·라벨 그대로:
     템플릿ID / 템플릿명 / 유형(plain badge, 색상 구분 없음) / 구성영역 수 / 적용 페이지 수 /
     상태(data-product-status 배지) / 최종수정

2. reference_impl(Sections) 그대로 적용 — InnerTabs 상세 구조 재사용.
   "빈 템플릿으로 시작" 옵션만 신규 추가 (섹션 관리에는 없던 옵션)

3. API 연동:
   GET    /api/admin/v1/display/templates
   POST   /api/admin/v1/display/templates
   PUT    /api/admin/v1/display/templates/{id}
   DELETE /api/admin/v1/display/templates/{id}
   섹션 select 옵션 = cross_module_deps의 MOCK_SECTIONS를 status==='ACTIVE'로 필터링한
   {code: sectionCode, label: sectionName} 목록 (헬퍼 함수 없음, 화면 코드에서 직접 filter+map)

4. 템플릿 추가(AddTemplateModal): 2-Step (step-indicator 컴포넌트로 진행 표시)
   Step1 기존 템플릿 선택(유형 필터 select + `.template-grid` 3열 250px 카드) 또는 "빈 템플릿으로 시작"
   Step2 기본 정보 탭 + 영역 목록 탭

5. 상세 모달: InnerTabs 3탭 — 기본 정보 / 영역 목록 / 페이지 목록(읽기전용)
   영역 추가/편집: 섹션 select(옵션 텍스트는 sectionCode 그대로 노출, label 아님 — 실제 구현 기준)
     → 영역명 기본값 `{섹션 라벨(sectionName)}_{번호}` (라벨은 이때만 사용)

6. 유효성 검증: 템플릿명 필수, 영역별 섹션 필수 선택, 영역명 필수(추가/편집 모두)

7. cross_module_deps 연결 확인 — 섹션 select에 DEPRECATED 상태가 안 뜨는지,
   상태 배지 색이 data-product-status 매핑대로 나오는지 둘 다 확인

생성 대상 파일:
  - template/Templates.tsx / TemplateDetail.tsx / AddTemplateModal.tsx / mockData.ts
  - template/tabs/BasicInfoTab.tsx / SectionsTab.tsx / PagesTab.tsx

금지 사항:
  - 페이지 목록 탭에서 페이지 수정 가능하게 구현 (읽기 전용 명시)
  - 섹션 select에 DEPRECATED 상태 섹션 노출 (ACTIVE만 노출)
  - 요약카드를 생략하거나 개수를 다르게 구현 (section 화면과 동일한 4개 구성)
  - Template 화면에서 page의 getSectionLabel/getSectionColor를 끌어오거나 section
    도메인에 동명 헬퍼를 새로 만듦 (Template은 원본 데이터 MOCK_SECTIONS를 직접 쓰는 게
    실제 패턴 — 헬퍼 재사용은 Page 화면 쪽 얘기다)
```

### 작업결과물 확인 (FE)

```
자동 확인:
  □ tsc 오류 없음 / next build 성공

수동 시나리오 확인:
  □ "빈 템플릿으로 시작" 선택 시 영역 0개로 등록 → 이후 영역 추가 가능
  □ 기존 템플릿 복사 선택 시 영역 구성 그대로 복사되어 Step2에 반영
  □ 영역 추가 시 섹션 select에 등록된 sectionCode 전체(ACTIVE만) 노출
  □ 페이지 목록 탭 읽기 전용(수정 버튼 없음) 확인
  □ [v2] 요약카드 정확히 4개(전체/활성/비활성/폐기) 노출 확인
  □ [v2] 템플릿 유형 배지가 색상 구분 없는 plain badge인지 확인 (data-*-status 없음)
  □ [v2] 상태 배지가 data-product-status 매핑(ACTIVE→ON_SALE 등)대로 색이 나오는지 확인

설계 정합성 확인:
  □ ADM-020-008 화면정의서 필드·API(52~55) 매핑 누락 없음
```
