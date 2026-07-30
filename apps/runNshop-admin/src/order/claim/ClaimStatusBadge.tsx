'use client'
import { type ClaimStatus, CLAIM_STATUS_LABEL } from './mockData'

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return <span className="badge" data-claim-status={status}>{CLAIM_STATUS_LABEL[status]}</span>
}
