'use client'
import { useState } from 'react'
import {
  type Coupon, type CouponProductTargetType,
  COUPON_PRODUCT_TARGET_TYPE_LABEL, MOCK_PRODUCT_CATALOG, MOCK_STANDARD_CATEGORIES,
} from '../mockData'

// ---------------------------------------------------------------------------
// 상품 검색 팝업 (임의선택, 다중선택 가능)
// ---------------------------------------------------------------------------

function ProductSearchModal({ existingIds, onClose, onSelect }: {
  existingIds: string[]
  onClose: () => void
  onSelect: (product: typeof MOCK_PRODUCT_CATALOG[0]) => void
}) {
  const [keyword, setKeyword] = useState('')
  const results = keyword.trim()
    ? MOCK_PRODUCT_CATALOG.filter((p) => p.productName.includes(keyword) || p.productId.includes(keyword))
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
          <div className="table-wrap" style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 0 }}>
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

export default function ProductsTab({ coupon, onSave, readOnly = false, locked = false }: {
  coupon: Coupon
  onSave: (v: { productTargetType: CouponProductTargetType; targetProductIds: string[]; targetCategoryIds: string[] }) => void
  readOnly?: boolean
  /** 장바구니 쿠폰: 적용상품이 항상 전체로 고정되며 유형 변경 불가 */
  locked?: boolean
}) {
  const [productTargetType, setProductTargetType] = useState<CouponProductTargetType>(locked ? 'ALL' : coupon.productTargetType)
  const [targetProductIds, setTargetProductIds] = useState<string[]>(coupon.targetProductIds)
  const [targetCategoryIds, setTargetCategoryIds] = useState<string[]>(coupon.targetCategoryIds)
  const [showSearch, setShowSearch] = useState(false)

  const isDirty = productTargetType !== coupon.productTargetType
    || JSON.stringify(targetProductIds) !== JSON.stringify(coupon.targetProductIds)
    || JSON.stringify(targetCategoryIds) !== JSON.stringify(coupon.targetCategoryIds)

  function addProduct(p: typeof MOCK_PRODUCT_CATALOG[0]) {
    if (targetProductIds.includes(p.productId)) return
    setTargetProductIds((prev) => [...prev, p.productId])
  }

  function removeProduct(productId: string) {
    setTargetProductIds((prev) => prev.filter((id) => id !== productId))
  }

  function toggleCategory(categoryId: string) {
    setTargetCategoryIds((prev) => prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId])
  }

  function handleSave() {
    onSave({ productTargetType, targetProductIds, targetCategoryIds })
  }

  function handleCancel() {
    setProductTargetType(locked ? 'ALL' : coupon.productTargetType)
    setTargetProductIds(coupon.targetProductIds)
    setTargetCategoryIds(coupon.targetCategoryIds)
  }

  return (
    <div className="tab-panel-content">
      <div className="add-form__row" style={{ marginBottom: 4 }}>
        <div className="add-form__field">
          <label>적용상품 유형</label>
          <select value={productTargetType} disabled={readOnly || locked}
            onChange={(e) => setProductTargetType(e.target.value as CouponProductTargetType)}>
            {Object.entries(COUPON_PRODUCT_TARGET_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {locked && <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>장바구니 쿠폰은 적용상품이 전체로 고정됩니다.</p>}
        </div>
      </div>

      {productTargetType === 'ALL' ? (
        <div className="table-wrap">
          <p className="state-msg">전체 상품에 적용됩니다.</p>
        </div>
      ) : productTargetType === 'MANUAL' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>임의선택 상품 ({targetProductIds.length}건)</span>
            <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowSearch(true)}>+ 상품 추가</button>
          </div>
          {targetProductIds.length === 0 ? (
            <div className="table-wrap">
              <p className="state-msg">선택된 상품이 없습니다. 상단 버튼으로 상품을 추가하세요.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>상품ID</th>
                    <th>상품명</th>
                    <th>브랜드</th>
                    <th>정상가</th>
                    <th style={{ width: 70 }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {targetProductIds.map((id) => {
                    const p = MOCK_PRODUCT_CATALOG.find((item) => item.productId === id)
                    return (
                      <tr key={id}>
                        <td style={{ fontSize: 12 }}>{id}</td>
                        <td style={{ fontWeight: 500 }}>{p?.productName ?? '-'}</td>
                        <td style={{ fontSize: 12 }}>{p?.brand ?? '-'}</td>
                        <td style={{ fontSize: 12 }}>{p ? `${p.price.toLocaleString()}원` : '-'}</td>
                        <td>
                          <button className="btn-tool btn-tool--delete" disabled={readOnly} style={{ height: 24, padding: '0 8px', fontSize: 11 }} onClick={() => removeProduct(id)}>삭제</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>표준카테고리 ({targetCategoryIds.length}건 선택)</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 50 }}>선택</th>
                  <th>카테고리ID</th>
                  <th>카테고리명</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STANDARD_CATEGORIES.map((cat) => {
                  const checked = targetCategoryIds.includes(cat.categoryId)
                  return (
                    <tr key={cat.categoryId} onClick={() => !readOnly && toggleCategory(cat.categoryId)} style={{ cursor: readOnly ? 'default' : 'pointer' }}>
                      <td><input type="checkbox" checked={checked} disabled={readOnly}
                        onChange={() => toggleCategory(cat.categoryId)} onClick={(e) => e.stopPropagation()} /></td>
                      <td style={{ fontSize: 12 }}>{cat.categoryId}</td>
                      <td style={{ fontWeight: 500 }}>{cat.categoryName}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>

      {showSearch && (
        <ProductSearchModal
          existingIds={targetProductIds}
          onClose={() => setShowSearch(false)}
          onSelect={addProduct}
        />
      )}
    </div>
  )
}
