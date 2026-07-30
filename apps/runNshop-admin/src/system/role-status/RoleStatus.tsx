'use client'
import { useState } from 'react'
import {
  type Role, type RoleType, type RoleStatusType,
  ROLE_TYPE_LABEL, ROLE_STATUS_LABEL,
  MOCK_ROLES, nextRoleId, DEFAULT_MENU_PERMISSIONS,
} from './mockData'
import RoleDetail    from './RoleDetail'

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function RoleBadge({ roleType }: { roleType: RoleType }) {
  return <span className="badge" data-op-role={roleType}>{ROLE_TYPE_LABEL[roleType]}</span>
}

function RoleStatusBadge({ status }: { status: RoleStatusType }) {
  return <span className="badge" data-role-status={status}>{ROLE_STATUS_LABEL[status]}</span>
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 권한 추가</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddRoleModal
// ---------------------------------------------------------------------------

interface AddRoleForm {
  name: string; roleType: RoleType; status: RoleStatusType; description: string
}

const DEFAULT_ADD_FORM: AddRoleForm = { name: '', roleType: 'VIEWER', status: 'ACTIVE', description: '' }

function AddRoleModal({ allRoles, currentUser, onSave, onClose }: {
  allRoles: Role[]
  currentUser: string
  onSave: (role: Role) => void
  onClose: () => void
}) {
  const [form, setForm]   = useState<AddRoleForm>(DEFAULT_ADD_FORM)
  const [error, setError] = useState('')

  function handleSave() {
    if (!form.name.trim()) { setError('권한명을 입력하세요.'); return }
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const maxOrder = allRoles.reduce((acc, r) => Math.max(acc, r.sortOrder ?? 0), 0)
    onSave({
      roleId: nextRoleId(allRoles), roleType: form.roleType, name: form.name.trim(),
      description: form.description.trim(), status: form.status, sortOrder: maxOrder + 1,
      memberCount: 0, permissions: DEFAULT_MENU_PERMISSIONS.map((p) => ({ ...p })), members: [],
      createdBy: currentUser, createdAt: now, updatedBy: currentUser, updatedAt: now,
    })
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">권한 추가</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field">
                <label>권한명 <span className="add-form__req">*</span></label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>권한 유형</label>
                <select value={form.roleType}
                  onChange={(e) => setForm({ ...form, roleType: e.target.value as RoleType })}>
                  <option value="SUPER_ADMIN">최고 관리자</option>
                  <option value="ADMIN">관리자</option>
                  <option value="OPERATOR">운영자</option>
                  <option value="VIEWER">조회자</option>
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>상태</label>
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as RoleStatusType })}>
                  <option value="ACTIVE">활성</option>
                  <option value="SUSPENDED">중지</option>
                  <option value="DEPRECATED">폐기</option>
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>설명</label>
                <input type="text" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            {error && <p className="add-form__err" style={{ margin: '4px 0 0' }}>{error}</p>}
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// RoleList (카드 목록)
// ---------------------------------------------------------------------------

function RoleList({ roles, onSelect }: { roles: Role[]; onSelect: (role: Role) => void }) {
  return (
    <div className="role-card-grid">
      {roles.map((role) => {
        const writeCount = role.permissions.filter((p) => p.write).length
        const readCount  = role.permissions.filter((p) => p.read && !p.write).length
        return (
          <div key={role.roleId} className="role-card" onClick={() => onSelect(role)}>
            <div className="role-card__head">
              <RoleBadge roleType={role.roleType} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RoleStatusBadge status={role.status} />
                <span className="role-card__member">{role.memberCount}명</span>
              </div>
            </div>
            <div className="role-card__name">{role.name}</div>
            <p className="role-card__desc">{role.description}</p>
            <div className="role-card__perm-summary">
              <span className="role-perm-chip role-perm-chip--write">수정 {writeCount}개</span>
              <span className="role-perm-chip role-perm-chip--read">조회전용 {readCount}개</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page (default export)
// ---------------------------------------------------------------------------

export default function RoleStatus({ currentUser = 'guest' }: { currentUser?: string }) {
  const [allRoles, setAllRoles] = useState<Role[]>(MOCK_ROLES)
  const [selected, setSelected] = useState<Role | null>(null)
  const [showAdd, setShowAdd]   = useState(false)

  function handleAdd(role: Role) {
    setAllRoles((prev) => [...prev, role])
    setShowAdd(false)
  }

  function handleSave(updated: Role) {
    const next = allRoles.map((r) => r.roleId === updated.roleId ? updated : r)
    setAllRoles(next)
    setSelected(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">
          권한 현황
          <span className="page-title__sub">총 {allRoles.length}개 권한 그룹</span>
        </h1>
      </div>

      <Toolbar onAdd={() => setShowAdd(true)} />
      <RoleList roles={allRoles} onSelect={setSelected} />

      {selected && (
        <RoleDetail
          role={selected}
          currentUser={currentUser}
          onSave={handleSave}
          onClose={() => setSelected(null)}
        />
      )}

      {showAdd && (
        <AddRoleModal
          allRoles={allRoles}
          currentUser={currentUser}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
