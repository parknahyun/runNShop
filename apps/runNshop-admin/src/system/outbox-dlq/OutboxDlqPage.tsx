'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import {
  type OutboxEvent, type OutboxStatus, type OutboxFilter,
  type DlqEntry, type DlqStatus, type DlqFilter,
  OUTBOX_STATUS_LABEL, DLQ_STATUS_LABEL,
  MOCK_OUTBOX_EVENTS, MOCK_DLQ_ENTRIES, filterOutboxEvents, filterDlqEntries,
} from './mockData'
import { OutboxStatusBadge } from './OutboxStatusBadge'
import { DlqStatusBadge } from './DlqStatusBadge'

// ---------------------------------------------------------------------------
// Outbox — FilterBar / SummaryBar / Table
// ---------------------------------------------------------------------------

const OUTBOX_STATUS_OPTIONS: Array<{ label: string; value: OutboxStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(OUTBOX_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as OutboxStatus })),
]

function OutboxFilterBar({ filter, onChange, onSearch }: {
  filter: OutboxFilter
  onChange: (f: OutboxFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="이벤트유형 · 대상ID" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as OutboxStatus | 'ALL' })}>
        {OUTBOX_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

function OutboxSummaryBar({ items }: { items: OutboxEvent[] }) {
  const pending    = items.filter((e) => e.status === 'PENDING').length
  const processing = items.filter((e) => e.status === 'PROCESSING').length
  const processed  = items.filter((e) => e.status === 'PROCESSED').length
  const failed     = items.filter((e) => e.status === 'FAILED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">대기</div>
        <div className="summary-card__count">{pending}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">처리중</div>
        <div className="summary-card__count">{processing}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">처리완료</div>
        <div className="summary-card__count">{processed}건</div>
      </div>
      {failed > 0 && (
        <div className="summary-card summary-card--warn">
          <div className="summary-card__label">⚠ 실패</div>
          <div className="summary-card__count">{failed}건</div>
        </div>
      )}
    </div>
  )
}

function OutboxTable({ items }: { items: OutboxEvent[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>이벤트ID</th>
            <th>Trace ID</th>
            <th>대상 유형</th>
            <th>대상 ID</th>
            <th>이벤트유형</th>
            <th>상태</th>
            <th>재시도</th>
            <th>발생일시</th>
            <th>처리일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.eventId} data-exec-failed={e.status === 'FAILED' ? 'true' : undefined}>
              <td>{e.eventId}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{e.traceId}</td>
              <td style={{ fontSize: 12 }}>{e.aggregateType}</td>
              <td style={{ fontSize: 12 }}>{e.aggregateId}</td>
              <td style={{ fontSize: 12 }}>{e.eventType}</td>
              <td title={e.errorMessage ?? undefined}><OutboxStatusBadge status={e.status} /></td>
              <td>{e.retryCount}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{e.createdAt}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{e.processedAt ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OutboxTab() {
  const [filter, setFilter]     = useState<OutboxFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<OutboxEvent[]>([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterOutboxEvents(MOCK_OUTBOX_EVENTS, filter))
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="tab-panel-content">
      <OutboxFilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />
      {loading && <p className="state-msg">불러오는 중...</p>}
      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <OutboxSummaryBar items={displayed} />}
          </div>
          {displayed.length > 0 ? (
            <OutboxTable items={displayed} />
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched ? '조건에 맞는 Outbox 이벤트가 없습니다.' : '조회 버튼을 눌러 Outbox 이벤트 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DLQ — IgnoreModal
// ---------------------------------------------------------------------------

function IgnoreDlqModal({ entry, onClose, onConfirm }: {
  entry: DlqEntry
  onClose: () => void
  onConfirm: (memo: string) => void
}) {
  const [memo, setMemo] = useState('')

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">DLQ 무시 처리</span>
            <span className="detail-modal__subtitle">{entry.dlqId} · {entry.eventType}</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form" style={{ padding: 0 }}>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>처리 메모 <span className="add-form__req">*</span></label>
                <textarea rows={3} value={memo} onChange={(e) => setMemo(e.target.value)}
                  placeholder="무시 처리 사유를 입력하세요 (예: 재처리 불필요한 이벤트로 확인됨)" />
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--delete" disabled={!memo.trim()} onClick={() => onConfirm(memo.trim())}>무시 확정</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DLQ — FilterBar / SummaryBar / Table
// ---------------------------------------------------------------------------

const DLQ_STATUS_OPTIONS: Array<{ label: string; value: DlqStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(DLQ_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as DlqStatus })),
]

function DlqFilterBar({ filter, onChange, onSearch }: {
  filter: DlqFilter
  onChange: (f: DlqFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="이벤트유형" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as DlqStatus | 'ALL' })}>
        {DLQ_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

function DlqSummaryBar({ items }: { items: DlqEntry[] }) {
  const pending  = items.filter((d) => d.status === 'PENDING').length
  const resolved = items.filter((d) => d.status === 'RESOLVED').length
  const ignored  = items.filter((d) => d.status === 'IGNORED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      {pending > 0 && (
        <div className="summary-card summary-card--warn">
          <div className="summary-card__label">⚠ 대기</div>
          <div className="summary-card__count">{pending}건</div>
        </div>
      )}
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">해결</div>
        <div className="summary-card__count">{resolved}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">무시</div>
        <div className="summary-card__count">{ignored}건</div>
      </div>
    </div>
  )
}

function DlqTable({ items, readOnly, onRetry, onIgnore }: {
  items: DlqEntry[]
  readOnly: boolean
  onRetry: (entry: DlqEntry) => void
  onIgnore: (entry: DlqEntry) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>DLQ ID</th>
            <th>Outbox 이벤트ID</th>
            <th>Trace ID</th>
            <th>이벤트유형</th>
            <th>실패사유</th>
            <th>재시도</th>
            <th>상태</th>
            <th>처리자 / 처리메모</th>
            <th>발생일시</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.dlqId} data-exec-failed={d.status === 'PENDING' ? 'true' : undefined}>
              <td>{d.dlqId}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{d.outboxEventId}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{d.traceId}</td>
              <td style={{ fontSize: 12 }}>{d.eventType}</td>
              <td style={{ fontSize: 12, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.failReason}>{d.failReason}</td>
              <td>{d.retryCount}</td>
              <td><DlqStatusBadge status={d.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>
                {d.resolvedBy ? <div>{d.resolvedBy} / {d.resolvedAt}</div> : '-'}
                {d.resolveMemo && <div>{d.resolveMemo}</div>}
              </td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{d.createdAt}</td>
              <td>
                {d.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-tool btn-tool--add" style={{ height: 26, padding: '0 8px', fontSize: 12 }}
                      disabled={readOnly} onClick={() => onRetry(d)}>재시도</button>
                    <button className="btn-tool btn-tool--delete" style={{ height: 26, padding: '0 8px', fontSize: 12 }}
                      disabled={readOnly} onClick={() => onIgnore(d)}>무시</button>
                  </div>
                ) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DlqTab({ allItems, currentUser, readOnly, onUpdate }: {
  allItems: DlqEntry[]
  currentUser: string
  readOnly: boolean
  onUpdate: (updated: DlqEntry) => void
}) {
  const [filter, setFilter]       = useState<DlqFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<DlqEntry[]>([])
  const [loading, setLoading]     = useState(false)
  const [searched, setSearched]   = useState(false)
  const [ignoreTarget, setIgnoreTarget] = useState<DlqEntry | null>(null)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterDlqEntries(allItems, filter))
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleRetry(entry: DlqEntry) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...entry,
      retryCount: entry.retryCount + 1,
      status: 'RESOLVED',
      resolvedBy: currentUser,
      resolvedAt: now,
      resolveMemo: '재시도 성공',
      updatedAt: now,
    })
    setDisplayed((prev) => prev.map((d) => d.dlqId === entry.dlqId
      ? { ...entry, retryCount: entry.retryCount + 1, status: 'RESOLVED', resolvedBy: currentUser, resolvedAt: now, resolveMemo: '재시도 성공', updatedAt: now }
      : d))
  }

  function handleIgnoreConfirm(memo: string) {
    if (!ignoreTarget) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: DlqEntry = { ...ignoreTarget, status: 'IGNORED', resolvedBy: currentUser, resolvedAt: now, resolveMemo: memo, updatedAt: now }
    onUpdate(updated)
    setDisplayed((prev) => prev.map((d) => d.dlqId === updated.dlqId ? updated : d))
    setIgnoreTarget(null)
  }

  return (
    <div className="tab-panel-content">
      <DlqFilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />
      {loading && <p className="state-msg">불러오는 중...</p>}
      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <DlqSummaryBar items={displayed} />}
          </div>
          {displayed.length > 0 ? (
            <DlqTable items={displayed} readOnly={readOnly} onRetry={handleRetry} onIgnore={setIgnoreTarget} />
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched ? '조건에 맞는 DLQ 항목이 없습니다.' : '조회 버튼을 눌러 DLQ 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {ignoreTarget && (
        <IgnoreDlqModal entry={ignoreTarget} onClose={() => setIgnoreTarget(null)} onConfirm={handleIgnoreConfirm} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OutboxDlqPage({ currentUser = 'guest', readOnly = false }: { currentUser?: string; readOnly?: boolean }) {
  const [allDlq, setAllDlq]     = useState<DlqEntry[]>(MOCK_DLQ_ENTRIES)

  function handleDlqUpdate(updated: DlqEntry) {
    setAllDlq((prev) => prev.map((d) => d.dlqId === updated.dlqId ? updated : d))
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">Outbox · DLQ 관리</h1>
      </div>

      <InnerTabs tabs={[
        {
          label:   `Outbox (${MOCK_OUTBOX_EVENTS.length})`,
          content: <OutboxTab />,
        },
        {
          label:   `DLQ (${allDlq.length})`,
          content: <DlqTab allItems={allDlq} currentUser={currentUser} readOnly={readOnly} onUpdate={handleDlqUpdate} />,
        },
      ]} />
    </div>
  )
}
