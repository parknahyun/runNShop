'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type Vendor, VENDOR_TYPE_LABEL } from './mockData'
import { VendorStatusBadge } from './VendorStatusBadge'
import { VendorGradeBadge } from './VendorGradeBadge'
import BasicInfoTab from './tabs/BasicInfoTab'
import FeeRatesTab from './tabs/FeeRatesTab'
import PenaltiesTab from './tabs/PenaltiesTab'
import AccountTab from './tabs/AccountTab'

export default function VendorDetail({ vendor, currentUser, mode = 'modal', onClose, onUpdate }: {
  vendor: Vendor
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Vendor) => void
}) {
  const [current, setCurrent] = useState<Vendor>(vendor)

  function touch(patch: Partial<Vendor>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Vendor = { ...current, ...patch, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleBasicUpdate(updated: Vendor) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handlePenaltiesUpdate(penalties: Vendor['penalties']) {
    touch({ penalties })
  }

  return (
    <DetailShell mode={mode} title={current.businessName}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{current.vendorId} · {VENDOR_TYPE_LABEL[current.vendorType]}</span>
          <VendorGradeBadge grade={current.gradeCode} />
          <VendorStatusBadge status={current.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab vendor={current} currentUser={currentUser} onUpdate={handleBasicUpdate} />,
        },
        {
          label: `수수료율 (${current.feeRates.length})`,
          content: <FeeRatesTab vendor={current} />,
        },
        {
          label: `패널티 (${current.penalties.length})`,
          content: <PenaltiesTab vendor={current} onSave={handlePenaltiesUpdate} />,
        },
        {
          label: '정산계좌',
          content: <AccountTab vendor={current} />,
        },
      ]} />
    </DetailShell>
  )
}
