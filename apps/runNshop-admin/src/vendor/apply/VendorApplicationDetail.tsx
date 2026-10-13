'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type VendorApplication, BUSINESS_TYPE_LABEL } from './mockData'
import { VendorApplicationStatusBadge } from './VendorApplicationStatusBadge'
import BasicInfoTab from './tabs/BasicInfoTab'
import HistoryTab from './tabs/HistoryTab'

// ---------------------------------------------------------------------------
// ReviewFooter — 상태별 심사 액션 (신청 → 심사중 → 계약진행 → 승인, 반려는 승인 전 언제나 가능)
// ---------------------------------------------------------------------------

function ReviewFooter({ application, currentUser, onTransition }: {
  application: VendorApplication
  currentUser: string
  onTransition: (patch: Partial<VendorApplication>, action: string, memo?: string) => void
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (application.status === 'APPROVED' || application.status === 'REJECTED') return null

  function handleStartReview() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({ status: 'REVIEWING', reviewedBy: currentUser, reviewedAt: now }, '심사 시작')
  }

  function handleContract() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({ status: 'CONTRACT', reviewedBy: currentUser, reviewedAt: now }, '계약 진행')
  }

  function handleApprove() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({ status: 'APPROVED', reviewedBy: currentUser, reviewedAt: now }, '승인 처리')
  }

  function handleReject() {
    if (!rejectReason.trim()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({
      status: 'REJECTED',
      rejectReason: rejectReason.trim(),
      rejectCount: application.rejectCount + 1,
      reviewedBy: currentUser,
      reviewedAt: now,
    }, '반려 처리', rejectReason.trim())
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
                placeholder="반려사유를 입력하세요 (입점 신청사에게 전달됩니다)" />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => { setShowRejectForm(false); setRejectReason('') }}>취소</button>
            <button className="btn-tool btn-tool--delete" disabled={!rejectReason.trim()} onClick={handleReject}>반려 확정</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {application.status === 'APPLIED' && (
            <button className="btn-tool btn-tool--add" onClick={handleStartReview}>심사 시작</button>
          )}
          {application.status === 'REVIEWING' && (
            <>
              <button className="btn-tool btn-tool--delete" onClick={() => setShowRejectForm(true)}>반려</button>
              <button className="btn-tool btn-tool--add" onClick={handleContract}>계약 진행</button>
            </>
          )}
          {application.status === 'CONTRACT' && (
            <>
              <button className="btn-tool btn-tool--delete" onClick={() => setShowRejectForm(true)}>반려</button>
              <button className="btn-tool btn-tool--add" onClick={handleApprove}>승인</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// VendorApplicationDetail
// ---------------------------------------------------------------------------

export default function VendorApplicationDetail({ application, currentUser, mode = 'modal', onClose, onUpdate }: {
  application: VendorApplication
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: VendorApplication) => void
}) {
  const [current, setCurrent] = useState<VendorApplication>(application)

  function touch(patch: Partial<VendorApplication>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: VendorApplication = { ...current, ...patch, updatedAt: now }
    setCurrent(updated)
    onUpdate(updated)
  }

  function handleTransition(patch: Partial<VendorApplication>, action: string, memo?: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const history = [...current.history, { at: now, actor: currentUser, action, memo }]
    touch({ ...patch, history })
  }

  return (
    <DetailShell mode={mode} title={current.businessName}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{current.applicationId} · {BUSINESS_TYPE_LABEL[current.businessType]}</span>
          <VendorApplicationStatusBadge status={current.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab application={current} />,
        },
        {
          label: `심사이력 (${current.history.length})`,
          content: <HistoryTab application={current} />,
        },
      ]} />
      <ReviewFooter application={current} currentUser={currentUser} onTransition={handleTransition} />
    </DetailShell>
  )
}
