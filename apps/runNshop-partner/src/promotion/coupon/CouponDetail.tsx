'use client'
import { type VendorCoupon, COUPON_STATUS_LABEL, DISCOUNT_TYPE_LABEL, formatDiscountValue } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'

interface Props {
  coupon: VendorCoupon
  onClose: () => void
  onDeactivate: (couponId: string) => void
}

function CouponStatusBadge({ status }: { status: VendorCoupon['status'] }) {
  return <span className="badge" data-coupon-status={status}>{COUPON_STATUS_LABEL[status]}</span>
}

export default function CouponDetail({ coupon, onClose, onDeactivate }: Props) {
  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{coupon.coupon_name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>#{coupon.coupon_id}</span>
              <CouponStatusBadge status={coupon.status} />
              <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>{formatDiscountValue(coupon)} 할인</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본정보', content: <BasicInfoTab coupon={coupon} onDeactivate={onDeactivate} /> },
          ]} />
        </div>
      </div>
    </div>
  )
}

function BasicInfoTab({ coupon, onDeactivate }: { coupon: VendorCoupon; onDeactivate: (couponId: string) => void }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>쿠폰 정보</h2>
          {coupon.status === 'ACTIVE' && (
            <button className="btn-tool btn-tool--delete" style={{ height: 28, padding: '0 10px', fontSize: 12 }}
              onClick={() => { if (window.confirm('쿠폰을 비활성화하시겠습니까? 되돌릴 수 없습니다.')) onDeactivate(coupon.coupon_id) }}>비활성화</button>
          )}
        </div>

        <div className="info-grid" style={{ marginTop: 12 }}>
          <dl className="info-dl">
            <div className="info-row"><dt>쿠폰ID</dt><dd>{coupon.coupon_id}</dd></div>
            <div className="info-row"><dt>쿠폰명</dt><dd>{coupon.coupon_name}</dd></div>
            <div className="info-row"><dt>할인유형</dt><dd>{DISCOUNT_TYPE_LABEL[coupon.discount_type]}</dd></div>
            <div className="info-row"><dt>할인값</dt><dd>{formatDiscountValue(coupon)}</dd></div>
            <div className="info-row"><dt>최소주문금액</dt><dd>{coupon.min_order_amount.toLocaleString()}원</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>상태</dt><dd><CouponStatusBadge status={coupon.status} /></dd></div>
            <div className="info-row"><dt>발급한도</dt><dd>{coupon.issue_limit === null ? '무제한' : `${coupon.issue_limit.toLocaleString()}매`}</dd></div>
            <div className="info-row"><dt>발급수량</dt><dd>{coupon.issued_count.toLocaleString()}매</dd></div>
            <div className="info-row"><dt>유효기간</dt><dd>{coupon.valid_from} ~ {coupon.valid_to}</dd></div>
            <div className="info-row"><dt>최종수정</dt><dd>{coupon.updated_at}</dd></div>
          </dl>
        </div>

        {coupon.status === 'REJECTED' && coupon.reject_reason && (
          <div style={{ marginTop: 16, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
            <strong style={{ fontSize: 12, color: '#dc2626' }}>반려 사유</strong>
            <p style={{ fontSize: 13, color: '#7f1d1d', marginTop: 4 }}>{coupon.reject_reason}</p>
          </div>
        )}
        {coupon.status === 'PENDING_APPROVAL' && (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 16 }}>※ MD 승인 대기 중인 쿠폰입니다. 승인 완료 후 고객에게 노출됩니다.</p>
        )}
      </section>
    </div>
  )
}
