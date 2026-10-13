'use client'
import { useState } from 'react'
import {
  type QuantityDiscount, type QuantityDiscountStatus, type QuantityDiscountTierScope,
  type QuantityDiscountPartialCancelPolicy,
  QUANTITY_DISCOUNT_STATUS_LABEL, QUANTITY_DISCOUNT_TIER_SCOPE_LABEL,
  QUANTITY_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL, nextQuantityDiscountId,
} from './mockData'

interface AddForm {
  eventName: string
  vendorName: string
  status: QuantityDiscountStatus
  tierScope: QuantityDiscountTierScope
  partialCancelPolicy: QuantityDiscountPartialCancelPolicy
  startAt: string
  endAt: string
}

const EMPTY_FORM: AddForm = {
  eventName: '', vendorName: '', status: 'ACTIVE', tierScope: 'TOTAL', partialCancelPolicy: 'RECALCULATE', startAt: '', endAt: '',
}

export default function AddQuantityDiscountModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (item: QuantityDiscount) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)

  function canAdd() {
    return form.eventName.trim() !== '' && form.vendorName.trim() !== ''
      && form.startAt !== '' && form.endAt !== '' && form.endAt >= form.startAt
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const item: QuantityDiscount = {
      quantityDiscountId: nextQuantityDiscountId(),
      eventName: form.eventName.trim(),
      vendorName: form.vendorName.trim(),
      startAt: form.startAt,
      endAt: form.endAt,
      status: form.status,
      tierScope: form.tierScope,
      partialCancelPolicy: form.partialCancelPolicy,
      products: [],
      tiers: [],
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(item)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">수량별 할인 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>행사명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.eventName}
                  onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                  placeholder="예) 양말 3개 이상 할인" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>입점사명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.vendorName}
                  onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                  placeholder="예) 프로스펙스" />
              </div>
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as QuantityDiscountStatus })}>
                  {Object.entries(QUANTITY_DISCOUNT_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>구간설정 기준</label>
                <select value={form.tierScope}
                  onChange={(e) => setForm({ ...form, tierScope: e.target.value as QuantityDiscountTierScope })}>
                  {Object.entries(QUANTITY_DISCOUNT_TIER_SCOPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>부분취소 정책</label>
                <select value={form.partialCancelPolicy}
                  onChange={(e) => setForm({ ...form, partialCancelPolicy: e.target.value as QuantityDiscountPartialCancelPolicy })}>
                  {Object.entries(QUANTITY_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL).map(([k, v]) => (
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
