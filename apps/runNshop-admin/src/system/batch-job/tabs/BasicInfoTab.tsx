'use client'
import { useState, useEffect, useId } from 'react'
import { type BatchJob, type BatchJobStatus as BatchJobStatusType, type RunStatus } from '../mockData'

function JobStatusBadge({ status }: { status: BatchJobStatusType }) {
  const label: Record<BatchJobStatusType, string> = { ACTIVE: '활성', INACTIVE: '비활성' }
  return <span className="badge" data-job-status={status}>{label[status]}</span>
}

function RunStatusBadge({ status }: { status: RunStatus | null }) {
  if (status === null) return <span className="badge" data-run-status="SKIPPED">—</span>
  const label: Record<RunStatus, string> = {
    SUCCESS: '성공', FAILED: '실패', RUNNING: '실행중', SKIPPED: 'SKIPPED',
  }
  return <span className="badge" data-run-status={status}>{label[status]}</span>
}

interface EditDraft {
  status: BatchJobStatusType
  jobName: string
  jobClass: string
  schedule: string
  scheduleDesc: string
  description: string
}

function toDraft(job: BatchJob): EditDraft {
  return {
    status:       job.status,
    jobName:      job.jobName,
    jobClass:     job.jobClass,
    schedule:     job.schedule,
    scheduleDesc: job.scheduleDesc,
    description:  job.description,
  }
}

export default function BasicInfoTab({ job, currentUser, onUpdate }: {
  job: BatchJob
  currentUser: string
  onUpdate: (updated: BatchJob) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState<EditDraft>(toDraft(job))
  const uid = useId()

  useEffect(() => {
    setDraft(toDraft(job))
  }, [job])

  function fid(key: keyof EditDraft) { return `${uid}-${key}` }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: '14px 0 0' }}>

        <div className="add-form__row">
          <div className="add-form__field">
            <label>상태</label>
            <div className="pgm-status-radio">
              {(['ACTIVE', 'INACTIVE'] as BatchJobStatusType[]).map((s) => (
                <label key={s} className={`pgm-status-radio__item${draft.status === s ? ' pgm-status-radio__item--on' : ''}`}>
                  <input type="radio" name={fid('status')} value={s}
                    checked={draft.status === s}
                    onChange={() => setDraft({ ...draft, status: s })} />
                  {s === 'ACTIVE' ? '활성' : '비활성'}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('jobName')}>잡명 <span className="add-form__req">*</span></label>
            <input id={fid('jobName')} type="text" value={draft.jobName}
              onChange={(e) => setDraft({ ...draft, jobName: e.target.value })} />
          </div>
          <div className="add-form__field">
            <label htmlFor={fid('jobClass')}>잡 클래스</label>
            <input id={fid('jobClass')} type="text" value={draft.jobClass}
              onChange={(e) => setDraft({ ...draft, jobClass: e.target.value })} />
          </div>
        </div>

        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('schedule')}>스케줄 (cron)</label>
            <input id={fid('schedule')} type="text" value={draft.schedule}
              onChange={(e) => setDraft({ ...draft, schedule: e.target.value })} />
          </div>
          <div className="add-form__field">
            <label htmlFor={fid('scheduleDesc')}>스케줄 설명</label>
            <input id={fid('scheduleDesc')} type="text" value={draft.scheduleDesc}
              onChange={(e) => setDraft({ ...draft, scheduleDesc: e.target.value })} />
          </div>
        </div>

        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('description')}>설명</label>
            <input id={fid('description')} type="text" value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
        </div>

        <div className="add-form__footer">
          <button className="btn-tool btn-tool--cancel"
            onClick={() => { setDraft(toDraft(job)); setEditing(false) }}>취소</button>
          <button className="btn-tool btn-tool--add"
            onClick={() => {
              const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
              onUpdate({ ...job, ...draft, updatedBy: currentUser, updatedAt: now })
              setEditing(false)
            }}>저장</button>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle"
          style={{ height: 28, padding: '0 10px', fontSize: 12 }}
          onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid">
        <dl className="info-dl">
          <div className="info-row"><dt>잡 ID</dt><dd>{job.jobId}</dd></div>
          <div className="info-row"><dt>잡명</dt><dd>{job.jobName}</dd></div>
          <div className="info-row"><dt>잡 클래스</dt><dd>{job.jobClass}</dd></div>
          <div className="info-row"><dt>스케줄 (cron)</dt><dd>{job.schedule}</dd></div>
          <div className="info-row"><dt>스케줄 설명</dt><dd>{job.scheduleDesc}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><JobStatusBadge status={job.status} /></dd></div>
          <div className="info-row"><dt>마지막 실행</dt><dd>{job.lastRunAt}</dd></div>
          <div className="info-row"><dt>마지막 결과</dt><dd><RunStatusBadge status={job.lastRunStatus} /></dd></div>
          <div className="info-row"><dt>다음 실행</dt><dd>{job.nextRunAt}</dd></div>
          <div className="info-row"><dt>최초등록</dt><dd>{job.createdBy} / {job.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd>{job.updatedBy} / {job.updatedAt}</dd></div>
        </dl>
      </div>
      {job.description && <p className="pgm-desc">{job.description}</p>}
    </div>
  )
}
