'use client'
import { useState, useId } from 'react'
import {
  type DeliveryCompany, type DeliveryCompanyStatus, type DeliveryCompanyFilter,
  DELIVERY_STATUS_LABEL,
  MOCK_DELIVERY_COMPANIES, filterDeliveryCompanies, nextCompanyId,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: DeliveryCompanyStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL'      },
  { label: '활성',      value: 'ACTIVE'   },
  { label: '비활성',    value: 'INACTIVE' },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: DeliveryCompanyFilter
  onChange: (f: DeliveryCompanyFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="배송사명 · 배송사코드" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as DeliveryCompanyFilter['status'] })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function DeliveryStatusBadge({ status }: { status: DeliveryCompanyStatus }) {
  return <span className="badge" data-delivery-status={status}>{DELIVERY_STATUS_LABEL[status]}</span>
}

function DeliveryApiBadge({ connected }: { connected: boolean }) {
  return <span className="badge" data-delivery-api-connected={connected}>{connected ? '연동' : '미연동'}</span>
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: DeliveryCompany[] }) {
  const active   = items.filter((d) => d.status === 'ACTIVE').length
  const inactive = items.filter((d) => d.status === 'INACTIVE').length
  const connected = items.filter((d) => d.apiConnected).length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">활성</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      {inactive > 0 && (
        <div className="summary-card summary-card--muted">
          <div className="summary-card__label">비활성</div>
          <div className="summary-card__count">{inactive}건</div>
        </div>
      )}
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">API연동</div>
        <div className="summary-card__count">{connected}건</div>
      </div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 배송사 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DeliveryCompanyTable
// ---------------------------------------------------------------------------

