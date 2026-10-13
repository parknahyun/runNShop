'use client'
import { useState } from 'react'
import {
  type Product, type StockMovementType, STOCK_MOVEMENT_TYPE_LABEL,
  getSkuCombinations, nextHistoryId,
} from '../mockData'

export default function StockHistoryTab({ product, onAddHistory, readOnly = false }: {
  product: Product
  onAddHistory: (historyId: string, skuKey: string, type: StockMovementType, quantity: number, memo: string) => void
  readOnly?: boolean
}) {
  const combos = getSkuCombinations(product.options)
  const [showAdd, setShowAdd] = useState(false)
  const [skuKey, setSkuKey] = useState(combos[0] ?? '')
  const [type, setType] = useState<StockMovementType>('IN')
  const [adjustDirection, setAdjustDirection] = useState<'PLUS' | 'MINUS'>('PLUS')
  const [quantity, setQuantity] = useState('')
  const [memo, setMemo] = useState('')

  const sortedHistories = [...product.stockHistories].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function openAdd() {
    setSkuKey(combos[0] ?? '')
    setType('IN')
    setAdjustDirection('PLUS')
    setQuantity('')
    setMemo('')
    setShowAdd(true)
  }

  function canSubmit() {
    return skuKey !== '' && Number(quantity) > 0 && memo.trim() !== ''
  }

  function submit() {
    if (!canSubmit()) return
    const magnitude = Number(quantity)
    const signed = type === 'IN' ? magnitude
      : type === 'OUT' ? -magnitude
      : (adjustDirection === 'PLUS' ? magnitude : -magnitude)
    onAddHistory(nextHistoryId(), skuKey, type, signed, memo.trim())
    setShowAdd(false)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>재고이력 ({product.stockHistories.length}건)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={openAdd}>+ 입출고 등록</button>
      </div>
      {sortedHistories.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 재고이력이 없습니다. 상단 버튼으로 입출고를 등록하세요.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>이력ID</th>
                <th>옵션조합</th>
                <th>유형</th>
                <th>변동수량</th>
                <th>사유</th>
                <th>등록자</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistories.map((h) => (
                <tr key={h.historyId}>
                  <td style={{ fontSize: 12 }}>{h.historyId}</td>
                  <td style={{ fontWeight: 500 }}>{h.skuKey}</td>
                  <td style={{ fontSize: 12 }}>{STOCK_MOVEMENT_TYPE_LABEL[h.type]}</td>
                  <td style={{ fontWeight: 600, color: h.quantity < 0 ? '#dc2626' : '#15803d' }}>
                    {h.quantity > 0 ? `+${h.quantity}` : h.quantity}
                  </td>
                  <td style={{ fontSize: 12 }}>{h.memo}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{h.createdBy}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{h.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={() => setShowAdd(false)}>
          <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal__header">
              <span className="detail-modal__title">입출고 등록</span>
              <button className="detail-modal__close" onClick={() => setShowAdd(false)} aria-label="닫기">✕</button>
            </div>
            <div className="detail-modal__body tab-panel-content">
              <div className="add-form" style={{ padding: 0 }}>
                <div className="add-form__row">
                  <div className="add-form__field">
                    <label>옵션조합 <span className="add-form__req">*</span></label>
                    <select value={skuKey} onChange={(e) => setSkuKey(e.target.value)}>
                      {combos.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="add-form__field">
                    <label>유형</label>
                    <select value={type} onChange={(e) => setType(e.target.value as StockMovementType)}>
                      {Object.entries(STOCK_MOVEMENT_TYPE_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  {type === 'ADJUST' && (
                    <div className="add-form__field">
                      <label>증감</label>
                      <select value={adjustDirection} onChange={(e) => setAdjustDirection(e.target.value as 'PLUS' | 'MINUS')}>
                        <option value="PLUS">증가</option>
                        <option value="MINUS">감소</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="add-form__row">
                  <div className="add-form__field">
                    <label>수량 <span className="add-form__req">*</span></label>
                    <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="예) 10" />
                  </div>
                  <div className="add-form__field add-form__field--full">
                    <label>사유 <span className="add-form__req">*</span></label>
                    <input type="text" value={memo} onChange={(e) => setMemo(e.target.value)}
                      placeholder="예) 초기 입고, 주문 출고, 실사 조정 등" />
                  </div>
                </div>
                <div className="add-form__footer">
                  <button className="btn-tool btn-tool--cancel" onClick={() => setShowAdd(false)}>취소</button>
                  <button className="btn-tool btn-tool--add" disabled={!canSubmit()} onClick={submit}>등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
