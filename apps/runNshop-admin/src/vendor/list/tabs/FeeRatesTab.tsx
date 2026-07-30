'use client'
import { type Vendor } from '../mockData'

export default function FeeRatesTab({ vendor }: { vendor: Vendor }) {
  return (
    <div className="tab-panel-content">
      {vendor.feeRates.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 수수료율이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>기본수수료율</th>
                <th>등급할인율</th>
                <th>최종수수료율</th>
                <th>적용시작일</th>
              </tr>
            </thead>
            <tbody>
              {vendor.feeRates.map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{f.categoryName}</td>
                  <td className="amount-cell">{f.baseFeeRate.toFixed(1)}%</td>
                  <td className="amount-cell">{f.gradeDiscountRate.toFixed(1)}%</td>
                  <td className="amount-cell" style={{ fontWeight: 600 }}>{f.finalFeeRate.toFixed(1)}%</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{f.effectiveFrom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
