export type StatsPeriod = 'TODAY' | '7D' | '30D' | 'CUSTOM'

export const PERIOD_LABEL: Record<StatsPeriod, string> = {
  TODAY: '오늘',
  '7D': '최근 7일',
  '30D': '최근 30일',
  CUSTOM: '직접입력',
}

export interface SalesSummary {
  total_revenue: number
  total_qty: number
  avg_order_amount: number
  change_rate: number // %, vs 전기간
}

export const SALES_SUMMARY_BY_PERIOD: Record<StatsPeriod, SalesSummary> = {
  TODAY: { total_revenue: 8_240_000, total_qty: 54, avg_order_amount: 152_593, change_rate: 4.2 },
  '7D': { total_revenue: 61_350_000, total_qty: 402, avg_order_amount: 152_612, change_rate: 8.6 },
  '30D': { total_revenue: 248_920_000, total_qty: 1_635, avg_order_amount: 152_244, change_rate: -2.3 },
  CUSTOM: { total_revenue: 248_920_000, total_qty: 1_635, avg_order_amount: 152_244, change_rate: -2.3 },
}

export interface DailyTrendRow {
  date: string
  revenue: number
  qty: number
}

export const MOCK_SALES_TREND: DailyTrendRow[] = [
  { date: '2026.06.25', revenue: 9_120_000, qty: 60 },
  { date: '2026.06.26', revenue: 8_540_000, qty: 56 },
  { date: '2026.06.27', revenue: 7_980_000, qty: 52 },
  { date: '2026.06.28', revenue: 10_350_000, qty: 68 },
  { date: '2026.06.29', revenue: 11_200_000, qty: 74 },
  { date: '2026.06.30', revenue: 9_760_000, qty: 64 },
  { date: '2026.07.01', revenue: 8_890_000, qty: 58 },
  { date: '2026.07.02', revenue: 9_430_000, qty: 62 },
  { date: '2026.07.03', revenue: 10_120_000, qty: 66 },
  { date: '2026.07.04', revenue: 8_670_000, qty: 57 },
  { date: '2026.07.05', revenue: 11_980_000, qty: 79 },
  { date: '2026.07.06', revenue: 9_540_000, qty: 63 },
  { date: '2026.07.07', revenue: 10_680_000, qty: 70 },
  { date: '2026.07.08', revenue: 8_240_000, qty: 54 },
]

export interface ProductRankingRow {
  rank: number
  product_name: string
  qty: number
  revenue: number
  change_rate: number
}

export const MOCK_PRODUCT_RANKING: ProductRankingRow[] = [
  { rank: 1, product_name: '나이키 페가수스 41', qty: 412, revenue: 62_624_000, change_rate: 12.4 },
  { rank: 2, product_name: '나이키 보메로 18', qty: 198, revenue: 37_422_000, change_rate: 6.1 },
  { rank: 3, product_name: '나이키 드라이핏 ADV 러닝 티셔츠', qty: 356, revenue: 21_004_000, change_rate: -3.8 },
  { rank: 4, product_name: '나이키 에어 줌 스트럭쳐 25', qty: 87, revenue: 13_833_000, change_rate: -18.2 },
  { rank: 5, product_name: '나이키 런닝 캡 드라이핏', qty: 245, revenue: 8_575_000, change_rate: 2.5 },
]

export interface SkuStatusRow {
  sku_id: string
  product_name: string
  option: string
  stock: number
  qty: number
  revenue: number
}

export const MOCK_SKU_STATUS: SkuStatusRow[] = [
  { sku_id: 'SKU-001', product_name: '나이키 페가수스 41', option: '블랙 / 260', stock: 12, qty: 88, revenue: 13_376_000 },
  { sku_id: 'SKU-002', product_name: '나이키 페가수스 41', option: '화이트 / 265', stock: 5, qty: 74, revenue: 11_248_000 },
  { sku_id: 'SKU-003', product_name: '나이키 보메로 18', option: '블랙 / 260', stock: 8, qty: 62, revenue: 11_718_000 },
  { sku_id: 'SKU-004', product_name: '나이키 드라이핏 ADV 러닝 티셔츠', option: '네이비 / L', stock: 34, qty: 120, revenue: 7_080_000 },
  { sku_id: 'SKU-005', product_name: '나이키 에어 줌 스트럭쳐 25', option: '블랙 / 270', stock: 0, qty: 41, revenue: 6_519_000 },
  { sku_id: 'SKU-006', product_name: '나이키 런닝 캡 드라이핏', option: '블랙 / Free', stock: 45, qty: 130, revenue: 4_550_000 },
]
