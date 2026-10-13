'use client'
import { useState } from 'react'
import { type EventPrice, type EventPriceProduct } from '../mockData'
import AddEventPriceProductModal from './AddEventPriceProductModal'

export default function ProductsTab({ eventPrice, onSave, readOnly = false }: {
  eventPrice: EventPrice
  onSave: (products: EventPriceProduct[]) => void
  readOnly?: boolean
}) {
  const [products, setProducts] = useState<EventPriceProduct[]>(eventPrice.products)
  const [showAdd, setShowAdd] = useState(false)
  const [editingProduct, setEditingProduct] = useState<EventPriceProduct | null>(null)

  const isDirty = JSON.stringify(products) !== JSON.stringify(eventPrice.products)

  function saveProduct(p: EventPriceProduct) {
    setProducts(prev => {
      const exists = prev.some(item => item.productId === p.productId)
      return exists ? prev.map(item => item.productId === p.productId ? p : item) : [...prev, p]
    })
    setShowAdd(false)
    setEditingProduct(null)
  }

  function removeProduct(productId: string) {
    setProducts(prev => prev.filter(p => p.productId !== productId))
  }

  function handleSave() {
    onSave(products)
  }

  function handleCancel() {
    setProducts(eventPrice.products)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          적용 상품 ({products.length}건)
          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
            · 기본 할인율 {eventPrice.discountRate}% (상품별로 확정된 할인은 정액할인으로 저장됩니다)
          </span>
        </span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowAdd(true)}>+ 상품 추가</button>
      </div>

      {products.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 상품이 없습니다. 상단 버튼으로 즉시할인 적용 상품을 추가하세요.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>상품ID</th>
                <th>상품명</th>
                <th>정상가</th>
                <th>할인율</th>
                <th>할인금액</th>
                <th>즉시할인가(할인가)</th>
                <th>수량</th>
                <th style={{ width: 100 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const soldOut = p.quantityLimit && p.remainingQuantity === 0
                const discountAmount = p.originalPrice - p.eventPrice
                return (
                  <tr key={p.productId}>
                    <td style={{ fontSize: 12 }}>{p.productId}</td>
                    <td style={{ fontWeight: 500 }}>{p.productName}</td>
                    <td style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{p.originalPrice.toLocaleString()}원</td>
                    <td style={{ fontSize: 12 }}>{p.discountRate}%</td>
                    <td style={{ fontSize: 12 }}>-{discountAmount.toLocaleString()}원</td>
                    <td style={{ fontWeight: 600, color: '#dc2626' }}>{p.eventPrice.toLocaleString()}원</td>
                    <td style={{ fontSize: 12 }}>
                      {p.quantityLimit ? `${p.remainingQuantity}/${p.totalQuantity}` : '무제한'}
                      {soldOut && <span className="badge" data-product-status="OUT_OF_STOCK" style={{ marginLeft: 6 }}>품절</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-tool btn-tool--edit" style={{ height: 24, padding: '0 8px', fontSize: 11 }} disabled={readOnly} onClick={() => setEditingProduct(p)}>편집</button>
                        <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} disabled={readOnly} onClick={() => removeProduct(p.productId)}>삭제</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>

      {showAdd && (
        <AddEventPriceProductModal
          existingIds={products.map(p => p.productId)}
          defaultDiscountRate={eventPrice.discountRate}
          onClose={() => setShowAdd(false)}
          onSave={saveProduct}
        />
      )}

      {editingProduct && (
        <AddEventPriceProductModal
          existingIds={products.filter(p => p.productId !== editingProduct.productId).map(p => p.productId)}
          defaultDiscountRate={eventPrice.discountRate}
          initialProduct={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  )
}
