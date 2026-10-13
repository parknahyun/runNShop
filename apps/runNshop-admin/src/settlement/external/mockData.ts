// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PartnerType = 'PG' | 'LOGISTICS' | 'ADVERTISER' | 'PLATFORM'

export type ExternalSettlementStatus = 'PENDING' | 'PAID'

export interface ExternalSettlement {
  externalSettlementId: string
  settlementMonth: string        // YYYY-MM
  partnerType: PartnerType
  partnerName: string
  billingAmount: number
  paidAmount: number
  status: ExternalSettlementStatus
  billingDate: string            // YYYY-MM-DD
  paidDate: string | null
  description: string
  createdAt: string
  updatedAt: string
}

export interface ExternalSettlementFilter {
  keyword: string
  partnerType: PartnerType | 'ALL'
  status: ExternalSettlementStatus | 'ALL'
  monthFrom: string
  monthTo: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const PARTNER_TYPE_LABEL: Record<PartnerType, string> = {
  PG: 'PG사',
  LOGISTICS: '물류사',
  ADVERTISER: '광고주',
  PLATFORM: '플랫폼',
}

export const EXTERNAL_SETTLEMENT_STATUS_LABEL: Record<ExternalSettlementStatus, string> = {
  PENDING: '청구대기',
  PAID: '지급완료',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_EXTERNAL_SETTLEMENTS: ExternalSettlement[] = [
  {
    externalSettlementId: 'EXT-001', settlementMonth: '2026-06', partnerType: 'PG', partnerName: '토스페이먼츠',
    billingAmount: 4820000, paidAmount: 4820000, status: 'PAID',
    billingDate: '2026-07-01', paidDate: '2026-07-05', description: '6월 PG 결제 수수료',
    createdAt: '2026.07.01 09:00', updatedAt: '2026.07.05 14:20',
  },
  {
    externalSettlementId: 'EXT-002', settlementMonth: '2026-06', partnerType: 'LOGISTICS', partnerName: 'CJ대한통운',
    billingAmount: 9350000, paidAmount: 0, status: 'PENDING',
    billingDate: '2026-07-02', paidDate: null, description: '6월 택배 배송비',
    createdAt: '2026.07.02 09:00', updatedAt: '2026.07.02 09:00',
  },
  {
    externalSettlementId: 'EXT-003', settlementMonth: '2026-06', partnerType: 'ADVERTISER', partnerName: '네이버 검색광고',
    billingAmount: 2100000, paidAmount: 2100000, status: 'PAID',
    billingDate: '2026-07-01', paidDate: '2026-07-04', description: '6월 검색광고 집행비 정산',
    createdAt: '2026.07.01 09:00', updatedAt: '2026.07.04 11:10',
  },
  {
    externalSettlementId: 'EXT-004', settlementMonth: '2026-05', partnerType: 'PLATFORM', partnerName: '카카오스타일 제휴',
    billingAmount: 1500000, paidAmount: 0, status: 'PENDING',
    billingDate: '2026-06-02', paidDate: null, description: '5월 제휴 트래픽 유입 수수료',
    createdAt: '2026.06.02 09:00', updatedAt: '2026.06.02 09:00',
  },
  {
    externalSettlementId: 'EXT-005', settlementMonth: '2026-05', partnerType: 'PG', partnerName: 'NHN KCP',
    billingAmount: 3100000, paidAmount: 3100000, status: 'PAID',
    billingDate: '2026-06-01', paidDate: '2026-06-05', description: '5월 PG 결제 수수료',
    createdAt: '2026.06.01 09:00', updatedAt: '2026.06.05 10:40',
  },
  {
    externalSettlementId: 'EXT-006', settlementMonth: '2026-05', partnerType: 'LOGISTICS', partnerName: '한진택배',
    billingAmount: 6200000, paidAmount: 6200000, status: 'PAID',
    billingDate: '2026-06-02', paidDate: '2026-06-08', description: '5월 택배 배송비',
    createdAt: '2026.06.02 09:00', updatedAt: '2026.06.08 13:00',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function filterExternalSettlements(items: ExternalSettlement[], filter: ExternalSettlementFilter): ExternalSettlement[] {
  return items.filter((e) => {
    if (filter.keyword.trim() && !e.partnerName.toLowerCase().includes(filter.keyword.trim().toLowerCase())) return false
    if (filter.partnerType !== 'ALL' && e.partnerType !== filter.partnerType) return false
    if (filter.status !== 'ALL' && e.status !== filter.status) return false
    if (filter.monthFrom && e.settlementMonth < filter.monthFrom) return false
    if (filter.monthTo && e.settlementMonth > filter.monthTo) return false
    return true
  })
}

export function nextExternalSettlementId(items: ExternalSettlement[]): string {
  const max = items.reduce((acc, e) => {
    const n = parseInt(e.externalSettlementId.replace('EXT-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `EXT-${String(max + 1).padStart(3, '0')}`
}
