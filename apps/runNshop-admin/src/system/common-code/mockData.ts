export type CodeGroupStatus  = 'ACTIVE' | 'INACTIVE'
export type DetailCodeStatus = 'ACTIVE' | 'SUSPENDED' | 'DEPRECATED'

export interface DetailCode {
  codeId: string
  codeName: string
  codeValue: string
  description: string
  sortOrder: number
  codeStatus: DetailCodeStatus
}

export interface CodeGroup {
  groupId: string
  groupName: string
  description: string
  status: CodeGroupStatus
  codes: DetailCode[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface CodeGroupFilter {
  groupId: string
  groupName: string
  status: CodeGroupStatus | 'ALL'
  codeId: string
  codeName: string
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export const CODE_GROUP_STATUS_LABEL: Record<CodeGroupStatus, string> = {
  ACTIVE:   '활성',
  INACTIVE: '비활성',
}

export const DETAIL_CODE_STATUS_LABEL: Record<DetailCodeStatus, string> = {
  ACTIVE:     '활성',
  SUSPENDED:  '중지',
  DEPRECATED: '폐기',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_CODE_GROUPS: CodeGroup[] = [
  {
    groupId: 'GROUP-001', groupName: '주문 상태', description: '주문의 처리 단계를 나타내는 코드',
    status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-01-10 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-01-10 09:00:00',
    codes: [
      { codeId: 'ORDER_STATUS-001', codeName: '주문 생성',   codeValue: 'CREATED',   description: '주문이 생성된 초기 상태', sortOrder: 1, codeStatus: 'ACTIVE'    },
      { codeId: 'ORDER_STATUS-002', codeName: '주문 확인',   codeValue: 'CONFIRMED', description: '판매자가 주문을 확인한 상태', sortOrder: 2, codeStatus: 'ACTIVE'    },
      { codeId: 'ORDER_STATUS-003', codeName: '배송 중',     codeValue: 'SHIPPING',  description: '상품이 배송 중인 상태', sortOrder: 3, codeStatus: 'ACTIVE'    },
      { codeId: 'ORDER_STATUS-004', codeName: '배송 완료',   codeValue: 'DELIVERED', description: '배송이 완료된 상태', sortOrder: 4, codeStatus: 'ACTIVE'    },
      { codeId: 'ORDER_STATUS-005', codeName: '주문 취소',   codeValue: 'CANCELLED', description: '주문이 취소된 상태', sortOrder: 5, codeStatus: 'ACTIVE'    },
      { codeId: 'ORDER_STATUS-006', codeName: '주문 실패',   codeValue: 'FAILED',    description: '결제 실패 등으로 주문이 실패한 상태', sortOrder: 6, codeStatus: 'SUSPENDED' },
    ],
  },
  {
    groupId: 'GROUP-002', groupName: '결제수단', description: '사용 가능한 결제 수단 유형',
    status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-01-10 09:30:00',
    updatedBy: 'ops.lee', updatedAt: '2026-02-20 14:10:00',
    codes: [
      { codeId: 'PAYMENT_METHOD-001', codeName: '신용카드',    codeValue: 'CREDIT_CARD',     description: '신용카드 결제',          sortOrder: 1, codeStatus: 'ACTIVE'    },
      { codeId: 'PAYMENT_METHOD-002', codeName: '계좌이체',    codeValue: 'BANK_TRANSFER',   description: '실시간 계좌이체',        sortOrder: 2, codeStatus: 'ACTIVE'    },
      { codeId: 'PAYMENT_METHOD-003', codeName: '가상계좌',    codeValue: 'VIRTUAL_ACCOUNT', description: '가상계좌 결제',          sortOrder: 3, codeStatus: 'ACTIVE'    },
      { codeId: 'PAYMENT_METHOD-004', codeName: '간편결제',    codeValue: 'EASY_PAY',        description: '카카오페이/네이버페이 등', sortOrder: 4, codeStatus: 'ACTIVE'    },
      { codeId: 'PAYMENT_METHOD-005', codeName: '무통장입금',  codeValue: 'CASH',            description: '무통장 입금 방식',       sortOrder: 5, codeStatus: 'SUSPENDED' },
    ],
  },
  {
    groupId: 'GROUP-003', groupName: '운영자 상태', description: '시스템 운영자의 계정 상태',
    status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-01-11 10:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-01-11 10:00:00',
    codes: [
      { codeId: 'OPERATOR_STATUS-001', codeName: '신청',   codeValue: 'APPLIED',   description: '계정 등록 신청 상태',    sortOrder: 1, codeStatus: 'ACTIVE' },
      { codeId: 'OPERATOR_STATUS-002', codeName: '활동',   codeValue: 'ACTIVE',    description: '정상 활동 중인 상태',    sortOrder: 2, codeStatus: 'ACTIVE' },
      { codeId: 'OPERATOR_STATUS-003', codeName: '중지',   codeValue: 'SUSPENDED', description: '계정이 일시 중지된 상태', sortOrder: 3, codeStatus: 'ACTIVE' },
      { codeId: 'OPERATOR_STATUS-004', codeName: '탈퇴',   codeValue: 'WITHDRAWN', description: '계정을 탈퇴한 상태',     sortOrder: 4, codeStatus: 'ACTIVE' },
    ],
  },
  {
    groupId: 'GROUP-004', groupName: '권한 유형', description: '시스템 접근 권한 유형',
    status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-01-12 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-03-05 11:30:00',
    codes: [
      { codeId: 'ROLE_TYPE-001', codeName: '최고 관리자', codeValue: 'SUPER_ADMIN', description: '모든 기능에 접근 가능한 최상위 권한',     sortOrder: 1, codeStatus: 'ACTIVE' },
      { codeId: 'ROLE_TYPE-002', codeName: '관리자',      codeValue: 'ADMIN',       description: '대부분의 기능에 접근 가능한 관리자 권한', sortOrder: 2, codeStatus: 'ACTIVE' },
      { codeId: 'ROLE_TYPE-003', codeName: '운영자',      codeValue: 'OPERATOR',    description: '운영 업무 처리를 위한 권한',             sortOrder: 3, codeStatus: 'ACTIVE' },
      { codeId: 'ROLE_TYPE-004', codeName: '조회자',      codeValue: 'VIEWER',      description: '조회만 가능한 읽기 전용 권한',           sortOrder: 4, codeStatus: 'ACTIVE' },
    ],
  },
  {
    groupId: 'GROUP-005', groupName: 'SKU 단위', description: 'SKU 재고 예약 단위 코드',
    status: 'ACTIVE',
    createdBy: 'prod.park', createdAt: '2025-06-01 09:00:00',
    updatedBy: 'prod.park', updatedAt: '2025-06-01 09:00:00',
    codes: [
      { codeId: 'SKU_UNIT-001', codeName: '개',  codeValue: 'EA',  description: '낱개 단위',    sortOrder: 1, codeStatus: 'ACTIVE' },
      { codeId: 'SKU_UNIT-002', codeName: '박스', codeValue: 'BOX', description: '박스 단위',    sortOrder: 2, codeStatus: 'ACTIVE' },
      { codeId: 'SKU_UNIT-003', codeName: '세트', codeValue: 'SET', description: '세트 단위',    sortOrder: 3, codeStatus: 'ACTIVE' },
      { codeId: 'SKU_UNIT-004', codeName: 'kg',  codeValue: 'KG',  description: '무게(kg) 단위', sortOrder: 4, codeStatus: 'ACTIVE' },
      { codeId: 'SKU_UNIT-005', codeName: 'L',   codeValue: 'L',   description: '부피(L) 단위',  sortOrder: 5, codeStatus: 'ACTIVE' },
    ],
  },
  {
    groupId: 'GROUP-006', groupName: '배치 트리거 유형', description: '배치 작업 실행 트리거 방식',
    status: 'ACTIVE',
    createdBy: 'admin.kim', createdAt: '2025-08-15 10:00:00',
    updatedBy: 'ops.lee', updatedAt: '2026-01-22 09:15:00',
    codes: [
      { codeId: 'BATCH_TRIGGER-001', codeName: '스케줄', codeValue: 'SCHEDULE', description: '크론 스케줄에 따른 자동 실행',   sortOrder: 1, codeStatus: 'ACTIVE'    },
      { codeId: 'BATCH_TRIGGER-002', codeName: '수동',   codeValue: 'MANUAL',   description: '운영자 수동 실행',             sortOrder: 2, codeStatus: 'ACTIVE'    },
      { codeId: 'BATCH_TRIGGER-003', codeName: '이벤트', codeValue: 'EVENT',    description: '이벤트 발생 시 자동 실행',     sortOrder: 3, codeStatus: 'ACTIVE'    },
      { codeId: 'BATCH_TRIGGER-004', codeName: '연쇄',   codeValue: 'CHAIN',    description: '이전 배치 완료 후 연쇄 실행', sortOrder: 4, codeStatus: 'SUSPENDED' },
    ],
  },
  {
    groupId: 'GROUP-007', groupName: '레거시 코드', description: '구 시스템에서 이관된 코드 그룹 (현재 미사용)',
    status: 'INACTIVE',
    createdBy: 'admin.kim', createdAt: '2024-03-10 09:00:00',
    updatedBy: 'admin.kim', updatedAt: '2025-12-01 16:00:00',
    codes: [
      { codeId: 'LEGACY_CODE-001', codeName: '구 주문 유형 A', codeValue: 'ORD_TYPE_A',  description: '구 시스템 주문 유형 A',   sortOrder: 1, codeStatus: 'DEPRECATED' },
      { codeId: 'LEGACY_CODE-002', codeName: '구 주문 유형 B', codeValue: 'ORD_TYPE_B',  description: '구 시스템 주문 유형 B',   sortOrder: 2, codeStatus: 'DEPRECATED' },
      { codeId: 'LEGACY_CODE-003', codeName: '구 채널 코드',   codeValue: 'CHANNEL_OLD', description: '구 시스템 판매 채널 코드', sortOrder: 3, codeStatus: 'DEPRECATED' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function filterCodeGroups(all: CodeGroup[], filter: CodeGroupFilter): CodeGroup[] {
  return all.filter((g) => {
    if (filter.groupId   && !g.groupId.toLowerCase().includes(filter.groupId.toLowerCase())) return false
    if (filter.groupName && !g.groupName.includes(filter.groupName)) return false
    if (filter.status !== 'ALL' && g.status !== filter.status) return false
    if (filter.codeId   && !g.codes.some((c) => c.codeId.toLowerCase().includes(filter.codeId.toLowerCase()))) return false
    if (filter.codeName && !g.codes.some((c) => c.codeName.includes(filter.codeName))) return false
    return true
  })
}

export function nextGroupId(groups: CodeGroup[]): string {
  const max = groups.reduce((acc, g) => {
    const n = parseInt(g.groupId.replace('GROUP-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `GROUP-${String(max + 1).padStart(3, '0')}`
}

export function nextCodeId(codes: DetailCode[]): string {
  const max = codes.reduce((acc, c) => {
    const parts = c.codeId.split('-')
    const n = parseInt(parts[parts.length - 1], 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return String(max + 1).padStart(3, '0')
}
