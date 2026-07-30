'use client'
import { type Settlement, SETTLEMENT_ITEM_TYPE_LABEL } from '../mockData'

export default function SettlementItemsTab({ settlement }: { settlement: Settlement }) {
  return (
    <div className="tab-panel-content">
      {settlement.items.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">정산항목이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th>금액</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              {settlement.items.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>{SETTLEMENT_ITEM_TYPE_LABEL[item.itemType]}</td>
                  <td className="amount-cell">{item.amount.toLocaleString()}원</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
