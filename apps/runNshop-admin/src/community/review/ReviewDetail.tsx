'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type Review } from './mockData'
import { ReviewStatusBadge } from './ReviewStatusBadge'

// ---------------------------------------------------------------------------
// BasicInfoTab
// ---------------------------------------------------------------------------

function BasicInfoTab({ review }: { review: Review }) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
  return (
    <div className="tab-panel-content">
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>리뷰번호</dt><dd style={{ fontWeight: 600 }}>{review.reviewId}</dd></div>
          <div className="info-row"><dt>상품명</dt><dd>{review.productName}</dd></div>
          <div className="info-row"><dt>작성자</dt><dd>{review.memberName}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>평점</dt><dd>{stars} ({review.rating}/5)</dd></div>
          <div className="info-row"><dt>상태</dt><dd><ReviewStatusBadge status={review.status} /></dd></div>
          <div className="info-row"><dt>포토리뷰</dt><dd>
            {review.isPhotoReview
              ? <span className="badge" data-photo-review="Y">포토리뷰</span>
              : '-'}
          </dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>작성일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{review.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{review.updatedAt}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>내용</dt><dd>{review.content}</dd></div>
        <div className="info-row"><dt>이미지</dt><dd>
          {review.imageUrls.length > 0 ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {review.imageUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`리뷰 이미지 ${i + 1}`} width={80} height={80}
                  style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
              ))}
            </div>
          ) : '-'}
        </dd></div>
        {review.status === 'HIDDEN' && (
          <div className="info-row"><dt>숨김사유</dt><dd>{review.hiddenReason ?? '-'}</dd></div>
        )}
        {review.status === 'DELETED' && (
          <div className="info-row"><dt>삭제사유</dt><dd>{review.hiddenReason ?? '-'}</dd></div>
        )}
      </dl>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ModerationFooter — 숨김/활성화 액션
// ---------------------------------------------------------------------------

function ModerationFooter({ review, onUpdate }: {
  review: Review
  onUpdate: (updated: Review) => void
}) {
  const [showHideForm, setShowHideForm] = useState(false)
  const [hiddenReason, setHiddenReason] = useState('')

  if (review.status === 'DELETED') return null

  function now() {
    return new Date().toISOString().replace('T', ' ').slice(0, 16)
  }

  function handleHide() {
    if (!hiddenReason.trim()) return
    onUpdate({ ...review, status: 'HIDDEN', hiddenReason: hiddenReason.trim(), updatedAt: now() })
    setShowHideForm(false)
    setHiddenReason('')
  }

  function handleActivate() {
    onUpdate({ ...review, status: 'ACTIVE', hiddenReason: null, updatedAt: now() })
  }

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      {showHideForm ? (
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>숨김사유 <span className="add-form__req">*</span></label>
              <textarea rows={3} value={hiddenReason}
                onChange={(e) => setHiddenReason(e.target.value)}
                placeholder="숨김사유를 입력하세요" />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => { setShowHideForm(false); setHiddenReason('') }}>취소</button>
            <button className="btn-tool btn-tool--delete" disabled={!hiddenReason.trim()} onClick={handleHide}>숨김 확정</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {review.status === 'ACTIVE' && (
            <button className="btn-tool btn-tool--delete" onClick={() => setShowHideForm(true)}>숨김</button>
          )}
          {review.status === 'HIDDEN' && (
            <button className="btn-tool btn-tool--add" onClick={handleActivate}>활성화</button>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ReviewDetail
// ---------------------------------------------------------------------------

export default function ReviewDetail({ review, mode = 'modal', onClose, onUpdate }: {
  review: Review
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: Review) => void
}) {
  return (
    <DetailShell mode={mode} title={review.reviewId}
      meta={
        <>
          <span style={{ fontSize: 12, color: '#64748b' }}>{review.productName} · {review.memberName}</span>
          <ReviewStatusBadge status={review.status} />
        </>
      }
      onClose={onClose}>
      <InnerTabs sticky tabs={[
        {
          label: '기본정보',
          content: <BasicInfoTab review={review} />,
        },
      ]} />
      <ModerationFooter review={review} onUpdate={onUpdate} />
    </DetailShell>
  )
}
