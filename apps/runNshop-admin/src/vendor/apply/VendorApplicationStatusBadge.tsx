'use client'
import { type VendorApplicationStatus, VENDOR_APP_STATUS_LABEL } from './mockData'

export function VendorApplicationStatusBadge({ status }: { status: VendorApplicationStatus }) {
  return <span className="badge" data-vendor-app-status={status}>{VENDOR_APP_STATUS_LABEL[status]}</span>
}
