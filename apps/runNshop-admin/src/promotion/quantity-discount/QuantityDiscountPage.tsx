'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import QuantityDiscountDetail from './QuantityDiscountDetail'
import AddQuantityDiscountModal from './AddQuantityDiscountModal'
import {
  type QuantityDiscount, type QuantityDiscountStatus, type QuantityDiscountFilter,
  QUANTITY_DISCOUNT_STATUS_LABEL,
  MOCK_QUANTITY_DISCOUNTS, filterQuantityDiscounts,
} from './mockData'
import { QuantityDiscountStatusBadge } from './QuantityDiscountStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: QuantityDiscountStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(QUANTITY_DISCOUNT_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as QuantityDiscountStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: QuantityDiscountFilter
  onChange: (f: QuantityDiscountFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="수량할인ID / 행사명 / 입점사 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as QuantityDiscountStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: QuantityDiscount[] }) {
  const active = items.filter(q => q.status === 'ACTIVE').length
  const ended = items.filter(q => q.status === 'ENDED').length
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 수량별 할인 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QuantityDiscountTable
// ---------------------------------------------------------------------------

function QuantityDiscountTable({ items, onRowClick }: {
  items: QuantityDiscount[]
  onRowClick: (q: QuantityDiscount) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>수량할인ID</th>
            <th>행사명</th>
            <th>입점사</th>
            <th>적용상품</th>
            <th>구간수</th>
            <th>기간</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((q) => (
            <tr key={q.quantityDiscountId} onClick={() => onRowClick(q)}>
              <td className="link-cell">{q.quantityDiscountId}</td>
              <td style={{ fontWeight: 500 }}>{q.eventName}</td>
              <td style={{ fontSize: 12 }}>{q.vendorName}</td>
              <td style={{ fontSize: 12 }}>{q.products.length}개</td>
              <td style={{ fontSize: 12 }}>{q.tiers.length}개</td>
              <td style={{ fontSize: 12 }}>{q.startAt} ~ {q.endAt}</td>
              <td><QuantityDiscountStatusBadge status={q.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{q.updatedBy} / {q.updatedAt}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — QuantityDiscountDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function QuantityDiscountPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<QuantityDiscount[]>(MOCK_QUANTITY_DISCOUNTS)
  const [filter, setFilter] = useState<QuantityDiscountFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<QuantityDiscount[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<QuantityDiscount>({
    mode: DETAIL_MODE,
    getTabId: (item) => `quantity-discount-detail/${item.quantityDiscountId}`,
    getTabLabel: (item) => `수량별 할인 ${item.quantityDiscountId}`,
    renderDetail: (item, onClose) => (
      <QuantityDiscountDetail mode={DETAIL_MODE} quantityDiscount={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterQuantityDiscounts(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleAdd(item: QuantityDiscount) {
    const next = [item, ...allItems]
    setAllItems(next)
    setDisplayed(filterQuantityDiscounts(next, filter))
    setShowAdd(false)
  }

  function handleUpdate(updated: QuantityDiscount) {
    const next = allItems.map((q) => q.quantityDiscountId === updated.quantityDiscountId ? updated : q)
    setAllItems(next)
    setDisplayed(filterQuantityDiscounts(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">수량별 할인 관리</h1>
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
              <QuantityDiscountTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 수량별 할인이 없습니다.'
                  : '조회 버튼을 눌러 수량별 할인 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddQuantityDiscountModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
