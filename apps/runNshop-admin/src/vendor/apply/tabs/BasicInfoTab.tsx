'use client'
import { type VendorApplication, BUSINESS_TYPE_LABEL } from '../mockData'
import { VendorApplicationStatusBadge } from '../VendorApplicationStatusBadge'

export default function BasicInfoTab({ application }: { application: VendorApplication }) {
  return (
    <div className="tab-panel-content">
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>신청번호</dt><dd style={{ fontWeight: 600 }}>{application.applicationId}</dd></div>
          <div className="info-row"><dt>사업자명</dt><dd style={{ fontWeight: 600 }}>{application.businessName}</dd></div>
          <div className="info-row"><dt>사업자번호</dt><dd>{application.businessNo}</dd></div>
          <div className="info-row"><dt>대표자</dt><dd>{application.representative}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>사업자유형</dt><dd>{BUSINESS_TYPE_LABEL[application.businessType]}</dd></div>
          <div className="info-row"><dt>취급카테고리</dt><dd>{application.categoryName}</dd></div>
          <div className="info-row"><dt>이메일</dt><dd>{application.contactEmail}</dd></div>
          <div className="info-row"><dt>연락처</dt><dd>{application.contactPhone}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><VendorApplicationStatusBadge status={application.status} /></dd></div>
          <div className="info-row"><dt>반려횟수</dt><dd>{application.rejectCount}회</dd></div>
          <div className="info-row"><dt>심사자</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.reviewedBy ?? '-'}</dd></div>
          <div className="info-row"><dt>심사일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.reviewedAt ?? '-'}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>반려사유</dt><dd>{application.rejectReason || '-'}</dd></div>
        <div className="info-row"><dt>신청일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.createdAt}</dd></div>
        <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{application.updatedAt}</dd></div>
      </dl>
    </div>
  )
}
