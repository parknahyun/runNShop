# CommonCodes — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 시스템 전역에서 사용하는 공통코드 그룹과 그 하위 상세코드를 조회·등록·수정한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 시스템 관리 > 공통코드 |
| URL | /admin/system/common-code |
| 관련 컴포넌트 | FilterBar, SummaryBar, Toolbar, CodeGroupTable, Pagination, AddGroupModal, CodeGroupDetail |

---

## Layout

```
┌─────────────────────────────────────────────────────────┐
│ 공통코드 현황                        [스펙]  (page-title) │
├─────────────────────────────────────────────────────────┤
│ [그룹코드ID] [그룹코드명] [전체 상태▾] [상세코드] [상세코드명] [조회] │
│                                          (filter-bar)   │
├──────────────────────────────┬──────────────────────────┤
│ SummaryBar (결과 있을 때만)   │ [+ 그룹코드 추가] (Toolbar) │
│  전체 N건 | 활성 N건 | 비활성 N건(0이면 숨김)             │
├─────────────────────────────────────────────────────────┤
│ 그룹코드ID │ 그룹코드명 │ 상세코드 수 │ 상태 │ 최종수정    │
│ ────────  │ ────────  │ ─────────  │ ──── │ ──────────  │
│ (row)     │           │            │ 뱃지  │ 수정자/일시  │
│   ...                                                   │
├─────────────────────────────────────────────────────────┤
│ [7개▾]  ← 1 / N →                      (Pagination)    │
└─────────────────────────────────────────────────────────┘

※ 로딩 중: FilterBar 아래에 "불러오는 중..." 메시지. 나머지 영역 숨김.
※ 결과 없음(미조회 포함): Toolbar만 표시. 테이블 영역에 안내 메시지.

[그룹코드 추가 모달]
┌───────────────────────────────┐
│ 그룹코드 추가             [✕] │
│ 그룹코드ID* │ 그룹코드명*      │
│ 설명 (full width)             │
│ 상태* [활성▾ / 비활성]        │
│            [취소] [등록]      │
└───────────────────────────────┘
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| FilterBar | 그룹코드ID / 그룹코드명 / 상태(전체·활성·비활성) / 상세코드 / 상세코드명 텍스트 입력 및 조회 버튼 |
| SummaryBar | 조회 결과 기준 전체·활성·비활성 건수 카드 표시. 비활성 0건이면 비활성 카드 숨김. 결과가 있을 때만 렌더링 |
| Toolbar | `+ 그룹코드 추가` 버튼만 포함. 로딩 중이 아닐 때 항상 렌더링. SummaryBar가 없으면 단독으로 우측 정렬 |
| CodeGroupTable | 그룹코드 목록 테이블. 행 클릭 시 상세 모달 오픈. 결과 없으면 "조회 버튼을 눌러 공통코드 목록을 불러오세요." 안내 |
| Pagination | 페이지 크기(7·14·30·50·100) 선택 + 이전/다음 페이지 이동. 결과 있을 때만 렌더링 |
| CodeGroupDetail | 그룹 상세 오버레이 모달(detail-modal-overlay). 기본정보 탭과 상세코드 목록 탭으로 구성 |
| AddGroupModal | 그룹코드 신규 등록 소형 모달. detail-modal-overlay + detail-modal--sm |
| CodeStatusBadge | `ACTIVE`(활성) / `INACTIVE`(비활성) 뱃지 |

---

## States

| 상태 | 처리 |
|------|------|
| 초기(미조회) | `displayed` 배열이 비어 있음. 테이블 영역에 "조회 버튼을 눌러 공통코드 목록을 불러오세요." 메시지. Toolbar는 표시 |
| 로딩 중 | FilterBar 아래에 "불러오는 중..." 메시지 표시. 나머지 영역(SummaryBar, Toolbar, 테이블, Pagination) 숨김 |
| 조회 결과 없음 | SummaryBar 숨김. Toolbar 표시. 테이블 영역에 "조회 버튼을 눌러 공통코드 목록을 불러오세요." 메시지 |
| 조회 결과 있음 | SummaryBar + Toolbar + CodeGroupTable + Pagination 표시 |
| 그룹 상세 열림 | detailGroup에 선택 그룹 저장. CodeGroupDetail 모달 렌더링 |
| 그룹코드 추가 모달 열림 | showAdd = true. AddGroupModal 렌더링 |
| AddGroupModal 유효성 오류 | groupId·groupName 미입력 시 필드 하단에 "필수" 오류 메시지. 등록 차단 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 필터 입력 후 [조회] 클릭 | loading = true → 300ms setTimeout → filterCodeGroups 실행 → displayed 갱신, page = 1, loading = false |
| 그룹 목록 행 클릭 | detailGroup = 해당 CodeGroup. CodeGroupDetail 모달 오픈 |
| [+ 그룹코드 추가] 클릭 | showAdd = true. AddGroupModal 오픈 |
| AddGroupModal [등록] 클릭 | 유효성 통과 시 allGroups에 추가 후 현재 필터로 displayed 재계산. 모달 닫힘 |
| CodeGroupDetail onUpdate 호출 | allGroups 갱신. displayed = filterCodeGroups(next, filter). detailGroup = updated |
| CodeGroupDetail onClose 호출 | detailGroup = null. 모달 닫힘 |
| AddGroupModal [취소] / [✕] 클릭 | showAdd = false. 모달 닫힘 |
| 페이지 크기 변경 | pageSize 업데이트. page = 1 |
| 페이지 이동 | page 업데이트 |

---

## API

```typescript
// 공통코드는 현재 목업(mockData)으로 동작하며, 실제 API 연동 시 아래 엔드포인트를 사용한다.

