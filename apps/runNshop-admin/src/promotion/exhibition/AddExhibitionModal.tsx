'use client'
import { useState } from 'react'
import {
  type Exhibition, type ExhibitionStatus,
  EXHIBITION_STATUS_LABEL, MOCK_EXHIBITIONS, nextExhibitionId,
} from './mockData'

interface AddExhibitionForm {
  title: string
  status: ExhibitionStatus
  startAt: string
  endAt: string
  bannerImageUrl: string
  bannerLinkUrl: string
}

const EMPTY_FORM: AddExhibitionForm = {
  title: '', status: 'DRAFT', startAt: '', endAt: '', bannerImageUrl: '', bannerLinkUrl: '',
}

export default function AddExhibitionModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (exhibition: Exhibition) => void
}) {
  const [form, setForm] = useState<AddExhibitionForm>(EMPTY_FORM)

  function canAdd() {
    return form.title.trim() !== '' && form.startAt !== '' && form.endAt !== '' && form.endAt >= form.startAt
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const exhibition: Exhibition = {
      exhibitionId: nextExhibitionId(),
      title: form.title.trim(),
      status: form.status,
      startAt: form.startAt,
      endAt: form.endAt,
      bannerImageUrl: form.bannerImageUrl.trim(),
      bannerLinkUrl: form.bannerLinkUrl.trim(),
      displayOrder: MOCK_EXHIBITIONS.length + 1,
      products: [],
      promotions: [],
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(exhibition)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">기획전 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>기획전명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="기획전명 입력" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>배너 이미지 URL</label>
                <input type="text" value={form.bannerImageUrl}
                  onChange={(e) => setForm({ ...form, bannerImageUrl: e.target.value })}
                  placeholder="https://..." />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>배너 링크 URL</label>
                <input type="text" value={form.bannerLinkUrl}
                  onChange={(e) => setForm({ ...form, bannerLinkUrl: e.target.value })}
                  placeholder="/exhibitions/..." />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ExhibitionStatus })}>
                  {Object.entries(EXHIBITION_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>시작일 <span className="add-form__req">*</span></label>
                <input type="date" value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>종료일 <span className="add-form__req">*</span></label>
                <input type="date" value={form.endAt}
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
