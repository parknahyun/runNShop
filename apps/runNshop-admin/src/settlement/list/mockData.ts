// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettlementStatus = 'CALCULATING' | 'CONFIRMED' | 'PAID' | 'HOLD'

export type SettlementItemType =
  | 'SALES' | 'FEE' | 'SHIPPING' | 'POINT_SHARE' | 'COUPON_SHARE' | 'PENALTY' | 'CARRY_OVER'

export type AdjustmentType = 'RETURN' | 'CANCEL' | 'EXCHANGE'

export interface SettlementItem {
  itemType: SettlementItemType
  amount: number
  description: string
}

export interface SettlementAdjustment {
  adjustmentType: AdjustmentType
  adjustmentAmount: number
  reason: string
  createdAt: string
}

export interface Settlement {
  settlementId: string
  settlementNo: string          // STL-202606-00001 형식
  vendorName: string
  settlementMonth: string       // 2026-06
  status: SettlementStatus
  targetAmount: number
  adjustmentAmount: number
  penaltyAmount: number
  finalAmount: number
  carriedOverAmount: number
  objectionCount: number
  objectionDeadline: string | null   // 확정일 + 5영업일
  confirmedAt: string | null
  confirmedBy: string | null
  items: SettlementItem[]
  adjustments: SettlementAdjustment[]
  createdAt: string
  updatedAt: string
}

export interface SettlementFilter {
  keyword: string
  settlementMonth: string
  status: SettlementStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  CALCULATING: '정산중',
  CONFIRMED: '확정',
  PAID: '지급완료',
  HOLD: '보류',
}

export const SETTLEMENT_ITEM_TYPE_LABEL: Record<SettlementItemType, string> = {
  SALES: '매출',
  FEE: '판매수수료',
  SHIPPING: '배송비 분담',
  POINT_SHARE: '포인트 분담',
  COUPON_SHARE: '쿠폰 분담',
  PENALTY: '패널티',
  CARRY_OVER: '전월 이월',
}

