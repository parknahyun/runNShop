'use client'
import { useState, useId } from 'react'
import { type DetailCode, type DetailCodeStatus, DETAIL_CODE_STATUS_LABEL, nextCodeId } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

function DetailCodeStatusBadge({ status }: { status: DetailCodeStatus }) {
  return <span className="badge" data-detail-status={status}>{DETAIL_CODE_STATUS_LABEL[status]}</span>
}

interface DetailCodeForm {
  codeId: string; codeName: string; codeValue: string
  description: string; sortOrder: string; codeStatus: DetailCodeStatus
}

function DetailCodeFormModal({ mode, code, existingCodes, onClose, onSubmit }: {
  mode: 'add' | 'edit'
  code?: DetailCode
  existingCodes: DetailCode[]
  onClose: () => void
  onSubmit: (code: DetailCode) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<DetailCodeForm>(() =>
    mode === 'edit' && code
      ? { codeId: code.codeId, codeName: code.codeName, codeValue: code.codeValue,
          description: code.description, sortOrder: String(code.sortOrder), codeStatus: code.codeStatus }
      : { codeId: nextCodeId(existingCodes), codeName: '', codeValue: '',
          description: '', sortOrder: '', codeStatus: 'ACTIVE' }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof DetailCodeForm, string>>>({})

  function fid(key: keyof DetailCodeForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (mode === 'add' && !form.codeId.trim())  e.codeId    = '필수'
    if (!form.codeName.trim())                  e.codeName  = '필수'
    if (!form.codeValue.trim())                 e.codeValue = '필수'
    if (!form.sortOrder.trim())                 e.sortOrder = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit({
      codeId:      form.codeId.trim(),
      codeName:    form.codeName.trim(),
      codeValue:   form.codeValue.trim(),
      description: form.description.trim(),
      sortOrder:   parseInt(form.sortOrder, 10),
      codeStatus:  form.codeStatus,
    })
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 200 }}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">상세코드 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={fid('codeId')}>코드ID <span className="add-form__req">*</span></label>
                <input id={fid('codeId')} type="text" value={form.codeId}
                  disabled={mode === 'edit'}
                  style={mode === 'edit' ? { background: '#f8fafc', color: '#64748b' } : undefined}
                  onChange={(e) => setForm({ ...form, codeId: e.target.value })} />
                {errors.codeId && <span className="add-form__err">{errors.codeId}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={fid('codeName')}>코드명 <span className="add-form__req">*</span></label>
                <input id={fid('codeName')} type="text" value={form.codeName}
                  onChange={(e) => setForm({ ...form, codeName: e.target.value })} />
                {errors.codeName && <span className="add-form__err">{errors.codeName}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={fid('codeValue')}>코드값 <span className="add-form__req">*</span></label>
                <input id={fid('codeValue')} type="text" value={form.codeValue}
                  onChange={(e) => setForm({ ...form, codeValue: e.target.value })} />
                {errors.codeValue && <span className="add-form__err">{errors.codeValue}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={fid('description')}>설명</label>
                <input id={fid('description')} type="text" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={fid('sortOrder')}>정렬순서 <span className="add-form__req">*</span></label>
                <input id={fid('sortOrder')} type="number" value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                {errors.sortOrder && <span className="add-form__err">{errors.sortOrder}</span>}
              </div>
              <div className="add-form__field">
                <label>상태 <span className="add-form__req">*</span></label>
                <div className="pgm-status-radio">
                  {(['ACTIVE', 'SUSPENDED', 'DEPRECATED'] as DetailCodeStatus[]).map((s) => (
                    <label key={s} className={`pgm-status-radio__item${form.codeStatus === s ? ' pgm-status-radio__item--on' : ''}`}>
                      <input type="radio" name={fid('codeStatus')} checked={form.codeStatus === s}
                        onChange={() => setForm({ ...form, codeStatus: s })} />
                      {DETAIL_CODE_STATUS_LABEL[s]}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="add-form__footer">
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

export default function DetailCodeTab({ codes, onCodesChange }: {
  codes: DetailCode[]
  onCodesChange: (codes: DetailCode[]) => void
}) {

  const [editing, setEditing]     = useState(false)
  const [editCodes, setEditCodes] = useState<DetailCode[]>([])
  const [codeModal, setCodeModal] = useState<{ mode: 'add' | 'edit'; code?: DetailCode } | null>(null)

  const displayCodes = editing ? editCodes : codes
  const pager = usePager(displayCodes, 5)

  function startEdit() {
    setEditCodes(codes.map((c) => ({ ...c })))
    setEditing(true)
  }

  function handleCancel() {
    setEditing(false)
    setEditCodes([])
  }

  function handleSave() {
    onCodesChange(editCodes)
    setEditing(false)
    setEditCodes([])
  }

  function updateCode(globalIdx: number, patch: Partial<DetailCode>) {
    setEditCodes((prev) => prev.map((c, i) => i === globalIdx ? { ...c, ...patch } : c))
  }

  function handleCodeSubmit(submitted: DetailCode) {
    if (codeModal?.mode === 'add') {
      setEditCodes((prev) => [...prev, submitted])
    } else {
      setEditCodes((prev) => prev.map((c) => c.codeId === submitted.codeId ? submitted : c))
    }
    setCodeModal(null)
  }

  return (
    <div className="tab-panel-content">
      <div className="pgm-toolbar" style={{ marginBottom: 8 }}>
        {editing ? (
          <>
            <button className="btn-tool btn-tool--add"
              onClick={() => setCodeModal({ mode: 'add' })}>+ 코드 추가</button>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
            </div>
          </>
        ) : (
          <>
            <span />
            <button className="btn-tool btn-tool--toggle"
              style={{ height: 28, padding: '0 10px', fontSize: 12 }}
              onClick={startEdit}>편집</button>
          </>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>코드ID</th>
              <th>코드명</th>
              <th>코드값</th>
              <th>설명</th>
              <th>정렬순서</th>
              <th style={{ textAlign: 'center' }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={6} className="state-msg">등록된 상세코드가 없습니다.</td></tr>
              : pager.slice.map((c, sliceIdx) => {
                  const globalIdx = (pager.page - 1) * 5 + sliceIdx
                  return (
                    <tr key={c.codeId}>
                      <td
                        className={editing ? 'link-cell' : undefined}
                        onClick={editing ? () => setCodeModal({ mode: 'edit', code: c }) : undefined}
                      >{c.codeId}</td>
                      <td>{c.codeName}</td>
                      <td><code style={{ fontSize: 12 }}>{c.codeValue}</code></td>
                      <td>{c.description}</td>
                      <td style={{ textAlign: 'center' }}>
                        {editing
                          ? <input type="number" className="cc-inline-input cc-inline-input--sm"
                              value={c.sortOrder}
                              onChange={(e) => updateCode(globalIdx, { sortOrder: Number(e.target.value) })} />
                          : c.sortOrder}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <DetailCodeStatusBadge status={c.codeStatus} />
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
      <MiniPager page={pager.page} totalPages={pager.totalPages} onChange={pager.setPage} />

      {codeModal && (
        <DetailCodeFormModal
          mode={codeModal.mode}
          code={codeModal.code}
          existingCodes={editCodes}
          onClose={() => setCodeModal(null)}
          onSubmit={handleCodeSubmit}
        />
      )}
    </div>
  )
}
