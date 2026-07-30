'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import VendorDetail from './VendorDetail'
import {
  type Vendor, type VendorStatus, type VendorGrade, type VendorFilter,
  VENDOR_BUSINESS_TYPE_LABEL, VENDOR_TYPE_LABEL, VENDOR_STATUS_LABEL, VENDOR_GRADE_LABEL,
  MOCK_VENDORS, filterVendors,
} from './mockData'
import { VendorStatusBadge } from './VendorStatusBadge'
import { VendorGradeBadge } from './VendorGradeBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: VendorStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(VENDOR_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as VendorStatus })),
]

const GRADE_OPTIONS: Array<{ label: string; value: VendorGrade | 'ALL' }> = [
  { label: '전체 등급', value: 'ALL' },
  ...Object.entries(VENDOR_GRADE_LABEL).map(([k, v]) => ({ label: v, value: k as VendorGrade })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: VendorFilter
  onChange: (f: VendorFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="사업자명 · 사업자번호 · 대표자명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as VendorStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.grade}
        onChange={(e) => onChange({ ...filter, grade: e.target.value as VendorGrade | 'ALL' })}>
        {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Vendor[] }) {
  const active = items.filter(v => v.status === 'ACTIVE').length
  const warning = items.filter(v => v.status === 'WARNING').length
  const suspended = items.filter(v => v.status === 'SUSPENDED').length
  const terminated = items.filter(v => v.status === 'TERMINATED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">정상</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">주의</div>
        <div className="summary-card__count">{warning}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">정지</div>
        <div className="summary-card__count">{suspended}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">해지</div>
        <div className="summary-card__count">{terminated}건</div>
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
// VendorTable
// ---------------------------------------------------------------------------

function VendorTable({ items, onRowClick }: {
  items: Vendor[]
  onRowClick: (v: Vendor) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>입점사ID</th>
            <th>사업자명</th>
            <th>사업자번호</th>
            <th>대표자</th>
            <th>사업자유형</th>
            <th>입점유형</th>
            <th>등급</th>
            <th>상태</th>
            <th>연락처</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.vendorId} onClick={() => onRowClick(v)}>
              <td className="link-cell">{v.vendorId}</td>
              <td style={{ fontWeight: 500 }}>{v.businessName}</td>
              <td style={{ fontSize: 12 }}>{v.businessNo}</td>
              <td style={{ fontSize: 12 }}>{v.representative}</td>
              <td style={{ fontSize: 12 }}>{VENDOR_BUSINESS_TYPE_LABEL[v.businessType]}</td>
              <td style={{ fontSize: 12 }}>{VENDOR_TYPE_LABEL[v.vendorType]}</td>
              <td><VendorGradeBadge grade={v.gradeCode} /></td>
              <td><VendorStatusBadge status={v.status} /></td>
              <td style={{ fontSize: 12 }}>{v.contactEmail}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{v.updatedAt}</td>
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

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — VendorDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function VendorListPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Vendor[]>(MOCK_VENDORS)
  const [filter, setFilter] = useState<VendorFilter>({ keyword: '', status: 'ALL', grade: 'ALL' })
  const [displayed, setDisplayed] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Vendor>({
    mode: DETAIL_MODE,
    getTabId: (item) => `vendor-detail/${item.vendorId}`,
    getTabLabel: (item) => `입점사 ${item.businessName}`,
    renderDetail: (item, onClose) => (
      <VendorDetail mode={DETAIL_MODE} vendor={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterVendors(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Vendor) {
    const next = allItems.map((v) => v.vendorId === updated.vendorId ? updated : v)
    setAllItems(next)
    setDisplayed(filterVendors(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">입점사 목록</h1>
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
              <VendorTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 입점사가 없습니다.'
                  : '조회 버튼을 눌러 입점사 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
