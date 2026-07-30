// ---------------------------------------------------------------------------
// 공통코드 (2단계: 그룹 → 코드)
// ---------------------------------------------------------------------------

export interface CommonCode {
  code: string
  label: string
  sortOrder: number
}

export interface CommonCodeGroup {
  groupCode: string
  groupName: string
  description: string
  codes: CommonCode[]
}

export const COMMON_CODE_GROUPS: CommonCodeGroup[] = [
  {
    groupCode: 'DISPLAY_TYPE',
    groupName: '노출방법',
    description: '이미지/상품 배열의 노출 방식',
    codes: [
      { code: 'LAYERED', label: 'Layered (슬라이드/겹침)', sortOrder: 1 },
      { code: 'CAROUSEL', label: 'Carousel (가로 스크롤)', sortOrder: 2 },
      { code: 'TILED', label: 'Tiled (나열)', sortOrder: 3 },
    ],
  },
  {
    groupCode: 'COLUMN_COUNT',
    groupName: '열 수',
    description: '그리드 열 개수',
    codes: [
      { code: '2', label: '2열', sortOrder: 1 },
      { code: '3', label: '3열', sortOrder: 2 },
      { code: '4', label: '4열', sortOrder: 3 },
    ],
  },
  {
    groupCode: 'LINK_TARGET',
    groupName: '링크 타겟',
    description: '링크 열기 방식',
    codes: [
      { code: '_self', label: '현재 창', sortOrder: 1 },
      { code: '_blank', label: '새 창', sortOrder: 2 },
    ],
  },
  {
    groupCode: 'BANNER_HEIGHT',
    groupName: '배너 높이',
    description: '배너 영역 높이 설정',
    codes: [
      { code: 'FULL', label: '전체 높이', sortOrder: 1 },
      { code: 'HALF', label: '절반 높이', sortOrder: 2 },
      { code: 'AUTO', label: '자동', sortOrder: 3 },
    ],
  },
  {
    groupCode: 'PAGE_STATUS',
    groupName: '페이지 상태',
    description: '페이지 게시 상태',
    codes: [
      { code: 'PUBLISHED', label: '게시중', sortOrder: 1 },
      { code: 'SCHEDULED', label: '예약', sortOrder: 2 },
      { code: 'DRAFT', label: '미게시', sortOrder: 3 },
      { code: 'DEPRECATED', label: '폐기', sortOrder: 4 },
    ],
  },
]

// 그룹코드로 코드 목록 조회
export function getCodesByGroup(groupCode: string): CommonCode[] {
  const group = COMMON_CODE_GROUPS.find(g => g.groupCode === groupCode)
  return group?.codes || []
}

// 그룹 목록 (select용)
export function getGroupOptions(): Array<{ groupCode: string; groupName: string }> {
  return COMMON_CODE_GROUPS.map(g => ({ groupCode: g.groupCode, groupName: g.groupName }))
}
