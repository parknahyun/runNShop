'use client'
import { type Order } from '../mockData'

export default function PaymentInfoTab({ order }: { order: Order }) {
  const discount = Math.round(order.amount * 0.15)
  const shipping = order.amount >= 50000 ? 0 : 3000

  return (
    <div className="tab-panel-content">
      <div className="info-grid">
        <dl className="info-dl">
          <div className="info-row"><dt>상품 합계</dt><dd>{(order.amount + discount).toLocaleString()}원</dd></div>
          <div className="info-row"><dt>할인 금액</dt><dd className="amount-discount">−{discount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>배송비</dt><dd>{shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</dd></div>
          <div className="info-row info-row--total"><dt>실결제금액</dt><dd>{order.amount.toLocaleString()}원</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>결제수단</dt><dd>신용카드</dd></div>
          <div className="info-row"><dt>PG사</dt><dd>토스페이먼츠</dd></div>
          <div className="info-row"><dt>거래 ID</dt><dd>TXN-{order.platformOrderNo.slice(-7)}</dd></div>
          <div className="info-row"><dt>결제 일시</dt><dd>{order.orderDate}</dd></div>
        </dl>
      </div>
    </div>
  )
}
