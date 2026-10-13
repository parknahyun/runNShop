'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import {
  type Qna, QNA_TYPE_LABEL, ANSWERED_BY_TYPE_LABEL,
} from './mockData'
import { QnaStatusBadge } from './QnaStatusBadge'

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 16)
}

// ---------------------------------------------------------------------------
// BasicInfoTab — 질문 조회 + 답변 등록/수정
// ---------------------------------------------------------------------------

function BasicInfoTab({ qna, onUpdate }: {
  qna: Qna
  onUpdate: (updated: Qna) => void
}) {
  const [draftAnswer, setDraftAnswer] = useState(qna.answer ?? '')

  function handleSaveAnswer() {
    if (!draftAnswer.trim()) return
    onUpdate({
      ...qna,
      answer: draftAnswer.trim(),
      answeredByType: 'OPERATOR',
      answeredAt: now(),
      status: 'ANSWERED',
      updatedAt: now(),
    })
  }

  const canEditAnswer = qna.status !== 'HIDDEN'

  return (
    <div className="tab-panel-content">
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>QnA번호</dt><dd style={{ fontWeight: 600 }}>{qna.qnaId}</dd></div>
          <div className="info-row"><dt>유형</dt><dd>{QNA_TYPE_LABEL[qna.qnaType]}</dd></div>
          <div className="info-row"><dt>참조</dt><dd>{qna.refName}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>작성자</dt><dd>{qna.memberName}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><QnaStatusBadge status={qna.status} /></dd></div>
          <div className="info-row"><dt>공개여부</dt><dd>{qna.isPublic ? '공개' : '비공개'}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>문의일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{qna.createdAt}</dd></div>
          <div className="info-row"><dt>답변일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{qna.answeredAt ?? '-'}</dd></div>
          <div className="info-row"><dt>답변자</dt><dd>{qna.answeredByType ? ANSWERED_BY_TYPE_LABEL[qna.answeredByType] : '-'}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>질문내용</dt><dd>{qna.question}</dd></div>
        <div className="info-row">
          <dt>활동지수 지급</dt>
          <dd>
            {qna.activityScoreGranted
              ? <span style={{ fontSize: 12, color: '#64748b' }}>지급됨 ({qna.activityScoreAt})</span>
              : '미지급'}
          </dd>
        </div>
      </dl>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>답변</label>
        {canEditAnswer ? (
          <div className="add-form" style={{ padding: 0 }}>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <textarea rows={4} value={draftAnswer}
                  onChange={(e) => setDraftAnswer(e.target.value)}
                  placeholder="답변 내용을 입력하세요" />
              </div>
            </div>
            <div className="section-editor-footer">
              <button className="btn-tool btn-tool--add" disabled={!draftAnswer.trim()} onClick={handleSaveAnswer}>
                {qna.answer ? '답변 수정' : '답변 등록'}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#475569', whiteSpace: 'pre-wrap' }}>{qna.answer ?? '-'}</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActionFooter — 활동지수 지급 / 숨김 / 활성화
// ---------------------------------------------------------------------------

function ActionFooter({ qna, onUpdate }: {
  qna: Qna
  onUpdate: (updated: Qna) => void
}) {
  function handleGrantActivityScore() {
    onUpdate({ ...qna, activityScoreGranted: true, activityScoreAt: now(), updatedAt: now() })
  }

  function handleHide() {
    onUpdate({ ...qna, status: 'HIDDEN', updatedAt: now() })
  }

  function handleActivate() {
    onUpdate({ ...qna, status: qna.answer ? 'ANSWERED' : 'PENDING', updatedAt: now() })
  }

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <button className="btn-tool" disabled={qna.activityScoreGranted || !qna.answer} onClick={handleGrantActivityScore}>
        활동지수 지급
      </button>
      <div style={{ display: 'flex', gap: 8 }}>
        {qna.status !== 'HIDDEN' && (
          <button className="btn-tool btn-tool--delete" onClick={handleHide}>숨김</button>
        )}
        {qna.status === 'HIDDEN' && (
          <button className="btn-tool btn-tool--add" onClick={handleActivate}>활성화</button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QnaDetail
// ---------------------------------------------------------------------------

export default function QnaDetail({ qna, mode = 'modal', onClose, onUpdate }: {
  qna: Qna
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Qna) => void
}) {
  return (
    <DetailShell mode={mode} title={qna.qnaId}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{QNA_TYPE_LABEL[qna.qnaType]} · {qna.refName} · {qna.memberName}</span>
          <QnaStatusBadge status={qna.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab qna={qna} onUpdate={onUpdate} />,
        },
      ]} />
      <ActionFooter qna={qna} onUpdate={onUpdate} />
    </DetailShell>
  )
}
