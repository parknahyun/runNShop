'use client'
import { useState } from 'react'
import {
  type StatsPeriod, PERIOD_LABEL, CLAIM_SUMMARY_BY_PERIOD,
  MOCK_CLAIM_TREND, MOCK_CLAIM_TYPE, MOCK_CLAIM_RESPONSIBILITY, MOCK_CLAIM_PRODUCT,
} from './mockData'

const PERIOD_OPTIONS: StatsPeriod[] = ['TODAY', '7D', '30D', 'CUSTOM']

export default function ClaimStatsPage() {
  const [period, setPeriod] = useState<StatsPeriod>('7D')
  const [customFrom, setCustomFrom] = useState('2026.06.09')
  const [customTo, setCustomTo] = useState('2026.07.08')

  const summary = CLAIM_SUMMARY_BY_PERIOD[period]
  const maxTrendCount = Math.max(...MOCK_CLAIM_TREND.map((r) => r.count))

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">클레임 통계</h1>
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
            <div className="summary-card__label">전체 클레임 건수</div>
            <div className="summary-card__count">{summary.total_claim_count.toLocaleString()}건</div>
          </div>
          <div className="summary-card summary-card--warn">
            <div className="summary-card__label">클레임율</div>
            <div className="summary-card__count">{summary.claim_rate.toFixed(1)}%</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__label">반품 건수</div>
            <div className="summary-card__count">{summary.return_count.toLocaleString()}건</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__label">교환 건수</div>
            <div className="summary-card__count">{summary.exchange_count.toLocaleString()}건</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__label">취소 건수</div>
            <div className="summary-card__count">{summary.cancel_count.toLocaleString()}건</div>
          </div>
        </div>

        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>클레임 엑셀 다운로드</button>
          </div>
        </div>
      </div>

      {/* 클레임 추이 */}
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">클레임 추이 (일별)</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>날짜</th><th>건수</th><th style={{ width: '50%' }}></th></tr></thead>
            <tbody>
              {MOCK_CLAIM_TREND.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.count.toLocaleString()}건</td>
                  <td>
                    <div style={{ background: '#f1f5f9', borderRadius: 4, height: 10, width: '100%' }}>
                      <div style={{ background: '#f97316', borderRadius: 4, height: 10, width: `${(row.count / maxTrendCount) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 유형별 비율 */}
      <section className="detail-section">
        <h2 className="section-title">유형별 비율</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>유형</th><th style={{ width: '50%' }}>비율</th><th>건수</th></tr></thead>
            <tbody>
              {MOCK_CLAIM_TYPE.map((row) => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ background: '#f1f5f9', borderRadius: 4, height: 10, flex: 1 }}>
                        <div style={{ background: '#64748b', borderRadius: 4, height: 10, width: `${row.pct}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#475569', minWidth: 42, textAlign: 'right' }}>{row.pct.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>{row.count.toLocaleString()}건</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 귀책별 현황 */}
      <section className="detail-section">
        <h2 className="section-title">귀책별 현황</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>귀책</th><th style={{ width: '50%' }}>비율</th><th>건수</th></tr></thead>
            <tbody>
              {MOCK_CLAIM_RESPONSIBILITY.map((row) => {
                const isVendorFault = row.responsibility === '입점사귀책'
                return (
                  <tr key={row.responsibility} style={isVendorFault ? { background: '#fef2f2' } : undefined}>
                    <td style={isVendorFault ? { color: '#dc2626', fontWeight: 700 } : undefined}>{row.responsibility}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ background: '#f1f5f9', borderRadius: 4, height: 10, flex: 1 }}>
                          <div style={{ background: isVendorFault ? '#dc2626' : '#94a3b8', borderRadius: 4, height: 10, width: `${row.pct}%` }} />
                        </div>
                        <span style={{ fontSize: 12, color: isVendorFault ? '#dc2626' : '#475569', fontWeight: isVendorFault ? 700 : 400, minWidth: 42, textAlign: 'right' }}>{row.pct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={isVendorFault ? { color: '#dc2626', fontWeight: 700 } : undefined}>{row.count.toLocaleString()}건</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 상품별 현황 */}
      <section className="detail-section">
        <h2 className="section-title">상품별 현황</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>상품명</th><th>클레임 건수</th><th>클레임율</th></tr></thead>
            <tbody>
              {MOCK_CLAIM_PRODUCT.map((row) => (
                <tr key={row.product_name}>
                  <td>{row.product_name}</td>
                  <td>{row.claim_count.toLocaleString()}건</td>
                  <td style={row.claim_rate >= 10 ? { color: '#dc2626', fontWeight: 600 } : undefined}>{row.claim_rate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
