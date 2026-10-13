'use client'
import { useState } from 'react'
import {
  type SettlementPayment, type SettlementPaymentStatus,
  SETTLEMENT_PAYMENT_STATUS_LABEL, MOCK_SETTLEMENT_PAYMENTS,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

const STATUS_OPTIONS: Array<{ label: string; value: SettlementPaymentStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...(Object.entries(SETTLEMENT_PAYMENT_STATUS_LABEL) as Array<[SettlementPaymentStatus, string]>).map(([value, label]) => ({ label, value })),
]

function PaymentStatusBadge({ status }: { status: SettlementPaymentStatus }) {
  return <span className="badge" data-payment-status={status}>{SETTLEMENT_PAYMENT_STATUS_LABEL[status]}</span>
}

export default function SettlementPaymentPage() {
  const [statusFilter, setStatusFilter] = useState<SettlementPaymentStatus | 'ALL'>('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [displayed, setDisplayed] = useState<SettlementPayment[]>(MOCK_SETTLEMENT_PAYMENTS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<SettlementPayment | null>(null)

  function handleSearch() {
    let result = MOCK_SETTLEMENT_PAYMENTS
    if (statusFilter !== 'ALL') result = result.filter((p) => p.status === statusFilter)
    if (dateFrom) result = result.filter((p) => p.scheduled_date >= dateFrom)
    if (dateTo) result = result.filter((p) => p.scheduled_date <= dateTo)
    setDisplayed(result)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const totalAmount = displayed.reduce((sum, p) => sum + p.payment_amount, 0)
  const scheduled = displayed.filter((p) => p.status === 'SCHEDULED').length
  const paid = displayed.filter((p) => p.status === 'PAID').length
  const hold = displayed.filter((p) => p.status === 'HOLD').length
  const failed = displayed.filter((p) => p.status === 'FAILED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">지급 내역</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <span className="sep">~</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SettlementPaymentStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}건 · {totalAmount.toLocaleString()}원</div></div>
          <div className="summary-card summary-card--info"><div className="summary-card__label">지급예정</div><div className="summary-card__count">{scheduled}건</div></div>
          <div className="summary-card"><div className="summary-card__label">지급완료</div><div className="summary-card__count">{paid}건</div></div>
          <div className="summary-card summary-card--warn"><div className="summary-card__label">보류</div><div className="summary-card__count">{hold}건</div></div>
          {failed > 0 && <div className="summary-card summary-card--muted"><div className="summary-card__label">지급실패</div><div className="summary-card__count">{failed}건</div></div>}
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>지급ID</th>
                <th>정산번호</th>
                <th>지급금액</th>
                <th>지급예정일</th>
                <th>지급완료일시</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.payment_id} onClick={() => setSelected(p)}>
                  <td className="link-cell">{p.payment_id}</td>
                  <td>{p.settlement_no}</td>
                  <td className="amount-cell">{p.payment_amount.toLocaleString()}원</td>
                  <td>{p.scheduled_date}</td>
                  <td>{p.paid_at ?? '-'}</td>
                  <td><PaymentStatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 지급 내역이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selected && (
        <div className="detail-modal-overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal__header">
              <div style={{ minWidth: 0, flex: 1 }}>
                <span className="detail-modal__title">{selected.payment_id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{selected.settlement_no}</span>
                  <PaymentStatusBadge status={selected.status} />
                </div>
              </div>
              <button className="detail-modal__close" onClick={() => setSelected(null)} aria-label="닫기">✕</button>
            </div>
            <div className="detail-modal__body">
              <div className="tab-panel-content">
                <section className="detail-section" style={{ marginTop: 0 }}>
                  <h2 className="section-title">지급 정보</h2>
                  <div className="info-grid" style={{ marginTop: 12 }}>
                    <dl className="info-dl">
                      <div className="info-row"><dt>지급ID</dt><dd>{selected.payment_id}</dd></div>
                      <div className="info-row"><dt>정산번호</dt><dd>{selected.settlement_no}</dd></div>
                      <div className="info-row"><dt>지급금액</dt><dd className="amount-cell" style={{ fontWeight: 700 }}>{selected.payment_amount.toLocaleString()}원</dd></div>
                    </dl>
                    <dl className="info-dl">
                      <div className="info-row"><dt>상태</dt><dd><PaymentStatusBadge status={selected.status} /></dd></div>
                      <div className="info-row"><dt>지급예정일</dt><dd>{selected.scheduled_date}</dd></div>
                      <div className="info-row"><dt>지급완료일시</dt><dd>{selected.paid_at ?? '-'}</dd></div>
                    </dl>
                  </div>
                  {selected.hold_reason && (
                    <p style={{ marginTop: 16, fontSize: 12, color: '#dc2626' }}>⚠ {selected.hold_reason}</p>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
