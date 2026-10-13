'use client'

const ORDER_STATS = { todayTotal: 12, shipping: 5, claim: 3 }
const PRODUCT_STATS = { onSale: 87, soldOut: 12, underReview: 3, rejected: 1, draft: 5 }
const PENDING = [
  { label: '출고 대기', count: 5 },
  { label: '반품 수거', count: 2 },
  { label: '교환 수거', count: 1 },
  { label: 'QnA 답변', count: 7 },
]

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

  return (
    <div className="dashboard">
      <div className="dashboard__head">
        <h1 className="dashboard__title">나이키코리아 · 대시보드</h1>
        <span className="dashboard__date">{dateStr} 기준 · 우수 (Pacer) 78점</span>
      </div>
      <div className="dashboard__grid">
        <div className="dash-card">
          <CardHeader title="주문 현황" icon="🛒" />
          <div className="dash-metric-row">
            <Metric label="오늘 주문" value={ORDER_STATS.todayTotal} />
            <Metric label="출고 대기" value={ORDER_STATS.shipping} variant="warn" />
            <Metric label="클레임" value={ORDER_STATS.claim} variant="danger" />
          </div>
        </div>

        <div className="dash-card">
          <CardHeader title="처리 필요" icon="⚡" />
          <table className="dash-claim-table">
            <tbody>
              {PENDING.map((p) => (
                <tr key={p.label}>
                  <td className="dash-claim-table__type">{p.label}</td>
                  <td className={p.count > 0 ? 'dash-claim--warn' : ''}>{p.count}건</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dash-card">
          <CardHeader title="내 상품 현황" icon="📦" />
          <div className="dash-metric-row">
            <Metric label="판매중" value={PRODUCT_STATS.onSale} variant="ok" />
            <Metric label="품절" value={PRODUCT_STATS.soldOut} variant="warn" />
            <Metric label="심사중" value={PRODUCT_STATS.underReview} />
            <Metric label="반려" value={PRODUCT_STATS.rejected} variant="danger" />
          </div>
        </div>

        <div className="dash-card">
          <CardHeader title="공지사항" icon="📢" />
          <ul className="dash-card__list">
            <li className="dash-card__list-item"><span className="dash-card__list-name">[필독] 7월 정산 일정 안내</span><span className="dash-card__list-meta">06.25</span></li>
            <li className="dash-card__list-item"><span className="dash-card__list-name">여름 기획전 참여 모집</span><span className="dash-card__list-meta">06.23</span></li>
            <li className="dash-card__list-item"><span className="dash-card__list-name">출고 기한 준수 안내</span><span className="dash-card__list-meta">06.20</span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
