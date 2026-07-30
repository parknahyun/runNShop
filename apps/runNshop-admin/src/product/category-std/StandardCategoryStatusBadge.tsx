'use client'
import { type StandardCategoryStatus, STANDARD_CATEGORY_STATUS_LABEL } from './mockData'

export function StandardCategoryStatusBadge({ status }: { status: StandardCategoryStatus }) {
  return <span className="badge" data-pgm-status={status}>{STANDARD_CATEGORY_STATUS_LABEL[status]}</span>
}
