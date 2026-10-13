'use client'
import { type SettlementPaymentStatus, SETTLEMENT_PAYMENT_STATUS_LABEL } from './mockData'

export function SettlementPaymentStatusBadge({ status }: { status: SettlementPaymentStatus }) {
  return <span className="badge" data-settlement-payment-status={status}>{SETTLEMENT_PAYMENT_STATUS_LABEL[status]}</span>
}
