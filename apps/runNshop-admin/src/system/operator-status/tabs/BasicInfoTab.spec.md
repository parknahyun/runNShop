# BasicInfoTab (Operator) — 탭 정의

## Overview
| 항목 | 내용 |
|------|------|
| 상위 화면 | OperatorDetail |
| 편집 가능 | Y |
| 편집 진입 | 우상단 [편집] 버튼 클릭 (`btn-tool btn-tool--toggle` 클래스) |

---

## Layout (조회 모드)

```
┌──────────────────────────────────────────────────┐
│                                         [편집]   │
│  info-grid                                       │
│  ┌──────────────────────┬───────────────────────┐│
│  │ info-dl (왼쪽)       │ info-dl (오른쪽)       ││
│  │ 운영자 ID            │ 부서                   ││
│  │ 이름                 │ 권한 (RoleBadge)        ││
│  │ 로그인 ID            │ 상태 (StatusBadge)      ││
│  │ 이메일               │ 최초등록                ││
│  │ 연락처               │ 최종수정                ││
│  └──────────────────────┴───────────────────────┘│
└──────────────────────────────────────────────────┘
```

## Layout (편집 모드)

```
┌──────────────────────────────────────────────────┐
│  add-form                                        │
│  ┌ row 1 ─────────────────────────────────────┐  │
│  │ 상태 (라디오: 신청|활동|중지|탈퇴)          │  │
│  └────────────────────────────────────────────┘  │
│  ┌ row 2 ──────────────┬─────────────────────┐   │
│  │ 이름 *              │ 이메일               │   │
│  └─────────────────────┴─────────────────────┘   │
│  ┌ row 3 ──────────────┬─────────────────────┐   │
│  │ 연락처              │ 부서                 │   │
│  └─────────────────────┴─────────────────────┘   │
│  ┌ row 4 ─────────────────────────────────────┐  │
│  │ 권한 (셀렉트)                               │  │
│  └────────────────────────────────────────────┘  │
│                           [취소]  [저장]          │
└──────────────────────────────────────────────────┘
```

---

## 표시 항목 (조회 모드)

| 항목 | 설명 |
|------|------|
| 운영자 ID | `operator.operatorId` (예: OPR-001) |
| 이름 | `operator.name` |
| 로그인 ID | `operator.loginId` — 조회 모드에서만 표시, 편집 폼에는 없음 |
| 이메일 | `operator.email` |
| 연락처 | `operator.phone` |
| 부서 | `operator.department` |
| 권한 | RoleBadge 컴포넌트 (`data-op-role` 속성 포함) |
| 상태 | StatusBadge 컴포넌트 (`data-op-status` 속성 포함) |
| 최초등록 | `{operator.createdBy} / {operator.createdAt}` 형식으로 표시 |
| 최종수정 | `{operator.updatedBy} / {operator.updatedAt}` 형식으로 표시 |

레이아웃: `info-grid` 내 두 개의 `info-dl`로 좌우 분할 표시.
- 왼쪽 `info-dl`: 운영자 ID / 이름 / 로그인 ID / 이메일 / 연락처
- 오른쪽 `info-dl`: 부서 / 권한 / 상태 / 최초등록 / 최종수정

---

## 편집 항목

| 항목 | 필수 | 입력 타입 | 설명 |
|------|------|-----------|------|
| 상태 | N | 라디오 버튼 | APPLIED(신청) / ACTIVE(활동) / SUSPENDED(중지) / WITHDRAWN(탈퇴) 4개 |
| 이름 | Y | text | `*` 표시, 필수 |
| 이메일 | N | email | 선택 입력 |
| 연락처 | N | text | 선택 입력 |
| 부서 | N | text | 선택 입력 |
| 권한 | N | select | 최고 관리자 / 관리자 / 운영자 / 조회자 4개 옵션 |

편집 폼은 `add-form` 레이아웃(`add-form__row`, `add-form__field`)을 사용한다.

---

## States

| 상태 | 처리 |
|------|------|
| 조회 모드 (`editing === false`) | `info-grid` 레이아웃으로 운영자 정보 표시, 우상단 [편집] 버튼 노출 |
| 편집 모드 (`editing === true`) | `add-form` 레이아웃의 편집 폼 표시, [취소]/[저장] 버튼 노출 |

---

## Interactions

| 액션 | 동작 |
|------|------|
| [편집] 버튼 클릭 | `setEditing(true)`, draft를 현재 operator 값으로 초기화(`toDraft(operator)`) |
| 상태 라디오 선택 | `draft.status` 갱신 |
| 이름 입력 | `draft.name` 갱신 |
| 이메일 입력 | `draft.email` 갱신 |
| 연락처 입력 | `draft.phone` 갱신 |
| 부서 입력 | `draft.department` 갱신 |
| 권한 셀렉트 변경 | `draft.role` 갱신 |
| [저장] 버튼 클릭 | `onUpdate({ ...operator, ...draft, updatedBy: currentUser, updatedAt: now })` 호출 후 편집 모드 종료 |
| [취소] 버튼 클릭 | `setDraft(toDraft(operator))`로 draft 복구, 편집 모드 종료 |

---

## Props

| prop | 타입 | 설명 |
|------|------|------|
| operator | Operator | 표시·편집할 운영자 데이터 |
| currentUser | string | 저장 시 `updatedBy`에 기록할 현재 사용자 ID |
| onUpdate | (updated: Operator) => void | 저장 완료 시 상위에 변경된 운영자 데이터 전달 |

---

## UX Rules
- `useId()`로 생성한 접두사를 폼 필드 `id`에 적용하여 같은 페이지에 여러 폼이 있을 때 접근성 충돌을 방지한다.
- 로그인 ID는 조회 모드에서만 표시되고 편집 폼에는 존재하지 않는다 (수정 불가).
- 저장 시 `updatedBy`는 props로 전달받은 `currentUser`로, `updatedAt`은 `new Date().toISOString().replace('T',' ').slice(0,19)` 형식(`'YYYY-MM-DD HH:mm:ss'`)으로 기록된다.
- 권한(role) 셀렉트는 SUPER_ADMIN / ADMIN / OPERATOR / VIEWER 4개 옵션을 제공한다.
- 상태 라디오는 `.pgm-status-radio` / `.pgm-status-radio__item` 클래스를 사용하며, 선택된 항목에는 `pgm-status-radio__item--on` 모디파이어를 추가한다.
- 편집 폼 래퍼에는 `style={{ padding: '14px 0 0' }}`이 인라인으로 적용된다.
- [편집] 버튼은 `style={{ height: 28, padding: '0 10px', fontSize: 12 }}` 인라인 스타일로 소형으로 표시된다.
