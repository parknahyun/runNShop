'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// === Mock 데이터 (화면레이아웃 §11 주문상세 탭) ===
const MOCK_ORDER = {
  order_number: 'ORD-20260626-001',
  status: '결제완료',
  vendor_name: '나이키코리아',
  total_amount: 152000,
  ordered_at: '2026.06.26 09:15',
  items: [
    { product_name: '나이키 페가수스 41', option: '블랙/265', quantity: 1, claim_in_progress: 1, claim_done: 0, unit_price: 152000, subtotal: 152000, exchange_option: '→화이트/265', exchange_status: '교환진행중' },
    { product_name: '나이키 드라이핏 티셔츠', option: '네이비/L', quantity: 3, claim_in_progress: 1, claim_done: 1, unit_price: 59000, subtotal: 177000, exchange_option: '→네이비/M', exchange_status: '교환완료' },
  ],
  payment: {
    product_total: 270000,
    product_discount: -20000,
    cart_discount: -2000,
    coupon_discount: 0,
    point_used: 0,
    shipping_fee: 0,
    actual_paid: 248000,
    method: '신용카드',
    pg: '토스페이먼츠',
    transaction_id: 'TXN-626-001',
    paid_at: '2026.06.26 09:15',
  },
  shipping: {
    recipient: '홍*동',
    phone: '010-****-5678',
    zip_code: '06234',
    address: '서울 강남구 테헤란로 123',
    address_detail: '런앤샵타워 5층',
    memo: '문 앞에 놓기',
    tracks: [
      { vendor: '나이키코리아', carrier: 'CJ대한통운', tracking_no: '1234567890', shipped_at: '2026.06.26', status: '배송중' },
    ],
  },
  claims: [
    { claim_number: 'CLM-20260628-001', type: '반품', status: '처리중', refund_amount: 147000, extra_shipping: '5,000 ⦿결제완료', received_at: '06.28 10:30' },
    { claim_number: 'CLM-20260625-003', type: '교환', status: '완료', refund_amount: 0, extra_shipping: '5,000 ⦿결제완료', received_at: '06.25 14:00' },
  ],
  logs: [
    { time: '2026.06.28 10:30', event: '클레임 접수', detail: '반품 신청 (CLM-20260628-001)' },
    { time: '2026.06.27 09:00', event: '배송 시작', detail: 'CJ대한통운 1234567890' },
    { time: '2026.06.26 14:00', event: '출고 처리', detail: '판매자 확인' },
    { time: '2026.06.26 09:15', event: '결제 완료', detail: '신용카드 152,000원' },
    { time: '2026.06.26 09:15', event: '주문 접수', detail: '주문서 제출' },
  ],
};

const INNER_TABS = ['주문상품', '결제정보', '배송정보', 'CS·클레임', '주문문의', '변경이력'];

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

export default function OrderDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const order = MOCK_ORDER;

  return (
    <div className="page">
      {/* 뒤로가기 + 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Link href="/orders" style={{ fontSize: '18px', textDecoration: 'none' }}>←</Link>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>{order.order_number}</span>
        <span className="badge badge--blue">⦿{order.status}</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>{order.vendor_name}</span>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatPrice(order.total_amount)}</span>
      </div>

      {/* InnerTabs (화면레이아웃 §11: 6개 탭) */}
      <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        {INNER_TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? '#1e293b' : '#64748b',
              borderBottom: activeTab === i ? '2px solid #0ea5e9' : '2px solid transparent',
              background: 'none',
              border: 'none',
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
              borderBottomColor: activeTab === i ? '#0ea5e9' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {activeTab === i ? '●' : ''}{tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && <OrderItemsTab order={order} />}
      {activeTab === 1 && <PaymentInfoTab payment={order.payment} />}
      {activeTab === 2 && <ShippingInfoTab shipping={order.shipping} />}
      {activeTab === 3 && <ClaimTab claims={order.claims} />}
      {activeTab === 4 && <InquiryTab />}
      {activeTab === 5 && <ChangeLogTab logs={order.logs} />}
    </div>
  );
}

