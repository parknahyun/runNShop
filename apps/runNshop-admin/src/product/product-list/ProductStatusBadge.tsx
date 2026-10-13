'use client'
import { type ProductSaleStatus, type ProductApprovalStatus, PRODUCT_SALE_STATUS_LABEL, PRODUCT_APPROVAL_STATUS_LABEL } from './mockData'

export function ProductSaleStatusBadge({ status }: { status: ProductSaleStatus }) {
  const dataAttr = status === 'ON_SALE' ? 'ON_SALE'
    : status === 'SOLD_OUT' ? 'OUT_OF_STOCK'
    : 'DRAFT'
  return <span className="badge" data-product-status={dataAttr}>{PRODUCT_SALE_STATUS_LABEL[status]}</span>
}

export function ProductApprovalStatusBadge({ status }: { status: ProductApprovalStatus }) {
  const dataAttr = status === 'APPROVED' ? 'ON_SALE'
    : status === 'PENDING' ? 'SUSPENDED'
    : 'OUT_OF_STOCK'
  return <span className="badge" data-product-status={dataAttr}>{PRODUCT_APPROVAL_STATUS_LABEL[status]}</span>
}
