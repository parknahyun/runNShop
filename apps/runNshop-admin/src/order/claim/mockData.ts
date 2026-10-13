// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClaimType = 'CANCEL' | 'RETURN' | 'EXCHANGE'

export type ClaimStatus = 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'

// 1차 판단은 플랫폼 CS(고객 제출 사진 기준), 입점사 이의제기 가능, 최종 결정은 플랫폼
export type BlameType = 'CUSTOMER' | 'VENDOR' | 'PLATFORM' | 'PENDING'

export type ClaimChannel = 'SELF' | 'COUNSELOR'

export interface ClaimItem {
  orderItemId: string
  productName: string
  quantity: number
  refundAmount: number
  exchangeOption: string | null   // 교환일 때만 값 존재 (예: "색상: 블랙 → 화이트")
  stockRestored: boolean
}

export interface ClaimHistoryEntry {
  at: string
  actor: string
  action: string
  memo?: string
}

export interface Claim {
  claimId: string
  claimNo: string              // CLM-20260622-00001 형식
  platformOrderNo: string
  vendorName: string
  customerName: string
  claimType: ClaimType
  status: ClaimStatus
  blameType: BlameType
  channel: ClaimChannel
  reason: string
  counselorMemo: string
  refundAmount: number
  extraDeliveryFee: number      // 고객 변심 반품 시 추가 배송비 등 (귀책주체 부담 원칙)
  items: ClaimItem[]
  history: ClaimHistoryEntry[]
  createdAt: string
  completedAt: string | null
  updatedBy: string
  updatedAt: string
}

export interface ClaimFilter {
  keyword: string
  claimType: ClaimType | 'ALL'
  status: ClaimStatus | 'ALL'
  blameType: BlameType | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  CANCEL: '취소',
  RETURN: '반품',
  EXCHANGE: '교환',
}

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  REQUESTED: '접수',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  REJECTED: '반려',
}

export const BLAME_TYPE_LABEL: Record<BlameType, string> = {
  CUSTOMER: '고객귀책',
  VENDOR: '입점사귀책',
  PLATFORM: '플랫폼귀책',
  PENDING: '판단중',
}

