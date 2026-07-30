'use client'
import { type OutboxStatus, OUTBOX_STATUS_LABEL } from './mockData'

export function OutboxStatusBadge({ status }: { status: OutboxStatus }) {
  return <span className="badge" data-outbox-status={status}>{OUTBOX_STATUS_LABEL[status]}</span>
}
