export type ProgramStatus  = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'
export type ProgramMethod  = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type ProgramType    = 'PAGE' | 'API' | 'BATCH' | 'EVENT'

export type LogRoleGroup = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'VIEWER' | 'SYSTEM'

export const ROLE_GROUP_LABEL: Record<LogRoleGroup, string> = {
  SUPER_ADMIN: '최고 관리자',
  ADMIN:       '관리자',
  OPERATOR:    '운영자',
  VIEWER:      '조회자',
  SYSTEM:      '시스템',
}

export interface ProgramLog {
  calledAt: string
  operatorId: string
  operatorName: string
  roleGroup: LogRoleGroup
  method: ProgramMethod
  requestUri: string
  statusCode: number
  durationMs: number
}

export interface Program {
  programId: string
  name: string
  description: string
  type: ProgramType
  method?: ProgramMethod
  uri: string
  domain: string
  status: ProgramStatus
  version: string
  owner: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  callCount30d: number
  avgDurationMs: number
  errorRate: number
  logs: ProgramLog[]
}

export const STATUS_LABEL: Record<ProgramStatus, string> = {
  ACTIVE:     '운영',
  INACTIVE:   '비활성',
  DEPRECATED: '폐기예정',
}

export const TYPE_LABEL: Record<ProgramType, string> = {
  PAGE:  '화면',
  API:   'API',
  BATCH: '배치',
  EVENT: '이벤트',
}

