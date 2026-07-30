import { MOCK_BRANDS, type Brand } from '@/product/brand/mockData'
import { MOCK_STANDARD_CATEGORIES, type StandardCategory } from '@/product/category-std/mockData'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// 판매상태: 심사 승인된 상품에만 실질적인 의미가 있다. 심사대기/반려 상품은 승인 시 적용될 "의도한 상태"를 담아둔다.
export type ProductSaleStatus = 'ON_SALE' | 'SOLD_OUT' | 'DISCONTINUED'

// 심사상태: PENDING(심사대기) → APPROVED(승인) 또는 REJECTED(반려)
export type ProductApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// 대표이미지 리사이징 용도: 목록형/카드형/상세형/썸네일형 화면에 맞춰 별도로 리사이징된 이미지를 지정한다
export type ProductImageResizeType = 'LIST' | 'CARD' | 'DETAIL' | 'THUMBNAIL'

export interface ProductImageResize {
  resizeId: string
  resizeType: ProductImageResizeType
  imageUrl: string
  width: number
  height: number
}

export interface ProductImage {
  imageId: string
  imageUrl: string
  sortOrder: number
  isMain: boolean   // 대표이미지 여부 (하나만 true)
  resizes: ProductImageResize[]   // isMain === true 인 이미지에만 의미가 있다
}

export interface ProductOptionGroup {
  optionGroupId: string
  optionName: string       // 예: 사이즈, 색상
  optionValues: string[]   // 예: ['S', 'M', 'L']
}

// SKU 상태: 판매중(정상 노출) / 판매중지(해당 옵션조합만 임시 비활성화)
export type ProductSkuStatus = 'ACTIVE' | 'INACTIVE'

export interface ProductSku {
  skuId: string
  skuKey: string   // 옵션조합 (예: "S / 블랙"), 옵션이 없으면 "기본"
  status: ProductSkuStatus
}

// 재고이력 유형: 입고(+) / 출고(-) / 조정(+ 또는 -)
export type StockMovementType = 'IN' | 'OUT' | 'ADJUST'

export interface ProductStockHistory {
  historyId: string
  skuKey: string     // 옵션조합 (예: "S / 블랙"), 옵션이 없으면 "기본"
  type: StockMovementType
  quantity: number    // 변동수량(부호 있음) — IN은 항상 양수, OUT은 항상 음수, ADJUST는 양/음수 모두 가능
  memo: string
  createdBy: string
  createdAt: string
}

export type ProductInquiryStatus = 'WAITING' | 'ANSWERED'

export interface ProductInquiry {
  inquiryId: string
  memberName: string
  content: string
  status: ProductInquiryStatus
  answer: string             // status === 'ANSWERED' 일 때만 사용
  createdAt: string
  answeredAt: string | null
}

export interface ProductReview {
  reviewId: string
  memberName: string
  rating: number   // 1~5
  content: string
  hidden: boolean   // 관리자 숨김처리 여부
  createdAt: string
}

