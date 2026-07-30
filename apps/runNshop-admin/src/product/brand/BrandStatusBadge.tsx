'use client'
import { type BrandStatus, BRAND_STATUS_LABEL } from './mockData'

export function BrandStatusBadge({ status }: { status: BrandStatus }) {
  return <span className="badge" data-pgm-status={status}>{BRAND_STATUS_LABEL[status]}</span>
}
