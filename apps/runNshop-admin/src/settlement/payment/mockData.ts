// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettlementPaymentStatus = 'SCHEDULED' | 'PAID' | 'HOLD' | 'FAILED'

export interface SettlementPayment {
  paymentId: string
  settlementNo: string
  vendorName: string
  bankCode: string
  accountNo: string        // 마스킹된 계좌번호, 예) 110-***-5678
  accountHolder: string
  paymentAmount: number
  scheduledDate: string     // YYYY-MM-DD
  status: SettlementPaymentStatus
  paidAt: string | null
  holdReason: string | null
  createdAt: string
  updatedAt: string
}

export interface SettlementPaymentFilter {
  keyword: string
  status: SettlementPaymentStatus | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const SETTLEMENT_PAYMENT_STATUS_LABEL: Record<SettlementPaymentStatus, string> = {
  SCHEDULED: '지급예정',
  PAID: '지급완료',
  HOLD: '보류',
  FAILED: '지급실패',
}

export const BANK_NAME_LABEL: Record<string, string> = {
  '004': '국민은행',
  '088': '신한은행',
  '020': '우리은행',
  '011': '농협은행',
  '090': '카카오뱅크',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_SETTLEMENT_PAYMENTS: SettlementPayment[] = [
  {
    paymentId: 'PAY-001', settlementNo: 'STL-202605-00014', vendorName: '뉴발란스',
    bankCode: '004', accountNo: '123-***-4567', accountHolder: '(주)뉴발란스코리아',
    paymentAmount: 27550000, scheduledDate: '2026-06-10',
    status: 'SCHEDULED', paidAt: null, holdReason: null,
    createdAt: '2026.06.01 10:05', updatedAt: '2026.06.01 10:05',
  },
  {
    paymentId: 'PAY-002', settlementNo: 'STL-202605-00015', vendorName: '살로몬코리아',
    bankCode: '088', accountNo: '110-***-5678', accountHolder: '(주)살로몬코리아',
    paymentAmount: 19650000, scheduledDate: '2026-06-10',
    status: 'SCHEDULED', paidAt: null, holdReason: null,
    createdAt: '2026.06.02 10:05', updatedAt: '2026.06.02 10:05',
  },
  {
    paymentId: 'PAY-003', settlementNo: 'STL-202604-00021', vendorName: '아식스코리아',
    bankCode: '020', accountNo: '1002-***-890123', accountHolder: '(주)아식스코리아',
    paymentAmount: 24800000, scheduledDate: '2026-05-10',
    status: 'PAID', paidAt: '2026.05.10 09:30', holdReason: null,
    createdAt: '2026.05.01 10:05', updatedAt: '2026.05.10 09:30',
  },
  {
    paymentId: 'PAY-004', settlementNo: 'STL-202604-00022', vendorName: '브룩스코리아',
    bankCode: '011', accountNo: '302-***-1234', accountHolder: '(주)브룩스코리아',
    paymentAmount: 15200000, scheduledDate: '2026-05-10',
    status: 'PAID', paidAt: '2026.05.10 09:31', holdReason: null,
    createdAt: '2026.05.01 10:05', updatedAt: '2026.05.10 09:31',
  },
  {
    paymentId: 'PAY-005', settlementNo: 'STL-202604-00023', vendorName: '언더아머코리아',
    bankCode: '090', accountNo: '3333-***-5555', accountHolder: '(주)언더아머코리아',
    paymentAmount: 12300000, scheduledDate: '2026-05-10',
    status: 'HOLD', paidAt: null, holdReason: '입점사 이의제기 2건 검토 중 (지급 보류)',
    createdAt: '2026.05.01 10:05', updatedAt: '2026.05.20 16:30',
  },
  {
    paymentId: 'PAY-006', settlementNo: 'STL-202603-00009', vendorName: '푸마코리아',
    bankCode: '004', accountNo: '234-***-8901', accountHolder: '(주)푸마코리아',
    paymentAmount: 9800000, scheduledDate: '2026-04-10',
    status: 'FAILED', paidAt: null, holdReason: null,
    createdAt: '2026.04.01 10:05', updatedAt: '2026.04.10 09:35',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function filterSettlementPayments(items: SettlementPayment[], filter: SettlementPaymentFilter): SettlementPayment[] {
  return items.filter((p) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !p.settlementNo.toLowerCase().includes(kw) &&
        !p.vendorName.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.status !== 'ALL' && p.status !== filter.status) return false
    if (filter.from && p.scheduledDate < filter.from) return false
    if (filter.to && p.scheduledDate > filter.to) return false
    return true
  })
}
