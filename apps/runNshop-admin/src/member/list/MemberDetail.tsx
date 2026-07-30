'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type Member, MEMBER_GRADE_LABEL } from './mockData'
import { MemberStatusBadge } from './MemberStatusBadge'
import BasicInfoTab from './tabs/BasicInfoTab'
import OrdersTab from './tabs/OrdersTab'
import ClaimsTab from './tabs/ClaimsTab'
import PointsTab from './tabs/PointsTab'
import CouponsTab from './tabs/CouponsTab'

export default function MemberDetail({ member, currentUser, mode = 'modal', onClose, onUpdate }: {
  member: Member
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Member) => void
}) {
  const [current, setCurrent] = useState<Member>(member)

  function touch(patch: Partial<Member>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Member = { ...current, ...patch, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleBasicUpdate(updated: Member) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handlePointsUpdate(points: Member['points'], pointBalance: number) {
    touch({ points, pointBalance })
  }

  function handleCouponsUpdate(coupons: Member['coupons']) {
    touch({ coupons })
  }

  return (
    <DetailShell mode={mode} title={current.name}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{current.memberId} · {MEMBER_GRADE_LABEL[current.grade]}</span>
          <MemberStatusBadge status={current.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab member={current} currentUser={currentUser} onUpdate={handleBasicUpdate} />,
        },
        {
          label: `주문내역 (${current.orders.length})`,
          content: <OrdersTab member={current} />,
        },
        {
          label: `클레임이력 (${current.claims.length})`,
          content: <ClaimsTab member={current} />,
        },
        {
          label: `포인트이력 (${current.points.length})`,
          content: <PointsTab member={current} currentUser={currentUser} onSave={handlePointsUpdate} />,
        },
        {
          label: `쿠폰목록 (${current.coupons.length})`,
          content: <CouponsTab member={current} onSave={handleCouponsUpdate} />,
        },
      ]} />
    </DetailShell>
  )
}
