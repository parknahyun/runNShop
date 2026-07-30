'use client'
import { useState, useId } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import {
  type ExternalSettlement, type PartnerType, type ExternalSettlementStatus, type ExternalSettlementFilter,
  PARTNER_TYPE_LABEL, EXTERNAL_SETTLEMENT_STATUS_LABEL,
  MOCK_EXTERNAL_SETTLEMENTS, filterExternalSettlements, nextExternalSettlementId,
} from './mockData'

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function PartnerTypeBadge({ partnerType }: { partnerType: PartnerType }) {
  return <span className="badge" data-partner-type={partnerType}>{PARTNER_TYPE_LABEL[partnerType]}</span>
}

function ExternalSettlementStatusBadge({ status }: { status: ExternalSettlementStatus }) {
  return <span className="badge" data-ext-settlement-status={status}>{EXTERNAL_SETTLEMENT_STATUS_LABEL[status]}</span>
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const PARTNER_TYPE_OPTIONS: Array<{ label: string; value: PartnerType | 'ALL' }> = [
  { label: '전체 유형', value: 'ALL' },
  ...Object.entries(PARTNER_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as PartnerType })),
]

const STATUS_OPTIONS: Array<{ label: string; value: ExternalSettlementStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(EXTERNAL_SETTLEMENT_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as ExternalSettlementStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ExternalSettlementFilter
  onChange: (f: ExternalSettlementFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="거래처명" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.partnerType}
        onChange={(e) => onChange({ ...filter, partnerType: e.target.value as PartnerType | 'ALL' })}>
        {PARTNER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ExternalSettlementStatus | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="month" value={filter.monthFrom}
        onChange={(e) => onChange({ ...filter, monthFrom: e.target.value })} />
      <span className="sep">~</span>
      <input type="month" value={filter.monthTo}
        onChange={(e) => onChange({ ...filter, monthTo: e.target.value })} />
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: ExternalSettlement[] }) {
  const pending = items.filter((e) => e.status === 'PENDING').length
  const paid = items.filter((e) => e.status === 'PAID').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">청구대기</div>
        <div className="summary-card__count">{pending}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">지급완료</div>
        <div className="summary-card__count">{paid}건</div>
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
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 외부정산 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ExternalSettlementTable
// ---------------------------------------------------------------------------

function ExternalSettlementTable({ items, onRowClick }: {
  items: ExternalSettlement[]
  onRowClick: (e: ExternalSettlement) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 외부 정산 내역이 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>정산월</th>
            <th>거래유형</th>
            <th>거래처명</th>
            <th>청구금액</th>
            <th>지급금액</th>
            <th>상태</th>
            <th>청구일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.externalSettlementId} onClick={() => onRowClick(e)}>
              <td className="link-cell">{e.settlementMonth}</td>
              <td><PartnerTypeBadge partnerType={e.partnerType} /></td>
              <td>{e.partnerName}</td>
              <td className="amount-cell">{e.billingAmount.toLocaleString()}원</td>
              <td className="amount-cell">{e.paidAmount.toLocaleString()}원</td>
              <td><ExternalSettlementStatusBadge status={e.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{e.billingDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddEditModal — 등록/수정 공용
// ---------------------------------------------------------------------------

interface ExternalSettlementForm {
  settlementMonth: string
  partnerType: PartnerType
  partnerName: string
  billingAmount: string
  paidAmount: string
  billingDate: string
  paidDate: string
  description: string
  status: ExternalSettlementStatus
}

function toForm(e: ExternalSettlement): ExternalSettlementForm {
  return {
    settlementMonth: e.settlementMonth,
    partnerType: e.partnerType,
    partnerName: e.partnerName,
    billingAmount: String(e.billingAmount),
    paidAmount: String(e.paidAmount),
    billingDate: e.billingDate,
    paidDate: e.paidDate ?? '',
    description: e.description,
    status: e.status,
  }
}

const EMPTY_FORM: ExternalSettlementForm = {
  settlementMonth: '', partnerType: 'PG', partnerName: '',
  billingAmount: '', paidAmount: '0', billingDate: '', paidDate: '',
  description: '', status: 'PENDING',
}

function AddEditModal({ mode, target, onClose, onSubmit, onDelete }: {
  mode: 'add' | 'edit'
  target?: ExternalSettlement
  onClose: () => void
  onSubmit: (form: ExternalSettlementForm) => void
  onDelete?: () => void
}) {
  const uid = useId()
  const [form, setForm] = useState<ExternalSettlementForm>(() => mode === 'edit' && target ? toForm(target) : EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof ExternalSettlementForm, string>>>({})

  function f(key: keyof ExternalSettlementForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.settlementMonth.trim()) e.settlementMonth = '필수'
    if (!form.partnerName.trim()) e.partnerName = '필수'
    if (!form.billingAmount.trim() || isNaN(Number(form.billingAmount))) e.billingAmount = '숫자를 입력하세요'
    if (!form.billingDate.trim()) e.billingDate = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit(form)
  }

  function handleDelete() {
    if (!window.confirm('선택한 외부 정산 내역을 삭제하시겠습니까?')) return
    onDelete?.()
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">외부 정산 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('settlementMonth')}>정산월 <span className="add-form__req">*</span></label>
                <input id={f('settlementMonth')} type="month"
                  value={form.settlementMonth} onChange={(e) => setForm({ ...form, settlementMonth: e.target.value })} />
                {errors.settlementMonth && <span className="add-form__err">{errors.settlementMonth}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('partnerType')}>거래유형 <span className="add-form__req">*</span></label>
                <select id={f('partnerType')} value={form.partnerType}
                  onChange={(e) => setForm({ ...form, partnerType: e.target.value as PartnerType })}>
                  {Object.entries(PARTNER_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('partnerName')}>거래처명 <span className="add-form__req">*</span></label>
                <input id={f('partnerName')} type="text" placeholder="예) 토스페이먼츠"
                  value={form.partnerName} onChange={(e) => setForm({ ...form, partnerName: e.target.value })} />
                {errors.partnerName && <span className="add-form__err">{errors.partnerName}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('billingAmount')}>청구금액 <span className="add-form__req">*</span></label>
                <input id={f('billingAmount')} type="number" placeholder="예) 4820000"
                  value={form.billingAmount} onChange={(e) => setForm({ ...form, billingAmount: e.target.value })} />
                {errors.billingAmount && <span className="add-form__err">{errors.billingAmount}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('paidAmount')}>지급금액</label>
                <input id={f('paidAmount')} type="number" placeholder="예) 0"
                  value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('billingDate')}>청구일 <span className="add-form__req">*</span></label>
                <input id={f('billingDate')} type="date"
                  value={form.billingDate} onChange={(e) => setForm({ ...form, billingDate: e.target.value })} />
                {errors.billingDate && <span className="add-form__err">{errors.billingDate}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('paidDate')}>지급일</label>
                <input id={f('paidDate')} type="date"
                  value={form.paidDate} onChange={(e) => setForm({ ...form, paidDate: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('description')}>설명</label>
                <input id={f('description')} type="text" placeholder="정산 내역에 대한 설명을 입력하세요"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={f('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ExternalSettlementStatus })}>
                  {Object.entries(EXTERNAL_SETTLEMENT_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="add-form__footer">
              {mode === 'edit' && (
                <button className="btn-tool btn-tool--delete" onClick={handleDelete} style={{ marginRight: 'auto' }}>삭제</button>
              )}
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSubmit}>{mode === 'add' ? '등록' : '저장'}</button>
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

export default function ExternalSettlementPage() {
  const [allItems, setAllItems] = useState<ExternalSettlement[]>(MOCK_EXTERNAL_SETTLEMENTS)
  const [filter, setFilter] = useState<ExternalSettlementFilter>({ keyword: '', partnerType: 'ALL', status: 'ALL', monthFrom: '', monthTo: '' })
  const [displayed, setDisplayed] = useState<ExternalSettlement[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; target?: ExternalSettlement } | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterExternalSettlements(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleSubmit(form: ExternalSettlementForm) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    if (modal?.mode === 'edit' && modal.target) {
      const updated: ExternalSettlement = {
        ...modal.target,
        settlementMonth: form.settlementMonth,
        partnerType: form.partnerType,
        partnerName: form.partnerName.trim(),
        billingAmount: Number(form.billingAmount),
        paidAmount: Number(form.paidAmount || 0),
        billingDate: form.billingDate,
        paidDate: form.paidDate || null,
        description: form.description.trim(),
        status: form.status,
        updatedAt: now,
      }
      const next = allItems.map((e) => e.externalSettlementId === updated.externalSettlementId ? updated : e)
      setAllItems(next)
      setDisplayed(filterExternalSettlements(next, filter))
    } else {
      const created: ExternalSettlement = {
        externalSettlementId: nextExternalSettlementId(allItems),
        settlementMonth: form.settlementMonth,
        partnerType: form.partnerType,
        partnerName: form.partnerName.trim(),
        billingAmount: Number(form.billingAmount),
        paidAmount: Number(form.paidAmount || 0),
        billingDate: form.billingDate,
        paidDate: form.paidDate || null,
        description: form.description.trim(),
        status: form.status,
        createdAt: now,
        updatedAt: now,
      }
      const next = [...allItems, created]
      setAllItems(next)
      setDisplayed(filterExternalSettlements(next, filter))
    }
    setModal(null)
  }

  function handleDelete() {
    if (!modal?.target) return
    const next = allItems.filter((e) => e.externalSettlementId !== modal.target!.externalSettlementId)
    setAllItems(next)
    setDisplayed(filterExternalSettlements(next, filter))
    setModal(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">외부 정산</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar onAdd={() => setModal({ mode: 'add' })} />
          </div>
          {displayed.length > 0 ? (
            <>
              <ExternalSettlementTable items={pageItems} onRowClick={(e) => setModal({ mode: 'edit', target: e })} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 외부 정산 내역이 없습니다.'
                  : '조회 버튼을 눌러 외부 정산 목록을 불러오세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {modal && (
        <AddEditModal
          mode={modal.mode}
          target={modal.target}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
