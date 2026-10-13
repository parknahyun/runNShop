// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// cfg_role.role_code 중 자기신청 가능한 역할만 노출 (SUPER_ADMIN은 제외)
export type RequestedRoleCode = 'MD' | 'CS' | 'SETTLEMENT' | 'VENDOR_MANAGER'

export type OperatorApplicationStatus = 'APPLIED' | 'APPROVED' | 'REJECTED'

export interface OperatorApplication {
  applicationId: string
  name: string
  email: string
  requestedRoleCode: RequestedRoleCode
  reason: string
  status: OperatorApplicationStatus
  rejectReason: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface OperatorApplicationFilter {
  keyword: string
  status: OperatorApplicationStatus | 'ALL'
  requestedRoleCode: RequestedRoleCode | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const REQUESTED_ROLE_LABEL: Record<RequestedRoleCode, string> = {
  MD:             'MD',
  CS:             'CS',
  SETTLEMENT:     '정산',
  VENDOR_MANAGER: '입점사관리',
}

export const OPERATOR_APPLICATION_STATUS_LABEL: Record<OperatorApplicationStatus, string> = {
  APPLIED:  '신청',
  APPROVED: '승인',
  REJECTED: '반려',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_OPERATOR_APPLICATIONS: OperatorApplication[] = [
  {
    applicationId: 'OPA-001',
    name: '한지수',
    email: 'jisu.han@runnshop.com',
    requestedRoleCode: 'CS',
    reason: 'CS팀 신규 입사자로, 클레임·문의 응대 업무를 위해 운영자 계정이 필요합니다.',
    status: 'APPLIED',
    rejectReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: '2026-07-05 09:20:00',
    updatedAt: '2026-07-05 09:20:00',
  },
  {
    applicationId: 'OPA-002',
    name: '오세훈',
    email: 'seh.oh@runnshop.com',
    requestedRoleCode: 'MD',
    reason: '러닝화 카테고리 MD 배정으로 상품·전시 관리 권한이 필요합니다.',
    status: 'APPLIED',
    rejectReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: '2026-07-04 14:10:00',
    updatedAt: '2026-07-04 14:10:00',
  },
  {
    applicationId: 'OPA-003',
    name: '배소연',
    email: 'soyeon.bae@runnshop.com',
    requestedRoleCode: 'SETTLEMENT',
    reason: '정산팀 이동으로 정산 조회·처리 권한이 필요합니다.',
    status: 'APPROVED',
    rejectReason: null,
    reviewedBy: 'admin.kim',
    reviewedAt: '2026-07-02 11:00:00',
    createdAt: '2026-07-01 16:40:00',
    updatedAt: '2026-07-02 11:00:00',
  },
  {
    applicationId: 'OPA-004',
    name: '최우진',
    email: 'woojin.choi@partner-vendor.com',
    requestedRoleCode: 'VENDOR_MANAGER',
    reason: '입점사 운영 대행 계약에 따라 입점사 관리 권한 신청합니다.',
    status: 'REJECTED',
    rejectReason: '입점사 소속 외부인력은 VENDOR_MANAGER 권한을 직접 부여하지 않음. 입점사 전용 계정으로 안내.',
    reviewedBy: 'admin.kim',
    reviewedAt: '2026-06-29 10:15:00',
    createdAt: '2026-06-28 09:00:00',
    updatedAt: '2026-06-29 10:15:00',
  },
  {
    applicationId: 'OPA-005',
    name: '정하늘',
    email: 'haneul.jung@runnshop.com',
    requestedRoleCode: 'CS',
    reason: 'CS팀 파견 인력으로 클레임 처리 대응을 위해 신청합니다.',
    status: 'APPLIED',
    rejectReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: '2026-07-06 08:30:00',
    updatedAt: '2026-07-06 08:30:00',
  },
  {
    applicationId: 'OPA-006',
    name: '류다인',
    email: 'dain.ryu@runnshop.com',
    requestedRoleCode: 'MD',
    reason: '트레일러닝 카테고리 신규 MD로 배정되어 상품 등록 권한이 필요합니다.',
    status: 'APPROVED',
    rejectReason: null,
    reviewedBy: 'ops.lee',
    reviewedAt: '2026-06-20 13:20:00',
    createdAt: '2026-06-19 10:00:00',
    updatedAt: '2026-06-20 13:20:00',
  },
  {
    applicationId: 'OPA-007',
    name: '문가영',
    email: 'gayoung.moon@runnshop.com',
    requestedRoleCode: 'SETTLEMENT',
    reason: '정산 자동화 프로젝트 참여를 위한 임시 조회 권한 신청.',
    status: 'REJECTED',
    rejectReason: '임시 프로젝트 목적의 정산 권한은 별도 조회 계정으로 발급하며 상시 운영자 계정으로는 승인하지 않음.',
    reviewedBy: 'ops.lee',
    reviewedAt: '2026-06-15 15:45:00',
    createdAt: '2026-06-14 11:30:00',
    updatedAt: '2026-06-15 15:45:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterOperatorApplications(
  items: OperatorApplication[],
  filter: OperatorApplicationFilter,
): OperatorApplication[] {
  return items.filter((a) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!a.name.toLowerCase().includes(kw) && !a.email.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && a.status !== filter.status) return false
    if (filter.requestedRoleCode !== 'ALL' && a.requestedRoleCode !== filter.requestedRoleCode) return false
    return true
  })
}
