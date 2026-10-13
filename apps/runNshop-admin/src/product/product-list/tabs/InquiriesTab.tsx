'use client'
import { useState } from 'react'
import { type Product, type ProductInquiry, PRODUCT_INQUIRY_STATUS_LABEL } from '../mockData'

// ---------------------------------------------------------------------------
// 답변창
// ---------------------------------------------------------------------------

function AnswerModal({ inquiry, onClose, onSubmit }: {
  inquiry: ProductInquiry
  onClose: () => void
  onSubmit: (answer: string) => void
}) {
  const [answerText, setAnswerText] = useState('')

  function submit() {
    if (!answerText.trim()) return
    onSubmit(answerText.trim())
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">문의 답변</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body tab-panel-content">
          <div className="add-form" style={{ padding: 0 }}>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>문의ID</label>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{inquiry.inquiryId} · {inquiry.memberName} · {inquiry.createdAt}</p>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>문의내용</label>
                <p style={{ margin: 0, fontSize: 13, color: '#334155', whiteSpace: 'pre-wrap' }}>{inquiry.content}</p>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>답변 <span className="add-form__req">*</span></label>
                <textarea rows={5} value={answerText} onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="답변을 입력하세요" />
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" disabled={!answerText.trim()} onClick={submit}>답변등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// InquiriesTab
// ---------------------------------------------------------------------------

export default function InquiriesTab({ product, onAnswer, readOnly = false }: {
  product: Product
  onAnswer: (inquiryId: string, answer: string) => void
  readOnly?: boolean
}) {
  const [answeringInquiry, setAnsweringInquiry] = useState<ProductInquiry | null>(null)

  const waitingCount = product.inquiries.filter((i) => i.status === 'WAITING').length

  function submitAnswer(answer: string) {
    if (!answeringInquiry) return
    onAnswer(answeringInquiry.inquiryId, answer)
    setAnsweringInquiry(null)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>상품문의 ({product.inquiries.length}건 · 미답변 {waitingCount}건)</span>
      </div>

      {product.inquiries.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>문의ID</th>
                <th>작성자</th>
                <th>문의내용 / 답변</th>
                <th>상태</th>
                <th>등록일</th>
                <th style={{ width: 90 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {product.inquiries.map((inq) => (
                <tr key={inq.inquiryId}>
                  <td style={{ fontSize: 12 }}>{inq.inquiryId}</td>
                  <td style={{ fontWeight: 500 }}>{inq.memberName}</td>
                  <td style={{ fontSize: 12 }}>
                    <div>Q. {inq.content}</div>
                    {inq.status === 'ANSWERED' && <div style={{ color: '#64748b', marginTop: 4 }}>A. {inq.answer}</div>}
                  </td>
                  <td style={{ fontSize: 12 }}>{PRODUCT_INQUIRY_STATUS_LABEL[inq.status]}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{inq.createdAt}</td>
                  <td>
                    {inq.status === 'WAITING' && (
                      <button className="btn-tool btn-tool--toggle" style={{ height: 24, padding: '0 8px', fontSize: 11 }}
                        disabled={readOnly} onClick={() => setAnsweringInquiry(inq)}>답변</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {answeringInquiry && (
        <AnswerModal
          inquiry={answeringInquiry}
          onClose={() => setAnsweringInquiry(null)}
          onSubmit={submitAnswer}
        />
      )}
    </div>
  )
}
