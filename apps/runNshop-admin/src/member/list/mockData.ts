// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemberGrade = 'NEW' | 'RUNNER' | 'PACER' | 'ELITE'

// ERD(mbr_member.status)는 ACTIVE·INACTIVE·WITHDRAWN만 정의하지만
// FR-MBR-002(로그인 5회 실패 시 3일 계정 잠금)를 지원하려면 LOCKED가 필요하다 (문서 간 불일치, mock에서 보강)
export type MemberStatus = 'ACTIVE' | 'LOCKED' | 'INACTIVE' | 'WITHDRAWN'

export type JoinType = 'EMAIL' | 'NAVER' | 'APPLE'

export type MemberPointType = 'EARN' | 'USE' | 'RESTORE' | 'EXPIRE'

export type MemberCouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED'

export interface MemberOrderSummary {
  orderId: string
  platformOrderNo: string
  productName: string
  amount: number
  status: string
  orderDate: string
}

export interface MemberClaimSummary {
  claimNo: string
  claimType: string
  status: string
  refundAmount: number
  createdAt: string
}

export interface MemberPointEntry {
  pointId: string
  type: MemberPointType
  amount: number
  balanceAfter: number
  reason: string
  createdAt: string
}

export interface MemberCouponEntry {
  couponId: string
  couponName: string
  status: MemberCouponStatus
  issuedAt: string
  expireAt: string
  usedAt: string | null
}

export interface MemberGradeHistoryEntry {
  at: string
  grade: MemberGrade
  purchaseAmount: number
  activityScore: number
}

export interface Member {
  memberId: string
  memberNo: string
  name: string
  email: string
  phone: string
  joinType: JoinType
  grade: MemberGrade
  activityScore: number
  purchaseAmount: number      // 최근 3개월 구매확정금액 (등급 산정 기준)
  pointBalance: number
  status: MemberStatus
  lastLoginAt: string | null
  joinedAt: string
  withdrawnAt: string | null
  orders: MemberOrderSummary[]
  claims: MemberClaimSummary[]
  points: MemberPointEntry[]
  coupons: MemberCouponEntry[]
  gradeHistory: MemberGradeHistoryEntry[]
  updatedBy: string
  updatedAt: string
}

export interface MemberFilter {
  keyword: string
  grade: MemberGrade | 'ALL'
  status: MemberStatus | 'ALL'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const MEMBER_GRADE_LABEL: Record<MemberGrade, string> = {
  NEW: 'New',
  RUNNER: 'Runner',
  PACER: 'Pacer',
  ELITE: 'Elite',
}

export const MEMBER_STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: '정상',
  LOCKED: '잠금',
  INACTIVE: '정지',
  WITHDRAWN: '탈퇴',
}

export const JOIN_TYPE_LABEL: Record<JoinType, string> = {
  EMAIL: '이메일',
  NAVER: '네이버',
  APPLE: 'Apple',
}

export const MEMBER_POINT_TYPE_LABEL: Record<MemberPointType, string> = {
  EARN: '적립',
  USE: '사용',
  RESTORE: '복원',
  EXPIRE: '소멸',
}

