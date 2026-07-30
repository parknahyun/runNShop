'use client'
import { type DisplayCategoryStatus, DISPLAY_CATEGORY_STATUS_LABEL } from './mockData'

export function DisplayCategoryStatusBadge({ status }: { status: DisplayCategoryStatus }) {
  return <span className="badge" data-pgm-status={status}>{DISPLAY_CATEGORY_STATUS_LABEL[status]}</span>
}
