'use client'
import { useState } from 'react'
import {
  type StandardCategory, type StandardCategoryStatus, type StandardCategoryDepth,
  STANDARD_CATEGORY_STATUS_LABEL, STANDARD_CATEGORY_DEPTH_LABEL,
  getParentCandidates, nextStandardCategoryId,
} from './mockData'

interface AddForm {
  categoryName: string
  depth: StandardCategoryDepth
  parentId: string
  sortOrder: string
  status: StandardCategoryStatus
}

const EMPTY_FORM: AddForm = {
  categoryName: '', depth: 1, parentId: '', sortOrder: '1', status: 'ACTIVE',
}

export default function AddStandardCategoryModal({ categories, onClose, onAdd }: {
  categories: StandardCategory[]
  onClose: () => void
  onAdd: (category: StandardCategory) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)
  const parentCandidates = getParentCandidates(categories, form.depth)

  function canAdd() {
    return form.categoryName.trim() !== '' && (form.depth === 1 || form.parentId !== '')
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const category: StandardCategory = {
      categoryId: nextStandardCategoryId(),
      categoryName: form.categoryName.trim(),
      parentId: form.depth === 1 ? null : form.parentId,
      depth: form.depth,
      sortOrder: Number(form.sortOrder) || 1,
      status: form.status,
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(category)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">표준카테고리 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field">
                <label>구분</label>
                <select value={form.depth}
                  onChange={(e) => setForm({ ...form, depth: Number(e.target.value) as StandardCategoryDepth, parentId: '' })}>
                  {Object.entries(STANDARD_CATEGORY_DEPTH_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              {form.depth !== 1 && (
                <div className="add-form__field">
                  <label>상위카테고리 <span className="add-form__req">*</span></label>
                  <select value={form.parentId}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                    <option value="">선택하세요</option>
                    {parentCandidates.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>카테고리명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  placeholder="예) 러닝화" />
              </div>
              <div className="add-form__field">
                <label>노출순서</label>
                <input type="number" min={1} value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as StandardCategoryStatus })}>
                  {Object.entries(STANDARD_CATEGORY_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
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
