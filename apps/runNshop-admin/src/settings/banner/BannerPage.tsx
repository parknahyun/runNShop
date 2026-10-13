'use client'
import { useState, useId } from 'react'
import {
  type Banner, type BannerPosition, type BannerFilter,
  BANNER_POSITION_LABEL,
  MOCK_BANNERS, filterBanners, nextBannerId,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const POSITION_OPTIONS: Array<{ label: string; value: BannerPosition | 'ALL' }> = [
  { label: '전체 위치', value: 'ALL' },
  ...Object.entries(BANNER_POSITION_LABEL).map(([k, v]) => ({ label: v, value: k as BannerPosition })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: BannerFilter
  onChange: (f: BannerFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="배너 제목 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.positionCode}
        onChange={(e) => onChange({ ...filter, positionCode: e.target.value as BannerFilter['positionCode'] })}>
        {POSITION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Banner[] }) {
  const counts = (Object.keys(BANNER_POSITION_LABEL) as BannerPosition[]).map((pos) => ({
    pos, count: items.filter((b) => b.positionCode === pos).length,
  }))
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      {counts.map(({ pos, count }) => (
        <div className="summary-card" key={pos}>
          <div className="summary-card__label">{BANNER_POSITION_LABEL[pos]}</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 배너 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BannerTable
// ---------------------------------------------------------------------------

function displayPeriod(b: Banner): string {
  if (!b.displayFrom && !b.displayTo) return '상시'
  return `${b.displayFrom ?? '-'} ~ ${b.displayTo ?? '-'}`
}

function BannerTable({ items, onRowClick }: {
  items: Banner[]
  onRowClick: (b: Banner) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 배너가 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>노출위치</th>
            <th>제목</th>
            <th>이미지</th>
            <th>정렬순서</th>
            <th>노출기간</th>
            <th>등록자</th>
          </tr>
        </thead>
        <tbody>
          {items.map((b) => (
            <tr key={b.bannerId} onClick={() => onRowClick(b)}>
              <td>{BANNER_POSITION_LABEL[b.positionCode]}</td>
              <td className="link-cell">{b.title}</td>
              <td>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.imageUrl} alt={b.title} style={{ height: 40, borderRadius: 4, objectFit: 'cover' }} />
              </td>
              <td style={{ textAlign: 'center' }}>{b.sortOrder}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{displayPeriod(b)}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{b.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddEditBannerModal
// ---------------------------------------------------------------------------

interface BannerForm {
  positionCode: BannerPosition; title: string; imageUrl: string; linkUrl: string
  sortOrder: string; displayFrom: string; displayTo: string
}

function toForm(b: Banner): BannerForm {
  return {
    positionCode: b.positionCode, title: b.title, imageUrl: b.imageUrl,
    linkUrl: b.linkUrl ?? '', sortOrder: String(b.sortOrder),
    displayFrom: b.displayFrom ?? '', displayTo: b.displayTo ?? '',
  }
}

const EMPTY_BANNER_FORM: BannerForm = {
  positionCode: 'MAIN_TOP', title: '', imageUrl: '', linkUrl: '',
  sortOrder: '1', displayFrom: '', displayTo: '',
}

function AddEditBannerModal({ mode, banner, allItems, currentUser, onClose, onSubmit, onDelete }: {
  mode: 'add' | 'edit'
  banner?: Banner
  allItems: Banner[]
  currentUser: string
  onClose: () => void
  onSubmit: (b: Banner) => void
  onDelete: (bannerId: string) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<BannerForm>(() =>
    mode === 'edit' && banner ? toForm(banner) : EMPTY_BANNER_FORM
  )
  const [errors, setErrors] = useState<Partial<Record<keyof BannerForm, string>>>({})

  function f(key: keyof BannerForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.title.trim())    e.title     = '필수'
    if (!form.imageUrl.trim()) e.imageUrl  = '필수'
    if (!form.sortOrder.trim() || isNaN(Number(form.sortOrder))) e.sortOrder = '숫자를 입력하세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      bannerId:     mode === 'edit' && banner ? banner.bannerId : nextBannerId(allItems),
      positionCode: form.positionCode,
      title:        form.title.trim(),
      imageUrl:     form.imageUrl.trim(),
      linkUrl:      form.linkUrl.trim() || null,
      sortOrder:    Number(form.sortOrder),
      displayFrom:  form.displayFrom || null,
      displayTo:    form.displayTo || null,
      createdBy:    mode === 'edit' && banner ? banner.createdBy : currentUser,
      createdAt:    mode === 'edit' && banner ? banner.createdAt : now,
      updatedAt:    now,
    })
  }

  function handleDelete() {
    if (banner) onDelete(banner.bannerId)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">배너 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('positionCode')}>노출위치 <span className="add-form__req">*</span></label>
                <select id={f('positionCode')} value={form.positionCode}
                  onChange={(e) => setForm({ ...form, positionCode: e.target.value as BannerPosition })}>
                  {Object.entries(BANNER_POSITION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="add-form__field">
                <label htmlFor={f('sortOrder')}>정렬순서 <span className="add-form__req">*</span></label>
                <input id={f('sortOrder')} type="number" value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                {errors.sortOrder && <span className="add-form__err">{errors.sortOrder}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('title')}>제목 <span className="add-form__req">*</span></label>
                <input id={f('title')} type="text" placeholder="예) 봄맞이 러닝화 특가전"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                {errors.title && <span className="add-form__err">{errors.title}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('imageUrl')}>이미지 URL <span className="add-form__req">*</span></label>
                <input id={f('imageUrl')} type="text" placeholder="예) https://via.placeholder.com/1200x400"
                  value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                {errors.imageUrl && <span className="add-form__err">{errors.imageUrl}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('linkUrl')}>링크 URL</label>
                <input id={f('linkUrl')} type="text" placeholder="예) /event/spring-sale"
                  value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('displayFrom')}>노출시작일</label>
                <input id={f('displayFrom')} type="date" value={form.displayFrom}
                  onChange={(e) => setForm({ ...form, displayFrom: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label htmlFor={f('displayTo')}>노출종료일</label>
                <input id={f('displayTo')} type="date" value={form.displayTo}
                  onChange={(e) => setForm({ ...form, displayTo: e.target.value })} />
              </div>
            </div>

            <div className="add-form__footer" style={{ justifyContent: mode === 'edit' ? 'space-between' : 'flex-end' }}>
              {mode === 'edit' && (
                <button className="btn-tool btn-tool--delete" onClick={handleDelete}>삭제</button>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={handleSubmit}>{mode === 'add' ? '등록' : '저장'}</button>
              </div>
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

export default function BannerPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Banner[]>(MOCK_BANNERS)
  const [filter, setFilter]     = useState<BannerFilter>({ keyword: '', positionCode: 'ALL' })
  const [displayed, setDisplayed] = useState<Banner[]>([])
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; banner?: Banner } | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterBanners(allItems, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleSubmit(b: Banner) {
    const exists = allItems.some((i) => i.bannerId === b.bannerId)
    const next = exists ? allItems.map((i) => i.bannerId === b.bannerId ? b : i) : [b, ...allItems]
    setAllItems(next)
    setDisplayed(filterBanners(next, filter))
    setModal(null)
  }

  function handleDelete(bannerId: string) {
    const next = allItems.filter((i) => i.bannerId !== bannerId)
    setAllItems(next)
    setDisplayed(filterBanners(next, filter))
    setModal(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">배너 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar onAdd={() => setModal({ mode: 'add' })} />
          </div>
          {displayed.length > 0
            ? <>
                <BannerTable items={pageItems} onRowClick={(b) => setModal({ mode: 'edit', banner: b })} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 배너 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {modal && (
        <AddEditBannerModal
          mode={modal.mode}
          banner={modal.banner}
          allItems={allItems}
          currentUser={currentUser}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
