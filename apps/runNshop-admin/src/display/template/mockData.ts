'use client'

export type TemplateType = 'HOME' | 'CATEGORY' | 'EXHIBITION' | 'EVENT'

export type TemplateStatus = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'

export const TEMPLATE_TYPE_LABEL: Record<TemplateType, string> = {
  HOME: '메인',
  CATEGORY: '카테고리',
  EXHIBITION: '기획전',
  EVENT: '이벤트',
}

export const TEMPLATE_STATUS_LABEL: Record<TemplateStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  DEPRECATED: '폐기',
}

export interface TemplateSection {
  sectionName: string
  sectionType: string   // 섹션 ID (sectionCode)
  sortOrder: number
}

export interface Template {
  templateId: string
  templateName: string
  templateType: TemplateType
  status: TemplateStatus
  sectionCount: number
  usedPageCount: number
  sections: TemplateSection[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface TemplateFilter {
  keyword: string
  templateType: TemplateType | 'ALL'
  status: TemplateStatus | 'ALL'
}

export const MOCK_TEMPLATES: Template[] = [
  {
    templateId: 'TPL-001',
    templateName: '기본 홈 템플릿',
    templateType: 'HOME',
    status: 'ACTIVE',
    sectionCount: 4,
    usedPageCount: 2,
    sections: [
      { sectionName: '메인 배너', sectionType: 'HERO_BANNER', sortOrder: 1 },
      { sectionName: 'MD추천', sectionType: 'MD_RECOMMEND', sortOrder: 2 },
      { sectionName: '추천 상품', sectionType: 'PRODUCT_GRID', sortOrder: 3 },
      { sectionName: '공지 영역', sectionType: 'TEXT_BLOCK', sortOrder: 4 },
    ],
    createdBy: 'admin',
    createdAt: '26-05-01 09:00',
    updatedBy: 'admin',
    updatedAt: '26-06-10 11:30',
  },
  {
    templateId: 'TPL-002',
    templateName: '카테고리 전용 템플릿',
    templateType: 'CATEGORY',
    status: 'ACTIVE',
    sectionCount: 3,
    usedPageCount: 4,
    sections: [
      { sectionName: '카테고리 배너', sectionType: 'BANNER_SLIDE', sortOrder: 1 },
      { sectionName: '인기 상품', sectionType: 'PRODUCT_CAROUSEL', sortOrder: 2 },
      { sectionName: '전체 상품', sectionType: 'PRODUCT_GRID', sortOrder: 3 },
    ],
    createdBy: 'editor1',
    createdAt: '26-05-05 10:00',
    updatedBy: 'editor1',
    updatedAt: '26-06-08 14:00',
  },
  {
    templateId: 'TPL-003',
    templateName: '기획전 랜딩 템플릿',
    templateType: 'EXHIBITION',
    status: 'ACTIVE',
    sectionCount: 4,
    usedPageCount: 3,
    sections: [
      { sectionName: '히어로 배너', sectionType: 'HERO_BANNER', sortOrder: 1 },
      { sectionName: '카운트다운', sectionType: 'COUNTDOWN_TIMER', sortOrder: 2 },
      { sectionName: '특가 상품', sectionType: 'PRODUCT_GRID', sortOrder: 3 },
      { sectionName: '쿠폰 영역', sectionType: 'COUPON_STRIP', sortOrder: 4 },
    ],
    createdBy: 'admin',
    createdAt: '26-04-20 14:30',
    updatedBy: 'admin',
    updatedAt: '26-06-05 09:45',
  },
  {
    templateId: 'TPL-004',
    templateName: '브랜드 전용 템플릿',
    templateType: 'EXHIBITION',
    status: 'ACTIVE',
    sectionCount: 4,
    usedPageCount: 1,
    sections: [
      { sectionName: '브랜드 히어로', sectionType: 'HERO_BANNER', sortOrder: 1 },
      { sectionName: '시즌 룩북', sectionType: 'IMAGE_LINK', sortOrder: 2 },
      { sectionName: '인기 상품', sectionType: 'PRODUCT_CAROUSEL', sortOrder: 3 },
      { sectionName: '전체 상품', sectionType: 'PRODUCT_GRID', sortOrder: 4 },
    ],
    createdBy: 'admin',
    createdAt: '26-03-15 09:00',
    updatedBy: 'admin',
    updatedAt: '26-05-20 10:10',
  },
  {
    templateId: 'TPL-005',
    templateName: '프로모션 템플릿',
    templateType: 'EVENT',
    status: 'ACTIVE',
    sectionCount: 4,
    usedPageCount: 1,
    sections: [
      { sectionName: '이벤트 배너', sectionType: 'BANNER_SLIDE', sortOrder: 1 },
      { sectionName: '쿠폰 영역', sectionType: 'COUPON_STRIP', sortOrder: 2 },
      { sectionName: '추천 상품', sectionType: 'PRODUCT_CAROUSEL', sortOrder: 3 },
      { sectionName: '안내문', sectionType: 'TEXT_BLOCK', sortOrder: 4 },
    ],
    createdBy: 'editor2',
    createdAt: '26-04-10 11:00',
    updatedBy: 'editor2',
    updatedAt: '26-05-28 16:20',
  },
  {
    templateId: 'TPL-006',
    templateName: '기획전 메인 템플릿',
    templateType: 'EXHIBITION',
    status: 'ACTIVE',
    sectionCount: 3,
    usedPageCount: 1,
    sections: [
      { sectionName: '기획전 메인 배너', sectionType: 'HERO_BANNER', sortOrder: 1 },
      { sectionName: '기획전 추천', sectionType: 'MD_RECOMMEND', sortOrder: 2 },
      { sectionName: '진행중 기획전', sectionType: 'PRODUCT_GRID', sortOrder: 3 },
    ],
    createdBy: 'admin',
    createdAt: '26-06-01 09:00',
    updatedBy: 'admin',
    updatedAt: '26-06-15 09:00',
  },
  {
    templateId: 'TPL-007',
    templateName: '이벤트 메인 템플릿',
    templateType: 'EVENT',
    status: 'ACTIVE',
    sectionCount: 3,
    usedPageCount: 1,
    sections: [
      { sectionName: '진행중 이벤트', sectionType: 'BANNER_SLIDE', sortOrder: 1 },
      { sectionName: '이벤트 추천', sectionType: 'MD_RECOMMEND', sortOrder: 2 },
      { sectionName: '종료 이벤트', sectionType: 'PRODUCT_GRID', sortOrder: 3 },
    ],
    createdBy: 'admin',
    createdAt: '26-06-05 10:00',
    updatedBy: 'admin',
    updatedAt: '26-06-12 14:30',
  },
  {
    templateId: 'TPL-008',
    templateName: '빈 템플릿',
    templateType: 'HOME',
    status: 'INACTIVE',
    sectionCount: 0,
    usedPageCount: 0,
    sections: [],
    createdBy: 'admin',
    createdAt: '26-01-01 09:00',
    updatedBy: 'admin',
    updatedAt: '26-01-01 09:00',
  },
]

export function filterTemplates(items: Template[], filter: TemplateFilter): Template[] {
  return items.filter((tpl) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!tpl.templateName.toLowerCase().includes(kw) && !tpl.templateId.toLowerCase().includes(kw)) return false
    }
    if (filter.templateType !== 'ALL' && tpl.templateType !== filter.templateType) return false
    if (filter.status !== 'ALL' && tpl.status !== filter.status) return false
    return true
  })
}
