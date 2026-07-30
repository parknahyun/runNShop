'use client'
import { type Order, ORDER_STATUS_LABEL } from '../mockData'

export default function OrderItemsTab({ order }: { order: Order }) {
  return (
    <div className="tab-panel-content">
      <div className="order-meta">
        <span className="badge" data-order-status={order.status}>{ORDER_STATUS_LABEL[order.status]}</span>
        <span className="order-meta__date">주문 일시 {order.orderDate}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>상품명</th>
              <th>옵션</th>
              <th>수량</th>
              <th>단가</th>
              <th>소계</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{order.productName}</td>
              <td>블랙 / 265</td>
              <td>1</td>
              <td className="amount-cell">{order.amount.toLocaleString()}원</td>
              <td className="amount-cell">{order.amount.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
