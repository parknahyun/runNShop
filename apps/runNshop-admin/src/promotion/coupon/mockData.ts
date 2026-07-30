import { MOCK_PRODUCT_CATALOG } from '@/promotion/shared/productCatalog'
import { MOCK_MEMBER_CATALOG, type CatalogMember, type CatalogMemberGrade } from '@/promotion/shared/memberCatalog'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXHAUSTED'
export type CouponIssuerType = 'PLATFORM' | 'VENDOR'
// 쿠폰유형: 상품쿠폰(특정 상품/카테고리 대상) / 장바구니쿠폰(주문 전체 대상 — 적용상품 전체로 고정)
export type CouponType = 'PRODUCT' | 'CART'

// 부분취소 정책: 장바구니쿠폰(couponType === 'CART')에만 적용 — 주문 일부 취소 시 쿠폰 혜택 처리 방식
export type CouponPartialCancelPolicy = 'KEEP' | 'RECALCULATE' | 'DENY'

// 적용회원: 전체 / 회원등급(다중선택) / 임의지정(엑셀업로드)
export type CouponMemberTargetType = 'ALL' | 'GRADE' | 'MANUAL'
// 적용상품: 전체 / 임의선택(팝업검색, 다중선택) / 표준카테고리(다중선택)
export type CouponProductTargetType = 'ALL' | 'MANUAL' | 'CATEGORY'

export type MemberGrade = 'NEW' | 'RUNNER' | 'PACER' | 'ELITE'

export type CouponApplyUnit = 'ORDER' | 'PRODUCT' | 'CATEGORY'
export type CouponDiscountType = 'FIXED' | 'RATE'
export type CouponIssueType = 'DOWNLOAD' | 'AUTO' | 'ADMIN'

// 보유회원(발급 내역): 발급경로에 MANUAL(임의발행)이 추가된다
export type CouponHolderIssuedVia = CouponIssueType | 'MANUAL'
export type CouponHolderStatus = 'UNUSED' | 'USED' | 'EXPIRED'

export interface CouponHolder {
  memberId: string
  memberName: string
  memberGrade: MemberGrade
  issuedVia: CouponHolderIssuedVia
  issuedAt: string
  usedAt: string | null
  status: CouponHolderStatus
}

export interface Coupon {
  couponId: string
  couponCode: string
  couponName: string
  couponType: CouponType       // PRODUCT: 상품쿠폰 / CART: 장바구니쿠폰 (적용상품 전체로 고정)
  partialCancelPolicy: CouponPartialCancelPolicy   // couponType === 'CART' 일 때만 사용
  issuerType: CouponIssuerType
  vendorName: string          // issuerType === 'VENDOR' 일 때만 사용

  memberTargetType: CouponMemberTargetType
  targetGrades: MemberGrade[]         // memberTargetType === 'GRADE' 일 때 사용 (다중선택)
  targetMemberFile: string            // memberTargetType === 'MANUAL' 일 때 업로드한 엑셀 파일명
  targetMemberCount: number | null    // 업로드 후 확인된 대상 회원 수 (mock)

  productTargetType: CouponProductTargetType   // couponType === 'CART' 이면 항상 'ALL'로 고정
  targetProductIds: string[]          // productTargetType === 'MANUAL' 일 때 사용 (팝업검색으로 선택)
  targetCategoryIds: string[]         // productTargetType === 'CATEGORY' 일 때 사용 (다중선택)

  holders: CouponHolder[]             // 보유회원(발급 내역) — 발급방식과 무관하게 실제 발급된 회원 목록

