import { MOCK_PRODUCT_CATALOG } from '@/promotion/shared/productCatalog'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuantityDiscountStatus = 'ACTIVE' | 'ENDED'

// 구간설정 수량 산정 기준: 적용상품별(상품마다 개별 카운트) / 적용상품전체(그룹 내 모든 적용상품 합산 카운트)
export type QuantityDiscountTierScope = 'PER_PRODUCT' | 'TOTAL'

export type QuantityDiscountPartialCancelPolicy = 'KEEP' | 'RECALCULATE' | 'DENY'

export interface QuantityDiscountProduct {
  productId: string
  productName: string
  priceSale: number
}

export interface QuantityDiscountTier {
  tierId: string
  minQuantity: number
  maxQuantity: number | null   // null = 상한 없음
  discountRate: number
}

export interface QuantityDiscount {
  quantityDiscountId: string
  eventName: string
  vendorName: string
  startAt: string
  endAt: string
  status: QuantityDiscountStatus
  tierScope: QuantityDiscountTierScope
  partialCancelPolicy: QuantityDiscountPartialCancelPolicy
  products: QuantityDiscountProduct[]
  tiers: QuantityDiscountTier[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface QuantityDiscountFilter {
  keyword: string
  status: QuantityDiscountStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const QUANTITY_DISCOUNT_STATUS_LABEL: Record<QuantityDiscountStatus, string> = {
  ACTIVE: '진행중',
  ENDED: '종료',
}

export const QUANTITY_DISCOUNT_TIER_SCOPE_LABEL: Record<QuantityDiscountTierScope, string> = {
  PER_PRODUCT: '적용상품별',
  TOTAL: '적용상품전체',
}

export const QUANTITY_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL: Record<QuantityDiscountPartialCancelPolicy, string> = {
  KEEP: '할인 유지',
  RECALCULATE: '재계산',
  DENY: '부분취소 불가',
}

// ---------------------------------------------------------------------------
// 상품 후보 (적용상품 탭에서 검색에 사용, 기획전 상품 카탈로그를 그대로 참조)
// ---------------------------------------------------------------------------

export { MOCK_PRODUCT_CATALOG }

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_QUANTITY_DISCOUNTS: QuantityDiscount[] = [
  {
    quantityDiscountId: 'QTD-001', eventName: '양말 3개 이상 할인', vendorName: '프로스펙스',
    startAt: '2026-06-01', endAt: '2026-08-31', status: 'ACTIVE', tierScope: 'PER_PRODUCT', partialCancelPolicy: 'RECALCULATE',
    products: [{ productId: 'P003', productName: '아이스 양말 3팩', priceSale: 15000 }],
    tiers: [
      { tierId: 'TIER-0001', minQuantity: 3, maxQuantity: 5, discountRate: 10 },
      { tierId: 'TIER-0002', minQuantity: 6, maxQuantity: null, discountRate: 15 },
    ],
    createdBy: 'admin', createdAt: '2026-05-20 10:00', updatedBy: 'admin', updatedAt: '2026-06-01 09:00',
  },
  {
    quantityDiscountId: 'QTD-002', eventName: '에너지젤 5개 이상 할인', vendorName: 'GU코리아',
    startAt: '2026-08-01', endAt: '2026-09-30', status: 'ACTIVE', tierScope: 'TOTAL', partialCancelPolicy: 'RECALCULATE',
    products: [{ productId: 'P007', productName: '에너지젤 세트', priceSale: 32000 }],
    tiers: [
      { tierId: 'TIER-0003', minQuantity: 5, maxQuantity: 9, discountRate: 8 },
      { tierId: 'TIER-0004', minQuantity: 10, maxQuantity: null, discountRate: 12 },
    ],
    createdBy: 'admin', createdAt: '2026-07-15 10:00', updatedBy: 'admin', updatedAt: '2026-08-01 09:00',
  },
  {
    quantityDiscountId: 'QTD-003', eventName: '겨울 넥워머 세트 할인', vendorName: '버프코리아',
    startAt: '2025-12-01', endAt: '2026-01-31', status: 'ENDED', tierScope: 'PER_PRODUCT', partialCancelPolicy: 'DENY',
    products: [{ productId: 'P014', productName: '넥워머', priceSale: 35000 }],
    tiers: [
      { tierId: 'TIER-0005', minQuantity: 2, maxQuantity: null, discountRate: 12 },
    ],
    createdBy: 'editor2', createdAt: '2025-11-20 09:00', updatedBy: 'editor2', updatedAt: '2026-02-01 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterQuantityDiscounts(items: QuantityDiscount[], filter: QuantityDiscountFilter): QuantityDiscount[] {
  return items.filter((q) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!q.eventName.toLowerCase().includes(kw) && !q.vendorName.toLowerCase().includes(kw) && !q.quantityDiscountId.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && q.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generators
// ---------------------------------------------------------------------------

let _qtdSeq = MOCK_QUANTITY_DISCOUNTS.length + 1
export function nextQuantityDiscountId(): string {
  return `QTD-${String(_qtdSeq++).padStart(3, '0')}`
}

let _tierSeq = MOCK_QUANTITY_DISCOUNTS.reduce((n, q) => n + q.tiers.length, 0) + 1
export function nextTierId(): string {
  return `TIER-${String(_tierSeq++).padStart(4, '0')}`
}
