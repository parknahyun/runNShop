// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BrandStatus = 'ACTIVE' | 'INACTIVE'

export interface Brand {
  brandId: string
  brandName: string
  brandNameEn: string
  imageUrl: string
  description: string
  productCount: number
  status: BrandStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface BrandFilter {
  keyword: string
  status: BrandStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const BRAND_STATUS_LABEL: Record<BrandStatus, string> = {
  ACTIVE: '사용',
  INACTIVE: '미사용',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_BRANDS: Brand[] = [
  {
    brandId: 'BRD-001', brandName: '나이키', brandNameEn: 'Nike',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Nike',
    description: '미국의 스포츠용품 브랜드. 러닝화, 의류, 액세서리 전반을 취급한다.',
    productCount: 5, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-01 09:00', updatedBy: 'admin', updatedAt: '2026-01-05 09:00',
  },
  {
    brandId: 'BRD-002', brandName: '아디다스', brandNameEn: 'Adidas',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Adidas',
    description: '독일의 스포츠용품 브랜드. 삼선 로고로 유명하다.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-01 09:00', updatedBy: 'admin', updatedAt: '2025-11-01 09:00',
  },
  {
    brandId: 'BRD-003', brandName: '프로스펙스', brandNameEn: 'Prospecs',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Prospecs',
    description: '국내 스포츠용품 브랜드. 기능성 신발과 이너웨어를 주력으로 한다.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-02 09:00', updatedBy: 'admin', updatedAt: '2025-11-02 09:00',
  },
  {
    brandId: 'BRD-004', brandName: '뉴발란스', brandNameEn: 'New Balance',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=New+Balance',
    description: '미국 보스턴 기반의 러닝화 전문 브랜드.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-02 09:00', updatedBy: 'admin', updatedAt: '2025-11-02 09:00',
  },
  {
    brandId: 'BRD-005', brandName: '아식스', brandNameEn: 'Asics',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Asics',
    description: '일본의 러닝화 전문 브랜드. 마라토너들에게 널리 사용된다.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-03 09:00', updatedBy: 'admin', updatedAt: '2025-11-03 09:00',
  },
  {
    brandId: 'BRD-006', brandName: '가민', brandNameEn: 'Garmin',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Garmin',
    description: 'GPS 및 웨어러블 기기 전문 브랜드. 러닝워치로 유명하다.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-03 09:00', updatedBy: 'admin', updatedAt: '2025-11-03 09:00',
  },
  {
    brandId: 'BRD-007', brandName: '살로몬', brandNameEn: 'Salomon',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Salomon',
    description: '프랑스의 아웃도어·트레일 러닝 전문 브랜드.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-04 09:00', updatedBy: 'admin', updatedAt: '2025-11-04 09:00',
  },
  {
    brandId: 'BRD-008', brandName: '파타고니아', brandNameEn: 'Patagonia',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Patagonia',
    description: '미국의 아웃도어 의류 브랜드. 환경 지향 경영으로 알려져 있다.',
    productCount: 1, status: 'INACTIVE',
    createdBy: 'admin', createdAt: '2025-11-04 09:00', updatedBy: 'editor1', updatedAt: '2026-03-10 14:00',
  },
  {
    brandId: 'BRD-009', brandName: '호카', brandNameEn: 'Hoka',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Hoka',
    description: '두꺼운 쿠셔닝이 특징인 러닝화 전문 브랜드.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-05 09:00', updatedBy: 'admin', updatedAt: '2025-11-05 09:00',
  },
  {
    brandId: 'BRD-010', brandName: '언더아머', brandNameEn: 'Under Armour',
    imageUrl: 'https://via.placeholder.com/120x120/f1f5f9/475569?text=Under+Armour',
    description: '미국의 스포츠 기능성 의류 브랜드.',
    productCount: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-11-05 09:00', updatedBy: 'admin', updatedAt: '2025-11-05 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterBrands(items: Brand[], filter: BrandFilter): Brand[] {
  return items.filter((b) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!b.brandName.toLowerCase().includes(kw) && !b.brandNameEn.toLowerCase().includes(kw) && !b.brandId.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && b.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _brdSeq = MOCK_BRANDS.length + 1
export function nextBrandId(): string {
  return `BRD-${String(_brdSeq++).padStart(3, '0')}`
}
