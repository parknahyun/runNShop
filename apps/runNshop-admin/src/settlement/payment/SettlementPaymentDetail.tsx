'use client'
import { useState } from 'react'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type SettlementPayment, BANK_NAME_LABEL } from './mockData'
import { SettlementPaymentStatusBadge } from './SettlementPaymentStatusBadge'

// ---------------------------------------------------------------------------
// PaymentFooter — 지급예정 → 지급완료/보류, 보류 → 지급예정(해제)
// ---------------------------------------------------------------------------

function PaymentFooter({ payment, onTransition }: {
  payment: SettlementPayment
  onTransition: (patch: Partial<SettlementPayment>) => void
}) {
  const [showHoldForm, setShowHoldForm] = useState(false)
  const [holdReason, setHoldReason] = useState('')

  if (payment.status === 'PAID' || payment.status === 'FAILED') return null

  function handlePay() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onTransition({ status: 'PAID', paidAt: now, holdReason: null })
  }

  function handleHold() {
    if (!holdReason.trim()) return
    onTransition({ status: 'HOLD', holdReason: holdReason.trim() })
    setShowHoldForm(false)
    setHoldReason('')
  }

  function handleRelease() {
    onTransition({ status: 'SCHEDULED', holdReason: null })
  }

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      {showHoldForm ? (
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>보류사유 <span className="add-form__req">*</span></label>
              <textarea rows={3} value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                placeholder="지급 보류 사유를 입력하세요" />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => { setShowHoldForm(false); setHoldReason('') }}>취소</button>
            <button className="btn-tool btn-tool--delete" disabled={!holdReason.trim()} onClick={handleHold}>보류 확정</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {payment.status === 'SCHEDULED' && (
            <>
              <button className="btn-tool btn-tool--delete" onClick={() => setShowHoldForm(true)}>지급 보류</button>
              <button className="btn-tool btn-tool--add" onClick={handlePay}>지급 완료</button>
            </>
          )}
          {payment.status === 'HOLD' && (
            <button className="btn-tool btn-tool--add" onClick={handleRelease}>보류 해제</button>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SettlementPaymentDetail
// ---------------------------------------------------------------------------

export default function SettlementPaymentDetail({ payment, mode = 'modal', onClose, onUpdate }: {
  payment: SettlementPayment
  currentUser: string
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: SettlementPayment) => void
}) {
  function handleTransition(patch: Partial<SettlementPayment>) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({ ...payment, ...patch, updatedAt: now })
  }

  return (
    <DetailShell mode={mode} title={payment.settlementNo}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{payment.vendorName}</span>
          <SettlementPaymentStatusBadge status={payment.status} />
        </>
      }
      onClose={onClose}>
      <div className="tab-panel-content">
        <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <dl className="info-dl">
            <div className="info-row"><dt>정산번호</dt><dd style={{ fontWeight: 600 }}>{payment.settlementNo}</dd></div>
            <div className="info-row"><dt>입점사</dt><dd>{payment.vendorName}</dd></div>
            <div className="info-row"><dt>상태</dt><dd><SettlementPaymentStatusBadge status={payment.status} /></dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>은행</dt><dd>{BANK_NAME_LABEL[payment.bankCode] ?? payment.bankCode}</dd></div>
            <div className="info-row"><dt>계좌번호</dt><dd>{payment.accountNo}</dd></div>
            <div className="info-row"><dt>예금주</dt><dd>{payment.accountHolder}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>지급금액</dt><dd style={{ fontWeight: 700, color: '#dc2626' }}>{payment.paymentAmount.toLocaleString()}원</dd></div>
            <div className="info-row"><dt>지급예정일</dt><dd>{payment.scheduledDate}</dd></div>
            <div className="info-row"><dt>지급완료일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{payment.paidAt ?? '-'}</dd></div>
          </dl>
        </div>
        <dl className="info-dl" style={{ marginTop: 12 }}>
          <div className="info-row"><dt>보류사유</dt><dd>{payment.holdReason ?? '-'}</dd></div>
          <div className="info-row"><dt>생성일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{payment.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{payment.updatedAt}</dd></div>
        </dl>
      </div>
      <PaymentFooter payment={payment} onTransition={handleTransition} />
    </DetailShell>
  )
}
