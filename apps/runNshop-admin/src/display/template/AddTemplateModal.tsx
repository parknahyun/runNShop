'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import {
  type TemplateType, type TemplateStatus, type TemplateSection, type Template,
  TEMPLATE_TYPE_LABEL, MOCK_TEMPLATES,
} from './mockData'
import { MOCK_SECTIONS } from '../section/mockData'
import { getSectionLabel, getSectionColor } from '../page/mockData'

// 활성 템플릿 목록
const ACTIVE_TEMPLATES = MOCK_TEMPLATES.filter(t => t.status === 'ACTIVE')

// 섹션 옵션
const SECTION_OPTIONS = MOCK_SECTIONS.filter(s => s.status === 'ACTIVE').map(s => ({
  code: s.sectionCode,
  label: s.sectionName,
}))

interface Props {
  onClose: () => void
}

/* ─── 기본정보 탭 ─── */
function BasicInfoForm({ form, onChange }: {
  form: { templateId: string; templateName: string; templateType: TemplateType; status: TemplateStatus }
  onChange: (f: typeof form) => void
}) {
  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>기본 정보</h2>
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>템플릿ID <span className="add-form__req">*</span></label>
              <input type="text" value={form.templateId} onChange={(e) => onChange({ ...form, templateId: e.target.value })} placeholder="예) TPL-009" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>템플릿명 <span className="add-form__req">*</span></label>
              <input type="text" value={form.templateName} onChange={(e) => onChange({ ...form, templateName: e.target.value })} placeholder="예) 신규 이벤트 템플릿" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>유형 <span className="add-form__req">*</span></label>
              <select value={form.templateType} onChange={(e) => onChange({ ...form, templateType: e.target.value as TemplateType })}>
                {Object.entries(TEMPLATE_TYPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="add-form__field">
              <label>상태</label>
              <div className="pgm-status-radio">
                <label className={`pgm-status-radio__item${form.status === 'ACTIVE' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => onChange({ ...form, status: 'ACTIVE' })}>
                  <input type="radio" name="add-tpl-status" checked={form.status === 'ACTIVE'} onChange={() => onChange({ ...form, status: 'ACTIVE' })} />활성
                </label>
                <label className={`pgm-status-radio__item${form.status === 'INACTIVE' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => onChange({ ...form, status: 'INACTIVE' })}>
                  <input type="radio" name="add-tpl-status" checked={form.status === 'INACTIVE'} onChange={() => onChange({ ...form, status: 'INACTIVE' })} />비활성
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─── 영역 목록 탭 ─── */
function SectionsForm({ sections, setSections }: { sections: TemplateSection[]; setSections: (s: TemplateSection[]) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState(SECTION_OPTIONS[0]?.code || '')

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

  function handleAdd() {
    if (!newName.trim()) { alert('영역명을 입력해주세요.'); return }
    setSections([...sections, { sectionName: newName.trim(), sectionType: newType, sortOrder: sections.length + 1 }])
    setNewName('')
    setShowAdd(false)
  }

  function handleDelete(idx: number) {
    const next = sections.filter((_, i) => i !== idx)
    next.forEach((s, i) => { s.sortOrder = i + 1 })
    setSections(next)
  }

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="section-title-row">
          <h2 className="section-title">영역 목록 <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>{sections.length}개</span></h2>
          <button className="btn-tool btn-tool--add" style={{ height: 30, padding: '0 12px', fontSize: 12 }} onClick={() => setShowAdd(true)}>+ 영역 추가</button>
        </div>
        {sections.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>순서</th>
                  <th>섹션</th>
                  <th>영역명</th>
                  <th style={{ width: 80 }}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((sec, i) => (
                  <tr key={i}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button disabled={i === 0} onClick={() => moveUp(i)} style={{ border: 'none', background: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 14, color: i === 0 ? '#cbd5e1' : '#64748b', padding: '2px 4px' }}>↑</button>
                      <button disabled={i === sections.length - 1} onClick={() => moveDown(i)} style={{ border: 'none', background: 'none', cursor: i === sections.length - 1 ? 'not-allowed' : 'pointer', fontSize: 14, color: i === sections.length - 1 ? '#cbd5e1' : '#64748b', padding: '2px 4px' }}>↓</button>
                    </td>
                    <td><span className="badge">{sec.sectionType}</span></td>
                    <td style={{ fontWeight: 500 }}>{sec.sectionName}</td>
                    <td>
                      <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} onClick={() => handleDelete(i)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="state-msg">영역을 추가해주세요.</p>
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
    </div>
  )
}

/* ─── 메인 모달 (2-Step) ─── */
export default function AddTemplateModal({ onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [typeFilter, setTypeFilter] = useState<TemplateType | 'ALL'>('ALL')
  const [selectedBase, setSelectedBase] = useState<Template | null>(null)

  const [form, setForm] = useState({
    templateId: '',
    templateName: '',
    templateType: 'HOME' as TemplateType,
    status: 'ACTIVE' as TemplateStatus,
  })
  const [sections, setSections] = useState<TemplateSection[]>([])

  const filteredTemplates = typeFilter === 'ALL'
    ? ACTIVE_TEMPLATES
    : ACTIVE_TEMPLATES.filter(t => t.templateType === typeFilter)

  function handleSelectBase(tpl: Template) {
    setSelectedBase(tpl)
  }

  function handleNext() {
    // 선택한 템플릿 기반으로 기본값 설정
    if (selectedBase) {
      setForm({
        ...form,
        templateType: selectedBase.templateType,
        templateName: `${selectedBase.templateName} (복사)`,
      })
      setSections([...selectedBase.sections])
    }
    setStep(2)
  }

  function handleSkip() {
    // 빈 상태로 시작
    setSelectedBase(null)
    setSections([])
    setStep(2)
  }

  function handleSave() {
    if (!form.templateId.trim()) { alert('템플릿ID를 입력해주세요.'); return }
    if (!form.templateName.trim()) { alert('템플릿명을 입력해주세요.'); return }
    alert('저장되었습니다.')
    onClose()
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">템플릿 추가</span>
            <div className="step-indicator" style={{ marginTop: 6 }}>
              <span className={`step-indicator__dot${step === 1 ? ' step-indicator__dot--active' : ' step-indicator__dot--done'}`}>1</span>
              <span className="step-indicator__line" />
              <span className={`step-indicator__dot${step === 2 ? ' step-indicator__dot--active' : ''}`}>2</span>
              <span className="step-indicator__label">{step === 1 ? '기존 템플릿 선택' : '상세 설정'}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 본문 */}
        <div className="detail-modal__body">
          {step === 1 && (
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <label style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>기존 템플릿 선택 (복사 기반)</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TemplateType | 'ALL')} style={{ width: 120, height: 28, fontSize: 12 }}>
                  <option value="ALL">전체 유형</option>
                  {Object.entries(TEMPLATE_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="template-grid" style={{ flex: 1, overflowY: 'auto', alignContent: 'start' }}>
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.templateId}
                    className={`template-card${selectedBase?.templateId === tpl.templateId ? ' template-card--selected' : ''}`}
                    onClick={() => handleSelectBase(tpl)}
                  >
                    <div className="template-card__name">{tpl.templateName}</div>
                    <div className="template-card__desc">{TEMPLATE_TYPE_LABEL[tpl.templateType]} · {tpl.sections.length}개 영역</div>
                    <div className="template-card__badges">
                      {tpl.sections.length === 0 ? (
                        <span className="badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>섹션 없음</span>
                      ) : (
                        tpl.sections.slice(0, 4).map((sec, i) => (
                          <span key={i} className="badge" style={{ background: getSectionColor(sec.sectionType), color: '#475569' }}>
                            {getSectionLabel(sec.sectionType)}
                          </span>
                        ))
                      )}
                      {tpl.sections.length > 4 && <span className="badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>+{tpl.sections.length - 4}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <InnerTabs tabs={[
              { key: 'basic', label: '기본 정보', content: <BasicInfoForm form={form} onChange={setForm} /> },
              { key: 'sections', label: '영역 목록', content: <SectionsForm sections={sections} setSections={setSections} /> },
            ]} />
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          {step === 1 && (
            <>
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--toggle" onClick={handleSkip}>빈 템플릿으로 시작</button>
              <button className="btn-tool btn-tool--add" disabled={!selectedBase} onClick={handleNext}>다음</button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="btn-tool btn-tool--cancel" onClick={() => setStep(1)}>이전</button>
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