export const ADJUSTMENT_TYPE_LABEL: Record<AdjustmentType, string> = {
  RETURN: '반품',
  CANCEL: '취소',
  EXCHANGE: '교환',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    settlementId: 'STL-001', settlementNo: 'STL-202606-00001', vendorName: '나이키코리아', settlementMonth: '2026-06',
    status: 'CALCULATING',
    targetAmount: 42670000, adjustmentAmount: 0, penaltyAmount: 0, finalAmount: 42670000, carriedOverAmount: 0,
    objectionCount: 0, objectionDeadline: null, confirmedAt: null, confirmedBy: null,
    items: [
      { itemType: 'SALES', amount: 45230000, description: '6월 판매 매출 합계' },
      { itemType: 'FEE', amount: -2261500, description: '판매수수료 5%' },
      { itemType: 'SHIPPING', amount: -180000, description: '배송비 입점사 분담분' },
      { itemType: 'POINT_SHARE', amount: -80000, description: '포인트 사용분 분담' },
      { itemType: 'COUPON_SHARE', amount: -38500, description: '쿠폰 할인 분담' },
    ],
    adjustments: [],
    createdAt: '2026.07.01 03:00', updatedAt: '2026.07.01 03:00',
  },
  {
    settlementId: 'STL-002', settlementNo: 'STL-202606-00002', vendorName: '아디다스코리아', settlementMonth: '2026-06',
    status: 'CALCULATING',
    targetAmount: 31500000, adjustmentAmount: 0, penaltyAmount: 0, finalAmount: 32700000, carriedOverAmount: 1200000,
    objectionCount: 0, objectionDeadline: null, confirmedAt: null, confirmedBy: null,
    items: [
      { itemType: 'SALES', amount: 33200000, description: '6월 판매 매출 합계' },
      { itemType: 'FEE', amount: -1660000, description: '판매수수료 5%' },
      { itemType: 'SHIPPING', amount: -240000, description: '배송비 입점사 분담분' },
      { itemType: 'CARRY_OVER', amount: 1200000, description: '5월 미지급 이월액' },
    ],
    adjustments: [],
    createdAt: '2026.07.01 03:00', updatedAt: '2026.07.01 03:00',
  },
  {
    settlementId: 'STL-003', settlementNo: 'STL-202605-00014', vendorName: '뉴발란스', settlementMonth: '2026-05',
    status: 'CONFIRMED',
    targetAmount: 28900000, adjustmentAmount: -1350000, penaltyAmount: 0, finalAmount: 27550000, carriedOverAmount: 0,
    objectionCount: 1, objectionDeadline: '2026-06-08', confirmedAt: '2026.06.01 10:00', confirmedBy: 'admin.park',
    items: [
      { itemType: 'SALES', amount: 30500000, description: '5월 판매 매출 합계' },
      { itemType: 'FEE', amount: -1525000, description: '판매수수료 5%' },
      { itemType: 'SHIPPING', amount: -75000, description: '배송비 입점사 분담분' },
    ],
    adjustments: [
      { adjustmentType: 'RETURN', adjustmentAmount: -980000, reason: '반품 3건 재정산 (사이즈 불량)', createdAt: '2026.05.29 15:20' },
      { adjustmentType: 'CANCEL', adjustmentAmount: -370000, reason: '출고전 취소 1건 재정산', createdAt: '2026.05.30 11:05' },
    ],
    createdAt: '2026.06.01 03:00', updatedAt: '2026.06.01 10:00',
  },
  {
    settlementId: 'STL-004', settlementNo: 'STL-202605-00015', vendorName: '살로몬코리아', settlementMonth: '2026-05',
    status: 'CONFIRMED',
    targetAmount: 19800000, adjustmentAmount: 0, penaltyAmount: 150000, finalAmount: 19650000, carriedOverAmount: 0,
    objectionCount: 0, objectionDeadline: '2026-06-09', confirmedAt: '2026.06.02 10:00', confirmedBy: 'admin.park',
    items: [
      { itemType: 'SALES', amount: 21000000, description: '5월 판매 매출 합계' },
      { itemType: 'FEE', amount: -1050000, description: '판매수수료 5%' },
      { itemType: 'SHIPPING', amount: -150000, description: '배송비 입점사 분담분' },
      { itemType: 'PENALTY', amount: -150000, description: '발송지연 패널티 (2건)' },
    ],
    adjustments: [],
    createdAt: '2026.06.01 03:00', updatedAt: '2026.06.02 10:00',
  },
  {
    settlementId: 'STL-005', settlementNo: 'STL-202604-00021', vendorName: '아식스코리아', settlementMonth: '2026-04',
    status: 'PAID',
    targetAmount: 25400000, adjustmentAmount: -600000, penaltyAmount: 0, finalAmount: 24800000, carriedOverAmount: 0,
    objectionCount: 0, objectionDeadline: '2026-05-08', confirmedAt: '2026.05.01 10:00', confirmedBy: 'admin.park',
    items: [
      { itemType: 'SALES', amount: 26800000, description: '4월 판매 매출 합계' },
      { itemType: 'FEE', amount: -1340000, description: '판매수수료 5%' },
      { itemType: 'SHIPPING', amount: -60000, description: '배송비 입점사 분담분' },
    ],
    adjustments: [
      { adjustmentType: 'EXCHANGE', adjustmentAmount: -600000, reason: '교환 2건 배송비 재정산', createdAt: '2026.04.28 09:40' },
    ],
    createdAt: '2026.05.01 03:00', updatedAt: '2026.05.03 14:00',
  },
  {
    settlementId: 'STL-006', settlementNo: 'STL-202604-00022', vendorName: '브룩스코리아', settlementMonth: '2026-04',
    status: 'PAID',
    targetAmount: 15200000, adjustmentAmount: 0, penaltyAmount: 0, finalAmount: 15200000, carriedOverAmount: 0,
    objectionCount: 0, objectionDeadline: '2026-05-08', confirmedAt: '2026.05.01 10:00', confirmedBy: 'admin.park',
    items: [
      { itemType: 'SALES', amount: 16000000, description: '4월 판매 매출 합계' },
      { itemType: 'FEE', amount: -800000, description: '판매수수료 5%' },
    ],
    adjustments: [],
    createdAt: '2026.05.01 03:00', updatedAt: '2026.05.03 14:00',
  },
  {
    settlementId: 'STL-007', settlementNo: 'STL-202604-00023', vendorName: '언더아머코리아', settlementMonth: '2026-04',
    status: 'HOLD',
    targetAmount: 12300000, adjustmentAmount: 0, penaltyAmount: 0, finalAmount: 12300000, carriedOverAmount: 0,
    objectionCount: 2, objectionDeadline: '2026-05-08', confirmedAt: '2026.05.01 10:00', confirmedBy: 'admin.park',
    items: [
      { itemType: 'SALES', amount: 13000000, description: '4월 판매 매출 합계' },
      { itemType: 'FEE', amount: -650000, description: '판매수수료 5%' },
      { itemType: 'SHIPPING', amount: -50000, description: '배송비 입점사 분담분' },
    ],
    adjustments: [],
    createdAt: '2026.05.01 03:00', updatedAt: '2026.05.20 16:30',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function filterSettlements(items: Settlement[], filter: SettlementFilter): Settlement[] {
  return items.filter((s) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !s.settlementNo.toLowerCase().includes(kw) &&
        !s.vendorName.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.settlementMonth.trim() && s.settlementMonth !== filter.settlementMonth.trim()) return false
    if (filter.status !== 'ALL' && s.status !== filter.status) return false
    return true
  })
}

/** 확정일시(YYYY.MM.DD HH:mm) 기준 영업일(주말 제외) N일 후 날짜(YYYY-MM-DD)를 계산한다. */
export function addBusinessDays(fromDateTime: string, days: number): string {
  const datePart = fromDateTime.slice(0, 10).replace(/\./g, '-')
  const d = new Date(`${datePart}T00:00:00`)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
