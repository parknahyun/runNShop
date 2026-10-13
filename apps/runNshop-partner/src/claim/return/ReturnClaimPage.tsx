'use client'
import { useState } from 'react'
import { type ReturnClaim, type ReturnStatus, type BlameType, MOCK_RETURN_CLAIMS } from './mockData'
import { ReturnStatusBadge, BlameBadge } from './ReturnStatusBadge'
import { Pagination } from '@/shell/shared/Pagination'
import ReturnClaimDetail from './ReturnClaimDetail'

const STATUS_OPTIONS: Array<{ label: string; value: ReturnStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '접수', value: 'REQUESTED' },
  { label: '수거 등록', value: 'PICKUP_REGISTERED' },
  { label: '수거 완료', value: 'PICKUP_DONE' },
  { label: '재고 복구', value: 'STOCK_RESTORED' },
  { label: '완료', value: 'COMPLETED' },
]

const BLAME_OPTIONS: Array<{ label: string; value: BlameType | 'ALL' }> = [
  { label: '전체 귀책', value: 'ALL' },
  { label: '고객 귀책', value: 'CUSTOMER' },
  { label: '판매자 귀책', value: 'VENDOR' },
  { label: '플랫폼 귀책', value: 'PLATFORM' },
  { label: '귀책 판정중', value: 'PENDING' },
]

export default function ReturnClaimPage() {
  const [claims, setClaims] = useState<ReturnClaim[]>(MOCK_RETURN_CLAIMS)
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'ALL'>('ALL')
  const [blameFilter, setBlameFilter] = useState<BlameType | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<ReturnClaim[]>(MOCK_RETURN_CLAIMS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedClaimNo, setSelectedClaimNo] = useState<string | null>(null)

  const selectedClaim = claims.find((c) => c.claim_no === selectedClaimNo) ?? null

  function handleSearch() {
    let result = claims
    if (statusFilter !== 'ALL') result = result.filter((c) => c.status === statusFilter)
    if (blameFilter !== 'ALL') result = result.filter((c) => c.blame_type === blameFilter)
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

  function updateClaim(claimNo: string, updater: (c: ReturnClaim) => ReturnClaim) {
    setClaims((prev) => prev.map((c) => (c.claim_no === claimNo ? updater(c) : c)))
    setDisplayed((prev) => prev.map((c) => (c.claim_no === claimNo ? updater(c) : c)))
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const requested = displayed.filter((c) => c.status === 'REQUESTED').length
  const inProgress = displayed.filter((c) => c.status === 'PICKUP_REGISTERED' || c.status === 'PICKUP_DONE' || c.status === 'STOCK_RESTORED').length
  const completed = displayed.filter((c) => c.status === 'COMPLETED').length
  const disputed = displayed.filter((c) => c.vendor_opinion).length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">반품 목록</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ReturnStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={blameFilter} onChange={(e) => setBlameFilter(e.target.value as BlameType | 'ALL')}>
          {BLAME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
          <div className="summary-card"><div className="summary-card__label">완료</div><div className="summary-card__count">{completed}</div></div>
          {disputed > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 이의제기</div><div className="summary-card__count">{disputed}</div></div>}
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
                <th>상품명 / 옵션</th>
                <th>고객명</th>
                <th>환불금액</th>
                <th>반품사유</th>
                <th>귀책</th>
                <th>상태</th>
                <th>접수일시</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <tr key={c.claim_no} onClick={() => setSelectedClaimNo(c.claim_no)}>
                  <td className="link-cell">{c.claim_no}</td>
                  <td>{c.platform_order_no}</td>
                  <td>{c.product_name} <span style={{ color: '#94a3b8' }}>({c.sku_option})</span></td>
                  <td>{c.customer_name}</td>
                  <td className="amount-cell">{c.refund_amount.toLocaleString()}원</td>
                  <td>{c.reason}</td>
                  <td><BlameBadge blame={c.blame_type} /></td>
                  <td><ReturnStatusBadge status={c.status} /></td>
                  <td>{c.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 반품 건이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selectedClaim && (
        <ReturnClaimDetail
          claim={selectedClaim}
          onClose={() => setSelectedClaimNo(null)}
          onUpdate={(updater) => updateClaim(selectedClaim.claim_no, updater)}
        />
      )}
    </div>
  )
}
