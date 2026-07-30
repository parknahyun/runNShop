'use client'
import { type OperatorApplication, REQUESTED_ROLE_LABEL } from '../mockData'
import { OperatorApplicationStatusBadge } from '../OperatorApplicationStatusBadge'

export default function BasicInfoTab({ application }: { application: OperatorApplication }) {
  return (
    <div className="tab-panel-content">
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>신청ID</dt><dd style={{ fontWeight: 600 }}>{application.applicationId}</dd></div>
          <div className="info-row"><dt>이름</dt><dd>{application.name}</dd></div>
          <div className="info-row"><dt>이메일</dt><dd>{application.email}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>요청역할</dt><dd>{REQUESTED_ROLE_LABEL[application.requestedRoleCode]}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><OperatorApplicationStatusBadge status={application.status} /></dd></div>
          <div className="info-row"><dt>신청일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.createdAt}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>처리자</dt><dd>{application.reviewedBy ?? '-'}</dd></div>
          <div className="info-row"><dt>처리일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.reviewedAt ?? '-'}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.updatedAt}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>신청사유</dt><dd>{application.reason}</dd></div>
        {application.status === 'REJECTED' && (
          <div className="info-row"><dt>반려사유</dt><dd style={{ color: '#dc2626' }}>{application.rejectReason}</dd></div>
        )}
      </dl>
    </div>
  )
}
