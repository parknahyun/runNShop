'use client'
import { type CancelClaim, CANCEL_STATUS_LABEL } from './mockData'

interface Props {
  claim: CancelClaim
  onClose: () => void
}

// 취소는 벤더 액션이 없는 조회 전용 화면이므로 탭 없이 단일 정보 섹션으로 구성한다.
export default function CancelClaimDetail({ claim, onClose }: Props) {
  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{claim.claim_no}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span className="badge" data-cancel-status={claim.status}>{CANCEL_STATUS_LABEL[claim.status]}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>주문번호 {claim.platform_order_no}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body" style={{ overflowY: 'auto' }}>
          <div className="tab-panel-content">
            <section className="detail-section" style={{ marginTop: 0 }}>
              <h2 className="section-title">취소 정보</h2>
              <div className="info-grid">
                <dl className="info-dl">
                  <div className="info-row"><dt>클레임번호</dt><dd>{claim.claim_no}</dd></div>
                  <div className="info-row"><dt>주문번호</dt><dd>{claim.platform_order_no}</dd></div>
                  <div className="info-row"><dt>상품명</dt><dd>{claim.product_name}</dd></div>
                  <div className="info-row"><dt>고객명</dt><dd>{claim.customer_name}</dd></div>
                </dl>
                <dl className="info-dl">
                  <div className="info-row"><dt>환불금액</dt><dd className="amount-cell">{claim.refund_amount.toLocaleString()}원</dd></div>
                  <div className="info-row"><dt>취소사유</dt><dd>{claim.reason}</dd></div>
                  <div className="info-row"><dt>상태</dt><dd><span className="badge" data-cancel-status={claim.status}>{CANCEL_STATUS_LABEL[claim.status]}</span></dd></div>
                  <div className="info-row"><dt>접수일시</dt><dd>{claim.created_at}</dd></div>
                  <div className="info-row"><dt>완료일시</dt><dd>{claim.completed_at ?? '-'}</dd></div>
                </dl>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
                ※ 취소 건은 배송 시작 전 플랫폼이 자동으로 처리하며, 벤더가 별도로 처리할 작업은 없습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