export const MOCK_PROGRAMS: Program[] = [
  {
    programId: 'PGM-001', name: '주문 내역 조회', description: '기간·상태 조건으로 주문 목록을 조회한다.',
    type: 'PAGE', uri: '/order/order-history', domain: '주문',
    status: 'ACTIVE', version: '1.3.0', owner: '커머스운영팀',
    createdBy: 'admin.kim', createdAt: '2025-01-15 09:00:00',
    updatedBy: 'ops.lee',   updatedAt: '2026-03-10 14:22:00',
    callCount30d: 8420, avgDurationMs: 210, errorRate: 0.1,
    logs: [
      { calledAt: '2026-05-19 09:31:04', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'GET',  requestUri: '/order/order-history?from=2026-05-19&to=2026-05-19', statusCode: 200, durationMs: 198 },
      { calledAt: '2026-05-19 09:05:41', operatorId: 'OPR-002', operatorName: '이운영', roleGroup: 'OPERATOR',    method: 'GET',  requestUri: '/order/order-history?status=FAILED',                 statusCode: 200, durationMs: 223 },
      { calledAt: '2026-05-18 17:02:15', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'GET',  requestUri: '/order/order-history?from=2026-05-18&to=2026-05-18', statusCode: 200, durationMs: 185 },
      { calledAt: '2026-05-18 11:33:07', operatorId: 'OPR-002', operatorName: '이운영', roleGroup: 'OPERATOR',    method: 'GET',  requestUri: '/order/order-history?memberName=김',                  statusCode: 200, durationMs: 241 },
      { calledAt: '2026-05-17 10:14:52', operatorId: 'OPR-003', operatorName: '박상품', roleGroup: 'ADMIN',       method: 'GET',  requestUri: '/order/order-history',                               statusCode: 200, durationMs: 204 },
    ],
  },
  {
    programId: 'PGM-002', name: '주문 상태 변경 API', description: '주문의 상태를 변경하는 내부 API.',
    type: 'API', method: 'PATCH', uri: '/api/orders/{orderId}/status', domain: '주문',
    status: 'ACTIVE', version: '2.0.1', owner: '플랫폼운영팀',
    createdBy: 'admin.kim', createdAt: '2025-02-01 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-04-05 11:00:00',
    callCount30d: 3120, avgDurationMs: 95, errorRate: 0.5,
    logs: [
      { calledAt: '2026-05-19 09:33:11', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'PATCH', requestUri: '/api/orders/ORD-20260519-002/status', statusCode: 200, durationMs: 88  },
      { calledAt: '2026-05-19 09:20:04', operatorId: 'OPR-002', operatorName: '이운영', roleGroup: 'OPERATOR',    method: 'PATCH', requestUri: '/api/orders/ORD-20260519-001/status', statusCode: 200, durationMs: 102 },
      { calledAt: '2026-05-18 15:44:30', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'PATCH', requestUri: '/api/orders/ORD-20260518-005/status', statusCode: 500, durationMs: 312 },
    ],
  },
  {
    programId: 'PGM-003', name: '재고 예약 내역 조회', description: 'SKU별 재고 예약·차감 이벤트 이력을 조회한다.',
    type: 'PAGE', uri: '/inventory/sku-reservation-history', domain: '재고',
    status: 'ACTIVE', version: '1.1.0', owner: '커머스운영팀',
    createdBy: 'admin.kim', createdAt: '2025-03-20 09:00:00',
    updatedBy: 'prod.park', updatedAt: '2026-02-28 09:30:00',
    callCount30d: 4810, avgDurationMs: 330, errorRate: 0.2,
    logs: [
      { calledAt: '2026-05-19 09:16:02', operatorId: 'OPR-002', operatorName: '이운영', roleGroup: 'OPERATOR', method: 'GET', requestUri: '/inventory/sku-reservation-history',                    statusCode: 200, durationMs: 305 },
      { calledAt: '2026-05-18 17:41:55', operatorId: 'OPR-003', operatorName: '박상품', roleGroup: 'ADMIN',    method: 'GET', requestUri: '/inventory/sku-reservation-history?skuId=SKU-SHOE-001', statusCode: 200, durationMs: 348 },
      { calledAt: '2026-05-16 14:31:08', operatorId: 'OPR-004', operatorName: '최조회', roleGroup: 'VIEWER',   method: 'GET', requestUri: '/inventory/sku-reservation-history',                    statusCode: 200, durationMs: 322 },
    ],
  },
  {
    programId: 'PGM-004', name: '운영자 현황 조회', description: '운영자 목록·권한·접근 이력을 관리한다.',
    type: 'PAGE', uri: '/system/operator-status', domain: '시스템',
    status: 'ACTIVE', version: '1.0.2', owner: '플랫폼운영팀',
    createdBy: 'admin.kim', createdAt: '2025-06-01 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-05-01 10:00:00',
    callCount30d: 1230, avgDurationMs: 145, errorRate: 0.0,
    logs: [
      { calledAt: '2026-05-19 09:45:18', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'GET', requestUri: '/system/operator-status', statusCode: 200, durationMs: 140 },
      { calledAt: '2026-05-18 10:12:44', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'GET', requestUri: '/system/operator-status', statusCode: 200, durationMs: 151 },
    ],
  },
  {
    programId: 'PGM-005', name: '일 정산 배치', description: '매일 01:00 실행되는 일 정산 집계 배치.',
    type: 'BATCH', uri: '/batch/daily-settlement', domain: '정산',
    status: 'ACTIVE', version: '3.2.0', owner: '정산팀',
    createdBy: 'admin.kim', createdAt: '2024-11-10 09:00:00',
    updatedBy: 'prod.park', updatedAt: '2026-04-22 08:00:00',
    callCount30d: 30, avgDurationMs: 42000, errorRate: 3.3,
    logs: [
      { calledAt: '2026-05-19 01:00:04', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: '/batch/daily-settlement', statusCode: 200, durationMs: 41200 },
      { calledAt: '2026-05-18 01:00:03', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: '/batch/daily-settlement', statusCode: 200, durationMs: 43500 },
      { calledAt: '2026-05-17 01:00:05', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: '/batch/daily-settlement', statusCode: 500, durationMs: 38100 },
      { calledAt: '2026-05-16 01:00:04', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: '/batch/daily-settlement', statusCode: 200, durationMs: 40800 },
    ],
  },
  {
    programId: 'PGM-006', name: '주문 이벤트 컨슈머', description: '주문 생성 Kafka 이벤트를 소비해 재고를 예약한다.',
    type: 'EVENT', uri: 'kafka://order-created', domain: '재고',
    status: 'ACTIVE', version: '1.4.1', owner: '플랫폼운영팀',
    createdBy: 'admin.kim', createdAt: '2025-01-20 09:00:00',
    updatedBy: 'ops.lee',   updatedAt: '2026-03-15 16:00:00',
    callCount30d: 21400, avgDurationMs: 48, errorRate: 0.1,
    logs: [
      { calledAt: '2026-05-19 09:33:15', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: 'kafka://order-created', statusCode: 200, durationMs: 42 },
      { calledAt: '2026-05-19 09:22:08', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: 'kafka://order-created', statusCode: 200, durationMs: 51 },
      { calledAt: '2026-05-19 09:15:39', operatorId: 'SYSTEM', operatorName: '시스템', roleGroup: 'SYSTEM', method: 'POST', requestUri: 'kafka://order-created', statusCode: 200, durationMs: 45 },
    ],
  },
  {
    programId: 'PGM-007', name: '구 정산 API (v1)', description: '레거시 정산 API — 신규 버전으로 대체 예정.',
    type: 'API', method: 'POST', uri: '/api/v1/settlement', domain: '정산',
    status: 'DEPRECATED', version: '1.0.0', owner: '정산팀',
    createdBy: 'admin.kim', createdAt: '2024-05-01 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2026-01-10 09:00:00',
    callCount30d: 12, avgDurationMs: 520, errorRate: 8.3,
    logs: [
      { calledAt: '2026-05-10 14:22:03', operatorId: 'OPR-001', operatorName: '김관리', roleGroup: 'SUPER_ADMIN', method: 'POST', requestUri: '/api/v1/settlement', statusCode: 200, durationMs: 510 },
    ],
  },
]

export interface ProgramFilter {
  name: string
  domain: string
  type: ProgramType | 'ALL'
  status: ProgramStatus | 'ALL'
}

export function getFilteredPrograms(filter: ProgramFilter): Program[] {
  return MOCK_PROGRAMS.filter((p) => {
    if (filter.name   && !p.name.includes(filter.name))     return false
    if (filter.domain && !p.domain.includes(filter.domain)) return false
    if (filter.type   !== 'ALL' && p.type   !== filter.type)   return false
    if (filter.status !== 'ALL' && p.status !== filter.status) return false
    return true
  })
}

export function getProgramById(id: string): Program | undefined {
  return MOCK_PROGRAMS.find((p) => p.programId === id)
}
