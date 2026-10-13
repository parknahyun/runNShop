'use client'
import { useState, useId } from 'react'
import {
  type BatchJob, type BatchExecution, type BatchJobStatus as BatchJobStatusType,
  type RunStatus, type JobFilter,
  MOCK_BATCH_JOBS, MOCK_EXECUTIONS, filterJobs,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import BatchJobDetail from './BatchJobDetail'

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function RunStatusBadge({ status }: { status: RunStatus | null }) {
  if (status === null) return <span className="badge" data-run-status="SKIPPED">—</span>
  const label: Record<RunStatus, string> = {
    SUCCESS: '성공', FAILED: '실패', RUNNING: '실행중', SKIPPED: 'SKIPPED',
  }
  return <span className="badge" data-run-status={status}>{label[status]}</span>
}

function JobStatusBadge({ status }: { status: BatchJobStatusType }) {
  const label: Record<BatchJobStatusType, string> = { ACTIVE: '활성', INACTIVE: '비활성' }
  return <span className="badge" data-job-status={status}>{label[status]}</span>
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const JOB_STATUS_OPTIONS: Array<{ label: string; value: BatchJobStatusType | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL'      },
  { label: '활성',      value: 'ACTIVE'   },
  { label: '비활성',    value: 'INACTIVE' },
]

const RUN_STATUS_OPTIONS: Array<{ label: string; value: RunStatus | 'ALL' }> = [
  { label: '전체 결과', value: 'ALL'     },
  { label: '성공',      value: 'SUCCESS' },
  { label: '실패',      value: 'FAILED'  },
  { label: '실행중',    value: 'RUNNING' },
  { label: 'SKIPPED',   value: 'SKIPPED' },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: JobFilter
  onChange: (f: JobFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="잡명" value={filter.jobName}
        onChange={(e) => onChange({ ...filter, jobName: e.target.value })} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as JobFilter['status'] })}>
        {JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.lastRunStatus}
        onChange={(e) => onChange({ ...filter, lastRunStatus: e.target.value as JobFilter['lastRunStatus'] })}>
        {RUN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ jobs }: { jobs: BatchJob[] }) {
  const active   = jobs.filter((j) => j.status === 'ACTIVE').length
  const inactive = jobs.filter((j) => j.status === 'INACTIVE').length
  const failed   = jobs.filter((j) => j.status === 'ACTIVE' && j.lastRunStatus === 'FAILED').length

  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{jobs.length}개</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">활성</div>
        <div className="summary-card__count">{active}개</div>
      </div>
      {inactive > 0 && (
        <div className="summary-card summary-card--muted">
          <div className="summary-card__label">비활성</div>
          <div className="summary-card__count">{inactive}개</div>
        </div>
      )}
      {failed > 0 && (
        <div className="summary-card summary-card--warn">
          <div className="summary-card__label">⚠ 실패</div>
          <div className="summary-card__count">{failed}개</div>
        </div>
      )}
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 배치잡 추가</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// JobTable
// ---------------------------------------------------------------------------

function JobTable({ jobs, onRowClick }: {
  jobs: BatchJob[]
  onRowClick: (job: BatchJob) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>잡 ID</th>
            <th>잡명</th>
            <th>스케줄</th>
            <th>상태</th>
            <th>마지막 실행</th>
            <th>마지막 결과</th>
            <th>다음 실행</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.jobId}
              onClick={() => onRowClick(job)}
              data-job-running={job.lastRunStatus === 'RUNNING' ? 'true' : undefined}
            >
              <td className="link-cell">{job.jobId}</td>
              <td>{job.jobName}</td>
              <td title={job.schedule}>{job.scheduleDesc}</td>
              <td><JobStatusBadge status={job.status} /></td>
              <td>{job.lastRunAt}</td>
              <td><RunStatusBadge status={job.lastRunStatus} /></td>
              <td>{job.nextRunAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddJobModal
// ---------------------------------------------------------------------------

interface AddForm {
  jobName: string; jobClass: string; schedule: string; scheduleDesc: string; description: string
}

const EMPTY_ADD_FORM: AddForm = {
  jobName: '', jobClass: '', schedule: '', scheduleDesc: '', description: '',
}

function AddJobModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (job: BatchJob) => void
}) {
  const uid = useId()
  const [form, setForm]     = useState<AddForm>(EMPTY_ADD_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AddForm, string>>>({})

  function f(key: keyof AddForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.jobName.trim())  e.jobName  = '필수'
    if (!form.jobClass.trim()) e.jobClass = '필수'
    if (!form.schedule.trim()) e.schedule = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const maxNum = MOCK_BATCH_JOBS.reduce((acc, j) => {
      const n = parseInt(j.jobId.replace('BATCH-', ''), 10)
      return isNaN(n) ? acc : Math.max(acc, n)
    }, 0)
    const jobId = `BATCH-${String(maxNum + 1).padStart(3, '0')}`
    onSubmit({
      jobId,
      jobName:      form.jobName.trim(),
      description:  form.description.trim(),
      jobClass:     form.jobClass.trim(),
      schedule:     form.schedule.trim(),
      scheduleDesc: form.scheduleDesc.trim(),
      status:       'ACTIVE',
      lastRunAt:    '—',
      lastRunStatus: null,
      nextRunAt:    '—',
      params:       [],
      createdBy:    'guest',
      createdAt:    now,
      updatedBy:    'guest',
      updatedAt:    now,
    })
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">배치잡 추가</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('jobName')}>잡명 <span className="add-form__req">*</span></label>
                <input id={f('jobName')} type="text" placeholder="예) 주문 마감 처리"
                  value={form.jobName} onChange={(e) => setForm({ ...form, jobName: e.target.value })} />
                {errors.jobName && <span className="add-form__err">{errors.jobName}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('jobClass')}>잡 클래스 <span className="add-form__req">*</span></label>
                <input id={f('jobClass')} type="text" placeholder="예) com.commerce.batch.order.OrderJob"
                  value={form.jobClass} onChange={(e) => setForm({ ...form, jobClass: e.target.value })} />
                {errors.jobClass && <span className="add-form__err">{errors.jobClass}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('schedule')}>스케줄 (cron) <span className="add-form__req">*</span></label>
                <input id={f('schedule')} type="text" placeholder="예) 0 0 1 * * ?"
                  value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
                {errors.schedule && <span className="add-form__err">{errors.schedule}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('scheduleDesc')}>스케줄 설명</label>
                <input id={f('scheduleDesc')} type="text" placeholder="예) 매일 01:00"
                  value={form.scheduleDesc} onChange={(e) => setForm({ ...form, scheduleDesc: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('description')}>설명</label>
                <input id={f('description')} type="text" placeholder="배치잡 설명을 입력하세요"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSubmit}>등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BatchJobStatus({ currentUser = 'guest' }: { currentUser?: string }) {
  const [allJobs, setAllJobs]     = useState<BatchJob[]>(MOCK_BATCH_JOBS)
  const [allExecutions]           = useState<BatchExecution[]>(MOCK_EXECUTIONS)
  const [filter, setFilter]       = useState<JobFilter>({ jobName: '', status: 'ALL', lastRunStatus: 'ALL' })
  const [displayed, setDisplayed] = useState<BatchJob[]>([])
  const [loading, setLoading]     = useState(false)
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(7)
  const [detailJob, setDetailJob] = useState<BatchJob | null>(null)
  const [showAdd, setShowAdd]     = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterJobs(allJobs, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleAdd(job: BatchJob) {
    const next = [...allJobs, job]
    setAllJobs(next)
    setDisplayed(filterJobs(next, filter))
    setShowAdd(false)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">배치 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar jobs={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0
            ? <>
                <JobTable jobs={pageItems} onRowClick={(job) => setDetailJob(job)} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 배치잡 목록을 불러오세요.</p>
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
          onUpdate={(updated) => {
            const next = allJobs.map((j) => j.jobId === updated.jobId ? updated : j)
            setAllJobs(next)
            setDisplayed(filterJobs(next, filter))
            setDetailJob(updated)
          }}
        />
      )}

      {showAdd && (
        <AddJobModal
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  )
}
