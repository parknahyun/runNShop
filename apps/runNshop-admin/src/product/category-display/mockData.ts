// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DisplayCategoryStatus = 'ACTIVE' | 'INACTIVE'
export type DisplayCategoryDepth = 1 | 2 | 3

export interface DisplayCategory {
  categoryId: string
  categoryName: string
  parentId: string | null   // depth === 1 이면 null, depth === 2면 대분류, depth === 3이면 중분류를 가리킨다
  depth: DisplayCategoryDepth
  sortOrder: number
  visible: boolean          // 고객 화면(GNB/내비게이션) 노출여부
  standardCategoryIds: string[]   // 매핑된 표준카테고리(복수 선택 가능, src/product/category-std 참조)
  status: DisplayCategoryStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface DisplayCategoryFilter {
  keyword: string
  depth: DisplayCategoryDepth | 'ALL'
  status: DisplayCategoryStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const DISPLAY_CATEGORY_STATUS_LABEL: Record<DisplayCategoryStatus, string> = {
  ACTIVE: '사용',
  INACTIVE: '미사용',
}

export const DISPLAY_CATEGORY_DEPTH_LABEL: Record<DisplayCategoryDepth, string> = {
  1: '대분류',
  2: '중분류',
  3: '소분류',
}

// ---------------------------------------------------------------------------
// Mock data — 고객 화면 GNB에 노출되는 전시카테고리 (표준카테고리와는 독립적인 체계)
// ---------------------------------------------------------------------------

export const MOCK_DISPLAY_CATEGORIES: DisplayCategory[] = [
  {
    categoryId: 'DPC-001', categoryName: '신발', parentId: null, depth: 1, sortOrder: 1, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:00', updatedBy: 'admin', updatedAt: '2025-10-05 09:00',
  },
  {
    categoryId: 'DPC-002', categoryName: '러닝화', parentId: 'DPC-001', depth: 2, sortOrder: 1, visible: true, standardCategoryIds: ['STD-002'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:05', updatedBy: 'admin', updatedAt: '2025-10-05 09:05',
  },
  {
    categoryId: 'DPC-012', categoryName: '마라톤화', parentId: 'DPC-002', depth: 3, sortOrder: 1, visible: true, standardCategoryIds: ['STD-013', 'STD-014'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:00', updatedBy: 'admin', updatedAt: '2026-04-01 09:00',
  },
  {
    categoryId: 'DPC-013', categoryName: '트레이닝화', parentId: 'DPC-002', depth: 3, sortOrder: 2, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:01', updatedBy: 'admin', updatedAt: '2026-04-01 09:01',
  },
  {
    categoryId: 'DPC-003', categoryName: '트레일화', parentId: 'DPC-001', depth: 2, sortOrder: 2, visible: true, standardCategoryIds: ['STD-003'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:06', updatedBy: 'admin', updatedAt: '2025-10-05 09:06',
  },
  {
    categoryId: 'DPC-004', categoryName: '워킹화', parentId: 'DPC-001', depth: 2, sortOrder: 3, visible: false, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-02-01 09:00', updatedBy: 'editor1', updatedAt: '2026-02-01 09:00',
  },
  {
    categoryId: 'DPC-005', categoryName: '의류', parentId: null, depth: 1, sortOrder: 2, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:10', updatedBy: 'admin', updatedAt: '2025-10-05 09:10',
  },
  {
    categoryId: 'DPC-006', categoryName: '상의', parentId: 'DPC-005', depth: 2, sortOrder: 1, visible: true, standardCategoryIds: ['STD-015'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:11', updatedBy: 'admin', updatedAt: '2025-10-05 09:11',
  },
  {
    categoryId: 'DPC-014', categoryName: '반팔', parentId: 'DPC-006', depth: 3, sortOrder: 1, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:02', updatedBy: 'admin', updatedAt: '2026-04-01 09:02',
  },
  {
    categoryId: 'DPC-015', categoryName: '긴팔', parentId: 'DPC-006', depth: 3, sortOrder: 2, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:03', updatedBy: 'admin', updatedAt: '2026-04-01 09:03',
  },
  {
    categoryId: 'DPC-007', categoryName: '하의', parentId: 'DPC-005', depth: 2, sortOrder: 2, visible: true, standardCategoryIds: ['STD-016'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:12', updatedBy: 'admin', updatedAt: '2025-10-05 09:12',
  },
  {
    categoryId: 'DPC-008', categoryName: '액세서리', parentId: null, depth: 1, sortOrder: 3, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:20', updatedBy: 'admin', updatedAt: '2025-10-05 09:20',
  },
  {
    categoryId: 'DPC-009', categoryName: '워치/GPS', parentId: 'DPC-008', depth: 2, sortOrder: 1, visible: true, standardCategoryIds: ['STD-008'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:21', updatedBy: 'admin', updatedAt: '2025-10-05 09:21',
  },
  {
    categoryId: 'DPC-010', categoryName: '가방', parentId: 'DPC-008', depth: 2, sortOrder: 2, visible: true, standardCategoryIds: ['STD-010'], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-05 09:22', updatedBy: 'admin', updatedAt: '2025-10-05 09:22',
  },
  {
    categoryId: 'DPC-011', categoryName: '이벤트관', parentId: null, depth: 1, sortOrder: 4, visible: true, standardCategoryIds: [], status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-01-10 09:00', updatedBy: 'admin', updatedAt: '2026-01-10 09:00',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getDisplayParentName(categories: DisplayCategory[], parentId: string | null): string {
  if (!parentId) return '-'
  return categories.find((c) => c.categoryId === parentId)?.categoryName ?? '-'
}

export function getDisplayTopCategories(categories: DisplayCategory[]): DisplayCategory[] {
  return categories.filter((c) => c.depth === 1).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getDisplayMidCategories(categories: DisplayCategory[]): DisplayCategory[] {
  return categories.filter((c) => c.depth === 2).sort((a, b) => a.sortOrder - b.sortOrder)
}

// depth에 따라 상위카테고리 후보(부모가 될 수 있는 카테고리 목록)를 반환한다
export function getDisplayParentCandidates(categories: DisplayCategory[], depth: DisplayCategoryDepth): DisplayCategory[] {
  if (depth === 2) return getDisplayTopCategories(categories)
  if (depth === 3) return getDisplayMidCategories(categories)
  return []
}

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterDisplayCategories(items: DisplayCategory[], filter: DisplayCategoryFilter): DisplayCategory[] {
  return items.filter((c) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!c.categoryName.toLowerCase().includes(kw) && !c.categoryId.toLowerCase().includes(kw)) return false
    }
    if (filter.depth !== 'ALL' && c.depth !== filter.depth) return false
    if (filter.status !== 'ALL' && c.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _dpcSeq = MOCK_DISPLAY_CATEGORIES.length + 1
export function nextDisplayCategoryId(): string {
  return `DPC-${String(_dpcSeq++).padStart(3, '0')}`
}
