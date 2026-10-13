'use client'
import { useState } from 'react'
import { type SectionItem, SECTION_STATUS_LABEL, type SectionStatus } from '../mockData'

export default function BasicInfoTab({ section }: { section: SectionItem }) {
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState<SectionStatus>(section.status)
  const [previewColor, setPreviewColor] = useState(section.previewColor)

  function handleSave() {
    alert('저장되었습니다.')
    setEditing(false)
  }

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
                <label>타입 ID <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>(변경 불가)</span></label>
                <input type="text" defaultValue={section.sectionCode} disabled style={{ background: '#f1f5f9', color: '#1e293b', fontWeight: 600 }} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>라벨 <span className="add-form__req">*</span></label>
                <input type="text" defaultValue={section.sectionName} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>설명</label>
                <input type="text" defaultValue={section.description} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>프리뷰 색상</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={previewColor} onChange={(e) => setPreviewColor(e.target.value)} style={{ width: 32, height: 32, border: '1px solid #e2e8f0', borderRadius: 4, padding: 0, cursor: 'pointer' }} />
                  <input type="text" value={previewColor} onChange={(e) => setPreviewColor(e.target.value)} style={{ width: 120 }} />
                </div>
              </div>
              <div className="add-form__field">
                <label>정렬 순서</label>
                <input type="number" defaultValue={section.sortOrder} style={{ width: 80 }} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>상태</label>
                <div className="pgm-status-radio">
                  <label className={`pgm-status-radio__item${status === 'ACTIVE' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setStatus('ACTIVE')}>
                    <input type="radio" name="status" checked={status === 'ACTIVE'} onChange={() => setStatus('ACTIVE')} />활성
                  </label>
                  <label className={`pgm-status-radio__item${status === 'INACTIVE' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setStatus('INACTIVE')}>
                    <input type="radio" name="status" checked={status === 'INACTIVE'} onChange={() => setStatus('INACTIVE')} />비활성
                  </label>
                  <label className={`pgm-status-radio__item${status === 'DEPRECATED' ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setStatus('DEPRECATED')}>
                    <input type="radio" name="status" checked={status === 'DEPRECATED'} onChange={() => setStatus('DEPRECATED')} />폐기
                  </label>
                </div>
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <div className="info-grid" style={{ marginTop: 12 }}>
            <dl className="info-dl">
              <div className="info-row"><dt>타입 ID</dt><dd style={{ fontWeight: 600 }}>{section.sectionCode}</dd></div>
              <div className="info-row"><dt>라벨</dt><dd style={{ fontWeight: 600 }}>{section.sectionName}</dd></div>
              <div className="info-row"><dt>설명</dt><dd>{section.description}</dd></div>
            </dl>
            <dl className="info-dl">
              <div className="info-row">
                <dt>프리뷰 색상</dt>
                <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 3, background: section.previewColor, border: '1px solid #e2e8f0' }} />
                  {section.previewColor}
                </dd>
              </div>
              <div className="info-row"><dt>상태</dt>
                <dd><span className="badge" data-product-status={section.status === 'ACTIVE' ? 'ON_SALE' : section.status === 'INACTIVE' ? 'DRAFT' : 'DISCONTINUED'}>{SECTION_STATUS_LABEL[section.status]}</span></dd>
              </div>
              <div className="info-row"><dt>정렬 순서</dt><dd>{section.sortOrder}</dd></div>
              <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{section.createdBy} / {section.createdAt}</dd></div>
              <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{section.updatedBy} / {section.updatedAt}</dd></div>
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}
