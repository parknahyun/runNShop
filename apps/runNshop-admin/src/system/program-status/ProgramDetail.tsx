'use client'
import { type Program } from './mockData'
import { InnerTabs }    from '@/shell/shared/InnerTabs'
import BasicInfoTab from './tabs/BasicInfoTab'
import CallLogTab   from './tabs/CallLogTab'

export default function ProgramDetail({ program, currentUser, onClose, onUpdate }: {
  program: Program
  currentUser: string
  onClose: () => void
  onUpdate: (updated: Program) => void
}) {
  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">{program.name}</span>
            <span className="detail-modal__subtitle">프로그램 상세</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <InnerTabs sticky tabs={[
            {
              label:   '기본정보',
              content: <BasicInfoTab program={program} currentUser={currentUser} onUpdate={onUpdate} />,
            },
            {
              label:   `최근 호출 로그 (${program.logs.length})`,
              content: <CallLogTab program={program} />,
            },
          ]} />
        </div>
      </div>
    </div>
  )
}
