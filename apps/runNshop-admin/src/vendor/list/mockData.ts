// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BusinessType = 'CORPORATION' | 'INDIVIDUAL' | 'BRAND_DIRECT'

export type VendorType = 'VENDOR' | 'DIRECT'

export type VendorStatus = 'ACTIVE' | 'WARNING' | 'SUSPENDED' | 'TERMINATED'

export type VendorGrade = 'NEW' | 'RUNNER' | 'PACER' | 'ELITE'

export interface VendorFeeRate {
  categoryName: string
  baseFeeRate: number         // %
  gradeDiscountRate: number   // %
  finalFeeRate: number        // %
  effectiveFrom: string
}

export interface VendorPenalty {
  penaltyId: string
  penaltyType: string
  amount: number
  reason: string
  penaltyDate: string
}

export interface VendorAccount {
  bankCode: string
  accountNo: string
  accountHolder: string
  isPrimary: boolean
  verifiedAt: string
}

export interface Vendor {
  vendorId: string
  businessName: string
  businessNo: string
  representative: string
  businessType: BusinessType
  vendorType: VendorType
  status: VendorStatus
  contactEmail: string
  contactPhone: string
  gradeCode: VendorGrade
  feeRates: VendorFeeRate[]
  penalties: VendorPenalty[]
  account: VendorAccount | null
  createdAt: string
  updatedAt: string
}

