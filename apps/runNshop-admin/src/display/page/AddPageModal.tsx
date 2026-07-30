'use client'
import { useState } from 'react'
import {
  type PageItem, type PageType, type PageStatus, type PageSection,
  PAGE_TYPE_LABEL, nextPageId, nextSectionId, getSectionLabel, getSectionColor,
} from './mockData'
import { MOCK_SECTIONS } from '../section/mockData'
import { MOCK_TEMPLATES, TEMPLATE_TYPE_LABEL, type Template, type TemplateType } from '../template/mockData'

// 활성 템플릿 목록
const TEMPLATE_OPTIONS = MOCK_TEMPLATES.filter(t => t.status === 'ACTIVE')

// ---------------------------------------------------------------------------
// AddPageModal
// ---------------------------------------------------------------------------

interface AddPageForm {
  pageName: string
  pageType: PageType
  slug: string
  status: PageStatus
  startAt: string
  endAt: string
}

const EMPTY_FORM: AddPageForm = {
  pageName: '', pageType: 'HOME', slug: '', status: 'DRAFT', startAt: '', endAt: '',
}

export default function AddPageModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (page: PageItem) => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(TEMPLATE_OPTIONS[0] || null)
  const [form, setForm] = useState<AddPageForm>(EMPTY_FORM)
  const [typeFilter, setTypeFilter] = useState<TemplateType | 'ALL'>('ALL')

  const filteredTemplates = typeFilter === 'ALL'
    ? TEMPLATE_OPTIONS
    : TEMPLATE_OPTIONS.filter(t => t.templateType === typeFilter)

  function canAdd() {
    return form.pageName.trim() !== '' && form.startAt !== '' && form.endAt !== '' && form.endAt >= form.startAt
  }

  function handleAdd() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    // 템플릿의 섹션 구성을 복사
    const sections: PageSection[] = selectedTemplate
      ? selectedTemplate.sections.map((sec, idx) => ({
          sectionId: nextSectionId(),
          sectionName: sec.sectionName,
          sectionType: sec.sectionType,
          sortOrder: idx + 1,
          visible: true,
        }))
      : []
    const page: PageItem = {
      pageId: nextPageId(),
      pageName: form.pageName.trim(),
      pageType: form.pageType,
      templateId: selectedTemplate?.templateId || '',
      templateName: selectedTemplate?.templateName || '없음',
      slug: form.slug.trim() || form.pageName.trim().toLowerCase().replace(/\s+/g, '-'),
      status: form.status,
      publishedAt: form.status === 'PUBLISHED' ? now : '',
      startAt: form.startAt.replace('T', ' '),
      endAt: form.endAt.replace('T', ' '),
      sections,
      createdBy: 'admin', createdAt: now,
      updatedBy: 'admin', updatedAt: now,
    }
    onAdd(page)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">페이지 등록</span>
            <div className="step-indicator">
              <span className={`step-indicator__dot${step === 1 ? ' step-indicator__dot--active' : ' step-indicator__dot--done'}`}>1</span>
              <span className="step-indicator__line" />
              <span className={`step-indicator__dot${step === 2 ? ' step-indicator__dot--active' : ''}`}>2</span>
              <span className="step-indicator__label">{step === 1 ? '템플릿 선택' : '기본 정보'}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">
            {step === 1 && (
              <div className="add-form__row">
                <div className="add-form__field add-form__field--full">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ margin: 0 }}>템플릿 선택</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TemplateType | 'ALL')} style={{ width: 120, height: 28, fontSize: 12 }}>
                      <option value="ALL">전체 유형</option>
                      {Object.entries(TEMPLATE_TYPE_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="template-grid" style={{ gridTemplateColumns: 'repeat(2, 250px)', minHeight: 280, maxHeight: 280, overflowY: 'auto', alignContent: 'start' }}>
                    {filteredTemplates.map((tpl) => (
                      <div
                        key={tpl.templateId}
                        className={`template-card${selectedTemplate?.templateId === tpl.templateId ? ' template-card--selected' : ''}`}
                        onClick={() => setSelectedTemplate(tpl)}
                      >
                        <div className="template-card__name">{tpl.templateName}</div>
                        <div className="template-card__desc">{tpl.sections.length}개 영역</div>
                        <div className="template-card__badges">
                          {tpl.sections.length === 0 ? (
                            <span className="badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>섹션 없음</span>
                          ) : (
                            tpl.sections.map((sec, i) => (
                              <span key={i} className="badge" style={{ background: getSectionColor(sec.sectionType), color: '#475569' }}>
                                {getSectionLabel(sec.sectionType)}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="add-form__row">
                  <div className="add-form__field add-form__field--full">
                    <label>페이지명 <span className="add-form__req">*</span></label>
                    <input type="text" value={form.pageName}
                      onChange={(e) => setForm({ ...form, pageName: e.target.value })}
                      placeholder="페이지명 입력" />
                  </div>
                </div>
                <div className="add-form__row">
                  <div className="add-form__field add-form__field--full">
                    <label>Slug</label>
                    <input type="text" value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="예) my-event-page" />
                  </div>
                </div>
                <div className="add-form__row">
                  <div className="add-form__field">
                    <label>페이지 유형</label>
                    <select value={form.pageType}
                      onChange={(e) => setForm({ ...form, pageType: e.target.value as PageType })}>
                      {Object.entries(PAGE_TYPE_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="add-form__field">
                    <label>상태</label>
                    <select value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as PageStatus })}>
                      <option value="DRAFT">미게시</option>
                      <option value="SCHEDULED">예약</option>
                      <option value="PUBLISHED">게시중</option>
                    </select>
                  </div>
                </div>
                <div className="add-form__row">
                  <div className="add-form__field">
                    <label>시작 일시 <span className="add-form__req">*</span></label>
                    <input type="datetime-local" value={form.startAt}
                      onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
                  </div>
                  <div className="add-form__field">
                    <label>종료 일시 <span className="add-form__req">*</span></label>
                    <input type="datetime-local" value={form.endAt}
                      onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <div className="add-form__footer">
              {step === 2 && (
                <button className="btn-tool btn-tool--cancel" onClick={() => setStep(1)}>이전</button>
              )}
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              {step === 1
                ? <button className="btn-tool btn-tool--add" onClick={() => setStep(2)}>다음</button>
                : <button className="btn-tool btn-tool--add" disabled={!canAdd()} onClick={handleAdd}>등록</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
