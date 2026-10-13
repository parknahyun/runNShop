'use client'
import { useState } from 'react'
import {
  type QuantityDiscount, type QuantityDiscountStatus, type QuantityDiscountTierScope,
  type QuantityDiscountPartialCancelPolicy,
  QUANTITY_DISCOUNT_STATUS_LABEL, QUANTITY_DISCOUNT_TIER_SCOPE_LABEL,
  QUANTITY_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL,
} from '../mockData'
import { QuantityDiscountStatusBadge } from '../QuantityDiscountStatusBadge'

interface Draft {
  eventName: string
  vendorName: string
  status: QuantityDiscountStatus
  tierScope: QuantityDiscountTierScope
  partialCancelPolicy: QuantityDiscountPartialCancelPolicy
  startAt: string
  endAt: string
}

function toDraft(q: QuantityDiscount): Draft {
  return {
    eventName: q.eventName, vendorName: q.vendorName, status: q.status,
    tierScope: q.tierScope, partialCancelPolicy: q.partialCancelPolicy,
    startAt: q.startAt, endAt: q.endAt,
  }
}

export default function BasicInfoTab({ quantityDiscount, currentUser, onUpdate, readOnly = false }: {
  quantityDiscount: QuantityDiscount
  currentUser: string
  onUpdate: (updated: QuantityDiscount) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(quantityDiscount))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...quantityDiscount,
      eventName: draft.eventName,
      vendorName: draft.vendorName,
      status: draft.status,
      tierScope: draft.tierScope,
      partialCancelPolicy: draft.partialCancelPolicy,
      startAt: draft.startAt,
      endAt: draft.endAt,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(quantityDiscount))
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
              <label>입점사명</label>
              <input type="text" value={draft.vendorName}
                onChange={(e) => setDraft({ ...draft, vendorName: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>상태</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as QuantityDiscountStatus })}>
                {Object.entries(QUANTITY_DISCOUNT_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="add-form__field">
              <label>구간설정 기준</label>
              <select value={draft.tierScope}
                onChange={(e) => setDraft({ ...draft, tierScope: e.target.value as QuantityDiscountTierScope })}>
                {Object.entries(QUANTITY_DISCOUNT_TIER_SCOPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
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
            <div className="add-form__field">
              <label>부분취소 정책</label>
              <select value={draft.partialCancelPolicy}
                onChange={(e) => setDraft({ ...draft, partialCancelPolicy: e.target.value as QuantityDiscountPartialCancelPolicy })}>
                {Object.entries(QUANTITY_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add"
              disabled={!draft.eventName.trim() || !draft.startAt || !draft.endAt || draft.endAt < draft.startAt}
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
          <div className="info-row"><dt>수량할인ID</dt><dd style={{ fontWeight: 600 }}>{quantityDiscount.quantityDiscountId}</dd></div>
          <div className="info-row"><dt>행사명</dt><dd style={{ fontWeight: 600 }}>{quantityDiscount.eventName}</dd></div>
          <div className="info-row"><dt>입점사</dt><dd>{quantityDiscount.vendorName}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><QuantityDiscountStatusBadge status={quantityDiscount.status} /></dd></div>
          <div className="info-row"><dt>적용상품</dt><dd>{quantityDiscount.products.length}건</dd></div>
          <div className="info-row"><dt>구간수</dt><dd>{quantityDiscount.tiers.length}건</dd></div>
          <div className="info-row"><dt>구간설정 기준</dt><dd>{QUANTITY_DISCOUNT_TIER_SCOPE_LABEL[quantityDiscount.tierScope]}</dd></div>
          <div className="info-row"><dt>부분취소 정책</dt><dd>{QUANTITY_DISCOUNT_PARTIAL_CANCEL_POLICY_LABEL[quantityDiscount.partialCancelPolicy]}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>시작일</dt><dd>{quantityDiscount.startAt}</dd></div>
          <div className="info-row"><dt>종료일</dt><dd>{quantityDiscount.endAt}</dd></div>
          <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{quantityDiscount.createdBy} / {quantityDiscount.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{quantityDiscount.updatedBy} / {quantityDiscount.updatedAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
