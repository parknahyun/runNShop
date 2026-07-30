export type StatsPeriod = 'TODAY' | '7D' | '30D' | 'CUSTOM'

export const PERIOD_LABEL: Record<StatsPeriod, string> = {
  TODAY: '오늘',
  '7D': '최근 7일',
  '30D': '최근 30일',
  CUSTOM: '직접입력',
}

export interface ClaimSummary {
  total_claim_count: number
  claim_rate: number // %
  return_count: number
  exchange_count: number
  cancel_count: number
}

export const CLAIM_SUMMARY_BY_PERIOD: Record<StatsPeriod, ClaimSummary> = {
  TODAY: { total_claim_count: 6, claim_rate: 3.1, return_count: 2, exchange_count: 1, cancel_count: 3 },
  '7D': { total_claim_count: 41, claim_rate: 4.4, return_count: 15, exchange_count: 9, cancel_count: 17 },
  '30D': { total_claim_count: 168, claim_rate: 5.2, return_count: 61, exchange_count: 34, cancel_count: 73 },
  CUSTOM: { total_claim_count: 168, claim_rate: 5.2, return_count: 61, exchange_count: 34, cancel_count: 73 },
}

export interface ClaimTrendRow {
  date: string
  count: number
}

export const MOCK_CLAIM_TREND: ClaimTrendRow[] = [
  { date: '2026.06.25', count: 5 },
  { date: '2026.06.26', count: 7 },
  { date: '2026.06.27', count: 4 },
  { date: '2026.06.28', count: 6 },
  { date: '2026.06.29', count: 9 },
  { date: '2026.06.30', count: 5 },
  { date: '2026.07.01', count: 3 },
  { date: '2026.07.02', count: 6 },
  { date: '2026.07.03', count: 8 },
  { date: '2026.07.04', count: 4 },
  { date: '2026.07.05', count: 7 },
  { date: '2026.07.06', count: 5 },
  { date: '2026.07.07', count: 8 },
  { date: '2026.07.08', count: 6 },
]

export interface ClaimTypeRow {
  type: string
  count: number
  pct: number
}

export const MOCK_CLAIM_TYPE: ClaimTypeRow[] = [
  { type: '취소', count: 73, pct: 43.5 },
  { type: '반품', count: 61, pct: 36.3 },
  { type: '교환', count: 34, pct: 20.2 },
]

export interface ClaimResponsibilityRow {
  responsibility: string
  count: number
  pct: number
}

export const MOCK_CLAIM_RESPONSIBILITY: ClaimResponsibilityRow[] = [
  { responsibility: '고객귀책', count: 98, pct: 58.3 },
  { responsibility: '입점사귀책', count: 47, pct: 28.0 },
  { responsibility: '플랫폼귀책', count: 23, pct: 13.7 },
]

export interface ClaimProductRow {
  product_name: string
  claim_count: number
  claim_rate: number
}

export const MOCK_CLAIM_PRODUCT: ClaimProductRow[] = [
  { product_name: '나이키 에어 줌 스트럭쳐 25', claim_count: 38, claim_rate: 12.4 },
  { product_name: '나이키 페가수스 41', claim_count: 29, claim_rate: 4.8 },
  { product_name: '나이키 드라이핏 ADV 러닝 티셔츠', claim_count: 22, claim_rate: 5.1 },
  { product_name: '나이키 보메로 18', claim_count: 15, claim_rate: 3.9 },
  { product_name: '나이키 런닝 캡 드라이핏', claim_count: 9, claim_rate: 2.2 },
]
