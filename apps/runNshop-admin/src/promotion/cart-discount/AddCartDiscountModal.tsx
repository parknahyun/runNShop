'use client'
import { useState } from 'react'
import {
  type CartDiscount, type CartDiscountStatus, type CartDiscountApplyUnit,
  type CartDiscountType, type CartDiscountPartialCancelPolicy,
  CART_DISCOUNT_STATUS_LABEL, CART_DISCOUNT_APPLY_UNIT_LABEL,
  CART_DISCOUNT_TYPE_LABEL, CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL,
  nextCartDiscountId,
} from './mockData'

interface AddForm {
  discountName: string
  applyUnit: CartDiscountApplyUnit
  minOrderAmount: string
  discountType: CartDiscountType
  discountValue: string
  maxDiscountAmount: string
  partialCancelPolicy: CartDiscountPartialCancelPolicy
  status: CartDiscountStatus
  startAt: string
  endAt: string
}

const EMPTY_FORM: AddForm = {
  discountName: '', applyUnit: 'PLATFORM', minOrderAmount: '', discountType: 'FIXED',
  discountValue: '', maxDiscountAmount: '', partialCancelPolicy: 'RECALCULATE',
  status: 'ACTIVE', startAt: '', endAt: '',
}

export default function AddCartDiscountModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (item: CartDiscount) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)

  function canAdd() {
    return form.discountName.trim() !== '' && Number(form.minOrderAmount) >= 0 && Number(form.discountValue) > 0
      && form.startAt !== '' && form.endAt !== '' && form.endAt >= form.startAt
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const item: CartDiscount = {
      cartDiscountId: nextCartDiscountId(),
      discountName: form.discountName.trim(),
      applyUnit: form.applyUnit,
      minOrderAmount: Number(form.minOrderAmount) || 0,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxDiscountAmount: form.discountType === 'RATE' && form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      partialCancelPolicy: form.partialCancelPolicy,
      startAt: form.startAt,
      endAt: form.endAt,
      status: form.status,
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(item)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">장바구니할인 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>할인명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.discountName}
                  onChange={(e) => setForm({ ...form, discountName: e.target.value })}
                  placeholder="예) 5만원 이상 장바구니 할인" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>적용 단위</label>
                <select value={form.applyUnit}
                  onChange={(e) => setForm({ ...form, applyUnit: e.target.value as CartDiscountApplyUnit })}>
                  {Object.entries(CART_DISCOUNT_APPLY_UNIT_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>최소 주문금액 <span className="add-form__req">*</span></label>
                <input type="number" value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  placeholder="예) 50000" />
              </div>
              <div className="add-form__field">
                <label>부분취소 정책</label>
                <select value={form.partialCancelPolicy}
                  onChange={(e) => setForm({ ...form, partialCancelPolicy: e.target.value as CartDiscountPartialCancelPolicy })}>
                  {Object.entries(CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>할인 유형</label>
                <select value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as CartDiscountType })}>
                  {Object.entries(CART_DISCOUNT_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>할인 값 <span className="add-form__req">*</span></label>
                <input type="number" value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === 'FIXED' ? '예) 3000' : '예) 5'} />
              </div>
              {form.discountType === 'RATE' && (
                <div className="add-form__field">
                  <label>최대 할인금액</label>
                  <input type="number" value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    placeholder="예) 5000" />
                </div>
              )}
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
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CartDiscountStatus })}>
                  {Object.entries(CART_DISCOUNT_STATUS_LABEL).map(([k, v]) => (
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
