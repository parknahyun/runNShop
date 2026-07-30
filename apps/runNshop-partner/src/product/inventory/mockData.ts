export type StockStatus = 'ON_SALE' | 'SOLD_OUT'

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  ON_SALE: '판매중',
  SOLD_OUT: '품절',
}

export interface InventoryItem {
  sku_id: string
  product_id: number
  product_name: string
  option_name: string
  stock: number
  safety_stock: number
  status: StockStatus
  updated_at: string
}

export interface StockHistoryEntry {
  at: string
  sku_id: string
  product_name: string
  option_name: string
  before: number
  after: number
}

export const MOCK_INVENTORY: InventoryItem[] = [
  { sku_id: 'SKU-00101', product_id: 101, product_name: '나이키 페가수스 41', option_name: '블랙 / 260', stock: 12, safety_stock: 10, status: 'ON_SALE', updated_at: '2026.06.25 14:30' },
  { sku_id: 'SKU-00102', product_id: 101, product_name: '나이키 페가수스 41', option_name: '블랙 / 265', stock: 4, safety_stock: 10, status: 'ON_SALE', updated_at: '2026.06.25 14:30' },
  { sku_id: 'SKU-00103', product_id: 101, product_name: '나이키 페가수스 41', option_name: '화이트 / 260', stock: 0, safety_stock: 10, status: 'SOLD_OUT', updated_at: '2026.06.24 09:10' },
  { sku_id: 'SKU-00104', product_id: 101, product_name: '나이키 페가수스 41', option_name: '화이트 / 270', stock: 19, safety_stock: 10, status: 'ON_SALE', updated_at: '2026.06.20 11:00' },
  { sku_id: 'SKU-00201', product_id: 102, product_name: '나이키 보메로 18', option_name: '블랙 / 260', stock: 22, safety_stock: 8, status: 'ON_SALE', updated_at: '2026.06.24 10:15' },
  { sku_id: 'SKU-00202', product_id: 102, product_name: '나이키 보메로 18', option_name: '네이비 / 265', stock: 3, safety_stock: 8, status: 'ON_SALE', updated_at: '2026.06.23 16:40' },
  { sku_id: 'SKU-00203', product_id: 102, product_name: '나이키 보메로 18', option_name: '네이비 / 270', stock: 0, safety_stock: 8, status: 'SOLD_OUT', updated_at: '2026.06.22 08:30' },
  { sku_id: 'SKU-00301', product_id: 103, product_name: '나이키 드라이핏 ADV 러닝 티셔츠', option_name: '블랙 / M', stock: 45, safety_stock: 15, status: 'ON_SALE', updated_at: '2026.06.23 09:00' },
  { sku_id: 'SKU-00302', product_id: 103, product_name: '나이키 드라이핏 ADV 러닝 티셔츠', option_name: '블랙 / L', stock: 30, safety_stock: 15, status: 'ON_SALE', updated_at: '2026.06.23 09:00' },
  { sku_id: 'SKU-00303', product_id: 103, product_name: '나이키 드라이핏 ADV 러닝 티셔츠', option_name: '그레이 / M', stock: 8, safety_stock: 15, status: 'ON_SALE', updated_at: '2026.06.21 13:20' },
  { sku_id: 'SKU-00401', product_id: 104, product_name: '나이키 에어 줌 스트럭쳐 25', option_name: '블랙 / 265', stock: 0, safety_stock: 10, status: 'SOLD_OUT', updated_at: '2026.06.22 16:45' },
  { sku_id: 'SKU-00402', product_id: 104, product_name: '나이키 에어 줌 스트럭쳐 25', option_name: '레드 / 270', stock: 0, safety_stock: 10, status: 'SOLD_OUT', updated_at: '2026.06.22 16:45' },
  { sku_id: 'SKU-00501', product_id: 105, product_name: '나이키 런닝 캡 드라이핏', option_name: '블랙 / FREE', stock: 40, safety_stock: 12, status: 'ON_SALE', updated_at: '2026.06.21 11:20' },
  { sku_id: 'SKU-00502', product_id: 105, product_name: '나이키 런닝 캡 드라이핏', option_name: '화이트 / FREE', stock: 40, safety_stock: 12, status: 'ON_SALE', updated_at: '2026.06.21 11:20' },
]
