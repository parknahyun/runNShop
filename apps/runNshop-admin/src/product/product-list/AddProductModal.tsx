'use client'
import { useState } from 'react'
import {
  type Product, type ProductSaleStatus,
  PRODUCT_SALE_STATUS_LABEL, MOCK_BRANDS, MOCK_STANDARD_CATEGORIES,
  formatCategoryOptionLabel, nextProductId,
} from './mockData'

interface AddForm {
  productName: string
  brandId: string
  categoryId: string
  vendorName: string
  priceOriginal: string
  priceSale: string
  saleStatus: ProductSaleStatus
}

const EMPTY_FORM: AddForm = {
  productName: '', brandId: '', categoryId: '', vendorName: '',
  priceOriginal: '', priceSale: '', saleStatus: 'ON_SALE',
}

export default function AddProductModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (product: Product) => void
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)

  function canAdd() {
    return form.productName.trim() !== '' && form.brandId !== '' && form.categoryId !== ''
      && form.vendorName.trim() !== '' && Number(form.priceOriginal) > 0 && Number(form.priceSale) > 0
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const product: Product = {
      productId: nextProductId(),
      productName: form.productName.trim(),
      brandId: form.brandId,
      categoryId: form.categoryId,
      vendorName: form.vendorName.trim(),
      priceOriginal: Number(form.priceOriginal),
      priceSale: Number(form.priceSale),
      saleStatus: form.saleStatus,
      // 신규 등록 상품은 항상 심사대기로 시작한다 — 승인/반려는 "상품 심사" 화면에서 처리한다
      approvalStatus: 'PENDING',
      rejectReason: '',
      // 설명·이미지·옵션·재고는 등록 후 상세의 각 탭에서 구성한다. 문의·상품평은 고객이 남기므로 등록 시 항상 빈 상태다.
      description: '',
      images: [], options: [], skus: [], stockHistories: [], inquiries: [], reviews: [],
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(product)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">상품 등록</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>상품명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="예) 에어줌 페가수스 41" />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>브랜드 <span className="add-form__req">*</span></label>
                <select value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
                  <option value="">선택하세요</option>
                  {MOCK_BRANDS.filter((b) => b.status === 'ACTIVE').map((b) => (
                    <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                  ))}
                </select>
              </div>
              <div className="add-form__field">
                <label>표준카테고리 <span className="add-form__req">*</span></label>
                <select value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">선택하세요</option>
                  {MOCK_STANDARD_CATEGORIES.filter((c) => c.status === 'ACTIVE').map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{formatCategoryOptionLabel(c)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>입점사명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.vendorName}
                  onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                  placeholder="예) 나이키코리아" />
              </div>
              <div className="add-form__field">
                <label>판매상태</label>
                <select value={form.saleStatus}
                  onChange={(e) => setForm({ ...form, saleStatus: e.target.value as ProductSaleStatus })}>
                  {Object.entries(PRODUCT_SALE_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>정상가 <span className="add-form__req">*</span></label>
                <input type="number" value={form.priceOriginal}
                  onChange={(e) => setForm({ ...form, priceOriginal: e.target.value })}
                  placeholder="예) 179000" />
              </div>
              <div className="add-form__field">
                <label>판매가 <span className="add-form__req">*</span></label>
                <input type="number" value={form.priceSale}
                  onChange={(e) => setForm({ ...form, priceSale: e.target.value })}
                  placeholder="예) 159000" />
              </div>
            </div>

            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>
              등록된 상품은 "심사대기" 상태로 시작하며, "상품 심사" 화면에서 승인해야 실제 판매 화면에 노출된다.
            </p>

            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" disabled={!canAdd()} onClick={handleAdd}>등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
