// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BannedWordCategory = 'PROFANITY' | 'PERSONAL_INFO' | 'SPAM' | 'OTHER'
export type BannedWordStatus = 'ACTIVE' | 'INACTIVE'

export interface BannedWord {
  wordId: string
  word: string
  category: BannedWordCategory
  status: BannedWordStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface BannedWordFilter {
  keyword: string
  category: BannedWordCategory | 'ALL'
  status: BannedWordStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const BANNED_WORD_CATEGORY_LABEL: Record<BannedWordCategory, string> = {
  PROFANITY:     '욕설/비속어',
  PERSONAL_INFO: '개인정보',
  SPAM:          '스팸/광고',
  OTHER:         '기타',
}

export const BANNED_WORD_STATUS_LABEL: Record<BannedWordStatus, string> = {
  ACTIVE:   '활성',
  INACTIVE: '비활성',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_BANNED_WORDS: BannedWord[] = [
  { wordId: 'BAN-001', word: '시발',           category: 'PROFANITY',     status: 'ACTIVE',   createdBy: 'admin.kim', createdAt: '2025-10-01 09:00:00', updatedAt: '2025-10-01 09:00:00' },
  { wordId: 'BAN-002', word: '개새끼',         category: 'PROFANITY',     status: 'ACTIVE',   createdBy: 'admin.kim', createdAt: '2025-10-01 09:00:00', updatedAt: '2025-10-01 09:00:00' },
  { wordId: 'BAN-003', word: '주민등록번호',    category: 'PERSONAL_INFO', status: 'ACTIVE',   createdBy: 'ops.lee',   createdAt: '2025-10-05 10:00:00', updatedAt: '2025-10-05 10:00:00' },
  { wordId: 'BAN-004', word: '계좌번호 입금',   category: 'SPAM',          status: 'ACTIVE',   createdBy: 'ops.lee',   createdAt: '2025-11-10 11:00:00', updatedAt: '2026-01-20 09:30:00' },
  { wordId: 'BAN-005', word: '대출 상담',       category: 'SPAM',          status: 'ACTIVE',   createdBy: 'ops.lee',   createdAt: '2025-11-10 11:05:00', updatedAt: '2025-11-10 11:05:00' },
  { wordId: 'BAN-006', word: '카카오톡 아이디', category: 'PERSONAL_INFO', status: 'ACTIVE',   createdBy: 'admin.kim', createdAt: '2025-12-01 09:00:00', updatedAt: '2025-12-01 09:00:00' },
  { wordId: 'BAN-007', word: '병신',           category: 'PROFANITY',     status: 'INACTIVE', createdBy: 'admin.kim', createdAt: '2025-10-02 09:00:00', updatedAt: '2026-02-15 14:00:00' },
  { wordId: 'BAN-008', word: '기타 금지어 샘플', category: 'OTHER',        status: 'ACTIVE',   createdBy: 'ops.lee',   createdAt: '2026-03-01 09:00:00', updatedAt: '2026-03-01 09:00:00' },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterBannedWords(items: BannedWord[], filter: BannedWordFilter): BannedWord[] {
  return items.filter((w) => {
    if (filter.keyword.trim() && !w.word.toLowerCase().includes(filter.keyword.trim().toLowerCase())) return false
    if (filter.category !== 'ALL' && w.category !== filter.category) return false
    if (filter.status !== 'ALL' && w.status !== filter.status) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

export function nextWordId(items: BannedWord[]): string {
  const max = items.reduce((acc, w) => {
    const n = parseInt(w.wordId.replace('BAN-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `BAN-${String(max + 1).padStart(3, '0')}`
}
