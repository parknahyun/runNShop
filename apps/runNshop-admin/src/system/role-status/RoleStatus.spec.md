# RoleStatus — UI 정의

## Overview
| 항목 | 내용 |
|------|------|
| 목적 | 시스템의 권한 그룹(Role)을 카드 목록으로 조회하고, 각 권한의 메뉴 접근 권한 및 소속 운영자를 추가·수정·삭제한다 |
| 대상 | 운영자 (어드민) |
| 진입 경로 | 어드민 > 시스템 관리 > 권한 현황 |
| URL | /system/role-status |
| 관련 컴포넌트 | Toolbar, RoleList, RoleBadge, RoleStatusBadge, RoleDetail, AddRoleModal |

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  권한 현황  총 N개 권한 그룹                          [스펙]       │
├──────────────────────────────────────────────────────────────────┤
│                                           [+ 권한 추가]           │
├──────────────────────────────────────────────────────────────────┤
│  카드 그리드 (role-card-grid)                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ [유형뱃지] [상태뱃지] N명│  │ ...               │               │
│  │ 권한명               │  │                     │               │
│  │ 설명                 │  │                     │               │
│  │ [수정 N개] [조회전용 N개]│ │                     │               │
│  └─────────────────────┘  └─────────────────────┘               │
└──────────────────────────────────────────────────────────────────┘

[권한 추가 모달 (small)]
┌────────────────────────────────────┐
│  권한 추가                      [✕] │
├────────────────────────────────────┤
│  권한명* │ 권한 유형(select)         │
│  상태(select)                       │
│  설명 (text input, full width)      │
│  (오류 메시지)                      │
│                  [취소]  [등록]     │
└────────────────────────────────────┘

[권한 상세 모달 → RoleDetail 참조]
```

---

## Components

| 컴포넌트 | 역할 |
|----------|------|
| Toolbar | `+ 권한 추가` 버튼 (`pgm-toolbar` 레이아웃) |
| RoleList | 권한 카드 그리드(`role-card-grid`) 렌더링. 카드 클릭 시 RoleDetail 모달 오픈 |
| RoleBadge | 권한 유형 뱃지 — SUPER_ADMIN/ADMIN/OPERATOR/VIEWER. `data-op-role` 속성 |
| RoleStatusBadge | 권한 상태 뱃지 — ACTIVE/SUSPENDED/DEPRECATED. `data-role-status` 속성 |
| RoleDetail | 선택 권한의 기본 정보·프로그램 접근 권한·소속 운영자를 표시하는 모달 컴포넌트 |
| AddRoleModal | 권한 신규 등록 소형 모달 |

---

## States

| 상태 | 처리 |
|------|------|
| 권한 목록 (기본) | 전체 권한을 카드 그리드로 표시. 자동 조회 (별도 조회 버튼·필터 없음) |
| 카드 — 수정 권한 수 | `role.permissions.filter(p => p.write).length`로 집계하여 "수정 N개" 칩 표시 |
| 카드 — 조회전용 권한 수 | `role.permissions.filter(p => p.read && !p.write).length`로 집계하여 "조회전용 N개" 칩 표시 |
| 유효성 오류 (권한 추가) | 권한명 미입력 시 폼 하단에 "권한명을 입력하세요." 오류 메시지 표시 |

---

## Interactions

| 액션 | 반응 |
|------|------|
| 카드 클릭 | `selected`에 해당 role 설정, RoleDetail 모달 오픈 |
| [+ 권한 추가] 클릭 | `showAdd=true`, AddRoleModal 오픈 |
| 추가 모달 [등록] 클릭 | 권한명 유효성 검사 통과 시 신규 권한을 `allRoles`에 추가, 모달 닫기. `sortOrder`는 기존 최대값 + 1, `memberCount = 0`, `permissions`는 `DEFAULT_MENU_PERMISSIONS` 복사 |
| 추가 모달 [취소] / [✕] 클릭 | 모달 닫기 |
| RoleDetail 저장 | `onSave` 콜백으로 변경된 role 수신. `allRoles` 갱신, `selected` 갱신 |
| 상세 모달 [✕] 클릭 | `selected = null`, 모달 닫기 |

---

## API

```typescript
// 현재 구현은 목(mock) 데이터 기반. 실제 API 연동 시 아래 엔드포인트 사용 예정.

// 권한 목록 조회
GET /api/system/roles
  Response: Role[]

// 권한 상세 조회
GET /api/system/roles/:roleId
  Response: Role (permissions, members 포함)

// 권한 등록
POST /api/system/roles
  Body: { name, roleType, status, description?, sortOrder }
  Response: Role

// 권한 기본 정보 수정
PUT /api/system/roles/:roleId
  Body: { name, description?, sortOrder }
  Response: Role

// 프로그램 접근 권한 수정
PUT /api/system/roles/:roleId/permissions
  Body: MenuPermission[]
  Response: Role

// 소속 운영자 수정
PUT /api/system/roles/:roleId/members
  Body: RoleMember[]
  Response: Role

// 타입 정의
type RoleType       = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'VIEWER'
type RoleStatusType = 'ACTIVE' | 'SUSPENDED' | 'DEPRECATED'

interface Role {
  roleId: string             // 예: ROLE-001
  roleType: RoleType
  name: string
  description: string
  status: RoleStatusType
  sortOrder: number
  memberCount: number
  permissions: MenuPermission[]
  members: RoleMember[]
  createdBy: string
  createdAt: string          // 'YYYY-MM-DD HH:mm:ss'
  updatedBy: string
  updatedAt: string
}

interface MenuPermission {
  menuId: string
  menuName: string
  read: boolean
  write: boolean
}

interface RoleMember {
  operatorId: string
  name: string
  loginId: string
  department: string
  assignedAt: string         // 'YYYY-MM-DD'
}
```

---

## UX Rules

- 권한 목록은 페이지 진입 즉시 전체 카드를 표시한다. 별도 조회 버튼이나 필터 바가 없다.
- 페이지 타이틀(`h1.page-title`) 내부에 `page-title__sub` 스팬으로 "총 N개 권한 그룹" 부제목이 `allRoles.length`를 반영하여 실시간 표시된다.
- 카드(`role-card`)에는 유형 뱃지·상태 뱃지·소속 인원 수(`{memberCount}명`)·권한명·설명·수정 권한 수·조회전용 권한 수가 표시된다.
- 권한 추가 모달의 설명 필드는 텍스트 `<input>` (textarea 아님)이다.
- 권한 추가 시 상태 선택지: 활성(ACTIVE) / 중지(SUSPENDED) / 폐기(DEPRECATED).
- 권한 ID는 시스템이 자동 채번한다 ('ROLE-NNN' 형식). 권한 추가 시 `sortOrder`는 기존 최대 `sortOrder + 1`로 자동 설정된다.
- 상세 모달에서 편집 후 저장하면 `allRoles`와 `selected` 상태가 즉시 갱신된다.
