'use client'
import { useState } from 'react'
import { type Qna, QNA_STATUS_LABEL } from './mockData'

interface Props {
  qna: Qna
  onUpdate: (updated: Qna) => void
  onClose: () => void
}

function QnaStatusBadge({ status }: { status: Qna['status'] }) {
  return <span className="badge" data-qna-status={status}>{QNA_STATUS_LABEL[status]}</span>
}

function nowString() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function QnaDetail({ qna, onUpdate, onClose }: Props) {
  const [answerText, setAnswerText] = useState(qna.answer ?? '')

  const isEdit = !!qna.answer
  const canGrantActivity = !!qna.answer && !qna.activity_score_granted

  function handleSubmitAnswer() {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해주세요.')
      return
    }
    onUpdate({
      ...qna,
      answer: answerText.trim(),
      answered_at: nowString(),
      status: qna.status === 'HIDDEN' ? qna.status : 'ANSWERED',
    })
    alert(isEdit ? '답변이 수정되었습니다.' : '답변이 등록되었습니다.')
  }

  function handleGrantActivity() {
    if (!window.confirm('활동지수를 지급하시겠습니까? 지급 후에는 취소할 수 없습니다.')) return
    onUpdate({ ...qna, activity_score_granted: true })
    alert('활동지수가 지급되었습니다.')
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{qna.qna_id}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{qna.product_name}</span>
              <QnaStatusBadge status={qna.status} />
              {qna.activity_score_granted && <span className="badge" data-activity-status="GRANTED">활동지수 지급완료</span>}
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body">
          <div className="tab-panel-content">
            <section className="detail-section" style={{ marginTop: 0 }}>
              <h2 className="section-title">문의 내용</h2>
              <div className="info-grid" style={{ marginTop: 12 }}>
                <dl className="info-dl">
                  <div className="info-row"><dt>상품명</dt><dd>{qna.product_name}</dd></div>
                  <div className="info-row"><dt>작성자</dt><dd>{qna.member_name}</dd></div>
                </dl>
                <dl className="info-dl">
                  <div className="info-row"><dt>문의일시</dt><dd>{qna.created_at}</dd></div>
                  <div className="info-row"><dt>답변일시</dt><dd>{qna.answered_at ?? '-'}</dd></div>
                </dl>
              </div>
              <p style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 6, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {qna.question}
              </p>
            </section>

            <section className="detail-section">
              <h2 className="section-title">답변</h2>
              <div className="add-form" style={{ padding: '10px 0 0' }}>
                <div className="add-form__row">
                  <div className="add-form__field add-form__field--full">
                    <label>답변 내용</label>
                    <textarea rows={5} placeholder="답변 내용을 입력하세요"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)} />
                  </div>
                </div>
                <div className="add-form__footer">
                  <button className="btn-tool btn-tool--add" onClick={handleSubmitAnswer}>
                    {isEdit ? '답변 수정' : '답변 등록'}
                  </button>
                  <button className="btn-tool" disabled={!canGrantActivity} onClick={handleGrantActivity}>
                    활동지수 지급{qna.activity_score_granted ? '완료' : ''}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
