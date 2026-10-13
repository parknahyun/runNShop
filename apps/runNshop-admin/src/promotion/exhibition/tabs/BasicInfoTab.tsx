'use client'
import { useState } from 'react'
import {
  type Exhibition, type ExhibitionStatus,
  EXHIBITION_STATUS_LABEL,
} from '../mockData'
import { ExhibitionStatusBadge } from '../ExhibitionStatusBadge'

// ---------------------------------------------------------------------------
// BasicInfoTab
// ---------------------------------------------------------------------------

interface BasicInfoDraft {
  title: string
  status: ExhibitionStatus
  startAt: string
  endAt: string
  bannerImageUrl: string
  bannerLinkUrl: string
  displayOrder: number
}

function toDraft(ex: Exhibition): BasicInfoDraft {
  return {
    title: ex.title,
    status: ex.status,
    startAt: ex.startAt,
    endAt: ex.endAt,
    bannerImageUrl: ex.bannerImageUrl,
    bannerLinkUrl: ex.bannerLinkUrl,
    displayOrder: ex.displayOrder,
  }
}

export default function BasicInfoTab({ exhibition, currentUser, onUpdate, readOnly = false }: {
  exhibition: Exhibition
  currentUser: string
  onUpdate: (updated: Exhibition) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<BasicInfoDraft>(toDraft(exhibition))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...exhibition,
      title: draft.title,
      status: draft.status,
      startAt: draft.startAt,
      endAt: draft.endAt,
      bannerImageUrl: draft.bannerImageUrl,
      bannerLinkUrl: draft.bannerLinkUrl,
      displayOrder: draft.displayOrder,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(exhibition))
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="add-form" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>기획전명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>배너 이미지 URL</label>
              <input type="text" value={draft.bannerImageUrl}
                onChange={(e) => setDraft({ ...draft, bannerImageUrl: e.target.value })}
                placeholder="https://..." />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>배너 링크 URL</label>
              <input type="text" value={draft.bannerLinkUrl}
                onChange={(e) => setDraft({ ...draft, bannerLinkUrl: e.target.value })}
                placeholder="/exhibitions/..." />
            </div>
          </div>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>상태</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as ExhibitionStatus })}>
                {Object.entries(EXHIBITION_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="add-form__field">
              <label>노출 순서</label>
              <input type="number" min={1} value={draft.displayOrder}
                onChange={(e) => setDraft({ ...draft, displayOrder: Number(e.target.value) })} />
            </div>
            <div className="add-form__field" />
          </div>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>시작일</label>
              <input type="date" value={draft.startAt}
                onChange={(e) => setDraft({ ...draft, startAt: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>종료일</label>
              <input type="date" value={draft.endAt}
                onChange={(e) => setDraft({ ...draft, endAt: e.target.value })} />
            </div>
            <div className="add-form__field" />
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add"
              disabled={!draft.title.trim() || !draft.startAt || !draft.endAt || draft.endAt < draft.startAt}
              onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>기획전ID</dt><dd style={{ fontWeight: 600 }}>{exhibition.exhibitionId}</dd></div>
          <div className="info-row"><dt>기획전명</dt><dd style={{ fontWeight: 600 }}>{exhibition.title}</dd></div>
          <div className="info-row"><dt>노출 순서</dt><dd>{exhibition.displayOrder}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><ExhibitionStatusBadge status={exhibition.status} /></dd></div>
          <div className="info-row"><dt>배너 이미지</dt><dd style={{ fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>{exhibition.bannerImageUrl || '-'}</dd></div>
          <div className="info-row"><dt>배너 링크</dt><dd style={{ fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>{exhibition.bannerLinkUrl || '-'}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>시작일</dt><dd>{exhibition.startAt}</dd></div>
          <div className="info-row"><dt>종료일</dt><dd>{exhibition.endAt}</dd></div>
          <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{exhibition.createdBy} / {exhibition.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{exhibition.updatedBy} / {exhibition.updatedAt}</dd></div>
        </dl>
      </div>
    </>
  )
}