  applyUnit: CouponApplyUnit
  discountType: CouponDiscountType
  discountValue: number
  minOrderAmount: number
  maxDiscountAmount: number | null   // discountType === 'RATE' 일 때만 사용
  issueType: CouponIssueType
  issueLimit: number | null
  issuedCount: number
  validFrom: string
  validTo: string
  costShareRate: number
  status: CouponStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface CouponFilter {
  keyword: string
  status: CouponStatus | 'ALL'
  issuerType: CouponIssuerType | 'ALL'
  couponType: CouponType | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const COUPON_STATUS_LABEL: Record<CouponStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  EXHAUSTED: '소진',
}

export const COUPON_ISSUER_TYPE_LABEL: Record<CouponIssuerType, string> = {
  PLATFORM: '플랫폼',
  VENDOR: '입점사',
}

export const COUPON_TYPE_LABEL: Record<CouponType, string> = {
  PRODUCT: '상품쿠폰',
  CART: '장바구니쿠폰',
}

export const COUPON_PARTIAL_CANCEL_POLICY_LABEL: Record<CouponPartialCancelPolicy, string> = {
  KEEP: '쿠폰 유지',
  RECALCULATE: '재계산',
  DENY: '부분취소 불가',
}

export const COUPON_MEMBER_TARGET_TYPE_LABEL: Record<CouponMemberTargetType, string> = {
  ALL: '전체',
  GRADE: '회원등급',
  MANUAL: '임의지정',
}

export const COUPON_PRODUCT_TARGET_TYPE_LABEL: Record<CouponProductTargetType, string> = {
  ALL: '전체',
  MANUAL: '임의선택',
  CATEGORY: '표준카테고리',
}

export const MEMBER_GRADE_LABEL: Record<MemberGrade, string> = {
  NEW: 'New',
  RUNNER: 'Runner',
  PACER: 'Pacer',
  ELITE: 'Elite',
}

export const COUPON_APPLY_UNIT_LABEL: Record<CouponApplyUnit, string> = {
  ORDER: '주문',
  PRODUCT: '상품',
  CATEGORY: '카테고리',
}

export const COUPON_DISCOUNT_TYPE_LABEL: Record<CouponDiscountType, string> = {
  FIXED: '정액',
  RATE: '정률',
}

export const COUPON_ISSUE_TYPE_LABEL: Record<CouponIssueType, string> = {
  DOWNLOAD: '다운로드',
  AUTO: '자동발급',
  ADMIN: '관리자 지급',
}

export const COUPON_HOLDER_ISSUED_VIA_LABEL: Record<CouponHolderIssuedVia, string> = {
  DOWNLOAD: '다운로드',
  AUTO: '자동발급',
  ADMIN: '관리자 지급',
  MANUAL: '임의발행',
}

export const COUPON_HOLDER_STATUS_LABEL: Record<CouponHolderStatus, string> = {
  UNUSED: '미사용',
  USED: '사용완료',
  EXPIRED: '만료',
}

export function formatCouponDiscount(c: Pick<Coupon, 'discountType' | 'discountValue' | 'maxDiscountAmount'>): string {
  if (c.discountType === 'FIXED') return `${c.discountValue.toLocaleString()}원 할인`
  return `${c.discountValue}% 할인` + (c.maxDiscountAmount ? ` (최대 ${c.maxDiscountAmount.toLocaleString()}원)` : '')
}

// ---------------------------------------------------------------------------
// 상품 후보 (적용상품 = 임의선택일 때 검색에 사용, 공통 상품 카탈로그를 그대로 참조)
// ---------------------------------------------------------------------------

export { MOCK_PRODUCT_CATALOG }

// ---------------------------------------------------------------------------
// 회원 후보 (보유회원 탭의 임의발행 검색에 사용, 공통 회원 카탈로그를 그대로 참조)
// ---------------------------------------------------------------------------

export { MOCK_MEMBER_CATALOG }
export type { CatalogMember, CatalogMemberGrade }

// ---------------------------------------------------------------------------
// 표준카테고리 후보 (적용상품 = 표준카테고리일 때 다중선택에 사용)
// ---------------------------------------------------------------------------

export interface StandardCategory {
  categoryId: string
  categoryName: string
}

export const MOCK_STANDARD_CATEGORIES: StandardCategory[] = [
  { categoryId: 'CAT-001', categoryName: '러닝화' },
  { categoryId: 'CAT-002', categoryName: '트레일화' },
  { categoryId: 'CAT-003', categoryName: '러닝의류' },
  { categoryId: 'CAT-004', categoryName: '아웃도어의류' },
  { categoryId: 'CAT-005', categoryName: '러닝워치/GPS' },
  { categoryId: 'CAT-006', categoryName: '양말/이너웨어' },
  { categoryId: 'CAT-007', categoryName: '가방/액세서리' },
  { categoryId: 'CAT-008', categoryName: '보충제/영양' },
]

export function formatCouponMemberTarget(c: Pick<Coupon, 'memberTargetType' | 'targetGrades' | 'targetMemberFile' | 'targetMemberCount'>): string {
  if (c.memberTargetType === 'ALL') return '전체'
  if (c.memberTargetType === 'GRADE') {
    return `회원등급 (${c.targetGrades.map((g) => MEMBER_GRADE_LABEL[g]).join(', ') || '미지정'})`
  }
  return `임의지정 (${c.targetMemberFile || '파일 없음'}${c.targetMemberCount != null ? ` · ${c.targetMemberCount.toLocaleString()}명` : ''})`
}

export function formatCouponProductTarget(c: Pick<Coupon, 'productTargetType' | 'targetProductIds' | 'targetCategoryIds'>): string {
  if (c.productTargetType === 'ALL') return '전체'
  if (c.productTargetType === 'MANUAL') {
    return `임의선택 (${c.targetProductIds.length}개 상품)`
  }
  const names = c.targetCategoryIds
    .map((id) => MOCK_STANDARD_CATEGORIES.find((cat) => cat.categoryId === id)?.categoryName)
    .filter(Boolean)
  return `표준카테고리 (${names.join(', ') || '미지정'})`
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_COUPONS: Coupon[] = [
  {
    couponId: 'CPN-001', couponCode: 'WELCOME5000', couponName: '신규 회원 5,000원 쿠폰',
    couponType: 'CART', partialCancelPolicy: 'RECALCULATE',
    issuerType: 'PLATFORM', vendorName: '',
    memberTargetType: 'ALL', targetGrades: [], targetMemberFile: '', targetMemberCount: null,
    productTargetType: 'ALL', targetProductIds: [], targetCategoryIds: [],
    holders: [
      { memberId: 'M0004', memberName: '최지우', memberGrade: 'NEW', issuedVia: 'AUTO', issuedAt: '2026-06-02 10:05', usedAt: '2026-06-03 20:11', status: 'USED' },
      { memberId: 'M0008', memberName: '윤지호', memberGrade: 'NEW', issuedVia: 'AUTO', issuedAt: '2026-06-15 09:40', usedAt: null, status: 'UNUSED' },
    ],
    applyUnit: 'ORDER', discountType: 'FIXED', discountValue: 5000, minOrderAmount: 30000, maxDiscountAmount: null,
    issueType: 'AUTO', issueLimit: null, issuedCount: 1280,
    validFrom: '2026-01-01', validTo: '2026-12-31', costShareRate: 100, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-12-20 09:00', updatedBy: 'admin', updatedAt: '2026-05-01 11:00',
  },
  {
    couponId: 'CPN-002', couponCode: 'SUMMER10', couponName: '여름 시즌 10% 쿠폰',
    couponType: 'PRODUCT', partialCancelPolicy: 'KEEP',
    issuerType: 'PLATFORM', vendorName: '',
    memberTargetType: 'ALL', targetGrades: [], targetMemberFile: '', targetMemberCount: null,
    productTargetType: 'CATEGORY', targetProductIds: [], targetCategoryIds: ['CAT-001', 'CAT-002'],
    holders: [
      { memberId: 'M0002', memberName: '이서준', memberGrade: 'PACER', issuedVia: 'DOWNLOAD', issuedAt: '2026-06-10 13:22', usedAt: null, status: 'UNUSED' },
      { memberId: 'M0006', memberName: '강서윤', memberGrade: 'RUNNER', issuedVia: 'DOWNLOAD', issuedAt: '2026-06-12 08:15', usedAt: '2026-06-18 19:02', status: 'USED' },
      { memberId: 'M0010', memberName: '한예준', memberGrade: 'ELITE', issuedVia: 'MANUAL', issuedAt: '2026-06-20 11:00', usedAt: null, status: 'UNUSED' },
    ],
    applyUnit: 'CATEGORY', discountType: 'RATE', discountValue: 10, minOrderAmount: 50000, maxDiscountAmount: 10000,
    issueType: 'DOWNLOAD', issueLimit: 3000, issuedCount: 1874,
    validFrom: '2026-06-01', validTo: '2026-06-30', costShareRate: 100, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2026-05-20 10:00', updatedBy: 'admin', updatedAt: '2026-06-10 14:20',
  },
  {
    couponId: 'CPN-003', couponCode: 'NIKE-VENDOR-15', couponName: '나이키 입점사 15% 쿠폰',
    couponType: 'PRODUCT', partialCancelPolicy: 'KEEP',
    issuerType: 'VENDOR', vendorName: '나이키코리아',
    memberTargetType: 'ALL', targetGrades: [], targetMemberFile: '', targetMemberCount: null,
    productTargetType: 'MANUAL', targetProductIds: ['P001', 'P015', 'P016', 'P017'], targetCategoryIds: [],
    holders: [
      { memberId: 'M0001', memberName: '김도윤', memberGrade: 'ELITE', issuedVia: 'DOWNLOAD', issuedAt: '2026-05-02 09:30', usedAt: '2026-05-05 14:00', status: 'USED' },
      { memberId: 'M0009', memberName: '임수아', memberGrade: 'RUNNER', issuedVia: 'DOWNLOAD', issuedAt: '2026-05-03 16:12', usedAt: null, status: 'EXPIRED' },
    ],
    applyUnit: 'PRODUCT', discountType: 'RATE', discountValue: 15, minOrderAmount: 0, maxDiscountAmount: 20000,
    issueType: 'DOWNLOAD', issueLimit: 500, issuedCount: 500,
    validFrom: '2026-05-01', validTo: '2026-05-31', costShareRate: 50, status: 'EXHAUSTED',
    createdBy: 'editor1', createdAt: '2026-04-20 09:00', updatedBy: 'editor1', updatedAt: '2026-05-31 23:59',
  },
  {
    couponId: 'CPN-004', couponCode: 'ELITE-GRADE-3000', couponName: '엘리트 등급 전용 3,000원 쿠폰',
    couponType: 'CART', partialCancelPolicy: 'DENY',
    issuerType: 'PLATFORM', vendorName: '',
    memberTargetType: 'GRADE', targetGrades: ['ELITE'], targetMemberFile: '', targetMemberCount: null,
    productTargetType: 'ALL', targetProductIds: [], targetCategoryIds: [],
    holders: [
      { memberId: 'M0001', memberName: '김도윤', memberGrade: 'ELITE', issuedVia: 'ADMIN', issuedAt: '2025-12-31 09:05', usedAt: null, status: 'UNUSED' },
      { memberId: 'M0005', memberName: '정민준', memberGrade: 'ELITE', issuedVia: 'ADMIN', issuedAt: '2025-12-31 09:05', usedAt: '2026-01-10 12:40', status: 'USED' },
    ],
    applyUnit: 'ORDER', discountType: 'FIXED', discountValue: 3000, minOrderAmount: 20000, maxDiscountAmount: null,
    issueType: 'ADMIN', issueLimit: null, issuedCount: 412,
    validFrom: '2026-01-01', validTo: '2026-12-31', costShareRate: 100, status: 'ACTIVE',
    createdBy: 'admin', createdAt: '2025-12-31 09:00', updatedBy: 'admin', updatedAt: '2026-01-05 09:00',
  },
  {
    couponId: 'CPN-005', couponCode: 'WINTER-END-2025', couponName: '2025 겨울 시즌 종료 쿠폰',
    couponType: 'PRODUCT', partialCancelPolicy: 'KEEP',
    issuerType: 'PLATFORM', vendorName: '',
    memberTargetType: 'MANUAL', targetGrades: [], targetMemberFile: 'winter_end_targets.xlsx', targetMemberCount: 842,
    productTargetType: 'CATEGORY', targetProductIds: [], targetCategoryIds: ['CAT-003', 'CAT-004'],
    holders: [
      { memberId: 'M0003', memberName: '박하은', memberGrade: 'RUNNER', issuedVia: 'DOWNLOAD', issuedAt: '2025-12-05 10:20', usedAt: '2025-12-20 15:33', status: 'USED' },
    ],
    applyUnit: 'ORDER', discountType: 'RATE', discountValue: 5, minOrderAmount: 30000, maxDiscountAmount: 5000,
    issueType: 'DOWNLOAD', issueLimit: 1000, issuedCount: 640,
    validFrom: '2025-12-01', validTo: '2026-01-31', costShareRate: 100, status: 'INACTIVE',
    createdBy: 'admin', createdAt: '2025-11-20 09:00', updatedBy: 'admin', updatedAt: '2026-02-01 09:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterCoupons(items: Coupon[], filter: CouponFilter): Coupon[] {
  return items.filter((c) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!c.couponName.toLowerCase().includes(kw) && !c.couponCode.toLowerCase().includes(kw) && !c.couponId.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && c.status !== filter.status) return false
    if (filter.issuerType !== 'ALL' && c.issuerType !== filter.issuerType) return false
    if (filter.couponType !== 'ALL' && c.couponType !== filter.couponType) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let _cpnSeq = MOCK_COUPONS.length + 1
export function nextCouponId(): string {
  return `CPN-${String(_cpnSeq++).padStart(3, '0')}`
}