export const CLAIM_CHANNEL_LABEL: Record<ClaimChannel, string> = {
  SELF: '고객직접',
  COUNSELOR: 'CS접수',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_CLAIMS: Claim[] = [
  {
    claimId: 'CLM-001', claimNo: 'CLM-20260625-00001', platformOrderNo: 'ORD-20260625-014', vendorName: '뉴발란스',
    customerName: '박*희', claimType: 'CANCEL', status: 'COMPLETED', blameType: 'CUSTOMER', channel: 'SELF',
    reason: '단순 변심으로 취소 요청', counselorMemo: '',
    refundAmount: 219000, extraDeliveryFee: 0,
    items: [{ orderItemId: 'OI-014-1', productName: '뉴발란스 퓨얼셀 SC', quantity: 1, refundAmount: 219000, exchangeOption: null, stockRestored: true }],
    history: [
      { at: '2026.06.25 12:10', actor: '박*희', action: '취소 신청' },
      { at: '2026.06.25 12:11', actor: 'system', action: '자동 환불 처리 완료', memo: 'PG 취소·재고 복구' },
    ],
    createdAt: '2026.06.25 12:10', completedAt: '2026.06.25 12:11', updatedBy: 'system', updatedAt: '2026.06.25 12:11',
  },
  {
    claimId: 'CLM-002', claimNo: 'CLM-20260624-00002', platformOrderNo: 'ORD-20260624-041', vendorName: '아디다스코리아',
    customerName: '정*영', claimType: 'RETURN', status: 'PROCESSING', blameType: 'PENDING', channel: 'SELF',
    reason: '사이즈가 맞지 않아 반품합니다', counselorMemo: '',
    refundAmount: 189000, extraDeliveryFee: 3000,
    items: [{ orderItemId: 'OI-041-1', productName: '아디다스 보스턴 13', quantity: 1, refundAmount: 189000, exchangeOption: null, stockRestored: false }],
    history: [
      { at: '2026.06.29 10:05', actor: '정*영', action: '반품 신청', memo: '사진 1장 첨부' },
      { at: '2026.06.29 14:20', actor: 'CS-김민지', action: '반품 배송 접수' },
    ],
    createdAt: '2026.06.29 10:05', completedAt: null, updatedBy: 'CS-김민지', updatedAt: '2026.06.29 14:20',
  },
  {
    claimId: 'CLM-003', claimNo: 'CLM-20260623-00003', platformOrderNo: 'ORD-20260623-033', vendorName: '살로몬코리아',
    customerName: '강*현', claimType: 'EXCHANGE', status: 'REQUESTED', blameType: 'PENDING', channel: 'SELF',
    reason: '색상을 다른 옵션으로 바꾸고 싶어요', counselorMemo: '',
    refundAmount: 0, extraDeliveryFee: 0,
    items: [{ orderItemId: 'OI-033-1', productName: '살로몬 S/LAB 울트라 4', quantity: 1, refundAmount: 0, exchangeOption: '색상: 블랙 → 화이트', stockRestored: false }],
    history: [
      { at: '2026.07.02 09:40', actor: '강*현', action: '교환 신청' },
    ],
    createdAt: '2026.07.02 09:40', completedAt: null, updatedBy: '강*현', updatedAt: '2026.07.02 09:40',
  },
  {
    claimId: 'CLM-004', claimNo: 'CLM-20260622-00004', platformOrderNo: 'ORD-20260622-027', vendorName: '나이키코리아',
    customerName: '서*아', claimType: 'RETURN', status: 'REJECTED', blameType: 'CUSTOMER', channel: 'COUNSELOR',
    reason: '상품 불량으로 보인다는 문의', counselorMemo: '실물 수령 후 검수 결과 사용 흔적 확인, 반품 요건 미충족으로 반려',
    refundAmount: 0, extraDeliveryFee: 0,
    items: [{ orderItemId: 'OI-027-1', productName: '나이키 알파플라이 3', quantity: 1, refundAmount: 0, exchangeOption: null, stockRestored: false }],
    history: [
      { at: '2026.06.30 11:00', actor: 'CS-이수현', action: 'CS 대리 접수', memo: '고객 전화 문의 기반' },
      { at: '2026.07.01 15:30', actor: 'CS-이수현', action: '반려 처리', memo: '사용 흔적 확인' },
    ],
    createdAt: '2026.06.30 11:00', completedAt: '2026.07.01 15:30', updatedBy: 'CS-이수현', updatedAt: '2026.07.01 15:30',
  },
  {
    claimId: 'CLM-005', claimNo: 'CLM-20260621-00005', platformOrderNo: 'ORD-20260621-019', vendorName: '아식스코리아',
    customerName: '임*진', claimType: 'CANCEL', status: 'PROCESSING', blameType: 'PENDING', channel: 'SELF',
    reason: '출고 지연으로 취소 요청', counselorMemo: '',
    refundAmount: 249000, extraDeliveryFee: 0,
    items: [{ orderItemId: 'OI-019-1', productName: '아식스 매직스피드 4', quantity: 1, refundAmount: 249000, exchangeOption: null, stockRestored: false }],
    history: [
      { at: '2026.07.03 08:20', actor: '임*진', action: '취소 신청', memo: '출고 전 예외 취소' },
    ],
    createdAt: '2026.07.03 08:20', completedAt: null, updatedBy: '임*진', updatedAt: '2026.07.03 08:20',
  },
  {
    claimId: 'CLM-006', claimNo: 'CLM-20260620-00006', platformOrderNo: 'ORD-20260623-032', vendorName: '브룩스코리아',
    customerName: '윤*서', claimType: 'RETURN', status: 'COMPLETED', blameType: 'VENDOR', channel: 'SELF',
    reason: '배송 온 상품이 주문한 색상과 다름', counselorMemo: '오배송 확인, 입점사 귀책 확정',
    refundAmount: 229000, extraDeliveryFee: 0,
    items: [{ orderItemId: 'OI-032-1', productName: '브룩스 글리세린 21', quantity: 1, refundAmount: 229000, exchangeOption: null, stockRestored: true }],
    history: [
      { at: '2026.06.27 09:00', actor: '윤*서', action: '반품 신청', memo: '오배송 사진 첨부' },
      { at: '2026.06.27 11:30', actor: 'CS-박도윤', action: '입점사귀책 판단' },
      { at: '2026.06.29 16:00', actor: 'CS-박도윤', action: '검수 완료 · 환불 처리 완료' },
    ],
    createdAt: '2026.06.27 09:00', completedAt: '2026.06.29 16:00', updatedBy: 'CS-박도윤', updatedAt: '2026.06.29 16:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterClaims(items: Claim[], filter: ClaimFilter): Claim[] {
  return items.filter((c) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !c.claimNo.toLowerCase().includes(kw) &&
        !c.platformOrderNo.toLowerCase().includes(kw) &&
        !c.customerName.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.claimType !== 'ALL' && c.claimType !== filter.claimType) return false
    if (filter.status !== 'ALL' && c.status !== filter.status) return false
    if (filter.blameType !== 'ALL' && c.blameType !== filter.blameType) return false
    if (filter.from) {
      const day = c.createdAt.slice(0, 10).replace(/\./g, '-')
      if (day < filter.from) return false
    }
    if (filter.to) {
      const day = c.createdAt.slice(0, 10).replace(/\./g, '-')
      if (day > filter.to) return false
    }
    return true
  })
}