export const MEMBER_COUPON_STATUS_LABEL: Record<MemberCouponStatus, string> = {
  AVAILABLE: '사용가능',
  USED: '사용완료',
  EXPIRED: '만료',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_MEMBERS: Member[] = [
  {
    memberId: 'M0001', memberNo: 'MB-20240312-0001', name: '김도윤', email: 'doyoon.kim@example.com', phone: '010-1234-5678',
    joinType: 'EMAIL', grade: 'ELITE', activityScore: 34, purchaseAmount: 3250000, pointBalance: 18200,
    status: 'ACTIVE', lastLoginAt: '2026.07.06 21:40', joinedAt: '2024.03.12 10:00', withdrawnAt: null,
    orders: [
      { orderId: '1', platformOrderNo: 'ORD-20260626-001', productName: '나이키 페가수스 41', amount: 152000, status: '결제완료', orderDate: '2026.06.26 09:15' },
      { orderId: '10', platformOrderNo: 'ORD-20260622-027', productName: '나이키 알파플라이 3', amount: 379000, status: '배송중', orderDate: '2026.06.22 15:00' },
    ],
    claims: [
      { claimNo: 'CLM-20260622-00004', claimType: '반품', status: '반려', refundAmount: 0, createdAt: '2026.06.30 11:00' },
    ],
    points: [
      { pointId: 'PT-0001', type: 'EARN', amount: 3040, balanceAfter: 18200, reason: '구매 적립 (ORD-20260626-001)', createdAt: '2026.06.26 09:20' },
      { pointId: 'PT-0002', type: 'USE', amount: -5000, balanceAfter: 15160, reason: '주문 시 포인트 사용', createdAt: '2026.06.20 13:10' },
    ],
    coupons: [
      { couponId: 'CPN-101', couponName: 'Elite 등급 월간 쿠폰', status: 'AVAILABLE', issuedAt: '2026.07.01 00:00', expireAt: '2026.09.29 23:59', usedAt: null },
      { couponId: 'CPN-102', couponName: '생일 축하 쿠폰', status: 'USED', issuedAt: '2026.05.01 00:00', expireAt: '2026.07.30 23:59', usedAt: '2026.05.15 10:00' },
    ],
    gradeHistory: [
      { at: '2026.06.01', grade: 'ELITE', purchaseAmount: 3250000, activityScore: 34 },
      { at: '2026.05.01', grade: 'ELITE', purchaseAmount: 3100000, activityScore: 31 },
    ],
    updatedBy: 'system', updatedAt: '2026.06.01 00:05',
  },
  {
    memberId: 'M0002', memberNo: 'MB-20240508-0002', name: '이서준', email: 'seojun.lee@example.com', phone: '010-2345-6789',
    joinType: 'NAVER', grade: 'PACER', activityScore: 22, purchaseAmount: 2150000, pointBalance: 6400,
    status: 'ACTIVE', lastLoginAt: '2026.07.05 08:12', joinedAt: '2024.05.08 14:30', withdrawnAt: null,
    orders: [
      { orderId: '3', platformOrderNo: 'ORD-20260625-015', productName: '호카 클리프턴 9', amount: 169000, status: '배송중', orderDate: '2026.06.25 14:22' },
    ],
    claims: [],
    points: [
      { pointId: 'PT-0003', type: 'EARN', amount: 2535, balanceAfter: 6400, reason: '구매 적립 (ORD-20260625-015)', createdAt: '2026.06.25 14:25' },
    ],
    coupons: [
      { couponId: 'CPN-103', couponName: 'Pacer 등급 월간 쿠폰', status: 'AVAILABLE', issuedAt: '2026.07.01 00:00', expireAt: '2026.09.29 23:59', usedAt: null },
    ],
    gradeHistory: [
      { at: '2026.06.01', grade: 'PACER', purchaseAmount: 2150000, activityScore: 22 },
    ],
    updatedBy: 'system', updatedAt: '2026.06.01 00:05',
  },
  {
    memberId: 'M0003', memberNo: 'MB-20250110-0003', name: '박하은', email: 'haeun.park@example.com', phone: '010-3456-7890',
    joinType: 'EMAIL', grade: 'RUNNER', activityScore: 12, purchaseAmount: 1080000, pointBalance: 1200,
    status: 'LOCKED', lastLoginAt: '2026.06.18 22:05', joinedAt: '2025.01.10 09:00', withdrawnAt: null,
    orders: [
      { orderId: '11', platformOrderNo: 'ORD-20260621-019', productName: '아식스 매직스피드 4', amount: 249000, status: '준비중', orderDate: '2026.06.21 11:45' },
    ],
    claims: [
      { claimNo: 'CLM-20260621-00005', claimType: '취소', status: '완료', refundAmount: 249000, createdAt: '2026.07.03 08:20' },
    ],
    points: [
      { pointId: 'PT-0004', type: 'RESTORE', amount: 1200, balanceAfter: 1200, reason: '취소에 따른 포인트 복원', createdAt: '2026.07.03 08:21' },
    ],
    coupons: [],
    gradeHistory: [
      { at: '2026.06.01', grade: 'RUNNER', purchaseAmount: 1080000, activityScore: 12 },
    ],
    updatedBy: 'system', updatedAt: '2026.06.18 22:06',
  },
  {
    memberId: 'M0004', memberNo: 'MB-20260101-0004', name: '최지우', email: 'jiwoo.choi@example.com', phone: '010-4567-8901',
    joinType: 'APPLE', grade: 'NEW', activityScore: 2, purchaseAmount: 89000, pointBalance: 450,
    status: 'ACTIVE', lastLoginAt: '2026.07.07 07:50', joinedAt: '2026.01.01 12:00', withdrawnAt: null,
    orders: [],
    claims: [],
    points: [
      { pointId: 'PT-0005', type: 'EARN', amount: 450, balanceAfter: 450, reason: '웰컴 포인트', createdAt: '2026.01.01 12:01' },
    ],
    coupons: [
      { couponId: 'CPN-104', couponName: '웰컴 쿠폰', status: 'AVAILABLE', issuedAt: '2026.01.01 12:01', expireAt: '2026.03.31 23:59', usedAt: null },
    ],
    gradeHistory: [
      { at: '2026.01.01', grade: 'NEW', purchaseAmount: 0, activityScore: 0 },
    ],
    updatedBy: 'system', updatedAt: '2026.01.01 12:01',
  },
  {
    memberId: 'M0005', memberNo: 'MB-20230920-0005', name: '정민준', email: 'minjun.jung@example.com', phone: '010-5678-9012',
    joinType: 'EMAIL', grade: 'ELITE', activityScore: 41, purchaseAmount: 4120000, pointBalance: 24500,
    status: 'ACTIVE', lastLoginAt: '2026.07.06 12:00', joinedAt: '2023.09.20 11:00', withdrawnAt: null,
    orders: [
      { orderId: '7', platformOrderNo: 'ORD-20260623-033', productName: '살로몬 S/LAB 울트라 4', amount: 349000, status: '구매확정', orderDate: '2026.06.23 09:45' },
    ],
    claims: [
      { claimNo: 'CLM-20260623-00003', claimType: '교환', status: '접수', refundAmount: 0, createdAt: '2026.07.02 09:40' },
    ],
    points: [
      { pointId: 'PT-0006', type: 'EARN', amount: 6980, balanceAfter: 24500, reason: '구매 적립 (ORD-20260623-033)', createdAt: '2026.06.23 09:50' },
    ],
    coupons: [
      { couponId: 'CPN-105', couponName: 'Elite 등급 월간 쿠폰', status: 'AVAILABLE', issuedAt: '2026.07.01 00:00', expireAt: '2026.09.29 23:59', usedAt: null },
    ],
    gradeHistory: [
      { at: '2026.06.01', grade: 'ELITE', purchaseAmount: 4120000, activityScore: 41 },
    ],
    updatedBy: 'system', updatedAt: '2026.06.01 00:05',
  },
  {
    memberId: 'M0008', memberNo: 'MB-20250715-0008', name: '윤지호', email: 'jiho.yoon@example.com', phone: '010-8901-2345',
    joinType: 'NAVER', grade: 'NEW', activityScore: 0, purchaseAmount: 0, pointBalance: 0,
    status: 'INACTIVE', lastLoginAt: '2026.03.02 09:00', joinedAt: '2025.07.15 10:00', withdrawnAt: null,
    orders: [],
    claims: [],
    points: [],
    coupons: [
      { couponId: 'CPN-106', couponName: '웰컴 쿠폰', status: 'EXPIRED', issuedAt: '2025.07.15 10:01', expireAt: '2025.10.13 23:59', usedAt: null },
    ],
    gradeHistory: [
      { at: '2025.07.15', grade: 'NEW', purchaseAmount: 0, activityScore: 0 },
    ],
    updatedBy: 'CS-이수현', updatedAt: '2026.03.10 15:00',
  },
  {
    memberId: 'M0009', memberNo: 'MB-20220605-0009', name: '임수아', email: 'sua.lim@example.com', phone: '010-9012-3456',
    joinType: 'EMAIL', grade: 'RUNNER', activityScore: 10, purchaseAmount: 1020000, pointBalance: 0,
    status: 'WITHDRAWN', lastLoginAt: '2026.02.10 20:00', joinedAt: '2022.06.05 13:00', withdrawnAt: '2026.02.15 00:00',
    orders: [
      { orderId: '9', platformOrderNo: 'ORD-20260622-028', productName: '미즈노 웨이브 라이더 28', amount: 179000, status: '구매확정', orderDate: '2026.06.22 17:30' },
    ],
    claims: [],
    points: [],
    coupons: [],
    gradeHistory: [
      { at: '2026.01.01', grade: 'RUNNER', purchaseAmount: 1020000, activityScore: 10 },
    ],
    updatedBy: '임수아', updatedAt: '2026.02.15 00:00',
  },
]

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

export function filterMembers(items: Member[], filter: MemberFilter): Member[] {
  return items.filter((m) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !m.name.toLowerCase().includes(kw) &&
        !m.email.toLowerCase().includes(kw) &&
        !m.phone.replace(/-/g, '').includes(kw.replace(/-/g, ''))
      ) return false
    }
    if (filter.grade !== 'ALL' && m.grade !== filter.grade) return false
    if (filter.status !== 'ALL' && m.status !== filter.status) return false
    if (filter.from) {
      const day = m.joinedAt.slice(0, 10).replace(/\./g, '-')
      if (day < filter.from) return false
    }
    if (filter.to) {
      const day = m.joinedAt.slice(0, 10).replace(/\./g, '-')
      if (day > filter.to) return false
    }
    return true
  })
}
