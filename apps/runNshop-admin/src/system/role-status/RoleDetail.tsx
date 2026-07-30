'use client'
import { type Role } from './mockData'
import { InnerTabs }  from '@/shell/shared/InnerTabs'
import BasicInfoTab   from './tabs/BasicInfoTab'
import PermissionsTab from './tabs/PermissionsTab'
import MembersTab     from './tabs/MembersTab'

export default function RoleDetail({ role, currentUser, onSave, onClose }: {
  role: Role; currentUser: string; onSave: (updated: Role) => void; onClose: () => void
}) {
  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">{role.name}</span>
            <span className="detail-modal__subtitle">권한 상세</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <InnerTabs sticky tabs={[
            {
              label:   '기본정보',
              content: <BasicInfoTab role={role} currentUser={currentUser} onSave={onSave} />,
            },
            {
              label:   `프로그램 접근 권한 (${role.permissions.length})`,
              content: <PermissionsTab role={role} currentUser={currentUser} onSave={onSave} />,
            },
            {
              label:   `소속 운영자 (${role.memberCount})`,
              content: <MembersTab role={role} currentUser={currentUser} onSave={onSave} />,
            },
          ]} />
        </div>
      </div>
    </div>
  )
}
