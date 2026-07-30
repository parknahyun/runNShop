'use client'
import { useState, useId } from 'react'
import {
  type Operator, type OperatorRole, type OperatorStatus,
  ROLE_LABEL, STATUS_LABEL,
} from '../mockData'

function RoleBadge({ role }: { role: OperatorRole }) {
  return <span className="badge" data-op-role={role}>{ROLE_LABEL[role]}</span>
}

function StatusBadge({ status }: { status: OperatorStatus }) {
  return <span className="badge" data-op-status={status}>{STATUS_LABEL[status]}</span>
}

interface EditDraft {
  name: string; email: string; phone: string; department: string
  role: OperatorRole; status: OperatorStatus
}

function toDraft(op: Operator): EditDraft {
  return {
    name: op.name, email: op.email, phone: op.phone,
    department: op.department, role: op.role, status: op.status,
  }
}

export default function BasicInfoTab({ operator, currentUser, onUpdate }: {
  operator: Operator
  currentUser: string
  onUpdate: (updated: Operator) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState<EditDraft>(toDraft(operator))
  const uid = useId()

  function fid(key: keyof EditDraft) { return `${uid}-${key}` }

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onUpdate({
      ...operator,
      name:       draft.name,
      email:      draft.email,
      phone:      draft.phone,
      department: draft.department,
      role:       draft.role,
      status:     draft.status,
      updatedBy:  currentUser,
      updatedAt:  now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(operator))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: '14px 0 0' }}>
        <div className="add-form__row">
          <div className="add-form__field">
            <label>상태</label>
            <div className="pgm-status-radio">
              {(['APPLIED', 'ACTIVE', 'SUSPENDED', 'WITHDRAWN'] as OperatorStatus[]).map((s) => (
                <label key={s} className={`pgm-status-radio__item${draft.status === s ? ' pgm-status-radio__item--on' : ''}`}>
                  <input type="radio" name={fid('status')} value={s}
                    checked={draft.status === s}
                    onChange={() => setDraft({ ...draft, status: s })} />
                  {STATUS_LABEL[s]}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('name')}>이름 <span className="add-form__req">*</span></label>
            <input id={fid('name')} type="text" value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="add-form__field">
            <label htmlFor={fid('email')}>이메일</label>
            <input id={fid('email')} type="email" value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('phone')}>연락처</label>
            <input id={fid('phone')} type="text" value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          </div>
          <div className="add-form__field">
            <label htmlFor={fid('department')}>부서</label>
            <input id={fid('department')} type="text" value={draft.department}
              onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('role')}>권한</label>
            <select id={fid('role')} value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value as OperatorRole })}>
              <option value="SUPER_ADMIN">최고 관리자</option>
              <option value="ADMIN">관리자</option>
              <option value="OPERATOR">운영자</option>
              <option value="VIEWER">조회자</option>
            </select>
          </div>
        </div>
        <div className="add-form__footer">
          <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
          <button className="btn-tool btn-tool--add"    onClick={handleSave}>저장</button>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          className="btn-tool btn-tool--toggle"
          style={{ height: 28, padding: '0 10px', fontSize: 12 }}
          onClick={() => setEditing(true)}
        >편집</button>
      </div>
      <div className="info-grid">
        <dl className="info-dl">
          <div className="info-row"><dt>운영자 ID</dt><dd>{operator.operatorId}</dd></div>
          <div className="info-row"><dt>이름</dt><dd>{operator.name}</dd></div>
          <div className="info-row"><dt>로그인 ID</dt><dd>{operator.loginId}</dd></div>
          <div className="info-row"><dt>이메일</dt><dd>{operator.email}</dd></div>
          <div className="info-row"><dt>연락처</dt><dd>{operator.phone}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>부서</dt><dd>{operator.department}</dd></div>
          <div className="info-row"><dt>권한</dt><dd><RoleBadge role={operator.role} /></dd></div>
          <div className="info-row"><dt>상태</dt><dd><StatusBadge status={operator.status} /></dd></div>
          <div className="info-row"><dt>최초등록</dt><dd>{operator.createdBy} / {operator.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd>{operator.updatedBy} / {operator.updatedAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
