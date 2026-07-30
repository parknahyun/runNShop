// ---------------------------------------------------------------------------
// 상품 카탈로그 (프로모션 도메인 전반의 상품 검색/선택에 공통으로 사용)
// ---------------------------------------------------------------------------

export interface CatalogProduct {
  productId: string
  productName: string
  brand: string
  price: number
  status: string      // 상품 마스터 상태 스냅샷 (판매중/품절 등)
}

export const MOCK_PRODUCT_CATALOG: CatalogProduct[] = [
  { productId: 'P001', productName: '쿨링 러닝화', brand: '나이키', price: 129000, status: '판매중' },
  { productId: 'P002', productName: '메쉬 반팔티', brand: '아디다스', price: 59000, status: '판매중' },
  { productId: 'P003', productName: '아이스 양말 3팩', brand: '프로스펙스', price: 15000, status: '판매중' },
  { productId: 'P004', productName: '초보자 러닝화', brand: '뉴발란스', price: 99000, status: '판매중' },
  { productId: 'P005', productName: '러닝 반바지', brand: '나이키', price: 45000, status: '판매중' },
  { productId: 'P006', productName: '마라톤 전용화', brand: '아식스', price: 189000, status: '판매중' },
  { productId: 'P007', productName: '에너지젤 세트', brand: 'GU', price: 32000, status: '판매중' },
  { productId: 'P008', productName: '압축 타이즈', brand: '2XU', price: 89000, status: '판매중' },
  { productId: 'P009', productName: 'GPS 러닝워치', brand: '가민', price: 450000, status: '판매중' },
  { productId: 'P010', productName: '트레일 러닝화', brand: '살로몬', price: 179000, status: '판매중' },
  { productId: 'P011', productName: '방풍 자켓', brand: '파타고니아', price: 230000, status: '품절' },
  { productId: 'P012', productName: '방한 러닝화', brand: '호카', price: 199000, status: '판매중' },
  { productId: 'P013', productName: '기모 레깅스', brand: '언더아머', price: 79000, status: '판매중' },
  { productId: 'P014', productName: '넥워머', brand: '버프', price: 35000, status: '판매종료' },
  { productId: 'P015', productName: '에어줌 페가수스 41', brand: '나이키', price: 159000, status: '판매중' },
  { productId: 'P016', productName: '드라이핏 런닝 탑', brand: '나이키', price: 69000, status: '판매중' },
  { productId: 'P017', productName: '런닝 캡', brand: '나이키', price: 39000, status: '판매중' },
]
