'use client'
import { useState } from 'react'
import {
  type PageItem, type PageType, type PageStatus,
  PAGE_TYPE_LABEL, PAGE_STATUS_LABEL,
} from '../mockData'
import { PageStatusBadge } from '../PageStatusBadge'

// ---------------------------------------------------------------------------
// BasicInfoTab
// ---------------------------------------------------------------------------

interface BasicInfoDraft {
  pageName: string
  slug: string
  pageType: PageType
  status: PageStatus
  startAt: string
  endAt: string
}

function toDraft(p: PageItem): BasicInfoDraft {
  return {
    pageName: p.pageName,
    slug: p.slug,
    pageType: p.pageType,
    status: p.status,
    startAt: p.startAt,
    endAt: p.endAt,
  }
}

export default function BasicInfoTab({ eventPage, currentUser, onUpdate, readOnly = false }: {
  eventPage: PageItem
  currentUser: string
  onUpdate: (updated: PageItem) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<BasicInfoDraft>(toDraft(eventPage))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...eventPage,
      pageName: draft.pageName,
      slug: draft.slug,
      pageType: draft.pageType,
      status: draft.status,
      startAt: draft.startAt,
      endAt: draft.endAt,
      publishedAt: draft.status === 'PUBLISHED' && !eventPage.publishedAt ? now : eventPage.publishedAt,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(eventPage))
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="add-form" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>페이지명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.pageName}
                onChange={(e) => setDraft({ ...draft, pageName: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>Slug</label>
              <input type="text" value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="예) my-page-slug" />
            </div>
          </div>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>페이지 유형</label>
              <select value={draft.pageType}
                onChange={(e) => setDraft({ ...draft, pageType: e.target.value as PageType })}>
                {Object.entries(PAGE_TYPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="add-form__field">
              <label>상태</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as PageStatus })}>
                {Object.entries(PAGE_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="add-form__field" />
          </div>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>시작 일시</label>
              <input type="datetime-local" value={draft.startAt.replace(' ', 'T')}
                onChange={(e) => setDraft({ ...draft, startAt: e.target.value.replace('T', ' ') })} />
            </div>
            <div className="add-form__field">
              <label>종료 일시</label>
              <input type="datetime-local" value={draft.endAt.replace(' ', 'T')}
                onChange={(e) => setDraft({ ...draft, endAt: e.target.value.replace('T', ' ') })} />
            </div>
            <div className="add-form__field" />
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add"
              disabled={!draft.pageName.trim() || !draft.startAt || !draft.endAt}
              onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        {!readOnly && (
          <button className="btn-tool btn-tool--toggle" onClick={() => setEditing(true)}>편집</button>
        )}
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>페이지 ID</dt><dd style={{ fontWeight: 600 }}>{eventPage.pageId}</dd></div>
          <div className="info-row"><dt>페이지명</dt><dd style={{ fontWeight: 600 }}>{eventPage.pageName}</dd></div>
          <div className="info-row"><dt>Slug</dt><dd style={{ fontFamily: 'monospace', fontSize: 12 }}>{eventPage.slug}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>유형</dt><dd><span className="badge">{PAGE_TYPE_LABEL[eventPage.pageType]}</span></dd></div>
          <div className="info-row"><dt>상태</dt><dd><PageStatusBadge status={eventPage.status} /></dd></div>
          <div className="info-row"><dt>적용 템플릿</dt><dd>{eventPage.templateName}</dd></div>
          <div className="info-row"><dt>게시일시</dt><dd>{eventPage.publishedAt || '-'}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>시작 일시</dt><dd>{eventPage.startAt}</dd></div>
          <div className="info-row"><dt>종료 일시</dt><dd>{eventPage.endAt}</dd></div>
          <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{eventPage.createdBy} / {eventPage.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{eventPage.updatedBy} / {eventPage.updatedAt}</dd></div>
        </dl>
      </div>
    </>
  )
}