GET    /api/admin/common-codes
  Query: groupId, groupName, status(ACTIVE|INACTIVE|ALL), codeId, codeName
  Response: CodeGroup[]

POST   /api/admin/common-codes
  Body: { groupId, groupName, description, status }
  Response: CodeGroup

PUT    /api/admin/common-codes/{groupId}
  Body: { groupName, description, status }
  Response: CodeGroup

GET    /api/admin/common-codes/{groupId}/detail-codes
  Response: DetailCode[]

POST   /api/admin/common-codes/{groupId}/detail-codes
  Body: { codeId, codeName, codeValue, description, sortOrder, codeStatus }
  Response: DetailCode

PUT    /api/admin/common-codes/{groupId}/detail-codes/{codeId}
  Body: { codeName, codeValue, description, sortOrder, codeStatus }
  Response: DetailCode

// 타입 정의
type CodeGroupStatus  = 'ACTIVE' | 'INACTIVE'
type DetailCodeStatus = 'ACTIVE' | 'SUSPENDED' | 'DEPRECATED'

interface CodeGroup {
  groupId: string; groupName: string; description: string
  status: CodeGroupStatus; codes: DetailCode[]
  createdBy: string; createdAt: string
  updatedBy: string; updatedAt: string
}

interface DetailCode {
  codeId: string; codeName: string; codeValue: string
  description: string; sortOrder: number; codeStatus: DetailCodeStatus
}

interface CodeGroupFilter {
  groupId: string; groupName: string
  status: CodeGroupStatus | 'ALL'
  codeId: string; codeName: string
}
```

---

## UX Rules

- 조회는 명시적으로 [조회] 버튼을 눌러야만 실행된다. 페이지 진입 시 자동 조회하지 않는다.
- Toolbar(`+ 그룹코드 추가` 버튼)는 로딩 중이 아닌 모든 상태에서 항상 표시된다.
- SummaryBar는 `displayed.length > 0`인 경우에만 렌더링한다. 결과가 없으면 숨긴다.
- 비활성 그룹 수가 0이면 SummaryBar에서 비활성 카드를 숨긴다.
- `displayed.length === 0`(미조회 포함)이면 테이블 영역에 "조회 버튼을 눌러 공통코드 목록을 불러오세요." 메시지를 표시한다.
- 그룹코드ID는 신규 등록 시 `nextGroupId(allGroups)`로 자동 채번되어 입력 필드 초기값으로 설정된다. 사용자가 직접 수정할 수 있다.
- AddGroupModal의 상태 필드는 `<select>` 드롭다운(활성/비활성)으로 구성한다. 기본값은 ACTIVE.
- AddGroupModal에서 [등록] 시 groupId·groupName 미입력이면 각 필드 하단에 "필수" 오류를 표시하고 제출을 차단한다.
- 페이지 기본 크기는 7건이며 7·14·30·50·100건으로 변경할 수 있다. 페이지 크기 변경 시 page를 1로 초기화한다.
- updatedBy / updatedAt은 저장 시 currentUser와 현재 시각(ISO 초 단위, `YYYY-MM-DD HH:mm:ss` 형식)으로 자동 갱신한다.
- `[스펙]` 버튼을 클릭하면 SpecModal이 열리며 현재 spec.md 내용을 표시한다.
