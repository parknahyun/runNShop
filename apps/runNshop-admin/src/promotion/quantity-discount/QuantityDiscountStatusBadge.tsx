'use client'
import { type QuantityDiscountStatus, QUANTITY_DISCOUNT_STATUS_LABEL } from './mockData'

export function QuantityDiscountStatusBadge({ status }: { status: QuantityDiscountStatus }) {
  const dataAttr = status === 'ACTIVE' ? 'ON_SALE' : 'DISCONTINUED'
  return <span className="badge" data-product-status={dataAttr}>{QUANTITY_DISCOUNT_STATUS_LABEL[status]}</span>
}
