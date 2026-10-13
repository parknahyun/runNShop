// ---------------------------------------------------------------------------
// 회원 카탈로그 (프로모션 도메인 전반의 회원 검색/선택에 공통으로 사용)
// ---------------------------------------------------------------------------

export type CatalogMemberGrade = 'NEW' | 'RUNNER' | 'PACER' | 'ELITE'

export interface CatalogMember {
  memberId: string
  memberName: string
  email: string
  grade: CatalogMemberGrade
}

export const MOCK_MEMBER_CATALOG: CatalogMember[] = [
  { memberId: 'M0001', memberName: '김도윤', email: 'doyoon.kim@example.com', grade: 'ELITE' },
  { memberId: 'M0002', memberName: '이서준', email: 'seojun.lee@example.com', grade: 'PACER' },
  { memberId: 'M0003', memberName: '박하은', email: 'haeun.park@example.com', grade: 'RUNNER' },
  { memberId: 'M0004', memberName: '최지우', email: 'jiwoo.choi@example.com', grade: 'NEW' },
  { memberId: 'M0005', memberName: '정민준', email: 'minjun.jung@example.com', grade: 'ELITE' },
  { memberId: 'M0006', memberName: '강서윤', email: 'seoyoon.kang@example.com', grade: 'RUNNER' },
  { memberId: 'M0007', memberName: '조은우', email: 'eunwoo.jo@example.com', grade: 'PACER' },
  { memberId: 'M0008', memberName: '윤지호', email: 'jiho.yoon@example.com', grade: 'NEW' },
  { memberId: 'M0009', memberName: '임수아', email: 'sua.lim@example.com', grade: 'RUNNER' },
  { memberId: 'M0010', memberName: '한예준', email: 'yejun.han@example.com', grade: 'ELITE' },
]
