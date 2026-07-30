'use client'
import { type ExhibitionStatus, EXHIBITION_STATUS_LABEL } from './mockData'

export function ExhibitionStatusBadge({ status }: { status: ExhibitionStatus }) {
  const dataAttr = status === 'ACTIVE' ? 'ON_SALE'
    : status === 'SCHEDULED' ? 'RESERVED'
    : status === 'DRAFT' ? 'DRAFT'
    : 'DISCONTINUED'
  return <span className="badge" data-product-status={dataAttr}>{EXHIBITION_STATUS_LABEL[status]}</span>
}
