'use client'
import { useState } from 'react'
import { type CancelClaim, type CancelStatus, CANCEL_STATUS_LABEL, MOCK_CANCEL_CLAIMS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import CancelClaimDetail from './CancelClaimDetail'

const STATUS_OPTIONS: Array<{ label: string; value: CancelStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '접수', value: 'REQUESTED' },
  { label: '완료', value: 'COMPLETED' },
]

export default function CancelClaimPage() {
  const [statusFilter, setStatusFilter] = useState<CancelStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [displayed, setDisplayed] = useState<CancelClaim[]>(MOCK_CANCEL_CLAIMS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedClaim, setSelectedClaim] = useState<CancelClaim | null>(null)

  function handleSearch() {
    let result = MOCK_CANCEL_CLAIMS
    if (statusFilter !== 'ALL') result = result.filter((c) => c.status === statusFilter)
    if (keyword) {
      result = result.filter((c) =>
        c.claim_no.includes(keyword) ||
        c.platform_order_no.includes(keyword) ||
        c.product_name.includes(keyword) ||
        c.customer_name.includes(keyword))
    }
    if (startDate) result = result.filter((c) => c.created_at.slice(0, 10).replaceAll('.', '-') >= startDate)
    if (endDate) result = result.filter((c) => c.created_at.slice(0, 10).replaceAll('.', '-') <= endDate)
    setDisplayed(result)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const requested = displayed.filter((c) => c.status === 'REQUESTED').length
  const completed = displayed.filter((c) => c.status === 'COMPLETED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">취소 목록</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CancelStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <span className="sep">~</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <input type="text" placeholder="클레임번호 · 주문번호 · 상품명 · 고객명" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}건</div></div>
          <div className="summary-card summary-card--info"><div className="summary-card__label">접수</div><div className="summary-card__count">{requested}</div></div>
          <div className="summary-card"><div className="summary-card__label">완료</div><div className="summary-card__count">{completed}</div></div>
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
                <th>클레임번호</th>
                <th>주문번호</th>
                <th>상품명</th>
                <th>고객명</th>
                <th>환불금액</th>
                <th>취소사유</th>
                <th>상태</th>
                <th>접수일시</th>
                <th>완료일시</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <tr key={c.claim_no} onClick={() => setSelectedClaim(c)}>
                  <td className="link-cell">{c.claim_no}</td>
                  <td>{c.platform_order_no}</td>
                  <td>{c.product_name}</td>
                  <td>{c.customer_name}</td>
                  <td className="amount-cell">{c.refund_amount.toLocaleString()}원</td>
                  <td>{c.reason}</td>
                  <td><span className="badge" data-cancel-status={c.status}>{CANCEL_STATUS_LABEL[c.status]}</span></td>
                  <td>{c.created_at}</td>
                  <td>{c.completed_at ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 취소 건이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selectedClaim && <CancelClaimDetail claim={selectedClaim} onClose={() => setSelectedClaim(null)} />}
    </div>
  )
}
