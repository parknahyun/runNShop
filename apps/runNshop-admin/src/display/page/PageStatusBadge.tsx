'use client'
import { type PageStatus, PAGE_STATUS_LABEL } from './mockData'

export function PageStatusBadge({ status }: { status: PageStatus }) {
  const dataAttr = status === 'PUBLISHED' ? 'ON_SALE'
    : status === 'SCHEDULED' ? 'RESERVED'
    : status === 'DRAFT' ? 'DRAFT'
    : 'DISCONTINUED'
  return <span className="badge" data-product-status={dataAttr}>{PAGE_STATUS_LABEL[status]}</span>
}
