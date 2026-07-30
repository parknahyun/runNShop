'use client'
import { useState } from 'react'
import {
  type EventPrice, type EventPriceStatus,
  EVENT_PRICE_STATUS_LABEL, nextEventPriceId,
} from './mockData'

interface AddForm {
  eventName: string
  discountRate: string
  status: EventPriceStatus
  startAt: string
  endAt: string
}

const EMPTY_FORM: AddForm = { eventName: '', discountRate: '', status: 'ACTIVE', startAt: '', endAt: '' }

export default function AddEventPriceModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (item: EventPrice) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)

  function canAdd() {
    return form.eventName.trim() !== '' && Number(form.discountRate) > 0
      && form.startAt !== '' && form.endAt !== '' && form.endAt >= form.startAt
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const item: EventPrice = {
      eventPriceId: nextEventPriceId(),
      eventName: form.eventName.trim(),
      discountRate: Number(form.discountRate),
      startAt: form.startAt.replace('T', ' '),
      endAt: form.endAt.replace('T', ' '),
      status: form.status,
      products: [],
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(item)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">즉시할인 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>행사명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.eventName}
                  onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                  placeholder="예) 여름 러닝화 특가" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>기본 할인율(%) <span className="add-form__req">*</span></label>
                <input type="number" min={1} max={100} value={form.discountRate}
                  onChange={(e) => setForm({ ...form, discountRate: e.target.value })}
                  placeholder="예) 30" />
              </div>
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as EventPriceStatus })}>
                  {Object.entries(EVENT_PRICE_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>시작 일시 <span className="add-form__req">*</span></label>
                <input type="datetime-local" value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>종료 일시 <span className="add-form__req">*</span></label>
                <input type="datetime-local" value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
              </div>
            </div>

            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" disabled={!canAdd()} onClick={handleAdd}>등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
