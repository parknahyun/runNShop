'use client'
import { type Vendor } from '../mockData'

export default function AccountTab({ vendor }: { vendor: Vendor }) {
  const account = vendor.account

  if (!account) {
    return (
      <div className="tab-panel-content">
        <div className="table-wrap">
          <p className="state-msg">등록된 정산계좌가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>은행</dt><dd style={{ fontWeight: 600 }}>{account.bankCode}</dd></div>
          <div className="info-row"><dt>계좌번호</dt><dd>{account.accountNo}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>예금주</dt><dd>{account.accountHolder}</dd></div>
          <div className="info-row"><dt>대표계좌</dt><dd>{account.isPrimary ? '예' : '아니오'}</dd></div>
        </dl>
      </div>
      <dl className="info-dl" style={{ marginTop: 12 }}>
        <div className="info-row"><dt>계좌인증일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{account.verifiedAt}</dd></div>
      </dl>
    </div>
  )
}