export interface VendorFilter {
  keyword: string
  status: VendorStatus | 'ALL'
  grade: VendorGrade | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const VENDOR_BUSINESS_TYPE_LABEL: Record<BusinessType, string> = {
  CORPORATION: '법인사업자',
  INDIVIDUAL: '개인사업자',
  BRAND_DIRECT: '브랜드직영',
}

export const VENDOR_TYPE_LABEL: Record<VendorType, string> = {
  VENDOR: '입점',
  DIRECT: '직영',
}

export const VENDOR_STATUS_LABEL: Record<VendorStatus, string> = {
  ACTIVE: '정상',
  WARNING: '주의',
  SUSPENDED: '정지',
  TERMINATED: '해지',
}

export const VENDOR_GRADE_LABEL: Record<VendorGrade, string> = {
  NEW: 'New',
  RUNNER: 'Runner',
  PACER: 'Pacer',
  ELITE: 'Elite',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_VENDORS: Vendor[] = [
  {
    vendorId: 'VND-0001', businessName: '나이키코리아', businessNo: '110-81-01234', representative: '제임스 리',
    businessType: 'BRAND_DIRECT', vendorType: 'DIRECT', status: 'ACTIVE',
    contactEmail: 'partner.kr@nike.com', contactPhone: '02-3457-6000', gradeCode: 'ELITE',
    feeRates: [
      { categoryName: '러닝화', baseFeeRate: 12.0, gradeDiscountRate: 2.0, finalFeeRate: 10.0, effectiveFrom: '2026.01.01' },
      { categoryName: '러닝의류', baseFeeRate: 15.0, gradeDiscountRate: 2.0, finalFeeRate: 13.0, effectiveFrom: '2026.01.01' },
    ],
    penalties: [],
    account: { bankCode: '국민은행', accountNo: '123-***-456789', accountHolder: '나이키코리아(유)', isPrimary: true, verifiedAt: '2026.01.02 10:00' },
    createdAt: '2026.01.02 10:00', updatedAt: '2026.06.10 15:00',
  },
  {
    vendorId: 'VND-0002', businessName: '뉴발란스', businessNo: '215-86-55211', representative: '조은비',
    businessType: 'CORPORATION', vendorType: 'VENDOR', status: 'ACTIVE',
    contactEmail: 'kr.partner@newbalance.com', contactPhone: '02-2222-3333', gradeCode: 'PACER',
    feeRates: [
      { categoryName: '러닝화', baseFeeRate: 13.0, gradeDiscountRate: 1.0, finalFeeRate: 12.0, effectiveFrom: '2026.02.01' },
    ],
    penalties: [
      { penaltyId: 'PN-0001', penaltyType: '배송지연', amount: 50000, reason: '평균 배송일 4일 초과 (SLA 위반)', penaltyDate: '2026.05.12' },
    ],
    account: { bankCode: '신한은행', accountNo: '110-***-889923', accountHolder: '(주)뉴발란스코리아', isPrimary: true, verifiedAt: '2026.02.02 09:00' },
    createdAt: '2026.02.02 09:00', updatedAt: '2026.05.12 11:00',
  },
  {
    vendorId: 'VND-0003', businessName: '트레일메이트', businessNo: '305-12-44567', representative: '오세훈',
    businessType: 'INDIVIDUAL', vendorType: 'VENDOR', status: 'WARNING',
    contactEmail: 'contact@trailmate.kr', contactPhone: '031-777-8899', gradeCode: 'RUNNER',
    feeRates: [
      { categoryName: '트레일러닝화', baseFeeRate: 14.0, gradeDiscountRate: 0.5, finalFeeRate: 13.5, effectiveFrom: '2026.06.29' },
    ],
    penalties: [
      { penaltyId: 'PN-0002', penaltyType: '오배송', amount: 30000, reason: '주문 상품과 다른 색상 배송 접수', penaltyDate: '2026.06.20' },
      { penaltyId: 'PN-0003', penaltyType: 'CS응대지연', amount: 20000, reason: '고객 문의 48시간 이상 미응답', penaltyDate: '2026.07.01' },
    ],
    account: { bankCode: '카카오뱅크', accountNo: '3333-**-4455667', accountHolder: '오세훈', isPrimary: true, verifiedAt: '2026.06.30 08:30' },
    createdAt: '2026.06.29 09:00', updatedAt: '2026.07.01 10:00',
  },
  {
    vendorId: 'VND-0004', businessName: '스윙러너', businessNo: '108-86-33210', representative: '배준서',
    businessType: 'CORPORATION', vendorType: 'VENDOR', status: 'SUSPENDED',
    contactEmail: 'partners@swingrunner.com', contactPhone: '02-555-9090', gradeCode: 'NEW',
    feeRates: [
      { categoryName: '러닝의류', baseFeeRate: 15.0, gradeDiscountRate: 0, finalFeeRate: 15.0, effectiveFrom: '2026.06.24' },
    ],
    penalties: [
      { penaltyId: 'PN-0004', penaltyType: '품질불량', amount: 100000, reason: '동일 상품 불량 반품 3건 이상 누적', penaltyDate: '2026.06.28' },
    ],
    account: null,
    createdAt: '2026.06.24 11:00', updatedAt: '2026.06.28 16:00',
  },
  {
    vendorId: 'VND-0005', businessName: '올드필드러닝', businessNo: '128-11-98871', representative: '문가영',
    businessType: 'CORPORATION', vendorType: 'VENDOR', status: 'TERMINATED',
    contactEmail: 'admin@oldfieldrunning.com', contactPhone: '02-444-1111', gradeCode: 'NEW',
    feeRates: [
      { categoryName: '러닝화', baseFeeRate: 12.0, gradeDiscountRate: 0, finalFeeRate: 12.0, effectiveFrom: '2025.03.01' },
    ],
    penalties: [
      { penaltyId: 'PN-0005', penaltyType: '계약위반', amount: 300000, reason: '허위 상품정보 등록 반복 적발로 계약 해지', penaltyDate: '2026.03.15' },
    ],
    account: { bankCode: '우리은행', accountNo: '1002-***-778812', accountHolder: '올드필드러닝(주)', isPrimary: true, verifiedAt: '2025.03.02 10:00' },
    createdAt: '2025.03.02 10:00', updatedAt: '2026.03.15 09:00',
  },
  {
    vendorId: 'VND-0006', businessName: '아디다스코리아', businessNo: '106-81-77123', representative: '한스 뮐러',
    businessType: 'BRAND_DIRECT', vendorType: 'DIRECT', status: 'ACTIVE',
    contactEmail: 'kr.direct@adidas.com', contactPhone: '02-3487-8000', gradeCode: 'ELITE',
    feeRates: [
      { categoryName: '러닝화', baseFeeRate: 12.0, gradeDiscountRate: 2.0, finalFeeRate: 10.0, effectiveFrom: '2025.11.01' },
      { categoryName: '러닝액세서리', baseFeeRate: 18.0, gradeDiscountRate: 2.0, finalFeeRate: 16.0, effectiveFrom: '2025.11.01' },
    ],
    penalties: [],
    account: { bankCode: '하나은행', accountNo: '256-***-334455', accountHolder: '아디다스코리아(유)', isPrimary: true, verifiedAt: '2025.11.02 09:00' },
    createdAt: '2025.11.02 09:00', updatedAt: '2026.01.10 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterVendors(items: Vendor[], filter: VendorFilter): Vendor[] {
  return items.filter((v) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !v.businessName.toLowerCase().includes(kw) &&
        !v.businessNo.toLowerCase().includes(kw) &&
        !v.representative.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.status !== 'ALL' && v.status !== filter.status) return false
    if (filter.grade !== 'ALL' && v.gradeCode !== filter.grade) return false
    return true
  })
}
