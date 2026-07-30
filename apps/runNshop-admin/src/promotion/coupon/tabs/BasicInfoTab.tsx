'use client'
import { useState } from 'react'
import {
  type Coupon, type CouponStatus, type CouponDiscountType, type CouponPartialCancelPolicy,
  COUPON_STATUS_LABEL, COUPON_ISSUER_TYPE_LABEL, COUPON_TYPE_LABEL, COUPON_APPLY_UNIT_LABEL,
  COUPON_DISCOUNT_TYPE_LABEL, COUPON_ISSUE_TYPE_LABEL, COUPON_PARTIAL_CANCEL_POLICY_LABEL,
  formatCouponDiscount,
} from '../mockData'
import { CouponStatusBadge } from '../CouponStatusBadge'

interface Draft {
  couponName: string
  status: CouponStatus
  discountType: CouponDiscountType
  discountValue: string
  minOrderAmount: string
  maxDiscountAmount: string
  issueLimit: string
  validFrom: string
  validTo: string
  partialCancelPolicy: CouponPartialCancelPolicy
}

function toDraft(c: Coupon): Draft {
  return {
    couponName: c.couponName,
    status: c.status,
    discountType: c.discountType,
    discountValue: String(c.discountValue),
    minOrderAmount: String(c.minOrderAmount),
    maxDiscountAmount: c.maxDiscountAmount != null ? String(c.maxDiscountAmount) : '',
    issueLimit: c.issueLimit != null ? String(c.issueLimit) : '',
    validFrom: c.validFrom,
    validTo: c.validTo,
    partialCancelPolicy: c.partialCancelPolicy,
  }
}

export default function BasicInfoTab({ coupon, currentUser, onUpdate, readOnly = false }: {
  coupon: Coupon
  currentUser: string
  onUpdate: (updated: Coupon) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(coupon))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...coupon,
      couponName: draft.couponName,
      status: draft.status,
      discountType: draft.discountType,
      discountValue: Number(draft.discountValue),
      minOrderAmount: Number(draft.minOrderAmount) || 0,
      maxDiscountAmount: draft.discountType === 'RATE' && draft.maxDiscountAmount ? Number(draft.maxDiscountAmount) : null,
      issueLimit: draft.issueLimit ? Number(draft.issueLimit) : null,
      validFrom: draft.validFrom,
      validTo: draft.validTo,
      partialCancelPolicy: coupon.couponType === 'CART' ? draft.partialCancelPolicy : coupon.partialCancelPolicy,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(coupon))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>쿠폰명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.couponName}
                onChange={(e) => setDraft({ ...draft, couponName: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>상태</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as CouponStatus })}>
                {Object.entries(COUPON_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>할인 유형</label>
              <select value={draft.discountType}
                onChange={(e) => setDraft({ ...draft, discountType: e.target.value as CouponDiscountType })}>
                {Object.entries(COUPON_DISCOUNT_TYPE_LABEL).map(([k, v]) => (
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
              <label>최소 주문금액</label>
              <input type="number" value={draft.minOrderAmount}
                onChange={(e) => setDraft({ ...draft, minOrderAmount: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>발급 한도</label>
              <input type="number" value={draft.issueLimit}
                onChange={(e) => setDraft({ ...draft, issueLimit: e.target.value })}
                placeholder="비우면 무제한" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>유효 시작일</label>
              <input type="date" value={draft.validFrom}
                onChange={(e) => setDraft({ ...draft, validFrom: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>유효 종료일</label>
              <input type="date" value={draft.validTo}
                onChange={(e) => setDraft({ ...draft, validTo: e.target.value })} />
            </div>
            {coupon.couponType === 'CART' && (
              <div className="add-form__field">
                <label>부분취소 정책</label>
                <select value={draft.partialCancelPolicy}
                  onChange={(e) => setDraft({ ...draft, partialCancelPolicy: e.target.value as CouponPartialCancelPolicy })}>
                  {Object.entries(COUPON_PARTIAL_CANCEL_POLICY_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add"
              disabled={!draft.couponName.trim() || !Number(draft.discountValue)}
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
          <div className="info-row"><dt>쿠폰ID</dt><dd style={{ fontWeight: 600 }}>{coupon.couponId}</dd></div>
          <div className="info-row"><dt>쿠폰코드</dt><dd style={{ fontFamily: 'monospace', fontSize: 12 }}>{coupon.couponCode}</dd></div>
          <div className="info-row"><dt>쿠폰 유형</dt><dd>{COUPON_TYPE_LABEL[coupon.couponType]}</dd></div>
          <div className="info-row"><dt>발행 주체</dt><dd>{COUPON_ISSUER_TYPE_LABEL[coupon.issuerType]}{coupon.vendorName && ` · ${coupon.vendorName}`}</dd></div>
          <div className="info-row"><dt>비용 분담률</dt><dd>{coupon.costShareRate}%</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><CouponStatusBadge status={coupon.status} /></dd></div>
          <div className="info-row"><dt>적용 단위</dt><dd>{COUPON_APPLY_UNIT_LABEL[coupon.applyUnit]}</dd></div>
          <div className="info-row"><dt>할인 내용</dt><dd style={{ fontWeight: 600, color: '#dc2626' }}>{formatCouponDiscount(coupon)}</dd></div>
          <div className="info-row"><dt>최소 주문금액</dt><dd>{coupon.minOrderAmount.toLocaleString()}원</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>발급 방식</dt><dd>{COUPON_ISSUE_TYPE_LABEL[coupon.issueType]}</dd></div>
          <div className="info-row"><dt>발급 현황</dt><dd>{coupon.issuedCount.toLocaleString()} / {coupon.issueLimit != null ? coupon.issueLimit.toLocaleString() : '무제한'}</dd></div>
          <div className="info-row"><dt>유효기간</dt><dd>{coupon.validFrom} ~ {coupon.validTo}</dd></div>
          {coupon.couponType === 'CART' && (
            <div className="info-row"><dt>부분취소 정책</dt><dd>{COUPON_PARTIAL_CANCEL_POLICY_LABEL[coupon.partialCancelPolicy]}</dd></div>
          )}
          <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{coupon.createdBy} / {coupon.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{coupon.updatedBy} / {coupon.updatedAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
