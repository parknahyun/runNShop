'use client';

import { useEffect, useState } from 'react';

// === 타입 (화면레이아웃 §11 API 응답 기반) ===
interface OrderRow {
  order_id: string;
  order_number: string;
  product_name: string;
  customer_name: string;
  vendor_name: string;
  status: string;
  status_label: string;
  total_amount: number;
  ordered_at: string;
}

interface StatusSummary {
  label: string;
  count: number;
  status_key: string;
}

interface OrderListResponse {
  summary: StatusSummary[];
  orders: OrderRow[];
  total_count: number;
  page: number;
  page_size: number;
}

// === 뱃지 색상 매핑 (C-3: .badge--{color}) ===
function getBadgeClass(status: string): string {
  switch (status) {
    case 'ORDER_RECEIVED':
    case 'PAYMENT_COMPLETED': return 'badge badge--blue';
    case 'PREPARING': return 'badge badge--yellow';
    case 'IN_DELIVERY': return 'badge badge--blue';
    case 'DELIVERED': return 'badge badge--green';
    case 'CONFIRMED': return 'badge badge--green';
    case 'CANCELLED':
    case 'PAYMENT_FAILED': return 'badge badge--red';
    default: return 'badge badge--gray';
  }
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

// === 주문 현황 페이지 (C-3 T-LIST: PageTitle + SummaryBar + FilterBar + Table + Pagination) ===
export default function OrderHistoryPage() {
  const [data, setData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('size', '10');

      const res = await fetch(`/api/admin/v1/orders?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json.data);
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  }

  const totalPages = data ? Math.ceil(data.total_count / data.page_size) : 0;

  return (
    <div className="page">
      {/* PageTitle */}
      <h1 className="page-title">주문 현황</h1>

      {/* SummaryBar */}
      {data && (
        <div className="summary-bar">
          {data.summary.map((s) => (
            <div
              key={s.status_key}
              className={`summary-card ${statusFilter === s.status_key ? 'summary-card--warn' : ''}`}
              onClick={() => setStatusFilter(s.status_key === statusFilter ? '' : s.status_key)}
            >
              <div className="summary-card__label">{s.label}</div>
              <div className="summary-card__count">{s.count}</div>
            </div>
          ))}
        </div>
      )}

      {/* FilterBar */}
      <div className="filter-bar">
        <input
          className="filter-bar__input"
          placeholder="주문번호·상품명·고객명"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="filter-bar__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value="ORDER_RECEIVED">접수</option>
          <option value="PAYMENT_COMPLETED">결제완료</option>
          <option value="PREPARING">준비중</option>
          <option value="IN_DELIVERY">배송중</option>
          <option value="DELIVERED">배송완료</option>
          <option value="CONFIRMED">구매확정</option>
          <option value="CANCELLED">취소</option>
        </select>
        <button className="filter-bar__btn" onClick={() => { setPage(1); fetchOrders(); }}>
          조회
        </button>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
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
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>로딩 중...</td></tr>
            ) : data && data.orders.length > 0 ? (
              data.orders.map((order) => (
                <tr key={order.order_id}>
                  <td><span className="table__link">{order.order_number}</span></td>
                  <td>{order.product_name}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.vendor_name}</td>
                  <td><span className={getBadgeClass(order.status)}>{order.status_label}</span></td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(order.total_amount)}</td>
                  <td>{order.ordered_at}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ◁
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="pagination__btn"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            ▷
          </button>
        </div>
      )}
    </div>
  );
}
