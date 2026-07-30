'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import ProductReviewDetail from './ProductReviewDetail'
import {
  type Product, type ProductApprovalStatus, type ProductFilter,
  PRODUCT_APPROVAL_STATUS_LABEL, MOCK_BRANDS,
  MOCK_PRODUCTS, filterProducts, getBrandName, getCategoryName,
} from '@/product/product-list/mockData'
import { ProductSaleStatusBadge, ProductApprovalStatusBadge } from '@/product/product-list/ProductStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const APPROVAL_STATUS_OPTIONS: Array<{ label: string; value: ProductApprovalStatus | 'ALL' }> = [
  { label: '전체 심사상태', value: 'ALL' },
  ...Object.entries(PRODUCT_APPROVAL_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as ProductApprovalStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ProductFilter
  onChange: (f: ProductFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="상품ID / 상품명 / 입점사 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.brandId}
        onChange={(e) => onChange({ ...filter, brandId: e.target.value })}>
        <option value="ALL">전체 브랜드</option>
        {MOCK_BRANDS.map((b) => (
          <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
        ))}
      </select>
      <select value={filter.approvalStatus}
        onChange={(e) => onChange({ ...filter, approvalStatus: e.target.value as ProductApprovalStatus | 'ALL' })}>
        {APPROVAL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Product[] }) {
  const pending = items.filter(p => p.approvalStatus === 'PENDING').length
  const approved = items.filter(p => p.approvalStatus === 'APPROVED').length
  const rejected = items.filter(p => p.approvalStatus === 'REJECTED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">심사대기</div>
        <div className="summary-card__count">{pending}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">승인</div>
        <div className="summary-card__count">{approved}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">반려</div>
        <div className="summary-card__count">{rejected}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProductReviewTable
// ---------------------------------------------------------------------------

function ProductReviewTable({ items, onRowClick }: {
  items: Product[]
  onRowClick: (p: Product) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>상품ID</th>
            <th>상품명</th>
            <th>브랜드</th>
            <th>표준카테고리</th>
            <th>입점사</th>
            <th>판매가</th>
            <th>등록 시 판매상태</th>
            <th>심사상태</th>
            <th>등록(신청)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.productId} onClick={() => onRowClick(p)}>
              <td className="link-cell">{p.productId}</td>
              <td style={{ fontWeight: 500 }}>{p.productName}</td>
              <td style={{ fontSize: 12 }}>{getBrandName(p.brandId)}</td>
              <td style={{ fontSize: 12 }}>{getCategoryName(p.categoryId)}</td>
              <td style={{ fontSize: 12 }}>{p.vendorName}</td>
              <td style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>{p.priceSale.toLocaleString()}원</td>
              <td><ProductSaleStatusBadge status={p.saleStatus} /></td>
              <td><ProductApprovalStatusBadge status={p.approvalStatus} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>
                <div>{p.createdBy}</div>
                <div>{p.createdAt}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — ProductReviewDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function ProductReviewPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Product[]>(MOCK_PRODUCTS)
  const [filter, setFilter] = useState<ProductFilter>({ keyword: '', brandId: 'ALL', saleStatus: 'ALL', approvalStatus: 'PENDING' })
  const [displayed, setDisplayed] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Product>({
    mode: DETAIL_MODE,
    getTabId: (item) => `product-review-detail/${item.productId}`,
    getTabLabel: (item) => `상품심사 ${item.productId}`,
    renderDetail: (item, onClose) => (
      <ProductReviewDetail mode={DETAIL_MODE} product={item} currentUser={currentUser} onClose={onClose} onReview={handleReview} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterProducts(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleReview(updated: Product) {
    const next = allItems.map((p) => p.productId === updated.productId ? updated : p)
    setAllItems(next)
    setDisplayed(filterProducts(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">상품 심사</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
          </div>
          {displayed.length > 0 ? (
            <>
              <ProductReviewTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 상품이 없습니다.'
                  : '조회 버튼을 눌러 심사 대상 상품 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
