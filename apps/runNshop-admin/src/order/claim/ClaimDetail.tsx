'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type Claim, CLAIM_TYPE_LABEL } from './mockData'
import { ClaimStatusBadge } from './ClaimStatusBadge'
import BasicInfoTab from './tabs/BasicInfoTab'
import ClaimItemsTab from './tabs/ClaimItemsTab'
import HistoryTab from './tabs/HistoryTab'

// ---------------------------------------------------------------------------
// ProcessFooter — 상태별 처리 액션 (접수 → 처리중 → 완료/반려)
// ---------------------------------------------------------------------------

function ProcessFooter({ claim, currentUser, onTransition }: {
  claim: Claim
  currentUser: string
  onTransition: (patch: Partial<Claim>, action: string, memo?: string) => void
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (claim.status === 'COMPLETED' || claim.status === 'REJECTED') return null

  function handleStart() {
    onTransition({ status: 'PROCESSING' }, '처리 시작')
  }

  function handleComplete() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({ status: 'COMPLETED', completedAt: now }, '처리 완료', '환불·재고복구 등 후속 처리 완료')
  }

  function handleReject() {
    if (!rejectReason.trim()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({ status: 'REJECTED', completedAt: now }, '반려 처리', rejectReason.trim())
    setShowRejectForm(false)
    setRejectReason('')
  }

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      {showRejectForm ? (
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>반려사유 <span className="add-form__req">*</span></label>
              <textarea rows={3} value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="반려사유를 입력하세요 (고객에게 전달됩니다)" />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => { setShowRejectForm(false); setRejectReason('') }}>취소</button>
            <button className="btn-tool btn-tool--delete" disabled={!rejectReason.trim()} onClick={handleReject}>반려 확정</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {claim.status === 'REQUESTED' && (
            <button className="btn-tool btn-tool--add" onClick={handleStart}>처리 시작</button>
          )}
          {claim.status === 'PROCESSING' && (
            <>
              <button className="btn-tool btn-tool--delete" onClick={() => setShowRejectForm(true)}>반려</button>
              <button className="btn-tool btn-tool--add" onClick={handleComplete}>완료 처리</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ClaimDetail
// ---------------------------------------------------------------------------

export default function ClaimDetail({ claim, currentUser, mode = 'modal', onClose, onUpdate }: {
  claim: Claim
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Claim) => void
}) {
  const [current, setCurrent] = useState<Claim>(claim)

  function touch(patch: Partial<Claim>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: Claim = { ...current, ...patch, updatedBy: currentUser, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleBasicUpdate(updated: Claim) {
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleTransition(patch: Partial<Claim>, action: string, memo?: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const history = [...current.history, { at: now, actor: currentUser, action, memo }]
    touch({ ...patch, history })
  }

  return (
    <DetailShell mode={mode} title={current.claimNo}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{current.platformOrderNo} · {CLAIM_TYPE_LABEL[current.claimType]}</span>
          <ClaimStatusBadge status={current.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab claim={current} currentUser={currentUser} onUpdate={handleBasicUpdate} />,
        },
        {
          label: `클레임 상품 (${current.items.length})`,
          content: <ClaimItemsTab claim={current} />,
        },
        {
          label: `처리이력 (${current.history.length})`,
          content: <HistoryTab claim={current} />,
        },
      ]} />
      <ProcessFooter claim={current} currentUser={currentUser} onTransition={handleTransition} />
    </DetailShell>
  )
}
