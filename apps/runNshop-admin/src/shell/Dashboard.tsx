'use client'

const ORDER_STATS = { todayTotal: 47, created: 12, confirmed: 8, shipping: 15, delivered: 9, failed: 3 }
const CLAIM_STATS = { cancel: { pending: 5, processing: 2, done: 18 }, return: { pending: 3, processing: 4, done: 12 }, exchange: { pending: 1, processing: 1, done: 8 } }
const PRODUCT_STATS = { onSale: 1247, soldOut: 89, underReview: 15, rejected: 3 }
const MEMBER_STATS = { todayNew: 23, total: 12450 }

function Metric({ label, value, variant }: { label: string; value: string | number; variant?: 'warn' | 'danger' | 'ok' }) {
  return (
    <div className={`dash-metric${variant ? ` dash-metric--${variant}` : ''}`}>
      <div className="dash-metric__value">{value}</div>
      <div className="dash-metric__label">{label}</div>
    </div>
  )
}

function CardHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="dash-card__header">
      <span className="dash-card__icon">{icon}</span>
      <span className="dash-card__title">{title}</span>
    </div>
  )
}

export default function Dashboard() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="dashboard">
      <div className="dashboard__head">
        <h1 className="dashboard__title">대시보드</h1>
        <span className="dashboard__date">{dateStr} {timeStr} 기준</span>
      </div>
      <div className="dashboard__grid">
        {/* 주문 현황 */}
        <div className="dash-card">
          <CardHeader title="주문 현황" icon="🛒" />
          <div className="dash-metric-row">
            <Metric label="금일 주문" value={ORDER_STATS.todayTotal} />
            <Metric label="주문접수" value={ORDER_STATS.created} />
            <Metric label="배송중" value={ORDER_STATS.shipping} variant="ok" />
            <Metric label="배송완료" value={ORDER_STATS.delivered} />
            <Metric label="실패" value={ORDER_STATS.failed} variant={ORDER_STATS.failed > 0 ? 'danger' : undefined} />
          </div>
        </div>

        {/* 클레임 현황 */}
        <div className="dash-card">
          <CardHeader title="클레임 현황" icon="📋" />
          <table className="dash-claim-table">
            <thead><tr><th></th><th>접수</th><th>처리중</th><th>완료</th></tr></thead>
            <tbody>
              {Object.entries(CLAIM_STATS).map(([key, data]) => (
                <tr key={key}>
                  <td className="dash-claim-table__type">{key === 'cancel' ? '취소' : key === 'return' ? '반품' : '교환'}</td>
                  <td className={data.pending > 0 ? 'dash-claim--warn' : ''}>{data.pending}</td>
                  <td>{data.processing}</td>
                  <td className="dash-claim--ok">{data.done}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상품 현황 */}
        <div className="dash-card">
          <CardHeader title="상품 현황" icon="📦" />
          <div className="dash-metric-row">
            <Metric label="판매중" value={PRODUCT_STATS.onSale.toLocaleString()} variant="ok" />
            <Metric label="품절" value={PRODUCT_STATS.soldOut} variant="warn" />
            <Metric label="심사중" value={PRODUCT_STATS.underReview} />
            <Metric label="반려" value={PRODUCT_STATS.rejected} variant="danger" />
          </div>
        </div>

        {/* 회원 현황 */}
        <div className="dash-card">
          <CardHeader title="회원 현황" icon="👥" />
          <div className="dash-metric-row">
            <Metric label="금일 가입" value={MEMBER_STATS.todayNew} variant="ok" />
            <Metric label="전체 회원" value={MEMBER_STATS.total.toLocaleString()} />
          </div>
        </div>
      </div>
    </div>
  )
}
