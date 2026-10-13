// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CartDiscountStatus = 'ACTIVE' | 'ENDED'
export type CartDiscountApplyUnit = 'PLATFORM' | 'VENDOR'
export type CartDiscountType = 'FIXED' | 'RATE'
export type CartDiscountPartialCancelPolicy = 'KEEP' | 'RECALCULATE' | 'DENY'

export interface CartDiscount {
  cartDiscountId: string
  discountName: string
  applyUnit: CartDiscountApplyUnit
  minOrderAmount: number
  discountType: CartDiscountType
  discountValue: number
  maxDiscountAmount: number | null   // discountType === 'RATE' 일 때만 사용
  partialCancelPolicy: CartDiscountPartialCancelPolicy
  startAt: string
  endAt: string
  status: CartDiscountStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface CartDiscountFilter {
  keyword: string
  status: CartDiscountStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const CART_DISCOUNT_STATUS_LABEL: Record<CartDiscountStatus, string> = {
  ACTIVE: '진행중',
  ENDED: '종료',
}

export const CART_DISCOUNT_APPLY_UNIT_LABEL: Record<CartDiscountApplyUnit, string> = {
  PLATFORM: '플랫폼 공통',
  VENDOR: '입점사별',
}

export const CART_DISCOUNT_TYPE_LABEL: Record<CartDiscountType, string> = {
  FIXED: '정액',
  RATE: '정률',
}

export const CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL: Record<CartDiscountPartialCancelPolicy, string> = {
  KEEP: '할인 유지',
  RECALCULATE: '재계산',
  DENY: '부분취소 불가',
}

export function formatCartDiscountValue(c: Pick<CartDiscount, 'discountType' | 'discountValue' | 'maxDiscountAmount'>): string {
  if (c.discountType === 'FIXED') return `${c.discountValue.toLocaleString()}원 할인`
  return `${c.discountValue}% 할인` + (c.maxDiscountAmount ? ` (최대 ${c.maxDiscountAmount.toLocaleString()}원)` : '')
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_CART_DISCOUNTS: CartDiscount[] = [
  {
    cartDiscountId: 'CTD-001', discountName: '5만원 이상 장바구니 할인', applyUnit: 'PLATFORM',
    minOrderAmount: 50000, discountType: 'FIXED', discountValue: 3000, maxDiscountAmount: null,
    partialCancelPolicy: 'RECALCULATE', startAt: '2026-01-01', endAt: '2026-12-31', status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-12-15 09:00', updatedBy: 'admin', updatedAt: '2026-01-05 09:00',
  },
  {
    cartDiscountId: 'CTD-002', discountName: '10만원 이상 무료배송', applyUnit: 'PLATFORM',
    minOrderAmount: 100000, discountType: 'FIXED', discountValue: 3000, maxDiscountAmount: null,
    partialCancelPolicy: 'DENY', startAt: '2026-01-01', endAt: '2026-12-31', status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-12-15 09:00', updatedBy: 'admin', updatedAt: '2026-01-05 09:00',
  },
  {
    cartDiscountId: 'CTD-003', discountName: '입점사별 3만원 이상 5% 할인', applyUnit: 'VENDOR',
    minOrderAmount: 30000, discountType: 'RATE', discountValue: 5, maxDiscountAmount: 5000,
    partialCancelPolicy: 'RECALCULATE', startAt: '2026-06-01', endAt: '2026-06-30', status: 'ACTIVE',
    createdBy: 'editor1', createdAt: '2026-05-20 10:00', updatedBy: 'editor1', updatedAt: '2026-06-01 09:00',
  },
  {
    cartDiscountId: 'CTD-004', discountName: '2025 연말 7만원 이상 할인', applyUnit: 'PLATFORM',
    minOrderAmount: 70000, discountType: 'FIXED', discountValue: 5000, maxDiscountAmount: null,
    partialCancelPolicy: 'KEEP', startAt: '2025-12-01', endAt: '2025-12-31', status: 'ENDED',
    createdBy: 'admin', createdAt: '2025-11-15 09:00', updatedBy: 'admin', updatedAt: '2026-01-01 00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterCartDiscounts(items: CartDiscount[], filter: CartDiscountFilter): CartDiscount[] {
  return items.filter((c) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!c.discountName.toLowerCase().includes(kw) && !c.cartDiscountId.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && c.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _ctdSeq = MOCK_CART_DISCOUNTS.length + 1
export function nextCartDiscountId(): string {
  return `CTD-${String(_ctdSeq++).padStart(3, '0')}`
}
