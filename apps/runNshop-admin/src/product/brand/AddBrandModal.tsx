'use client'
import { useState } from 'react'
import {
  type Brand, type BrandStatus,
  BRAND_STATUS_LABEL, nextBrandId,
} from './mockData'

interface AddForm {
  brandName: string
  brandNameEn: string
  imageUrl: string
  description: string
  status: BrandStatus
}

const EMPTY_FORM: AddForm = {
  brandName: '', brandNameEn: '', imageUrl: '', description: '', status: 'ACTIVE',
}

export default function AddBrandModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (brand: Brand) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)

  function canAdd() {
    return form.brandName.trim() !== ''
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const brand: Brand = {
      brandId: nextBrandId(),
      brandName: form.brandName.trim(),
      brandNameEn: form.brandNameEn.trim(),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      productCount: 0,
      status: form.status,
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(brand)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">브랜드 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field">
                <label>브랜드명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="예) 나이키" />
              </div>
              <div className="add-form__field">
                <label>영문명</label>
                <input type="text" value={form.brandNameEn}
                  onChange={(e) => setForm({ ...form, brandNameEn: e.target.value })}
                  placeholder="예) Nike" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>이미지 URL</label>
                <input type="text" value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="예) https://example.com/brand/nike.png" />
              </div>
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as BrandStatus })}>
                  {Object.entries(BRAND_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>브랜드 소개</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="브랜드 소개 문구를 입력하세요" />
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
