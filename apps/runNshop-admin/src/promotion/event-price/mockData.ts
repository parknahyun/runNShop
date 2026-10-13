import { MOCK_PRODUCT_CATALOG } from '@/promotion/shared/productCatalog'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EventPriceStatus = 'ACTIVE' | 'ENDED'

export interface EventPriceProduct {
  productId: string
  productName: string
  originalPrice: number
  discountRate: number       // 이 상품에 적용되는 할인율(%). 기본값은 행사 할인율이며 상품별로 조정 가능
  eventPrice: number         // = originalPrice * (1 - discountRate/100), 계산값(표시용)
  quantityLimit: boolean
  totalQuantity: number | null
  remainingQuantity: number | null
}

export interface EventPrice {
  eventPriceId: string
  eventName: string
  discountRate: number       // 행사 기본 할인율(%). 상품 추가 시 기본값으로 사용된다
  startAt: string
  endAt: string
  status: EventPriceStatus
  products: EventPriceProduct[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface EventPriceFilter {
  keyword: string
  status: EventPriceStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const EVENT_PRICE_STATUS_LABEL: Record<EventPriceStatus, string> = {
  ACTIVE: '진행중',
  ENDED: '종료',
}

// ---------------------------------------------------------------------------
// 상품 후보 (적용상품 탭에서 검색에 사용, 공통 상품 카탈로그를 그대로 참조)
// ---------------------------------------------------------------------------

export { MOCK_PRODUCT_CATALOG }

export function calcEventPrice(originalPrice: number, discountRate: number): number {
  return Math.round(originalPrice * (1 - discountRate / 100))
}

export function calcDiscountRateFromPrice(originalPrice: number, eventPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round((1 - eventPrice / originalPrice) * 1000) / 10
}

function makeProduct(productId: string, discountRate: number, opts?: {
  quantityLimit?: boolean; totalQuantity?: number; remainingQuantity?: number
}): EventPriceProduct {
  const catalog = MOCK_PRODUCT_CATALOG.find((p) => p.productId === productId)!
  const quantityLimit = opts?.quantityLimit ?? false
  return {
    productId: catalog.productId,
    productName: catalog.productName,
    originalPrice: catalog.price,
    discountRate,
    eventPrice: calcEventPrice(catalog.price, discountRate),
    quantityLimit,
    totalQuantity: quantityLimit ? (opts?.totalQuantity ?? null) : null,
    remainingQuantity: quantityLimit ? (opts?.remainingQuantity ?? opts?.totalQuantity ?? null) : null,
  }
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_EVENT_PRICES: EventPrice[] = [
  {
    eventPriceId: 'EVP-001', eventName: '여름 러닝화 특가', discountRate: 30,
    startAt: '2026-06-01 00:00', endAt: '2026-06-30 23:59', status: 'ACTIVE',
    products: [
      makeProduct('P001', 31, { quantityLimit: true, totalQuantity: 50, remainingQuantity: 12 }),   // 상품별 조정 (기본 30% → 31%)
      makeProduct('P004', 30, { quantityLimit: true, totalQuantity: 100, remainingQuantity: 45 }),  // 기본 할인율 그대로 사용
    ],
    createdBy: 'admin', createdAt: '2026-05-20 10:00', updatedBy: 'admin', updatedAt: '2026-06-10 14:20',
  },
  {
    eventPriceId: 'EVP-002', eventName: '마라톤 용품 할인가', discountRate: 20,
    startAt: '2026-08-15 00:00', endAt: '2026-09-30 23:59', status: 'ACTIVE',
    products: [
      makeProduct('P006', 21),   // 조정
      makeProduct('P008', 20),   // 기본값
      makeProduct('P009', 11),   // 고가 상품이라 낮게 조정
    ],
    createdBy: 'admin', createdAt: '2026-08-01 09:00', updatedBy: 'admin', updatedAt: '2026-08-01 09:00',
  },
  {
    eventPriceId: 'EVP-003', eventName: '봄맞이 아웃도어 특가', discountRate: 31,
    startAt: '2026-03-15 00:00', endAt: '2026-04-15 23:59', status: 'ENDED',
    products: [
      makeProduct('P011', 31, { quantityLimit: true, totalQuantity: 20, remainingQuantity: 0 }),
    ],
    createdBy: 'editor2', createdAt: '2026-03-01 09:00', updatedBy: 'editor2', updatedAt: '2026-04-16 10:00',
  },
  {
    eventPriceId: 'EVP-004', eventName: '나이키 단독 할인가', discountRate: 25,
    startAt: '2026-01-10 00:00', endAt: '2026-01-31 23:59', status: 'ENDED',
    products: [
      makeProduct('P015', 25, { quantityLimit: true, totalQuantity: 30, remainingQuantity: 0 }),
      makeProduct('P016', 29, { quantityLimit: true, totalQuantity: 40, remainingQuantity: 0 }),  // 조정
    ],
    createdBy: 'admin', createdAt: '2025-12-28 10:00', updatedBy: 'admin', updatedAt: '2026-02-01 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterEventPrices(items: EventPrice[], filter: EventPriceFilter): EventPrice[] {
  return items.filter((e) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      const matchesEvent = e.eventName.toLowerCase().includes(kw) || e.eventPriceId.toLowerCase().includes(kw)
      const matchesProduct = e.products.some((p) => p.productName.toLowerCase().includes(kw))
      if (!matchesEvent && !matchesProduct) return false
    }
    if (filter.status !== 'ALL' && e.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _evpSeq = MOCK_EVENT_PRICES.length + 1
export function nextEventPriceId(): string {
  return `EVP-${String(_evpSeq++).padStart(3, '0')}`
}
