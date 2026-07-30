// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BannerPosition = 'MAIN_TOP' | 'MAIN_MIDDLE' | 'CATEGORY_TOP'

export interface Banner {
  bannerId: string
  positionCode: BannerPosition
  title: string
  imageUrl: string
  linkUrl: string | null
  sortOrder: number
  displayFrom: string | null
  displayTo: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface BannerFilter {
  keyword: string
  positionCode: BannerPosition | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const BANNER_POSITION_LABEL: Record<BannerPosition, string> = {
  MAIN_TOP:     '메인 상단',
  MAIN_MIDDLE:  '메인 중단',
  CATEGORY_TOP: '카테고리 상단',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_BANNERS: Banner[] = [
  {
    bannerId: 'BNR-001', positionCode: 'MAIN_TOP', title: '봄맞이 러닝화 특가전',
    imageUrl: 'https://via.placeholder.com/1200x400/f1f5f9/475569?text=Spring+Sale',
    linkUrl: '/event/spring-sale', sortOrder: 1,
    displayFrom: '2026-03-01', displayTo: '2026-03-31',
    createdBy: 'admin.kim', createdAt: '2026-02-25 09:00:00', updatedAt: '2026-02-25 09:00:00',
  },
  {
    bannerId: 'BNR-002', positionCode: 'MAIN_TOP', title: '신규 가입 쿠폰 안내',
    imageUrl: 'https://via.placeholder.com/1200x400/f1f5f9/475569?text=Welcome+Coupon',
    linkUrl: '/event/welcome-coupon', sortOrder: 2,
    displayFrom: null, displayTo: null,
    createdBy: 'admin.kim', createdAt: '2026-01-05 09:00:00', updatedAt: '2026-01-05 09:00:00',
  },
  {
    bannerId: 'BNR-003', positionCode: 'MAIN_MIDDLE', title: '나이키 신상 컬렉션',
    imageUrl: 'https://via.placeholder.com/800x300/f1f5f9/475569?text=Nike+New',
    linkUrl: '/brand/nike', sortOrder: 1,
    displayFrom: '2026-02-15', displayTo: '2026-04-15',
    createdBy: 'ops.lee', createdAt: '2026-02-10 10:00:00', updatedAt: '2026-02-10 10:00:00',
  },
  {
    bannerId: 'BNR-004', positionCode: 'MAIN_MIDDLE', title: '무료배송 이벤트',
    imageUrl: 'https://via.placeholder.com/800x300/f1f5f9/475569?text=Free+Shipping',
    linkUrl: null, sortOrder: 2,
    displayFrom: '2026-03-01', displayTo: '2026-03-15',
    createdBy: 'ops.lee', createdAt: '2026-02-20 11:00:00', updatedAt: '2026-03-01 09:00:00',
  },
  {
    bannerId: 'BNR-005', positionCode: 'CATEGORY_TOP', title: '러닝화 카테고리 기획전',
    imageUrl: 'https://via.placeholder.com/1000x250/f1f5f9/475569?text=Running+Shoes',
    linkUrl: '/category/running-shoes/event', sortOrder: 1,
    displayFrom: null, displayTo: null,
    createdBy: 'admin.kim', createdAt: '2025-12-01 09:00:00', updatedAt: '2025-12-01 09:00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterBanners(items: Banner[], filter: BannerFilter): Banner[] {
  return items
    .filter((b) => {
      if (filter.keyword.trim() && !b.title.toLowerCase().includes(filter.keyword.trim().toLowerCase())) return false
      if (filter.positionCode !== 'ALL' && b.positionCode !== filter.positionCode) return false
      return true
    })
    .sort((a, b) => a.positionCode === b.positionCode
      ? a.sortOrder - b.sortOrder
      : a.positionCode.localeCompare(b.positionCode))
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

export function nextBannerId(items: Banner[]): string {
  const max = items.reduce((acc, b) => {
    const n = parseInt(b.bannerId.replace('BNR-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `BNR-${String(max + 1).padStart(3, '0')}`
}
