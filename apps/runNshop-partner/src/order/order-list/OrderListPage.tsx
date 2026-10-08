'use client'
import { useState } from 'react'
import { type Order, type OrderStatus, ORDER_STATUS_LABEL } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import { api } from '../../../lib/api'
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

// 호출방식: 'tab'(MDI 탭, 기본) 또는 'modal'(팝업)로 전환 가능 — OrderDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'tab'

// ---------------------------------------------------------------------------
// 서버 응답 타입 (DL §22)
// ---------------------------------------------------------------------------

interface OrderPagination {
  page: number
  size: number
  totalCount: number
  totalPages: number
}

interface OrderListResponse {
  orders: Order[]
  pagination: OrderPagination
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<OrderPagination | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<string>({
    mode: DETAIL_MODE,
    getTabId: (orderId) => `order-detail/${orderId}`,
    getTabLabel: (orderId) => `주문 ${orderId}`,
    renderDetail: (orderId, onClose) => (
      <OrderDetail orderId={orderId} mode={DETAIL_MODE} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  async function fetchOrders(status: OrderStatus | 'ALL', kw: string, from: string, to: string, pageToUse: number, sizeToUse: number) {
    setLoading(true)
    // DL §22 쿼리 순서: status,from,to,keyword,page,size
    const qs = new URLSearchParams({
      status,
      from,
      to,
      keyword: kw,
      page: String(pageToUse),
      size: String(sizeToUse),
    })
    try {
      const res = await api<OrderListResponse>(`/orders?${qs}`)
      setOrders(res.orders)
      setPagination(res.pagination)
      setPage(pageToUse)
      setPageSize(sizeToUse)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    fetchOrders(statusFilter, keyword, dateFrom, dateTo, 1, pageSize)
  }

  function handleUpdate(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)))
    setModalItem(updated.orderId)
  }

  const paymentCompleted = orders.filter((o) => o.status === 'PAYMENT_COMPLETED').length
  const preparing = orders.filter((o) => o.status === 'PREPARING').length
  const inDelivery = orders.filter((o) => o.status === 'IN_DELIVERY').length
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length

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

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {/* SummaryBar */}
            <div className="summary-bar">
              <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{orders.length}개</div></div>
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
          {orders.length > 0 && pagination ? (
            <>
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
                    {orders.map((o) => (
                      <tr key={o.orderId} onClick={() => openDetail(o.orderId)}>
                        <td className="link-cell">{o.platformOrderNo}</td>
                        <td>{o.productName}</td>
                        <td>{o.customerName}</td>
                        <td>{o.quantity}개</td>
                        <td className="amount-cell">{o.amount.toLocaleString()}원</td>
                        <td><span className="badge" data-vnd-order-status={o.status}>{ORDER_STATUS_LABEL[o.status]}</span></td>
                        <td>{o.orderDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination page={pagination.page} totalPages={pagination.totalPages} pageSize={pagination.size}
                onPageChange={(p) => fetchOrders(statusFilter, keyword, dateFrom, dateTo, p, pageSize)}
                onPageSizeChange={(s) => fetchOrders(statusFilter, keyword, dateFrom, dateTo, 1, s)} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched ? '조건에 맞는 주문이 없습니다.' : '조회 버튼을 눌러 주문 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
