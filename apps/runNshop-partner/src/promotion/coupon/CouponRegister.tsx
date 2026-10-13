'use client'
import { useState } from 'react'
import { type DiscountType } from './mockData'

interface Props {
  onClose: () => void
  onCreate: (input: {
    coupon_name: string
    discount_type: DiscountType
    discount_value: number
    min_order_amount: number
    issue_limit: number | null
    valid_from: string
    valid_to: string
  }) => void
}

export default function CouponRegister({ onClose, onCreate }: Props) {
  const [couponName, setCouponName] = useState('')
  const [discountType, setDiscountType] = useState<DiscountType>('RATE')
  const [discountValue, setDiscountValue] = useState('')
  const [minOrderAmount, setMinOrderAmount] = useState('')
  const [issueLimit, setIssueLimit] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validTo, setValidTo] = useState('')

  const canSubmit = couponName.trim() !== '' && discountValue !== '' && validFrom !== '' && validTo !== ''

  function handleSubmit() {
    if (!canSubmit) {
      alert('필수 항목을 모두 입력해 주세요.')
      return
    }
    onCreate({
      coupon_name: couponName,
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: minOrderAmount === '' ? 0 : Number(minOrderAmount),
      issue_limit: issueLimit === '' ? null : Number(issueLimit),
      valid_from: validFrom,
      valid_to: validTo,
    })
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">쿠폰 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body" style={{ overflowY: 'auto' }}>
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>쿠폰명 <span className="add-form__req">*</span></label>
                <input type="text" placeholder="쿠폰명을 입력하세요" value={couponName} onChange={(e) => setCouponName(e.target.value)} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>할인유형 <span className="add-form__req">*</span></label>
                <div className="pgm-status-radio">
                  {([
                    { value: 'RATE' as const, label: '정률(%)' },
                    { value: 'AMOUNT' as const, label: '정액(원)' },
                  ]).map((opt) => (
                    <label key={opt.value} className={`pgm-status-radio__item${discountType === opt.value ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setDiscountType(opt.value)}>
                      <input type="radio" name="discount_type" checked={discountType === opt.value} onChange={() => setDiscountType(opt.value)} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="add-form__field">
                <label>할인값 <span className="add-form__req">*</span></label>
                <input type="number" placeholder={discountType === 'RATE' ? '예: 10' : '예: 5000'} value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)} style={{ textAlign: 'right' }} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>최소주문금액</label>
                <input type="number" placeholder="0" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} style={{ textAlign: 'right' }} />
              </div>
              <div className="add-form__field">
                <label>발급한도</label>
                <input type="number" placeholder="무제한" value={issueLimit} onChange={(e) => setIssueLimit(e.target.value)} style={{ textAlign: 'right' }} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>유효기간(시작) <span className="add-form__req">*</span></label>
                <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
              </div>
              <div className="add-form__field">
                <label>유효기간(종료) <span className="add-form__req">*</span></label>
                <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>※ 등록한 쿠폰은 MD 승인 후 노출됩니다.</p>
          </div>
        </div>

        <div className="add-form__footer" style={{ padding: '14px 24px' }}>
          <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
          <button className="btn-tool btn-tool--add" onClick={handleSubmit}>등록</button>
        </div>
      </div>
    </div>
  )
}
