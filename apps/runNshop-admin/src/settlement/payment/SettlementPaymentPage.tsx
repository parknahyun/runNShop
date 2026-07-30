'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import SettlementPaymentDetail from './SettlementPaymentDetail'
import {
  type SettlementPayment, type SettlementPaymentStatus, type SettlementPaymentFilter,
  SETTLEMENT_PAYMENT_STATUS_LABEL, BANK_NAME_LABEL,
  MOCK_SETTLEMENT_PAYMENTS, filterSettlementPayments,
} from './mockData'
import { SettlementPaymentStatusBadge } from './SettlementPaymentStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: SettlementPaymentStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(SETTLEMENT_PAYMENT_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as SettlementPaymentStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: SettlementPaymentFilter
  onChange: (f: SettlementPaymentFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="정산번호 · 입점사명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as SettlementPaymentStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" value={filter.from}
        onChange={(e) => onChange({ ...filter, from: e.target.value })} />
      <span className="sep">~</span>
      <input type="date" value={filter.to}
        onChange={(e) => onChange({ ...filter, to: e.target.value })} />
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: SettlementPayment[] }) {
  const scheduled = items.filter(p => p.status === 'SCHEDULED').length
  const paid = items.filter(p => p.status === 'PAID').length
  const hold = items.filter(p => p.status === 'HOLD').length
  const failed = items.filter(p => p.status === 'FAILED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">지급예정</div>
        <div className="summary-card__count">{scheduled}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">지급완료</div>
        <div className="summary-card__count">{paid}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">보류</div>
        <div className="summary-card__count">{hold}건</div>
      </div>
      {failed > 0 && (
        <div className="summary-card summary-card--muted">
          <div className="summary-card__label">지급실패</div>
          <div className="summary-card__count">{failed}건</div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar() {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool" onClick={() => alert('일괄 지급 기능은 준비 중입니다.')}>일괄 지급</button>
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PaymentTable
// ---------------------------------------------------------------------------

function PaymentTable({ items, onRowClick }: {
  items: SettlementPayment[]
  onRowClick: (p: SettlementPayment) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>정산번호</th>
            <th>입점사</th>
            <th>은행</th>
            <th>계좌번호</th>
            <th>지급금액</th>
            <th>지급예정일</th>
            <th>상태</th>
            <th>지급완료일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.paymentId} onClick={() => onRowClick(p)}>
              <td className="link-cell">{p.settlementNo}</td>
              <td style={{ fontSize: 12 }}>{p.vendorName}</td>
              <td style={{ fontSize: 12 }}>{BANK_NAME_LABEL[p.bankCode] ?? p.bankCode}</td>
              <td style={{ fontSize: 12 }}>{p.accountNo}</td>
              <td className="amount-cell">{p.paymentAmount.toLocaleString()}원</td>
              <td style={{ fontSize: 12 }}>{p.scheduledDate}</td>
              <td><SettlementPaymentStatusBadge status={p.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{p.paidAt ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const DETAIL_MODE: DetailMode = 'modal'

export default function SettlementPaymentPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<SettlementPayment[]>(MOCK_SETTLEMENT_PAYMENTS)
  const [filter, setFilter] = useState<SettlementPaymentFilter>({ keyword: '', status: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<SettlementPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<SettlementPayment>({
    mode: DETAIL_MODE,
    getTabId: (item) => `settlement-payment-detail/${item.paymentId}`,
    getTabLabel: (item) => `지급 ${item.settlementNo}`,
    renderDetail: (item, onClose) => (
      <SettlementPaymentDetail mode={DETAIL_MODE} payment={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterSettlementPayments(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: SettlementPayment) {
    const next = allItems.map((p) => p.paymentId === updated.paymentId ? updated : p)
    setAllItems(next)
    setDisplayed(filterSettlementPayments(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">지급 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar />
          </div>
          {displayed.length > 0 ? (
            <>
              <PaymentTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 지급 내역이 없습니다.'
                  : '조회 버튼을 눌러 지급 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
