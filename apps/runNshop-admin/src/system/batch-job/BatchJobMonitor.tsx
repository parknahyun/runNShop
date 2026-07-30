'use client'
import { useState } from 'react'
import {
  type BatchJob, type BatchExecution, type BatchJobParam, type BatchExecParam,
  type RunStatus, type TriggerType, type ExecFilter,
  MOCK_BATCH_JOBS, MOCK_EXECUTIONS, filterExecutions,
} from './mockData'
import BatchJobDetail from './BatchJobDetail'

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

const PAGE_SIZE_OPTIONS = [7, 14, 30, 50, 100]

function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: {
  page: number; totalPages: number; pageSize: number
  onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void
}) {
  return (
    <div className="pagination">
      <select className="pagination__size" value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}>
        {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}개</option>)}
      </select>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>←</button>
      <span>{page} / {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>→</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function RunStatusBadge({ status }: { status: RunStatus }) {
  const label: Record<RunStatus, string> = {
    SUCCESS: '성공', FAILED: '실패', RUNNING: '실행중', SKIPPED: 'SKIPPED',
  }
  return <span className="badge" data-run-status={status}>{label[status]}</span>
}

// ---------------------------------------------------------------------------
// RerunModal
// ---------------------------------------------------------------------------

function RerunModal({ job, onClose, onConfirm }: {
  job: BatchJob
  onClose: () => void
  onConfirm: (params: BatchExecParam[]) => void
}) {
  const [values, setValues] = useState<string[]>(job.params.map(() => ''))

  function updateValue(idx: number, val: string) {
    setValues((prev) => prev.map((v, i) => i === idx ? val : v))
  }

  function handleConfirm() {
    onConfirm(job.params.map((p, i) => ({ key: p.key, value: values[i] })))
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">재실행</span>
            <span className="detail-modal__subtitle">{job.jobName}</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          {job.params.length === 0 ? (
            <p className="state-msg" style={{ margin: '16px 0' }}>파라미터가 없습니다.</p>
          ) : (
            <div className="table-wrap" style={{ marginBottom: 16 }}>
              <table>
                <thead>
                  <tr><th>파라미터 키</th><th>값</th><th>설명</th></tr>
                </thead>
                <tbody>
                  {job.params.map((p, idx) => (
                    <tr key={idx}>
                      <td><code style={{ fontSize: 12 }}>{p.key}</code></td>
                      <td>
                        <input className="cc-inline-input" value={values[idx]}
                          onChange={(e) => updateValue(idx, e.target.value)}
                          placeholder="값 입력" />
                      </td>
                      <td style={{ color: '#64748b', fontSize: 12 }}>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleConfirm}>실행</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const RUN_STATUS_OPTIONS: Array<{ label: string; value: RunStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL'     },
  { label: '성공',      value: 'SUCCESS' },
  { label: '실패',      value: 'FAILED'  },
  { label: '실행중',    value: 'RUNNING' },
  { label: 'SKIPPED',   value: 'SKIPPED' },
]

const TRIGGER_OPTIONS: Array<{ label: string; value: TriggerType | 'ALL' }> = [
  { label: '전체 트리거', value: 'ALL'       },
  { label: '스케줄',      value: 'SCHEDULED' },
  { label: '수동',        value: 'MANUAL'    },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ExecFilter
  onChange: (f: ExecFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="잡명" value={filter.jobName}
        onChange={(e) => onChange({ ...filter, jobName: e.target.value })} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ExecFilter['status'] })}>
        {RUN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.triggerType}
        onChange={(e) => onChange({ ...filter, triggerType: e.target.value as ExecFilter['triggerType'] })}>
        {TRIGGER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" value={filter.from}
        onChange={(e) => onChange({ ...filter, from: e.target.value })} />
      <span style={{ alignSelf: 'center', color: '#94a3b8' }}>~</span>
      <input type="date" value={filter.to}
        onChange={(e) => onChange({ ...filter, to: e.target.value })} />
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ execs }: { execs: BatchExecution[] }) {
  const success = execs.filter((e) => e.status === 'SUCCESS').length
  const failed  = execs.filter((e) => e.status === 'FAILED').length
  const running = execs.filter((e) => e.status === 'RUNNING').length
  const skipped = execs.filter((e) => e.status === 'SKIPPED').length

  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{execs.length}건</div>
      </div>
      {success > 0 && (
        <div className="summary-card">
          <div className="summary-card__label">성공</div>
          <div className="summary-card__count">{success}건</div>
        </div>
      )}
      {failed > 0 && (
        <div className="summary-card summary-card--warn">
          <div className="summary-card__label">⚠ 실패</div>
          <div className="summary-card__count">{failed}건</div>
        </div>
      )}
      {running > 0 && (
        <div className="summary-card summary-card--info">
          <div className="summary-card__label">실행중</div>
          <div className="summary-card__count">{running}건</div>
        </div>
      )}
      {skipped > 0 && (
        <div className="summary-card summary-card--muted">
          <div className="summary-card__label">SKIPPED</div>
          <div className="summary-card__count">{skipped}건</div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ExecTable
// ---------------------------------------------------------------------------

function ExecTable({ execs, onJobNameClick, onRerun }: {
  execs: BatchExecution[]
  onJobNameClick: (jobId: string) => void
  onRerun: (exec: BatchExecution) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>실행 ID</th>
            <th>잡명</th>
            <th>시작 일시</th>
            <th>종료 일시</th>
            <th>소요(초)</th>
            <th>상태</th>
            <th>트리거</th>
            <th>실행자</th>
            <th>재실행</th>
          </tr>
        </thead>
        <tbody>
          {execs.map((e) => (
            <tr
              key={e.executionId}
              data-exec-running={e.status === 'RUNNING' ? 'true' : undefined}
              data-exec-failed={e.status === 'FAILED' ? 'true' : undefined}
            >
              <td>{e.executionId}</td>
              <td>
                <span className="link-cell"
                  onClick={(ev) => { ev.stopPropagation(); onJobNameClick(e.jobId) }}>
                  {e.jobName}
                </span>
              </td>
              <td>{e.startedAt}</td>
              <td>{e.endedAt ?? '—'}</td>
              <td>{e.durationSec !== null ? e.durationSec : '—'}</td>
              <td><RunStatusBadge status={e.status} /></td>
              <td>
                <span className="badge" data-trigger={e.triggerType}>
                  {e.triggerType === 'SCHEDULED' ? '스케줄' : '수동'}
                </span>
              </td>
              <td>{e.triggeredBy}</td>
              <td>
                <button
                  className="btn-tool"
                  style={{ height: 26, padding: '0 8px', fontSize: 12 }}
                  onClick={() => onRerun(e)}
                >
                  재실행
                </button>
              </td>
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

export default function BatchJobMonitor({ currentUser = 'guest' }: { currentUser?: string }) {
  const [allJobs, setAllJobs]             = useState<BatchJob[]>(MOCK_BATCH_JOBS)
  const [allExecutions, setAllExecutions] = useState<BatchExecution[]>(MOCK_EXECUTIONS)
  const [detailJob, setDetailJob]         = useState<BatchJob | null>(null)
  const [rerunTarget, setRerunTarget]     = useState<BatchJob | null>(null)
  const [filter, setFilter]               = useState<ExecFilter>({ jobName: '', status: 'ALL', triggerType: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed]         = useState<BatchExecution[]>([])
  const [loading, setLoading]             = useState(false)
  const [searched, setSearched]           = useState(false)
  const [page, setPage]                   = useState(1)
  const [pageSize, setPageSize]           = useState(7)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterExecutions(allExecutions, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleRerun(exec: BatchExecution) {
    const job = allJobs.find((j) => j.jobId === exec.jobId)
    if (job) setRerunTarget(job)
  }

  function handleJobNameClick(jobId: string) {
    const job = allJobs.find((j) => j.jobId === jobId)
    if (job) setDetailJob(job)
  }

  function handleRerunConfirm(params: BatchExecParam[]) {
    if (!rerunTarget) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const newExec: BatchExecution = {
      executionId:   `EXEC-${Date.now()}`,
      jobId:         rerunTarget.jobId,
      jobName:       rerunTarget.jobName,
      startedAt:     now,
      endedAt:       null,
      status:        'RUNNING',
      triggerType:   'MANUAL',
      triggeredBy:   currentUser,
      durationSec:   null,
      processedCount: 0,
      errorCount:    0,
      params,
    }
    const next = [newExec, ...allExecutions]
    setAllExecutions(next)
    setDisplayed(filterExecutions(next, filter))
    setPage(1)
    setRerunTarget(null)
  }

  function handleJobUpdate(updated: BatchJob) {
    setAllJobs((prev) => prev.map((j) => j.jobId === updated.jobId ? updated : j))
    setDetailJob(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">배치잡 모니터링</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          {displayed.length > 0 && (
            <div className="op-summary-row">
              <SummaryBar execs={displayed} />
            </div>
          )}
          {displayed.length > 0
            ? <>
                <ExecTable execs={pageItems} onJobNameClick={handleJobNameClick} onRerun={handleRerun} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">
                  {searched
                    ? '조회된 실행 이력이 없습니다.'
                    : '조회 버튼을 눌러 실행 이력을 불러오세요.'}
                </p>
              </div>
          }
        </>
      )}

      {detailJob && (
        <BatchJobDetail
          job={detailJob}
          currentUser={currentUser}
          allExecutions={allExecutions}
          onClose={() => setDetailJob(null)}
          onUpdate={handleJobUpdate}
        />
      )}

      {rerunTarget && (
        <RerunModal
          job={rerunTarget}
          onClose={() => setRerunTarget(null)}
          onConfirm={handleRerunConfirm}
        />
      )}
    </div>
  )
}
