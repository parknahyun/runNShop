'use client'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type Settlement, addBusinessDays } from './mockData'
import { SettlementStatusBadge } from './SettlementStatusBadge'
import BasicInfoTab from './tabs/BasicInfoTab'
import SettlementItemsTab from './tabs/SettlementItemsTab'
import AdjustmentsTab from './tabs/AdjustmentsTab'

// ---------------------------------------------------------------------------
// ConfirmFooter — 정산중 → 확정 전이 (지급/보류는 지급 관리 화면에서 처리)
// ---------------------------------------------------------------------------

function ConfirmFooter({ settlement, currentUser, onConfirm }: {
  settlement: Settlement
  currentUser: string
  onConfirm: (patch: Partial<Settlement>) => void
}) {
  if (settlement.status !== 'CALCULATING') return null

  function handleConfirm() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const objectionDeadline = addBusinessDays(now, 5)
    onConfirm({ status: 'CONFIRMED', confirmedAt: now, confirmedBy: currentUser, objectionDeadline })
  }

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn-tool btn-tool--add" onClick={handleConfirm}>정산 확정</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SettlementDetail
// ---------------------------------------------------------------------------

export default function SettlementDetail({ settlement, currentUser, mode = 'modal', onClose, onUpdate }: {
  settlement: Settlement
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Settlement) => void
}) {
  function handleConfirm(patch: Partial<Settlement>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({ ...settlement, ...patch, updatedAt: now })
  }

  return (
    <DetailShell mode={mode} title={settlement.settlementNo}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{settlement.vendorName} · {settlement.settlementMonth}</span>
          <SettlementStatusBadge status={settlement.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab settlement={settlement} />,
        },
        {
          label: `정산항목 (${settlement.items.length})`,
          content: <SettlementItemsTab settlement={settlement} />,
        },
        {
          label: `재정산내역 (${settlement.adjustments.length})`,
          content: <AdjustmentsTab settlement={settlement} />,
        },
      ]} />
      <ConfirmFooter settlement={settlement} currentUser={currentUser} onConfirm={handleConfirm} />
    </DetailShell>
  )
}
