'use client'
import { type Operator } from './mockData'
import { InnerTabs }      from '@/shell/shared/InnerTabs'
import BasicInfoTab    from './tabs/BasicInfoTab'
import PermissionsTab  from './tabs/PermissionsTab'
import LoginHistoryTab  from './tabs/LoginHistoryTab'
import ScreenHistoryTab from './tabs/ScreenHistoryTab'

export default function OperatorDetail({ operator, currentUser, onClose, onUpdate }: {
  operator: Operator
  currentUser: string
  onClose: () => void
  onUpdate: (updated: Operator) => void
}) {
  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">{operator.name}</span>
            <span className="detail-modal__subtitle">운영자 상세</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <InnerTabs sticky tabs={[
            {
              label:   '기본정보',
              content: <BasicInfoTab operator={operator} currentUser={currentUser} onUpdate={onUpdate} />,
            },
            {
              label:   '프로그램 접근 권한',
              content: <PermissionsTab permissions={operator.permissions} />,
            },
            {
              label:   '로그인 이력',
              content: <LoginHistoryTab history={operator.loginHistory} />,
            },
            {
              label:   '화면 접근 이력',
              content: <ScreenHistoryTab history={operator.screenHistory} />,
            },
          ]} />
        </div>
      </div>
    </div>
  )
}
