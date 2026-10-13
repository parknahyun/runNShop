'use client'
import { useState } from 'react'
import { type Settlement, type SettlementStatus, SETTLEMENT_STATUS_LABEL, MOCK_SETTLEMENTS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import SettlementDetail from './SettlementDetail'

const STATUS_OPTIONS: Array<{ label: string; value: SettlementStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...(Object.entries(SETTLEMENT_STATUS_LABEL) as Array<[SettlementStatus, string]>).map(([value, label]) => ({ label, value })),
]

function SettlementStatusBadge({ status }: { status: SettlementStatus }) {
  return <span className="badge" data-settlement-status={status}>{SETTLEMENT_STATUS_LABEL[status]}</span>
}

export default function SettlementListPage() {
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | 'ALL'>('ALL')
  const [monthFrom, setMonthFrom] = useState('')
  const [monthTo, setMonthTo] = useState('')
  const [displayed, setDisplayed] = useState<Settlement[]>(MOCK_SETTLEMENTS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<Settlement | null>(null)

  function handleSearch() {
    let result = MOCK_SETTLEMENTS
    if (statusFilter !== 'ALL') result = result.filter((s) => s.status === statusFilter)
    if (monthFrom) result = result.filter((s) => s.settlement_month >= monthFrom)
    if (monthTo) result = result.filter((s) => s.settlement_month <= monthTo)
    setDisplayed(result)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const totalFinalAmount = displayed.reduce((sum, s) => sum + s.final_amount, 0)
  const calculating = displayed.filter((s) => s.status === 'CALCULATING').length
  const confirmed = displayed.filter((s) => s.status === 'CONFIRMED').length
  const paid = displayed.filter((s) => s.status === 'PAID').length
  const hold = displayed.filter((s) => s.status === 'HOLD').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">정산 목록</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <input type="month" value={monthFrom} onChange={(e) => setMonthFrom(e.target.value)} />
        <span className="sep">~</span>
        <input type="month" value={monthTo} onChange={(e) => setMonthTo(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SettlementStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}건</div></div>
          <div className="summary-card"><div className="summary-card__label">최종정산금액 합계</div><div className="summary-card__count">{totalFinalAmount.toLocaleString()}원</div></div>
          {calculating > 0 && <div className="summary-card summary-card--info"><div className="summary-card__label">정산중</div><div className="summary-card__count">{calculating}</div></div>}
          {confirmed > 0 && <div className="summary-card"><div className="summary-card__label">확정</div><div className="summary-card__count">{confirmed}</div></div>}
          {paid > 0 && <div className="summary-card"><div className="summary-card__label">지급완료</div><div className="summary-card__count">{paid}</div></div>}
          {hold > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 보류</div><div className="summary-card__count">{hold}</div></div>}
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>정산번호</th>
                <th>정산월</th>
                <th>상태</th>
                <th>정산대상금액</th>
                <th>조정금액</th>
                <th>페널티금액</th>
                <th>최종정산금액</th>
                <th>확정일시</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((s) => (
                <tr key={s.settlement_no} onClick={() => setSelected(s)}>
                  <td className="link-cell">{s.settlement_no}</td>
                  <td>{s.settlement_month}</td>
                  <td><SettlementStatusBadge status={s.status} /></td>
                  <td className="amount-cell">{s.target_amount.toLocaleString()}원</td>
                  <td className="amount-cell">{s.adjustment_amount.toLocaleString()}원</td>
                  <td className="amount-cell">{s.penalty_amount.toLocaleString()}원</td>
                  <td className="amount-cell" style={{ fontWeight: 600 }}>{s.final_amount.toLocaleString()}원</td>
                  <td>{s.confirmed_at ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 정산 내역이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selected && <SettlementDetail settlement={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
