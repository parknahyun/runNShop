'use client'
import { type CartDiscountStatus, CART_DISCOUNT_STATUS_LABEL } from './mockData'

export function CartDiscountStatusBadge({ status }: { status: CartDiscountStatus }) {
  const dataAttr = status === 'ACTIVE' ? 'ON_SALE' : 'DISCONTINUED'
  return <span className="badge" data-product-status={dataAttr}>{CART_DISCOUNT_STATUS_LABEL[status]}</span>
}
