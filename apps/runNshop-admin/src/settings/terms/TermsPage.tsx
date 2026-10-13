'use client'
import { useState, useId } from 'react'
import {
  type Terms, type TermsType, type TermsFilter,
  TERMS_TYPE_LABEL,
  MOCK_TERMS, filterTerms, nextTermsId, isDuplicateVersion,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: Array<{ label: string; value: TermsType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL' },
  ...Object.entries(TERMS_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as TermsType })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: TermsFilter
  onChange: (f: TermsFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="버전 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.termsType}
        onChange={(e) => onChange({ ...filter, termsType: e.target.value as TermsFilter['termsType'] })}>
        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Terms[] }) {
  const counts = (Object.keys(TERMS_TYPE_LABEL) as TermsType[]).map((type) => ({
    type, count: items.filter((t) => t.termsType === type).length,
  }))
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      {counts.map(({ type, count }) => (
        <div className="summary-card" key={type}>
          <div className="summary-card__label">{TERMS_TYPE_LABEL[type]}</div>
          <div className="summary-card__count">{count}건</div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 약관 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TermsTable
// ---------------------------------------------------------------------------

function TermsTable({ items, onRowClick }: {
  items: Terms[]
  onRowClick: (t: Terms) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 약관이 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>약관유형</th>
            <th>버전</th>
            <th>시행일</th>
            <th>등록자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.termsId} onClick={() => onRowClick(t)}>
              <td className="link-cell">{TERMS_TYPE_LABEL[t.termsType]}</td>
              <td>v{t.version}</td>
              <td>{t.effectiveAt}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{t.createdBy}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{t.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddTermsModal (등록 전용, 수정 불가)
// ---------------------------------------------------------------------------

interface TermsForm {
  termsType: TermsType; version: string; content: string; effectiveAt: string
}

const EMPTY_TERMS_FORM: TermsForm = { termsType: 'SERVICE', version: '', content: '', effectiveAt: '' }

function AddTermsModal({ allItems, currentUser, onClose, onAdd }: {
  allItems: Terms[]
  currentUser: string
  onClose: () => void
  onAdd: (t: Terms) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<TermsForm>(EMPTY_TERMS_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof TermsForm, string>>>({})

  function f(key: keyof TermsForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.version.trim())     e.version     = '필수'
    else if (isDuplicateVersion(allItems, form.termsType, form.version)) e.version = '이미 등록된 버전입니다'
    if (!form.content.trim())     e.content     = '필수'
    if (!form.effectiveAt.trim()) e.effectiveAt = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onAdd({
      termsId:     nextTermsId(allItems),
      termsType:   form.termsType,
      version:     form.version.trim(),
      content:     form.content.trim(),
      effectiveAt: form.effectiveAt,
      createdBy:   currentUser,
      createdAt:   now,
    })
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">약관 등록</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('termsType')}>약관유형 <span className="add-form__req">*</span></label>
                <select id={f('termsType')} value={form.termsType}
                  onChange={(e) => setForm({ ...form, termsType: e.target.value as TermsType })}>
                  {Object.entries(TERMS_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="add-form__field">
                <label htmlFor={f('version')}>버전 <span className="add-form__req">*</span></label>
                <input id={f('version')} type="text" placeholder="예) 1.2"
                  value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                {errors.version && <span className="add-form__err">{errors.version}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('content')}>내용 <span className="add-form__req">*</span></label>
                <textarea id={f('content')} rows={6} placeholder="약관 내용을 입력하세요"
                  value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                {errors.content && <span className="add-form__err">{errors.content}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('effectiveAt')}>시행일 <span className="add-form__req">*</span></label>
                <input id={f('effectiveAt')} type="date" value={form.effectiveAt}
                  onChange={(e) => setForm({ ...form, effectiveAt: e.target.value })} />
                {errors.effectiveAt && <span className="add-form__err">{errors.effectiveAt}</span>}
              </div>
            </div>

            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSubmit}>등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TermsViewModal (읽기 전용 + 삭제)
// ---------------------------------------------------------------------------

function TermsViewModal({ terms, onClose, onDelete }: {
  terms: Terms
  onClose: () => void
  onDelete: (termsId: string) => void
}) {
  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">{TERMS_TYPE_LABEL[terms.termsType]}</span>
            <span className="detail-modal__subtitle">v{terms.version} · 시행일 {terms.effectiveAt}</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="tab-panel-content">
            <p style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, color: '#374151' }}>{terms.content}</p>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 16 }}>
              등록자 {terms.createdBy} / 등록일 {terms.createdAt}
            </p>
          </div>
          <div className="add-form__footer" style={{ justifyContent: 'space-between' }}>
            <button className="btn-tool btn-tool--delete" onClick={() => onDelete(terms.termsId)}>삭제</button>
            <button className="btn-tool btn-tool--cancel" onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TermsPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Terms[]>(MOCK_TERMS)
  const [filter, setFilter]     = useState<TermsFilter>({ keyword: '', termsType: 'ALL' })
  const [displayed, setDisplayed] = useState<Terms[]>([])
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAdd, setShowAdd]   = useState(false)
  const [viewing, setViewing]   = useState<Terms | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterTerms(allItems, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleAdd(t: Terms) {
    const next = [t, ...allItems]
    setAllItems(next)
    setDisplayed(filterTerms(next, filter))
    setShowAdd(false)
  }

  function handleDelete(termsId: string) {
    const next = allItems.filter((i) => i.termsId !== termsId)
    setAllItems(next)
    setDisplayed(filterTerms(next, filter))
    setViewing(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">약관 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0
            ? <>
                <TermsTable items={pageItems} onRowClick={setViewing} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 약관 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {viewing && (
        <TermsViewModal terms={viewing} onClose={() => setViewing(null)} onDelete={handleDelete} />
      )}

      {showAdd && (
        <AddTermsModal allItems={allItems} currentUser={currentUser} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}
