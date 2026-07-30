'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import AddFieldModal, { type FieldFormData } from './tabs/AddFieldModal'
import { type SectionStatus } from './mockData'

interface FieldItem {
  key: string
  label: string
  fieldType: string
  required: boolean
  defaultValue: string
}

interface Props {
  onClose: () => void
}

/* ─── 기본정보 탭 (수정모드와 동일 폼) ─── */
function BasicInfoForm({ form, onChange }: {
  form: { sectionCode: string; sectionName: string; description: string; previewColor: string; sortOrder: number; status: SectionStatus }
  onChange: (f: typeof form) => void
}) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>기본 정보</h2>
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>타입 ID <span className="add-form__req">*</span></label>
              <input type="text" value={form.sectionCode} onChange={(e) => onChange({ ...form, sectionCode: e.target.value })} placeholder="예) HERO_BANNER (영문 대문자, _)" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>라벨 <span className="add-form__req">*</span></label>
              <input type="text" value={form.sectionName} onChange={(e) => onChange({ ...form, sectionName: e.target.value })} placeholder="예) 히어로 배너" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>설명</label>
              <input type="text" value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} placeholder="섹션 용도 설명" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>프리뷰 색상</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="color" value={form.previewColor} onChange={(e) => onChange({ ...form, previewColor: e.target.value })} style={{ width: 32, height: 32, border: '1px solid #e2e8f0', borderRadius: 4, padding: 0, cursor: 'pointer' }} />
                <input type="text" value={form.previewColor} onChange={(e) => onChange({ ...form, previewColor: e.target.value })} style={{ width: 120 }} />
              </div>
            </div>
            <div className="add-form__field">
              <label>정렬 순서</label>
              <input type="number" value={form.sortOrder} onChange={(e) => onChange({ ...form, sortOrder: Number(e.target.value) })} style={{ width: 80 }} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>상태</label>
                <div className="pgm-status-radio">
                  <label className={`pgm-status-radio__item${form.status === 'ACTIVE' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => onChange({ ...form, status: 'ACTIVE' })}>
                    <input type="radio" name="add-status" checked={form.status === 'ACTIVE'} onChange={() => onChange({ ...form, status: 'ACTIVE' })} />활성
                  </label>
                  <label className={`pgm-status-radio__item${form.status === 'INACTIVE' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => onChange({ ...form, status: 'INACTIVE' })}>
                    <input type="radio" name="add-status" checked={form.status === 'INACTIVE'} onChange={() => onChange({ ...form, status: 'INACTIVE' })} />비활성
                  </label>
                  <label className={`pgm-status-radio__item${form.status === 'DEPRECATED' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => onChange({ ...form, status: 'DEPRECATED' })}>
                    <input type="radio" name="add-status" checked={form.status === 'DEPRECATED'} onChange={() => onChange({ ...form, status: 'DEPRECATED' })} />폐기
                  </label>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─── 필드관리 탭 (상세 수정모드와 동일 구조) ─── */
function FieldsForm({ fields, setFields }: { fields: FieldItem[]; setFields: (f: FieldItem[]) => void }) {
  const [showAddField, setShowAddField] = useState(false)
  const [editingField, setEditingField] = useState<FieldFormData | null>(null)

  function moveUp(idx: number) {
    if (idx <= 0) return
    const next = [...fields]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    setFields(next)
  }

  function moveDown(idx: number) {
    if (idx >= fields.length - 1) return
    const next = [...fields]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setFields(next)
  }

  function handleDelete(idx: number) {
    setFields(fields.filter((_, i) => i !== idx))
  }

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="section-title-row">
          <h2 className="section-title">필드 목록 <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>{fields.length}개</span></h2>
          <button className="btn-tool btn-tool--add" style={{ height: 30, padding: '0 12px', fontSize: 12 }} onClick={() => setShowAddField(true)}>+ 필드 추가</button>
        </div>
        {fields.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>순서</th>
                  <th>필드 키</th>
                  <th>라벨</th>
                  <th>타입</th>
                  <th style={{ width: 70, whiteSpace: 'nowrap' }}>입력조건</th>
                  <th>기본값</th>
                  <th style={{ width: 110, whiteSpace: 'nowrap' }}>편집/삭제</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => (
                  <tr key={i}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button disabled={i === 0} onClick={() => moveUp(i)} style={{ border: 'none', background: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 14, color: i === 0 ? '#cbd5e1' : '#64748b', padding: '2px 4px' }}>↑</button>
                      <button disabled={i === fields.length - 1} onClick={() => moveDown(i)} style={{ border: 'none', background: 'none', cursor: i === fields.length - 1 ? 'not-allowed' : 'pointer', fontSize: 14, color: i === fields.length - 1 ? '#cbd5e1' : '#64748b', padding: '2px 4px' }}>↓</button>
                    </td>
                    <td><code style={{ fontSize: 12, background: '#f1f5f9', padding: '2px 6px', borderRadius: 3 }}>{f.key}</code></td>
                    <td style={{ fontWeight: 500 }}>{f.label}</td>
                    <td><span className="badge">{f.fieldType}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      {f.required ? <span style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700, lineHeight: '24px', textAlign: 'center' }}>필수</span> : <span style={{ color: '#94a3b8' }}>—</span>}
                    </td>
                    <td style={{ color: f.defaultValue ? '#1e293b' : '#94a3b8' }}>{f.defaultValue || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn-tool btn-tool--edit" style={{ height: 24, padding: '0 8px', fontSize: 11, marginRight: 4 }} onClick={() => setEditingField({ key: f.key, label: f.label, fieldType: f.fieldType, required: f.required, defaultValue: f.defaultValue })}>편집</button>
                      <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} onClick={() => handleDelete(i)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="state-msg">필드를 추가해주세요.</p>
        )}
      </section>
      {showAddField && (
        <AddFieldModal
          onClose={() => setShowAddField(false)}
          onSave={(data) => {
            setFields([...fields, { key: data.key, label: data.label, fieldType: data.fieldType, required: data.required, defaultValue: data.defaultValue || '' }])
          }}
        />
      )}
      {editingField && (
        <AddFieldModal
          initialData={editingField}
          onClose={() => setEditingField(null)}
          onSave={(data) => {
            setFields(fields.map(f => f.key === data.key ? { ...f, label: data.label, fieldType: data.fieldType, required: data.required, defaultValue: data.defaultValue || '' } : f))
          }}
        />
      )}
    </div>
  )
}

/* ─── 메인 모달 ─── */
export default function AddSectionModal({ onClose }: Props) {
  const [form, setForm] = useState({
    sectionCode: '',
    sectionName: '',
    description: '',
    previewColor: '#3b82f6',
    sortOrder: 1,
    status: 'ACTIVE' as SectionStatus,
  })
  const [fields, setFields] = useState<FieldItem[]>([])
  function handleSave() {
    if (!form.sectionCode.trim()) {
      alert('타입 ID를 입력해주세요.')
      return
    }
    if (!form.sectionName.trim()) {
      alert('라벨을 입력해주세요.')
      return
    }
    alert('저장되었습니다.')
    onClose()
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">섹션 등록</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>새 섹션을 등록합니다</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 본문 - InnerTabs */}
        <div className="detail-modal__body">
          <InnerTabs tabs={[
            { key: 'basic', label: '기본 정보', content: <BasicInfoForm form={form} onChange={setForm} /> },
            { key: 'fields', label: '필드 관리', content: <FieldsForm fields={fields} setFields={setFields} /> },
          ]} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
          <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  )
}
