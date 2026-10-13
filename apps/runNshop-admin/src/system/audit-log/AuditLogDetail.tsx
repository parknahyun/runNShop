'use client'
import { DetailShell } from '@/shell/shared/DetailShell'
import { type AuditLog, ACTOR_TYPE_LABEL } from './mockData'
import { AuditActionBadge } from './AuditActionBadge'

function jsonBlock(value: Record<string, unknown> | null) {
  if (value === null) return '(없음)'
  return JSON.stringify(value, null, 2)
}

export default function AuditLogDetail({ log, onClose }: {
  log: AuditLog
  onClose: () => void
}) {
  return (
    <DetailShell mode="modal" title={log.logId}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{log.domain} · {log.eventType}</span>
          <AuditActionBadge action={log.action} />
        </>
      }
      onClose={onClose}>
      <div className="tab-panel-content">
        <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <dl className="info-dl">
            <div className="info-row"><dt>로그ID</dt><dd style={{ fontWeight: 600 }}>{log.logId}</dd></div>
            <div className="info-row"><dt>Trace ID</dt><dd style={{ fontSize: 12 }}>{log.traceId}</dd></div>
            <div className="info-row"><dt>도메인</dt><dd>{log.domain}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>이벤트유형</dt><dd>{log.eventType}</dd></div>
            <div className="info-row"><dt>작업구분</dt><dd><AuditActionBadge action={log.action} /></dd></div>
            <div className="info-row"><dt>대상</dt><dd>{log.aggregateType} · {log.aggregateId}</dd></div>
          </dl>
          <dl className="info-dl">
            <div className="info-row"><dt>실행주체</dt><dd>{ACTOR_TYPE_LABEL[log.actorType]}{log.actorId ? ` · ${log.actorId}` : ''}</dd></div>
            <div className="info-row"><dt>실행IP</dt><dd style={{ fontSize: 12 }}>{log.actorIp ?? '-'}</dd></div>
            <div className="info-row"><dt>발생시각</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{log.createdAt}</dd></div>
          </dl>
        </div>

        <h2 className="section-title" style={{ marginTop: 20 }}>변경 내역</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>변경 전 (Before)</div>
            <pre style={{
              margin: 0, padding: 12, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 320, overflow: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>{jsonBlock(log.beforeValue)}</pre>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>변경 후 (After)</div>
            <pre style={{
              margin: 0, padding: 12, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 320, overflow: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>{jsonBlock(log.afterValue)}</pre>
          </div>
        </div>
      </div>
    </DetailShell>
  )
}
