'use client'
import { useState } from 'react'
import { type EventPriceProduct, MOCK_PRODUCT_CATALOG, calcEventPrice, calcDiscountRateFromPrice } from '../mockData'

interface SelectedProduct {
  productId: string
  productName: string
  price: number
}

export default function AddEventPriceProductModal({ existingIds, defaultDiscountRate, initialProduct, onClose, onSave }: {
  existingIds: string[]
  defaultDiscountRate: number
  initialProduct?: EventPriceProduct
  onClose: () => void
  onSave: (product: EventPriceProduct) => void
}) {
  const isEdit = initialProduct != null
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<SelectedProduct | null>(
    initialProduct
      ? { productId: initialProduct.productId, productName: initialProduct.productName, price: initialProduct.originalPrice }
      : null
  )
  const [discountRate, setDiscountRate] = useState(String(initialProduct?.discountRate ?? defaultDiscountRate))
  const [eventPrice, setEventPrice] = useState(
    initialProduct
      ? String(initialProduct.eventPrice)
      : (selected ? String(calcEventPrice(selected.price, defaultDiscountRate)) : '')
  )
  const [quantityLimit, setQuantityLimit] = useState(initialProduct?.quantityLimit ?? false)
  const [totalQuantity, setTotalQuantity] = useState(initialProduct?.totalQuantity != null ? String(initialProduct.totalQuantity) : '')
  const [remainingQuantity, setRemainingQuantity] = useState(initialProduct?.remainingQuantity != null ? String(initialProduct.remainingQuantity) : '')

  const results = keyword.trim()
    ? MOCK_PRODUCT_CATALOG.filter(p => p.productName.includes(keyword) || p.productId.includes(keyword))
    : MOCK_PRODUCT_CATALOG

  function canSave() {
    return selected != null
      && Number(discountRate) > 0 && Number(discountRate) < 100
      && Number(eventPrice) > 0 && Number(eventPrice) < selected.price
      && (!quantityLimit || Number(totalQuantity) > 0)
  }

  function handleDiscountRateChange(value: string) {
    setDiscountRate(value)
    if (selected && value !== '') {
      setEventPrice(String(calcEventPrice(selected.price, Number(value))))
    }
  }

  function handleEventPriceChange(value: string) {
    setEventPrice(value)
    if (selected && value !== '') {
      setDiscountRate(String(calcDiscountRateFromPrice(selected.price, Number(value))))
    }
  }

  function handleSelect(p: typeof MOCK_PRODUCT_CATALOG[0]) {
    setSelected(p)
    setEventPrice(String(calcEventPrice(p.price, Number(discountRate))))
  }

  function handleSave() {
    if (!selected) return
    const total = quantityLimit ? Number(totalQuantity) : null
    const remaining = quantityLimit
      ? (isEdit && remainingQuantity !== '' ? Number(remainingQuantity) : total)
      : null
    onSave({
      productId: selected.productId,
      productName: selected.productName,
      originalPrice: selected.price,
      discountRate: Number(discountRate),
      eventPrice: Number(eventPrice),
      quantityLimit,
      totalQuantity: total,
      remainingQuantity: remaining,
    })
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">{isEdit ? '상품 할인 수정' : '상품 추가'}</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body tab-panel-content">
          {!selected ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                  placeholder="상품ID 또는 상품명 검색" style={{ width: '100%' }} />
              </div>
              <div className="table-wrap" style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>상품ID</th>
                      <th>상품명</th>
                      <th>브랜드</th>
                      <th>정상가</th>
                      <th style={{ width: 50 }}>선택</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((p) => {
                      const already = existingIds.includes(p.productId)
                      return (
                        <tr key={p.productId}>
                          <td style={{ fontSize: 12 }}>{p.productId}</td>
                          <td style={{ fontSize: 12 }}>{p.productName}</td>
                          <td style={{ fontSize: 12 }}>{p.brand}</td>
                          <td style={{ fontSize: 12 }}>{p.price.toLocaleString()}원</td>
                          <td>
                            {already
                              ? <span style={{ fontSize: 10, color: '#94a3b8' }}>추가됨</span>
                              : <button className="btn-tool btn-tool--add" style={{ fontSize: 10, padding: '2px 8px', height: 22 }} onClick={() => handleSelect(p)}>선택</button>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="add-form" style={{ padding: 0 }}>
              <div className="add-form__row">
                <div className="add-form__field add-form__field--full">
                  <label>선택 상품</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge">{selected.productId}</span>
                    <span style={{ fontWeight: 500 }}>{selected.productName}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>정상가 {selected.price.toLocaleString()}원</span>
                    {!isEdit && (
                      <button className="btn-tool btn-tool--toggle" style={{ marginLeft: 'auto' }} onClick={() => setSelected(null)}>다시 검색</button>
                    )}
                  </div>
                </div>
              </div>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>할인율(%) <span className="add-form__req">*</span></label>
                  <input type="number" min={1} max={99} value={discountRate}
                    onChange={(e) => handleDiscountRateChange(e.target.value)}
                    placeholder={`기본값 ${defaultDiscountRate}%`} />
                </div>
                <div className="add-form__field">
                  <label>할인가(원) <span className="add-form__req">*</span></label>
                  <input type="number" min={0} value={eventPrice}
                    onChange={(e) => handleEventPriceChange(e.target.value)} />
                </div>
                <div className="add-form__field">
                  <label>할인금액</label>
                  <input type="text" disabled
                    value={eventPrice ? `-${(selected.price - Number(eventPrice)).toLocaleString()}원` : '-'} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: '-4px 0 8px' }}>
                할인율과 할인가는 서로 연동되어 계산됩니다. 둘 중 하나를 입력하면 다른 값이 자동으로 갱신되며,
                이 상품에 최종 확정되는 할인은 할인금액(원) 기준의 정액할인으로 저장됩니다.
              </p>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>
                    <input type="checkbox" checked={quantityLimit}
                      onChange={(e) => setQuantityLimit(e.target.checked)}
                      style={{ marginRight: 6 }} />
                    수량 한정
                  </label>
                </div>
                {quantityLimit && (
                  <>
                    <div className="add-form__field">
                      <label>총 수량 <span className="add-form__req">*</span></label>
                      <input type="number" value={totalQuantity}
                        onChange={(e) => setTotalQuantity(e.target.value)}
                        placeholder="예) 50" />
                    </div>
                    {isEdit && (
                      <div className="add-form__field">
                        <label>잔여 수량</label>
                        <input type="number" value={remainingQuantity}
                          onChange={(e) => setRemainingQuantity(e.target.value)} />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="add-form__footer">
                <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
                <button className="btn-tool btn-tool--add" disabled={!canSave()} onClick={handleSave}>{isEdit ? '수정' : '추가'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
