'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import QnaDetail from './QnaDetail'
import {
  type Qna, type QnaType, type QnaStatus, type QnaFilter,
  QNA_TYPE_LABEL, QNA_STATUS_LABEL,
  MOCK_QNAS, filterQnas,
} from './mockData'
import { QnaStatusBadge } from './QnaStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: Array<{ label: string; value: QnaType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL' },
  ...Object.entries(QNA_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as QnaType })),
]

const STATUS_OPTIONS: Array<{ label: string; value: QnaStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(QNA_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as QnaStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: QnaFilter
  onChange: (f: QnaFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="질문내용 · 작성자명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.qnaType}
        onChange={(e) => onChange({ ...filter, qnaType: e.target.value as QnaType | 'ALL' })}>
        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as QnaStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Qna[] }) {
  const pending = items.filter(q => q.status === 'PENDING').length
  const answered = items.filter(q => q.status === 'ANSWERED').length
  const hidden = items.filter(q => q.status === 'HIDDEN').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">답변대기</div>
        <div className="summary-card__count">{pending}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">답변완료</div>
        <div className="summary-card__count">{answered}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">숨김</div>
        <div className="summary-card__count">{hidden}건</div>
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
// QnaTable
// ---------------------------------------------------------------------------

function QnaTable({ items, onRowClick }: {
  items: Qna[]
  onRowClick: (q: Qna) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>QnA번호</th>
            <th>유형</th>
            <th>참조</th>
            <th>작성자</th>
            <th>질문내용</th>
            <th>공개여부</th>
            <th>활동지수</th>
            <th>상태</th>
            <th>문의일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((q) => (
            <tr key={q.qnaId} onClick={() => onRowClick(q)}>
              <td className="link-cell">{q.qnaId}</td>
              <td style={{ fontSize: 12 }}>{QNA_TYPE_LABEL[q.qnaType]}</td>
              <td style={{ fontSize: 12 }}>{q.refName}</td>
              <td style={{ fontSize: 12 }}>{q.memberName}</td>
              <td style={{ fontSize: 12, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</td>
              <td style={{ fontSize: 12 }}>{q.isPublic ? '공개' : '비공개'}</td>
              <td style={{ fontSize: 12 }}>{q.activityScoreGranted ? '지급' : '-'}</td>
              <td><QnaStatusBadge status={q.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{q.createdAt}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — QnaDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function QnaPage() {
  const [allItems, setAllItems] = useState<Qna[]>(MOCK_QNAS)
  const [filter, setFilter] = useState<QnaFilter>({ keyword: '', qnaType: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed] = useState<Qna[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Qna>({
    mode: DETAIL_MODE,
    getTabId: (item) => `qna-detail/${item.qnaId}`,
    getTabLabel: (item) => `QnA ${item.qnaId}`,
    renderDetail: (item, onClose) => (
      <QnaDetail mode={DETAIL_MODE} qna={item} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterQnas(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Qna) {
    const next = allItems.map((q) => q.qnaId === updated.qnaId ? updated : q)
    setAllItems(next)
    setDisplayed(filterQnas(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">QnA 관리</h1>
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
              <QnaTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 QnA가 없습니다.'
                  : '조회 버튼을 눌러 QnA 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
