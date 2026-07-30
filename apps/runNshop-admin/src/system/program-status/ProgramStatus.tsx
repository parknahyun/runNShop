'use client'
import { useState, useId } from 'react'
import {
  type Program, type ProgramType, type ProgramStatus, type ProgramFilter, type ProgramMethod,
  TYPE_LABEL, STATUS_LABEL,
  MOCK_PROGRAMS,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import ProgramDetail from './ProgramDetail'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: Array<{ label: string; value: ProgramType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL'   },
  { label: '화면',      value: 'PAGE'  },
  { label: 'API',       value: 'API'   },
  { label: '배치',      value: 'BATCH' },
  { label: '이벤트',    value: 'EVENT' },
]

const STATUS_FILTER_OPTIONS: Array<{ label: string; value: ProgramStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL'        },
  { label: '운영',      value: 'ACTIVE'     },
  { label: '비활성',    value: 'INACTIVE'   },
  { label: '폐기예정',  value: 'DEPRECATED' },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ProgramFilter
  onChange: (f: ProgramFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="프로그램명" value={filter.name}
        onChange={(e) => onChange({ ...filter, name: e.target.value })} />
      <input type="text" placeholder="도메인" value={filter.domain}
        onChange={(e) => onChange({ ...filter, domain: e.target.value })} />
      <select value={filter.type}
        onChange={(e) => onChange({ ...filter, type: e.target.value as ProgramFilter['type'] })}>
        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ProgramFilter['status'] })}>
        {STATUS_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function TypeBadge({ type }: { type: ProgramType }) {
  return <span className="badge" data-pgm-type={type}>{TYPE_LABEL[type]}</span>
}

function StatusBadge({ status }: { status: ProgramStatus }) {
  return <span className="badge" data-pgm-status={status}>{STATUS_LABEL[status]}</span>
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ programs }: { programs: Program[] }) {
  const active     = programs.filter((p) => p.status === 'ACTIVE').length
  const inactive   = programs.filter((p) => p.status === 'INACTIVE').length
  const deprecated = programs.filter((p) => p.status === 'DEPRECATED').length

  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{programs.length}개</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">운영</div>
        <div className="summary-card__count">{active}개</div>
      </div>
      {inactive > 0 && (
        <div className="summary-card">
          <div className="summary-card__label">비활성</div>
          <div className="summary-card__count">{inactive}개</div>
        </div>
      )}
      {deprecated > 0 && (
        <div className="summary-card summary-card--warn">
          <div className="summary-card__label">⚠ 폐기예정</div>
          <div className="summary-card__count">{deprecated}개</div>
        </div>
      )}
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 프로그램 추가</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProgramTable
// ---------------------------------------------------------------------------

function ProgramTable({ programs, onRowClick }: {
  programs: Program[]
  onRowClick: (id: string) => void
}) {
  if (programs.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 프로그램이 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>프로그램 ID</th>
            <th>프로그램명</th>
            <th>유형</th>
            <th>도메인</th>
            <th>URI</th>
            <th>버전</th>
            <th>상태</th>
            <th style={{ textAlign: 'right' }}>30일 호출</th>
            <th style={{ textAlign: 'right' }}>평균 응답</th>
            <th style={{ textAlign: 'right' }}>오류율</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => (
            <tr key={p.programId} data-pgm-deprecated={p.status === 'DEPRECATED'}
              onClick={() => onRowClick(p.programId)}>
              <td className="link-cell">{p.programId}</td>
              <td>{p.name}</td>
              <td><TypeBadge type={p.type} /></td>
              <td>{p.domain}</td>
              <td className="pgm-uri">{p.uri}</td>
              <td>{p.version}</td>
              <td><StatusBadge status={p.status} /></td>
              <td className="amount-cell">{p.callCount30d.toLocaleString()}</td>
              <td className="amount-cell">{p.avgDurationMs.toLocaleString()}ms</td>
              <td className={`amount-cell${p.errorRate > 1 ? ' pgm-error-rate--warn' : ''}`}>
                {p.errorRate.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddProgramModal
// ---------------------------------------------------------------------------

const METHOD_OPTIONS: ProgramMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const TYPE_INPUT_OPTIONS: ProgramType[] = ['PAGE', 'API', 'BATCH', 'EVENT']

interface AddForm {
  name: string; description: string; type: ProgramType
  method: ProgramMethod | ''; uri: string; domain: string
  version: string; owner: string; status: ProgramStatus
}

const EMPTY_FORM: AddForm = {
  name: '', description: '', type: 'PAGE', method: '',
  uri: '', domain: '', version: '1.0.0', owner: '', status: 'ACTIVE',
}

function AddProgramModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (form: AddForm) => void
}) {
  const [form, setForm]     = useState<AddForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AddForm, string>>>({})
  const uid = useId()

  function field(key: keyof AddForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim())    e.name    = '프로그램명을 입력하세요.'
    if (!form.uri.trim())     e.uri     = 'URI를 입력하세요.'
    if (!form.domain.trim())  e.domain  = '도메인을 입력하세요.'
    if (!form.version.trim()) e.version = '버전을 입력하세요.'
    if (!form.owner.trim())   e.owner   = '담당팀을 입력하세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (validate()) onSubmit(form)
  }

  const needsMethod = form.type === 'API'

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">프로그램 추가</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={field('name')}>프로그램명 <span className="add-form__req">*</span></label>
                <input id={field('name')} type="text" placeholder="예) 주문 내역 조회"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span className="add-form__err">{errors.name}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={field('type')}>유형 <span className="add-form__req">*</span></label>
                <select id={field('type')} value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as ProgramType, method: '' })}>
                  {TYPE_INPUT_OPTIONS.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              </div>
              {needsMethod && (
                <div className="add-form__field">
                  <label htmlFor={field('method')}>HTTP 메서드</label>
                  <select id={field('method')} value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value as ProgramMethod })}>
                    <option value="">선택</option>
                    {METHOD_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
              <div className="add-form__field">
                <label htmlFor={field('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={field('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProgramStatus })}>
                  <option value="ACTIVE">운영</option>
                  <option value="INACTIVE">비활성</option>
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={field('uri')}>URI <span className="add-form__req">*</span></label>
                <input id={field('uri')} type="text" placeholder="예) /order/order-history"
                  value={form.uri} onChange={(e) => setForm({ ...form, uri: e.target.value })} />
                {errors.uri && <span className="add-form__err">{errors.uri}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={field('domain')}>도메인 <span className="add-form__req">*</span></label>
                <input id={field('domain')} type="text" placeholder="예) 주문"
                  value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
                {errors.domain && <span className="add-form__err">{errors.domain}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={field('version')}>버전 <span className="add-form__req">*</span></label>
                <input id={field('version')} type="text" placeholder="예) 1.0.0"
                  value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                {errors.version && <span className="add-form__err">{errors.version}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={field('owner')}>담당팀 <span className="add-form__req">*</span></label>
                <input id={field('owner')} type="text" placeholder="예) 플랫폼운영팀"
                  value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
                {errors.owner && <span className="add-form__err">{errors.owner}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={field('description')}>설명</label>
                <textarea id={field('description')} rows={2} placeholder="프로그램 설명 (선택)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
// Page helpers
// ---------------------------------------------------------------------------

function applyFilter(all: Program[], f: ProgramFilter): Program[] {
  return all.filter((p) => {
    if (f.name   && !p.name.includes(f.name))     return false
    if (f.domain && !p.domain.includes(f.domain)) return false
    if (f.type   !== 'ALL' && p.type   !== f.type)   return false
    if (f.status !== 'ALL' && p.status !== f.status) return false
    return true
  })
}

function nextId(programs: Program[]): string {
  const max = programs.reduce((acc, p) => {
    const n = parseInt(p.programId.replace('PGM-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `PGM-${String(max + 1).padStart(3, '0')}`
}

// ---------------------------------------------------------------------------
// Page (default export)
// ---------------------------------------------------------------------------

export default function ProgramStatus({ currentUser = 'guest' }: { currentUser?: string }) {
  const [allPrograms, setAllPrograms]     = useState<Program[]>(MOCK_PROGRAMS)
  const [filter, setFilter]               = useState<ProgramFilter>({ name: '', domain: '', type: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed]         = useState<Program[]>([])
  const [loading, setLoading]             = useState(false)
  const [page, setPage]                   = useState(1)
  const [pageSize, setPageSize]           = useState(7)
  const [detailProgram, setDetailProgram] = useState<Program | null>(null)
  const [showAdd, setShowAdd]             = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(applyFilter(allPrograms, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleAdd(form: AddForm) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const newProgram: Program = {
      programId: nextId(allPrograms),
      name: form.name, description: form.description,
      type: form.type, method: (form.method as ProgramMethod) || undefined,
      uri: form.uri, domain: form.domain,
      status: form.status as ProgramStatus,
      version: form.version, owner: form.owner,
      createdBy: currentUser, createdAt: now,
      updatedBy: currentUser, updatedAt: now,
      callCount30d: 0, avgDurationMs: 0, errorRate: 0, logs: [],
    }
    const next = [...allPrograms, newProgram]
    setAllPrograms(next)
    setDisplayed(applyFilter(next, filter))
    setShowAdd(false)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">프로그램 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar programs={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0
            ? <>
                <ProgramTable programs={pageItems} onRowClick={(id) => {
                  const p = allPrograms.find((x) => x.programId === id)
                  if (p) setDetailProgram(p)
                }} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 프로그램 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {detailProgram && (
        <ProgramDetail
          program={detailProgram}
          currentUser={currentUser}
          onClose={() => setDetailProgram(null)}
          onUpdate={(updated) => {
            const next = allPrograms.map((p) => p.programId === updated.programId ? updated : p)
            setAllPrograms(next)
            setDisplayed(applyFilter(next, filter))
            setDetailProgram(updated)
          }}
        />
      )}

      {showAdd && (
        <AddProgramModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
      )}
    </div>
  )
}
