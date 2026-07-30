'use client'
import { useState, useEffect } from 'react'
import { type Role, type MenuPermission, DEFAULT_MENU_PERMISSIONS } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// MenuPickerModal
// ---------------------------------------------------------------------------

function MenuPickerModal({ existing, onAdd, onClose }: {
  existing: MenuPermission[]
  onAdd: (menus: MenuPermission[]) => void
  onClose: () => void
}) {
  const available = DEFAULT_MENU_PERMISSIONS.filter(
    (m) => !existing.some((e) => e.menuId === m.menuId)
  )
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(menuId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(menuId) ? next.delete(menuId) : next.add(menuId)
      return next
    })
  }

  function handleAdd() {
    const newPerms = available
      .filter((m) => selected.has(m.menuId))
      .map((m) => ({ menuId: m.menuId, menuName: m.menuName, read: true, write: false }))
    onAdd(newPerms)
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 200 }}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">프로그램 선택</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          {available.length === 0 ? (
            <p className="state-msg">추가 가능한 프로그램이 없습니다.</p>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 48, textAlign: 'center' }}>선택</th>
                      <th>프로그램</th>
                    </tr>
                  </thead>
                  <tbody>
                    {available.map((m) => (
                      <tr key={m.menuId} style={{ cursor: 'pointer' }} onClick={() => toggle(m.menuId)}>
                        <td className="op-perm-cell">
                          <input type="checkbox" checked={selected.has(m.menuId)}
                            onChange={() => toggle(m.menuId)}
                            onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td>{m.menuName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="add-form__footer" style={{ marginTop: 12 }}>
                <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={handleAdd} disabled={selected.size === 0}>
                  추가{selected.size > 0 ? ` (${selected.size})` : ''}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PermissionsTab
// ---------------------------------------------------------------------------

export default function PermissionsTab({ role, currentUser, onSave }: {
  role: Role
  currentUser: string
  onSave: (updated: Role) => void
}) {
  const [editing, setEditing]           = useState(false)
  const [editPerms, setEditPerms]       = useState<MenuPermission[]>(role.permissions)
  const [showPicker, setShowPicker]     = useState(false)

  useEffect(() => {
    if (!editing) setEditPerms(role.permissions)
  }, [role]) // eslint-disable-line react-hooks/exhaustive-deps

  const viewPager = usePager(role.permissions, 5)
  const editPager = usePager(editPerms, 10)
  const pager     = editing ? editPager : viewPager

  function toggleRead(menuId: string) {
    setEditPerms((prev) => prev.map((p) =>
      p.menuId !== menuId ? p : { ...p, read: !p.read, write: p.read ? false : p.write }
    ))
  }

  function toggleWrite(menuId: string) {
    setEditPerms((prev) => prev.map((p) =>
      p.menuId !== menuId ? p : { ...p, write: !p.write, read: !p.write ? true : p.read }
    ))
  }

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSave({ ...role, permissions: editPerms, updatedBy: currentUser, updatedAt: now })
    setEditing(false)
  }

  return (
    <div className="tab-panel-content">
      <div className="pgm-toolbar" style={{ marginBottom: 8 }}>
        {editing ? (
          <>
            <button className="btn-tool btn-tool--add"
              onClick={() => setShowPicker(true)}>+ 프로그램 추가</button>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-tool btn-tool--cancel"
                onClick={() => { setEditPerms(role.permissions); setEditing(false) }}>취소</button>
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
              <th>프로그램</th>
              <th style={{ textAlign: 'center' }}>조회</th>
              <th style={{ textAlign: 'center' }}>수정</th>
            </tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={3} className="state-msg">프로그램이 없습니다.</td></tr>
              : pager.slice.map((p) => (
                <tr key={p.menuId}>
                  <td>{p.menuName}</td>
                  <td className="op-perm-cell">
                    {editing
                      ? <input type="checkbox" checked={p.read}  onChange={() => toggleRead(p.menuId)} />
                      : p.read  ? <span className="op-perm op-perm--on">✓</span> : <span className="op-perm op-perm--off">—</span>
                    }
                  </td>
                  <td className="op-perm-cell">
                    {editing
                      ? <input type="checkbox" checked={p.write} onChange={() => toggleWrite(p.menuId)} />
                      : p.write ? <span className="op-perm op-perm--on">✓</span> : <span className="op-perm op-perm--off">—</span>
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <MiniPager page={pager.page} totalPages={pager.totalPages} onChange={pager.setPage} />

      {showPicker && (
        <MenuPickerModal
          existing={editPerms}
          onAdd={(newPerms) => { setEditPerms((prev) => [...prev, ...newPerms]); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
