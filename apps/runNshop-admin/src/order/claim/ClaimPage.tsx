'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import ClaimDetail from './ClaimDetail'
import {
  type Claim, type ClaimType, type ClaimStatus, type BlameType, type ClaimFilter,
  CLAIM_TYPE_LABEL, CLAIM_STATUS_LABEL, BLAME_TYPE_LABEL,
  MOCK_CLAIMS, filterClaims,
} from './mockData'
import { ClaimStatusBadge } from './ClaimStatusBadge'
import { ClaimBlameBadge } from './ClaimBlameBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: Array<{ label: string; value: ClaimType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL' },
  ...Object.entries(CLAIM_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as ClaimType })),
]

const STATUS_OPTIONS: Array<{ label: string; value: ClaimStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(CLAIM_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as ClaimStatus })),
]

const BLAME_OPTIONS: Array<{ label: string; value: BlameType | 'ALL' }> = [
  { label: '전체 귀책', value: 'ALL' },
  ...Object.entries(BLAME_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as BlameType })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ClaimFilter
  onChange: (f: ClaimFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="클레임번호 · 주문번호 · 구매자명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.claimType}
        onChange={(e) => onChange({ ...filter, claimType: e.target.value as ClaimType | 'ALL' })}>
        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ClaimStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.blameType}
        onChange={(e) => onChange({ ...filter, blameType: e.target.value as BlameType | 'ALL' })}>
        {BLAME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" value={filter.from}
        onChange={(e) => onChange({ ...filter, from: e.target.value })} />
      <span className="sep">~</span>
      <input type="date" value={filter.to}
        onChange={(e) => onChange({ ...filter, to: e.target.value })} />
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Claim[] }) {
  const requested = items.filter(c => c.status === 'REQUESTED').length
  const processing = items.filter(c => c.status === 'PROCESSING').length
  const completed = items.filter(c => c.status === 'COMPLETED').length
  const rejected = items.filter(c => c.status === 'REJECTED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">접수</div>
        <div className="summary-card__count">{requested}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">처리중</div>
        <div className="summary-card__count">{processing}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">완료</div>
        <div className="summary-card__count">{completed}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">반려</div>
        <div className="summary-card__count">{rejected}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar() {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ClaimTable
// ---------------------------------------------------------------------------

function ClaimTable({ items, onRowClick }: {
  items: Claim[]
  onRowClick: (c: Claim) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>클레임번호</th>
            <th>원주문번호</th>
            <th>유형</th>
            <th>상태</th>
            <th>귀책</th>
            <th>신청경로</th>
            <th>환불금액</th>
            <th>신청일시</th>
            <th>처리완료일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.claimId} onClick={() => onRowClick(c)}>
              <td className="link-cell">{c.claimNo}</td>
              <td style={{ fontSize: 12 }}>{c.platformOrderNo}</td>
              <td style={{ fontSize: 12 }}>{CLAIM_TYPE_LABEL[c.claimType]}</td>
              <td><ClaimStatusBadge status={c.status} /></td>
              <td><ClaimBlameBadge blameType={c.blameType} /></td>
              <td style={{ fontSize: 12 }}>{c.channel === 'SELF' ? '고객직접' : 'CS접수'}</td>
              <td className="amount-cell">{c.refundAmount.toLocaleString()}원</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{c.createdAt}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{c.completedAt ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — ClaimDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function ClaimPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Claim[]>(MOCK_CLAIMS)
  const [filter, setFilter] = useState<ClaimFilter>({ keyword: '', claimType: 'ALL', status: 'ALL', blameType: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<Claim[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Claim>({
    mode: DETAIL_MODE,
    getTabId: (item) => `claim-detail/${item.claimId}`,
    getTabLabel: (item) => `클레임 ${item.claimNo}`,
    renderDetail: (item, onClose) => (
      <ClaimDetail mode={DETAIL_MODE} claim={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterClaims(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Claim) {
    const next = allItems.map((c) => c.claimId === updated.claimId ? updated : c)
    setAllItems(next)
    setDisplayed(filterClaims(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">클레임 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar />
          </div>
          {displayed.length > 0 ? (
            <>
              <ClaimTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 클레임이 없습니다.'
                  : '조회 버튼을 눌러 클레임 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
