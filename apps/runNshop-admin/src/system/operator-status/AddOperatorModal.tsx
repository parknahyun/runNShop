'use client'
import { useState, useId } from 'react'
import {
  type Operator, type OperatorRole, type OperatorStatus,
  STATUS_LABEL,
  nextOperatorId, DEFAULT_PERMISSIONS,
} from './mockData'

interface AddForm {
  name: string; loginId: string; email: string; phone: string
  department: string; role: OperatorRole; status: OperatorStatus
}

const EMPTY_ADD_FORM: AddForm = {
  name: '', loginId: '', email: '', phone: '',
  department: '', role: 'VIEWER', status: 'APPLIED',
}

export default function AddOperatorModal({ allOperators, currentUser, onClose, onSubmit }: {
  allOperators: Operator[]
  currentUser: string
  onClose: () => void
  onSubmit: (op: Operator) => void
}) {
  const uid = useId()
  const [form, setForm]     = useState<AddForm>(EMPTY_ADD_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AddForm, string>>>({})

  function f(key: keyof AddForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim())    e.name    = '필수'
    if (!form.loginId.trim()) e.loginId = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      operatorId:    nextOperatorId(allOperators),
      name:          form.name.trim(),
      loginId:       form.loginId.trim(),
      email:         form.email.trim(),
      phone:         form.phone.trim(),
      department:    form.department.trim(),
      role:          form.role,
      status:        form.status,
      permissions:   DEFAULT_PERMISSIONS.map((p) => ({ ...p })),
      loginHistory:  [],
      screenHistory: [],
      createdBy:     currentUser,
      createdAt:     now,
      updatedBy:     currentUser,
      updatedAt:     now,
      lastLoginAt:   '—',
    })
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">운영자 추가</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('name')}>이름 <span className="add-form__req">*</span></label>
                <input id={f('name')} type="text" placeholder="예) 홍길동"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span className="add-form__err">{errors.name}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('loginId')}>로그인 ID <span className="add-form__req">*</span></label>
                <input id={f('loginId')} type="text" placeholder="예) hong.gd"
                  value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} />
                {errors.loginId && <span className="add-form__err">{errors.loginId}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('email')}>이메일</label>
                <input id={f('email')} type="email" placeholder="예) hong@3top.co.kr"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label htmlFor={f('phone')}>연락처</label>
                <input id={f('phone')} type="text" placeholder="예) 010-0000-0000"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('department')}>부서</label>
                <input id={f('department')} type="text" placeholder="예) 플랫폼운영팀"
                  value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label htmlFor={f('role')}>권한 <span className="add-form__req">*</span></label>
                <select id={f('role')} value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as OperatorRole })}>
                  <option value="SUPER_ADMIN">최고 관리자</option>
                  <option value="ADMIN">관리자</option>
                  <option value="OPERATOR">운영자</option>
                  <option value="VIEWER">조회자</option>
                </select>
              </div>
              <div className="add-form__field">
                <label htmlFor={f('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={f('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as OperatorStatus })}>
                  {(['APPLIED', 'ACTIVE', 'SUSPENDED', 'WITHDRAWN'] as OperatorStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
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
