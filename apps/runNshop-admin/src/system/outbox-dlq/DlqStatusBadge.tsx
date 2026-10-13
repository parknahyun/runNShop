'use client'
import { type DlqStatus, DLQ_STATUS_LABEL } from './mockData'

export function DlqStatusBadge({ status }: { status: DlqStatus }) {
  return <span className="badge" data-dlq-status={status}>{DLQ_STATUS_LABEL[status]}</span>
}
