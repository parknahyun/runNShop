# TSK-ADM-020-010-FE — 섹션종류 관리 화면

> 원본: `docs/x. 하네스/샘플/09-DPL. Task Spec 하네스 샘플 (Display) v1 0.md` 샘플 2

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
