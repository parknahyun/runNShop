'use client'
import { type OrderDetailData } from '../mockData'

export default function ShippingInfoTab({ order }: { order: OrderDetailData }) {
  return (
    <div className="tab-panel-content">
      <dl className="info-dl">
        <div className="info-row"><dt>수령인</dt><dd>{order.shipping.recipientName}</dd></div>
        <div className="info-row"><dt>연락처</dt><dd>{order.shipping.phone}</dd></div>
        <div className="info-row"><dt>주소</dt><dd>{order.shipping.address}</dd></div>
      </dl>
      <section className="detail-section">
        <h2 className="section-title">배송 추적</h2>
        <dl className="info-dl">
          <div className="info-row"><dt>배송사</dt><dd>{order.shipping.carrier}</dd></div>
          <div className="info-row"><dt>운송장번호</dt><dd>{order.shipping.trackingNumber}</dd></div>
          <div className="info-row"><dt>배송상태</dt><dd>{order.status === 'IN_DELIVERY' ? '배송중' : order.status === 'DELIVERED' ? '배송완료' : '출고 대기'}</dd></div>
        </dl>
      </section>
    </div>
  )
}
