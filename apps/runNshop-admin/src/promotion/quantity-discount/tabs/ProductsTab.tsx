'use client'
import { useState } from 'react'
import { type QuantityDiscount, type QuantityDiscountProduct, MOCK_PRODUCT_CATALOG } from '../mockData'

function ProductSearchModal({ existingIds, onClose, onSelect }: {
  existingIds: string[]
  onClose: () => void
  onSelect: (product: typeof MOCK_PRODUCT_CATALOG[0]) => void
}) {
  const [keyword, setKeyword] = useState('')
  const results = keyword.trim()
    ? MOCK_PRODUCT_CATALOG.filter(p => p.productName.includes(keyword) || p.productId.includes(keyword))
    : MOCK_PRODUCT_CATALOG

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">상품 검색</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body tab-panel-content">
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
                  <th>판매가</th>
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
                      <td style={{ fontSize: 12 }}>{p.price.toLocaleString()}원</td>
                      <td>
                        {already
                          ? <span style={{ fontSize: 10, color: '#94a3b8' }}>추가됨</span>
                          : <button className="btn-tool btn-tool--add" style={{ fontSize: 10, padding: '2px 8px', height: 22 }} onClick={() => onSelect(p)}>추가</button>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsTab({ quantityDiscount, onSave, readOnly = false }: {
  quantityDiscount: QuantityDiscount
  onSave: (products: QuantityDiscountProduct[]) => void
  readOnly?: boolean
}) {
  const [products, setProducts] = useState<QuantityDiscountProduct[]>(quantityDiscount.products)
  const [showSearch, setShowSearch] = useState(false)

  const isDirty = JSON.stringify(products) !== JSON.stringify(quantityDiscount.products)
  const basePrice = products[0]?.priceSale ?? null

  function addProduct(p: typeof MOCK_PRODUCT_CATALOG[0]) {
    if (products.some(item => item.productId === p.productId)) return
    if (basePrice != null && p.price !== basePrice) {
      alert(`정책상 동일 판매가(${basePrice.toLocaleString()}원) 상품만 묶을 수 있습니다.`)
      return
    }
    setProducts(prev => [...prev, { productId: p.productId, productName: p.productName, priceSale: p.price }])
  }

  function removeProduct(productId: string) {
    setProducts(prev => prev.filter(p => p.productId !== productId))
  }

  function handleSave() {
    onSave(products)
  }

  function handleCancel() {
    setProducts(quantityDiscount.products)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          적용 상품 ({products.length}건)
          {basePrice != null && <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>· 판매가 {basePrice.toLocaleString()}원 상품만 추가 가능</span>}
        </span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowSearch(true)}>+ 상품 추가</button>
      </div>

      {products.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 상품이 없습니다. 동일 입점사·동일 판매가 상품만 추가할 수 있습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>상품ID</th>
                <th>상품명</th>
                <th>판매가</th>
                <th style={{ width: 70 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.productId}>
                  <td style={{ fontSize: 12 }}>{p.productId}</td>
                  <td style={{ fontWeight: 500 }}>{p.productName}</td>
                  <td style={{ fontSize: 12 }}>{p.priceSale.toLocaleString()}원</td>
                  <td>
                    <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} disabled={readOnly} onClick={() => removeProduct(p.productId)}>삭제</button>
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

      {showSearch && (
        <ProductSearchModal
          existingIds={products.map(p => p.productId)}
          onClose={() => setShowSearch(false)}
          onSelect={addProduct}
        />
      )}
    </div>
  )
}
