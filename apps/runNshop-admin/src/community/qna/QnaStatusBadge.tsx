'use client'
import { type QnaStatus, QNA_STATUS_LABEL } from './mockData'

export function QnaStatusBadge({ status }: { status: QnaStatus }) {
  return <span className="badge" data-qna-status={status}>{QNA_STATUS_LABEL[status]}</span>
}
