'use client'
import { useState } from 'react'
import {
  type Product, type ProductSaleStatus,
  PRODUCT_SALE_STATUS_LABEL, MOCK_BRANDS, MOCK_STANDARD_CATEGORIES,
  formatCategoryOptionLabel, getBrandName, getCategoryName,
} from '../mockData'
import { ProductSaleStatusBadge, ProductApprovalStatusBadge } from '../ProductStatusBadge'

interface Draft {
  productName: string
  brandId: string
  categoryId: string
  vendorName: string
  priceOriginal: string
  priceSale: string
  saleStatus: ProductSaleStatus
  description: string
}

function toDraft(p: Product): Draft {
  return {
    productName: p.productName, brandId: p.brandId, categoryId: p.categoryId, vendorName: p.vendorName,
    priceOriginal: String(p.priceOriginal), priceSale: String(p.priceSale), saleStatus: p.saleStatus,
    description: p.description,
  }
}

export default function BasicInfoTab({ product, currentUser, onUpdate, readOnly = false }: {
  product: Product
  currentUser: string
  onUpdate: (updated: Product) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(product))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...product,
      productName: draft.productName,
      brandId: draft.brandId,
      categoryId: draft.categoryId,
      vendorName: draft.vendorName,
      priceOriginal: Number(draft.priceOriginal) || 0,
      priceSale: Number(draft.priceSale) || 0,
      saleStatus: draft.saleStatus,
      description: draft.description,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(product))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>상품명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.productName}
                onChange={(e) => setDraft({ ...draft, productName: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>브랜드 <span className="add-form__req">*</span></label>
              <select value={draft.brandId}
                onChange={(e) => setDraft({ ...draft, brandId: e.target.value })}>
                {MOCK_BRANDS.map((b) => (
                  <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                ))}
              </select>
            </div>
            <div className="add-form__field">
              <label>표준카테고리 <span className="add-form__req">*</span></label>
              <select value={draft.categoryId}
                onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                {MOCK_STANDARD_CATEGORIES.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{formatCategoryOptionLabel(c)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>입점사명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.vendorName}
                onChange={(e) => setDraft({ ...draft, vendorName: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>판매상태</label>
              <select value={draft.saleStatus}
                onChange={(e) => setDraft({ ...draft, saleStatus: e.target.value as ProductSaleStatus })}>
                {Object.entries(PRODUCT_SALE_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>정상가 <span className="add-form__req">*</span></label>
              <input type="number" value={draft.priceOriginal}
                onChange={(e) => setDraft({ ...draft, priceOriginal: e.target.value })} />
            </div>
            <div className="add-form__field">
              <label>판매가 <span className="add-form__req">*</span></label>
              <input type="number" value={draft.priceSale}
                onChange={(e) => setDraft({ ...draft, priceSale: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>상세설명</label>
              <textarea rows={10} value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="상품 상세페이지에 노출될 설명을 입력하세요" />
            </div>
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add"
              disabled={!draft.productName.trim() || !draft.vendorName.trim() || !Number(draft.priceOriginal) || !Number(draft.priceSale)}
              onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>상품ID</dt><dd style={{ fontWeight: 600 }}>{product.productId}</dd></div>
          <div className="info-row"><dt>상품명</dt><dd style={{ fontWeight: 600 }}>{product.productName}</dd></div>
          <div className="info-row"><dt>브랜드</dt><dd>{getBrandName(product.brandId)}</dd></div>
          <div className="info-row"><dt>표준카테고리</dt><dd>{getCategoryName(product.categoryId)}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>입점사</dt><dd>{product.vendorName}</dd></div>
          <div className="info-row"><dt>정상가</dt><dd>{product.priceOriginal.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>판매가</dt><dd style={{ fontWeight: 600, color: '#dc2626' }}>{product.priceSale.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>판매상태</dt><dd><ProductSaleStatusBadge status={product.saleStatus} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>심사상태</dt><dd><ProductApprovalStatusBadge status={product.approvalStatus} /></dd></div>
          {product.approvalStatus === 'REJECTED' && (
            <div className="info-row"><dt>반려사유</dt><dd style={{ fontSize: 12, color: '#dc2626' }}>{product.rejectReason}</dd></div>
          )}
          <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{product.createdBy} / {product.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{product.updatedBy} / {product.updatedAt}</dd></div>
        </dl>
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>상세설명</div>
        {product.description ? (
          <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {product.description}
          </p>
        ) : (
          <p className="state-msg" style={{ margin: 0 }}>등록된 상세설명이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
