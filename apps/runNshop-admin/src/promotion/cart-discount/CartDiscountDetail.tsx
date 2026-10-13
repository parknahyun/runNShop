'use client'
import { useState } from 'react'
import {
  type CartDiscount, type CartDiscountStatus, type CartDiscountApplyUnit,
  type CartDiscountType, type CartDiscountPartialCancelPolicy,
  CART_DISCOUNT_STATUS_LABEL, CART_DISCOUNT_APPLY_UNIT_LABEL,
  CART_DISCOUNT_TYPE_LABEL, CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL,
  formatCartDiscountValue,
} from './mockData'
import { CartDiscountStatusBadge } from './CartDiscountStatusBadge'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'

interface Draft {
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

function toDraft(c: CartDiscount): Draft {
  return {
    discountName: c.discountName,
    applyUnit: c.applyUnit,
    minOrderAmount: String(c.minOrderAmount),
    discountType: c.discountType,
    discountValue: String(c.discountValue),
    maxDiscountAmount: c.maxDiscountAmount != null ? String(c.maxDiscountAmount) : '',
    partialCancelPolicy: c.partialCancelPolicy,
    status: c.status,
    startAt: c.startAt,
    endAt: c.endAt,
  }
}

export default function CartDiscountDetail({ cartDiscount, currentUser, mode = 'modal', readOnly = false, onClose, onUpdate }: {
  cartDiscount: CartDiscount
  currentUser: string
  mode?: DetailMode
  readOnly?: boolean
  onClose?: () => void
  onUpdate: (updated: CartDiscount) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(cartDiscount))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...cartDiscount,
      discountName: draft.discountName,
      applyUnit: draft.applyUnit,
      minOrderAmount: Number(draft.minOrderAmount) || 0,
      discountType: draft.discountType,
      discountValue: Number(draft.discountValue),
      maxDiscountAmount: draft.discountType === 'RATE' && draft.maxDiscountAmount ? Number(draft.maxDiscountAmount) : null,
      partialCancelPolicy: draft.partialCancelPolicy,
      status: draft.status,
      startAt: draft.startAt,
      endAt: draft.endAt,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(cartDiscount))
    setEditing(false)
  }

  return (
    <DetailShell mode={mode} size="sm" title={cartDiscount.discountName}
      meta={<span className="detail-modal__subtitle">{cartDiscount.cartDiscountId}</span>}
      onClose={onClose}>
        <div className="tab-panel-content">
          {editing ? (
            <div className="add-form" style={{ padding: 0 }}>
              <div className="add-form__row">
                <div className="add-form__field add-form__field--full">
                  <label>할인명 <span className="add-form__req">*</span></label>
                  <input type="text" value={draft.discountName}
                    onChange={(e) => setDraft({ ...draft, discountName: e.target.value })} />
                </div>
              </div>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>적용 단위</label>
                  <select value={draft.applyUnit}
                    onChange={(e) => setDraft({ ...draft, applyUnit: e.target.value as CartDiscountApplyUnit })}>
                    {Object.entries(CART_DISCOUNT_APPLY_UNIT_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="add-form__field">
                  <label>최소 주문금액</label>
                  <input type="number" value={draft.minOrderAmount}
                    onChange={(e) => setDraft({ ...draft, minOrderAmount: e.target.value })} />
                </div>
                <div className="add-form__field">
                  <label>상태</label>
                  <select value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as CartDiscountStatus })}>
                    {Object.entries(CART_DISCOUNT_STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>할인 유형</label>
                  <select value={draft.discountType}
                    onChange={(e) => setDraft({ ...draft, discountType: e.target.value as CartDiscountType })}>
                    {Object.entries(CART_DISCOUNT_TYPE_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="add-form__field">
                  <label>할인 값 <span className="add-form__req">*</span></label>
                  <input type="number" value={draft.discountValue}
                    onChange={(e) => setDraft({ ...draft, discountValue: e.target.value })} />
                </div>
                {draft.discountType === 'RATE' && (
                  <div className="add-form__field">
                    <label>최대 할인금액</label>
                    <input type="number" value={draft.maxDiscountAmount}
                      onChange={(e) => setDraft({ ...draft, maxDiscountAmount: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>부분취소 정책</label>
                  <select value={draft.partialCancelPolicy}
                    onChange={(e) => setDraft({ ...draft, partialCancelPolicy: e.target.value as CartDiscountPartialCancelPolicy })}>
                    {Object.entries(CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
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
              </div>
              <div className="add-form__footer">
                <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
                <button className="btn-tool btn-tool--add"
                  disabled={!draft.discountName.trim() || !Number(draft.discountValue)}
                  onClick={handleSave}>저장</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
              </div>
              <div className="info-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <dl className="info-dl">
                  <div className="info-row"><dt>장바구니할인ID</dt><dd style={{ fontWeight: 600 }}>{cartDiscount.cartDiscountId}</dd></div>
                  <div className="info-row"><dt>적용 단위</dt><dd>{CART_DISCOUNT_APPLY_UNIT_LABEL[cartDiscount.applyUnit]}</dd></div>
                  <div className="info-row"><dt>최소 주문금액</dt><dd>{cartDiscount.minOrderAmount.toLocaleString()}원</dd></div>
                  <div className="info-row"><dt>할인 내용</dt><dd style={{ fontWeight: 600, color: '#dc2626' }}>{formatCartDiscountValue(cartDiscount)}</dd></div>
                  <div className="info-row"><dt>상태</dt><dd><CartDiscountStatusBadge status={cartDiscount.status} /></dd></div>
                </dl>
                <dl className="info-dl">
                  <div className="info-row"><dt>부분취소 정책</dt><dd>{CART_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL[cartDiscount.partialCancelPolicy]}</dd></div>
                  <div className="info-row"><dt>시작일</dt><dd>{cartDiscount.startAt}</dd></div>
                  <div className="info-row"><dt>종료일</dt><dd>{cartDiscount.endAt}</dd></div>
                  <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{cartDiscount.createdBy} / {cartDiscount.createdAt}</dd></div>
                  <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{cartDiscount.updatedBy} / {cartDiscount.updatedAt}</dd></div>
                </dl>
              </div>
            </>
          )}
        </div>
    </DetailShell>
  )
}
