export type ProductStatus = 'ON_SALE' | 'SOLD_OUT' | 'UNDER_REVIEW' | 'REJECTED' | 'DRAFT' | 'DISCONTINUED'

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  ON_SALE: '판매중',
  SOLD_OUT: '품절',
  UNDER_REVIEW: '심사중',
  REJECTED: '반려',
  DRAFT: '임시저장',
  DISCONTINUED: '판매종료',
}

export interface Product {
  product_id: number
  name: string
  category: string
  status: ProductStatus
  price_sale: number
  total_stock: number
  sku_count: number
  soldout_sku: number
  rating: number
  review_count: number
  updated_at: string
}

export const MOCK_PRODUCTS: Product[] = [
  { product_id: 101, name: '나이키 페가수스 41', category: '러닝화', status: 'ON_SALE', price_sale: 152000, total_stock: 35, sku_count: 10, soldout_sku: 2, rating: 4.7, review_count: 324, updated_at: '2026.06.25 14:30' },
  { product_id: 102, name: '나이키 보메로 18', category: '러닝화', status: 'ON_SALE', price_sale: 189000, total_stock: 22, sku_count: 8, soldout_sku: 0, rating: 4.5, review_count: 156, updated_at: '2026.06.24 10:15' },
  { product_id: 103, name: '나이키 드라이핏 ADV 러닝 티셔츠', category: '러닝 의류', status: 'ON_SALE', price_sale: 59000, total_stock: 120, sku_count: 12, soldout_sku: 0, rating: 4.3, review_count: 89, updated_at: '2026.06.23 09:00' },
  { product_id: 104, name: '나이키 에어 줌 스트럭쳐 25', category: '러닝화', status: 'SOLD_OUT', price_sale: 159000, total_stock: 0, sku_count: 10, soldout_sku: 10, rating: 4.4, review_count: 201, updated_at: '2026.06.22 16:45' },
  { product_id: 105, name: '나이키 런닝 캡 드라이핏', category: '러닝 기어·액세서리', status: 'ON_SALE', price_sale: 35000, total_stock: 80, sku_count: 4, soldout_sku: 0, rating: 4.1, review_count: 45, updated_at: '2026.06.21 11:20' },
  { product_id: 106, name: '나이키 인피니티 런 4', category: '러닝화', status: 'UNDER_REVIEW', price_sale: 199000, total_stock: 50, sku_count: 10, soldout_sku: 0, rating: 0, review_count: 0, updated_at: '2026.06.26 08:00' },
  { product_id: 107, name: '나이키 윈드러너 재킷', category: '러닝 의류', status: 'REJECTED', price_sale: 149000, total_stock: 30, sku_count: 6, soldout_sku: 0, rating: 0, review_count: 0, updated_at: '2026.06.20 15:30' },
  { product_id: 108, name: '나이키 줌X 베이퍼플라이 NEXT% 3', category: '러닝화', status: 'DRAFT', price_sale: 329000, total_stock: 0, sku_count: 0, soldout_sku: 0, rating: 0, review_count: 0, updated_at: '2026.06.19 17:00' },
]
