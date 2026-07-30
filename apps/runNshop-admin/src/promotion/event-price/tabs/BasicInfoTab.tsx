'use client'
import { useState } from 'react'
import { type EventPrice, type EventPriceStatus, EVENT_PRICE_STATUS_LABEL } from '../mockData'
import { EventPriceStatusBadge } from '../EventPriceStatusBadge'

interface Draft {
  eventName: string
  discountRate: string
  status: EventPriceStatus
  startAt: string
  endAt: string
}

function toDraft(e: EventPrice): Draft {
  return { eventName: e.eventName, discountRate: String(e.discountRate), status: e.status, startAt: e.startAt, endAt: e.endAt }
}

export default function BasicInfoTab({ eventPrice, currentUser, onUpdate, readOnly = false }: {
  eventPrice: EventPrice
  currentUser: string
  onUpdate: (updated: EventPrice) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(eventPrice))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...eventPrice,
      eventName: draft.eventName,
      discountRate: Number(draft.discountRate),
      status: draft.status,
      startAt: draft.startAt,
      endAt: draft.endAt,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(eventPrice))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="add-form" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>행사명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.eventName}
                onChange={(e) => setDraft({ ...draft, eventName: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>기본 할인율(%) <span className="add-form__req">*</span></label>
              <input type="number" min={1} max={100} value={draft.discountRate}
                onChange={(e) => setDraft({ ...draft, discountRate: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>상태</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as EventPriceStatus })}>
                {Object.entries(EVENT_PRICE_STATUS_LABEL).map(([k, v]) => (
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
              disabled={!draft.eventName.trim() || !Number(draft.discountRate) || !draft.startAt || !draft.endAt || draft.endAt < draft.startAt}
              onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>즉시할인ID</dt><dd style={{ fontWeight: 600 }}>{eventPrice.eventPriceId}</dd></div>
          <div className="info-row"><dt>행사명</dt><dd style={{ fontWeight: 600 }}>{eventPrice.eventName}</dd></div>
          <div className="info-row"><dt>기본 할인율</dt><dd style={{ fontWeight: 600, color: '#dc2626' }}>{eventPrice.discountRate}%</dd></div>
          <div className="info-row"><dt>상태</dt><dd><EventPriceStatusBadge status={eventPrice.status} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>적용상품</dt><dd>{eventPrice.products.length}건</dd></div>
          <div className="info-row"><dt>시작 일시</dt><dd>{eventPrice.startAt}</dd></div>
          <div className="info-row"><dt>종료 일시</dt><dd>{eventPrice.endAt}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{eventPrice.createdBy} / {eventPrice.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{eventPrice.updatedBy} / {eventPrice.updatedAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
