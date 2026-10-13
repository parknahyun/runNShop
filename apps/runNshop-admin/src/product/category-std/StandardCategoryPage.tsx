'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import StandardCategoryDetail from './StandardCategoryDetail'
import AddStandardCategoryModal from './AddStandardCategoryModal'
import {
  type StandardCategory, type StandardCategoryStatus, type StandardCategoryDepth, type StandardCategoryFilter,
  STANDARD_CATEGORY_STATUS_LABEL, STANDARD_CATEGORY_DEPTH_LABEL,
  MOCK_STANDARD_CATEGORIES, filterStandardCategories, getParentName,
} from './mockData'
import { StandardCategoryStatusBadge } from './StandardCategoryStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: StandardCategoryStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(STANDARD_CATEGORY_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as StandardCategoryStatus })),
]

const DEPTH_OPTIONS: Array<{ label: string; value: StandardCategoryDepth | 'ALL' }> = [
  { label: '전체 구분', value: 'ALL' },
  ...Object.entries(STANDARD_CATEGORY_DEPTH_LABEL).map(([k, v]) => ({ label: v, value: Number(k) as StandardCategoryDepth })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: StandardCategoryFilter
  onChange: (f: StandardCategoryFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="카테고리ID / 카테고리명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.depth}
        onChange={(e) => onChange({ ...filter, depth: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) as StandardCategoryDepth })}>
        {DEPTH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as StandardCategoryStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: StandardCategory[] }) {
  const top = items.filter(c => c.depth === 1).length
  const mid = items.filter(c => c.depth === 2).length
  const sub = items.filter(c => c.depth === 3).length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">대분류</div>
        <div className="summary-card__count">{top}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">중분류</div>
        <div className="summary-card__count">{mid}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">소분류</div>
        <div className="summary-card__count">{sub}건</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 표준카테고리 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StandardCategoryTable
// ---------------------------------------------------------------------------

function StandardCategoryTable({ items, allItems, onRowClick }: {
  items: StandardCategory[]
  allItems: StandardCategory[]
  onRowClick: (c: StandardCategory) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>카테고리ID</th>
            <th>구분</th>
            <th>카테고리명</th>
            <th>상위카테고리</th>
            <th>노출순서</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.categoryId} onClick={() => onRowClick(c)}>
              <td className="link-cell">{c.categoryId}</td>
              <td style={{ fontSize: 12 }}>{STANDARD_CATEGORY_DEPTH_LABEL[c.depth]}</td>
              <td style={{ fontWeight: 500, paddingLeft: c.depth > 1 ? (c.depth - 1) * 20 : undefined }}>
                {c.depth > 1 && '└ '}{c.categoryName}
              </td>
              <td style={{ fontSize: 12 }}>{getParentName(allItems, c.parentId)}</td>
              <td style={{ fontSize: 12 }}>{c.sortOrder}</td>
              <td><StandardCategoryStatusBadge status={c.status} /></td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — StandardCategoryDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function StandardCategoryPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<StandardCategory[]>(MOCK_STANDARD_CATEGORIES)
  const [filter, setFilter] = useState<StandardCategoryFilter>({ keyword: '', depth: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed] = useState<StandardCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<StandardCategory>({
    mode: DETAIL_MODE,
    getTabId: (item) => `category-std-detail/${item.categoryId}`,
    getTabLabel: (item) => `표준카테고리 ${item.categoryId}`,
    renderDetail: (item, onClose) => (
      <StandardCategoryDetail mode={DETAIL_MODE} category={item} categories={allItems} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterStandardCategories(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleAdd(item: StandardCategory) {
    const next = [...allItems, item]
    setAllItems(next)
    setDisplayed(filterStandardCategories(next, filter))
    setShowAdd(false)
  }

  function handleUpdate(updated: StandardCategory) {
    const next = allItems.map((c) => c.categoryId === updated.categoryId ? updated : c)
    setAllItems(next)
    setDisplayed(filterStandardCategories(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">표준카테고리 관리</h1>
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
              <StandardCategoryTable items={pageItems} allItems={allItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 표준카테고리가 없습니다.'
                  : '조회 버튼을 눌러 표준카테고리 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddStandardCategoryModal
          categories={allItems}
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