// === 주문상품 탭 ===
function OrderItemsTab({ order }: { order: typeof MOCK_ORDER }) {
  return (
    <div>
      <div style={{ marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
        상태: <span className="badge badge--blue">⦿{order.status}</span>{'  '}주문일시: {order.ordered_at}
      </div>
      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
        ※ 상품명·옵션명은 주문 시점 스냅샷 (현재 상품정보와 다를 수 있음)
      </p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>옵션</th>
              <th>주문수량</th>
              <th>클레임진행</th>
              <th>완료</th>
              <th style={{ textAlign: 'right' }}>단가</th>
              <th style={{ textAlign: 'right' }}>소계</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <>
                <tr key={i}>
                  <td>{item.product_name}</td>
                  <td>{item.option}</td>
                  <td>{item.quantity}</td>
                  <td>{item.claim_in_progress}</td>
                  <td>{item.claim_done}</td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(item.unit_price)}</td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(item.subtotal)}</td>
                </tr>
                {item.exchange_option && (
                  <tr key={`${i}-ex`} style={{ background: '#f8fafc' }}>
                    <td></td>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>{item.exchange_option}</td>
                    <td>0</td>
                    <td>{item.exchange_status === '교환진행중' ? 1 : 0}</td>
                    <td>{item.exchange_status === '교환완료' ? 1 : 0}</td>
                    <td></td>
                    <td style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>({item.exchange_status})</td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 600 }}>
              <td colSpan={6} style={{ textAlign: 'right' }}>합계</td>
              <td style={{ textAlign: 'right' }}>{formatPrice(order.items.reduce((s, it) => s + it.subtotal, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// === 결제정보 탭 ===
function PaymentInfoTab({ payment }: { payment: typeof MOCK_ORDER.payment }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* 금액 */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>금액</h3>
        <div style={{ fontSize: '13px', lineHeight: '2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>상품 합계</span><span>{formatPrice(payment.product_total)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>상품 할인</span><span style={{ color: '#ef4444' }}>{formatPrice(payment.product_discount)} ⓘ</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>장바구니할인</span><span style={{ color: '#ef4444' }}>{formatPrice(payment.cart_discount)} ⓘ</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>쿠폰 할인</span><span>{formatPrice(payment.coupon_discount)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>포인트 사용</span><span>{formatPrice(payment.point_used)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>배송비</span><span>{payment.shipping_fee === 0 ? '무료' : formatPrice(payment.shipping_fee)} ⓘ</span></div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>실결제금액</span><span>{formatPrice(payment.actual_paid)}</span>
          </div>
        </div>
      </div>
      {/* 결제수단 */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>결제수단</h3>
        <div style={{ fontSize: '13px', lineHeight: '2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>결제수단</span><span>{payment.method}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>PG사</span><span>{payment.pg}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>거래 ID</span><span>{payment.transaction_id}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>결제 일시</span><span>{payment.paid_at}</span></div>
        </div>
      </div>
    </div>
  );
}

// === 배송정보 탭 ===
function ShippingInfoTab({ shipping }: { shipping: typeof MOCK_ORDER.shipping }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* 수령인 */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>수령인</h3>
        <div style={{ fontSize: '13px', lineHeight: '2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>수령인</span><span>{shipping.recipient}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>연락처</span><span>{shipping.phone}</span></div>
          <div><span>주소</span><br/><span style={{ color: '#64748b' }}>[{shipping.zip_code}] {shipping.address}<br/>{shipping.address_detail}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>배송메모</span><span>{shipping.memo}</span></div>
        </div>
      </div>
      {/* 배송 추적 */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>배송 추적</h3>
        {shipping.tracks.map((t, i) => (
          <div key={i} style={{ fontSize: '13px', lineHeight: '2', marginBottom: '12px' }}>
            <div style={{ fontWeight: 600 }}>■ {t.vendor}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>배송사</span><span>{t.carrier}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>운송장</span><span>{t.tracking_no}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>출고일</span><span>{t.shipped_at}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>상태</span><span className="badge badge--blue">⦿{t.status}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === CS·클레임 탭 ===
function ClaimTab({ claims }: { claims: typeof MOCK_ORDER.claims }) {
  return (
    <div>
      {/* CS 액션 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button className="filter-bar__btn">클레임 접수</button>
        <button className="filter-bar__btn" style={{ background: '#475569' }}>장바구니 담아주기</button>
        <button className="filter-bar__btn" style={{ background: '#ef4444' }}>예외 취소</button>
      </div>

      {/* 클레임 이력 */}
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>클레임 이력</h3>
      {claims.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>클레임번호</th>
                <th>유형</th>
                <th>상태</th>
                <th style={{ textAlign: 'right' }}>환불금액</th>
                <th>추가배송비</th>
                <th>접수일시</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.claim_number}>
                  <td><span className="table__link">{c.claim_number}</span></td>
                  <td>{c.type}</td>
                  <td><span className={`badge ${c.status === '완료' ? 'badge--green' : 'badge--yellow'}`}>⦿{c.status}</span></td>
                  <td style={{ textAlign: 'right' }}>{c.refund_amount > 0 ? formatPrice(c.refund_amount) : '-'}</td>
                  <td>{c.extra_shipping}</td>
                  <td>{c.received_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>클레임 이력이 없습니다.</p>
      )}
    </div>
  );
}

// === 주문문의 탭 ===
function InquiryTab() {
  return (
    <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '40px' }}>
      문의 내역이 없습니다.
    </div>
  );
}

// === 변경이력 탭 ===
function ChangeLogTab({ logs }: { logs: typeof MOCK_ORDER.logs }) {
  return (
    <div style={{ paddingLeft: '20px', borderLeft: '2px solid #e2e8f0' }}>
      {logs.map((log, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{
            position: 'absolute', left: '-25px', top: '4px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: i === 0 ? '#0ea5e9' : '#e2e8f0',
          }} />
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>{log.time}</div>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>{log.event}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{log.detail}</div>
        </div>
      ))}
    </div>
  );
}
