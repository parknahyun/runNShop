'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import OperatorApplicationDetail from './OperatorApplicationDetail'
import {
  type OperatorApplication, type OperatorApplicationStatus, type RequestedRoleCode, type OperatorApplicationFilter,
  OPERATOR_APPLICATION_STATUS_LABEL, REQUESTED_ROLE_LABEL,
  MOCK_OPERATOR_APPLICATIONS, filterOperatorApplications,
} from './mockData'
import { OperatorApplicationStatusBadge } from './OperatorApplicationStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: OperatorApplicationStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(OPERATOR_APPLICATION_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as OperatorApplicationStatus })),
]

const ROLE_OPTIONS: Array<{ label: string; value: RequestedRoleCode | 'ALL' }> = [
  { label: '전체 요청역할', value: 'ALL' },
  ...Object.entries(REQUESTED_ROLE_LABEL).map(([k, v]) => ({ label: v, value: k as RequestedRoleCode })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: OperatorApplicationFilter
  onChange: (f: OperatorApplicationFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="이름 · 이메일" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as OperatorApplicationStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.requestedRoleCode}
        onChange={(e) => onChange({ ...filter, requestedRoleCode: e.target.value as RequestedRoleCode | 'ALL' })}>
        {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: OperatorApplication[] }) {
  const applied  = items.filter((a) => a.status === 'APPLIED').length
  const approved = items.filter((a) => a.status === 'APPROVED').length
  const rejected = items.filter((a) => a.status === 'REJECTED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">신청</div>
        <div className="summary-card__count">{applied}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">승인</div>
        <div className="summary-card__count">{approved}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">반려</div>
        <div className="summary-card__count">{rejected}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ApplicationTable
// ---------------------------------------------------------------------------

function ApplicationTable({ items, onRowClick }: {
  items: OperatorApplication[]
  onRowClick: (a: OperatorApplication) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>신청ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>요청역할</th>
            <th>신청사유</th>
            <th>상태</th>
            <th>신청일시</th>
            <th>처리일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.applicationId} onClick={() => onRowClick(a)}>
              <td className="link-cell">{a.applicationId}</td>
              <td style={{ fontWeight: 500 }}>{a.name}</td>
              <td style={{ fontSize: 12 }}>{a.email}</td>
              <td style={{ fontSize: 12 }}>{REQUESTED_ROLE_LABEL[a.requestedRoleCode]}</td>
              <td style={{ fontSize: 12, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.reason}>{a.reason}</td>
              <td><OperatorApplicationStatusBadge status={a.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{a.createdAt}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{a.reviewedAt ?? '-'}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — OperatorApplicationDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function OperatorApplicationPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<OperatorApplication[]>(MOCK_OPERATOR_APPLICATIONS)
  const [filter, setFilter] = useState<OperatorApplicationFilter>({ keyword: '', status: 'ALL', requestedRoleCode: 'ALL' })
  const [displayed, setDisplayed] = useState<OperatorApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<OperatorApplication>({
    mode: DETAIL_MODE,
    getTabId: (item) => `operator-application-detail/${item.applicationId}`,
    getTabLabel: (item) => `운영자 신청 ${item.applicationId}`,
    renderDetail: (item, onClose) => (
      <OperatorApplicationDetail mode={DETAIL_MODE} application={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterOperatorApplications(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: OperatorApplication) {
    const next = allItems.map((a) => a.applicationId === updated.applicationId ? updated : a)
    setAllItems(next)
    setDisplayed(filterOperatorApplications(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">운영자 신청 승인</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
          </div>
          {displayed.length > 0 ? (
            <>
              <ApplicationTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 신청 내역이 없습니다.'
                  : '조회 버튼을 눌러 운영자 신청 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
