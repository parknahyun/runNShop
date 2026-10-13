'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import VendorApplicationDetail from './VendorApplicationDetail'
import {
  type VendorApplication, type VendorApplicationStatus, type VendorApplicationFilter,
  BUSINESS_TYPE_LABEL, VENDOR_APP_STATUS_LABEL,
  MOCK_VENDOR_APPLICATIONS, filterVendorApplications,
} from './mockData'
import { VendorApplicationStatusBadge } from './VendorApplicationStatusBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: VendorApplicationStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(VENDOR_APP_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as VendorApplicationStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: VendorApplicationFilter
  onChange: (f: VendorApplicationFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="사업자명 · 사업자번호 · 대표자명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as VendorApplicationStatus | 'ALL' })}>
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

function SummaryBar({ items }: { items: VendorApplication[] }) {
  const applied = items.filter(v => v.status === 'APPLIED').length
  const reviewing = items.filter(v => v.status === 'REVIEWING').length
  const contract = items.filter(v => v.status === 'CONTRACT').length
  const approved = items.filter(v => v.status === 'APPROVED').length
  const rejected = items.filter(v => v.status === 'REJECTED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">신청</div>
        <div className="summary-card__count">{applied}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">심사중</div>
        <div className="summary-card__count">{reviewing}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">계약진행</div>
        <div className="summary-card__count">{contract}건</div>
      </div>
      <div className="summary-card">
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
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar() {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// VendorApplicationTable
// ---------------------------------------------------------------------------

function VendorApplicationTable({ items, onRowClick }: {
  items: VendorApplication[]
  onRowClick: (v: VendorApplication) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>신청번호</th>
            <th>사업자명</th>
            <th>사업자번호</th>
            <th>대표자</th>
            <th>사업자유형</th>
            <th>취급카테고리</th>
            <th>연락처</th>
            <th>상태</th>
            <th>신청일시</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.applicationId} onClick={() => onRowClick(v)}>
              <td className="link-cell">{v.applicationId}</td>
              <td style={{ fontWeight: 500 }}>{v.businessName}</td>
              <td style={{ fontSize: 12 }}>{v.businessNo}</td>
              <td style={{ fontSize: 12 }}>{v.representative}</td>
              <td style={{ fontSize: 12 }}>{BUSINESS_TYPE_LABEL[v.businessType]}</td>
              <td style={{ fontSize: 12 }}>{v.categoryName}</td>
              <td style={{ fontSize: 12 }}>{v.contactEmail}</td>
              <td><VendorApplicationStatusBadge status={v.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{v.createdAt}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — VendorApplicationDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function VendorApplicationPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<VendorApplication[]>(MOCK_VENDOR_APPLICATIONS)
  const [filter, setFilter] = useState<VendorApplicationFilter>({ keyword: '', status: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<VendorApplication>({
    mode: DETAIL_MODE,
    getTabId: (item) => `vendor-application-detail/${item.applicationId}`,
    getTabLabel: (item) => `입점신청 ${item.businessName}`,
    renderDetail: (item, onClose) => (
      <VendorApplicationDetail mode={DETAIL_MODE} application={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterVendorApplications(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: VendorApplication) {
    const next = allItems.map((v) => v.applicationId === updated.applicationId ? updated : v)
    setAllItems(next)
    setDisplayed(filterVendorApplications(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">입점 신청 심사</h1>
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
              <VendorApplicationTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 입점 신청이 없습니다.'
                  : '조회 버튼을 눌러 입점 신청 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
