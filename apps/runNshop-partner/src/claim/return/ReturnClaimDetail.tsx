'use client'
import { useState } from 'react'
import { type ReturnClaim } from './mockData'
import { ReturnStatusBadge, BlameBadge } from './ReturnStatusBadge'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { HistoryTimeline } from '@/claim/shared/HistoryTimeline'
import { PickupForm } from '@/claim/shared/PickupForm'
import { nowTimestamp } from '@/claim/shared/format'

interface Props {
  claim: ReturnClaim
  onClose: () => void
  onUpdate: (updater: (c: ReturnClaim) => ReturnClaim) => void
}

type ActivePanel = 'pickup' | 'opinion' | null

export default function ReturnClaimDetail({ claim, onClose, onUpdate }: Props) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [opinionText, setOpinionText] = useState('')

  function registerPickup(company: string, trackingNo: string) {
    onUpdate((c) => ({
      ...c,
      pickup_company: company,
      pickup_tracking_no: trackingNo,
      status: 'PICKUP_REGISTERED',
      history: [...c.history, { at: nowTimestamp(), action: '수거 운송장 등록', memo: `${company} / ${trackingNo}` }],
    }))
    setActivePanel(null)
  }

  function confirmPickupDone() {
    if (!window.confirm('수거 완료로 처리하시겠습니까?')) return
    onUpdate((c) => ({
      ...c,
      status: 'PICKUP_DONE',
      history: [...c.history, { at: nowTimestamp(), action: '수거 완료 처리' }],
    }))
  }

  function restoreStock() {
    if (!window.confirm('재고를 수동으로 복구하시겠습니까? 되돌릴 수 없습니다.')) return
    onUpdate((c) => ({
      ...c,
      status: 'STOCK_RESTORED',
      history: [...c.history, { at: nowTimestamp(), action: '재고 수동 복구' }],
    }))
  }

  function submitOpinion() {
    if (!opinionText.trim()) {
      alert('의견을 입력하세요.')
      return
    }
    onUpdate((c) => ({
      ...c,
      vendor_opinion: opinionText.trim(),
      history: [...c.history, { at: nowTimestamp(), action: '이의제기 등록', memo: opinionText.trim() }],
    }))
    setActivePanel(null)
    setOpinionText('')
  }

  const isTerminal = claim.status === 'COMPLETED'

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{claim.claim_no}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <ReturnStatusBadge status={claim.status} />
              <BlameBadge blame={claim.blame_type} />
              <span style={{ fontSize: 12, color: '#64748b' }}>주문번호 {claim.platform_order_no}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본정보', content: <BasicInfoTab claim={claim} /> },
            { key: 'history', label: '처리이력', content: <div className="tab-panel-content"><HistoryTimeline history={claim.history} /></div> },
          ]} />
        </div>

        {/* Footer actions */}
        {activePanel === 'pickup' ? (
          <div style={{ padding: '0 24px 14px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <PickupForm onSubmit={registerPickup} onCancel={() => setActivePanel(null)} />
          </div>
        ) : activePanel === 'opinion' ? (
          <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div className="add-form__field add-form__field--full">
              <label>이의제기 의견</label>
              <textarea rows={3} placeholder="귀책 판정에 대한 의견을 입력하세요."
                value={opinionText} onChange={(e) => setOpinionText(e.target.value)} />
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => { setActivePanel(null); setOpinionText('') }}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={submitOpinion}>등록</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div>
              {!isTerminal && (
                <button className="btn-tool" disabled={!!claim.vendor_opinion} onClick={() => setActivePanel('opinion')}>
                  {claim.vendor_opinion ? '이의제기 완료' : '이의제기'}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {claim.status === 'REQUESTED' && (
                <button className="btn-tool btn-tool--add" onClick={() => setActivePanel('pickup')}>수거 운송장 등록</button>
              )}
              {claim.status === 'PICKUP_REGISTERED' && (
                <button className="btn-tool btn-tool--add" onClick={confirmPickupDone}>수거 완료 처리</button>
              )}
              {claim.status === 'PICKUP_DONE' && (
                <button className="btn-tool btn-tool--add" onClick={restoreStock}>재고 수동 복구</button>
              )}
              {claim.status === 'STOCK_RESTORED' && (
                <span style={{ fontSize: 12, color: '#94a3b8' }}>환불 완료 대기 중 (플랫폼 처리)</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function BasicInfoTab({ claim }: { claim: ReturnClaim }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">기본 정보</h2>
        <div className="info-grid">
          <dl className="info-dl">
            <div className="info-row"><dt>클레임번호</dt><dd>{claim.claim_no}</dd></div>
            <div className="info-row"><dt>주문번호</dt><dd>{claim.platform_order_no}</dd></div>
            <div className="info-row"><dt>상품명</dt><dd>{claim.product_name}</dd></div>
            <div className="info-row"><dt>옵션</dt><dd>{claim.sku_option}</dd></div>
            <div className="info-row"><dt>고객명</dt><dd>{claim.customer_name}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>환불금액</dt><dd className="amount-cell">{claim.refund_amount.toLocaleString()}원</dd></div>
            <div className="info-row"><dt>반품사유</dt><dd>{claim.reason}</dd></div>
            <div className="info-row"><dt>귀책</dt><dd><BlameBadge blame={claim.blame_type} /></dd></div>
            <div className="info-row"><dt>상태</dt><dd><ReturnStatusBadge status={claim.status} /></dd></div>
            <div className="info-row"><dt>접수일시</dt><dd>{claim.created_at}</dd></div>
          </dl>
        </div>
      </section>

      <section className="detail-section">
        <h2 className="section-title">수거 정보</h2>
        <div className="info-grid">
          <dl className="info-dl">
            <div className="info-row"><dt>택배사</dt><dd>{claim.pickup_company ?? '-'}</dd></div>
            <div className="info-row"><dt>운송장번호</dt><dd>{claim.pickup_tracking_no ?? '-'}</dd></div>
          </dl>
        </div>
      </section>

      {claim.vendor_opinion && (
        <section className="detail-section">
          <h2 className="section-title">이의제기 의견</h2>
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{claim.vendor_opinion}</p>
        </section>
      )}
    </div>
  )
}
