# PermissionsTab (Role) — 탭 정의

## 개요
| 항목 | 내용 |
|------|------|
| 상위 화면 | RoleDetail |
| 편집 가능 | Y |
| 편집 진입 | 툴바 우측 [편집] 버튼 클릭 |
| 페이지 크기 | 조회 5행 / 편집 10행 |

---

## 표시 항목 (조회 모드)

테이블 컬럼 순서: 프로그램 → 조회 → 수정

| 컬럼 | 정렬 | 설명 |
|------|------|------|
| 프로그램 | 좌측 | `permissions[n].menuName` |
| 조회 | 가운데 (`op-perm-cell`) | `read=true`: `<span class="op-perm op-perm--on">✓</span>` / `false`: `<span class="op-perm op-perm--off">—</span>` |
| 수정 | 가운데 (`op-perm-cell`) | `write=true`: `<span class="op-perm op-perm--on">✓</span>` / `false`: `<span class="op-perm op-perm--off">—</span>` |

권한 목록이 없을 때(`pager.slice.length === 0`): `colSpan={3}` 셀에 `"프로그램이 없습니다."` 메시지 표시.

---

## 표시 항목 (편집 모드)

조회·수정 컬럼 셀은 텍스트 span 대신 체크박스(`<input type="checkbox">`)로 전환된다.

| 컬럼 | 설명 |
|------|------|
| 조회 | `<input type="checkbox" checked={p.read}>` — 변경 시 `toggleRead(menuId)` 호출 |
| 수정 | `<input type="checkbox" checked={p.write}>` — 변경 시 `toggleWrite(menuId)` 호출 |

---

## 툴바 구성

| 모드 | 좌측 | 우측 |
|------|------|------|
| 조회 모드 | (빈 span) | [편집] (`btn-tool--toggle`, height 28, padding 0 10px, font-size 12) |
| 편집 모드 | [+ 프로그램 추가] (`btn-tool--add`) | [취소] [저장] |

---

## 인터랙션

| 액션 | 동작 |
|------|------|
| [편집] 버튼 클릭 | `editing = true`, `editPerms = role.permissions` 초기화, 페이저 10행으로 전환 |
| 조회 체크박스 토글 | `toggleRead(menuId)` — `read` 반전; `read`가 `false`가 될 때 `write`도 `false`로 연동 |
| 수정 체크박스 토글 | `toggleWrite(menuId)` — `write` 반전; `write`가 `true`가 될 때 `read`도 `true`로 연동 |
| [+ 프로그램 추가] 클릭 | `showPicker = true`, MenuPickerModal 오픈 |
| MenuPickerModal [추가] 클릭 | 선택한 메뉴를 `read=true, write=false`로 `editPerms`에 append, `showPicker = false` |
| MenuPickerModal [취소] / [✕] 클릭 | `showPicker = false`, 모달 닫기 |
| [저장] 버튼 클릭 | 현재 일시를 `updatedAt`으로 설정, `onSave({ ...role, permissions: editPerms, ... })` 호출, `editing = false` |
| [취소] 버튼 클릭 | `editPerms = role.permissions` 복구, `editing = false` |
| MiniPager 페이지 이동 | 조회 5행 / 편집 10행 단위로 페이지 전환 |

---

## MenuPickerModal 상세

| 항목 | 내용 |
|------|------|
| 목적 | 현재 역할에 등록되지 않은 프로그램(메뉴)을 선택하여 권한 목록에 추가한다 |
| 레이아웃 | `detail-modal--sm` 소형 모달, `zIndex: 200` |
| 후보 목록 | `DEFAULT_MENU_PERMISSIONS`에서 이미 등록된 메뉴(`editPerms`의 `menuId`)를 제외한 항목 |
| 후보 없음 | `"추가 가능한 프로그램이 없습니다."` 메시지만 표시. 테이블·취소·추가 버튼 모두 미렌더링 |
| 컬럼 | 선택(체크박스, width 48, center) / 프로그램 |
| 선택 방식 | 행 클릭 또는 체크박스 클릭으로 토글 (`e.stopPropagation()` 처리); 다중 선택 가능 |
| 추가 버튼 | 선택 수 표시 — `추가 (N)`, 0건이면 `disabled` |
| 초기값 | 추가된 메뉴는 `read=true, write=false`로 설정 |

---

## UX Rules
- 조회 모드: `usePager(role.permissions, 5)`, 편집 모드: `usePager(editPerms, 10)`를 각각 생성하여 `editing` 상태에 따라 `pager`를 전환한다.
- `useEffect([role])`로 role props 변경 시, 편집 모드가 아닌 경우(`!editing`) `editPerms`를 `role.permissions`로 동기화한다.
- 조회(`read`)를 해제하면 수정(`write`)도 강제 해제: `{ read: false, write: false }`.
- 수정(`write`)을 활성화하면 조회(`read`)도 강제 활성화: `{ write: true, read: true }`.
- 저장 시 `updatedBy`는 props `currentUser`로, `updatedAt`은 `new Date()`를 `'YYYY-MM-DD HH:mm:ss'` 포맷으로 변환해 기록한다.
- 기본 메뉴 목록(`DEFAULT_MENU_PERMISSIONS`): 주문 관리 / 재고 관리 / 상품 관리 / 회원 관리 / 정산 관리 / 시스템 관리 (6개).
- MenuPickerModal은 `zIndex: 200`으로 상세 모달 위에 렌더링된다.
- MenuPickerModal에서 후보가 없을 때는 취소/추가 버튼 자체가 렌더링되지 않는다.
