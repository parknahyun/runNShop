'use client'
import { useEffect, useState } from 'react'
import { type OrderDetailData, type OrderClaim, type OrderInquiry, ORDER_STATUS_LABEL } from './mockData'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { api } from '../../../lib/api'
import OrderItemsTab from './tabs/OrderItemsTab'
import PaymentInfoTab from './tabs/PaymentInfoTab'
import ShippingInfoTab from './tabs/ShippingInfoTab'

interface Props {
  orderId: string
  onClose: () => void
}

// ---------------------------------------------------------------------------
// ClaimTab
// ---------------------------------------------------------------------------

const CLAIM_TYPE_LABEL: Record<string, string> = { RETURN: '반품', EXCHANGE: '교환' }

function ClaimTab({ order }: { order: OrderDetailData }) {
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
        {order.claims.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>클레임 이력이 없습니다.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>클레임번호</th>
                  <th>유형</th>
                  <th>상태</th>
                  <th>환불금액</th>
                  <th>추가배송비</th>
                  <th>접수일시</th>
                </tr>
              </thead>
              <tbody>
                {order.claims.map((claim: OrderClaim) => (
                  <tr key={claim.claimId}>
                    <td className="link-cell">{claim.claimId}</td>
                    <td>{CLAIM_TYPE_LABEL[claim.claimType] || claim.claimType}</td>
                    <td><span className="badge">{claim.status}</span></td>
                    <td className="amount-cell">{claim.refundAmount.toLocaleString()}원</td>
                    <td>
                      {claim.extraShippingFee.toLocaleString()}원{' '}
                      <span className="badge">{claim.extraShippingFeeStatus === 'PAID' ? '결제완료' : '미결제'}</span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{claim.receivedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChangeLogTab
// ---------------------------------------------------------------------------

function ChangeLogTab({ order }: { order: OrderDetailData }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">변경 이력</h2>
        {order.logs.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>변경 이력이 없습니다.</p>
        ) : (
          <div className="timeline-wrap">
            <div className="timeline">
              {order.logs.map((log, i) => (
                <div key={`${log.at}-${i}`} className="timeline-item" data-variant={i === 0 ? 'success' : undefined}>
                  <span className="timeline-item__time">{log.at}</span>
                  <span className="timeline-item__body">
                    <span className="timeline-item__event">{log.event}</span>
                    <span className="timeline-item__meta">{log.detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// InquiryTab
// ---------------------------------------------------------------------------

function InquiryTab({ order }: { order: OrderDetailData }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">주문문의</h2>
        {order.inquiries.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>주문문의 이력이 없습니다.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>문의번호</th>
                  <th>유형</th>
                  <th>상태</th>
                  <th>작성자</th>
                  <th>등록일시</th>
                </tr>
              </thead>
              <tbody>
                {order.inquiries.map((inquiry: OrderInquiry) => (
                  <tr key={inquiry.inquiryId}>
                    <td className="link-cell">{inquiry.inquiryId}</td>
                    <td>{inquiry.type}</td>
                    <td><span className="badge">{inquiry.status}</span></td>
                    <td>{inquiry.writer}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{inquiry.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OrderDetail (탭 콘텐츠 방식)
// ---------------------------------------------------------------------------

export default function OrderDetail({ orderId, onClose }: Props) {
  const [order, setOrder] = useState<OrderDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api<OrderDetailData>(`/orders/${orderId}`)
      .then((res) => setOrder(res))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading || !order) {
    return (
      <div className="page">
        <p className="state-msg">불러오는 중...</p>
      </div>
    )
  }

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
          { key: 'inquiry', label: '주문문의', content: <InquiryTab order={order} /> },
          { key: 'log', label: '변경이력', content: <ChangeLogTab order={order} /> },
        ]} />
      </div>
    </div>
  )
}
