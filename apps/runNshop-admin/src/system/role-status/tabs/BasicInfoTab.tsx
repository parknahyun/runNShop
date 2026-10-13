'use client'
import { useState, useEffect } from 'react'
import { type Role, type RoleType, type RoleStatusType, ROLE_TYPE_LABEL, ROLE_STATUS_LABEL } from '../mockData'

function RoleBadge({ roleType }: { roleType: RoleType }) {
  return <span className="badge" data-op-role={roleType}>{ROLE_TYPE_LABEL[roleType]}</span>
}

function RoleStatusBadge({ status }: { status: RoleStatusType }) {
  return <span className="badge" data-role-status={status}>{ROLE_STATUS_LABEL[status]}</span>
}

interface EditForm { name: string; description: string; sortOrder: number }

export default function BasicInfoTab({ role, currentUser, onSave }: {
  role: Role; currentUser: string; onSave: (updated: Role) => void
}) {
  const [editing, setEditing]   = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    name: role.name, description: role.description, sortOrder: role.sortOrder,
  })

  useEffect(() => {
    setEditForm({ name: role.name, description: role.description, sortOrder: role.sortOrder })
  }, [role])

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSave({ ...role, name: editForm.name, description: editForm.description,
      sortOrder: editForm.sortOrder, updatedBy: currentUser, updatedAt: now })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: '14px 0 0' }}>
        <div className="add-form__row">
          <div className="add-form__field add-form__field--full">
            <label>권한명 <span className="add-form__req">*</span></label>
            <input type="text" value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field">
            <label>정렬</label>
            <input type="number" style={{ width: 80 }} value={editForm.sortOrder}
              onChange={(e) => setEditForm({ ...editForm, sortOrder: Number(e.target.value) })} />
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field add-form__field--full">
            <label>설명</label>
            <input type="text" value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          </div>
        </div>
        <div className="add-form__footer">
          <button className="btn-tool btn-tool--cancel"
            onClick={() => {
              setEditForm({ name: role.name, description: role.description, sortOrder: role.sortOrder })
              setEditing(false)
            }}>취소</button>
          <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle"
          style={{ height: 28, padding: '0 10px', fontSize: 12 }}
          onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid">
        <dl className="info-dl">
          <div className="info-row"><dt>권한 ID</dt><dd>{role.roleId}</dd></div>
          <div className="info-row"><dt>권한명</dt><dd>{role.name}</dd></div>
          <div className="info-row"><dt>권한 유형</dt><dd><RoleBadge roleType={role.roleType} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><RoleStatusBadge status={role.status} /></dd></div>
          <div className="info-row"><dt>정렬</dt><dd>{role.sortOrder}</dd></div>
          <div className="info-row"><dt>소속 인원</dt><dd>{role.memberCount}명</dd></div>
          <div className="info-row"><dt>최초등록</dt><dd>{role.createdBy} / {role.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd>{role.updatedBy} / {role.updatedAt}</dd></div>
        </dl>
      </div>
      {role.description && <p className="pgm-desc">{role.description}</p>}
    </div>
  )
}
