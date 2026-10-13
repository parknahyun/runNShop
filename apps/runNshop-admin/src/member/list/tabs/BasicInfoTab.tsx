'use client'
import { useState } from 'react'
import {
  type Member, type MemberStatus,
  MEMBER_STATUS_LABEL, MEMBER_GRADE_LABEL, JOIN_TYPE_LABEL,
} from '../mockData'
import { MemberStatusBadge } from '../MemberStatusBadge'
import { MemberGradeBadge } from '../MemberGradeBadge'

interface Draft {
  status: MemberStatus
}

function toDraft(m: Member): Draft {
  return { status: m.status }
}

export default function BasicInfoTab({ member, currentUser, onUpdate }: {
  member: Member
  currentUser: string
  onUpdate: (updated: Member) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(member))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...member,
      status: draft.status,
      withdrawnAt: draft.status === 'WITHDRAWN' ? (member.withdrawnAt ?? now) : member.withdrawnAt,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(member))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="add-form" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>상태 변경</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as MemberStatus })}>
                {Object.entries(MEMBER_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                로그인 5회 실패로 잠긴 계정은 상태를 &quot;정상&quot;으로 변경해 잠금을 해제할 수 있습니다.
              </span>
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
          <div className="info-row"><dt>회원ID</dt><dd style={{ fontWeight: 600 }}>{member.memberId}</dd></div>
          <div className="info-row"><dt>회원번호</dt><dd>{member.memberNo}</dd></div>
          <div className="info-row"><dt>이름</dt><dd style={{ fontWeight: 600 }}>{member.name}</dd></div>
          <div className="info-row"><dt>가입경로</dt><dd>{JOIN_TYPE_LABEL[member.joinType]}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>이메일</dt><dd>{member.email}</dd></div>
          <div className="info-row"><dt>휴대폰</dt><dd>{member.phone}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><MemberStatusBadge status={member.status} /></dd></div>
          <div className="info-row"><dt>등급</dt><dd><MemberGradeBadge grade={member.grade} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>누적구매금액</dt><dd style={{ fontWeight: 600, color: '#dc2626' }}>{member.purchaseAmount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>활동지수</dt><dd>{member.activityScore}점</dd></div>
          <div className="info-row"><dt>포인트잔액</dt><dd>{member.pointBalance.toLocaleString()}P</dd></div>
          <div className="info-row"><dt>등급 산정 기준</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{MEMBER_GRADE_LABEL[member.grade]} (최근 3개월 구매금액·활동지수 기준)</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>가입일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{member.joinedAt}</dd></div>
        <div className="info-row"><dt>최근로그인</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{member.lastLoginAt ?? '-'}</dd></div>
        <div className="info-row"><dt>탈퇴일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{member.withdrawnAt ?? '-'}</dd></div>
        <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{member.updatedBy} / {member.updatedAt}</dd></div>
      </dl>
    </div>
  )
}
