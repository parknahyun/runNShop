'use client'
import { type Claim } from '../mockData'

export default function HistoryTab({ claim }: { claim: Claim }) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title">처리 이력</h2>
        {claim.history.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>처리 이력이 없습니다.</p>
        ) : (
          <div className="timeline-wrap">
            <div className="timeline">
              {claim.history.map((h, i) => (
                <div className="timeline-item" key={i} data-variant={h.action.includes('완료') ? 'success' : undefined}>
                  <span className="timeline-item__time">{h.at}</span>
                  <span className="timeline-item__body">
                    <span className="timeline-item__event">{h.action}</span>
                    <span className="timeline-item__meta">{h.actor}{h.memo ? ` · ${h.memo}` : ''}</span>
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
