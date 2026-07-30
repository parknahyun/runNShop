'use client'
import { type VendorStatus, VENDOR_STATUS_LABEL } from './mockData'

export function VendorStatusBadge({ status }: { status: VendorStatus }) {
  return <span className="badge" data-vendor-status={status}>{VENDOR_STATUS_LABEL[status]}</span>
}
