'use client'
import { type SettlementStatus, SETTLEMENT_STATUS_LABEL } from './mockData'

export function SettlementStatusBadge({ status }: { status: SettlementStatus }) {
  return <span className="badge" data-settlement-status={status}>{SETTLEMENT_STATUS_LABEL[status]}</span>
}
