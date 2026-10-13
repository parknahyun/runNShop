'use client'
import { type MemberStatus, MEMBER_STATUS_LABEL } from './mockData'

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  return <span className="badge" data-member-status={status}>{MEMBER_STATUS_LABEL[status]}</span>
}
