# MembersTab — 탭 정의

## 개요
| 항목 | 내용 |
|------|------|
| 상위 화면 | RoleDetail |
| 편집 가능 | Y |
| 편집 진입 | 툴바 우측 [편집] 버튼 클릭 |
| 페이지 크기 | 5행 (조회·편집 모드 동일) |

---

## 표시 항목

테이블 컬럼 순서: 운영자 ID → 이름 → 로그인 ID → 부서 → 권한 부여일

| 컬럼 | 설명 |
|------|------|
| 운영자 ID | `members[n].operatorId` — `link-cell` 스타일 (예: OPR-001) |
| 이름 | `members[n].name` |
| 로그인 ID | `members[n].loginId` |
| 부서 | `members[n].department` |
| 권한 부여일 | `members[n].assignedAt` (예: `2025-01-10`) |

소속 운영자가 없을 때(`pager.slice.length === 0`): `colSpan={5}` 셀에 `"소속 운영자가 없습니다."` 메시지 표시.

---

## 툴바 구성

| 모드 | 좌측 | 우측 |
|------|------|------|
| 조회 모드 | (빈 span) | [편집] (`btn-tool--toggle`, height 28, padding 0 10px, font-size 12) |
| 편집 모드 | [+ 운영자 추가] (`btn-tool--add`) | [취소] [저장] |

---

## 편집 항목

편집 모드에서는 테이블 구조가 동일하게 유지되며, 툴바만 편집용으로 전환된다.

| 항목 | 필수 | 설명 |
|------|------|------|
| 소속 운영자 추가 | N | OperatorPickerModal을 통해 복수 선택 후 `editMembers`에 추가 |

---

## 인터랙션

| 액션 | 동작 |
|------|------|
| [편집] 버튼 클릭 | `editing = true`, 편집 모드 전환 |
| [+ 운영자 추가] 버튼 클릭 | `showPicker = true`, OperatorPickerModal 오픈 |
| OperatorPickerModal [추가] 클릭 | 선택한 운영자를 `editMembers`에 append, `showPicker = false` |
| OperatorPickerModal [취소] / [✕] 클릭 | `showPicker = false`, 모달 닫기 |
| [저장] 버튼 클릭 | 현재 일시를 `updatedAt`으로 설정, `memberCount = editMembers.length`로 갱신, `onSave(updated)` 호출, `editing = false` |
| [취소] 버튼 클릭 | `editMembers = role.members` 복구, `editing = false` |
| MiniPager 페이지 이동 | 5행 단위로 멤버 목록 페이지 전환 |

---

## OperatorPickerModal 상세

| 항목 | 내용 |
|------|------|
| 목적 | 현재 역할에 소속되지 않은 운영자를 검색·선택하여 추가한다 |
| 레이아웃 | `detail-modal--sm` 소형 모달, `zIndex: 200` |
| 필터 | 이름 텍스트 입력 / 로그인 ID 텍스트 입력 — `filter-bar` 레이아웃, 실시간 필터링 |
| 후보 목록 컬럼 | 선택(체크박스, width 48, center) / 이름 / 로그인 ID / 부서 |
| 선택 방식 | 행 클릭 또는 체크박스 클릭으로 토글 (`e.stopPropagation()` 처리); 다중 선택 가능 |
| 추가 버튼 | 선택 수 표시 — `추가 (N)`, 0건이면 `disabled` |
| 후보 없음 | `"추가 가능한 운영자가 없습니다."` 메시지 표시. 테이블 미렌더링, 취소/추가 버튼은 후보가 있을 때와 동일하게 항상 표시 |
| assignedAt | 추가 시 현재 날짜 (`new Date().toISOString().slice(0, 10)`, `YYYY-MM-DD`) 자동 설정 |
| 후보 필터링 | `MOCK_OPERATORS`에서 `editMembers`의 `operatorId`를 제외한 목록 + 이름/로그인ID 필터 적용 |

---

## UX Rules
- 조회 모드: `usePager(role.members, 5)`, 편집 모드: `usePager(editMembers, 5)`를 각각 생성하여 `editing` 상태에 따라 `pager`를 전환한다.
- `useEffect([role])`로 role props 변경 시, 편집 모드가 아닌 경우(`!editing`) `editMembers`를 `role.members`로 동기화한다.
- 저장 시 `updatedBy`는 props `currentUser`로, `updatedAt`은 `new Date()`를 `'YYYY-MM-DD HH:mm:ss'` 포맷으로 변환해 기록한다.
- 저장 시 `memberCount`를 `editMembers.length`로 함께 갱신한다.
- OperatorPickerModal은 `zIndex: 200`으로 상세 모달 위에 렌더링된다.
