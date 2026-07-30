'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import CartDiscountDetail from './CartDiscountDetail'
import AddCartDiscountModal from './AddCartDiscountModal'
import {
  type CartDiscount, type CartDiscountStatus, type CartDiscountFilter,
  CART_DISCOUNT_STATUS_LABEL, CART_DISCOUNT_APPLY_UNIT_LABEL, CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL,
  MOCK_CART_DISCOUNTS, filterCartDiscounts, formatCartDiscountValue,
} from './mockData'
import { CartDiscountStatusBadge } from './CartDiscountStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: CartDiscountStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(CART_DISCOUNT_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as CartDiscountStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: CartDiscountFilter
  onChange: (f: CartDiscountFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="장바구니할인ID / 할인명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as CartDiscountStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: CartDiscount[] }) {
  const active = items.filter(c => c.status === 'ACTIVE').length
  const ended = items.filter(c => c.status === 'ENDED').length
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 장바구니할인 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CartDiscountTable
// ---------------------------------------------------------------------------

function CartDiscountTable({ items, onRowClick }: {
  items: CartDiscount[]
  onRowClick: (c: CartDiscount) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>장바구니할인ID</th>
            <th>할인명</th>
            <th>적용단위</th>
            <th>최소주문금액</th>
            <th>할인</th>
            <th>부분취소정책</th>
            <th>기간</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.cartDiscountId} onClick={() => onRowClick(c)}>
              <td className="link-cell">{c.cartDiscountId}</td>
              <td style={{ fontWeight: 500 }}>{c.discountName}</td>
              <td style={{ fontSize: 12 }}>{CART_DISCOUNT_APPLY_UNIT_LABEL[c.applyUnit]}</td>
              <td style={{ fontSize: 12 }}>{c.minOrderAmount.toLocaleString()}원</td>
              <td style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>{formatCartDiscountValue(c)}</td>
              <td style={{ fontSize: 12 }}>{CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL[c.partialCancelPolicy]}</td>
              <td style={{ fontSize: 12 }}>{c.startAt} ~ {c.endAt}</td>
              <td><CartDiscountStatusBadge status={c.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{c.updatedBy} / {c.updatedAt}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — CartDiscountDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function CartDiscountPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<CartDiscount[]>(MOCK_CART_DISCOUNTS)
  const [filter, setFilter] = useState<CartDiscountFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<CartDiscount[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<CartDiscount>({
    mode: DETAIL_MODE,
    getTabId: (item) => `cart-discount-detail/${item.cartDiscountId}`,
    getTabLabel: (item) => `장바구니할인 ${item.cartDiscountId}`,
    renderDetail: (item, onClose) => (
      <CartDiscountDetail mode={DETAIL_MODE} cartDiscount={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterCartDiscounts(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleAdd(item: CartDiscount) {
    const next = [item, ...allItems]
    setAllItems(next)
    setDisplayed(filterCartDiscounts(next, filter))
    setShowAdd(false)
  }

  function handleUpdate(updated: CartDiscount) {
    const next = allItems.map((c) => c.cartDiscountId === updated.cartDiscountId ? updated : c)
    setAllItems(next)
    setDisplayed(filterCartDiscounts(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">장바구니할인 관리</h1>
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
              <CartDiscountTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 장바구니할인이 없습니다.'
                  : '조회 버튼을 눌러 장바구니할인 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddCartDiscountModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
