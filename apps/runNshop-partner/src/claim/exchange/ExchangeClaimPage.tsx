'use client'
import { useState } from 'react'
import { type ExchangeClaim, type ExchangeStatus, MOCK_EXCHANGE_CLAIMS } from './mockData'
import { ExchangeStatusBadge } from './ExchangeStatusBadge'
import { Pagination } from '@/shell/shared/Pagination'
import ExchangeClaimDetail from './ExchangeClaimDetail'

const STATUS_OPTIONS: Array<{ label: string; value: ExchangeStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '접수', value: 'REQUESTED' },
  { label: '재고 확인', value: 'STOCK_CHECKED' },
  { label: '수거 등록', value: 'PICKUP_REGISTERED' },
  { label: '수거 완료', value: 'PICKUP_DONE' },
  { label: '출고 완료', value: 'SHIPPED' },
]

export default function ExchangeClaimPage() {
  const [claims, setClaims] = useState<ExchangeClaim[]>(MOCK_EXCHANGE_CLAIMS)
  const [statusFilter, setStatusFilter] = useState<ExchangeStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<ExchangeClaim[]>(MOCK_EXCHANGE_CLAIMS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedClaimNo, setSelectedClaimNo] = useState<string | null>(null)

  const selectedClaim = claims.find((c) => c.claim_no === selectedClaimNo) ?? null

  function handleSearch() {
    let result = claims
    if (statusFilter !== 'ALL') result = result.filter((c) => c.status === statusFilter)
    if (keyword) {
      result = result.filter((c) =>
        c.claim_no.includes(keyword) ||
        c.platform_order_no.includes(keyword) ||
        c.product_name.includes(keyword) ||
        c.customer_name.includes(keyword))
    }
    setDisplayed(result)
    setPage(1)
  }

  function updateClaim(claimNo: string, updater: (c: ExchangeClaim) => ExchangeClaim) {
    setClaims((prev) => prev.map((c) => (c.claim_no === claimNo ? updater(c) : c)))
    setDisplayed((prev) => prev.map((c) => (c.claim_no === claimNo ? updater(c) : c)))
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const requested = displayed.filter((c) => c.status === 'REQUESTED').length
  const inProgress = displayed.filter((c) => c.status === 'STOCK_CHECKED' || c.status === 'PICKUP_REGISTERED' || c.status === 'PICKUP_DONE').length
  const shipped = displayed.filter((c) => c.status === 'SHIPPED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">교환 목록</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ExchangeStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
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
          <div className="summary-card summary-card--warn"><div className="summary-card__label">처리중</div><div className="summary-card__count">{inProgress}</div></div>
          <div className="summary-card"><div className="summary-card__label">출고 완료</div><div className="summary-card__count">{shipped}</div></div>
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
                <th>교환 옵션</th>
                <th>고객명</th>
                <th>교환사유</th>
                <th>상태</th>
                <th>접수일시</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <tr key={c.claim_no} onClick={() => setSelectedClaimNo(c.claim_no)}>
                  <td className="link-cell">{c.claim_no}</td>
                  <td>{c.platform_order_no}</td>
                  <td>{c.product_name}</td>
                  <td>{c.from_option} → {c.to_option}</td>
                  <td>{c.customer_name}</td>
                  <td>{c.reason}</td>
                  <td><ExchangeStatusBadge status={c.status} /></td>
                  <td>{c.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 교환 건이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selectedClaim && (
        <ExchangeClaimDetail
          claim={selectedClaim}
          onClose={() => setSelectedClaimNo(null)}
          onUpdate={(updater) => updateClaim(selectedClaim.claim_no, updater)}
        />
      )}
    </div>
  )
}
