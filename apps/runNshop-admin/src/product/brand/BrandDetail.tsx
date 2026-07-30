'use client'
import { useState } from 'react'
import { type Brand, type BrandStatus, BRAND_STATUS_LABEL } from './mockData'
import { BrandStatusBadge } from './BrandStatusBadge'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'

interface Draft {
  brandName: string
  brandNameEn: string
  imageUrl: string
  description: string
  status: BrandStatus
}

function toDraft(b: Brand): Draft {
  return { brandName: b.brandName, brandNameEn: b.brandNameEn, imageUrl: b.imageUrl, description: b.description, status: b.status }
}

export default function BrandDetail({ brand, currentUser, mode = 'modal', readOnly = false, onClose, onUpdate }: {
  brand: Brand
  currentUser: string
  mode?: DetailMode
  readOnly?: boolean
  onClose?: () => void
  onUpdate: (updated: Brand) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(brand))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...brand,
      brandName: draft.brandName,
      brandNameEn: draft.brandNameEn,
      imageUrl: draft.imageUrl,
      description: draft.description,
      status: draft.status,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(brand))
    setEditing(false)
  }

  return (
    <DetailShell mode={mode} size="sm" title={brand.brandName}
      meta={<span className="detail-modal__subtitle">{brand.brandId}</span>}
      onClose={onClose}>
      <div className="tab-panel-content">
        {editing ? (
          <div className="add-form" style={{ padding: 0 }}>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>브랜드명 <span className="add-form__req">*</span></label>
                <input type="text" value={draft.brandName}
                  onChange={(e) => setDraft({ ...draft, brandName: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>영문명</label>
                <input type="text" value={draft.brandNameEn}
                  onChange={(e) => setDraft({ ...draft, brandNameEn: e.target.value })} />
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>이미지 URL</label>
                <input type="text" value={draft.imageUrl}
                  onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                  placeholder="예) https://example.com/brand/nike.png" />
              </div>
              <div className="add-form__field">
                <label>상태</label>
                <select value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as BrandStatus })}>
                  {Object.entries(BRAND_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label>브랜드 소개</label>
                <textarea rows={3} value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="브랜드 소개 문구를 입력하세요" />
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
              <button className="btn-tool btn-tool--add" disabled={!draft.brandName.trim()} onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 72, height: 72, flexShrink: 0, borderRadius: 8, overflow: 'hidden',
                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc',
              }}>
                {brand.imageUrl ? (
                  <img src={brand.imageUrl} alt={brand.brandName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>이미지 없음</span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                {brand.description || <span style={{ color: '#94a3b8' }}>등록된 브랜드 소개가 없습니다.</span>}
              </p>
            </div>
            <div className="info-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <dl className="info-dl">
                <div className="info-row"><dt>브랜드ID</dt><dd style={{ fontWeight: 600 }}>{brand.brandId}</dd></div>
                <div className="info-row"><dt>브랜드명</dt><dd style={{ fontWeight: 600 }}>{brand.brandName}</dd></div>
                <div className="info-row"><dt>영문명</dt><dd>{brand.brandNameEn || '-'}</dd></div>
              </dl>
              <dl className="info-dl">
                <div className="info-row"><dt>상태</dt><dd><BrandStatusBadge status={brand.status} /></dd></div>
                <div className="info-row"><dt>등록상품수</dt><dd>{brand.productCount.toLocaleString()}건</dd></div>
                <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{brand.createdBy} / {brand.createdAt}</dd></div>
                <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{brand.updatedBy} / {brand.updatedAt}</dd></div>
              </dl>
            </div>
          </>
        )}
      </div>
    </DetailShell>
  )
}
