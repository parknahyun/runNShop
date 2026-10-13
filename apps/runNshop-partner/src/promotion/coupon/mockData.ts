export type CouponStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'INACTIVE'

export const COUPON_STATUS_LABEL: Record<CouponStatus, string> = {
  PENDING_APPROVAL: '승인대기',
  ACTIVE: '활성',
  REJECTED: '반려',
  INACTIVE: '비활성',
}

export type DiscountType = 'RATE' | 'AMOUNT'

export const DISCOUNT_TYPE_LABEL: Record<DiscountType, string> = {
  RATE: '정률(%)',
  AMOUNT: '정액(원)',
}

export interface VendorCoupon {
  coupon_id: string
  coupon_name: string
  discount_type: DiscountType
  discount_value: number
  min_order_amount: number
  issue_limit: number | null
  issued_count: number
  valid_from: string
  valid_to: string
  status: CouponStatus
  reject_reason: string | null
  created_at: string
  updated_at: string
}

export function formatDiscountValue(c: Pick<VendorCoupon, 'discount_type' | 'discount_value'>): string {
  return c.discount_type === 'RATE' ? `${c.discount_value}%` : `${c.discount_value.toLocaleString()}원`
}

export const MOCK_COUPONS: VendorCoupon[] = [
  {
    coupon_id: 'CPN-1001',
    coupon_name: '나이키 러닝화 10% 할인',
    discount_type: 'RATE',
    discount_value: 10,
    min_order_amount: 50000,
    issue_limit: 1000,
    issued_count: 412,
    valid_from: '2026.06.01',
    valid_to: '2026.08.31',
    status: 'ACTIVE',
    reject_reason: null,
    created_at: '2026.05.20 10:00',
    updated_at: '2026.05.22 09:00',
  },
  {
    coupon_id: 'CPN-1002',
    coupon_name: '신규 회원 5,000원 쿠폰',
    discount_type: 'AMOUNT',
    discount_value: 5000,
    min_order_amount: 30000,
    issue_limit: 500,
    issued_count: 89,
    valid_from: '2026.07.01',
    valid_to: '2026.07.31',
    status: 'PENDING_APPROVAL',
    reject_reason: null,
    created_at: '2026.06.28 14:20',
    updated_at: '2026.06.28 14:20',
  },
  {
    coupon_id: 'CPN-1003',
    coupon_name: '여름 러닝 의류 15% 할인',
    discount_type: 'RATE',
    discount_value: 15,
    min_order_amount: 40000,
    issue_limit: null,
    issued_count: 0,
    valid_from: '2026.07.10',
    valid_to: '2026.08.10',
    status: 'PENDING_APPROVAL',
    reject_reason: null,
    created_at: '2026.07.05 11:00',
    updated_at: '2026.07.05 11:00',
  },
  {
    coupon_id: 'CPN-1004',
    coupon_name: '전상품 3,000원 할인',
    discount_type: 'AMOUNT',
    discount_value: 3000,
    min_order_amount: 10000,
    issue_limit: 2000,
    issued_count: 1834,
    valid_from: '2026.04.01',
    valid_to: '2026.06.30',
    status: 'INACTIVE',
    reject_reason: null,
    created_at: '2026.03.25 09:30',
    updated_at: '2026.06.30 23:59',
  },
  {
    coupon_id: 'CPN-1005',
    coupon_name: '베이퍼플라이 20% 특가 쿠폰',
    discount_type: 'RATE',
    discount_value: 20,
    min_order_amount: 100000,
    issue_limit: 300,
    issued_count: 0,
    valid_from: '2026.07.15',
    valid_to: '2026.07.31',
    status: 'REJECTED',
    reject_reason: '할인율이 플랫폼 카테고리 상한(15%)을 초과합니다.',
    created_at: '2026.06.30 16:00',
    updated_at: '2026.07.01 10:15',
  },
  {
    coupon_id: 'CPN-1006',
    coupon_name: '러닝 액세서리 2,000원 쿠폰',
    discount_type: 'AMOUNT',
    discount_value: 2000,
    min_order_amount: 20000,
    issue_limit: 800,
    issued_count: 233,
    valid_from: '2026.06.15',
    valid_to: '2026.09.15',
    status: 'ACTIVE',
    reject_reason: null,
    created_at: '2026.06.10 13:40',
    updated_at: '2026.06.12 08:00',
  },
  {
    coupon_id: 'CPN-1007',
    coupon_name: '추석 특별 12% 할인',
    discount_type: 'RATE',
    discount_value: 12,
    min_order_amount: 60000,
    issue_limit: 1500,
    issued_count: 0,
    valid_from: '2026.09.20',
    valid_to: '2026.09.30',
    status: 'PENDING_APPROVAL',
    reject_reason: null,
    created_at: '2026.07.06 17:00',
    updated_at: '2026.07.06 17:00',
  },
]
