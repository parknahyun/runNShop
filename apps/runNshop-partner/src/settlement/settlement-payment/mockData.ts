export type SettlementPaymentStatus = 'SCHEDULED' | 'PAID' | 'HOLD' | 'FAILED'

export const SETTLEMENT_PAYMENT_STATUS_LABEL: Record<SettlementPaymentStatus, string> = {
  SCHEDULED: '지급예정',
  PAID: '지급완료',
  HOLD: '보류',
  FAILED: '지급실패',
}

export interface SettlementPayment {
  payment_id: string
  settlement_no: string
  payment_amount: number
  scheduled_date: string
  paid_at: string | null
  status: SettlementPaymentStatus
  hold_reason: string | null
}

export const MOCK_SETTLEMENT_PAYMENTS: SettlementPayment[] = [
  {
    payment_id: 'PAY-202606-00001',
    settlement_no: 'STL-202606-00001',
    payment_amount: 43980000,
    scheduled_date: '2026-07-10',
    paid_at: null,
    status: 'SCHEDULED',
    hold_reason: null,
  },
  {
    payment_id: 'PAY-202605-00001',
    settlement_no: 'STL-202605-00001',
    payment_amount: 38110000,
    scheduled_date: '2026-06-10',
    paid_at: '2026.06.10 09:32',
    status: 'PAID',
    hold_reason: null,
  },
  {
    payment_id: 'PAY-202604-00001',
    settlement_no: 'STL-202604-00001',
    payment_amount: 40790000,
    scheduled_date: '2026-05-10',
    paid_at: '2026.05.10 09:30',
    status: 'PAID',
    hold_reason: null,
  },
  {
    payment_id: 'PAY-202603-00001',
    settlement_no: 'STL-202603-00001',
    payment_amount: 35520000,
    scheduled_date: '2026-04-10',
    paid_at: '2026.04.10 09:28',
    status: 'PAID',
    hold_reason: null,
  },
  {
    payment_id: 'PAY-202602-00001',
    settlement_no: 'STL-202602-00001',
    payment_amount: 27200000,
    scheduled_date: '2026-03-10',
    paid_at: null,
    status: 'HOLD',
    hold_reason: '고객 클레임 조사 완료 전까지 지급 보류',
  },
  {
    payment_id: 'PAY-202601-00001',
    settlement_no: 'STL-202601-00001',
    payment_amount: 31450000,
    scheduled_date: '2026-02-10',
    paid_at: null,
    status: 'FAILED',
    hold_reason: '등록된 계좌 정보 오류로 지급 실패',
  },
]
