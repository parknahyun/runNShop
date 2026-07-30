export type SettlementStatus = 'CALCULATING' | 'CONFIRMED' | 'PAID' | 'HOLD'

export const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  CALCULATING: '정산중',
  CONFIRMED: '확정',
  PAID: '지급완료',
  HOLD: '보류',
}

export type SettlementItemType =
  | 'SALES'
  | 'FEE'
  | 'SHIPPING'
  | 'POINT_SHARE'
  | 'COUPON_SHARE'
  | 'PENALTY'
  | 'CARRY_OVER'

export const SETTLEMENT_ITEM_TYPE_LABEL: Record<SettlementItemType, string> = {
  SALES: '매출',
  FEE: '판매수수료',
  SHIPPING: '배송비',
  POINT_SHARE: '포인트 분담금',
  COUPON_SHARE: '쿠폰 분담금',
  PENALTY: '페널티',
  CARRY_OVER: '이월금',
}

export type SettlementAdjustmentType = 'RETURN' | 'CANCEL' | 'EXCHANGE'

export const SETTLEMENT_ADJUSTMENT_TYPE_LABEL: Record<SettlementAdjustmentType, string> = {
  RETURN: '반품',
  CANCEL: '취소',
  EXCHANGE: '교환',
}

export interface SettlementItem {
  item_type: SettlementItemType
  amount: number
  description: string
}

export interface SettlementAdjustment {
  adjustment_type: SettlementAdjustmentType
  adjustment_amount: number
  reason: string
  created_at: string
}

export interface Settlement {
  settlement_no: string
  settlement_month: string
  status: SettlementStatus
  target_amount: number
  adjustment_amount: number
  penalty_amount: number
  final_amount: number
  confirmed_at: string | null
  items: SettlementItem[]
  adjustments: SettlementAdjustment[]
}

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    settlement_no: 'STL-202606-00001',
    settlement_month: '2026-06',
    status: 'CALCULATING',
    target_amount: 45230000,
    adjustment_amount: -1250000,
    penalty_amount: 0,
    final_amount: 43980000,
    confirmed_at: null,
    items: [
      { item_type: 'SALES', amount: 52300000, description: '6월 총 매출' },
      { item_type: 'FEE', amount: -5230000, description: '판매수수료 10%' },
      { item_type: 'SHIPPING', amount: -820000, description: '배송비 정산' },
      { item_type: 'POINT_SHARE', amount: -1020000, description: '포인트 분담금' },
    ],
    adjustments: [
      { adjustment_type: 'RETURN', adjustment_amount: -890000, reason: '반품 처리 (사이즈 불만족)', created_at: '2026.06.18 11:20' },
      { adjustment_type: 'CANCEL', adjustment_amount: -360000, reason: '주문 취소', created_at: '2026.06.22 09:05' },
    ],
  },
  {
    settlement_no: 'STL-202605-00001',
    settlement_month: '2026-05',
    status: 'CONFIRMED',
    target_amount: 38900000,
    adjustment_amount: -640000,
    penalty_amount: -150000,
    final_amount: 38110000,
    confirmed_at: '2026.06.03 10:00',
    items: [
      { item_type: 'SALES', amount: 44500000, description: '5월 총 매출' },
      { item_type: 'FEE', amount: -4450000, description: '판매수수료 10%' },
      { item_type: 'SHIPPING', amount: -650000, description: '배송비 정산' },
      { item_type: 'COUPON_SHARE', amount: -500000, description: '쿠폰 분담금' },
      { item_type: 'PENALTY', amount: -150000, description: '배송 지연 페널티' },
    ],
    adjustments: [
      { adjustment_type: 'RETURN', adjustment_amount: -520000, reason: '반품 처리 (오배송)', created_at: '2026.05.20 14:40' },
      { adjustment_type: 'EXCHANGE', adjustment_amount: -120000, reason: '사이즈 교환에 따른 차액', created_at: '2026.05.25 16:10' },
    ],
  },
  {
    settlement_no: 'STL-202604-00001',
    settlement_month: '2026-04',
    status: 'PAID',
    target_amount: 41200000,
    adjustment_amount: -410000,
    penalty_amount: 0,
    final_amount: 40790000,
    confirmed_at: '2026.05.03 10:00',
    items: [
      { item_type: 'SALES', amount: 47000000, description: '4월 총 매출' },
      { item_type: 'FEE', amount: -4700000, description: '판매수수료 10%' },
      { item_type: 'SHIPPING', amount: -700000, description: '배송비 정산' },
      { item_type: 'CARRY_OVER', amount: -400000, description: '전월 이월금 차감' },
    ],
    adjustments: [
      { adjustment_type: 'CANCEL', adjustment_amount: -410000, reason: '주문 취소', created_at: '2026.04.19 13:00' },
    ],
  },
  {
    settlement_no: 'STL-202603-00001',
    settlement_month: '2026-03',
    status: 'PAID',
    target_amount: 35600000,
    adjustment_amount: 0,
    penalty_amount: -80000,
    final_amount: 35520000,
    confirmed_at: '2026.04.03 10:00',
    items: [
      { item_type: 'SALES', amount: 40000000, description: '3월 총 매출' },
      { item_type: 'FEE', amount: -4000000, description: '판매수수료 10%' },
      { item_type: 'SHIPPING', amount: -400000, description: '배송비 정산' },
      { item_type: 'PENALTY', amount: -80000, description: '품절 미처리 페널티' },
    ],
    adjustments: [],
  },
  {
    settlement_no: 'STL-202602-00001',
    settlement_month: '2026-02',
    status: 'HOLD',
    target_amount: 29800000,
    adjustment_amount: -2100000,
    penalty_amount: -500000,
    final_amount: 27200000,
    confirmed_at: null,
    items: [
      { item_type: 'SALES', amount: 34000000, description: '2월 총 매출' },
      { item_type: 'FEE', amount: -3400000, description: '판매수수료 10%' },
      { item_type: 'SHIPPING', amount: -600000, description: '배송비 정산' },
      { item_type: 'PENALTY', amount: -500000, description: '고객 클레임 다수 발생으로 보류' },
    ],
    adjustments: [
      { adjustment_type: 'RETURN', adjustment_amount: -1800000, reason: '대량 반품 (품질 이슈) — 조사중', created_at: '2026.02.24 10:30' },
      { adjustment_type: 'CANCEL', adjustment_amount: -300000, reason: '주문 취소', created_at: '2026.02.26 15:00' },
    ],
  },
]
