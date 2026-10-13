# BasicInfoTab (Role) — 탭 정의

## 개요
| 항목 | 내용 |
|------|------|
| 상위 화면 | RoleDetail |
| 편집 가능 | Y |
| 편집 진입 | 탭 콘텐츠 우상단 [편집] 버튼 클릭 |

---

## 표시 항목 (조회 모드)

[편집] 버튼: `tab-panel-content` 최상단에 `display: flex; justifyContent: flex-end` 래퍼로 우측 정렬 배치 (`btn-tool--toggle`, height 28, padding 0 10px, font-size 12).

`info-grid` 내 두 개의 `info-dl`로 좌우 분할 표시:

**좌측 컬럼**
| 항목 | 설명 |
|------|------|
| 권한 ID | `role.roleId` (예: ROLE-001) |
| 권한명 | `role.name` |
| 권한 유형 | RoleBadge (`data-op-role` 속성) |

**우측 컬럼**
| 항목 | 설명 |
|------|------|
| 상태 | RoleStatusBadge (`data-role-status` 속성) |
| 정렬 | `role.sortOrder` |
| 소속 인원 | `{role.memberCount}명` |
| 최초등록 | `{role.createdBy} / {role.createdAt}` |
| 최종수정 | `{role.updatedBy} / {role.updatedAt}` |

`info-grid` 아래: `role.description`이 있을 때 `<p className="pgm-desc">`로 설명 단락 표시.

---

## 편집 항목

편집 모드는 별도 `return` 블록으로 전환 (조회 모드와 완전 분리).

| 항목 | 필수 | 설명 |
|------|------|------|
| 권한명 | Y | 텍스트 입력 (`add-form__field--full`), `*` 표시 |
| 정렬 | N | number 타입 입력, 너비 80px |
| 설명 | N | 텍스트 입력 (`add-form__field--full`) |

편집 폼은 `add-form` 레이아웃(`add-form__row`, `add-form__field`)을 사용한다.
권한 유형(`roleType`)과 상태(`status`)는 편집 폼에 포함되지 않는다(읽기 전용).

폼 하단: [취소] / [저장] 버튼 (`add-form__footer`)

---

## 인터랙션

| 액션 | 동작 |
|------|------|
| [편집] 버튼 클릭 | `editing = true`, 편집 폼 렌더링으로 전환 |
| 권한명 입력 | `editForm.name` 갱신 |
| 정렬 입력 | `editForm.sortOrder` 갱신 (`Number` 형변환) |
| 설명 입력 | `editForm.description` 갱신 |
| [저장] 버튼 클릭 | 현재 일시를 `updatedAt`으로 설정, `onSave(updated)` 호출, `editing = false` |
| [취소] 버튼 클릭 | `editForm`을 원본 `role` 값으로 복구, `editing = false` |

---

## UX Rules
- `useEffect([role])`로 role props 변경 시 `editForm`을 최신값으로 동기화한다.
- 저장 시 `updatedBy`는 props `currentUser`로, `updatedAt`은 `new Date()`를 `'YYYY-MM-DD HH:mm:ss'` 포맷으로 변환해 기록한다.
- 설명(`role.description`)이 빈 문자열이면 `<p>` 단락을 렌더링하지 않는다.
- 권한 유형(RoleBadge) 레이블: 최고 관리자(SUPER_ADMIN) / 관리자(ADMIN) / 운영자(OPERATOR) / 조회자(VIEWER).
- 역할 상태(RoleStatusBadge) 레이블: 활성(ACTIVE) / 중지(SUSPENDED) / 폐기(DEPRECATED).
- `EditForm` 타입: `{ name: string; description: string; sortOrder: number }`.
