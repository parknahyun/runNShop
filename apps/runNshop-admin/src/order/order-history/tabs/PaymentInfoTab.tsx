'use client'
import { type OrderDetailData } from '../mockData'

export default function PaymentInfoTab({ order }: { order: OrderDetailData }) {
  return (
    <div className="tab-panel-content">
      <div className="info-grid">
        <dl className="info-dl">
          <div className="info-row info-row--total"><dt>실결제금액</dt><dd>{order.amount.toLocaleString()}원</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>결제수단</dt><dd>{order.payment.method}</dd></div>
          <div className="info-row"><dt>PG사</dt><dd>{order.payment.pgProvider}</dd></div>
          <div className="info-row"><dt>거래 ID</dt><dd>{order.payment.transactionId}</dd></div>
          <div className="info-row"><dt>결제 일시</dt><dd>{order.payment.paidAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