export interface Product {
  productId: string
  productName: string
  brandId: string
  categoryId: string        // 표준카테고리 참조 (대/중/소분류 구분 없이 지정 가능)
  vendorName: string
  priceOriginal: number      // 정상가
  priceSale: number          // 판매가
  saleStatus: ProductSaleStatus
  approvalStatus: ProductApprovalStatus
  rejectReason: string       // approvalStatus === 'REJECTED' 일 때만 사용
  description: string        // 상품 상세페이지에 노출되는 상세설명
  images: ProductImage[]
  options: ProductOptionGroup[]
  skus: ProductSku[]
  stockHistories: ProductStockHistory[]
  inquiries: ProductInquiry[]
  reviews: ProductReview[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface ProductFilter {
  keyword: string
  brandId: string | 'ALL'
  saleStatus: ProductSaleStatus | 'ALL'
  approvalStatus: ProductApprovalStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const PRODUCT_SALE_STATUS_LABEL: Record<ProductSaleStatus, string> = {
  ON_SALE: '판매중',
  SOLD_OUT: '품절',
  DISCONTINUED: '판매종료',
}

export const PRODUCT_APPROVAL_STATUS_LABEL: Record<ProductApprovalStatus, string> = {
  PENDING: '심사대기',
  APPROVED: '승인',
  REJECTED: '반려',
}

export const PRODUCT_IMAGE_RESIZE_TYPE_LABEL: Record<ProductImageResizeType, string> = {
  LIST: '목록형',
  CARD: '카드형',
  DETAIL: '상세형',
  THUMBNAIL: '썸네일형',
}

export const PRODUCT_INQUIRY_STATUS_LABEL: Record<ProductInquiryStatus, string> = {
  WAITING: '미답변',
  ANSWERED: '답변완료',
}

export const PRODUCT_SKU_STATUS_LABEL: Record<ProductSkuStatus, string> = {
  ACTIVE: '판매중',
  INACTIVE: '판매중지',
}

export const STOCK_MOVEMENT_TYPE_LABEL: Record<StockMovementType, string> = {
  IN: '입고',
  OUT: '출고',
  ADJUST: '조정',
}

// ---------------------------------------------------------------------------
// 참조 마스터데이터 (브랜드관리 / 표준카테고리관리와 동일한 데이터를 참조)
// ---------------------------------------------------------------------------

export { MOCK_BRANDS, MOCK_STANDARD_CATEGORIES }
export type { Brand, StandardCategory }

export function getBrandName(brandId: string): string {
  return MOCK_BRANDS.find((b) => b.brandId === brandId)?.brandName ?? '-'
}

export function getCategoryName(categoryId: string): string {
  return MOCK_STANDARD_CATEGORIES.find((c) => c.categoryId === categoryId)?.categoryName ?? '-'
}

// select 옵션용: 깊이에 따라 들여쓰기 접두어를 붙인 카테고리명
export function formatCategoryOptionLabel(category: StandardCategory): string {
  return `${'　'.repeat(category.depth - 1)}${category.depth > 1 ? '└ ' : ''}${category.categoryName}`
}

// ---------------------------------------------------------------------------
// 옵션조합(SKU) / 재고이력 헬퍼
// ---------------------------------------------------------------------------

// 옵션그룹들의 카테시안곱으로 SKU조합 목록을 생성한다. 옵션이 없으면 "기본" 1건.
export function getSkuCombinations(options: ProductOptionGroup[]): string[] {
  if (options.length === 0) return ['기본']
  return options.reduce<string[]>((combos, group) => {
    if (combos.length === 0) return group.optionValues.slice()
    return combos.flatMap((c) => group.optionValues.map((v) => `${c} / ${v}`))
  }, [])
}

// 특정 SKU조합의 현재고 = 해당 조합 재고이력 변동수량의 합
export function getCurrentStock(histories: ProductStockHistory[], skuKey: string): number {
  return histories.filter((h) => h.skuKey === skuKey).reduce((sum, h) => sum + h.quantity, 0)
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'PRD-001', productName: '에어줌 페가수스 41', brandId: 'BRD-001', categoryId: 'STD-002', vendorName: '나이키코리아',
    priceOriginal: 179000, priceSale: 159000, saleStatus: 'ON_SALE', approvalStatus: 'APPROVED', rejectReason: '',
    description: '나이키 에어줌 페가수스 41\n\n반응성 좋은 줌에어 유닛과 가벼운 니트 소재로 완성된 데일리 러닝화입니다. 무리 없는 착화감과 안정적인 그립력으로 조깅부터 마라톤까지 폭넓게 활용할 수 있습니다.\n\n- 소재: 니트 어퍼, 고무 아웃솔\n- 중량: 약 255g (270 사이즈 기준)\n- 세탁방법: 부분 손세탁 후 그늘에서 건조',
    images: [
      {
        imageId: 'IMG-0001', imageUrl: 'https://via.placeholder.com/300x300/dbeafe/475569?text=Pegasus+41+Front', sortOrder: 1, isMain: true,
        resizes: [
          { resizeId: 'RSZ-0001', resizeType: 'LIST', imageUrl: 'https://via.placeholder.com/200x200/dbeafe/475569?text=List', width: 200, height: 200 },
          { resizeId: 'RSZ-0002', resizeType: 'CARD', imageUrl: 'https://via.placeholder.com/400x400/dbeafe/475569?text=Card', width: 400, height: 400 },
        ],
      },
      { imageId: 'IMG-0002', imageUrl: 'https://via.placeholder.com/300x300/dbeafe/475569?text=Pegasus+41+Side', sortOrder: 2, isMain: false, resizes: [] },
      { imageId: 'IMG-0004', imageUrl: 'https://via.placeholder.com/300x300/dbeafe/475569?text=Pegasus+41+Back', sortOrder: 3, isMain: false, resizes: [] },
      { imageId: 'IMG-0005', imageUrl: 'https://via.placeholder.com/300x300/dbeafe/475569?text=Pegasus+41+Sole', sortOrder: 4, isMain: false, resizes: [] },
    ],
    options: [
      { optionGroupId: 'OPT-0001', optionName: '사이즈', optionValues: ['260', '265', '270', '275'] },
    ],
    skus: [
      { skuId: 'SKU-0001', skuKey: '260', status: 'ACTIVE' },
      { skuId: 'SKU-0002', skuKey: '265', status: 'ACTIVE' },
      { skuId: 'SKU-0003', skuKey: '270', status: 'ACTIVE' },
      { skuId: 'SKU-0004', skuKey: '275', status: 'ACTIVE' },
    ],
    stockHistories: [
      { historyId: 'HIS-0001', skuKey: '260', type: 'IN', quantity: 20, memo: '초기 입고', createdBy: 'vendor-nike', createdAt: '2025-11-10 09:10' },
      { historyId: 'HIS-0002', skuKey: '260', type: 'OUT', quantity: -8, memo: '주문 출고', createdBy: 'admin', createdAt: '2026-05-20 11:00' },
      { historyId: 'HIS-0003', skuKey: '265', type: 'IN', quantity: 20, memo: '초기 입고', createdBy: 'vendor-nike', createdAt: '2025-11-10 09:10' },
      { historyId: 'HIS-0004', skuKey: '265', type: 'OUT', quantity: -12, memo: '주문 출고', createdBy: 'admin', createdAt: '2026-06-01 09:00' },
      { historyId: 'HIS-0005', skuKey: '270', type: 'IN', quantity: 10, memo: '초기 입고', createdBy: 'vendor-nike', createdAt: '2025-11-10 09:10' },
      { historyId: 'HIS-0006', skuKey: '270', type: 'OUT', quantity: -5, memo: '주문 출고', createdBy: 'admin', createdAt: '2026-06-10 10:00' },
      { historyId: 'HIS-0007', skuKey: '275', type: 'IN', quantity: 6, memo: '초기 입고', createdBy: 'vendor-nike', createdAt: '2025-11-10 09:10' },
    ],
    inquiries: [
      {
        inquiryId: 'INQ-0001', memberName: '김도윤', content: '265 사이즈 재입고 언제 되나요?',
        status: 'ANSWERED', answer: '265 사이즈는 현재 재고 8개 보유 중입니다. 바로 주문 가능합니다.',
        createdAt: '2026-06-01 10:00', answeredAt: '2026-06-01 14:20',
      },
      {
        inquiryId: 'INQ-0002', memberName: '이서준', content: '이 신발 발볼이 넓은 편인가요?',
        status: 'WAITING', answer: '', createdAt: '2026-06-20 09:30', answeredAt: null,
      },
    ],
    reviews: [
      { reviewId: 'REV-0001', memberName: '박하은', rating: 5, content: '가볍고 쿠셔닝이 좋아요. 마라톤 완주했습니다.', hidden: false, createdAt: '2026-05-10 20:00' },
      { reviewId: 'REV-0002', memberName: '최지우', rating: 2, content: '사이즈가 너무 작게 나온 것 같아요.', hidden: true, createdAt: '2026-05-15 11:00' },
    ],
    createdBy: 'vendor-nike', createdAt: '2025-11-10 09:00', updatedBy: 'admin', updatedAt: '2025-11-11 10:00',
  },
  {
    productId: 'PRD-002', productName: '쿨링 러닝화', brandId: 'BRD-001', categoryId: 'STD-013', vendorName: '나이키코리아',
    priceOriginal: 149000, priceSale: 129000, saleStatus: 'ON_SALE', approvalStatus: 'APPROVED', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-nike', createdAt: '2025-11-12 09:00', updatedBy: 'admin', updatedAt: '2025-11-13 10:00',
  },
  {
    productId: 'PRD-003', productName: '메쉬 반팔티', brandId: 'BRD-002', categoryId: 'STD-015', vendorName: '아디다스코리아',
    priceOriginal: 69000, priceSale: 59000, saleStatus: 'ON_SALE', approvalStatus: 'APPROVED', rejectReason: '',
    description: '흡습속건 메쉬 소재로 제작된 반팔 러닝 티셔츠입니다. 여름철 무더운 날씨에도 쾌적하게 운동할 수 있습니다.',
    images: [
      { imageId: 'IMG-0003', imageUrl: 'https://via.placeholder.com/300x300/fef9c3/475569?text=Mesh+Tee', sortOrder: 1, isMain: true, resizes: [] },
    ],
    options: [
      { optionGroupId: 'OPT-0003', optionName: '사이즈', optionValues: ['S', 'M', 'L'] },
      { optionGroupId: 'OPT-0004', optionName: '색상', optionValues: ['블랙', '네이비'] },
    ],
    skus: [
      { skuId: 'SKU-0005', skuKey: 'S / 블랙', status: 'ACTIVE' },
      { skuId: 'SKU-0006', skuKey: 'M / 블랙', status: 'ACTIVE' },
      { skuId: 'SKU-0007', skuKey: 'L / 네이비', status: 'ACTIVE' },
    ],
    stockHistories: [
      { historyId: 'HIS-0008', skuKey: 'S / 블랙', type: 'IN', quantity: 20, memo: '초기 입고', createdBy: 'vendor-adidas', createdAt: '2025-11-14 09:10' },
      { historyId: 'HIS-0009', skuKey: 'M / 블랙', type: 'IN', quantity: 15, memo: '초기 입고', createdBy: 'vendor-adidas', createdAt: '2025-11-14 09:10' },
      { historyId: 'HIS-0010', skuKey: 'L / 네이비', type: 'IN', quantity: 9, memo: '초기 입고', createdBy: 'vendor-adidas', createdAt: '2025-11-14 09:10' },
    ],
    inquiries: [
      {
        inquiryId: 'INQ-0003', memberName: '강서윤', content: '네이비 색상 S 사이즈는 없나요?',
        status: 'WAITING', answer: '', createdAt: '2026-06-25 13:10', answeredAt: null,
      },
    ],
    reviews: [
      { reviewId: 'REV-0003', memberName: '조은우', rating: 4, content: '땀 배출이 잘 되고 시원합니다.', hidden: false, createdAt: '2026-06-05 09:00' },
    ],
    createdBy: 'vendor-adidas', createdAt: '2025-11-14 09:00', updatedBy: 'admin', updatedAt: '2025-11-15 10:00',
  },
  {
    productId: 'PRD-004', productName: '아이스 양말 3팩', brandId: 'BRD-003', categoryId: 'STD-009', vendorName: '프로스펙스',
    priceOriginal: 18000, priceSale: 15000, saleStatus: 'SOLD_OUT', approvalStatus: 'APPROVED', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-prospecs', createdAt: '2025-11-16 09:00', updatedBy: 'admin', updatedAt: '2026-05-01 14:00',
  },
  {
    productId: 'PRD-005', productName: '초보자 러닝화', brandId: 'BRD-004', categoryId: 'STD-002', vendorName: '뉴발란스코리아',
    priceOriginal: 109000, priceSale: 99000, saleStatus: 'ON_SALE', approvalStatus: 'PENDING', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-nb', createdAt: '2026-06-20 09:00', updatedBy: 'vendor-nb', updatedAt: '2026-06-20 09:00',
  },
  {
    productId: 'PRD-006', productName: '마라톤 전용화', brandId: 'BRD-005', categoryId: 'STD-013', vendorName: '아식스코리아',
    priceOriginal: 199000, priceSale: 189000, saleStatus: 'ON_SALE', approvalStatus: 'PENDING', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-asics', createdAt: '2026-06-22 09:00', updatedBy: 'vendor-asics', updatedAt: '2026-06-22 09:00',
  },
  {
    productId: 'PRD-007', productName: 'GPS 러닝워치', brandId: 'BRD-006', categoryId: 'STD-008', vendorName: '가민코리아',
    priceOriginal: 480000, priceSale: 450000, saleStatus: 'ON_SALE', approvalStatus: 'APPROVED', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-garmin', createdAt: '2025-11-18 09:00', updatedBy: 'admin', updatedAt: '2025-11-19 10:00',
  },
  {
    productId: 'PRD-008', productName: '트레일 러닝화', brandId: 'BRD-007', categoryId: 'STD-003', vendorName: '살로몬코리아',
    priceOriginal: 199000, priceSale: 179000, saleStatus: 'ON_SALE', approvalStatus: 'APPROVED', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-salomon', createdAt: '2025-11-20 09:00', updatedBy: 'admin', updatedAt: '2025-11-21 10:00',
  },
  {
    productId: 'PRD-009', productName: '방풍 자켓', brandId: 'BRD-008', categoryId: 'STD-006', vendorName: '파타고니아코리아',
    priceOriginal: 259000, priceSale: 230000, saleStatus: 'ON_SALE', approvalStatus: 'REJECTED', rejectReason: '상세 이미지가 누락되었습니다. 정면/후면/소재 클로즈업 이미지를 추가해 재등록해주세요.',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-patagonia', createdAt: '2026-06-10 09:00', updatedBy: 'admin', updatedAt: '2026-06-12 11:00',
  },
  {
    productId: 'PRD-010', productName: '방한 러닝화', brandId: 'BRD-009', categoryId: 'STD-002', vendorName: '호카코리아',
    priceOriginal: 219000, priceSale: 199000, saleStatus: 'DISCONTINUED', approvalStatus: 'APPROVED', rejectReason: '',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-hoka', createdAt: '2025-10-01 09:00', updatedBy: 'admin', updatedAt: '2026-03-01 09:00',
  },
  {
    productId: 'PRD-011', productName: '기모 레깅스', brandId: 'BRD-010', categoryId: 'STD-016', vendorName: '언더아머코리아',
    priceOriginal: 89000, priceSale: 79000, saleStatus: 'ON_SALE', approvalStatus: 'REJECTED', rejectReason: '판매가가 정상가 대비 최대 할인율(30%)을 초과하여 반려되었습니다.',
    description: '',
    images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
    createdBy: 'vendor-ua', createdAt: '2026-06-15 09:00', updatedBy: 'admin', updatedAt: '2026-06-16 09:30',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterProducts(items: Product[], filter: ProductFilter): Product[] {
  return items.filter((p) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!p.productName.toLowerCase().includes(kw) && !p.productId.toLowerCase().includes(kw) && !p.vendorName.toLowerCase().includes(kw)) return false
    }
    if (filter.brandId !== 'ALL' && p.brandId !== filter.brandId) return false
    if (filter.saleStatus !== 'ALL' && p.saleStatus !== filter.saleStatus) return false
    if (filter.approvalStatus !== 'ALL' && p.approvalStatus !== filter.approvalStatus) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _prdSeq = MOCK_PRODUCTS.length + 1
export function nextProductId(): string {
  return `PRD-${String(_prdSeq++).padStart(3, '0')}`
}

let _imgSeq = MOCK_PRODUCTS.reduce((n, p) => n + p.images.length, 0) + 1
export function nextImageId(): string {
  return `IMG-${String(_imgSeq++).padStart(4, '0')}`
}

let _optSeq = MOCK_PRODUCTS.reduce((n, p) => n + p.options.length, 0) + 1
export function nextOptionGroupId(): string {
  return `OPT-${String(_optSeq++).padStart(4, '0')}`
}

let _skuSeq = MOCK_PRODUCTS.reduce((n, p) => n + p.skus.length, 0) + 1
export function nextSkuId(): string {
  return `SKU-${String(_skuSeq++).padStart(4, '0')}`
}

let _histSeq = MOCK_PRODUCTS.reduce((n, p) => n + p.stockHistories.length, 0) + 1
export function nextHistoryId(): string {
  return `HIS-${String(_histSeq++).padStart(4, '0')}`
}

let _rszSeq = MOCK_PRODUCTS.reduce((n, p) => n + p.images.reduce((m, i) => m + i.resizes.length, 0), 0) + 1
export function nextResizeId(): string {
  return `RSZ-${String(_rszSeq++).padStart(4, '0')}`
}
