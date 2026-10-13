'use client'
import { useState } from 'react'
import {
  type Claim, type BlameType,
  CLAIM_TYPE_LABEL, CLAIM_CHANNEL_LABEL, BLAME_TYPE_LABEL,
} from '../mockData'
import { ClaimStatusBadge } from '../ClaimStatusBadge'
import { ClaimBlameBadge } from '../ClaimBlameBadge'

interface Draft {
  blameType: BlameType
  counselorMemo: string
}

function toDraft(c: Claim): Draft {
  return { blameType: c.blameType, counselorMemo: c.counselorMemo }
}

export default function BasicInfoTab({ claim, currentUser, onUpdate }: {
  claim: Claim
  currentUser: string
  onUpdate: (updated: Claim) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(claim))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...claim,
      blameType: draft.blameType,
      counselorMemo: draft.counselorMemo,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(claim))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="add-form" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>귀책 판단</label>
              <select value={draft.blameType}
                onChange={(e) => setDraft({ ...draft, blameType: e.target.value as BlameType })}>
                {Object.entries(BLAME_TYPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>CS 메모</label>
              <textarea rows={3} value={draft.counselorMemo}
                onChange={(e) => setDraft({ ...draft, counselorMemo: e.target.value })}
                placeholder="귀책 판단 근거·처리 참고사항을 입력하세요" />
            </div>
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle" onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>클레임번호</dt><dd style={{ fontWeight: 600 }}>{claim.claimNo}</dd></div>
          <div className="info-row"><dt>원주문번호</dt><dd>{claim.platformOrderNo}</dd></div>
          <div className="info-row"><dt>입점사</dt><dd>{claim.vendorName}</dd></div>
          <div className="info-row"><dt>구매자</dt><dd>{claim.customerName}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>유형</dt><dd>{CLAIM_TYPE_LABEL[claim.claimType]}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><ClaimStatusBadge status={claim.status} /></dd></div>
          <div className="info-row"><dt>신청경로</dt><dd>{CLAIM_CHANNEL_LABEL[claim.channel]}</dd></div>
          <div className="info-row"><dt>귀책</dt><dd><ClaimBlameBadge blameType={claim.blameType} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>환불금액</dt><dd style={{ fontWeight: 600, color: '#dc2626' }}>{claim.refundAmount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>추가배송비</dt><dd>{claim.extraDeliveryFee.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>신청일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{claim.createdAt}</dd></div>
          <div className="info-row"><dt>처리완료일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{claim.completedAt ?? '-'}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>신청사유</dt><dd>{claim.reason}</dd></div>
        <div className="info-row"><dt>CS 메모</dt><dd>{claim.counselorMemo || '-'}</dd></div>
        <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{claim.updatedBy} / {claim.updatedAt}</dd></div>
      </dl>
    </div>
  )
}
