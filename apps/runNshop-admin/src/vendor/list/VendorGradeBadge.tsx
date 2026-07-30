'use client'
import { type VendorGrade, VENDOR_GRADE_LABEL } from './mockData'

export function VendorGradeBadge({ grade }: { grade: VendorGrade }) {
  return <span className="badge" data-vendor-grade={grade}>{VENDOR_GRADE_LABEL[grade]}</span>
}
