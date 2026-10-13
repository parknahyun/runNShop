'use client'
import { type Settlement, ADJUSTMENT_TYPE_LABEL } from '../mockData'

export default function AdjustmentsTab({ settlement }: { settlement: Settlement }) {
  return (
    <div className="tab-panel-content">
      {settlement.adjustments.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">재정산 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>유형</th>
                <th>재정산금액</th>
                <th>사유</th>
                <th>발생일시</th>
              </tr>
            </thead>
            <tbody>
              {settlement.adjustments.map((adj, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>{ADJUSTMENT_TYPE_LABEL[adj.adjustmentType]}</td>
                  <td className="amount-cell">{adj.adjustmentAmount.toLocaleString()}원</td>
                  <td>{adj.reason}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{adj.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
