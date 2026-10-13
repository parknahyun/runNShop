export type SectionType = 'BANNER' | 'PRODUCT_GRID' | 'TEXT' | 'IMAGE_LINK' | 'COUNTDOWN' | 'COUPON_BAND' | 'DIVIDER' | 'PRODUCT_CAROUSEL'

export type SectionStatus = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'

export const SECTION_STATUS_LABEL: Record<SectionStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  DEPRECATED: '폐기',
}

export type LayoutType = 'LAYERED' | 'CAROUSEL' | 'TILE'

export const LAYOUT_TYPE_LABEL: Record<LayoutType, string> = {
  LAYERED: 'Layered (겹침)',
  CAROUSEL: 'Carousel (슬라이드)',
  TILE: 'Tile (나열)',
}

export interface SectionItem {
  sectionCode: string
  sectionName: string
  type: SectionType
  description: string
  previewColor: string
  status: SectionStatus
  fieldCount: number
  sortOrder: number
  itemCount: number        // 갯수 (1 = 단일, N = N개 아이템)
  layoutType: LayoutType   // 유형: LAYERED | CAROUSEL | TILE | 
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export const SECTION_TYPE_LABEL: Record<SectionType, string> = {
  BANNER: '배너',
  PRODUCT_GRID: '상품 그리드',
  TEXT: '텍스트',
  IMAGE_LINK: '이미지 링크',
  COUNTDOWN: '카운트다운',
  COUPON_BAND: '쿠폰 띠배너',
  DIVIDER: '구분선',
  PRODUCT_CAROUSEL: '상품 캐러셀',
}

export const MOCK_SECTIONS: SectionItem[] = [
  { sectionCode: 'HERO_BANNER', sectionName: '히어로 배너', type: 'BANNER', description: '전체폭 대형 이미지/영상 배너. 기획전 상단에 주로 사용.', previewColor: '#dbeafe', status: 'ACTIVE', fieldCount: 4, sortOrder: 1, itemCount: 1, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'BANNER_SLIDE', sectionName: '슬라이드 배너', type: 'BANNER', description: '좌우 스와이프 가능한 멀티 이미지 배너.', previewColor: '#dbeafe', status: 'ACTIVE', fieldCount: 1, sortOrder: 2, itemCount: 5, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'PRODUCT_CAROUSEL', sectionName: '상품 캐러셀', type: 'PRODUCT_CAROUSEL', description: '가로 스크롤 상품 목록. 특정 상품군 강조에 사용.', previewColor: '#dcfce7', status: 'ACTIVE', fieldCount: 3, sortOrder: 3, itemCount: 1, layoutType: 'TILE', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'PRODUCT_GRID', sectionName: '상품 그리드', type: 'PRODUCT_GRID', description: '2열 또는 3열 격자 상품 목록.', previewColor: '#dcfce7', status: 'ACTIVE', fieldCount: 3, sortOrder: 4, itemCount: 1, layoutType: 'TILE', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'IMAGE_LINK', sectionName: '이미지 링크', type: 'IMAGE_LINK', description: '단일 이미지에 링크를 연결. 기획 이미지, 배너 배치에 사용.', previewColor: '#fef9c3', status: 'ACTIVE', fieldCount: 3, sortOrder: 5, itemCount: 3, layoutType: 'TILE', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'TEXT_BLOCK', sectionName: '텍스트 블록', type: 'TEXT', description: 'HTML 텍스트 영역. 공지, 설명문 등에 사용.', previewColor: '#fef9c3', status: 'ACTIVE', fieldCount: 3, sortOrder: 6, itemCount: 1, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'COUNTDOWN_TIMER', sectionName: '카운트다운 타이머', type: 'COUNTDOWN', description: '종료 시각까지 카운트다운 표시. 타임세일에 사용.', previewColor: '#fee2e2', status: 'ACTIVE', fieldCount: 2, sortOrder: 7, itemCount: 1, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'COUPON_STRIP', sectionName: '쿠폰 띠배너', type: 'COUPON_BAND', description: '쿠폰 다운로드 CTA 포함 띠배너.', previewColor: '#ede9fe', status: 'INACTIVE', fieldCount: 3, sortOrder: 8, itemCount: 1, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'DIVIDER_LINE', sectionName: '구분선', type: 'DIVIDER', description: '영역 간 시각적 구분. 높이·색상 설정 가능.', previewColor: '#e2e8f0', status: 'DEPRECATED', fieldCount: 2, sortOrder: 9, itemCount: 1, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-01 09:00', updatedBy: 'admin', updatedAt: '26-01-01 09:00' },
  { sectionCode: 'MD_RECOMMEND', sectionName: 'MD추천', type: 'PRODUCT_CAROUSEL', description: '탭별 상품 추천. 탭 이름 + 상품 배열이 반복되는 구조.', previewColor: '#e0f2fe', status: 'ACTIVE', fieldCount: 2, sortOrder: 10, itemCount: 5, layoutType: 'LAYERED', createdBy: 'admin', createdAt: '26-01-15 09:00', updatedBy: 'admin', updatedAt: '26-02-01 10:00' },
]

export type SectionStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'DEPRECATED'

export interface SectionFilter {
  keyword: string
  status: SectionStatusFilter
}

export function filterSections(items: SectionItem[], filter: SectionFilter): SectionItem[] {
  let result = items
  if (filter.status !== 'ALL') result = result.filter(i => i.status === filter.status)
  if (filter.keyword) {
    const kw = filter.keyword.toLowerCase()
    result = result.filter(i => i.sectionCode.toLowerCase().includes(kw) || i.sectionName.toLowerCase().includes(kw))
  }
  return result
}
