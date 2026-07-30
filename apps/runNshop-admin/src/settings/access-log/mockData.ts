// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemberAccessType = 'LIST' | 'DETAIL'

export interface MemberAccessLog {
  logId: string
  operatorName: string
  operatorRole: string
  accessType: MemberAccessType
  searchKeyword: string
  memberName: string
  resultCount: number | null
  accessIp: string
  accessAt: string
}

export interface MemberAccessLogFilter {
  keyword: string
  accessType: MemberAccessType | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const MEMBER_ACCESS_TYPE_LABEL: Record<MemberAccessType, string> = {
  LIST:   '목록조회',
  DETAIL: '상세조회',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_MEMBER_ACCESS_LOGS: MemberAccessLog[] = [
  { logId: 'LOG-001', operatorName: '김민지', operatorRole: 'CS', accessType: 'LIST',   searchKeyword: '010-****-5678', memberName: '-',      resultCount: 3,    accessIp: '10.0.2.15', accessAt: '2026-07-01 09:12:03' },
  { logId: 'LOG-002', operatorName: '김민지', operatorRole: 'CS', accessType: 'DETAIL', searchKeyword: '홍*동',         memberName: '홍*동',  resultCount: null, accessIp: '10.0.2.15', accessAt: '2026-07-01 09:12:20' },
  { logId: 'LOG-003', operatorName: '박서준', operatorRole: 'MD', accessType: 'LIST',   searchKeyword: '박*희',         memberName: '-',      resultCount: 1,    accessIp: '10.0.3.42', accessAt: '2026-07-02 10:05:11' },
  { logId: 'LOG-004', operatorName: '박서준', operatorRole: 'MD', accessType: 'DETAIL', searchKeyword: '박*희',         memberName: '박*희',  resultCount: null, accessIp: '10.0.3.42', accessAt: '2026-07-02 10:05:30' },
  { logId: 'LOG-005', operatorName: '이하늘', operatorRole: 'CS', accessType: 'LIST',   searchKeyword: '010-****-2231', memberName: '-',      resultCount: 2,    accessIp: '10.0.2.19', accessAt: '2026-07-02 14:22:45' },
  { logId: 'LOG-006', operatorName: '이하늘', operatorRole: 'CS', accessType: 'DETAIL', searchKeyword: '김*수',         memberName: '김*수',  resultCount: null, accessIp: '10.0.2.19', accessAt: '2026-07-02 14:23:02' },
  { logId: 'LOG-007', operatorName: '최운영', operatorRole: 'ADMIN', accessType: 'LIST',   searchKeyword: '이*미',       memberName: '-',      resultCount: 1,    accessIp: '10.0.1.5',  accessAt: '2026-07-03 08:40:19' },
  { logId: 'LOG-008', operatorName: '최운영', operatorRole: 'ADMIN', accessType: 'DETAIL', searchKeyword: '이*미',       memberName: '이*미',  resultCount: null, accessIp: '10.0.1.5',  accessAt: '2026-07-03 08:40:55' },
  { logId: 'LOG-009', operatorName: '김민지', operatorRole: 'CS', accessType: 'LIST',   searchKeyword: '010-****-8890', memberName: '-',      resultCount: 4,    accessIp: '10.0.2.15', accessAt: '2026-07-05 11:15:07' },
  { logId: 'LOG-010', operatorName: '박서준', operatorRole: 'MD', accessType: 'DETAIL', searchKeyword: '정*영',         memberName: '정*영',  resultCount: null, accessIp: '10.0.3.42', accessAt: '2026-07-06 16:50:33' },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterMemberAccessLogs(
  items: MemberAccessLog[], filter: MemberAccessLogFilter
): MemberAccessLog[] {
  return items.filter((log) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!log.operatorName.toLowerCase().includes(kw) && !log.memberName.toLowerCase().includes(kw)) return false
    }
    if (filter.accessType !== 'ALL' && log.accessType !== filter.accessType) return false
    if (filter.from) {
      const day = log.accessAt.slice(0, 10)
      if (day < filter.from) return false
    }
    if (filter.to) {
      const day = log.accessAt.slice(0, 10)
      if (day > filter.to) return false
    }
    return true
  })
}
