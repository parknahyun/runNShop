'use client'
import { useState } from 'react'
import { type QuantityDiscount, type QuantityDiscountTier, QUANTITY_DISCOUNT_TIER_SCOPE_LABEL, nextTierId } from '../mockData'

interface TierForm {
  minQuantity: string
  maxQuantity: string
  discountRate: string
}

const EMPTY_TIER_FORM: TierForm = { minQuantity: '', maxQuantity: '', discountRate: '' }

export default function TiersTab({ quantityDiscount, onSave, readOnly = false }: {
  quantityDiscount: QuantityDiscount
  onSave: (tiers: QuantityDiscountTier[]) => void
  readOnly?: boolean
}) {
  const [tiers, setTiers] = useState<QuantityDiscountTier[]>(quantityDiscount.tiers)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState<TierForm>(EMPTY_TIER_FORM)

  const isDirty = JSON.stringify(tiers) !== JSON.stringify(quantityDiscount.tiers)
  const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity)

  function canAddTier() {
    return Number(form.minQuantity) > 0 && Number(form.discountRate) > 0
      && (form.maxQuantity === '' || Number(form.maxQuantity) >= Number(form.minQuantity))
  }

  function addTier() {
    const tier: QuantityDiscountTier = {
      tierId: nextTierId(),
      minQuantity: Number(form.minQuantity),
      maxQuantity: form.maxQuantity === '' ? null : Number(form.maxQuantity),
      discountRate: Number(form.discountRate),
    }
    setTiers(prev => [...prev, tier])
    setForm(EMPTY_TIER_FORM)
    setShowAdd(false)
  }

  function removeTier(tierId: string) {
    setTiers(prev => prev.filter(t => t.tierId !== tierId))
  }

  function handleSave() {
    onSave(tiers)
  }

  function handleCancel() {
    setTiers(quantityDiscount.tiers)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>구간별 할인율 ({tiers.length}건)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowAdd(true)}>+ 구간 추가</button>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>
        구간설정 기준: <strong>{QUANTITY_DISCOUNT_TIER_SCOPE_LABEL[quantityDiscount.tierScope]}</strong>
        {quantityDiscount.tierScope === 'PER_PRODUCT'
          ? ' — 구매수량을 적용상품별로 개별 카운트하여 구간을 판정합니다.'
          : ' — 구매수량을 적용상품 전체의 합산 수량으로 카운트하여 구간을 판정합니다.'}
      </p>

      {sorted.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 구간이 없습니다. 상단 버튼으로 수량 구간별 할인율을 추가하세요.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>최소수량</th>
                <th>최대수량</th>
                <th>할인율</th>
                <th style={{ width: 70 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.tierId}>
                  <td style={{ fontWeight: 500 }}>{t.minQuantity}개 이상</td>
                  <td style={{ fontSize: 12 }}>{t.maxQuantity != null ? `${t.maxQuantity}개 이하` : '상한 없음'}</td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>{t.discountRate}%</td>
                  <td>
                    <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} disabled={readOnly} onClick={() => removeTier(t.tierId)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>

      {showAdd && (
        <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={() => setShowAdd(false)}>
          <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal__header">
              <span className="detail-modal__title">구간 추가</span>
              <button className="detail-modal__close" onClick={() => setShowAdd(false)} aria-label="닫기">✕</button>
            </div>
            <div className="detail-modal__body tab-panel-content">
              <div className="add-form" style={{ padding: 0 }}>
                <div className="add-form__row">
                  <div className="add-form__field">
                    <label>최소수량 <span className="add-form__req">*</span></label>
                    <input type="number" min={1} value={form.minQuantity}
                      onChange={(e) => setForm({ ...form, minQuantity: e.target.value })} placeholder="예) 3" />
                  </div>
                  <div className="add-form__field">
                    <label>최대수량</label>
                    <input type="number" min={1} value={form.maxQuantity}
                      onChange={(e) => setForm({ ...form, maxQuantity: e.target.value })} placeholder="비우면 상한 없음" />
                  </div>
                  <div className="add-form__field">
                    <label>할인율(%) <span className="add-form__req">*</span></label>
                    <input type="number" min={1} max={100} value={form.discountRate}
                      onChange={(e) => setForm({ ...form, discountRate: e.target.value })} placeholder="예) 10" />
                  </div>
                </div>
                <div className="add-form__footer">
                  <button className="btn-tool btn-tool--cancel" onClick={() => setShowAdd(false)}>취소</button>
                  <button className="btn-tool btn-tool--add" disabled={!canAddTier()} onClick={addTier}>추가</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