function DeliveryCompanyTable({ items, onRowClick }: {
  items: DeliveryCompany[]
  onRowClick: (d: DeliveryCompany) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 배송사가 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>배송사코드</th>
            <th>배송사명</th>
            <th>API연동</th>
            <th>상태</th>
            <th>정렬순서</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.companyId} onClick={() => onRowClick(d)}>
              <td className="link-cell">{d.companyCode}</td>
              <td style={{ fontWeight: 500 }}>{d.companyName}</td>
              <td><DeliveryApiBadge connected={d.apiConnected} /></td>
              <td><DeliveryStatusBadge status={d.status} /></td>
              <td>{d.sortOrder}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{d.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DeliveryCompanyFormModal (등록 / 수정 공용)
// ---------------------------------------------------------------------------

interface DeliveryCompanyForm {
  companyId: string; companyCode: string; companyName: string
  apiEndpoint: string; trackingUrl: string
  apiConnected: boolean; status: DeliveryCompanyStatus; sortOrder: string
}

function toForm(d: DeliveryCompany): DeliveryCompanyForm {
  return {
    companyId: d.companyId, companyCode: d.companyCode, companyName: d.companyName,
    apiEndpoint: d.apiEndpoint, trackingUrl: d.trackingUrl,
    apiConnected: d.apiConnected, status: d.status, sortOrder: String(d.sortOrder),
  }
}

function emptyForm(companyId: string): DeliveryCompanyForm {
  return {
    companyId, companyCode: '', companyName: '',
    apiEndpoint: '', trackingUrl: '',
    apiConnected: false, status: 'ACTIVE', sortOrder: '',
  }
}

function DeliveryCompanyFormModal({ mode, company, allItems, onClose, onSubmit, onDelete }: {
  mode: 'add' | 'edit'
  company?: DeliveryCompany
  allItems: DeliveryCompany[]
  onClose: () => void
  onSubmit: (d: DeliveryCompany) => void
  onDelete?: (companyId: string) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<DeliveryCompanyForm>(() =>
    mode === 'edit' && company ? toForm(company) : emptyForm(nextCompanyId(allItems))
  )
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryCompanyForm, string>>>({})

  function f(key: keyof DeliveryCompanyForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.companyCode.trim()) e.companyCode = '필수'
    if (!form.companyName.trim()) e.companyName = '필수'
    if (!form.sortOrder.trim())   e.sortOrder   = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      companyId:    form.companyId,
      companyCode:  form.companyCode.trim(),
      companyName:  form.companyName.trim(),
      apiEndpoint:  form.apiEndpoint.trim(),
      trackingUrl:  form.trackingUrl.trim(),
      apiConnected: form.apiConnected,
      status:       form.status,
      sortOrder:    parseInt(form.sortOrder, 10),
      createdAt:    mode === 'add' ? now : (company?.createdAt ?? now),
      updatedAt:    now,
    })
  }

  function handleDelete() {
    if (!company) return
    if (window.confirm('삭제하시겠습니까?')) {
      onDelete?.(company.companyId)
    }
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">배송사 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('companyCode')}>배송사코드 <span className="add-form__req">*</span></label>
                <input id={f('companyCode')} type="text" placeholder="예) CJ"
                  value={form.companyCode}
                  disabled={mode === 'edit'}
                  style={mode === 'edit' ? { background: '#f8fafc', color: '#64748b' } : undefined}
                  onChange={(e) => setForm({ ...form, companyCode: e.target.value })} />
                {errors.companyCode && <span className="add-form__err">{errors.companyCode}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('companyName')}>배송사명 <span className="add-form__req">*</span></label>
                <input id={f('companyName')} type="text" placeholder="예) CJ대한통운"
                  value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                {errors.companyName && <span className="add-form__err">{errors.companyName}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('apiEndpoint')}>API 엔드포인트</label>
                <input id={f('apiEndpoint')} type="text" placeholder="예) https://api.cjlogistics.com/v1/tracking"
                  value={form.apiEndpoint} onChange={(e) => setForm({ ...form, apiEndpoint: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('trackingUrl')}>배송조회 URL</label>
                <input id={f('trackingUrl')} type="text" placeholder="예) https://.../tracking?slipno={trackingNo}"
                  value={form.trackingUrl} onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('sortOrder')}>정렬순서 <span className="add-form__req">*</span></label>
                <input id={f('sortOrder')} type="number" value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                {errors.sortOrder && <span className="add-form__err">{errors.sortOrder}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={f('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as DeliveryCompanyStatus })}>
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                </select>
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>
                  <input type="checkbox" checked={form.apiConnected} style={{ marginRight: 6 }}
                    onChange={(e) => setForm({ ...form, apiConnected: e.target.checked })} />
                  API연동여부
                </label>
              </div>
            </div>

            <div className="add-form__footer">
              {mode === 'edit' && (
                <button className="btn-tool btn-tool--delete" onClick={handleDelete} style={{ marginRight: 'auto' }}>삭제</button>
              )}
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSubmit}>
                {mode === 'add' ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DeliveryCompanyPage() {
  const [allItems, setAllItems]   = useState<DeliveryCompany[]>(MOCK_DELIVERY_COMPANIES)
  const [filter, setFilter]       = useState<DeliveryCompanyFilter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<DeliveryCompany[]>([])
  const [loading, setLoading]     = useState(false)
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(7)
  const [formModal, setFormModal] = useState<{ mode: 'add' | 'edit'; company?: DeliveryCompany } | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterDeliveryCompanies(allItems, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleSubmit(company: DeliveryCompany) {
    const exists = allItems.some((d) => d.companyId === company.companyId)
    const next = exists
      ? allItems.map((d) => d.companyId === company.companyId ? company : d)
      : [...allItems, company]
    setAllItems(next)
    setDisplayed(filterDeliveryCompanies(next, filter))
    setFormModal(null)
  }

  function handleDelete(companyId: string) {
    const next = allItems.filter((d) => d.companyId !== companyId)
    setAllItems(next)
    setDisplayed(filterDeliveryCompanies(next, filter))
    setFormModal(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">배송사 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar onAdd={() => setFormModal({ mode: 'add' })} />
          </div>
          {displayed.length > 0
            ? <>
                <DeliveryCompanyTable items={pageItems} onRowClick={(d) => setFormModal({ mode: 'edit', company: d })} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 배송사 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {formModal && (
        <DeliveryCompanyFormModal
          mode={formModal.mode}
          company={formModal.company}
          allItems={allItems}
          onClose={() => setFormModal(null)}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
