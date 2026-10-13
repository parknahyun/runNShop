'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import TemplateDetail from './TemplateDetail'
import AddTemplateModal from './AddTemplateModal'
import {
  type Template, type TemplateFilter, type TemplateType, type TemplateStatus,
  MOCK_TEMPLATES, filterTemplates, TEMPLATE_TYPE_LABEL, TEMPLATE_STATUS_LABEL,
} from './mockData'

const TYPE_OPTIONS: Array<{ label: string; value: TemplateType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL' },
  ...Object.entries(TEMPLATE_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as TemplateType })),
]

const STATUS_OPTIONS: Array<{ label: string; value: TemplateStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(TEMPLATE_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as TemplateStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: TemplateFilter
  onChange: (f: TemplateFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="템플릿ID 또는 템플릿명 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.templateType}
        onChange={(e) => onChange({ ...filter, templateType: e.target.value as TemplateType | 'ALL' })}>
        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as TemplateStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

function TemplateTable({ templates, onRowClick }: {
  templates: Template[]
  onRowClick: (t: Template) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>템플릿ID</th>
            <th>템플릿명</th>
            <th>유형</th>
            <th>구성영역 수</th>
            <th>적용 페이지 수</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl) => (
            <tr key={tpl.templateId} onClick={() => onRowClick(tpl)}>
              <td className="link-cell">{tpl.templateId}</td>
              <td style={{ fontWeight: 500 }}>{tpl.templateName}</td>
              <td><span className="badge">{TEMPLATE_TYPE_LABEL[tpl.templateType]}</span></td>
              <td>{tpl.sectionCount}개</td>
              <td>{tpl.usedPageCount}개</td>
              <td>
                <span className="badge" data-product-status={tpl.status === 'ACTIVE' ? 'ON_SALE' : tpl.status === 'INACTIVE' ? 'DRAFT' : 'DISCONTINUED'}>
                  {TEMPLATE_STATUS_LABEL[tpl.status]}
                </span>
              </td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{tpl.updatedBy} / {tpl.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Templates() {
  const [filter, setFilter] = useState<TemplateFilter>({ keyword: '', templateType: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed] = useState<Template[]>([])
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [detailTemplate, setDetailTemplate] = useState<Template | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setDisplayed(filterTemplates(MOCK_TEMPLATES, filter))
    setPage(1)
    setSearched(true)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">템플릿 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {searched && (
        <div className="op-summary-row">
          <div className="summary-bar">
            <div className="summary-card">
              <div className="summary-card__label">전체</div>
              <div className="summary-card__count">{displayed.length}개</div>
            </div>
            <div className="summary-card summary-card--info">
              <div className="summary-card__label">활성</div>
              <div className="summary-card__count">{displayed.filter(t => t.status === 'ACTIVE').length}개</div>
            </div>
            <div className="summary-card summary-card--muted">
              <div className="summary-card__label">비활성</div>
              <div className="summary-card__count">{displayed.filter(t => t.status === 'INACTIVE').length}개</div>
            </div>
            <div className="summary-card summary-card--warn">
              <div className="summary-card__label">폐기</div>
              <div className="summary-card__count">{displayed.filter(t => t.status === 'DEPRECATED').length}개</div>
            </div>
          </div>
          <div className="pgm-toolbar">
            <span />
            <div className="pgm-toolbar__actions">
              <button className="btn-tool btn-tool--add" onClick={() => setShowAdd(true)}>+ 템플릿 추가</button>
            </div>
          </div>
        </div>
      )}

      {pageItems.length > 0 ? (
        <>
          <TemplateTable templates={pageItems} onRowClick={setDetailTemplate} />
          <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </>
      ) : (
        <div className="table-wrap">
          <p className="state-msg">
            {searched ? '조회된 템플릿이 없습니다.' : '조회 버튼을 눌러 템플릿 목록을 불러오세요.'}
          </p>
        </div>
      )}
      {detailTemplate && (
        <TemplateDetail template={detailTemplate} onClose={() => setDetailTemplate(null)} />
      )}

      {showAdd && (
        <AddTemplateModal onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}
