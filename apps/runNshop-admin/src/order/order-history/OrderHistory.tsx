'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import OrderDetail from './OrderDetail'
import { useTabContext } from '@/shell/TabContext'
import { api } from '../../../lib/api'
import {
  type Order, type OrderStatus, type OrderFilter,
  ORDER_STATUS_LABEL,
} from './mockData'

// ---------------------------------------------------------------------------
// 서버 응답 타입
// ---------------------------------------------------------------------------

interface OrderSummary {
  all: number
  orderReceived: number
  paymentCompleted: number
  preparing: number
  inDelivery: number
  delivered: number
  confirmed: number
  cancelled: number
}

interface OrderPagination {
  page: number
  size: number
  totalCount: number
  totalPages: number
}

interface OrderListResponse {
  orders: Order[]
  summary: OrderSummary
  pagination: OrderPagination
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: OrderStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(ORDER_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as OrderStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: OrderFilter
  onChange: (f: OrderFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="주문번호 · 상품명 · 고객명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as OrderStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" value={filter.from}
        onChange={(e) => onChange({ ...filter, from: e.target.value })} />
      <span className="sep">~</span>
      <input type="date" value={filter.to}
        onChange={(e) => onChange({ ...filter, to: e.target.value })} />
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ summary }: { summary: OrderSummary }) {
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{summary.all}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">접수</div>
        <div className="summary-card__count">{summary.orderReceived}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">결제완료</div>
        <div className="summary-card__count">{summary.paymentCompleted}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">준비중</div>
        <div className="summary-card__count">{summary.preparing}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">배송중</div>
        <div className="summary-card__count">{summary.inDelivery}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">배송완료</div>
        <div className="summary-card__count">{summary.delivered}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">구매확정</div>
        <div className="summary-card__count">{summary.confirmed}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">취소</div>
        <div className="summary-card__count">{summary.cancelled}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar() {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OrderTable
// ---------------------------------------------------------------------------

function OrderTable({ orders, onRowClick }: {
  orders: Order[]
  onRowClick: (o: Order) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>상품명</th>
            <th>주문자</th>
            <th>입점사</th>
            <th>상태</th>
            <th>결제금액</th>
            <th>주문일시</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} onClick={() => onRowClick(order)}
              data-exh-live={order.status === 'IN_DELIVERY' ? 'true' : undefined}
              data-exh-ended={order.status === 'CANCELLED' ? 'true' : undefined}>
              <td className="link-cell">{order.platformOrderNo}</td>
              <td style={{ fontWeight: 500 }}>{order.productName}</td>
              <td>{order.customer}</td>
              <td>{order.vendorName}</td>
              <td><span className="badge" data-order-status={order.status}>{ORDER_STATUS_LABEL[order.status]}</span></td>
              <td className="amount-cell">{order.amount.toLocaleString()}원</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{order.orderDate}</td>
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

export default function OrderHistory() {
  const { openTab } = useTabContext()
  const [filter, setFilter] = useState<OrderFilter>({ keyword: '', status: 'ALL', from: '', to: '' })
  const [orders, setOrders] = useState<Order[]>([])
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [pagination, setPagination] = useState<OrderPagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  async function fetchOrders(filterToUse: OrderFilter, pageToUse: number, pageSizeToUse: number) {
    setLoading(true)
    const qs = new URLSearchParams({
      keyword: filterToUse.keyword,
      status: filterToUse.status,
      from: filterToUse.from,
      to: filterToUse.to,
      page: String(pageToUse),
      size: String(pageSizeToUse),
    })
    try {
      const res = await api<OrderListResponse>(`/orders?${qs}`)
      setOrders(res.orders)
      setSummary(res.summary)
      setPagination(res.pagination)
      setPage(pageToUse)
      setPageSize(pageSizeToUse)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    fetchOrders(filter, 1, pageSize)
  }

  function handleOpenDetail(order: Order) {
    openTab({
      id: `order-detail/${order.orderId}`,
      label: `주문 ${order.platformOrderNo}`,
      element: <OrderDetail orderId={order.orderId} onClose={() => {}} />,
    })
  }

  return (
    <div className="page">
      <h1 className="page-title">주문 현황</h1>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {summary && <SummaryBar summary={summary} />}
            <Toolbar />
          </div>
          {orders.length > 0 && pagination ? (
            <>
              <OrderTable orders={orders} onRowClick={handleOpenDetail} />
              <Pagination page={pagination.page} totalPages={pagination.totalPages} pageSize={pagination.size}
                onPageChange={(p) => fetchOrders(filter, p, pageSize)}
                onPageSizeChange={(s) => fetchOrders(filter, 1, s)} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 주문이 없습니다.'
                  : '조회 버튼을 눌러 주문 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
