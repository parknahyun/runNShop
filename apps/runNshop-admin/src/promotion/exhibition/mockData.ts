import { MOCK_PRODUCT_CATALOG } from '@/promotion/shared/productCatalog'
import { MOCK_EVENT_PRICES } from '@/promotion/event-price/mockData'
import { MOCK_COUPONS } from '@/promotion/coupon/mockData'
import { MOCK_QUANTITY_DISCOUNTS } from '@/promotion/quantity-discount/mockData'
import { MOCK_CART_DISCOUNTS } from '@/promotion/cart-discount/mockData'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExhibitionStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED'

export interface ExhibitionProduct {
  productId: string
  productName: string
  brand: string
  price: number
  status: string      // 상품 마스터 상태 스냅샷 (판매중/품절 등)
  sortOrder: number
}

// 기획전에 소속되는 프로모션 종류 (즉시할인·쿠폰할인·수량별 할인·장바구니할인을 기획전 단위로 묶어 관리)
export type PromotionItemType = 'EVENT_PRICE' | 'COUPON' | 'QUANTITY_DISCOUNT' | 'CART_DISCOUNT'

export interface ExhibitionPromotion {
  promotionType: PromotionItemType
  promotionId: string
  promotionName: string   // 참조 프로모션 표시명 (실제로는 각 도메인에서 조인)
  sortOrder: number
}

