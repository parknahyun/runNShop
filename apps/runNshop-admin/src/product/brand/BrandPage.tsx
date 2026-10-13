'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import BrandDetail from './BrandDetail'
import AddBrandModal from './AddBrandModal'
import {
  type Brand, type BrandStatus, type BrandFilter,
  BRAND_STATUS_LABEL, MOCK_BRANDS, filterBrands,
} from './mockData'
import { BrandStatusBadge } from './BrandStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: BrandStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(BRAND_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as BrandStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: BrandFilter
  onChange: (f: BrandFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="브랜드ID / 브랜드명 / 영문명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as BrandStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Brand[] }) {
  const active = items.filter(b => b.status === 'ACTIVE').length
  const inactive = items.filter(b => b.status === 'INACTIVE').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">사용</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">미사용</div>
        <div className="summary-card__count">{inactive}건</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 브랜드 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BrandTable
// ---------------------------------------------------------------------------

function BrandTable({ items, onRowClick }: {
  items: Brand[]
  onRowClick: (b: Brand) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>브랜드ID</th>
            <th>브랜드명</th>
            <th>영문명</th>
            <th>등록상품수</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((b) => (
            <tr key={b.brandId} onClick={() => onRowClick(b)}>
              <td className="link-cell">{b.brandId}</td>
              <td style={{ fontWeight: 500 }}>{b.brandName}</td>
              <td style={{ fontSize: 12 }}>{b.brandNameEn || '-'}</td>
              <td style={{ fontSize: 12 }}>{b.productCount.toLocaleString()}건</td>
              <td><BrandStatusBadge status={b.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>
                <div>{b.updatedBy}</div>
                <div>{b.updatedAt}</div>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — BrandDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function BrandPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Brand[]>(MOCK_BRANDS)
  const [filter, setFilter] = useState<BrandFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Brand>({
    mode: DETAIL_MODE,
    getTabId: (item) => `brand-detail/${item.brandId}`,
    getTabLabel: (item) => `브랜드 ${item.brandId}`,
    renderDetail: (item, onClose) => (
      <BrandDetail mode={DETAIL_MODE} brand={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterBrands(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleAdd(item: Brand) {
    const next = [item, ...allItems]
    setAllItems(next)
    setDisplayed(filterBrands(next, filter))
    setShowAdd(false)
  }

  function handleUpdate(updated: Brand) {
    const next = allItems.map((b) => b.brandId === updated.brandId ? updated : b)
    setAllItems(next)
    setDisplayed(filterBrands(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">브랜드 관리</h1>
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
              <BrandTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 브랜드가 없습니다.'
                  : '조회 버튼을 눌러 브랜드 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddBrandModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
