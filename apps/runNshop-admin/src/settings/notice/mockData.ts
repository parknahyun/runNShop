// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NoticeTargetType = 'CUSTOMER' | 'VENDOR' | 'ALL'

export interface Notice {
  noticeId: string
  targetType: NoticeTargetType
  title: string
  content: string
  isPopup: boolean
  isImportant: boolean
  displayFrom: string | null
  displayTo: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface NoticeFilter {
  keyword: string
  targetType: NoticeTargetType | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const NOTICE_TARGET_TYPE_LABEL: Record<NoticeTargetType, string> = {
  CUSTOMER: '고객',
  VENDOR:   '입점사',
  ALL:      '전체',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_NOTICES: Notice[] = [
  {
    noticeId: 'NTC-001', targetType: 'ALL', title: '설 연휴 배송 안내',
    content: '설 연휴 기간(2026-02-16 ~ 2026-02-18) 동안 배송이 지연될 수 있습니다. 넉넉한 일정으로 주문해 주세요.',
    isPopup: true, isImportant: true,
    displayFrom: '2026-02-10', displayTo: '2026-02-18',
    createdBy: 'admin.kim', createdAt: '2026-02-05 09:00:00', updatedAt: '2026-02-05 09:00:00',
  },
  {
    noticeId: 'NTC-002', targetType: 'CUSTOMER', title: '개인정보 처리방침 개정 안내',
    content: '개인정보 처리방침이 2026년 3월 1일부로 개정됩니다. 주요 변경사항을 확인해 주세요.',
    isPopup: false, isImportant: true,
    displayFrom: '2026-02-20', displayTo: null,
    createdBy: 'admin.kim', createdAt: '2026-02-20 09:00:00', updatedAt: '2026-02-20 09:00:00',
  },
  {
    noticeId: 'NTC-003', targetType: 'VENDOR', title: '정산 시스템 점검 안내',
    content: '정산 시스템 점검이 2026-03-05 02:00~04:00 진행됩니다. 점검 시간 동안 정산 조회가 제한됩니다.',
    isPopup: false, isImportant: false,
    displayFrom: '2026-03-01', displayTo: '2026-03-05',
    createdBy: 'ops.lee', createdAt: '2026-03-01 10:00:00', updatedAt: '2026-03-01 10:00:00',
  },
  {
    noticeId: 'NTC-004', targetType: 'ALL', title: '앱 업데이트 안내 (v3.2.0)',
    content: '더 빠르고 안정적인 서비스를 위해 앱을 업데이트했습니다. 최신 버전으로 업데이트해 주세요.',
    isPopup: true, isImportant: false,
    displayFrom: null, displayTo: null,
    createdBy: 'admin.kim', createdAt: '2026-03-10 09:00:00', updatedAt: '2026-03-10 09:00:00',
  },
  {
    noticeId: 'NTC-005', targetType: 'VENDOR', title: '입점 수수료 정책 변경 안내',
    content: '2026년 4월 1일부터 카테고리별 입점 수수료율이 조정됩니다. 자세한 내용은 공지사항을 확인해 주세요.',
    isPopup: false, isImportant: true,
    displayFrom: '2026-03-15', displayTo: '2026-04-01',
    createdBy: 'ops.lee', createdAt: '2026-03-15 09:00:00', updatedAt: '2026-03-20 11:00:00',
  },
  {
    noticeId: 'NTC-006', targetType: 'CUSTOMER', title: '고객센터 운영시간 변경 안내',
    content: '고객센터 운영시간이 평일 09:00~18:00으로 변경됩니다.',
    isPopup: false, isImportant: false,
    displayFrom: null, displayTo: null,
    createdBy: 'admin.kim', createdAt: '2026-01-05 09:00:00', updatedAt: '2026-01-05 09:00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterNotices(items: Notice[], filter: NoticeFilter): Notice[] {
  return items.filter((n) => {
    if (filter.keyword.trim() && !n.title.toLowerCase().includes(filter.keyword.trim().toLowerCase())) return false
    if (filter.targetType !== 'ALL' && n.targetType !== filter.targetType) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

export function nextNoticeId(items: Notice[]): string {
  const max = items.reduce((acc, n) => {
    const num = parseInt(n.noticeId.replace('NTC-', ''), 10)
    return isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `NTC-${String(max + 1).padStart(3, '0')}`
}
