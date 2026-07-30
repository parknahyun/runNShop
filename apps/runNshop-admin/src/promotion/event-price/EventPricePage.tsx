'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import EventPriceDetail from './EventPriceDetail'
import AddEventPriceModal from './AddEventPriceModal'
import {
  type EventPrice, type EventPriceStatus, type EventPriceFilter,
  EVENT_PRICE_STATUS_LABEL,
  MOCK_EVENT_PRICES, filterEventPrices,
} from './mockData'
import { EventPriceStatusBadge } from './EventPriceStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: EventPriceStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(EVENT_PRICE_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as EventPriceStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: EventPriceFilter
  onChange: (f: EventPriceFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="즉시할인ID / 행사명 / 상품명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as EventPriceStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: EventPrice[] }) {
  const active = items.filter(e => e.status === 'ACTIVE').length
  const ended = items.filter(e => e.status === 'ENDED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">진행중</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">종료</div>
        <div className="summary-card__count">{ended}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 즉시할인 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EventPriceTable
// ---------------------------------------------------------------------------

function EventPriceTable({ items, onRowClick }: {
  items: EventPrice[]
  onRowClick: (e: EventPrice) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>즉시할인ID</th>
            <th>행사명</th>
            <th>기본할인율</th>
            <th>적용상품</th>
            <th>기간</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => {
            const soldOutCount = e.products.filter(p => p.quantityLimit && p.remainingQuantity === 0).length
            return (
              <tr key={e.eventPriceId} onClick={() => onRowClick(e)}>
                <td className="link-cell">{e.eventPriceId}</td>
                <td style={{ fontWeight: 500 }}>{e.eventName}</td>
                <td style={{ fontWeight: 600, color: '#dc2626' }}>{e.discountRate}%</td>
                <td style={{ fontSize: 12 }}>
                  {e.products.length}개
                  {soldOutCount > 0 && <span style={{ color: '#dc2626', marginLeft: 4 }}>(품절 {soldOutCount})</span>}
                </td>
                <td style={{ fontSize: 12 }}>{e.startAt.slice(0, 10)} ~ {e.endAt.slice(0, 10)}</td>
                <td><EventPriceStatusBadge status={e.status} /></td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{e.updatedBy} / {e.updatedAt}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — EventPriceDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function EventPricePage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<EventPrice[]>(MOCK_EVENT_PRICES)
  const [filter, setFilter] = useState<EventPriceFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<EventPrice[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<EventPrice>({
    mode: DETAIL_MODE,
    getTabId: (item) => `event-price-detail/${item.eventPriceId}`,
    getTabLabel: (item) => `즉시할인 ${item.eventPriceId}`,
    renderDetail: (item, onClose) => (
      <EventPriceDetail mode={DETAIL_MODE} eventPrice={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterEventPrices(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleAdd(item: EventPrice) {
    const next = [item, ...allItems]
    setAllItems(next)
    setDisplayed(filterEventPrices(next, filter))
    setShowAdd(false)
  }

  function handleUpdate(updated: EventPrice) {
    const next = allItems.map((e) => e.eventPriceId === updated.eventPriceId ? updated : e)
    setAllItems(next)
    setDisplayed(filterEventPrices(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">즉시할인 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0 ? (
            <>
              <EventPriceTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 즉시할인이 없습니다.'
                  : '조회 버튼을 눌러 즉시할인 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddEventPriceModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
