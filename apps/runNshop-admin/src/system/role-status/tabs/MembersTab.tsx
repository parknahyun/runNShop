'use client'
import { useState, useEffect } from 'react'
import { type Role, type RoleMember } from '../mockData'
import { MOCK_OPERATORS } from '../../operator-status/mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// OperatorPickerModal
// ---------------------------------------------------------------------------

function OperatorPickerModal({ existingIds, onAdd, onClose }: {
  existingIds: string[]
  onAdd: (members: RoleMember[]) => void
  onClose: () => void
}) {
  const [nameFilter, setNameFilter]       = useState('')
  const [loginIdFilter, setLoginIdFilter] = useState('')
  const [selected, setSelected]           = useState<Set<string>>(new Set())

  const candidates = MOCK_OPERATORS.filter(
    (op) =>
      !existingIds.includes(op.operatorId) &&
      (nameFilter    === '' || op.name.includes(nameFilter)) &&
      (loginIdFilter === '' || op.loginId.includes(loginIdFilter))
  )

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleAdd() {
    const today = new Date().toISOString().slice(0, 10)
    const newMembers: RoleMember[] = MOCK_OPERATORS
      .filter((op) => selected.has(op.operatorId))
      .map((op) => ({
        operatorId: op.operatorId,
        name:       op.name,
        loginId:    op.loginId,
        department: op.department,
        assignedAt: today,
      }))
    onAdd(newMembers)
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 200 }}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">운영자 선택</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="filter-bar" style={{ marginBottom: 12 }}>
            <input type="text" placeholder="이름" value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)} />
            <input type="text" placeholder="로그인 ID" value={loginIdFilter}
              onChange={(e) => setLoginIdFilter(e.target.value)} />
          </div>
          {candidates.length === 0
            ? <p className="state-msg">추가 가능한 운영자가 없습니다.</p>
            : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 48, textAlign: 'center' }}>선택</th>
                      <th>이름</th><th>로그인 ID</th><th>부서</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((op) => (
                      <tr key={op.operatorId} style={{ cursor: 'pointer' }} onClick={() => toggle(op.operatorId)}>
                        <td className="op-perm-cell">
                          <input type="checkbox" checked={selected.has(op.operatorId)}
                            onChange={() => toggle(op.operatorId)}
                            onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td>{op.name}</td>
                        <td>{op.loginId}</td>
                        <td>{op.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
          <div className="add-form__footer" style={{ marginTop: 12 }}>
            <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleAdd} disabled={selected.size === 0}>
              추가{selected.size > 0 ? ` (${selected.size})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MembersTab
// ---------------------------------------------------------------------------

export default function MembersTab({ role, currentUser, onSave }: {
  role: Role
  currentUser: string
  onSave: (updated: Role) => void
}) {
  const [editing, setEditing]         = useState(false)
  const [editMembers, setEditMembers] = useState<RoleMember[]>(role.members)
  const [showPicker, setShowPicker]   = useState(false)

  useEffect(() => {
    if (!editing) setEditMembers(role.members)
  }, [role]) // eslint-disable-line react-hooks/exhaustive-deps

  const viewPager = usePager(role.members, 5)
  const editPager = usePager(editMembers, 5)
  const pager     = editing ? editPager : viewPager

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSave({ ...role, members: editMembers, memberCount: editMembers.length,
      updatedBy: currentUser, updatedAt: now })
    setEditing(false)
  }

  return (
    <div className="tab-panel-content">
      <div className="pgm-toolbar" style={{ marginBottom: 8 }}>
        {editing ? (
          <>
            <button className="btn-tool btn-tool--add"
              onClick={() => setShowPicker(true)}>+ 운영자 추가</button>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-tool btn-tool--cancel"
                onClick={() => { setEditMembers(role.members); setEditing(false) }}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
            </div>
          </>
        ) : (
          <>
            <span />
            <button className="btn-tool btn-tool--toggle"
              style={{ height: 28, padding: '0 10px', fontSize: 12 }}
              onClick={() => setEditing(true)}>편집</button>
          </>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>운영자 ID</th><th>이름</th><th>로그인 ID</th><th>부서</th><th>권한 부여일</th>
            </tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={5} className="state-msg">소속 운영자가 없습니다.</td></tr>
              : pager.slice.map((m) => (
                <tr key={m.operatorId}>
                  <td className="link-cell">{m.operatorId}</td>
                  <td>{m.name}</td>
                  <td>{m.loginId}</td>
                  <td>{m.department}</td>
                  <td>{m.assignedAt}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <MiniPager page={pager.page} totalPages={pager.totalPages} onChange={pager.setPage} />

      {showPicker && (
        <OperatorPickerModal
          existingIds={editMembers.map((m) => m.operatorId)}
          onAdd={(newMembers) => { setEditMembers((prev) => [...prev, ...newMembers]); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
