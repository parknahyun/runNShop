'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import AuditLogDetail from './AuditLogDetail'
import {
  type AuditLog, type AuditAction, type ActorType, type AuditLogFilter,
  AUDIT_ACTION_LABEL, ACTOR_TYPE_LABEL,
  MOCK_AUDIT_LOGS, filterAuditLogs,
} from './mockData'
import { AuditActionBadge } from './AuditActionBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const ACTION_OPTIONS: Array<{ label: string; value: AuditAction | 'ALL' }> = [
  { label: '전체 작업구분', value: 'ALL' },
  ...Object.entries(AUDIT_ACTION_LABEL).map(([k, v]) => ({ label: v, value: k as AuditAction })),
]

const ACTOR_TYPE_OPTIONS: Array<{ label: string; value: ActorType | 'ALL' }> = [
  { label: '전체 실행주체', value: 'ALL' },
  ...Object.entries(ACTOR_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as ActorType })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: AuditLogFilter
  onChange: (f: AuditLogFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="도메인 · 이벤트유형 · 대상ID" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.action}
        onChange={(e) => onChange({ ...filter, action: e.target.value as AuditAction | 'ALL' })}>
        {ACTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.actorType}
        onChange={(e) => onChange({ ...filter, actorType: e.target.value as ActorType | 'ALL' })}>
        {ACTOR_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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

function SummaryBar({ items }: { items: AuditLog[] }) {
  const create = items.filter((l) => l.action === 'CREATE').length
  const update = items.filter((l) => l.action === 'UPDATE').length
  const del    = items.filter((l) => l.action === 'DELETE').length
  const status = items.filter((l) => l.action === 'STATUS_CHANGE').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">생성</div>
        <div className="summary-card__count">{create}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">수정</div>
        <div className="summary-card__count">{update}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">삭제</div>
        <div className="summary-card__count">{del}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">상태변경</div>
        <div className="summary-card__count">{status}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AuditLogTable
// ---------------------------------------------------------------------------

function AuditLogTable({ items, onRowClick }: {
  items: AuditLog[]
  onRowClick: (l: AuditLog) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>발생시각</th>
            <th>도메인</th>
            <th>이벤트유형</th>
            <th>작업구분</th>
            <th>대상</th>
            <th>실행주체</th>
          </tr>
        </thead>
        <tbody>
          {items.map((l) => (
            <tr key={l.logId} onClick={() => onRowClick(l)}>
              <td className="link-cell" style={{ fontSize: 12 }}>{l.createdAt}</td>
              <td>{l.domain}</td>
              <td style={{ fontSize: 12 }}>{l.eventType}</td>
              <td><AuditActionBadge action={l.action} /></td>
              <td style={{ fontSize: 12 }}>{l.aggregateType} · {l.aggregateId}</td>
              <td style={{ fontSize: 12 }}>
                {ACTOR_TYPE_LABEL[l.actorType]}{l.actorId ? ` · ${l.actorId}` : ''}
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

export default function AuditLogs() {
  const [allItems] = useState<AuditLog[]>(MOCK_AUDIT_LOGS)
  const [filter, setFilter] = useState<AuditLogFilter>({ keyword: '', action: 'ALL', actorType: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [detailLog, setDetailLog] = useState<AuditLog | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterAuditLogs(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">감사 로그</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
          </div>
          {displayed.length > 0 ? (
            <>
              <AuditLogTable items={pageItems} onRowClick={setDetailLog} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 감사 로그가 없습니다.'
                  : '조회 버튼을 눌러 감사 로그 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailLog && (
        <AuditLogDetail log={detailLog} onClose={() => setDetailLog(null)} />
      )}
    </div>
  )
}
