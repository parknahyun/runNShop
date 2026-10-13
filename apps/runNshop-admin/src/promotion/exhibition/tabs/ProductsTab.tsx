'use client'
import { useState } from 'react'
import { type Exhibition, type ExhibitionProduct, MOCK_PRODUCT_CATALOG } from '../mockData'

// ---------------------------------------------------------------------------
// 상품 검색 팝업
// ---------------------------------------------------------------------------

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
                  <th>브랜드</th>
                  <th>가격</th>
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

// ---------------------------------------------------------------------------
// ProductsTab
// ---------------------------------------------------------------------------

export default function ProductsTab({ exhibition, onSave, readOnly = false }: {
  exhibition: Exhibition
  onSave: (products: ExhibitionProduct[]) => void
  readOnly?: boolean
}) {
  const [products, setProducts] = useState<ExhibitionProduct[]>(exhibition.products)
  const [showSearch, setShowSearch] = useState(false)

  const isDirty = JSON.stringify(products) !== JSON.stringify(exhibition.products)

  function addProduct(p: typeof MOCK_PRODUCT_CATALOG[0]) {
    if (products.some(item => item.productId === p.productId)) return
    setProducts(prev => [...prev, { ...p, sortOrder: prev.length + 1 }])
  }

  function removeProduct(productId: string) {
    setProducts(prev => {
      const next = prev.filter(p => p.productId !== productId)
      next.forEach((p, i) => { p.sortOrder = i + 1 })
      return next
    })
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    setProducts(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      next.forEach((p, i) => { p.sortOrder = i + 1 })
      return next
    })
  }

  function moveDown(idx: number) {
    setProducts(prev => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      next.forEach((p, i) => { p.sortOrder = i + 1 })
      return next
    })
  }

  function handleSave() {
    onSave(products)
  }

  function handleCancel() {
    setProducts(exhibition.products)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>기획전 상품 ({products.length}건)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowSearch(true)}>+ 상품 추가</button>
      </div>

      {products.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 상품이 없습니다. 상단 버튼으로 상품을 추가하세요.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>순서</th>
                <th>상품ID</th>
                <th>상품명</th>
                <th>브랜드</th>
                <th>가격</th>
                <th>상태</th>
                <th style={{ width: 120 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.productId}>
                  <td style={{ fontSize: 12 }}>{p.sortOrder}</td>
                  <td style={{ fontSize: 12 }}>{p.productId}</td>
                  <td style={{ fontWeight: 500 }}>{p.productName}</td>
                  <td style={{ fontSize: 12 }}>{p.brand}</td>
                  <td style={{ fontSize: 12 }}>{p.price.toLocaleString()}원</td>
                  <td><span className="badge">{p.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="section-item__btn" title="위로" onClick={() => moveUp(idx)} disabled={readOnly || idx === 0}>↑</button>
                      <button className="section-item__btn" title="아래로" onClick={() => moveDown(idx)} disabled={readOnly || idx === products.length - 1}>↓</button>
                      <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} disabled={readOnly} onClick={() => removeProduct(p.productId)}>삭제</button>
                    </div>
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
