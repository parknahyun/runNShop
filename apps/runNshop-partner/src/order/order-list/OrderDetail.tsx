'use client'
import { useState } from 'react'
import { type Order, ORDER_STATUS_LABEL } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'

interface Props {
  order: Order
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Order) => void
  /** true면 조회 전용으로 렌더링된다 (출고 처리 버튼 비활성화) */
  readOnly?: boolean
}

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  return <span className="badge" data-vnd-order-status={status}>{ORDER_STATUS_LABEL[status]}</span>
}

function nowStr() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function OrderDetail({ order: initialOrder, mode = 'modal', onClose, onUpdate, readOnly = false }: Props) {
  const [order, setOrder] = useState<Order>(initialOrder)

  function handleShip() {
    if (!window.confirm('출고 처리하시겠습니까?')) return
    const updated: Order = {
      ...order,
      status: 'PREPARING',
      history: [...order.history, { at: nowStr(), action: '출고 처리', memo: '판매자 출고 처리' }],
    }
    setOrder(updated)
    onUpdate(updated)
  }

  return (
    <DetailShell mode={mode} title={order.platform_order_no}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>#{order.order_id}</span>
          <OrderStatusBadge status={order.status} />
          <span style={{ fontSize: 12, color: '#64748b' }}>{order.customer_name}</span>
          <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>{order.amount.toLocaleString()}원</span>
        </>
      }
      onClose={onClose}>
      <InnerTabs tabs={[
        { key: 'info', label: '주문정보', content: <OrderInfoTab order={order} /> },
        { key: 'log', label: '처리이력', content: <OrderHistoryTab order={order} /> },
      ]} />

      {/* Footer */}
      {order.status === 'PAYMENT_COMPLETED' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={handleShip}>출고 처리</button>
        </div>
      )}
    </DetailShell>
  )
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function OrderInfoTab({ order }: { order: Order }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">주문 정보</h2>
        <div className="info-grid">
          <dl className="info-dl">
            <div className="info-row"><dt>주문ID</dt><dd>{order.order_id}</dd></div>
            <div className="info-row"><dt>플랫폼 주문번호</dt><dd>{order.platform_order_no}</dd></div>
            <div className="info-row"><dt>상품명</dt><dd>{order.product_name}</dd></div>
            <div className="info-row"><dt>고객명</dt><dd>{order.customer_name}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>수량</dt><dd>{order.quantity}개</dd></div>
            <div className="info-row"><dt>금액</dt><dd style={{ fontWeight: 600 }}>{order.amount.toLocaleString()}원</dd></div>
            <div className="info-row"><dt>상태</dt><dd><OrderStatusBadge status={order.status} /></dd></div>
            <div className="info-row"><dt>주문일자</dt><dd>{order.order_date}</dd></div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function OrderHistoryTab({ order }: { order: Order }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">처리 이력</h2>
        <div className="timeline-wrap">
          <div className="timeline">
            {[...order.history].reverse().map((h, idx) => (
              <div key={`${h.at}-${idx}`} className="timeline-item" data-variant={idx === 0 ? 'success' : undefined}>
                <span className="timeline-item__time">{h.at}</span>
                <span className="timeline-item__body">
                  <span className="timeline-item__event">{h.action}</span>
                  {h.memo && <span className="timeline-item__meta">{h.memo}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
