'use client'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { type SectionItem, SECTION_STATUS_LABEL } from './mockData'
import BasicInfoTab from './tabs/BasicInfoTab'
import FieldsTab from './tabs/FieldsTab'

interface Props {
  section: SectionItem
  onClose: () => void
}

export default function SectionDetail({ section, onClose }: Props) {
  const fieldCount = getFieldCount(section.type)

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">섹션 상세 - {section.sectionName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>{section.sectionCode}</span>
              <span className="badge" data-product-status={section.status === 'ACTIVE' ? 'ON_SALE' : section.status === 'INACTIVE' ? 'DRAFT' : 'DISCONTINUED'}>
                {SECTION_STATUS_LABEL[section.status]}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: section.previewColor, border: '1px solid #e2e8f0' }} />
                {section.previewColor}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>필드 {fieldCount}개</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 본문 */}
        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본 정보', content: <BasicInfoTab section={section} /> },
            { key: 'fields', label: '필드 관리', content: <FieldsTab section={section} /> },
          ]} />
        </div>
      </div>
    </div>
  )
}

function getFieldCount(type: string): number {
  const counts: Record<string, number> = {
    BANNER: 4, PRODUCT_GRID: 3, PRODUCT_CAROUSEL: 3,
    TEXT: 2, IMAGE_LINK: 3, COUNTDOWN: 2, COUPON_BAND: 3, DIVIDER: 2,
  }
  return counts[type] || 1
}
