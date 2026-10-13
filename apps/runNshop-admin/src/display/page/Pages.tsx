'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import PageDetail from './PageDetail'
import AddPageModal from './AddPageModal'
import { useTabContext } from '@/shell/TabContext'
import {
  type PageItem, type PageType, type PageStatus, type PageFilter,
  PAGE_TYPE_LABEL, PAGE_STATUS_LABEL,
  MOCK_PAGES, filterPages,
} from './mockData'

import { PageStatusBadge } from './PageStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: Array<{ label: string; value: PageType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL' },
  ...Object.entries(PAGE_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as PageType })),
]

const STATUS_OPTIONS: Array<{ label: string; value: PageStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(PAGE_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as PageStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: PageFilter
  onChange: (f: PageFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="페이지ID / 페이지명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.pageType}
        onChange={(e) => onChange({ ...filter, pageType: e.target.value as PageType | 'ALL' })}>
        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as PageStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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

function SummaryBar({ pages }: { pages: PageItem[] }) {
  const published = pages.filter(p => p.status === 'PUBLISHED').length
  const scheduled = pages.filter(p => p.status === 'SCHEDULED').length
  const draft = pages.filter(p => p.status === 'DRAFT').length
  const deprecated = pages.filter(p => p.status === 'DEPRECATED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{pages.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">게시중</div>
        <div className="summary-card__count">{published}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">예약</div>
        <div className="summary-card__count">{scheduled}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">미게시</div>
        <div className="summary-card__count">{draft}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">폐기</div>
        <div className="summary-card__count">{deprecated}건</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 페이지 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PageTable
// ---------------------------------------------------------------------------

function PageTable({ pages, onRowClick }: {
  pages: PageItem[]
  onRowClick: (p: PageItem) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>페이지ID</th>
            <th>페이지명</th>
            <th>유형</th>
            <th>상태</th>
            <th>기간</th>
            <th>영역수</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => {
            const hidden = p.sections.filter(s => !s.visible).length
            const sectionStr = hidden > 0
              ? `${p.sections.length}개 (숨김 ${hidden}개)`
              : `${p.sections.length}개`
            return (
              <tr key={p.pageId} onClick={() => onRowClick(p)}
                data-exh-live={p.status === 'PUBLISHED' ? 'true' : undefined}
                data-exh-ended={p.status === 'DEPRECATED' ? 'true' : undefined}>
                <td className="link-cell">{p.pageId}</td>
                <td style={{ fontWeight: 500 }}>{p.pageName}</td>
                <td><span className="badge">{PAGE_TYPE_LABEL[p.pageType]}</span></td>
                <td><PageStatusBadge status={p.status} /></td>
                <td style={{ fontSize: 12 }}>{p.startAt} ~ {p.endAt}</td>
                <td style={{ fontSize: 12, color: hidden > 0 ? '#d97706' : undefined }}>{sectionStr}</td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{p.updatedBy} / {p.updatedAt}</td>
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

export default function Pages({ currentUser = 'admin' }: { currentUser?: string }) {
  const { openTab } = useTabContext()
  const [allPages, setAllPages] = useState<PageItem[]>(MOCK_PAGES)
  const [filter, setFilter] = useState<PageFilter>({ keyword: '', pageType: 'ALL', status: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterPages(allPages, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleOpenDetail(eventPage: PageItem) {
    openTab({
      id: `page-detail/${eventPage.pageId}`,
      label: `페이지 ${eventPage.pageId}`,
      element: <PageDetail eventPage={eventPage} currentUser={currentUser} onClose={() => {}} onUpdate={handleUpdate} />,
    })
  }

  function handleUpdate(updated: PageItem) {
    const next = allPages.map((p) => p.pageId === updated.pageId ? updated : p)
    setAllPages(next)
    setDisplayed(filterPages(next, filter))
  }

  function handleAdd(newPage: PageItem) {
    const next = [newPage, ...allPages]
    setAllPages(next)
    setDisplayed(filterPages(next, filter))
    setShowAdd(false)
    handleOpenDetail(newPage)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">페이지 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar pages={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0 ? (
            <>
              <PageTable pages={pageItems} onRowClick={handleOpenDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 페이지가 없습니다.'
                  : '조회 버튼을 눌러 페이지 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {showAdd && (
        <AddPageModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
