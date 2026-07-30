'use client'
import { useState } from 'react'
import {
  type StatsPeriod, PERIOD_LABEL, SALES_SUMMARY_BY_PERIOD,
  MOCK_SALES_TREND, MOCK_PRODUCT_RANKING, MOCK_SKU_STATUS,
} from './mockData'

const PERIOD_OPTIONS: StatsPeriod[] = ['TODAY', '7D', '30D', 'CUSTOM']

function ChangeRate({ value }: { value: number }) {
  const sign = value > 0 ? '+' : ''
  const color = value > 0 ? '#dc2626' : value < 0 ? '#2563eb' : '#64748b'
  return <span style={{ color, fontWeight: 600 }}>{sign}{value.toFixed(1)}%</span>
}

export default function SalesStatsPage() {
  const [period, setPeriod] = useState<StatsPeriod>('7D')
  const [customFrom, setCustomFrom] = useState('2026.06.09')
  const [customTo, setCustomTo] = useState('2026.07.08')

  const summary = SALES_SUMMARY_BY_PERIOD[period]
  const maxRevenue = Math.max(...MOCK_SALES_TREND.map((r) => r.revenue))

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">판매 통계</h1>
      </div>

      {/* Period Filter */}
      <div className="filter-bar">
        <select value={period} onChange={(e) => setPeriod(e.target.value as StatsPeriod)}>
          {PERIOD_OPTIONS.map((p) => <option key={p} value={p}>{PERIOD_LABEL[p]}</option>)}
        </select>
        {period === 'CUSTOM' && (
          <>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
            <span className="sep">~</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
          </>
        )}
        <button className="btn-search" onClick={() => alert('조회되었습니다.')}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* Summary */}
        <div className="summary-bar">
          <div className="summary-card">
            <div className="summary-card__label">총 매출</div>
            <div className="summary-card__count">{summary.total_revenue.toLocaleString()}원</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__label">총 판매량</div>
            <div className="summary-card__count">{summary.total_qty.toLocaleString()}개</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__label">평균 객단가</div>
            <div className="summary-card__count">{summary.avg_order_amount.toLocaleString()}원</div>
          </div>
          <div className={`summary-card${summary.change_rate < 0 ? ' summary-card--warn' : ''}`}>
            <div className="summary-card__label">전기간 대비</div>
            <div className="summary-card__count"><ChangeRate value={summary.change_rate} /></div>
          </div>
        </div>

        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>판매 엑셀 다운로드</button>
          </div>
        </div>
      </div>

      {/* 판매 추이 */}
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">판매 추이 (일별)</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>날짜</th><th>매출</th><th style={{ width: '40%' }}></th><th>판매량</th></tr></thead>
            <tbody>
              {MOCK_SALES_TREND.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td className="amount-cell">{row.revenue.toLocaleString()}원</td>
                  <td>
                    <div style={{ background: '#f1f5f9', borderRadius: 4, height: 10, width: '100%' }}>
                      <div style={{ background: '#2563eb', borderRadius: 4, height: 10, width: `${(row.revenue / maxRevenue) * 100}%` }} />
                    </div>
                  </td>
                  <td>{row.qty.toLocaleString()}개</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 상품별 순위 */}
      <section className="detail-section">
        <h2 className="section-title">상품별 순위</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>순위</th><th>상품명</th><th>판매량</th><th>매출</th><th>전기간 대비</th></tr></thead>
            <tbody>
              {MOCK_PRODUCT_RANKING.map((row) => (
                <tr key={row.rank}>
                  <td>{row.rank}</td>
                  <td>{row.product_name}</td>
                  <td>{row.qty.toLocaleString()}개</td>
                  <td className="amount-cell">{row.revenue.toLocaleString()}원</td>
                  <td><ChangeRate value={row.change_rate} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SKU별 현황 */}
      <section className="detail-section">
        <h2 className="section-title">SKU별 현황</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>SKU ID</th><th>상품명</th><th>옵션</th><th>재고</th><th>판매량</th><th>매출</th></tr></thead>
            <tbody>
              {MOCK_SKU_STATUS.map((row) => (
                <tr key={row.sku_id}>
                  <td>{row.sku_id}</td>
                  <td>{row.product_name}</td>
                  <td>{row.option}</td>
                  <td>{row.stock === 0 ? <span style={{ color: '#dc2626' }}>품절</span> : `${row.stock}개`}</td>
                  <td>{row.qty.toLocaleString()}개</td>
                  <td className="amount-cell">{row.revenue.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
