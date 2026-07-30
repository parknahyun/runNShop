'use client'
import { type Member } from '../mockData'

export default function OrdersTab({ member }: { member: Member }) {
  return (
    <div className="tab-panel-content">
      {member.orders.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>상품명</th>
                <th>결제금액</th>
                <th>상태</th>
                <th>주문일시</th>
              </tr>
            </thead>
            <tbody>
              {member.orders.map((o) => (
                <tr key={o.orderId}>
                  <td style={{ fontSize: 12 }}>{o.platformOrderNo}</td>
                  <td style={{ fontWeight: 500 }}>{o.productName}</td>
                  <td className="amount-cell">{o.amount.toLocaleString()}원</td>
                  <td style={{ fontSize: 12 }}>{o.status}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{o.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
