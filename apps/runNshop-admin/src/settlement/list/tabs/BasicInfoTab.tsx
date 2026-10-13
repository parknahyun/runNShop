'use client'
import { type Settlement } from '../mockData'
import { SettlementStatusBadge } from '../SettlementStatusBadge'

export default function BasicInfoTab({ settlement }: { settlement: Settlement }) {
  return (
    <div className="tab-panel-content">
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>정산번호</dt><dd style={{ fontWeight: 600 }}>{settlement.settlementNo}</dd></div>
          <div className="info-row"><dt>입점사</dt><dd>{settlement.vendorName}</dd></div>
          <div className="info-row"><dt>정산월</dt><dd>{settlement.settlementMonth}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><SettlementStatusBadge status={settlement.status} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>정산대상금액</dt><dd className="amount-cell">{settlement.targetAmount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>재정산액</dt><dd className="amount-cell">{settlement.adjustmentAmount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>패널티</dt><dd className="amount-cell">{settlement.penaltyAmount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>이월액</dt><dd className="amount-cell">{settlement.carriedOverAmount.toLocaleString()}원</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>최종정산금액</dt><dd style={{ fontWeight: 700, color: '#dc2626' }}>{settlement.finalAmount.toLocaleString()}원</dd></div>
          <div className="info-row"><dt>이의제기 건수</dt><dd>{settlement.objectionCount}건</dd></div>
          <div className="info-row"><dt>이의제기 마감일</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{settlement.objectionDeadline ?? '-'}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>확정일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{settlement.confirmedAt ?? '-'}</dd></div>
        <div className="info-row"><dt>확정자</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{settlement.confirmedBy ?? '-'}</dd></div>
        <div className="info-row"><dt>생성일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{settlement.createdAt}</dd></div>
        <div className="info-row"><dt>최종수정일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{settlement.updatedAt}</dd></div>
      </dl>
    </div>
  )
}
