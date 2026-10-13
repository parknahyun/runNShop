'use client'
import { useState } from 'react'
import { type CodeGroup, type DetailCode } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import BasicInfoTab, { type EditGroupDraft } from './tabs/BasicInfoTab'
import DetailCodeTab from './tabs/DetailCodeTab'

export default function CodeGroupDetail({ group, currentUser, onClose, onUpdate }: {
  group: CodeGroup
  currentUser: string
  onClose: () => void
  onUpdate: (updated: CodeGroup) => void
}) {
  const [codes, setCodes] = useState<DetailCode[]>(group.codes)

  function handleBasicSave(draft: EditGroupDraft) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onUpdate({ ...group, ...draft, codes, updatedBy: currentUser, updatedAt: now })
  }

  function handleCodesChange(updated: DetailCode[]) {
    setCodes(updated)
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onUpdate({ ...group, codes: updated, updatedBy: currentUser, updatedAt: now })
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">{group.groupName}</span>
            <span className="detail-modal__subtitle">그룹코드 상세</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <InnerTabs sticky tabs={[
            {
              label:   '기본정보',
              content: <BasicInfoTab group={group} codesCount={codes.length} onSave={handleBasicSave} />,
            },
            {
              label:   `상세코드 목록 (${codes.length})`,
              content: <DetailCodeTab codes={codes} onCodesChange={handleCodesChange} />,
            },
          ]} />
        </div>
      </div>
    </div>
  )
}
