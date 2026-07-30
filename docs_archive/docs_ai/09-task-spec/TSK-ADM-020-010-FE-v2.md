# TSK-ADM-020-010-FE — 섹션 관리 화면 (v2, 표준양식 v1.1 적용)

> v1(`TSK-ADM-020-010-FE.md`) 검증에서 발견된 5개 gap을 반영해 재작성.
> 원본 문서는 다시 열지 않고, 실제 코드(`apps/runNshop-admin/src/display/section/`)를 역추적해
> v1.1 표준양식이 요구하는 항목(정확한 UI 구성요소 목록, cross_module_deps, 상태 표시 방식)을 채웠다.

```yaml
task_id: TSK-ADM-020-010-FE
task_name: 섹션 관리 화면 구현
dev_type: FE
domain: Display (Catalog 하위)
app: runNshop-admin
decision_type: A

source_api: TSK-DPL-SEC-001-BE 참조 (⑧ API정의서 미작성)
source_screen: ADM-020-010          # ⑤ docs_ai/06-화면정의/admin/Display/03-Section.md

reference_impl: 없음 — InnerTabs 상세(등록/상세 공용) 패턴의 최초 도입 화면.
                이후 템플릿 상세(④)가 이 패턴을 그대로 재사용
depends_on: [TSK-DPL-SEC-001-BE]
cross_module_deps:                  # [v1.1 신규]
  - common/commonCode.getGroupOptions() — AddFieldModal에서 필드 타입이 "선택"일 때
    기본값 select를 공통코드 그룹 목록으로 채운다. 이 화면 자체 데이터가 아니라
    시스템 > 공통코드(system/common-code) 도메인의 데이터를 그대로 가져다 쓴다.
  - 상태 배지: 전용 StatusBadge 컴포넌트 파일을 만들지 않는다. 기존 data-product-status
    속성을 재사용해서 ACTIVE→ON_SALE, INACTIVE→DRAFT, DEPRECATED→DISCONTINUED로 매핑한다
    (컴포넌트 가이드 "StatusBadge 예외" 참고 — 새 data-*-status 속성을 만들지 않는다)
assignee: AI(Kiro)
status: DONE                        # 이미 구현됨 — 프로토타입 Mock 기준 역작성 샘플 v2
```

### AI 코딩 지시 (FE)

```
1. 화면 구성 — [v1.1] 정확한 목록 (요약·생략 금지):

   필터 항목 (FilterBar):
     - 키워드 입력 (placeholder: "타입ID / 라벨명")
     - 상태 select: 전체 상태 / 활성 / 비활성 / 폐기 (4개 옵션, ALL 포함)
     - 조회 버튼

   요약카드 (SummaryBar) — 정확히 4개, 이 순서:
     - 전체 (기본 스타일)
     - 활성 (summary-card--info)
     - 비활성 (summary-card--muted)
     - 폐기 (summary-card--warn)

   테이블 컬럼 (Table) — 정확히 7개, 이 순서:
     순서 / 타입 ID / 라벨(프리뷰 색상칩 10x10px 인라인 포함) / 설명 / 필드수 / 상태 / 최종수정
     ※ "대분류"(type 필드)는 데이터엔 있지만 테이블 컬럼으로 노출하지 않는다

2. reference_impl 없음 → InnerTabs 상세 구조 신규 설계
   ("상세/등록: 동일한 InnerTabs 구조" — `03-Section.md` "섹션 상세" 절 명시)

3. API 연동:
   GET    /api/admin/v1/display/section-types
   POST   /api/admin/v1/display/section-types
   PUT    /api/admin/v1/display/section-types/{sectionCode}
   PUT    /api/admin/v1/display/section-types/{sectionCode}/fields
   DELETE /api/admin/v1/display/section-types/{sectionCode}

4. 상세/등록 모달: 기본정보 탭 + 필드관리 탭 (InnerTabs)
   필드관리 탭: 추가/편집/삭제/순서변경(↑↓)은 전부 로컬 state에서만 처리,
   "저장" 클릭 시에만 PUT .../fields 1회 호출 (필드별 즉시 API 호출 금지)

5. AddFieldModal — 필드 목록 정확히 11종 (이 라벨 그대로, "노출선택" 아니고 "선택"):
   이미지 / 상품 / 텍스트 / 링크 / 색상 / 숫자 / 날짜시간 / 선택 / 이미지배열 / 상품배열 / 텍스트배열
   + 필수·선택 (라디오, 4개 미만이라 select 아님)
   + 기본값 (타입별 UI 분기: "선택"→cross_module_deps의 공통코드 select, "숫자"→number input,
     그 외→text input)
   + 플레이스홀더 (텍스트 타입만 노출)
   필드 키는 등록 후 수정 불가 (편집 모드에서 input disabled 처리)

6. 유효성 검증: sectionCode 필수, fieldKey camelCase 형식, 필드 키·라벨 필수(AddFieldModal)

7. cross_module_deps 연결 확인 (위 헤더 참조) — 그룹코드 select가 실제로
   system/common-code 데이터로 채워지는지, 배지 색상이 data-product-status 매핑대로
   나오는지 둘 다 확인

생성 대상 파일:
  - section/Sections.tsx (목록)
  - section/SectionDetail.tsx (상세)
  - section/AddSectionModal.tsx (등록)
  - section/mockData.ts
  - section/tabs/BasicInfoTab.tsx / FieldsTab.tsx / AddFieldModal.tsx

금지 사항:
  - fieldKey를 편집 모드에서 입력 가능하게 구현 (스펙상 명시적 불변)
  - 필드 추가/삭제를 즉시 API 호출로 구현 (스펙: 로컬 state 후 일괄 저장)
  - 요약카드/테이블 컬럼 개수를 위 목록과 다르게 구현 (임의로 줄이거나 늘리지 않음)
  - cross_module_deps에 없는 방식으로 그룹코드/배지 색상을 새로 구현 (기존 것 재사용)
```

### 작업결과물 확인 (FE)

```
자동 확인:
  □ tsc 오류 없음 / next build 성공

수동 시나리오 확인:
  □ 섹션 등록 → 필드 3~4개 추가 → 저장 → 목록 fieldCount 반영 확인
  □ 필드 편집 시 필드 키 입력란이 비활성화(readonly)되는지 확인
  □ 필드 순서 변경(↑↓) 후 저장 시 sortOrder 반영 확인
  □ DEPRECATED 상태 섹션이 목록에서 배지로 구분 표시되는지 확인
  □ [v1.1] 요약카드 정확히 4개(전체/활성/비활성/폐기) 확인
  □ [v1.1] 테이블 컬럼 정확히 7개(순서/타입ID/라벨/설명/필드수/상태/최종수정), "대분류" 컬럼 없음 확인
  □ [v1.1] AddFieldModal에서 "선택" 타입 선택 시 그룹코드 select가 system/common-code 데이터로 채워지는지 확인

설계 정합성 확인:
  □ ADM-020-010 화면정의서(`03-Section.md`) 필드 누락 없음
  □ API 엔드포인트는 이 화면정의서에 없음 — source_api(TSK-DPL-SEC-001-BE) 참조 확인
```
