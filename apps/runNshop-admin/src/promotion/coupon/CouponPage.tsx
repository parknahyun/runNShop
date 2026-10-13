'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import CouponDetail from './CouponDetail'
import AddCouponModal from './AddCouponModal'
import {
  type Coupon, type CouponStatus, type CouponIssuerType, type CouponType, type CouponFilter,
  COUPON_STATUS_LABEL, COUPON_ISSUER_TYPE_LABEL, COUPON_TYPE_LABEL,
  MOCK_COUPONS, filterCoupons, formatCouponDiscount,
} from './mockData'
import { CouponStatusBadge } from './CouponStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: CouponStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(COUPON_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as CouponStatus })),
]

const ISSUER_OPTIONS: Array<{ label: string; value: CouponIssuerType | 'ALL' }> = [
  { label: '전체 발행주체', value: 'ALL' },
  ...Object.entries(COUPON_ISSUER_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as CouponIssuerType })),
]

const COUPON_TYPE_OPTIONS: Array<{ label: string; value: CouponType | 'ALL' }> = [
  { label: '전체 쿠폰유형', value: 'ALL' },
  ...Object.entries(COUPON_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as CouponType })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: CouponFilter
  onChange: (f: CouponFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="쿠폰ID / 쿠폰코드 / 쿠폰명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.couponType}
        onChange={(e) => onChange({ ...filter, couponType: e.target.value as CouponType | 'ALL' })}>
        {COUPON_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.issuerType}
        onChange={(e) => onChange({ ...filter, issuerType: e.target.value as CouponIssuerType | 'ALL' })}>
        {ISSUER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as CouponStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Coupon[] }) {
  const active = items.filter(c => c.status === 'ACTIVE').length
  const inactive = items.filter(c => c.status === 'INACTIVE').length
  const exhausted = items.filter(c => c.status === 'EXHAUSTED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">활성</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">비활성</div>
        <div className="summary-card__count">{inactive}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">소진</div>
        <div className="summary-card__count">{exhausted}건</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 쿠폰할인 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CouponTable
// ---------------------------------------------------------------------------

function CouponTable({ items, onRowClick }: {
  items: Coupon[]
  onRowClick: (c: Coupon) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>쿠폰ID</th>
            <th>쿠폰명</th>
            <th>쿠폰유형</th>
            <th>할인</th>
            <th>발급/한도</th>
            <th>유효기간</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.couponId} onClick={() => onRowClick(c)}>
              <td className="link-cell">{c.couponId}</td>
              <td style={{ fontWeight: 500 }}>{c.couponName}</td>
              <td style={{ fontSize: 12 }}>{COUPON_TYPE_LABEL[c.couponType]}</td>
              <td style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>{formatCouponDiscount(c)}</td>
              <td style={{ fontSize: 12 }}>
                <div>{c.issuedCount.toLocaleString()}</div>
                <div>/ {c.issueLimit != null ? c.issueLimit.toLocaleString() : '무제한'}</div>
              </td>
              <td style={{ fontSize: 12 }}>
                <div>{c.validFrom}</div>
                <div>~ {c.validTo}</div>
              </td>
              <td><CouponStatusBadge status={c.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>
                <div>{c.updatedBy}</div>
                <div>{c.updatedAt}</div>
              </td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — CouponDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function CouponPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Coupon[]>(MOCK_COUPONS)
  const [filter, setFilter] = useState<CouponFilter>({ keyword: '', status: 'ALL', issuerType: 'ALL', couponType: 'ALL' })
  const [displayed, setDisplayed] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Coupon>({
    mode: DETAIL_MODE,
    getTabId: (item) => `coupon-detail/${item.couponId}`,
    getTabLabel: (item) => `쿠폰할인 ${item.couponId}`,
    renderDetail: (item, onClose) => (
      <CouponDetail mode={DETAIL_MODE} coupon={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterCoupons(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleAdd(coupon: Coupon) {
    const next = [coupon, ...allItems]
    setAllItems(next)
    setDisplayed(filterCoupons(next, filter))
    setShowAdd(false)
    openDetail(coupon)
  }

  function handleUpdate(updated: Coupon) {
    const next = allItems.map((c) => c.couponId === updated.couponId ? updated : c)
    setAllItems(next)
    setDisplayed(filterCoupons(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">쿠폰할인 관리</h1>
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
              <CouponTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 쿠폰할인이 없습니다.'
                  : '조회 버튼을 눌러 쿠폰할인 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddCouponModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
