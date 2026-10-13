'use client'
import { useState, useId } from 'react'
import {
  type Notice, type NoticeTargetType, type NoticeFilter,
  NOTICE_TARGET_TYPE_LABEL,
  MOCK_NOTICES, filterNotices, nextNoticeId,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const TARGET_OPTIONS: Array<{ label: string; value: NoticeTargetType | 'ALL' }> = [
  { label: '전체 대상', value: 'ALL' },
  ...Object.entries(NOTICE_TARGET_TYPE_LABEL)
    .filter(([k]) => k !== 'ALL') // NoticeTargetType 자체에 'ALL'이 있어 필터의 "전체 대상" sentinel과 겹치므로 제외
    .map(([k, v]) => ({ label: v, value: k as NoticeTargetType })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: NoticeFilter
  onChange: (f: NoticeFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="제목 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.targetType}
        onChange={(e) => onChange({ ...filter, targetType: e.target.value as NoticeFilter['targetType'] })}>
        {TARGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function PopupBadge({ isPopup }: { isPopup: boolean }) {
  return <span className="badge" data-notice-popup={isPopup ? 'true' : 'false'}>{isPopup ? '노출' : '미노출'}</span>
}

function ImportantBadge({ isImportant }: { isImportant: boolean }) {
  return <span className="badge" data-notice-important={isImportant ? 'true' : 'false'}>{isImportant ? '중요' : '일반'}</span>
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Notice[] }) {
  const popup = items.filter((n) => n.isPopup).length
  const important = items.filter((n) => n.isImportant).length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">팝업노출</div>
        <div className="summary-card__count">{popup}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">중요공지</div>
        <div className="summary-card__count">{important}건</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 공지사항 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// NoticeTable
// ---------------------------------------------------------------------------

function displayPeriod(n: Notice): string {
  if (!n.displayFrom && !n.displayTo) return '상시'
  return `${n.displayFrom ?? '-'} ~ ${n.displayTo ?? '-'}`
}

function NoticeTable({ items, onRowClick }: {
  items: Notice[]
  onRowClick: (n: Notice) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 공지사항이 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>대상</th>
            <th>팝업여부</th>
            <th>중요여부</th>
            <th>노출기간</th>
            <th>등록자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.noticeId} onClick={() => onRowClick(n)}>
              <td className="link-cell">{n.title}</td>
              <td>{NOTICE_TARGET_TYPE_LABEL[n.targetType]}</td>
              <td><PopupBadge isPopup={n.isPopup} /></td>
              <td><ImportantBadge isImportant={n.isImportant} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{displayPeriod(n)}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{n.createdBy}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{n.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddEditNoticeModal
// ---------------------------------------------------------------------------

interface NoticeForm {
  targetType: NoticeTargetType; title: string; content: string
  isPopup: boolean; isImportant: boolean
  displayFrom: string; displayTo: string
}

function toForm(n: Notice): NoticeForm {
  return {
    targetType: n.targetType, title: n.title, content: n.content,
    isPopup: n.isPopup, isImportant: n.isImportant,
    displayFrom: n.displayFrom ?? '', displayTo: n.displayTo ?? '',
  }
}

const EMPTY_NOTICE_FORM: NoticeForm = {
  targetType: 'ALL', title: '', content: '',
  isPopup: false, isImportant: false, displayFrom: '', displayTo: '',
}

function AddEditNoticeModal({ mode, notice, allItems, currentUser, onClose, onSubmit, onDelete }: {
  mode: 'add' | 'edit'
  notice?: Notice
  allItems: Notice[]
  currentUser: string
  onClose: () => void
  onSubmit: (n: Notice) => void
  onDelete: (noticeId: string) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<NoticeForm>(() =>
    mode === 'edit' && notice ? toForm(notice) : EMPTY_NOTICE_FORM
  )
  const [errors, setErrors] = useState<Partial<Record<keyof NoticeForm, string>>>({})

  function f(key: keyof NoticeForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.title.trim())   e.title   = '필수'
    if (!form.content.trim()) e.content = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      noticeId:     mode === 'edit' && notice ? notice.noticeId : nextNoticeId(allItems),
      targetType:   form.targetType,
      title:        form.title.trim(),
      content:      form.content.trim(),
      isPopup:      form.isPopup,
      isImportant:  form.isImportant,
      displayFrom:  form.displayFrom || null,
      displayTo:    form.displayTo || null,
      createdBy:    mode === 'edit' && notice ? notice.createdBy : currentUser,
      createdAt:    mode === 'edit' && notice ? notice.createdAt : now,
      updatedAt:    now,
    })
  }

  function handleDelete() {
    if (notice) onDelete(notice.noticeId)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">공지사항 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('targetType')}>대상 <span className="add-form__req">*</span></label>
                <select id={f('targetType')} value={form.targetType}
                  onChange={(e) => setForm({ ...form, targetType: e.target.value as NoticeTargetType })}>
                  {Object.entries(NOTICE_TARGET_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('title')}>제목 <span className="add-form__req">*</span></label>
                <input id={f('title')} type="text" placeholder="예) 설 연휴 배송 안내"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                {errors.title && <span className="add-form__err">{errors.title}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('content')}>내용 <span className="add-form__req">*</span></label>
                <textarea id={f('content')} rows={6} placeholder="공지 내용을 입력하세요"
                  value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                {errors.content && <span className="add-form__err">{errors.content}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>
                  <input type="checkbox" checked={form.isPopup}
                    onChange={(e) => setForm({ ...form, isPopup: e.target.checked })}
                    style={{ marginRight: 6 }} />
                  팝업노출
                </label>
              </div>
              <div className="add-form__field">
                <label>
                  <input type="checkbox" checked={form.isImportant}
                    onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
                    style={{ marginRight: 6 }} />
                  중요공지
                </label>
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

export default function NoticePage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Notice[]>(MOCK_NOTICES)
  const [filter, setFilter]     = useState<NoticeFilter>({ keyword: '', targetType: 'ALL' })
  const [displayed, setDisplayed] = useState<Notice[]>([])
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; notice?: Notice } | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterNotices(allItems, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleSubmit(n: Notice) {
    const exists = allItems.some((i) => i.noticeId === n.noticeId)
    const next = exists ? allItems.map((i) => i.noticeId === n.noticeId ? n : i) : [n, ...allItems]
    setAllItems(next)
    setDisplayed(filterNotices(next, filter))
    setModal(null)
  }

  function handleDelete(noticeId: string) {
    const next = allItems.filter((i) => i.noticeId !== noticeId)
    setAllItems(next)
    setDisplayed(filterNotices(next, filter))
    setModal(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">공지사항</h1>
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
                <NoticeTable items={pageItems} onRowClick={(n) => setModal({ mode: 'edit', notice: n })} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 공지사항 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {modal && (
        <AddEditNoticeModal
          mode={modal.mode}
          notice={modal.notice}
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
