'use client'
import { useState } from 'react'
import { type Order, type OrderStatus, ORDER_STATUS_LABEL, MOCK_ORDERS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import OrderDetail from './OrderDetail'

const STATUS_OPTIONS: Array<{ label: string; value: OrderStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '결제완료', value: 'PAYMENT_COMPLETED' },
  { label: '준비중', value: 'PREPARING' },
  { label: '배송중', value: 'IN_DELIVERY' },
  { label: '배송완료', value: 'DELIVERED' },
  { label: '구매확정', value: 'CONFIRMED' },
  { label: '취소', value: 'CANCELLED' },
]

function toDateInputValue(orderDate: string) {
  return orderDate.slice(0, 10).replace(/\./g, '-')
}

// 호출방식: 'tab'(MDI 탭, 기본) 또는 'modal'(팝업)로 전환 가능 — OrderDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'tab'

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [displayed, setDisplayed] = useState<Order[]>(MOCK_ORDERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Order>({
    mode: DETAIL_MODE,
    getTabId: (o) => `order-detail/${o.order_id}`,
    getTabLabel: (o) => `주문 ${o.platform_order_no}`,
    renderDetail: (o, onClose) => (
      <OrderDetail order={o} mode={DETAIL_MODE} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  function handleSearch() {
    let result = orders
    if (statusFilter !== 'ALL') result = result.filter((o) => o.status === statusFilter)
    if (keyword) {
      result = result.filter((o) =>
        o.platform_order_no.includes(keyword) || o.product_name.includes(keyword) || o.customer_name.includes(keyword))
    }
    if (dateFrom) result = result.filter((o) => toDateInputValue(o.order_date) >= dateFrom)
    if (dateTo) result = result.filter((o) => toDateInputValue(o.order_date) <= dateTo)
    setDisplayed(result)
    setPage(1)
  }

  function handleUpdate(updated: Order) {
    const apply = (o: Order) => o.order_id === updated.order_id ? updated : o
    setOrders((prev) => prev.map(apply))
    setDisplayed((prev) => prev.map(apply))
    setModalItem(updated)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const paymentCompleted = displayed.filter((o) => o.status === 'PAYMENT_COMPLETED').length
  const preparing = displayed.filter((o) => o.status === 'PREPARING').length
  const inDelivery = displayed.filter((o) => o.status === 'IN_DELIVERY').length
  const delivered = displayed.filter((o) => o.status === 'DELIVERED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">주문 목록</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <span className="sep">~</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <input type="text" placeholder="주문번호 · 상품명 · 고객명" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}개</div></div>
          <div className="summary-card"><div className="summary-card__label">결제완료</div><div className="summary-card__count">{paymentCompleted}</div></div>
          <div className="summary-card"><div className="summary-card__label">준비중</div><div className="summary-card__count">{preparing}</div></div>
          <div className="summary-card"><div className="summary-card__label">배송중</div><div className="summary-card__count">{inDelivery}</div></div>
          <div className="summary-card"><div className="summary-card__label">배송완료</div><div className="summary-card__count">{delivered}</div></div>
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>일괄 출고 처리</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>상품명</th>
                <th>고객명</th>
                <th>수량</th>
                <th>금액</th>
                <th>상태</th>
                <th>주문일자</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((o) => (
                <tr key={o.order_id} onClick={() => openDetail(o)}>
                  <td className="link-cell">{o.platform_order_no}</td>
                  <td>{o.product_name}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.quantity}개</td>
                  <td className="amount-cell">{o.amount.toLocaleString()}원</td>
                  <td><span className="badge" data-vnd-order-status={o.status}>{ORDER_STATUS_LABEL[o.status]}</span></td>
                  <td>{o.order_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 주문이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {detailModal}
    </div>
  )
}
