'use client'
import { type BatchJob, type BatchExecution } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import BasicInfoTab   from './tabs/BasicInfoTab'
import ParamTab       from './tabs/ParamTab'
import ExecHistoryTab from './tabs/ExecHistoryTab'

export default function BatchJobDetail({ job, currentUser, allExecutions, onClose, onUpdate }: {
  job: BatchJob
  currentUser: string
  allExecutions: BatchExecution[]
  onClose: () => void
  onUpdate: (updated: BatchJob) => void
}) {
  const executions = allExecutions.filter((e) => e.jobId === job.jobId)

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">{job.jobName}</span>
            <span className="detail-modal__subtitle">배치잡 상세</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <InnerTabs sticky tabs={[
            {
              label:   '기본정보',
              content: <BasicInfoTab job={job} currentUser={currentUser} onUpdate={onUpdate} />,
            },
            {
              label:   `파라미터 (${job.params.length})`,
              content: <ParamTab job={job} currentUser={currentUser} onUpdate={onUpdate} />,
            },
            {
              label:   `실행 이력 (${executions.length})`,
              content: <ExecHistoryTab executions={executions} />,
            },
          ]} />
        </div>
      </div>
    </div>
  )
}
