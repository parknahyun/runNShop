// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TermsType = 'SERVICE' | 'PRIVACY' | 'MARKETING'

export interface Terms {
  termsId: string
  termsType: TermsType
  version: string
  content: string
  effectiveAt: string
  createdBy: string
  createdAt: string
}

export interface TermsFilter {
  keyword: string
  termsType: TermsType | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const TERMS_TYPE_LABEL: Record<TermsType, string> = {
  SERVICE:    '서비스 이용약관',
  PRIVACY:    '개인정보 처리방침',
  MARKETING:  '마케팅 정보 수신 동의',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_TERMS: Terms[] = [
  {
    termsId: 'TRM-001', termsType: 'SERVICE', version: '1.0',
    content: '제1조(목적) 이 약관은 runNshop이 제공하는 전자상거래 관련 서비스의 이용조건 및 절차를 규정함을 목적으로 합니다.',
    effectiveAt: '2025-01-01', createdBy: 'admin.kim', createdAt: '2024-12-20 09:00:00',
  },
  {
    termsId: 'TRM-002', termsType: 'PRIVACY', version: '1.0',
    content: '제1조(수집하는 개인정보 항목) 회사는 회원가입, 상담, 서비스 신청 등을 위해 이름, 휴대폰번호, 이메일 등을 수집합니다.',
    effectiveAt: '2025-01-01', createdBy: 'admin.kim', createdAt: '2024-12-20 09:10:00',
  },
  {
    termsId: 'TRM-003', termsType: 'MARKETING', version: '1.0',
    content: '회사는 이벤트, 혜택 정보 등을 SMS, 이메일, 카카오톡으로 안내하기 위해 마케팅 정보 수신 동의를 받습니다.',
    effectiveAt: '2025-01-01', createdBy: 'admin.kim', createdAt: '2024-12-20 09:20:00',
  },
  {
    termsId: 'TRM-004', termsType: 'SERVICE', version: '1.1',
    content: '제1조(목적) 이 약관은 runNshop이 제공하는 전자상거래 관련 서비스의 이용조건 및 절차를 규정함을 목적으로 합니다. (분쟁해결 조항 추가)',
    effectiveAt: '2025-07-01', createdBy: 'admin.kim', createdAt: '2025-06-15 09:00:00',
  },
  {
    termsId: 'TRM-005', termsType: 'PRIVACY', version: '1.1',
    content: '제1조(수집하는 개인정보 항목) 회사는 회원가입, 상담, 서비스 신청 등을 위해 이름, 휴대폰번호, 이메일, 배송지 주소 등을 수집합니다. (배송지 주소 항목 추가)',
    effectiveAt: '2025-07-01', createdBy: 'ops.lee', createdAt: '2025-06-15 09:10:00',
  },
  {
    termsId: 'TRM-006', termsType: 'SERVICE', version: '1.2',
    content: '제1조(목적) 이 약관은 runNshop이 제공하는 전자상거래 관련 서비스의 이용조건 및 절차를 규정함을 목적으로 합니다. (해외배송 조항 추가)',
    effectiveAt: '2026-01-01', createdBy: 'admin.kim', createdAt: '2025-12-10 09:00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterTerms(items: Terms[], filter: TermsFilter): Terms[] {
  return items.filter((t) => {
    if (filter.keyword.trim() && !t.version.toLowerCase().includes(filter.keyword.trim().toLowerCase())) return false
    if (filter.termsType !== 'ALL' && t.termsType !== filter.termsType) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

export function nextTermsId(items: Terms[]): string {
  const max = items.reduce((acc, t) => {
    const n = parseInt(t.termsId.replace('TRM-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `TRM-${String(max + 1).padStart(3, '0')}`
}

// ---------------------------------------------------------------------------
// Uniqueness check
// ---------------------------------------------------------------------------

export function isDuplicateVersion(items: Terms[], termsType: TermsType, version: string): boolean {
  return items.some((t) => t.termsType === termsType && t.version.trim() === version.trim())
}
