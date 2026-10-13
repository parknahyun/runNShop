// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StandardCategoryStatus = 'ACTIVE' | 'INACTIVE'
export type StandardCategoryDepth = 1 | 2 | 3

export interface StandardCategory {
  categoryId: string
  categoryName: string
  parentId: string | null   // depth === 1 이면 null, depth === 2면 대분류, depth === 3이면 중분류를 가리킨다
  depth: StandardCategoryDepth
  sortOrder: number
  status: StandardCategoryStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface StandardCategoryFilter {
  keyword: string
  depth: StandardCategoryDepth | 'ALL'
  status: StandardCategoryStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const STANDARD_CATEGORY_STATUS_LABEL: Record<StandardCategoryStatus, string> = {
  ACTIVE: '사용',
  INACTIVE: '미사용',
}

export const STANDARD_CATEGORY_DEPTH_LABEL: Record<StandardCategoryDepth, string> = {
  1: '대분류',
  2: '중분류',
  3: '소분류',
}

// ---------------------------------------------------------------------------
// Mock data — 신발 / 의류 / 액세서리 / 영양 4개 대분류, 각 하위 중분류(+ 일부 소분류)
// ---------------------------------------------------------------------------

export const MOCK_STANDARD_CATEGORIES: StandardCategory[] = [
  {
    categoryId: 'STD-001', categoryName: '신발', parentId: null, depth: 1, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:00', updatedBy: 'admin', updatedAt: '2025-10-01 09:00',
  },
  {
    categoryId: 'STD-002', categoryName: '러닝화', parentId: 'STD-001', depth: 2, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:05', updatedBy: 'admin', updatedAt: '2025-10-01 09:05',
  },
  {
    categoryId: 'STD-013', categoryName: '경량러닝화', parentId: 'STD-002', depth: 3, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:00', updatedBy: 'admin', updatedAt: '2026-04-01 09:00',
  },
  {
    categoryId: 'STD-014', categoryName: '쿠션러닝화', parentId: 'STD-002', depth: 3, sortOrder: 2, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:01', updatedBy: 'admin', updatedAt: '2026-04-01 09:01',
  },
  {
    categoryId: 'STD-003', categoryName: '트레일화', parentId: 'STD-001', depth: 2, sortOrder: 2, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:06', updatedBy: 'admin', updatedAt: '2025-10-01 09:06',
  },
  {
    categoryId: 'STD-004', categoryName: '의류', parentId: null, depth: 1, sortOrder: 2, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:10', updatedBy: 'admin', updatedAt: '2025-10-01 09:10',
  },
  {
    categoryId: 'STD-005', categoryName: '러닝의류', parentId: 'STD-004', depth: 2, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:11', updatedBy: 'admin', updatedAt: '2025-10-01 09:11',
  },
  {
    categoryId: 'STD-015', categoryName: '상의', parentId: 'STD-005', depth: 3, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:02', updatedBy: 'admin', updatedAt: '2026-04-01 09:02',
  },
  {
    categoryId: 'STD-016', categoryName: '하의', parentId: 'STD-005', depth: 3, sortOrder: 2, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-04-01 09:03', updatedBy: 'admin', updatedAt: '2026-04-01 09:03',
  },
  {
    categoryId: 'STD-006', categoryName: '아웃도어의류', parentId: 'STD-004', depth: 2, sortOrder: 2, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:12', updatedBy: 'admin', updatedAt: '2025-10-01 09:12',
  },
  {
    categoryId: 'STD-007', categoryName: '액세서리', parentId: null, depth: 1, sortOrder: 3, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:20', updatedBy: 'admin', updatedAt: '2025-10-01 09:20',
  },
  {
    categoryId: 'STD-008', categoryName: '러닝워치/GPS', parentId: 'STD-007', depth: 2, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:21', updatedBy: 'admin', updatedAt: '2025-10-01 09:21',
  },
  {
    categoryId: 'STD-009', categoryName: '양말/이너웨어', parentId: 'STD-007', depth: 2, sortOrder: 2, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:22', updatedBy: 'admin', updatedAt: '2025-10-01 09:22',
  },
  {
    categoryId: 'STD-010', categoryName: '가방/액세서리', parentId: 'STD-007', depth: 2, sortOrder: 3, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:23', updatedBy: 'admin', updatedAt: '2025-10-01 09:23',
  },
  {
    categoryId: 'STD-011', categoryName: '영양', parentId: null, depth: 1, sortOrder: 4, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:30', updatedBy: 'admin', updatedAt: '2025-10-01 09:30',
  },
  {
    categoryId: 'STD-012', categoryName: '보충제/영양', parentId: 'STD-011', depth: 2, sortOrder: 1, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-10-01 09:31', updatedBy: 'admin', updatedAt: '2025-10-01 09:31',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getParentName(categories: StandardCategory[], parentId: string | null): string {
  if (!parentId) return '-'
  return categories.find((c) => c.categoryId === parentId)?.categoryName ?? '-'
}

export function getTopCategories(categories: StandardCategory[]): StandardCategory[] {
  return categories.filter((c) => c.depth === 1).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getMidCategories(categories: StandardCategory[]): StandardCategory[] {
  return categories.filter((c) => c.depth === 2).sort((a, b) => a.sortOrder - b.sortOrder)
}

// depth에 따라 상위카테고리 후보(부모가 될 수 있는 카테고리 목록)를 반환한다
export function getParentCandidates(categories: StandardCategory[], depth: StandardCategoryDepth): StandardCategory[] {
  if (depth === 2) return getTopCategories(categories)
  if (depth === 3) return getMidCategories(categories)
  return []
}

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterStandardCategories(items: StandardCategory[], filter: StandardCategoryFilter): StandardCategory[] {
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

let _stdSeq = MOCK_STANDARD_CATEGORIES.length + 1
export function nextStandardCategoryId(): string {
  return `STD-${String(_stdSeq++).padStart(3, '0')}`
}
