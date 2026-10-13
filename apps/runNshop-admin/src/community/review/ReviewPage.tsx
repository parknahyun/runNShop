'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import ReviewDetail from './ReviewDetail'
import {
  type Review, type ReviewRating, type ReviewStatus, type ReviewFilter,
  REVIEW_STATUS_LABEL, REVIEW_RATING_LABEL,
  MOCK_REVIEWS, filterReviews,
} from './mockData'
import { ReviewStatusBadge } from './ReviewStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const RATING_OPTIONS: Array<{ label: string; value: ReviewRating | 'ALL' }> = [
  { label: '전체 평점', value: 'ALL' },
  ...Object.entries(REVIEW_RATING_LABEL).map(([k, v]) => ({ label: v, value: Number(k) as ReviewRating })),
]

const STATUS_OPTIONS: Array<{ label: string; value: ReviewStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(REVIEW_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as ReviewStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ReviewFilter
  onChange: (f: ReviewFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="상품명 · 작성자명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.rating}
        onChange={(e) => onChange({ ...filter, rating: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) as ReviewRating })}>
        {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ReviewStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#475569' }}>
        <input type="checkbox" checked={filter.photoOnly}
          onChange={(e) => onChange({ ...filter, photoOnly: e.target.checked })} />
        포토리뷰만 보기
      </label>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Review[] }) {
  const active = items.filter(r => r.status === 'ACTIVE').length
  const hidden = items.filter(r => r.status === 'HIDDEN').length
  const deleted = items.filter(r => r.status === 'DELETED').length
  const avgRating = items.length > 0
    ? (items.reduce((sum, r) => sum + r.rating, 0) / items.length).toFixed(1)
    : '-'
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
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">숨김</div>
        <div className="summary-card__count">{hidden}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">삭제</div>
        <div className="summary-card__count">{deleted}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">평균평점</div>
        <div className="summary-card__count">{avgRating}</div>
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
// ReviewTable
// ---------------------------------------------------------------------------

function ReviewTable({ items, onRowClick }: {
  items: Review[]
  onRowClick: (r: Review) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>리뷰번호</th>
            <th>상품명</th>
            <th>작성자</th>
            <th>평점</th>
            <th>포토리뷰</th>
            <th>내용</th>
            <th>상태</th>
            <th>작성일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.reviewId} onClick={() => onRowClick(r)}>
              <td className="link-cell">{r.reviewId}</td>
              <td style={{ fontWeight: 500 }}>{r.productName}</td>
              <td style={{ fontSize: 12 }}>{r.memberName}</td>
              <td style={{ fontSize: 12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
              <td>{r.isPhotoReview ? <span className="badge" data-photo-review="Y">포토리뷰</span> : '-'}</td>
              <td style={{ fontSize: 12, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</td>
              <td><ReviewStatusBadge status={r.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{r.createdAt}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — ReviewDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function ReviewPage() {
  const [allItems, setAllItems] = useState<Review[]>(MOCK_REVIEWS)
  const [filter, setFilter] = useState<ReviewFilter>({ keyword: '', rating: 'ALL', status: 'ALL', photoOnly: false })
  const [displayed, setDisplayed] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Review>({
    mode: DETAIL_MODE,
    getTabId: (item) => `review-detail/${item.reviewId}`,
    getTabLabel: (item) => `리뷰 ${item.reviewId}`,
    renderDetail: (item, onClose) => (
      <ReviewDetail mode={DETAIL_MODE} review={item} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterReviews(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Review) {
    const next = allItems.map((r) => r.reviewId === updated.reviewId ? updated : r)
    setAllItems(next)
    setDisplayed(filterReviews(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">리뷰 관리</h1>
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
              <ReviewTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 리뷰가 없습니다.'
                  : '조회 버튼을 눌러 리뷰 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
