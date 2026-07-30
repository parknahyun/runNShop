'use client'
import { useState } from 'react'
import { type BatchExecution, type RunStatus } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

function RunStatusBadge({ status }: { status: RunStatus | null }) {
  if (status === null) return <span className="badge" data-run-status="SKIPPED">—</span>
  const label: Record<RunStatus, string> = {
    SUCCESS: '성공', FAILED: '실패', RUNNING: '실행중', SKIPPED: 'SKIPPED',
  }
  return <span className="badge" data-run-status={status}>{label[status]}</span>
}

export default function ExecHistoryTab({ executions }: { executions: BatchExecution[] }) {
  const pager = usePager(executions, 5)
  const [expandedExecId, setExpandedExecId] = useState<string | null>(null)

  return (
    <div className="tab-panel-content">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>실행 ID</th>
              <th>시작</th>
              <th>종료</th>
              <th>소요(초)</th>
              <th>상태</th>
              <th>트리거</th>
              <th>실행자</th>
              <th style={{ width: 72, textAlign: 'center' }}>파라미터</th>
            </tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={8} className="state-msg">실행 이력이 없습니다.</td></tr>
              : pager.slice.map((e) => (
                <tr key={e.executionId}>
                  <td>{e.executionId}</td>
                  <td>{e.startedAt}</td>
                  <td>{e.endedAt ?? '—'}</td>
                  <td>{e.durationSec !== null ? e.durationSec : '—'}</td>
                  <td><RunStatusBadge status={e.status} /></td>
                  <td>
                    <span className="badge" data-trigger={e.triggerType}>
                      {e.triggerType === 'SCHEDULED' ? '스케줄' : '수동'}
                    </span>
                  </td>
                  <td>{e.triggeredBy}</td>
                  <td style={{ textAlign: 'center' }}>
                    {e.params && e.params.length > 0
                      ? <button className="btn-tool"
                          style={{ height: 22, padding: '0 6px', fontSize: 11 }}
                          onClick={() => setExpandedExecId(e.executionId)}>
                          {e.params.length}개
                        </button>
                      : <span style={{ color: '#94a3b8' }}>—</span>}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <MiniPager page={pager.page} totalPages={pager.totalPages} onChange={pager.setPage} />

      {expandedExecId && (() => {
        const exec = executions.find((e) => e.executionId === expandedExecId)
        if (!exec?.params?.length) return null
        return (
          <div className="detail-modal-overlay" style={{ zIndex: 200 }}>
            <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
              <div className="detail-modal__header">
                <div>
                  <span className="detail-modal__title">실행 파라미터</span>
                  <span className="detail-modal__subtitle">{expandedExecId}</span>
                </div>
                <button className="detail-modal__close"
                  onClick={() => setExpandedExecId(null)} aria-label="닫기">✕</button>
              </div>
              <div className="detail-modal__body">
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>파라미터 키</th><th>값</th></tr></thead>
                    <tbody>
                      {exec.params.map((p, i) => (
                        <tr key={i}>
                          <td><code style={{ fontSize: 12 }}>{p.key}</code></td>
                          <td>{p.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
