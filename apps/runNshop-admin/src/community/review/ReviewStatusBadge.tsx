'use client'
import { type ReviewStatus, REVIEW_STATUS_LABEL } from './mockData'

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return <span className="badge" data-review-status={status}>{REVIEW_STATUS_LABEL[status]}</span>
}
