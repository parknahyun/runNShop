'use client'
import { useState } from 'react'
import { type Template, TEMPLATE_TYPE_LABEL, TEMPLATE_STATUS_LABEL } from '../mockData'

export default function BasicInfoTab({ template }: { template: Template }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>기본 정보</h2>
          {!editing && (
            <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={() => setEditing(true)}>편집</button>
          )}
        </div>

        {editing ? (
          <div className="add-form" style={{ padding: '14px 0 0' }}>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>템플릿ID <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>(변경 불가)</span></label>
                <input type="text" defaultValue={template.templateId} disabled style={{ background: '#f1f5f9', color: '#1e293b', fontWeight: 600 }} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>템플릿명 <span className="add-form__req">*</span></label>
                <input type="text" defaultValue={template.templateName} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>유형</label>
                <input type="text" defaultValue={TEMPLATE_TYPE_LABEL[template.templateType]} disabled style={{ background: '#f1f5f9' }} />
              </div>
              <div className="add-form__field">
                <label>상태</label>
                <div className="pgm-status-radio">
                  <label className={`pgm-status-radio__item${template.status === 'ACTIVE' ? ' pgm-status-radio__item--on' : ''}`}>
                    <input type="radio" name="tpl-status" defaultChecked={template.status === 'ACTIVE'} />활성
                  </label>
                  <label className={`pgm-status-radio__item${template.status === 'INACTIVE' ? ' pgm-status-radio__item--on' : ''}`}>
                    <input type="radio" name="tpl-status" defaultChecked={template.status === 'INACTIVE'} />비활성
                  </label>
                  <label className={`pgm-status-radio__item${template.status === 'DEPRECATED' ? ' pgm-status-radio__item--on' : ''}`}>
                    <input type="radio" name="tpl-status" defaultChecked={template.status === 'DEPRECATED'} />폐기
                  </label>
                </div>
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={() => { alert('저장되었습니다.'); setEditing(false) }}>저장</button>
            </div>
          </div>
        ) : (
          <div className="info-grid" style={{ marginTop: 12 }}>
            <dl className="info-dl">
              <div className="info-row"><dt>템플릿ID</dt><dd style={{ fontWeight: 600 }}>{template.templateId}</dd></div>
              <div className="info-row"><dt>템플릿명</dt><dd style={{ fontWeight: 600 }}>{template.templateName}</dd></div>
              <div className="info-row"><dt>유형</dt><dd><span className="badge">{TEMPLATE_TYPE_LABEL[template.templateType]}</span></dd></div>
            </dl>
            <dl className="info-dl">
              <div className="info-row"><dt>상태</dt>
                <dd><span className="badge" data-product-status={template.status === 'ACTIVE' ? 'ON_SALE' : 'DRAFT'}>{TEMPLATE_STATUS_LABEL[template.status]}</span></dd>
              </div>
              <div className="info-row"><dt>구성영역 수</dt><dd>{template.sectionCount}개</dd></div>
              <div className="info-row"><dt>적용 페이지 수</dt><dd>{template.usedPageCount}개</dd></div>
              <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{template.createdBy} / {template.createdAt}</dd></div>
              <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{template.updatedBy} / {template.updatedAt}</dd></div>
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}
