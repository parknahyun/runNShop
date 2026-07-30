import { MOCK_SECTIONS } from '../section/mockData'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PageType = 'HOME' | 'CATEGORY' | 'EXHIBITION' | 'EXHIBITION_MAIN' | 'PROMOTION' | 'BRAND'

export type PageStatus = 'PUBLISHED' | 'SCHEDULED' | 'DRAFT' | 'DEPRECATED'

// ---------------------------------------------------------------------------
// Section interfaces (sectionType = 섹션 ID, 즉 sectionCode)
// ---------------------------------------------------------------------------

export interface PageSection {
  sectionId: string
  sectionName: string
  sectionType: string      // 섹션 ID (HERO_BANNER, BANNER_SLIDE, MD_RECOMMEND 등)
  sortOrder: number
  visible: boolean
}

export interface PageItem {
  pageId: string
  pageName: string
  pageType: PageType
  templateId: string
  templateName: string
  slug: string
  status: PageStatus
  publishedAt: string
  startAt: string
  endAt: string
  sections: PageSection[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface PageFilter {
  keyword: string
  pageType: PageType | 'ALL'
  status: PageStatus | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const PAGE_TYPE_LABEL: Record<PageType, string> = {
  HOME: '홈',
  CATEGORY: '카테고리',
  EXHIBITION: '기획전',
  EXHIBITION_MAIN: '기획전 메인',
  PROMOTION: '프로모션',
  BRAND: '브랜드',
}

export const PAGE_STATUS_LABEL: Record<PageStatus, string> = {
  PUBLISHED: '게시중',
  SCHEDULED: '예약',
  DRAFT: '미게시',
  DEPRECATED: '폐기',
}

// 섹션 색상/레이블은 섹션 mockData에서 조회
export function getSectionLabel(sectionCode: string): string {
  const found = MOCK_SECTIONS.find(s => s.sectionCode === sectionCode)
  return found?.sectionName || sectionCode
}

export function getSectionColor(sectionCode: string): string {
  const found = MOCK_SECTIONS.find(s => s.sectionCode === sectionCode)
  return found?.previewColor || '#f1f5f9'
}

// ---------------------------------------------------------------------------
// Section ID counter
// ---------------------------------------------------------------------------

let _secSeq = 0

function makeSection(sectionCode: string, name: string, visible = true): PageSection {
  _secSeq++
  return {
    sectionId: `SEC-${String(_secSeq).padStart(4, '0')}`,
    sectionName: name,
    sectionType: sectionCode,
    sortOrder: _secSeq,
    visible,
  }
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_PAGES: PageItem[] = [
  {
    pageId: 'PG-001', pageName: '메인 홈페이지', pageType: 'HOME',
    templateId: 'TPL-001', templateName: '기본 홈 템플릿',
    slug: 'main-home',
    status: 'PUBLISHED', publishedAt: '26-06-01 09:00',
    startAt: '26-06-01 09:00', endAt: '99-12-31 23:59',
    sections: [
      makeSection('HERO_BANNER', '메인 배너'),
      makeSection('MD_RECOMMEND', 'MD추천'),
      makeSection('PRODUCT_GRID', '추천 상품'),
      makeSection('TEXT_BLOCK', '이벤트 안내'),
      makeSection('DIVIDER_LINE', '구분선'),
    ],
    createdBy: 'admin', createdAt: '26-05-01 09:00', updatedBy: 'admin', updatedAt: '26-06-12 10:30',
  },
  {
    pageId: 'PG-002', pageName: '러닝화 카테고리 페이지', pageType: 'CATEGORY',
    templateId: 'TPL-002', templateName: '카테고리 전용 템플릿',
    slug: 'running-shoes',
    status: 'PUBLISHED', publishedAt: '26-05-15 09:00',
    startAt: '26-05-15 09:00', endAt: '99-12-31 23:59',
    sections: [
      makeSection('BANNER_SLIDE', '카테고리 배너'),
      makeSection('PRODUCT_CAROUSEL', '인기 상품'),
      makeSection('PRODUCT_GRID', '전체 상품'),
    ],
    createdBy: 'editor1', createdAt: '26-05-10 10:00', updatedBy: 'editor1', updatedAt: '26-06-10 15:20',
  },
  {
    pageId: 'PG-003', pageName: '여름 시즌 기획전 페이지', pageType: 'EXHIBITION',
    templateId: 'TPL-003', templateName: '기획전 랜딩 템플릿',
    slug: 'summer-exhibition',
    status: 'SCHEDULED', publishedAt: '26-07-01 00:00',
    startAt: '26-07-01 00:00', endAt: '26-08-31 23:59',
    sections: [
      makeSection('HERO_BANNER', '기획전 히어로'),
      makeSection('COUNTDOWN_TIMER', '세일 카운트다운'),
      makeSection('PRODUCT_GRID', '할인 상품 그리드'),
      makeSection('COUPON_STRIP', '쿠폰 영역'),
    ],
    createdBy: 'admin', createdAt: '26-06-01 09:00', updatedBy: 'admin', updatedAt: '26-06-25 09:00',
  },
  {
    pageId: 'PG-004', pageName: '가을 신상품 홈', pageType: 'HOME',
    templateId: 'TPL-001', templateName: '기본 홈 템플릿',
    slug: 'fall-new-home',
    status: 'DRAFT', publishedAt: '',
    startAt: '26-09-01 09:00', endAt: '26-11-30 23:59',
    sections: [
      makeSection('BANNER_SLIDE', '신상품 배너'),
      makeSection('PRODUCT_CAROUSEL', '가을 추천'),
    ],
    createdBy: 'editor2', createdAt: '26-06-15 14:00', updatedBy: 'editor2', updatedAt: '26-06-20 14:00',
  },
  {
    pageId: 'PG-005', pageName: '블랙프라이데이 기획전', pageType: 'EXHIBITION',
    templateId: 'TPL-003', templateName: '기획전 랜딩 템플릿',
    slug: 'black-friday',
    status: 'SCHEDULED', publishedAt: '26-11-20 00:00',
    startAt: '26-11-20 00:00', endAt: '26-11-30 23:59',
    sections: [
      makeSection('HERO_BANNER', '블프 메인 배너'),
      makeSection('COUNTDOWN_TIMER', '카운트다운'),
      makeSection('PRODUCT_GRID', '특가 상품'),
      makeSection('COUPON_STRIP', '쿠폰 받기'),
      makeSection('TEXT_BLOCK', '이용약관 안내', false),
    ],
    createdBy: 'admin', createdAt: '26-06-10 16:30', updatedBy: 'admin', updatedAt: '26-06-15 16:30',
  },
  {
    pageId: 'PG-006', pageName: '나이키 브랜드 페이지', pageType: 'BRAND',
    templateId: 'TPL-004', templateName: '브랜드 전용 템플릿',
    slug: 'nike-brand',
    status: 'PUBLISHED', publishedAt: '26-04-01 09:00',
    startAt: '26-04-01 09:00', endAt: '99-12-31 23:59',
    sections: [
      makeSection('HERO_BANNER', '브랜드 히어로'),
      makeSection('IMAGE_LINK', '시즌 룩북'),
      makeSection('PRODUCT_CAROUSEL', '인기 상품'),
      makeSection('PRODUCT_GRID', '전체 상품'),
    ],
    createdBy: 'admin', createdAt: '26-03-15 09:00', updatedBy: 'editor1', updatedAt: '26-05-20 11:00',
  },
  {
    pageId: 'PG-007', pageName: '회원 전용 프로모션', pageType: 'PROMOTION',
    templateId: 'TPL-005', templateName: '프로모션 템플릿',
    slug: 'member-promo',
    status: 'DEPRECATED', publishedAt: '26-03-01 09:00',
    startAt: '26-03-01 09:00', endAt: '26-04-30 23:59',
    sections: [
      makeSection('BANNER_SLIDE', '프로모 배너'),
      makeSection('COUPON_STRIP', '회원 전용 쿠폰'),
      makeSection('PRODUCT_CAROUSEL', '추천 상품'),
    ],
    createdBy: 'admin', createdAt: '26-02-15 10:00', updatedBy: 'admin', updatedAt: '26-05-01 09:00',
  },
  {
    pageId: 'PG-008', pageName: '기획전 메인', pageType: 'EXHIBITION_MAIN',
    templateId: 'TPL-006', templateName: '기획전 메인 템플릿',
    slug: 'exhibition-main',
    status: 'PUBLISHED', publishedAt: '26-05-01 09:00',
    startAt: '26-05-01 09:00', endAt: '99-12-31 23:59',
    sections: [
      makeSection('HERO_BANNER', '기획전 메인 배너'),
      makeSection('MD_RECOMMEND', '기획전 추천'),
      makeSection('PRODUCT_GRID', '진행중 기획전'),
    ],
    createdBy: 'admin', createdAt: '26-04-15 09:00', updatedBy: 'admin', updatedAt: '26-05-20 14:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterPages(items: PageItem[], filter: PageFilter): PageItem[] {
  return items.filter((page) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!page.pageId.toLowerCase().includes(kw) && !page.pageName.toLowerCase().includes(kw)) return false
    }
    if (filter.pageType !== 'ALL' && page.pageType !== filter.pageType) return false
    if (filter.status !== 'ALL' && page.status !== filter.status) return false
    if (filter.from && page.endAt.slice(0, 10) < filter.from) return false
    if (filter.to && page.startAt.slice(0, 10) > filter.to) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generators
// ---------------------------------------------------------------------------

let _pgSeq = MOCK_PAGES.length + 1
export function nextPageId(): string {
  return `PG-${String(_pgSeq++).padStart(3, '0')}`
}

let _secIdSeq = _secSeq + 1
export function nextSectionId(): string {
  return `SEC-${String(_secIdSeq++).padStart(4, '0')}`
}
