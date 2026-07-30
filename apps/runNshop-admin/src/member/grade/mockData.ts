import { type MemberGrade, MEMBER_GRADE_LABEL } from '@/member/list/mockData'

export type { MemberGrade }
export { MEMBER_GRADE_LABEL }

export interface GradeCriteria {
  gradeCode: MemberGrade
  minPurchaseAmount: number    // 최근 3개월 구매확정금액 기준 (원)
  minActivityScore: number     // 최근 3개월 활동지수 기준 (점)
  pointBonusRate: number       // 포인트 적립률 (%)
  freeShippingMin: number      // 무료배송 최소주문금액 (원). Elite는 0 = 무조건 무료
  monthlyCouponCount: number   // 매월 지급되는 등급 쿠폰 수
  updatedBy: string
  updatedAt: string
}

export const GRADE_ORDER: MemberGrade[] = ['NEW', 'RUNNER', 'PACER', 'ELITE']

export const MOCK_GRADE_CRITERIA: GradeCriteria[] = [
  { gradeCode: 'NEW', minPurchaseAmount: 0, minActivityScore: 0, pointBonusRate: 0.5, freeShippingMin: 50000, monthlyCouponCount: 0, updatedBy: 'admin', updatedAt: '2026.01.01 00:00' },
  { gradeCode: 'RUNNER', minPurchaseAmount: 1000000, minActivityScore: 10, pointBonusRate: 1.0, freeShippingMin: 30000, monthlyCouponCount: 1, updatedBy: 'admin', updatedAt: '2026.01.01 00:00' },
  { gradeCode: 'PACER', minPurchaseAmount: 2000000, minActivityScore: 20, pointBonusRate: 1.5, freeShippingMin: 20000, monthlyCouponCount: 2, updatedBy: 'admin', updatedAt: '2026.01.01 00:00' },
  { gradeCode: 'ELITE', minPurchaseAmount: 3000000, minActivityScore: 30, pointBonusRate: 2.0, freeShippingMin: 0, monthlyCouponCount: 3, updatedBy: 'admin', updatedAt: '2026.01.01 00:00' },
]
