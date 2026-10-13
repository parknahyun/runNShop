'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type OperatorApplication, REQUESTED_ROLE_LABEL } from './mockData'
import { OperatorApplicationStatusBadge } from './OperatorApplicationStatusBadge'
import BasicInfoTab from './tabs/BasicInfoTab'

// ---------------------------------------------------------------------------
// ProcessFooter — 신청 상태별 승인/반려 액션
// ---------------------------------------------------------------------------

function ProcessFooter({ application, currentUser, readOnly, onDecide }: {
  application: OperatorApplication
  currentUser: string
  readOnly?: boolean
  onDecide: (patch: Partial<OperatorApplication>) => void
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (application.status !== 'APPLIED') return null

  function handleApprove() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onDecide({ status: 'APPROVED', rejectReason: null, reviewedBy: currentUser, reviewedAt: now })
  }

  function handleReject() {
    if (!rejectReason.trim()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onDecide({ status: 'REJECTED', rejectReason: rejectReason.trim(), reviewedBy: currentUser, reviewedAt: now })
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
              <textarea rows={3} value={rejectReason} disabled={readOnly}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="반려사유를 입력하세요 (신청자에게 전달됩니다)" />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" disabled={readOnly}
              onClick={() => { setShowRejectForm(false); setRejectReason('') }}>취소</button>
            <button className="btn-tool btn-tool--delete" disabled={readOnly || !rejectReason.trim()} onClick={handleReject}>반려 확정</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn-tool btn-tool--delete" disabled={readOnly} onClick={() => setShowRejectForm(true)}>반려</button>
          <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={handleApprove}>승인</button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// OperatorApplicationDetail
// ---------------------------------------------------------------------------

export default function OperatorApplicationDetail({ application, currentUser, mode = 'modal', readOnly = false, onClose, onUpdate }: {
  application: OperatorApplication
  currentUser: string
  mode?: DetailMode
  readOnly?: boolean
  onClose?: () => void
  onUpdate: (updated: OperatorApplication) => void
}) {
  const [current, setCurrent] = useState<OperatorApplication>(application)

  function handleDecide(patch: Partial<OperatorApplication>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: OperatorApplication = { ...current, ...patch, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  return (
    <DetailShell mode={mode} title={current.name}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{current.applicationId} · {REQUESTED_ROLE_LABEL[current.requestedRoleCode]}</span>
          <OperatorApplicationStatusBadge status={current.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label:   '기본정보',
          content: <BasicInfoTab application={current} />,
        },
      ]} />
      <ProcessFooter application={current} currentUser={currentUser} readOnly={readOnly} onDecide={handleDecide} />
    </DetailShell>
  )
}