export interface Exhibition {
  exhibitionId: string
  title: string
  status: ExhibitionStatus
  startAt: string
  endAt: string
  bannerImageUrl: string
  bannerLinkUrl: string
  displayOrder: number
  products: ExhibitionProduct[]
  promotions: ExhibitionPromotion[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface ExhibitionFilter {
  keyword: string
  status: ExhibitionStatus | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const EXHIBITION_STATUS_LABEL: Record<ExhibitionStatus, string> = {
  DRAFT: '미게시',
  SCHEDULED: '예정',
  ACTIVE: '진행중',
  ENDED: '종료',
}

export const PROMOTION_ITEM_TYPE_LABEL: Record<PromotionItemType, string> = {
  EVENT_PRICE: '즉시할인',
  COUPON: '쿠폰할인',
  QUANTITY_DISCOUNT: '수량별 할인',
  CART_DISCOUNT: '장바구니 할인',
}

// ---------------------------------------------------------------------------
// 상품 카탈로그 (상품관리 탭에서 검색/추가할 후보 목록)
// ---------------------------------------------------------------------------

export { MOCK_PRODUCT_CATALOG }

// ---------------------------------------------------------------------------
// 프로모션 후보 카탈로그 (프로모션 탭에서 검색/추가할 후보 목록)
// 각 프로모션 관리 화면의 실제 데이터를 그대로 참조한다.
// ---------------------------------------------------------------------------

export const MOCK_PROMOTION_CATALOG: Array<{ promotionType: PromotionItemType; promotionId: string; promotionName: string }> = [
  ...MOCK_EVENT_PRICES.map((e) => ({ promotionType: 'EVENT_PRICE' as const, promotionId: e.eventPriceId, promotionName: e.eventName })),
  ...MOCK_COUPONS.map((c) => ({ promotionType: 'COUPON' as const, promotionId: c.couponId, promotionName: c.couponName })),
  ...MOCK_QUANTITY_DISCOUNTS.map((q) => ({ promotionType: 'QUANTITY_DISCOUNT' as const, promotionId: q.quantityDiscountId, promotionName: q.eventName })),
  ...MOCK_CART_DISCOUNTS.map((c) => ({ promotionType: 'CART_DISCOUNT' as const, promotionId: c.cartDiscountId, promotionName: c.discountName })),
]

function toPromotions(promotionIds: string[]): ExhibitionPromotion[] {
  return promotionIds.map((promotionId, idx) => ({
    ...MOCK_PROMOTION_CATALOG.find((p) => p.promotionId === promotionId)!,
    sortOrder: idx + 1,
  }))
}

function toProducts(productIds: string[]): ExhibitionProduct[] {
  return productIds.map((productId, idx) => ({
    ...MOCK_PRODUCT_CATALOG.find((p) => p.productId === productId)!,
    sortOrder: idx + 1,
  }))
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_EXHIBITIONS: Exhibition[] = [
  {
    exhibitionId: 'EXH-001', title: '여름 쿨링 특가전', status: 'ACTIVE',
    startAt: '2026-06-01', endAt: '2026-06-30',
    bannerImageUrl: 'https://via.placeholder.com/1200x400/dbeafe/475569?text=Summer+Cool',
    bannerLinkUrl: '/exhibitions/summer-cool', displayOrder: 1,
    products: toProducts(['P001', 'P002', 'P003']),
    promotions: toPromotions(['EVP-001', 'CPN-002']),
    createdBy: 'admin', createdAt: '2026-05-20 10:00', updatedBy: 'admin', updatedAt: '2026-06-10 14:20',
  },
  {
    exhibitionId: 'EXH-002', title: '러닝 입문자 추천 기획전', status: 'ACTIVE',
    startAt: '2026-06-05', endAt: '2026-07-05',
    bannerImageUrl: 'https://via.placeholder.com/1200x400/dcfce7/475569?text=Beginner+Run',
    bannerLinkUrl: '/exhibitions/beginner-run', displayOrder: 2,
    products: toProducts(['P004', 'P005']),
    promotions: [],
    createdBy: 'editor1', createdAt: '2026-05-25 09:00', updatedBy: 'editor1', updatedAt: '2026-06-08 09:15',
  },
  {
    exhibitionId: 'EXH-003', title: '가을 마라톤 준비전', status: 'SCHEDULED',
    startAt: '2026-09-01', endAt: '2026-09-30',
    bannerImageUrl: 'https://via.placeholder.com/1200x400/fef9c3/475569?text=Autumn+Marathon',
    bannerLinkUrl: '/exhibitions/autumn-marathon', displayOrder: 3,
    products: toProducts(['P006', 'P007', 'P008', 'P009']),
    promotions: toPromotions(['QTD-002']),
    createdBy: 'admin', createdAt: '2026-08-10 11:00', updatedBy: 'admin', updatedAt: '2026-08-20 16:30',
  },
  {
    exhibitionId: 'EXH-004', title: '봄맞이 아웃도어 페스티벌', status: 'ENDED',
    startAt: '2026-03-15', endAt: '2026-04-15',
    bannerImageUrl: 'https://via.placeholder.com/1200x400/fee2e2/475569?text=Spring+Outdoor',
    bannerLinkUrl: '/exhibitions/spring-outdoor', displayOrder: 4,
    products: toProducts(['P010', 'P011']),
    promotions: toPromotions(['EVP-002']),
    createdBy: 'editor2', createdAt: '2026-03-01 09:00', updatedBy: 'editor2', updatedAt: '2026-04-16 10:00',
  },
  {
    exhibitionId: 'EXH-005', title: '겨울 방한 러닝 기획전', status: 'ENDED',
    startAt: '2025-12-01', endAt: '2026-01-31',
    bannerImageUrl: 'https://via.placeholder.com/1200x400/e0f2fe/475569?text=Winter+Run',
    bannerLinkUrl: '/exhibitions/winter-run', displayOrder: 5,
    products: toProducts(['P012', 'P013', 'P014']),
    promotions: [],
    createdBy: 'admin', createdAt: '2025-11-15 09:00', updatedBy: 'admin', updatedAt: '2026-02-01 09:00',
  },
  {
    exhibitionId: 'EXH-006', title: '나이키 단독 할인전', status: 'SCHEDULED',
    startAt: '2026-07-15', endAt: '2026-07-25',
    bannerImageUrl: 'https://via.placeholder.com/1200x400/ede9fe/475569?text=Nike+Sale',
    bannerLinkUrl: '/exhibitions/nike-sale', displayOrder: 6,
    products: toProducts(['P015', 'P016', 'P017']),
    promotions: [],
    createdBy: 'admin', createdAt: '2026-06-25 11:45', updatedBy: 'admin', updatedAt: '2026-07-01 11:45',
  },
  {
    exhibitionId: 'EXH-007', title: '겨울 신상 기획전 (준비중)', status: 'DRAFT',
    startAt: '2026-11-01', endAt: '2026-11-30',
    bannerImageUrl: '', bannerLinkUrl: '', displayOrder: 7,
    products: [],
    promotions: [],
    createdBy: 'editor1', createdAt: '2026-07-02 10:00', updatedBy: 'editor1', updatedAt: '2026-07-02 10:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterExhibitions(items: Exhibition[], filter: ExhibitionFilter): Exhibition[] {
  return items.filter((ex) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!ex.title.toLowerCase().includes(kw) && !ex.exhibitionId.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && ex.status !== filter.status) return false
    if (filter.from && ex.endAt < filter.from) return false
    if (filter.to && ex.startAt > filter.to) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _exhSeq = MOCK_EXHIBITIONS.length + 1
export function nextExhibitionId(): string {
  return `EXH-${String(_exhSeq++).padStart(3, '0')}`
}
