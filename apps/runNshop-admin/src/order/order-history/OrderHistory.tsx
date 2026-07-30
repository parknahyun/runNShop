'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import OrderDetail from './OrderDetail'
import { useTabContext } from '@/shell/TabContext'
import {
  type Order, type OrderStatus, type OrderFilter,
  ORDER_STATUS_LABEL, MOCK_ORDERS, filterOrders,
} from './mockData'

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

function SummaryBar({ orders }: { orders: Order[] }) {
  const paymentCompleted = orders.filter(o => o.status === 'PAYMENT_COMPLETED').length
  const preparing = orders.filter(o => o.status === 'PREPARING').length
  const inDelivery = orders.filter(o => o.status === 'IN_DELIVERY').length
  const delivered = orders.filter(o => o.status === 'DELIVERED').length
  const confirmed = orders.filter(o => o.status === 'CONFIRMED').length
  const cancelled = orders.filter(o => o.status === 'CANCELLED').length

  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{orders.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">결제완료</div>
        <div className="summary-card__count">{paymentCompleted}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">준비중</div>
        <div className="summary-card__count">{preparing}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">배송중</div>
        <div className="summary-card__count">{inDelivery}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">배송완료</div>
        <div className="summary-card__count">{delivered}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">구매확정</div>
        <div className="summary-card__count">{confirmed}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">취소</div>
        <div className="summary-card__count">{cancelled}건</div>
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
  const [displayed, setDisplayed] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterOrders(MOCK_ORDERS, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleOpenDetail(order: Order) {
    openTab({
      id: `order-detail/${order.orderId}`,
      label: `주문 ${order.platformOrderNo}`,
      element: <OrderDetail order={order} onClose={() => {}} />,
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
            {displayed.length > 0 && <SummaryBar orders={displayed} />}
            <Toolbar />
          </div>
          {displayed.length > 0 ? (
            <>
              <OrderTable orders={pageItems} onRowClick={handleOpenDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
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
