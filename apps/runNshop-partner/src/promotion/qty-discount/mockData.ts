export type QtyDiscountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'ENDED'

export const QTY_DISCOUNT_STATUS_LABEL: Record<QtyDiscountStatus, string> = {
  PENDING_APPROVAL: '승인대기',
  ACTIVE: '활성',
  REJECTED: '반려',
  ENDED: '종료',
}

export interface DiscountTier {
  min_qty: number
  discount_rate: number
}

export interface QuantityDiscount {
  discount_id: string
  event_name: string
  product_name: string
  tiers: DiscountTier[]
  status: QtyDiscountStatus
  reject_reason: string | null
  start_at: string
  end_at: string
  created_at: string
  updated_at: string
}

// 자사 상품 목록 (product-list mockData 일부 재사용)
export const VENDOR_PRODUCT_NAMES: string[] = [
  '나이키 페가수스 41',
  '나이키 보메로 18',
  '나이키 드라이핏 ADV 러닝 티셔츠',
  '나이키 런닝 캡 드라이핏',
  '나이키 인피니티 런 4',
]

export const MOCK_QTY_DISCOUNTS: QuantityDiscount[] = [
  {
    discount_id: 'QD-2001',
    event_name: '페가수스 2+1 수량할인',
    product_name: '나이키 페가수스 41',
    tiers: [
      { min_qty: 2, discount_rate: 5 },
      { min_qty: 3, discount_rate: 10 },
    ],
    status: 'ACTIVE',
    reject_reason: null,
    start_at: '2026.06.01',
    end_at: '2026.08.31',
    created_at: '2026.05.20 10:00',
    updated_at: '2026.05.22 09:00',
  },
  {
    discount_id: 'QD-2002',
    event_name: '드라이핏 티셔츠 다량구매 할인',
    product_name: '나이키 드라이핏 ADV 러닝 티셔츠',
    tiers: [
      { min_qty: 3, discount_rate: 10 },
      { min_qty: 6, discount_rate: 15 },
      { min_qty: 10, discount_rate: 20 },
    ],
    status: 'PENDING_APPROVAL',
    reject_reason: null,
    start_at: '2026.07.15',
    end_at: '2026.08.15',
    created_at: '2026.07.05 11:30',
    updated_at: '2026.07.05 11:30',
  },
  {
    discount_id: 'QD-2003',
    event_name: '런닝캡 대량 구매 이벤트',
    product_name: '나이키 런닝 캡 드라이핏',
    tiers: [
      { min_qty: 5, discount_rate: 8 },
    ],
    status: 'REJECTED',
    reject_reason: '최소 구간 할인율이 플랫폼 하한(5%) 미만 항목을 포함합니다.',
    start_at: '2026.06.20',
    end_at: '2026.07.20',
    created_at: '2026.06.15 09:00',
    updated_at: '2026.06.16 14:00',
  },
  {
    discount_id: 'QD-2004',
    event_name: '보메로 봄맞이 수량할인',
    product_name: '나이키 보메로 18',
    tiers: [
      { min_qty: 2, discount_rate: 5 },
      { min_qty: 4, discount_rate: 12 },
    ],
    status: 'ENDED',
    reject_reason: null,
    start_at: '2026.03.01',
    end_at: '2026.05.31',
    created_at: '2026.02.20 10:00',
    updated_at: '2026.05.31 23:59',
  },
  {
    discount_id: 'QD-2005',
    event_name: '인피니티 런 4 신제품 수량할인',
    product_name: '나이키 인피니티 런 4',
    tiers: [
      { min_qty: 2, discount_rate: 7 },
      { min_qty: 3, discount_rate: 13 },
    ],
    status: 'PENDING_APPROVAL',
    reject_reason: null,
    start_at: '2026.07.20',
    end_at: '2026.09.20',
    created_at: '2026.07.06 16:40',
    updated_at: '2026.07.06 16:40',
  },
]
