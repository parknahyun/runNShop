'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import SectionDetail from './SectionDetail'
import AddSectionModal from './AddSectionModal'
import {
  type SectionItem, type SectionFilter, type SectionStatusFilter,
  MOCK_SECTIONS, filterSections, SECTION_STATUS_LABEL,
} from './mockData'

const STATUS_OPTIONS: Array<{ label: string; value: SectionStatusFilter }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '활성', value: 'ACTIVE' },
  { label: '비활성', value: 'INACTIVE' },
  { label: '폐기', value: 'DEPRECATED' },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: SectionFilter
  onChange: (f: SectionFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="타입ID / 라벨명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as SectionStatusFilter })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

function SummaryBar({ items }: { items: SectionItem[] }) {
  const activeCount = items.filter(i => i.status === 'ACTIVE').length
  const inactiveCount = items.filter(i => i.status === 'INACTIVE').length
  const deprecatedCount = items.filter(i => i.status === 'DEPRECATED').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}개</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">활성</div>
        <div className="summary-card__count">{activeCount}개</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">비활성</div>
        <div className="summary-card__count">{inactiveCount}개</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">폐기</div>
        <div className="summary-card__count">{deprecatedCount}개</div>
      </div>
    </div>
  )
}

function SectionTypeTable({ items, onRowClick }: { items: SectionItem[]; onRowClick: (item: SectionItem) => void }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: 50, whiteSpace: 'nowrap' }}>순서</th>
            <th>타입 ID</th>
            <th>라벨</th>
            <th>설명</th>
            <th style={{ width: 50, whiteSpace: 'nowrap' }}>필드수</th>
            <th style={{ width: 50 }}>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.sectionCode} onClick={() => onRowClick(item)}>
              <td>{item.sortOrder}</td>
              <td className="link-cell">{item.sectionCode}</td>
              <td style={{ fontWeight: 500 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: item.previewColor, border: '1px solid #e2e8f0' }} />
                  {item.sectionName}
                </span>
              </td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{item.description}</td>
              <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{item.fieldCount}개</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <span className="badge" data-product-status={item.status === 'ACTIVE' ? 'ON_SALE' : item.status === 'INACTIVE' ? 'DRAFT' : 'DISCONTINUED'}>
                  {SECTION_STATUS_LABEL[item.status]}
                </span>
              </td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{item.updatedBy} / {item.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Sections() {
  const [filter, setFilter] = useState<SectionFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<SectionItem[]>([])
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setDisplayed(filterSections(MOCK_SECTIONS, filter))
    setPage(1)
    setSearched(true)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">섹션 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {searched && (
        <div className="op-summary-row">
          <SummaryBar items={displayed} />
          <div className="pgm-toolbar">
            <span />
            <div className="pgm-toolbar__actions">
              <button className="btn-tool btn-tool--add" onClick={() => setShowAdd(true)}>+ 섹션 추가</button>
            </div>
          </div>
        </div>
      )}

      {pageItems.length > 0 ? (
        <>
          <SectionTypeTable items={pageItems} onRowClick={setSelectedSection} />
          <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </>
      ) : (
        <div className="table-wrap">
          <p className="state-msg">
            {searched ? '조건에 맞는 섹션이 없습니다.' : '조회 버튼을 눌러 섹션 목록을 불러오세요.'}
          </p>
        </div>
      )}

      {selectedSection && (
        <SectionDetail section={selectedSection} onClose={() => setSelectedSection(null)} />
      )}

      {showAdd && (
        <AddSectionModal onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}
