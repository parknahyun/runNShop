'use client'
import { useState } from 'react'
import { type Product, type ProductStatus, PRODUCT_STATUS_LABEL, MOCK_PRODUCTS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import ProductRegister from '@/product/product-register/ProductRegister'
import ProductDetail from './ProductDetail'

const STATUS_OPTIONS: Array<{ label: string; value: ProductStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '판매중', value: 'ON_SALE' },
  { label: '품절', value: 'SOLD_OUT' },
  { label: '심사중', value: 'UNDER_REVIEW' },
  { label: '반려', value: 'REJECTED' },
  { label: '임시저장', value: 'DRAFT' },
]

export default function ProductList() {
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<Product[]>(MOCK_PRODUCTS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  function onAddProduct() {
    setShowRegister(true)
  }

  function handleSearch() {
    let result = MOCK_PRODUCTS
    if (statusFilter !== 'ALL') result = result.filter((p) => p.status === statusFilter)
    if (keyword) result = result.filter((p) => p.name.includes(keyword) || p.category.includes(keyword))
    setDisplayed(result)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const onSale = displayed.filter(p => p.status === 'ON_SALE').length
  const soldOut = displayed.filter(p => p.status === 'SOLD_OUT').length
  const underReview = displayed.filter(p => p.status === 'UNDER_REVIEW').length
  const rejected = displayed.filter(p => p.status === 'REJECTED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">상품 목록</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="text" placeholder="상품명 · 카테고리" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}개</div></div>
          <div className="summary-card"><div className="summary-card__label">판매중</div><div className="summary-card__count">{onSale}</div></div>
          {soldOut > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 품절</div><div className="summary-card__count">{soldOut}</div></div>}
          {underReview > 0 && <div className="summary-card summary-card--info"><div className="summary-card__label">심사중</div><div className="summary-card__count">{underReview}</div></div>}
          {rejected > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">반려</div><div className="summary-card__count">{rejected}</div></div>}
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
            <button className="btn-tool btn-tool--add" onClick={onAddProduct}>+ 상품 등록</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>상품ID</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>상태</th>
                <th>판매가</th>
                <th>재고</th>
                <th>평점</th>
                <th>최종수정</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.product_id} onClick={() => setSelectedProduct(p)}
                  data-product-status={p.status === 'SOLD_OUT' ? 'soldout' : p.status === 'REJECTED' ? 'rejected' : undefined}
                >
                  <td className="link-cell">{p.product_id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td><span className="badge" data-product-status={p.status}>{PRODUCT_STATUS_LABEL[p.status]}</span></td>
                  <td className="amount-cell">{p.price_sale.toLocaleString()}원</td>
                  <td>
                    {p.total_stock}개 / {p.sku_count}SKU
                    {p.soldout_sku > 0 && <span style={{ marginLeft: 6, color: '#dc2626', fontSize: 11 }}>⚠ {p.soldout_sku}SKU 품절</span>}
                  </td>
                  <td>{p.rating > 0 ? `★ ${p.rating} (${p.review_count})` : '-'}</td>
                  <td>{p.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 상품이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {showRegister && <ProductRegister onClose={() => setShowRegister(false)} />}
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}
