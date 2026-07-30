'use client'
import { useState } from 'react'
import { type Qna, type QnaStatus, QNA_STATUS_LABEL, MOCK_QNAS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import QnaDetail from './QnaDetail'

const STATUS_OPTIONS: Array<{ label: string; value: QnaStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...(Object.entries(QNA_STATUS_LABEL) as Array<[QnaStatus, string]>).map(([value, label]) => ({ label, value })),
]

function QnaStatusBadge({ status }: { status: QnaStatus }) {
  return <span className="badge" data-qna-status={status}>{QNA_STATUS_LABEL[status]}</span>
}

export default function QnaPage() {
  const [allItems, setAllItems] = useState<Qna[]>(MOCK_QNAS)
  const [statusFilter, setStatusFilter] = useState<QnaStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<Qna[]>(MOCK_QNAS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<Qna | null>(null)

  function handleSearch() {
    let result = allItems
    if (statusFilter !== 'ALL') result = result.filter((q) => q.status === statusFilter)
    if (keyword) result = result.filter((q) => q.product_name.includes(keyword) || q.question.includes(keyword))
    setDisplayed(result)
    setPage(1)
  }

  function handleUpdate(updated: Qna) {
    const next = allItems.map((q) => (q.qna_id === updated.qna_id ? updated : q))
    setAllItems(next)
    setDisplayed((prev) => prev.map((q) => (q.qna_id === updated.qna_id ? updated : q)))
    setSelected(updated)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const pending = displayed.filter((q) => q.status === 'PENDING').length
  const answered = displayed.filter((q) => q.status === 'ANSWERED').length
  const hidden = displayed.filter((q) => q.status === 'HIDDEN').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">상품 QnA</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as QnaStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="text" placeholder="상품명 · 질문내용" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}건</div></div>
          <div className="summary-card summary-card--warn"><div className="summary-card__label">답변대기</div><div className="summary-card__count">{pending}건</div></div>
          <div className="summary-card summary-card--info"><div className="summary-card__label">답변완료</div><div className="summary-card__count">{answered}건</div></div>
          {hidden > 0 && <div className="summary-card summary-card--muted"><div className="summary-card__label">숨김</div><div className="summary-card__count">{hidden}건</div></div>}
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>QnA번호</th>
                <th>상품명</th>
                <th>작성자</th>
                <th>질문내용</th>
                <th>활동지수</th>
                <th>상태</th>
                <th>문의일시</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((q) => (
                <tr key={q.qna_id} onClick={() => setSelected(q)}>
                  <td className="link-cell">{q.qna_id}</td>
                  <td>{q.product_name}</td>
                  <td>{q.member_name}</td>
                  <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</td>
                  <td>
                    <span className="badge" data-activity-status={q.activity_score_granted ? 'GRANTED' : 'NOT_GRANTED'}>
                      {q.activity_score_granted ? '지급완료' : '미지급'}
                    </span>
                  </td>
                  <td><QnaStatusBadge status={q.status} /></td>
                  <td>{q.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 QnA가 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selected && <QnaDetail qna={selected} onUpdate={handleUpdate} onClose={() => setSelected(null)} />}
    </div>
  )
}
