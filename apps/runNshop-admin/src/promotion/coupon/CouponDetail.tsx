'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type Coupon, type CouponMemberTargetType, type MemberGrade, type CouponProductTargetType, type CouponHolder } from './mockData'
import BasicInfoTab from './tabs/BasicInfoTab'
import MembersTab from './tabs/MembersTab'
import ProductsTab from './tabs/ProductsTab'
import HoldersTab from './tabs/HoldersTab'

export default function CouponDetail({ coupon, currentUser, mode = 'modal', onClose, onUpdate, readOnly = false }: {
  coupon: Coupon
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Coupon) => void
  readOnly?: boolean
}) {
  const [current, setCurrent] = useState<Coupon>(coupon)

  function handleBasicUpdate(updated: Coupon) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleMembersUpdate(v: { memberTargetType: CouponMemberTargetType; targetGrades: MemberGrade[]; targetMemberFile: string; targetMemberCount: number | null }) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Coupon = { ...current, ...v, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleProductsUpdate(v: { productTargetType: CouponProductTargetType; targetProductIds: string[]; targetCategoryIds: string[] }) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Coupon = { ...current, ...v, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleIssueHolders(newHolders: CouponHolder[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Coupon = {
      ...current,
      holders: [...current.holders, ...newHolders],
      issuedCount: current.issuedCount + newHolders.length,
      updatedBy: currentUser,
      updatedAt: now,
    }
    setCurrent(updated)
    onUpdate(updated)
  }

  const productCount = current.productTargetType === 'ALL'
    ? null
    : current.productTargetType === 'MANUAL' ? current.targetProductIds.length : current.targetCategoryIds.length

  return (
    <DetailShell mode={mode} title={current.couponName}
      meta={<span className="detail-modal__subtitle">{current.couponId} · {current.couponCode}</span>}
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab coupon={current} currentUser={currentUser} onUpdate={handleBasicUpdate} readOnly={readOnly} />,
        },
        {
          label: '적용회원',
          content: <MembersTab coupon={current} onSave={handleMembersUpdate} readOnly={readOnly} />,
        },
        {
          label: productCount === null ? '적용상품 (전체)' : `적용상품 (${productCount})`,
          content: <ProductsTab coupon={current} onSave={handleProductsUpdate} locked={current.couponType === 'CART'} readOnly={readOnly} />,
        },
        {
          label: `보유회원 (${current.holders.length})`,
          content: <HoldersTab coupon={current} onIssue={handleIssueHolders} readOnly={readOnly} />,
        },
      ]} />
    </DetailShell>
  )
}
