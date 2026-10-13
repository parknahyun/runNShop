'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import SettlementDetail from './SettlementDetail'
import {
  type Settlement, type SettlementStatus, type SettlementFilter,
  SETTLEMENT_STATUS_LABEL,
  MOCK_SETTLEMENTS, filterSettlements,
} from './mockData'
import { SettlementStatusBadge } from './SettlementStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: SettlementStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(SETTLEMENT_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as SettlementStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: SettlementFilter
  onChange: (f: SettlementFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="정산번호 · 입점사명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <input type="month" value={filter.settlementMonth}
        onChange={(e) => onChange({ ...filter, settlementMonth: e.target.value })} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as SettlementStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Settlement[] }) {
  const calculating = items.filter(s => s.status === 'CALCULATING').length
  const confirmed = items.filter(s => s.status === 'CONFIRMED').length
  const paid = items.filter(s => s.status === 'PAID').length
  const hold = items.filter(s => s.status === 'HOLD').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">정산중</div>
        <div className="summary-card__count">{calculating}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">확정</div>
        <div className="summary-card__count">{confirmed}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">지급완료</div>
        <div className="summary-card__count">{paid}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">보류</div>
        <div className="summary-card__count">{hold}건</div>
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
        <button className="btn-tool" onClick={() => alert('일괄 확정 기능은 준비 중입니다.')}>일괄 확정</button>
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SettlementTable
// ---------------------------------------------------------------------------

function SettlementTable({ items, onRowClick }: {
  items: Settlement[]
  onRowClick: (s: Settlement) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>정산번호</th>
            <th>입점사</th>
            <th>정산월</th>
            <th>상태</th>
            <th>정산대상금액</th>
            <th>재정산액</th>
            <th>최종정산금액</th>
            <th>이의제기</th>
            <th>확정일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.settlementId} onClick={() => onRowClick(s)}>
              <td className="link-cell">{s.settlementNo}</td>
              <td style={{ fontSize: 12 }}>{s.vendorName}</td>
              <td style={{ fontSize: 12 }}>{s.settlementMonth}</td>
              <td><SettlementStatusBadge status={s.status} /></td>
              <td className="amount-cell">{s.targetAmount.toLocaleString()}원</td>
              <td className="amount-cell">{s.adjustmentAmount.toLocaleString()}원</td>
              <td className="amount-cell">{s.finalAmount.toLocaleString()}원</td>
              <td style={{ fontSize: 12 }}>{s.objectionCount}건</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{s.confirmedAt ?? '-'}</td>
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

const DETAIL_MODE: DetailMode = 'modal'

export default function SettlementListPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Settlement[]>(MOCK_SETTLEMENTS)
  const [filter, setFilter] = useState<SettlementFilter>({ keyword: '', settlementMonth: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Settlement>({
    mode: DETAIL_MODE,
    getTabId: (item) => `settlement-detail/${item.settlementId}`,
    getTabLabel: (item) => `정산 ${item.settlementNo}`,
    renderDetail: (item, onClose) => (
      <SettlementDetail mode={DETAIL_MODE} settlement={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterSettlements(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Settlement) {
    const next = allItems.map((s) => s.settlementId === updated.settlementId ? updated : s)
    setAllItems(next)
    setDisplayed(filterSettlements(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">정산 관리</h1>
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
              <SettlementTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 정산 내역이 없습니다.'
                  : '조회 버튼을 눌러 정산 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
