'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import {
  type PageItem, type PageSection,
  PAGE_TYPE_LABEL, PAGE_STATUS_LABEL,
  getSectionLabel, getSectionColor,
} from './mockData'
import BasicInfoTab from './tabs/BasicInfoTab'
import SectionsTab from './tabs/SectionsTab'

// ---------------------------------------------------------------------------
// MobilePreview
// ---------------------------------------------------------------------------

function MobilePreview({ sections }: { sections: PageSection[] }) {
  return (
    <div className="mobile-preview-wrap">
      <div className="mobile-frame">
        <div className="mobile-frame__bar">
          <div className="mobile-frame__dot" />
        </div>
        <div className="mobile-frame__screen">
          {sections.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
              섹션이 없습니다.
            </div>
          ) : (
            sections.map((sec) => {
              const opacity = sec.visible ? 1 : 0.3
              const bgColor = getSectionColor(sec.sectionType)

              // 기본 블록 렌더링 (섹션 코드에 관계없이 색상+이름으로 표시)
              return (
                <div key={sec.sectionId} className="mobile-section-block"
                  style={{ minHeight: 40, background: bgColor, opacity, padding: '8px 12px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{sec.sectionName}</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{getSectionLabel(sec.sectionType)}</span>
                  {!sec.visible && <span className="mobile-section-block__label">숨김</span>}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChangeLog
// ---------------------------------------------------------------------------

interface PageChangeLog {
  logId: string
  changedAt: string
  changedBy: string
  description: string
}

// ---------------------------------------------------------------------------
// PageDetail
// ---------------------------------------------------------------------------

export default function PageDetail({ eventPage: initialPage, currentUser, onClose, onUpdate }: {
  eventPage: PageItem
  currentUser: string
  onClose: () => void
  onUpdate: (updated: PageItem) => void
}) {
  const [eventPage, setPage] = useState<PageItem>(initialPage)
  const [changeLogs, setChangeLogs] = useState<PageChangeLog[]>([])
  function appendLog(description: string) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    setChangeLogs((prev) => [{
      logId: `PGLOG-${String(prev.length + 1).padStart(3, '0')}`,
      changedAt: now,
      changedBy: currentUser,
      description,
    }, ...prev])
  }

  function handleBasicUpdate(updated: PageItem) {
    setPage(updated)
    onUpdate(updated)
    appendLog(`기본 정보 수정 (상태: ${PAGE_STATUS_LABEL[updated.status]})`)
  }

  function handleSectionUpdate(sections: PageSection[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated: PageItem = { ...eventPage, sections, updatedBy: currentUser, updatedAt: now }
    setPage(updated)
    onUpdate(updated)
    appendLog(`영역 구성 변경 (총 ${sections.length}개)`)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">{eventPage.pageName}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>{eventPage.pageId}</span>
          <span className="badge">{PAGE_TYPE_LABEL[eventPage.pageType]}</span>
          <span className="badge" data-product-status={eventPage.status === 'PUBLISHED' ? 'ON_SALE' : eventPage.status === 'SCHEDULED' ? 'RESERVED' : 'DRAFT'}>
            {PAGE_STATUS_LABEL[eventPage.status]}
          </span>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {eventPage.startAt} ~ {eventPage.endAt}
          </span>
        </div>
      </div>
      <div className="detail-content" style={{ padding: 0, height: 'calc(100vh - 150px)' }}>
            <InnerTabs tabs={[
              {
                key: 'basic',
                label: '기본정보',
                content: (
                  <div className="tab-panel-content">
                    <BasicInfoTab
                      eventPage={eventPage}
                      currentUser={currentUser}
                      onUpdate={handleBasicUpdate}
                    />
                  </div>
                ),
              },
              {
                key: 'sections',
                label: '섹션편집기',
                content: (
                  <div className="tab-panel-content">
                    <SectionsTab
                      eventPage={eventPage}
                      onSave={handleSectionUpdate}
                    />
                  </div>
                ),
              },
              {
                key: 'preview',
                label: '미리보기',
                content: (
                  <div className="tab-panel-content">
                    <MobilePreview sections={eventPage.sections} />
                  </div>
                ),
              },
              {
                key: 'logs',
                label: `변경이력 (${changeLogs.length})`,
                content: (
                  <div className="tab-panel-content">
                    {changeLogs.length === 0 ? (
                      <p className="state-msg" style={{ padding: '20px 0', fontSize: 13 }}>변경 이력이 없습니다.</p>
                    ) : (
                      <div className="table-wrap" style={{ marginBottom: 0 }}>
                        <table>
                          <thead>
                            <tr>
                              <th>변경일시</th>
                              <th>변경자</th>
                              <th>변경 내용</th>
                            </tr>
                          </thead>
                          <tbody>
                            {changeLogs.map((log) => (
                              <tr key={log.logId}>
                                <td style={{ fontSize: 12, color: '#64748b' }}>{log.changedAt}</td>
                                <td style={{ fontSize: 12 }}>{log.changedBy}</td>
                                <td style={{ fontSize: 13 }}>{log.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ),
              },
            ]} />
          </div>
    </div>
  )
}
