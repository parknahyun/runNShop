'use client'
import { type Order } from '../mockData'

export default function ShippingInfoTab({ order }: { order: Order }) {
  return (
    <div className="tab-panel-content">
      <dl className="info-dl">
        <div className="info-row"><dt>수령인</dt><dd>{order.customer}</dd></div>
        <div className="info-row"><dt>연락처</dt><dd>010-****-5678</dd></div>
        <div className="info-row"><dt>주소</dt><dd>[06234] 서울특별시 강남구 테헤란로 123 런앤샵타워 5층</dd></div>
        <div className="info-row"><dt>배송 메모</dt><dd>부재 시 문 앞에 놓아주세요</dd></div>
      </dl>
      <section className="detail-section">
        <h2 className="section-title">배송 추적</h2>
        <dl className="info-dl">
          <div className="info-row"><dt>배송사</dt><dd>CJ대한통운</dd></div>
          <div className="info-row"><dt>운송장번호</dt><dd>1234567890</dd></div>
          <div className="info-row"><dt>출고일</dt><dd>2026.06.26</dd></div>
          <div className="info-row"><dt>배송상태</dt><dd>{order.status === 'IN_DELIVERY' ? '배송중' : order.status === 'DELIVERED' ? '배송완료' : '출고 대기'}</dd></div>
        </dl>
      </section>
    </div>
  )
}
