'use client'
import { type CouponStatus, COUPON_STATUS_LABEL } from './mockData'

export function CouponStatusBadge({ status }: { status: CouponStatus }) {
  const dataAttr = status === 'ACTIVE' ? 'ON_SALE'
    : status === 'EXHAUSTED' ? 'OUT_OF_STOCK'
    : 'DRAFT'
  return <span className="badge" data-product-status={dataAttr}>{COUPON_STATUS_LABEL[status]}</span>
}
