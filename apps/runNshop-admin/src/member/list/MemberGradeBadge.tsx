'use client'
import { type MemberGrade, MEMBER_GRADE_LABEL } from './mockData'

export function MemberGradeBadge({ grade }: { grade: MemberGrade }) {
  return <span className="badge" data-member-grade={grade}>{MEMBER_GRADE_LABEL[grade]}</span>
}
