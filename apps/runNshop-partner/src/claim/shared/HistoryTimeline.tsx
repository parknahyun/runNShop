import { type ClaimHistoryEntry } from './types'

// 처리이력 탭 — 반품/교환 상세에서 공용으로 사용하는 타임라인
export function HistoryTimeline({ history }: { history: ClaimHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="state-msg">처리 이력이 없습니다.</p>
  }
  const sorted = [...history].reverse()
  return (
    <div className="timeline-wrap">
      <div className="timeline">
        {sorted.map((h, i) => (
          <div className="timeline-item" key={i}>
            <span className="timeline-item__time">{h.at}</span>
            <span className="timeline-item__body">
              <span className="timeline-item__event">{h.action}</span>
              {h.memo && <span className="timeline-item__meta">{h.memo}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
