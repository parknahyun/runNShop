'use client'
import { type Order, ORDER_STATUS_LABEL } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import OrderItemsTab from './tabs/OrderItemsTab'
import PaymentInfoTab from './tabs/PaymentInfoTab'
import ShippingInfoTab from './tabs/ShippingInfoTab'

interface Props {
  order: Order
  onClose: () => void
}

// ---------------------------------------------------------------------------
// ClaimTab
// ---------------------------------------------------------------------------

function ClaimTab({ order }: { order: Order }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>CS 액션</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn-tool btn-tool--delete" onClick={() => alert('클레임이 접수되었습니다.')}>클레임 접수</button>
          <button className="btn-tool" onClick={() => alert('장바구니가 교체되었습니다.')}>장바구니 담아주기</button>
          {order.status === 'PAYMENT_COMPLETED' && (
            <button className="btn-tool btn-tool--cancel" onClick={() => alert('주문이 취소되었습니다.')}>예외 취소</button>
          )}
        </div>
      </section>
      <section className="detail-section">
        <h2 className="section-title">클레임 이력</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>클레임 이력이 없습니다.</p>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChangeLogTab
// ---------------------------------------------------------------------------

function ChangeLogTab() {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">변경 이력</h2>
        <div className="timeline-wrap">
          <div className="timeline">
            <div className="timeline-item" data-variant="success">
              <span className="timeline-item__time">06.26 09:15</span>
              <span className="timeline-item__body">
                <span className="timeline-item__event">주문 접수</span>
                <span className="timeline-item__meta">결제 완료</span>
              </span>
            </div>
            <div className="timeline-item">
              <span className="timeline-item__time">06.26 09:15</span>
              <span className="timeline-item__body">
                <span className="timeline-item__event">재고 선점</span>
                <span className="timeline-item__meta">SKU-001 × 1</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OrderDetail (탭 콘텐츠 방식)
// ---------------------------------------------------------------------------

export default function OrderDetail({ order, onClose }: Props) {
  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">{order.platformOrderNo}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge" data-order-status={order.status}>{ORDER_STATUS_LABEL[order.status]}</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>{order.vendorName}</span>
          <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>{order.amount.toLocaleString()}원</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{order.orderDate}</span>
        </div>
      </div>
      <div className="detail-content" style={{ padding: 0, height: 'calc(100vh - 150px)' }}>
        <InnerTabs tabs={[
          { key: 'items', label: '주문상품', content: <OrderItemsTab order={order} /> },
          { key: 'payment', label: '결제정보', content: <PaymentInfoTab order={order} /> },
          { key: 'shipping', label: '배송정보', content: <ShippingInfoTab order={order} /> },
          { key: 'claim', label: 'CS·클레임', content: <ClaimTab order={order} /> },
          { key: 'log', label: '변경이력', content: <ChangeLogTab /> },
        ]} />
      </div>
    </div>
  )
}
