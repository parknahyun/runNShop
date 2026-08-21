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

interface OrderListResponse {
  orders: OrderRow[];
  total_count: number;
  page: number;
  page_size: number;
}

// === 뱃지 색상 매핑 (C-3: .badge--{color}) ===
function getBadgeClass(status: string): string {
  switch (status) {
    case 'ORDER_RECEIVED': return 'badge badge--yellow';
    case 'PAYMENT_COMPLETED': return 'badge badge--blue';
    case 'PREPARING': return 'badge badge--yellow';
    case 'IN_DELIVERY': return 'badge badge--blue';
    case 'DELIVERED': return 'badge badge--green';
    case 'CONFIRMED': return 'badge badge--green';
    case 'CANCELLED':
    case 'PAYMENT_FAILED':
    case 'STOCK_FAILED': return 'badge badge--red';
    default: return 'badge badge--gray';
  }
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

// === SummaryBar 고정 8개 상태 (화면레이아웃 §11) ===
const SUMMARY_STATUSES = [
  { key: '', label: '전체' },
  { key: 'ORDER_RECEIVED', label: '접수' },
  { key: 'PAYMENT_COMPLETED', label: '결제완료' },
  { key: 'PREPARING', label: '준비중' },
  { key: 'IN_DELIVERY', label: '배송중' },
  { key: 'DELIVERED', label: '배송완료' },
  { key: 'CONFIRMED', label: '구매확정' },
  { key: 'CANCELLED', label: '취소' },
];

// === Mock 데이터 (API 연동 전) ===
const MOCK_ORDERS: OrderRow[] = [
  { order_id: '1', order_number: 'ORD-20260626-001', product_name: '나이키 페가수스 41', customer_name: '홍*동', vendor_name: '나이키코리아', status: 'PAYMENT_COMPLETED', status_label: '결제완료', total_amount: 152000, ordered_at: '2026.06.26' },
  { order_id: '2', order_number: 'ORD-20260626-002', product_name: '아식스 젤카야노 31', customer_name: '김*수', vendor_name: '아식스코리아', status: 'PREPARING', status_label: '준비중', total_amount: 199000, ordered_at: '2026.06.26' },
  { order_id: '3', order_number: 'ORD-20260625-003', product_name: '호카 클리프턴 9', customer_name: '이*진', vendor_name: '호카코리아', status: 'IN_DELIVERY', status_label: '배송중', total_amount: 189000, ordered_at: '2026.06.25' },
  { order_id: '4', order_number: 'ORD-20260625-004', product_name: '아디다스 울트라부스트 24', customer_name: '박*영', vendor_name: '아디다스코리아', status: 'DELIVERED', status_label: '배송완료', total_amount: 219000, ordered_at: '2026.06.25' },
  { order_id: '5', order_number: 'ORD-20260624-005', product_name: '뉴발란스 1080v13', customer_name: '최*호', vendor_name: '뉴발란스코리아', status: 'CONFIRMED', status_label: '구매확정', total_amount: 199000, ordered_at: '2026.06.24' },
  { order_id: '6', order_number: 'ORD-20260624-006', product_name: '나이키 드라이핏 티셔츠', customer_name: '정*아', vendor_name: '나이키코리아', status: 'CONFIRMED', status_label: '구매확정', total_amount: 59000, ordered_at: '2026.06.24' },
  { order_id: '7', order_number: 'ORD-20260623-007', product_name: '아식스 매직스피드 4', customer_name: '김*민', vendor_name: '아식스코리아', status: 'DELIVERED', status_label: '배송완료', total_amount: 249000, ordered_at: '2026.06.23' },
  { order_id: '8', order_number: 'ORD-20260623-008', product_name: '호카 본디 8', customer_name: '이*준', vendor_name: '호카코리아', status: 'DELIVERED', status_label: '배송완료', total_amount: 199000, ordered_at: '2026.06.23' },
  { order_id: '9', order_number: 'ORD-20260622-009', product_name: '나이키 줌플라이 5', customer_name: '한*솔', vendor_name: '나이키코리아', status: 'CONFIRMED', status_label: '구매확정', total_amount: 179000, ordered_at: '2026.06.22' },
  { order_id: '10', order_number: 'ORD-20260622-010', product_name: '아식스 젤님버스 26', customer_name: '강*희', vendor_name: '아식스코리아', status: 'IN_DELIVERY', status_label: '배송중', total_amount: 189000, ordered_at: '2026.06.22' },
  { order_id: '11', order_number: 'ORD-20260621-011', product_name: '뉴발란스 퓨얼셀 SC 엘리트', customer_name: '윤*서', vendor_name: '뉴발란스코리아', status: 'ORDER_RECEIVED', status_label: '접수', total_amount: 289000, ordered_at: '2026.06.21' },
  { order_id: '12', order_number: 'ORD-20260620-012', product_name: '아디다스 러닝 쇼츠', customer_name: '송*현', vendor_name: '아디다스코리아', status: 'CANCELLED', status_label: '취소', total_amount: 45000, ordered_at: '2026.06.20' },
  { order_id: '13', order_number: 'ORD-20260620-013', product_name: '나이키 에어줌 알파플라이 3', customer_name: '조*우', vendor_name: '나이키코리아', status: 'PAYMENT_COMPLETED', status_label: '결제완료', total_amount: 329000, ordered_at: '2026.06.20' },
];

// === 주문 현황 페이지 (화면레이아웃 §11: FilterBar → SummaryBar → Toolbar → Table → Pagination) ===
export default function OrderHistoryPage() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-06-30');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock 필터링
  const filtered = MOCK_ORDERS.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (keyword && !o.order_number.includes(keyword) && !o.product_name.includes(keyword) && !o.customer_name.includes(keyword)) return false;
    return true;
  });

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // SummaryBar 건수 계산
  function getCount(statusKey: string): number {
    if (!statusKey) return MOCK_ORDERS.length;
    return MOCK_ORDERS.filter((o) => o.status === statusKey).length;
  }

  function handleRowClick(order: OrderRow) {
    window.location.href = `/orders/${order.order_id}`;
  }

  return (
    <div className="page">
      {/* PageTitle */}
      <h1 className="page-title">주문 현황</h1>

      {/* FilterBar (화면레이아웃: 키워드 + 상태 + 날짜범위 + [조회]) */}
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
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
        <input
          type="date"
          className="filter-bar__input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{ minWidth: '130px' }}
        />
        <span style={{ color: '#94a3b8', fontSize: '13px' }}>~</span>
        <input
          type="date"
          className="filter-bar__input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{ minWidth: '130px' }}
        />
        <button className="filter-bar__btn" onClick={() => setPage(1)}>조회</button>
      </div>

      {/* SummaryBar + Toolbar 한 줄 (화면레이아웃: 8개 상태 카드 + [엑셀 다운로드]) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div className="summary-bar summary-bar--compact" style={{ flex: 1, marginBottom: 0 }}>
          {SUMMARY_STATUSES.map((s) => (
            <div
              key={s.key}
              className={`summary-card ${statusFilter === s.key ? 'summary-card--info' : ''}`}
              onClick={() => { setStatusFilter(s.key); setPage(1); }}
            >
              <div className="summary-card__label">{s.label}</div>
              <div className="summary-card__count">{getCount(s.key)}</div>
            </div>
          ))}
        </div>
        <button className="filter-bar__btn" style={{ background: '#475569', flexShrink: 0 }}>엑셀 다운로드</button>
      </div>

      {/* Table (화면레이아웃: 주문번호/상품명/주문자/입점사/상태/결제금액/주문일시) */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>상품명</th>
              <th>주문자</th>
              <th>입점사</th>
              <th>상태</th>
              <th style={{ textAlign: 'right' }}>결제금액</th>
              <th>주문일시</th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((order) => (
                <tr key={order.order_id} onClick={() => handleRowClick(order)} style={{ cursor: 'pointer' }}>
                  <td><span className="table__link">{order.order_number}</span></td>
                  <td>{order.product_name}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.vendor_name}</td>
                  <td><span className={getBadgeClass(order.status)}>⦿{order.status_label}</span></td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(order.total_amount)}</td>
                  <td>{order.ordered_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (화면레이아웃: [◁ 1 2 3 ▷] + [10건▾]) */}
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
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          style={{ marginLeft: '12px', height: '32px', padding: '0 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }}
        >
          <option value={10}>10건</option>
          <option value={20}>20건</option>
          <option value={50}>50건</option>
        </select>
      </div>
    </div>
  );
}
