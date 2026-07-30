'use client'
import { useState } from 'react'
import {
  type MemberAccessLog, type MemberAccessType, type MemberAccessLogFilter,
  MEMBER_ACCESS_TYPE_LABEL,
  MOCK_MEMBER_ACCESS_LOGS, filterMemberAccessLogs,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const ACCESS_TYPE_OPTIONS: Array<{ label: string; value: MemberAccessType | 'ALL' }> = [
  { label: '전체 구분', value: 'ALL' },
  ...Object.entries(MEMBER_ACCESS_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as MemberAccessType })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: MemberAccessLogFilter
  onChange: (f: MemberAccessLogFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="운영자명 · 대상회원" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.accessType}
        onChange={(e) => onChange({ ...filter, accessType: e.target.value as MemberAccessLogFilter['accessType'] })}>
        {ACCESS_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
// Badge
// ---------------------------------------------------------------------------

function AccessTypeBadge({ accessType }: { accessType: MemberAccessType }) {
  return <span className="badge" data-access-type={accessType}>{MEMBER_ACCESS_TYPE_LABEL[accessType]}</span>
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: MemberAccessLog[] }) {
  const list = items.filter((l) => l.accessType === 'LIST').length
  const detail = items.filter((l) => l.accessType === 'DETAIL').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">목록조회</div>
        <div className="summary-card__count">{list}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">상세조회</div>
        <div className="summary-card__count">{detail}건</div>
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
// AccessLogTable
// ---------------------------------------------------------------------------

function AccessLogTable({ items }: { items: MemberAccessLog[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>접근시각</th>
            <th>운영자명</th>
            <th>역할</th>
            <th>구분</th>
            <th>검색어</th>
            <th>대상회원</th>
            <th>조회건수</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {items.map((log) => (
            <tr key={log.logId}>
              <td style={{ fontSize: 12, color: '#64748b' }}>{log.accessAt}</td>
              <td>{log.operatorName}</td>
              <td>{log.operatorRole}</td>
              <td><AccessTypeBadge accessType={log.accessType} /></td>
              <td>{log.searchKeyword}</td>
              <td>{log.memberName}</td>
              <td style={{ textAlign: 'right' }}>{log.resultCount !== null ? `${log.resultCount}건` : '-'}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{log.accessIp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MemberAccessLogPage() {
  const [allItems] = useState<MemberAccessLog[]>(MOCK_MEMBER_ACCESS_LOGS)
  const [filter, setFilter]     = useState<MemberAccessLogFilter>({ keyword: '', accessType: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<MemberAccessLog[]>([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterMemberAccessLogs(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">고객정보 접근 이력</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar />
          </div>
          {displayed.length > 0
            ? <>
                <AccessLogTable items={pageItems} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">
                  {searched ? '조건에 맞는 접근 이력이 없습니다.' : '조회 버튼을 눌러 접근 이력 목록을 불러오세요.'}
                </p>
              </div>
          }
        </>
      )}
    </div>
  )
}
