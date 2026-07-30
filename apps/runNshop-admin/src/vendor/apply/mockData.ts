// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BusinessType = 'CORPORATION' | 'INDIVIDUAL' | 'BRAND_DIRECT'

export type VendorApplicationStatus = 'APPLIED' | 'REVIEWING' | 'CONTRACT' | 'APPROVED' | 'REJECTED'

export interface VendorApplicationHistoryEntry {
  at: string
  actor: string
  action: string
  memo?: string
}

export interface VendorApplication {
  applicationId: string       // VA-20260625-0001 형식
  businessName: string
  businessNo: string
  representative: string
  businessType: BusinessType
  categoryName: string
  contactEmail: string
  contactPhone: string
  status: VendorApplicationStatus
  rejectReason: string
  rejectCount: number
  reviewedBy: string | null
  reviewedAt: string | null
  history: VendorApplicationHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export interface VendorApplicationFilter {
  keyword: string
  status: VendorApplicationStatus | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const BUSINESS_TYPE_LABEL: Record<BusinessType, string> = {
  CORPORATION: '법인사업자',
  INDIVIDUAL: '개인사업자',
  BRAND_DIRECT: '브랜드직영',
}

export const VENDOR_APP_STATUS_LABEL: Record<VendorApplicationStatus, string> = {
  APPLIED: '신청',
  REVIEWING: '심사중',
  CONTRACT: '계약진행',
  APPROVED: '승인',
  REJECTED: '반려',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_VENDOR_APPLICATIONS: VendorApplication[] = [
  {
    applicationId: 'VA-20260702-0001', businessName: '런핏코리아', businessNo: '214-81-11223', representative: '한지수',
    businessType: 'CORPORATION', categoryName: '러닝화',
    contactEmail: 'biz@runfit.co.kr', contactPhone: '02-333-1234',
    status: 'APPLIED', rejectReason: '', rejectCount: 0,
    reviewedBy: null, reviewedAt: null,
    history: [
      { at: '2026.07.02 10:00', actor: '한지수', action: '입점 신청' },
    ],
    createdAt: '2026.07.02 10:00', updatedAt: '2026.07.02 10:00',
  },
  {
    applicationId: 'VA-20260628-0002', businessName: '트레일메이트', businessNo: '305-12-44567', representative: '오세훈',
    businessType: 'INDIVIDUAL', categoryName: '트레일러닝화',
    contactEmail: 'contact@trailmate.kr', contactPhone: '031-777-8899',
    status: 'REVIEWING', rejectReason: '', rejectCount: 0,
    reviewedBy: 'MD-김수진', reviewedAt: '2026.06.29 09:30',
    history: [
      { at: '2026.06.28 14:20', actor: '오세훈', action: '입점 신청' },
      { at: '2026.06.29 09:30', actor: 'MD-김수진', action: '심사 시작' },
    ],
    createdAt: '2026.06.28 14:20', updatedAt: '2026.06.29 09:30',
  },
  {
    applicationId: 'VA-20260620-0003', businessName: '스윙러너', businessNo: '108-86-33210', representative: '배준서',
    businessType: 'CORPORATION', categoryName: '러닝의류',
    contactEmail: 'partners@swingrunner.com', contactPhone: '02-555-9090',
    status: 'CONTRACT', rejectReason: '', rejectCount: 0,
    reviewedBy: 'MD-박도윤', reviewedAt: '2026.06.24 11:00',
    history: [
      { at: '2026.06.20 09:00', actor: '배준서', action: '입점 신청' },
      { at: '2026.06.22 10:15', actor: 'MD-박도윤', action: '심사 시작' },
      { at: '2026.06.24 11:00', actor: 'MD-박도윤', action: '계약 진행', memo: '표준입점계약서 발송' },
    ],
    createdAt: '2026.06.20 09:00', updatedAt: '2026.06.24 11:00',
  },
  {
    applicationId: 'VA-20260601-0004', businessName: '나이키코리아', businessNo: '110-81-01234', representative: '제임스 리',
    businessType: 'BRAND_DIRECT', categoryName: '스포츠화',
    contactEmail: 'partner.kr@nike.com', contactPhone: '02-3457-6000',
    status: 'APPROVED', rejectReason: '', rejectCount: 0,
    reviewedBy: 'MD-김수진', reviewedAt: '2026.06.10 15:00',
    history: [
      { at: '2026.06.01 09:00', actor: '제임스 리', action: '입점 신청' },
      { at: '2026.06.03 09:20', actor: 'MD-김수진', action: '심사 시작' },
      { at: '2026.06.08 13:40', actor: 'MD-김수진', action: '계약 진행', memo: '브랜드 직영 계약 체결' },
      { at: '2026.06.10 15:00', actor: 'MD-김수진', action: '승인 처리' },
    ],
    createdAt: '2026.06.01 09:00', updatedAt: '2026.06.10 15:00',
  },
  {
    applicationId: 'VA-20260615-0005', businessName: '헬스러너몰', businessNo: '502-33-77812', representative: '진수민',
    businessType: 'INDIVIDUAL', categoryName: '운동보조용품',
    contactEmail: 'help@healthrunner.shop', contactPhone: '070-4321-5678',
    status: 'REJECTED', rejectReason: '사업자등록증 상 업태가 입점 가능 카테고리와 불일치하여 반려합니다.', rejectCount: 1,
    reviewedBy: 'MD-박도윤', reviewedAt: '2026.06.18 16:20',
    history: [
      { at: '2026.06.15 11:00', actor: '진수민', action: '입점 신청' },
      { at: '2026.06.16 09:00', actor: 'MD-박도윤', action: '심사 시작' },
      { at: '2026.06.18 16:20', actor: 'MD-박도윤', action: '반려 처리', memo: '사업자등록증 상 업태가 입점 가능 카테고리와 불일치하여 반려합니다.' },
    ],
    createdAt: '2026.06.15 11:00', updatedAt: '2026.06.18 16:20',
  },
  {
    applicationId: 'VA-20260705-0006', businessName: '어반스프린트', businessNo: '220-87-90911', representative: '최윤아',
    businessType: 'CORPORATION', categoryName: '러닝액세서리',
    contactEmail: 'sales@urbansprint.kr', contactPhone: '02-888-2222',
    status: 'REVIEWING', rejectReason: '', rejectCount: 0,
    reviewedBy: 'MD-김수진', reviewedAt: '2026.07.06 10:10',
    history: [
      { at: '2026.07.05 13:00', actor: '최윤아', action: '입점 신청' },
      { at: '2026.07.06 10:10', actor: 'MD-김수진', action: '심사 시작' },
    ],
    createdAt: '2026.07.05 13:00', updatedAt: '2026.07.06 10:10',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterVendorApplications(items: VendorApplication[], filter: VendorApplicationFilter): VendorApplication[] {
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
    if (filter.from) {
      const day = v.createdAt.slice(0, 10).replace(/\./g, '-')
      if (day < filter.from) return false
    }
    if (filter.to) {
      const day = v.createdAt.slice(0, 10).replace(/\./g, '-')
      if (day > filter.to) return false
    }
    return true
  })
}
