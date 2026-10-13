'use client'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { type Template, TEMPLATE_TYPE_LABEL, TEMPLATE_STATUS_LABEL } from './mockData'
import BasicInfoTab from './tabs/BasicInfoTab'
import SectionsTab from './tabs/SectionsTab'
import PagesTab from './tabs/PagesTab'

export default function TemplateDetail({ template, onClose }: {
  template: Template
  onClose: () => void
}) {
  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">템플릿 상세 - {template.templateName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>{template.templateId}</span>
              <span className="badge">{TEMPLATE_TYPE_LABEL[template.templateType]}</span>
              <span className="badge" data-product-status={template.status === 'ACTIVE' ? 'ON_SALE' : 'DRAFT'}>
                {TEMPLATE_STATUS_LABEL[template.status]}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>영역 {template.sectionCount}개</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>적용 페이지 {template.usedPageCount}개</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 본문 */}
        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본 정보', content: <BasicInfoTab template={template} /> },
            { key: 'sections', label: '영역 목록', content: <SectionsTab template={template} /> },
            { key: 'pages', label: '페이지 목록', content: <PagesTab template={template} /> },
          ]} />
        </div>
      </div>
    </div>
  )
}
