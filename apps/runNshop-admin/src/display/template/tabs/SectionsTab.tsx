'use client'
import { useState } from 'react'
import { type Template } from '../mockData'
import { MOCK_SECTIONS } from '../../section/mockData'

// 섹션 목록에서 sectionCode와 sectionName을 가져옴
const SECTION_OPTIONS = MOCK_SECTIONS.filter(s => s.status === 'ACTIVE').map(s => ({
  code: s.sectionCode,
  label: s.sectionName,
}))

export default function SectionsTab({ template }: { template: Template }) {
  const [sections, setSections] = useState([...template.sections])
  const [showAdd, setShowAdd] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('')
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState(SECTION_OPTIONS[0]?.code || '')

  const hasActivePages = false // 제약 해제: 페이지는 템플릿을 복사하므로 항상 수정 가능

  function moveUp(idx: number) {
    if (idx <= 0) return
    const next = [...sections]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    next.forEach((s, i) => { s.sortOrder = i + 1 })
    setSections(next)
  }

  function moveDown(idx: number) {
    if (idx >= sections.length - 1) return
    const next = [...sections]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    next.forEach((s, i) => { s.sortOrder = i + 1 })
    setSections(next)
  }

  function handleDelete(idx: number) {
    const next = sections.filter((_, i) => i !== idx)
    next.forEach((s, i) => { s.sortOrder = i + 1 })
    setSections(next)
  }

  function handleEdit(idx: number) {
    setEditIdx(idx)
    setEditName(sections[idx].sectionName)
    setEditType(sections[idx].sectionType)
  }

  function handleEditSave() {
    if (editIdx === null) return
    if (!editName.trim()) { alert('영역명을 입력해주세요.'); return }
    const next = [...sections]
    next[editIdx] = { ...next[editIdx], sectionName: editName.trim(), sectionType: editType }
    setSections(next)
    setEditIdx(null)
  }

  function handleAdd() {
    if (!newName.trim()) { alert('영역명을 입력해주세요.'); return }
    setSections([...sections, { sectionName: newName.trim(), sectionType: newType, sortOrder: sections.length + 1 }])
    setNewName('')
    setNewType('BANNER')
    setShowAdd(false)
  }

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="section-title-row">
          <h2 className="section-title">영역 목록 <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>{sections.length}개</span></h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn-tool btn-tool--add" style={{ height: 30, padding: '0 12px', fontSize: 12 }} onClick={() => setShowAdd(true)}>+ 영역 추가</button>
          </div>
        </div>
        {sections.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>순서</th>
                  <th>섹션</th>
                  <th>영역명</th>
                  <th style={{ width: 110 }}>편집/삭제</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((sec, i) => (
                  <tr key={i}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button disabled={hasActivePages || i === 0} onClick={() => moveUp(i)} style={{ border: 'none', background: 'none', cursor: (hasActivePages || i === 0) ? 'not-allowed' : 'pointer', fontSize: 14, color: (hasActivePages || i === 0) ? '#cbd5e1' : '#64748b', padding: '2px 4px' }}>↑</button>
                      <button disabled={hasActivePages || i === sections.length - 1} onClick={() => moveDown(i)} style={{ border: 'none', background: 'none', cursor: (hasActivePages || i === sections.length - 1) ? 'not-allowed' : 'pointer', fontSize: 14, color: (hasActivePages || i === sections.length - 1) ? '#cbd5e1' : '#64748b', padding: '2px 4px' }}>↓</button>
                    </td>
                    <td><span className="badge" style={{ fontSize: 10 }}>{sec.sectionType}</span></td>
                    <td style={{ fontWeight: 500 }}>
                      {sec.sectionName}
                      {(() => {
                        const def = MOCK_SECTIONS.find(s => s.sectionCode === sec.sectionType)
                        const desc = def?.description || ''
                        return desc ? <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>{desc.slice(0, 20)}</span> : null
                      })()}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn-tool btn-tool--edit" style={{ height: 24, padding: '0 8px', fontSize: 11, marginRight: 4 }} onClick={() => handleEdit(i)} disabled={hasActivePages}>편집</button>
                      <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} onClick={() => handleDelete(i)} disabled={hasActivePages}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="state-msg">등록된 영역이 없습니다.</p>
        )}
      </section>

      {showAdd && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal" style={{ width: 420, padding: '24px 20px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
              <h2>영역 추가</h2>
              <button onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="add-form" style={{ gap: 16, padding: '0 4px' }}>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>섹션 <span className="add-form__req">*</span></label>
                  <select value={newType} onChange={(e) => {
                    const code = e.target.value
                    setNewType(code)
                    const opt = SECTION_OPTIONS.find(o => o.code === code)
                    const count = sections.filter(s => s.sectionType === code).length + 1
                    setNewName(`${opt?.label || code}_${count}`)
                  }}>
                    {SECTION_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.code}</option>)}
                  </select>
                </div>
                <div className="add-form__field">
                  <label>영역명 <span className="add-form__req">*</span></label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="예) 메인 배너" />
                </div>
              </div>
              <div className="add-form__footer">
                <button className="btn-tool btn-tool--cancel" onClick={() => setShowAdd(false)}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={handleAdd}>추가</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editIdx !== null && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal" style={{ width: 420, padding: '24px 20px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
              <h2>영역 편집</h2>
              <button onClick={() => setEditIdx(null)}>✕</button>
            </div>
            <div className="add-form" style={{ gap: 16, padding: '0 4px' }}>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>섹션 <span className="add-form__req">*</span></label>
                  <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                    {SECTION_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.code}</option>)}
                  </select>
                </div>
                <div className="add-form__field">
                  <label>영역명 <span className="add-form__req">*</span></label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
              </div>
              <div className="add-form__footer">
                <button className="btn-tool btn-tool--cancel" onClick={() => setEditIdx(null)}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={handleEditSave}>수정</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
