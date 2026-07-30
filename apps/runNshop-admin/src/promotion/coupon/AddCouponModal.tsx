'use client'
import { useState } from 'react'
import {
  type Coupon, type CouponStatus, type CouponIssuerType, type CouponType, type CouponPartialCancelPolicy,
  type CouponApplyUnit, type CouponDiscountType, type CouponIssueType,
  COUPON_STATUS_LABEL, COUPON_ISSUER_TYPE_LABEL, COUPON_TYPE_LABEL, COUPON_PARTIAL_CANCEL_POLICY_LABEL,
  COUPON_APPLY_UNIT_LABEL, COUPON_DISCOUNT_TYPE_LABEL, COUPON_ISSUE_TYPE_LABEL,
  nextCouponId,
} from './mockData'

interface AddForm {
  couponCode: string
  couponName: string
  couponType: CouponType
  partialCancelPolicy: CouponPartialCancelPolicy
  issuerType: CouponIssuerType
  vendorName: string
  applyUnit: CouponApplyUnit
  discountType: CouponDiscountType
  discountValue: string
  minOrderAmount: string
  maxDiscountAmount: string
  issueType: CouponIssueType
  issueLimit: string
  costShareRate: string
  validFrom: string
  validTo: string
  status: CouponStatus
}

const EMPTY_FORM: AddForm = {
  couponCode: '', couponName: '', couponType: 'PRODUCT', partialCancelPolicy: 'RECALCULATE', issuerType: 'PLATFORM', vendorName: '',
  applyUnit: 'ORDER',
  discountType: 'FIXED', discountValue: '', minOrderAmount: '0', maxDiscountAmount: '',
  issueType: 'DOWNLOAD', issueLimit: '', costShareRate: '100',
  validFrom: '', validTo: '', status: 'ACTIVE',
}

export default function AddCouponModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (coupon: Coupon) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)

  function canAdd() {
    return form.couponCode.trim() !== '' && form.couponName.trim() !== ''
      && Number(form.discountValue) > 0
      && form.validFrom !== '' && form.validTo !== '' && form.validTo >= form.validFrom
      && (form.issuerType !== 'VENDOR' || form.vendorName.trim() !== '')
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const coupon: Coupon = {
      couponId: nextCouponId(),
      couponCode: form.couponCode.trim(),
      couponName: form.couponName.trim(),
      couponType: form.couponType,
      // 부분취소 정책은 장바구니쿠폰에만 적용된다(상품쿠폰은 개별 상품 취소와 함께 자연히 무효화되므로 의미가 없다)
      partialCancelPolicy: form.couponType === 'CART' ? form.partialCancelPolicy : 'KEEP',
      issuerType: form.issuerType,
      vendorName: form.issuerType === 'VENDOR' ? form.vendorName.trim() : '',
      // 적용회원·적용상품은 등록 후 상세의 "적용회원"/"적용상품" 탭에서 구성한다 (장바구니쿠폰은 적용상품이 전체로 고정)
      memberTargetType: 'ALL', targetGrades: [], targetMemberFile: '', targetMemberCount: null,
      productTargetType: form.couponType === 'CART' ? 'ALL' : 'MANUAL', targetProductIds: [], targetCategoryIds: [],
      holders: [],
      applyUnit: form.applyUnit,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscountAmount: form.discountType === 'RATE' && form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      issueType: form.issueType,
      issueLimit: form.issueLimit ? Number(form.issueLimit) : null,
      issuedCount: 0,
      validFrom: form.validFrom,
      validTo: form.validTo,
      costShareRate: Number(form.costShareRate) || 0,
      status: form.status,
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(coupon)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">쿠폰할인 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field">
                <label>쿠폰코드 <span className="add-form__req">*</span></label>
                <input type="text" value={form.couponCode}
                  onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
                  placeholder="예) SUMMER10" />
              </div>
              <div className="add-form__field">
                <label>쿠폰명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.couponName}
                  onChange={(e) => setForm({ ...form, couponName: e.target.value })}
                  placeholder="쿠폰명 입력" />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>쿠폰 유형</label>
                <select value={form.couponType}
                  onChange={(e) => setForm({ ...form, couponType: e.target.value as CouponType })}>
                  {Object.entries(COUPON_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              {form.couponType === 'CART' && (
                <div className="add-form__field">
                  <label>부분취소 정책</label>
                  <select value={form.partialCancelPolicy}
                    onChange={(e) => setForm({ ...form, partialCancelPolicy: e.target.value as CouponPartialCancelPolicy })}>
                    {Object.entries(COUPON_PARTIAL_CANCEL_POLICY_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="add-form__field">
                <label>발행 주체</label>
                <select value={form.issuerType}
                  onChange={(e) => setForm({ ...form, issuerType: e.target.value as CouponIssuerType })}>
                  {Object.entries(COUPON_ISSUER_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              {form.issuerType === 'VENDOR' && (
                <div className="add-form__field">
                  <label>입점사명 <span className="add-form__req">*</span></label>
                  <input type="text" value={form.vendorName}
                    onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                    placeholder="예) 나이키코리아" />
                </div>
              )}
              <div className="add-form__field">
                <label>비용 분담률 (%)</label>
                <input type="number" min={0} max={100} value={form.costShareRate}
                  onChange={(e) => setForm({ ...form, costShareRate: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>적용 단위</label>
                <select value={form.applyUnit}
                  onChange={(e) => setForm({ ...form, applyUnit: e.target.value as CouponApplyUnit })}>
                  {Object.entries(COUPON_APPLY_UNIT_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>할인 유형</label>
                <select value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as CouponDiscountType })}>
                  {Object.entries(COUPON_DISCOUNT_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>할인 값 <span className="add-form__req">*</span></label>
                <input type="number" value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === 'FIXED' ? '예) 5000' : '예) 10'} />
              </div>
              {form.discountType === 'RATE' && (
                <div className="add-form__field">
                  <label>최대 할인금액</label>
                  <input type="number" value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    placeholder="예) 10000" />
                </div>
              )}
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>최소 주문금액</label>
                <input type="number" value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>발급 방식</label>
                <select value={form.issueType}
                  onChange={(e) => setForm({ ...form, issueType: e.target.value as CouponIssueType })}>
                  {Object.entries(COUPON_ISSUE_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>발급 한도</label>
                <input type="number" value={form.issueLimit}
                  onChange={(e) => setForm({ ...form, issueLimit: e.target.value })}
                  placeholder="비우면 무제한" />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>유효 시작일 <span className="add-form__req">*</span></label>
                <input type="date" value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>유효 종료일 <span className="add-form__req">*</span></label>
                <input type="date" value={form.validTo}
                  onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CouponStatus })}>
                  {Object.entries(COUPON_STATUS_LABEL).map(([k, v]) => (
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
