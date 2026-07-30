'use client'
import { type QuantityDiscount, QTY_DISCOUNT_STATUS_LABEL } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'

interface Props {
  discount: QuantityDiscount
  onClose: () => void
  onEnd: (discountId: string) => void
}

function QtyDiscountStatusBadge({ status }: { status: QuantityDiscount['status'] }) {
  return <span className="badge" data-qty-status={status}>{QTY_DISCOUNT_STATUS_LABEL[status]}</span>
}

export default function QuantityDiscountDetail({ discount, onClose, onEnd }: Props) {
  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{discount.event_name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>#{discount.discount_id}</span>
              <QtyDiscountStatusBadge status={discount.status} />
              <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>{discount.product_name}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본정보', content: <BasicInfoTab discount={discount} onEnd={onEnd} /> },
            { key: 'tiers', label: '구간설정', content: <TiersTab discount={discount} /> },
          ]} />
        </div>
      </div>
    </div>
  )
}

function BasicInfoTab({ discount, onEnd }: { discount: QuantityDiscount; onEnd: (discountId: string) => void }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>기본 정보</h2>
          {discount.status === 'ACTIVE' && (
            <button className="btn-tool btn-tool--delete" style={{ height: 28, padding: '0 10px', fontSize: 12 }}
              onClick={() => { if (window.confirm('수량할인을 종료하시겠습니까? 되돌릴 수 없습니다.')) onEnd(discount.discount_id) }}>종료</button>
          )}
        </div>

        <div className="info-grid" style={{ marginTop: 12 }}>
          <dl className="info-dl">
            <div className="info-row"><dt>행사ID</dt><dd>{discount.discount_id}</dd></div>
            <div className="info-row"><dt>행사명</dt><dd>{discount.event_name}</dd></div>
            <div className="info-row"><dt>적용상품</dt><dd>{discount.product_name}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>상태</dt><dd><QtyDiscountStatusBadge status={discount.status} /></dd></div>
            <div className="info-row"><dt>진행기간</dt><dd>{discount.start_at} ~ {discount.end_at}</dd></div>
            <div className="info-row"><dt>최종수정</dt><dd>{discount.updated_at}</dd></div>
          </dl>
        </div>

        {discount.status === 'REJECTED' && discount.reject_reason && (
          <div style={{ marginTop: 16, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
            <strong style={{ fontSize: 12, color: '#dc2626' }}>반려 사유</strong>
            <p style={{ fontSize: 13, color: '#7f1d1d', marginTop: 4 }}>{discount.reject_reason}</p>
          </div>
        )}
        {discount.status === 'PENDING_APPROVAL' && (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 16 }}>※ MD 승인 대기 중인 수량할인입니다. 승인 완료 후 고객에게 노출됩니다.</p>
        )}
      </section>
    </div>
  )
}

function TiersTab({ discount }: { discount: QuantityDiscount }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">구간설정</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>구간</th><th>최소수량</th><th>할인율</th></tr></thead>
            <tbody>
              {discount.tiers.map((tier, i) => (
                <tr key={i}>
                  <td>{i + 1}구간</td>
                  <td>{tier.min_qty}개 이상</td>
                  <td>{tier.discount_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
