export type RoleType       = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'VIEWER'
export type RoleStatusType = 'ACTIVE' | 'SUSPENDED' | 'DEPRECATED'
export type ActionType     = 'READ' | 'WRITE'

export interface MenuPermission {
  menuId: string
  menuName: string
  read: boolean
  write: boolean
}

export interface RoleMember {
  operatorId: string
  name: string
  loginId: string
  department: string
  assignedAt: string
}

export interface Role {
  roleId: string
  roleType: RoleType
  name: string
  description: string
  status: RoleStatusType
  sortOrder: number
  memberCount: number
  permissions: MenuPermission[]
  members: RoleMember[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export const ROLE_TYPE_LABEL: Record<RoleType, string> = {
  SUPER_ADMIN: '최고 관리자',
  ADMIN:       '관리자',
  OPERATOR:    '운영자',
  VIEWER:      '조회자',
}

export const ROLE_STATUS_LABEL: Record<RoleStatusType, string> = {
  ACTIVE:     '활성',
  SUSPENDED:  '중지',
  DEPRECATED: '폐기',
}

export const MOCK_ROLES: Role[] = [
  {
    roleId: 'ROLE-001', roleType: 'SUPER_ADMIN',
    name: '최고 관리자', description: '모든 프로그램에 대한 조회·수정 권한을 보유한다.',
    status: 'ACTIVE', sortOrder: 1, memberCount: 1,
    permissions: [
      { menuId: 'order',     menuName: '주문 관리',   read: true,  write: true  },
      { menuId: 'inventory', menuName: '재고 관리',   read: true,  write: true  },
      { menuId: 'product',   menuName: '상품 관리',   read: true,  write: true  },
      { menuId: 'member',    menuName: '회원 관리',   read: true,  write: true  },
      { menuId: 'settle',    menuName: '정산 관리',   read: true,  write: true  },
      { menuId: 'system',    menuName: '시스템 관리', read: true,  write: true  },
    ],
    members: [
      { operatorId: 'OPR-001', name: '김관리', loginId: 'admin.kim', department: '플랫폼운영팀', assignedAt: '2025-01-10' },
    ],
    createdBy: 'system', createdAt: '2025-01-01 00:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-01-10 09:00:00',
  },
  {
    roleId: 'ROLE-002', roleType: 'ADMIN',
    name: '관리자', description: '주요 도메인의 조회·수정 권한을 보유하며, 시스템 관리는 제외된다.',
    status: 'ACTIVE', sortOrder: 2, memberCount: 1,
    permissions: [
      { menuId: 'order',     menuName: '주문 관리',   read: true,  write: false },
      { menuId: 'inventory', menuName: '재고 관리',   read: true,  write: true  },
      { menuId: 'product',   menuName: '상품 관리',   read: true,  write: true  },
      { menuId: 'member',    menuName: '회원 관리',   read: true,  write: false },
      { menuId: 'settle',    menuName: '정산 관리',   read: true,  write: false },
      { menuId: 'system',    menuName: '시스템 관리', read: false, write: false },
    ],
    members: [
      { operatorId: 'OPR-003', name: '박상품', loginId: 'prod.park', department: '상품기획팀', assignedAt: '2025-06-01' },
    ],
    createdBy: 'system', createdAt: '2025-01-01 00:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-06-01 09:00:00',
  },
  {
    roleId: 'ROLE-003', roleType: 'OPERATOR',
    name: '운영자', description: '주문·재고 조회 및 주문 상태 변경 권한을 보유한다.',
    status: 'ACTIVE', sortOrder: 3, memberCount: 3,
    permissions: [
      { menuId: 'order',     menuName: '주문 관리',   read: true,  write: true  },
      { menuId: 'inventory', menuName: '재고 관리',   read: true,  write: false },
      { menuId: 'product',   menuName: '상품 관리',   read: true,  write: false },
      { menuId: 'member',    menuName: '회원 관리',   read: true,  write: false },
      { menuId: 'settle',    menuName: '정산 관리',   read: false, write: false },
      { menuId: 'system',    menuName: '시스템 관리', read: false, write: false },
    ],
    members: [
      { operatorId: 'OPR-002', name: '이운영', loginId: 'ops.lee',   department: '커머스운영팀', assignedAt: '2025-03-15' },
      { operatorId: 'OPR-005', name: '정정지', loginId: 'susp.jung', department: '외부협력팀',   assignedAt: '2025-09-20' },
      { operatorId: 'OPR-006', name: '한탈퇴', loginId: 'withd.han', department: '물류운영팀',   assignedAt: '2025-04-11' },
    ],
    createdBy: 'system', createdAt: '2025-01-01 00:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-09-20 09:00:00',
  },
  {
    roleId: 'ROLE-004', roleType: 'VIEWER',
    name: '조회자', description: '지정된 프로그램에 대한 조회 전용 권한만 보유한다.',
    status: 'ACTIVE', sortOrder: 4, memberCount: 1,
    permissions: [
      { menuId: 'order',     menuName: '주문 관리',   read: true,  write: false },
      { menuId: 'inventory', menuName: '재고 관리',   read: true,  write: false },
      { menuId: 'product',   menuName: '상품 관리',   read: true,  write: false },
      { menuId: 'member',    menuName: '회원 관리',   read: false, write: false },
      { menuId: 'settle',    menuName: '정산 관리',   read: true,  write: false },
      { menuId: 'system',    menuName: '시스템 관리', read: false, write: false },
    ],
    members: [
      { operatorId: 'OPR-004', name: '최조회', loginId: 'view.choi', department: '경영지원팀', assignedAt: '2026-01-08' },
    ],
    createdBy: 'system', createdAt: '2025-01-01 00:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-01-08 11:00:00',
  },
]

export function nextRoleId(roles: Role[]): string {
  const max = roles.reduce((acc, r) => {
    const n = parseInt(r.roleId.replace('ROLE-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `ROLE-${String(max + 1).padStart(3, '0')}`
}

export const DEFAULT_MENU_PERMISSIONS: MenuPermission[] = [
  { menuId: 'order',     menuName: '주문 관리',   read: false, write: false },
  { menuId: 'inventory', menuName: '재고 관리',   read: false, write: false },
  { menuId: 'product',   menuName: '상품 관리',   read: false, write: false },
  { menuId: 'member',    menuName: '회원 관리',   read: false, write: false },
  { menuId: 'settle',    menuName: '정산 관리',   read: false, write: false },
  { menuId: 'system',    menuName: '시스템 관리', read: false, write: false },
]
