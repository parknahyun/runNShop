'use client'
import { useState } from 'react'
import { type ExchangeClaim } from './mockData'
import { ExchangeStatusBadge } from './ExchangeStatusBadge'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { HistoryTimeline } from '@/claim/shared/HistoryTimeline'
import { PickupForm } from '@/claim/shared/PickupForm'
import { nowTimestamp } from '@/claim/shared/format'

interface Props {
  claim: ExchangeClaim
  onClose: () => void
  onUpdate: (updater: (c: ExchangeClaim) => ExchangeClaim) => void
}

export default function ExchangeClaimDetail({ claim, onClose, onUpdate }: Props) {
  const [showPickupForm, setShowPickupForm] = useState(false)

  function checkStock() {
    if (!window.confirm('재고를 확인 처리하시겠습니까?')) return
    onUpdate((c) => ({
      ...c,
      stock_available: true,
      status: 'STOCK_CHECKED',
      history: [...c.history, { at: nowTimestamp(), action: '재고 확인', memo: '재고 있음' }],
    }))
  }

  function registerPickup(company: string, trackingNo: string) {
    onUpdate((c) => ({
      ...c,
      pickup_company: company,
      pickup_tracking_no: trackingNo,
      status: 'PICKUP_REGISTERED',
      history: [...c.history, { at: nowTimestamp(), action: '수거 운송장 등록', memo: `${company} / ${trackingNo}` }],
    }))
    setShowPickupForm(false)
  }

  function confirmPickupDone() {
    if (!window.confirm('수거 완료로 처리하시겠습니까?')) return
    onUpdate((c) => ({
      ...c,
      status: 'PICKUP_DONE',
      history: [...c.history, { at: nowTimestamp(), action: '수거 완료 처리' }],
    }))
  }

  function shipExchange() {
    if (!window.confirm('교환 출고 처리하시겠습니까? 처리 후에는 되돌릴 수 없습니다.')) return
    onUpdate((c) => ({
      ...c,
      status: 'SHIPPED',
      history: [...c.history, { at: nowTimestamp(), action: '교환 출고 처리' }],
    }))
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{claim.claim_no}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <ExchangeStatusBadge status={claim.status} />
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
        {showPickupForm ? (
          <div style={{ padding: '0 24px 14px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <PickupForm onSubmit={registerPickup} onCancel={() => setShowPickupForm(false)} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {claim.status === 'REQUESTED' && (
                <button className="btn-tool btn-tool--add" onClick={checkStock}>재고 확인</button>
              )}
              {claim.status === 'STOCK_CHECKED' && claim.stock_available && (
                <button className="btn-tool btn-tool--add" onClick={() => setShowPickupForm(true)}>수거 운송장 등록</button>
              )}
              {claim.status === 'PICKUP_REGISTERED' && (
                <button className="btn-tool btn-tool--add" onClick={confirmPickupDone}>수거 완료 처리</button>
              )}
              {claim.status === 'PICKUP_DONE' && (
                <button className="btn-tool btn-tool--add" onClick={shipExchange}>교환 출고 처리</button>
              )}
              {claim.status === 'SHIPPED' && (
                <span style={{ fontSize: 12, color: '#94a3b8' }}>교환 처리가 완료되었습니다.</span>
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

function BasicInfoTab({ claim }: { claim: ExchangeClaim }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">기본 정보</h2>
        <div className="info-grid">
          <dl className="info-dl">
            <div className="info-row"><dt>클레임번호</dt><dd>{claim.claim_no}</dd></div>
            <div className="info-row"><dt>주문번호</dt><dd>{claim.platform_order_no}</dd></div>
            <div className="info-row"><dt>상품명</dt><dd>{claim.product_name}</dd></div>
            <div className="info-row"><dt>고객명</dt><dd>{claim.customer_name}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>교환 옵션</dt><dd>{claim.from_option} → {claim.to_option}</dd></div>
            <div className="info-row"><dt>교환사유</dt><dd>{claim.reason}</dd></div>
            <div className="info-row"><dt>재고 확인</dt><dd>{claim.stock_available === null ? '미확인' : claim.stock_available ? '재고 있음' : '재고 없음'}</dd></div>
            <div className="info-row"><dt>상태</dt><dd><ExchangeStatusBadge status={claim.status} /></dd></div>
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
    </div>
  )
}
