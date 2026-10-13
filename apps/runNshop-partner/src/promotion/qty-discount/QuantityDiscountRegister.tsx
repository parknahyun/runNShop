'use client'
import { useState } from 'react'
import { type DiscountTier, VENDOR_PRODUCT_NAMES } from './mockData'

interface Props {
  onClose: () => void
  onCreate: (input: {
    event_name: string
    product_name: string
    tiers: DiscountTier[]
    start_at: string
    end_at: string
  }) => void
}

interface TierRow {
  key: number
  min_qty: string
  discount_rate: string
}

let nextTierRowKey = 1

export default function QuantityDiscountRegister({ onClose, onCreate }: Props) {
  const [eventName, setEventName] = useState('')
  const [productName, setProductName] = useState(VENDOR_PRODUCT_NAMES[0])
  const [tierRows, setTierRows] = useState<TierRow[]>([
    { key: nextTierRowKey++, min_qty: '', discount_rate: '' },
  ])
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')

  function addTierRow() {
    setTierRows((rows) => [...rows, { key: nextTierRowKey++, min_qty: '', discount_rate: '' }])
  }

  function removeTierRow(key: number) {
    setTierRows((rows) => rows.length > 1 ? rows.filter((r) => r.key !== key) : rows)
  }

  function updateTierRow(key: number, field: 'min_qty' | 'discount_rate', value: string) {
    setTierRows((rows) => rows.map((r) => r.key === key ? { ...r, [field]: value } : r))
  }

  const validTiers: DiscountTier[] = tierRows
    .filter((r) => r.min_qty !== '' && r.discount_rate !== '')
    .map((r) => ({ min_qty: Number(r.min_qty), discount_rate: Number(r.discount_rate) }))

  const canSubmit = eventName.trim() !== '' && productName !== '' && startAt !== '' && endAt !== '' && validTiers.length > 0

  function handleSubmit() {
    if (!canSubmit) {
      alert('필수 항목을 모두 입력해 주세요. (구간은 최소 1개 이상)')
      return
    }
    onCreate({
      event_name: eventName,
      product_name: productName,
      tiers: validTiers,
      start_at: startAt,
      end_at: endAt,
    })
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">수량할인 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body" style={{ overflowY: 'auto' }}>
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>행사명 <span className="add-form__req">*</span></label>
                <input type="text" placeholder="행사명을 입력하세요" value={eventName} onChange={(e) => setEventName(e.target.value)} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>적용상품 <span className="add-form__req">*</span></label>
                <select value={productName} onChange={(e) => setProductName(e.target.value)}>
                  {VENDOR_PRODUCT_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>구간설정 <span className="add-form__req">*</span></label>
                {tierRows.map((row) => (
                  <div key={row.key} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <input type="number" placeholder="최소수량" value={row.min_qty}
                      onChange={(e) => updateTierRow(row.key, 'min_qty', e.target.value)}
                      style={{ textAlign: 'right' }} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>개 이상 구매 시</span>
                    <input type="number" placeholder="할인율" value={row.discount_rate}
                      onChange={(e) => updateTierRow(row.key, 'discount_rate', e.target.value)}
                      style={{ textAlign: 'right' }} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>% 할인</span>
                    <button type="button" className="btn-tool btn-tool--delete" style={{ height: 28, padding: '0 10px', fontSize: 12 }}
                      onClick={() => removeTierRow(row.key)} disabled={tierRows.length <= 1}>삭제</button>
                  </div>
                ))}
                <button type="button" className="btn-tool" style={{ marginTop: 4 }} onClick={addTierRow}>+ 구간 추가</button>
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>시작일 <span className="add-form__req">*</span></label>
                <input type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
              </div>
              <div className="add-form__field">
                <label>종료일 <span className="add-form__req">*</span></label>
                <input type="date" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>※ 등록한 수량할인은 MD 승인 후 노출됩니다.</p>
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
