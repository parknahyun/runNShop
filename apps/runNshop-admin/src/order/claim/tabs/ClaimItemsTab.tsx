'use client'
import { type Claim } from '../mockData'

export default function ClaimItemsTab({ claim }: { claim: Claim }) {
  return (
    <div className="tab-panel-content">
      {claim.items.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">클레임 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>주문상품ID</th>
                <th>상품명</th>
                <th>수량</th>
                <th>환불금액</th>
                <th>교환옵션</th>
                <th>재고복구</th>
              </tr>
            </thead>
            <tbody>
              {claim.items.map((item) => (
                <tr key={item.orderItemId}>
                  <td style={{ fontSize: 12 }}>{item.orderItemId}</td>
                  <td style={{ fontWeight: 500 }}>{item.productName}</td>
                  <td style={{ fontSize: 12 }}>{item.quantity}개</td>
                  <td className="amount-cell">{item.refundAmount.toLocaleString()}원</td>
                  <td style={{ fontSize: 12 }}>{item.exchangeOption ?? '-'}</td>
                  <td style={{ fontSize: 12 }}>{item.stockRestored ? '완료' : '대기'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
