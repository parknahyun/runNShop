'use client'
import { useState } from 'react'
import { type BatchJob, type BatchJobParam } from '../mockData'

export default function ParamTab({ job, currentUser, onUpdate }: {
  job: BatchJob
  currentUser: string
  onUpdate: (updated: BatchJob) => void
}) {
  const [editing, setEditing]       = useState(false)
  const [editParams, setEditParams] = useState<BatchJobParam[]>([])

  const displayParams = editing ? editParams : job.params

  function startEdit() { setEditParams(job.params.map((p) => ({ ...p }))); setEditing(true) }
  function handleCancel() { setEditing(false); setEditParams([]) }

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onUpdate({ ...job, params: editParams, updatedBy: currentUser, updatedAt: now })
    setEditing(false)
    setEditParams([])
  }

  function addParam() { setEditParams((prev) => [...prev, { key: '', description: '' }]) }

  function updateParam(idx: number, field: keyof BatchJobParam, val: string) {
    setEditParams((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p))
  }

  function deleteParam(idx: number) { setEditParams((prev) => prev.filter((_, i) => i !== idx)) }

  const colSpan = editing ? 3 : 2

  return (
    <div className="tab-panel-content">
      <div className="pgm-toolbar" style={{ marginBottom: 8 }}>
        {editing ? (
          <>
            <button className="btn-tool btn-tool--add" onClick={addParam}>+ 파라미터 추가</button>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
              <button className="btn-tool btn-tool--add"    onClick={handleSave}>저장</button>
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
              <th>파라미터 키</th>
              <th>설명</th>
              {editing && <th style={{ width: 56 }} />}
            </tr>
          </thead>
          <tbody>
            {displayParams.length === 0
              ? <tr><td colSpan={colSpan} className="state-msg">등록된 파라미터가 없습니다.</td></tr>
              : displayParams.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    {editing
                      ? <input className="cc-inline-input" value={p.key}
                          onChange={(e) => updateParam(idx, 'key', e.target.value)} />
                      : <code style={{ fontSize: 12 }}>{p.key}</code>}
                  </td>
                  <td>
                    {editing
                      ? <input className="cc-inline-input" value={p.description}
                          onChange={(e) => updateParam(idx, 'description', e.target.value)} />
                      : <span style={{ color: '#64748b', fontSize: 12 }}>{p.description}</span>}
                  </td>
                  {editing && (
                    <td className="op-perm-cell">
                      <button className="btn-tool btn-tool--delete"
                        style={{ height: 24, padding: '0 8px', fontSize: 11 }}
                        onClick={() => deleteParam(idx)}>삭제</button>
                    </td>
                  )}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
