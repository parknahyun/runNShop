# TSK-ADM-020-008-FE — 전시 템플릿 관리 화면

> 원본: `docs/x. 하네스/샘플/09-DPL. Task Spec 하네스 샘플 (Display) v1 0.md` 샘플 4

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
