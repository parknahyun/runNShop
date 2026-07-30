'use client'
import {
  type Settlement,
  SETTLEMENT_STATUS_LABEL,
  SETTLEMENT_ITEM_TYPE_LABEL,
  SETTLEMENT_ADJUSTMENT_TYPE_LABEL,
} from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'

interface Props {
  settlement: Settlement
  onClose: () => void
}

function SettlementStatusBadge({ status }: { status: Settlement['status'] }) {
  return <span className="badge" data-settlement-status={status}>{SETTLEMENT_STATUS_LABEL[status]}</span>
}

export default function SettlementDetail({ settlement, onClose }: Props) {
  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{settlement.settlement_no}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{settlement.settlement_month}</span>
              <SettlementStatusBadge status={settlement.status} />
              <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>
                최종정산금액 {settlement.final_amount.toLocaleString()}원
              </span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본정보', content: <BasicInfoTab settlement={settlement} /> },
            { key: 'items', label: `정산항목 (${settlement.items.length})`, content: <ItemsTab settlement={settlement} /> },
            { key: 'adjustments', label: `재정산내역 (${settlement.adjustments.length})`, content: <AdjustmentsTab settlement={settlement} /> },
          ]} />
        </div>
      </div>
    </div>
  )
}

function BasicInfoTab({ settlement }: { settlement: Settlement }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">기본 정보</h2>
        <div className="info-grid" style={{ marginTop: 12 }}>
          <dl className="info-dl">
            <div className="info-row"><dt>정산번호</dt><dd>{settlement.settlement_no}</dd></div>
            <div className="info-row"><dt>정산월</dt><dd>{settlement.settlement_month}</dd></div>
            <div className="info-row"><dt>상태</dt><dd><SettlementStatusBadge status={settlement.status} /></dd></div>
            <div className="info-row"><dt>확정일시</dt><dd>{settlement.confirmed_at ?? '-'}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>정산대상금액</dt><dd className="amount-cell">{settlement.target_amount.toLocaleString()}원</dd></div>
            <div className="info-row"><dt>조정금액</dt><dd className="amount-cell">{settlement.adjustment_amount.toLocaleString()}원</dd></div>
            <div className="info-row"><dt>페널티금액</dt><dd className="amount-cell">{settlement.penalty_amount.toLocaleString()}원</dd></div>
            <div className="info-row"><dt>최종정산금액</dt><dd className="amount-cell" style={{ fontWeight: 700 }}>{settlement.final_amount.toLocaleString()}원</dd></div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function ItemsTab({ settlement }: { settlement: Settlement }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">정산 항목</h2>
        {settlement.items.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>항목유형</th><th>내용</th><th>금액</th></tr>
              </thead>
              <tbody>
                {settlement.items.map((item, i) => (
                  <tr key={i}>
                    <td><span className="badge" data-settlement-item-type={item.item_type}>{SETTLEMENT_ITEM_TYPE_LABEL[item.item_type]}</span></td>
                    <td>{item.description}</td>
                    <td className="amount-cell">{item.amount.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="state-msg">정산 항목이 없습니다.</p>
        )}
      </section>
    </div>
  )
}

function AdjustmentsTab({ settlement }: { settlement: Settlement }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">재정산 내역</h2>
        {settlement.adjustments.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>구분</th><th>사유</th><th>조정금액</th><th>발생일시</th></tr>
              </thead>
              <tbody>
                {settlement.adjustments.map((adj, i) => (
                  <tr key={i}>
                    <td><span className="badge" data-settlement-adj-type={adj.adjustment_type}>{SETTLEMENT_ADJUSTMENT_TYPE_LABEL[adj.adjustment_type]}</span></td>
                    <td>{adj.reason}</td>
                    <td className="amount-cell">{adj.adjustment_amount.toLocaleString()}원</td>
                    <td>{adj.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="state-msg">재정산 내역이 없습니다.</p>
        )}
      </section>
    </div>
  )
}
