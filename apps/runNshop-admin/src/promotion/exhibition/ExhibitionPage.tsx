'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import ExhibitionDetail from './ExhibitionDetail'
import AddExhibitionModal from './AddExhibitionModal'
import {
  type Exhibition, type ExhibitionStatus, type ExhibitionFilter,
  EXHIBITION_STATUS_LABEL,
  MOCK_EXHIBITIONS, filterExhibitions,
} from './mockData'
import { ExhibitionStatusBadge } from './ExhibitionStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: ExhibitionStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(EXHIBITION_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as ExhibitionStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ExhibitionFilter
  onChange: (f: ExhibitionFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="기획전ID / 기획전명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ExhibitionStatus | 'ALL' })}>
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

function SummaryBar({ exhibitions }: { exhibitions: Exhibition[] }) {
  const active = exhibitions.filter(e => e.status === 'ACTIVE').length
  const scheduled = exhibitions.filter(e => e.status === 'SCHEDULED').length
  const draft = exhibitions.filter(e => e.status === 'DRAFT').length
  const ended = exhibitions.filter(e => e.status === 'ENDED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{exhibitions.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">진행중</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">예정</div>
        <div className="summary-card__count">{scheduled}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">미게시</div>
        <div className="summary-card__count">{draft}건</div>
      </div>
      <div className="summary-card summary-card--warn">
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 기획전 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ExhibitionTable
// ---------------------------------------------------------------------------

function ExhibitionTable({ exhibitions, onRowClick }: {
  exhibitions: Exhibition[]
  onRowClick: (ex: Exhibition) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>기획전ID</th>
            <th>기획전명</th>
            <th>상태</th>
            <th>기간</th>
            <th>상품수</th>
            <th>소속 프로모션</th>
            <th>노출순서</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {exhibitions.map((ex) => (
            <tr key={ex.exhibitionId} onClick={() => onRowClick(ex)}
              data-exh-live={ex.status === 'ACTIVE' ? 'true' : undefined}
              data-exh-ended={ex.status === 'ENDED' ? 'true' : undefined}>
              <td className="link-cell">{ex.exhibitionId}</td>
              <td style={{ fontWeight: 500 }}>{ex.title}</td>
              <td><ExhibitionStatusBadge status={ex.status} /></td>
              <td style={{ fontSize: 12 }}>{ex.startAt} ~ {ex.endAt}</td>
              <td style={{ fontSize: 12 }}>{ex.products.length}개</td>
              <td style={{ fontSize: 12, color: ex.promotions.length > 0 ? undefined : '#94a3b8' }}>{ex.promotions.length > 0 ? `${ex.promotions.length}건` : '-'}</td>
              <td style={{ fontSize: 12 }}>{ex.displayOrder}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{ex.updatedBy} / {ex.updatedAt}</td>
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

// 호출방식: 'tab'(MDI 탭, 기본) 또는 'modal'(팝업)로 전환 가능 — ExhibitionDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'tab'

export default function ExhibitionPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allExhibitions, setAllExhibitions] = useState<Exhibition[]>(MOCK_EXHIBITIONS)
  const [filter, setFilter] = useState<ExhibitionFilter>({ keyword: '', status: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd] = useState(false)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Exhibition>({
    mode: DETAIL_MODE,
    getTabId: (item) => `exhibition-detail/${item.exhibitionId}`,
    getTabLabel: (item) => `기획전 ${item.exhibitionId}`,
    renderDetail: (item, onClose) => (
      <ExhibitionDetail mode={DETAIL_MODE} exhibition={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterExhibitions(allExhibitions, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Exhibition) {
    const next = allExhibitions.map((ex) => ex.exhibitionId === updated.exhibitionId ? updated : ex)
    setAllExhibitions(next)
    setDisplayed(filterExhibitions(next, filter))
    setModalItem(updated)
  }

  function handleAdd(newExhibition: Exhibition) {
    const next = [newExhibition, ...allExhibitions]
    setAllExhibitions(next)
    setDisplayed(filterExhibitions(next, filter))
    setShowAdd(false)
    openDetail(newExhibition)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">기획전 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar exhibitions={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0 ? (
            <>
              <ExhibitionTable exhibitions={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 기획전이 없습니다.'
                  : '조회 버튼을 눌러 기획전 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}

      {showAdd && (
        <AddExhibitionModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
