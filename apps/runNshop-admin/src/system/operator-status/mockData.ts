export type OperatorRole   = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'VIEWER'
export type OperatorStatus = 'APPLIED' | 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'

export interface OperatorPermission {
  menu: string
  read: boolean
  write: boolean
}

export interface LoginHistory {
  loginAt: string
  ip: string
  device: string
  result: 'SUCCESS' | 'FAIL'
}

export interface ScreenAccessHistory {
  accessAt: string
  menu: string
  screen: string
  action: string
  ip: string
}

export interface Operator {
  operatorId: string
  name: string
  loginId: string
  email: string
  phone: string
  department: string
  role: OperatorRole
  status: OperatorStatus
  permissions: OperatorPermission[]
  loginHistory: LoginHistory[]
  screenHistory: ScreenAccessHistory[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  lastLoginAt: string
}

export const ROLE_LABEL: Record<OperatorRole, string> = {
  SUPER_ADMIN: '최고 관리자',
  ADMIN:       '관리자',
  OPERATOR:    '운영자',
  VIEWER:      '조회자',
}

export const STATUS_LABEL: Record<OperatorStatus, string> = {
  APPLIED:   '신청',
  ACTIVE:    '활동',
  SUSPENDED: '중지',
  WITHDRAWN: '탈퇴',
}

export const MOCK_OPERATORS: Operator[] = [
  {
    operatorId: 'OPR-001', name: '김관리', loginId: 'admin.kim',
    email: 'kim@3top.co.kr', phone: '010-1111-2222',
    department: '플랫폼운영팀', role: 'SUPER_ADMIN', status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-01-10 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-01-10 09:00:00',
    lastLoginAt: '2026-05-19 09:12:03',
    permissions: [
      { menu: '주문 관리',   read: true,  write: true  },
      { menu: '재고 관리',   read: true,  write: true  },
      { menu: '상품 관리',   read: true,  write: true  },
      { menu: '회원 관리',   read: true,  write: true  },
      { menu: '정산 관리',   read: true,  write: true  },
      { menu: '시스템 관리', read: true,  write: true  },
    ],
    loginHistory: [
      { loginAt: '2026-05-19 09:12:03', ip: '220.90.11.2', device: 'Chrome / macOS',  result: 'SUCCESS' },
      { loginAt: '2026-05-18 08:55:41', ip: '220.90.11.2', device: 'Chrome / macOS',  result: 'SUCCESS' },
      { loginAt: '2026-05-17 10:03:17', ip: '220.90.11.5', device: 'Safari / iPhone', result: 'SUCCESS' },
    ],
    screenHistory: [
      { accessAt: '2026-05-19 09:45:11', menu: '시스템 관리', screen: '운영자 현황',    action: '조회', ip: '220.90.11.2' },
      { accessAt: '2026-05-19 09:30:52', menu: '주문 관리',   screen: '주문 현황',      action: '조회', ip: '220.90.11.2' },
      { accessAt: '2026-05-19 09:20:07', menu: '주문 관리',   screen: '주문 상세',      action: '조회', ip: '220.90.11.2' },
      { accessAt: '2026-05-19 09:15:33', menu: '재고 관리',   screen: '재고 예약 현황', action: '조회', ip: '220.90.11.2' },
      { accessAt: '2026-05-18 17:02:44', menu: '상품 관리',   screen: '상품 목록',      action: '수정', ip: '220.90.11.2' },
      { accessAt: '2026-05-18 16:44:19', menu: '회원 관리',   screen: '회원 상세',      action: '조회', ip: '220.90.11.2' },
    ],
  },
  {
    operatorId: 'OPR-002', name: '이운영', loginId: 'ops.lee',
    email: 'lee@3top.co.kr', phone: '010-2222-3333',
    department: '커머스운영팀', role: 'OPERATOR', status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-03-15 10:30:00',
    updatedBy: 'admin.kim', updatedAt: '2025-03-15 10:30:00',
    lastLoginAt: '2026-05-19 08:44:17',
    permissions: [
      { menu: '주문 관리',   read: true,  write: true  },
      { menu: '재고 관리',   read: true,  write: false },
      { menu: '상품 관리',   read: true,  write: false },
      { menu: '회원 관리',   read: true,  write: false },
      { menu: '정산 관리',   read: false, write: false },
      { menu: '시스템 관리', read: false, write: false },
    ],
    loginHistory: [
      { loginAt: '2026-05-19 08:44:17', ip: '119.203.55.10', device: 'Chrome / Windows', result: 'SUCCESS' },
      { loginAt: '2026-05-19 08:43:50', ip: '119.203.55.10', device: 'Chrome / Windows', result: 'FAIL'    },
      { loginAt: '2026-05-18 09:01:22', ip: '119.203.55.10', device: 'Chrome / Windows', result: 'SUCCESS' },
    ],
    screenHistory: [
      { accessAt: '2026-05-19 09:10:05', menu: '주문 관리', screen: '주문 현황',      action: '조회', ip: '119.203.55.10' },
      { accessAt: '2026-05-19 09:05:38', menu: '주문 관리', screen: '주문 상세',      action: '조회', ip: '119.203.55.10' },
      { accessAt: '2026-05-18 14:22:11', menu: '재고 관리', screen: '재고 예약 현황', action: '조회', ip: '119.203.55.10' },
      { accessAt: '2026-05-18 11:55:04', menu: '주문 관리', screen: '주문 현황',      action: '조회', ip: '119.203.55.10' },
    ],
  },
  {
    operatorId: 'OPR-003', name: '박상품', loginId: 'prod.park',
    email: 'park@3top.co.kr', phone: '010-3333-4444',
    department: '상품기획팀', role: 'ADMIN', status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-06-01 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-06-01 09:00:00',
    lastLoginAt: '2026-05-18 17:30:55',
    permissions: [
      { menu: '주문 관리',   read: true,  write: false },
      { menu: '재고 관리',   read: true,  write: true  },
      { menu: '상품 관리',   read: true,  write: true  },
      { menu: '회원 관리',   read: true,  write: false },
      { menu: '정산 관리',   read: true,  write: false },
      { menu: '시스템 관리', read: false, write: false },
    ],
    loginHistory: [
      { loginAt: '2026-05-18 17:30:55', ip: '121.140.22.8', device: 'Edge / Windows', result: 'SUCCESS' },
      { loginAt: '2026-05-17 09:10:04', ip: '121.140.22.8', device: 'Edge / Windows', result: 'SUCCESS' },
    ],
    screenHistory: [
      { accessAt: '2026-05-18 17:55:22', menu: '상품 관리', screen: '상품 목록',      action: '수정', ip: '121.140.22.8' },
      { accessAt: '2026-05-18 17:40:08', menu: '재고 관리', screen: '재고 예약 현황', action: '조회', ip: '121.140.22.8' },
      { accessAt: '2026-05-17 10:33:47', menu: '상품 관리', screen: '상품 상세',      action: '수정', ip: '121.140.22.8' },
    ],
  },
  {
    operatorId: 'OPR-004', name: '최조회', loginId: 'view.choi',
    email: 'choi@3top.co.kr', phone: '010-4444-5555',
    department: '경영지원팀', role: 'VIEWER', status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2026-01-08 11:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-01-08 11:00:00',
    lastLoginAt: '2026-05-16 14:22:10',
    permissions: [
      { menu: '주문 관리',   read: true,  write: false },
      { menu: '재고 관리',   read: true,  write: false },
      { menu: '상품 관리',   read: true,  write: false },
      { menu: '회원 관리',   read: false, write: false },
      { menu: '정산 관리',   read: true,  write: false },
      { menu: '시스템 관리', read: false, write: false },
    ],
    loginHistory: [
      { loginAt: '2026-05-16 14:22:10', ip: '175.45.88.3', device: 'Chrome / macOS', result: 'SUCCESS' },
    ],
    screenHistory: [
      { accessAt: '2026-05-16 14:30:05', menu: '주문 관리', screen: '주문 현황',      action: '조회', ip: '175.45.88.3' },
      { accessAt: '2026-05-16 14:25:18', menu: '재고 관리', screen: '재고 예약 현황', action: '조회', ip: '175.45.88.3' },
    ],
  },
  {
    operatorId: 'OPR-005', name: '정정지', loginId: 'susp.jung',
    email: 'jung@3top.co.kr', phone: '010-5555-6666',
    department: '외부협력팀', role: 'OPERATOR', status: 'SUSPENDED',
    createdBy: 'admin.kim', createdAt: '2025-09-20 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-04-30 12:00:00',
    lastLoginAt: '2026-04-30 11:05:33',
    permissions: [
      { menu: '주문 관리',   read: true,  write: false },
      { menu: '재고 관리',   read: true,  write: false },
      { menu: '상품 관리',   read: false, write: false },
      { menu: '회원 관리',   read: false, write: false },
      { menu: '정산 관리',   read: false, write: false },
      { menu: '시스템 관리', read: false, write: false },
    ],
    loginHistory: [
      { loginAt: '2026-04-30 11:05:33', ip: '58.229.101.7', device: 'Chrome / Windows', result: 'SUCCESS' },
      { loginAt: '2026-04-29 10:44:21', ip: '58.229.101.7', device: 'Chrome / Windows', result: 'SUCCESS' },
    ],
    screenHistory: [
      { accessAt: '2026-04-30 11:20:14', menu: '주문 관리', screen: '주문 현황',      action: '조회', ip: '58.229.101.7' },
      { accessAt: '2026-04-29 10:55:03', menu: '재고 관리', screen: '재고 예약 현황', action: '조회', ip: '58.229.101.7' },
    ],
  },
  {
    operatorId: 'OPR-006', name: '한탈퇴', loginId: 'withd.han',
    email: 'han@3top.co.kr', phone: '010-6666-7777',
    department: '물류운영팀', role: 'OPERATOR', status: 'WITHDRAWN',
    createdBy: 'admin.kim', createdAt: '2025-04-11 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-03-01 10:00:00',
    lastLoginAt: '2026-02-14 16:08:00',
    permissions: [
      { menu: '주문 관리',   read: true,  write: true  },
      { menu: '재고 관리',   read: true,  write: true  },
      { menu: '상품 관리',   read: false, write: false },
      { menu: '회원 관리',   read: false, write: false },
      { menu: '정산 관리',   read: false, write: false },
      { menu: '시스템 관리', read: false, write: false },
    ],
    loginHistory: [
      { loginAt: '2026-02-14 16:08:00', ip: '210.117.34.9', device: 'Firefox / Windows', result: 'SUCCESS' },
    ],
    screenHistory: [
      { accessAt: '2026-02-14 16:15:42', menu: '주문 관리', screen: '주문 현황',      action: '조회', ip: '210.117.34.9' },
      { accessAt: '2026-02-14 16:10:09', menu: '재고 관리', screen: '재고 예약 현황', action: '조회', ip: '210.117.34.9' },
    ],
  },
  {
    operatorId: 'OPR-007', name: '강신청', loginId: 'apply.kang',
    email: 'kang@3top.co.kr', phone: '010-7777-8888',
    department: '마케팅팀', role: 'VIEWER', status: 'APPLIED',
    createdBy: 'apply.kang', createdAt: '2026-05-18 14:30:00',
    updatedBy: 'apply.kang', updatedAt: '2026-05-18 14:30:00',
    lastLoginAt: '—',
    permissions: [
      { menu: '주문 관리',   read: false, write: false },
      { menu: '재고 관리',   read: false, write: false },
      { menu: '상품 관리',   read: false, write: false },
      { menu: '회원 관리',   read: false, write: false },
      { menu: '정산 관리',   read: false, write: false },
      { menu: '시스템 관리', read: false, write: false },
    ],
    loginHistory: [],
    screenHistory: [],
  },
]

export interface OperatorFilter {
  name: string
  loginId: string
  role: OperatorRole | 'ALL'
  status: OperatorStatus | 'ALL'
}

export const DEFAULT_PERMISSIONS: OperatorPermission[] = [
  { menu: '주문 관리',   read: false, write: false },
  { menu: '재고 관리',   read: false, write: false },
  { menu: '상품 관리',   read: false, write: false },
  { menu: '회원 관리',   read: false, write: false },
  { menu: '정산 관리',   read: false, write: false },
  { menu: '시스템 관리', read: false, write: false },
]

export function filterOperators(all: Operator[], filter: OperatorFilter): Operator[] {
  return all.filter((o) => {
    if (filter.name    && !o.name.includes(filter.name))       return false
    if (filter.loginId && !o.loginId.includes(filter.loginId)) return false
    if (filter.role   !== 'ALL' && o.role   !== filter.role)   return false
    if (filter.status !== 'ALL' && o.status !== filter.status) return false
    return true
  })
}

export function nextOperatorId(operators: Operator[]): string {
  const max = operators.reduce((acc, o) => {
    const n = parseInt(o.operatorId.replace('OPR-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `OPR-${String(max + 1).padStart(3, '0')}`
}
