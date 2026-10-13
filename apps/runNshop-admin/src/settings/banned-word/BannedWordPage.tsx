'use client'
import { useState, useId } from 'react'
import {
  type BannedWord, type BannedWordCategory, type BannedWordStatus, type BannedWordFilter,
  BANNED_WORD_CATEGORY_LABEL, BANNED_WORD_STATUS_LABEL,
  MOCK_BANNED_WORDS, filterBannedWords, nextWordId,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const CATEGORY_OPTIONS: Array<{ label: string; value: BannedWordCategory | 'ALL' }> = [
  { label: '전체 분류', value: 'ALL' },
  ...Object.entries(BANNED_WORD_CATEGORY_LABEL).map(([k, v]) => ({ label: v, value: k as BannedWordCategory })),
]

const STATUS_OPTIONS: Array<{ label: string; value: BannedWordStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(BANNED_WORD_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as BannedWordStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: BannedWordFilter
  onChange: (f: BannedWordFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="금지어 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.category}
        onChange={(e) => onChange({ ...filter, category: e.target.value as BannedWordFilter['category'] })}>
        {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as BannedWordFilter['status'] })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function BannedWordStatusBadge({ status }: { status: BannedWordStatus }) {
  return <span className="badge" data-word-status={status}>{BANNED_WORD_STATUS_LABEL[status]}</span>
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 금지어 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BannedWordTable
// ---------------------------------------------------------------------------

function BannedWordTable({ items, onRowClick }: {
  items: BannedWord[]
  onRowClick: (w: BannedWord) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 금지어가 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>금지어</th>
            <th>분류</th>
            <th>상태</th>
            <th>등록자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.wordId} onClick={() => onRowClick(w)}>
              <td className="link-cell">{w.word}</td>
              <td>{BANNED_WORD_CATEGORY_LABEL[w.category]}</td>
              <td><BannedWordStatusBadge status={w.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{w.createdBy}</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{w.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddEditWordModal
// ---------------------------------------------------------------------------

interface WordForm {
  word: string; category: BannedWordCategory; status: BannedWordStatus
}

const EMPTY_WORD_FORM: WordForm = { word: '', category: 'PROFANITY', status: 'ACTIVE' }

function AddEditWordModal({ mode, word, allItems, currentUser, onClose, onSubmit, onDelete }: {
  mode: 'add' | 'edit'
  word?: BannedWord
  allItems: BannedWord[]
  currentUser: string
  onClose: () => void
  onSubmit: (w: BannedWord) => void
  onDelete: (wordId: string) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<WordForm>(() =>
    mode === 'edit' && word ? { word: word.word, category: word.category, status: word.status } : EMPTY_WORD_FORM
  )
  const [errors, setErrors] = useState<Partial<Record<keyof WordForm, string>>>({})

  function f(key: keyof WordForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.word.trim()) e.word = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      wordId:     mode === 'edit' && word ? word.wordId : nextWordId(allItems),
      word:       form.word.trim(),
      category:   form.category,
      status:     form.status,
      createdBy:  mode === 'edit' && word ? word.createdBy : currentUser,
      createdAt:  mode === 'edit' && word ? word.createdAt : now,
      updatedAt:  now,
    })
  }

  function handleDelete() {
    if (word) onDelete(word.wordId)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">금지어 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('word')}>금지어 <span className="add-form__req">*</span></label>
                <input id={f('word')} type="text" placeholder="예) 시발"
                  value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} />
                {errors.word && <span className="add-form__err">{errors.word}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('category')}>분류 <span className="add-form__req">*</span></label>
                <select id={f('category')} value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as BannedWordCategory })}>
                  {Object.entries(BANNED_WORD_CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="add-form__field">
                <label htmlFor={f('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={f('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as BannedWordStatus })}>
                  {Object.entries(BANNED_WORD_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
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

export default function BannedWordPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<BannedWord[]>(MOCK_BANNED_WORDS)
  const [filter, setFilter]     = useState<BannedWordFilter>({ keyword: '', category: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed] = useState<BannedWord[]>([])
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; word?: BannedWord } | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterBannedWords(allItems, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleSubmit(w: BannedWord) {
    const exists = allItems.some((i) => i.wordId === w.wordId)
    const next = exists ? allItems.map((i) => i.wordId === w.wordId ? w : i) : [w, ...allItems]
    setAllItems(next)
    setDisplayed(filterBannedWords(next, filter))
    setModal(null)
  }

  function handleDelete(wordId: string) {
    const next = allItems.filter((i) => i.wordId !== wordId)
    setAllItems(next)
    setDisplayed(filterBannedWords(next, filter))
    setModal(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">금지어 관리</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            <span />
            <Toolbar onAdd={() => setModal({ mode: 'add' })} />
          </div>
          {displayed.length > 0
            ? <>
                <BannedWordTable items={pageItems} onRowClick={(w) => setModal({ mode: 'edit', word: w })} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 금지어 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {modal && (
        <AddEditWordModal
          mode={modal.mode}
          word={modal.word}
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
