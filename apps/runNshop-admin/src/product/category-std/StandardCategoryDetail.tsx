'use client'
import { useState } from 'react'
import {
  type StandardCategory, type StandardCategoryStatus,
  STANDARD_CATEGORY_STATUS_LABEL, STANDARD_CATEGORY_DEPTH_LABEL,
  getParentName, getParentCandidates,
} from './mockData'
import { StandardCategoryStatusBadge } from './StandardCategoryStatusBadge'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'

interface Draft {
  categoryName: string
  parentId: string
  sortOrder: string
  status: StandardCategoryStatus
}

function toDraft(c: StandardCategory): Draft {
  return { categoryName: c.categoryName, parentId: c.parentId ?? '', sortOrder: String(c.sortOrder), status: c.status }
}

export default function StandardCategoryDetail({ category, categories, currentUser, mode = 'modal', readOnly = false, onClose, onUpdate }: {
  category: StandardCategory
  categories: StandardCategory[]
  currentUser: string
  mode?: DetailMode
  readOnly?: boolean
  onClose?: () => void
  onUpdate: (updated: StandardCategory) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(category))
  const parentCandidates = getParentCandidates(categories, category.depth).filter((c) => c.categoryId !== category.categoryId)

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...category,
      categoryName: draft.categoryName,
      parentId: category.depth === 1 ? null : draft.parentId,
      sortOrder: Number(draft.sortOrder) || 1,
      status: draft.status,
      updatedBy: currentUser,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(category))
    setEditing(false)
  }

  return (
    <DetailShell mode={mode} size="sm" title={category.categoryName}
      meta={<span className="detail-modal__subtitle">{category.categoryId}</span>}
      onClose={onClose}>
      <div className="tab-panel-content">
        {editing ? (
          <div className="add-form" style={{ padding: 0 }}>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>카테고리명 <span className="add-form__req">*</span></label>
                <input type="text" value={draft.categoryName}
                  onChange={(e) => setDraft({ ...draft, categoryName: e.target.value })} />
              </div>
              <div className="add-form__field">
                <label>노출순서</label>
                <input type="number" min={1} value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })} />
              </div>
            </div>
            {category.depth !== 1 && (
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>상위카테고리 <span className="add-form__req">*</span></label>
                  <select value={draft.parentId}
                    onChange={(e) => setDraft({ ...draft, parentId: e.target.value })}>
                    {parentCandidates.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="add-form__row">
              <div className="add-form__field">
                <label>상태</label>
                <select value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as StandardCategoryStatus })}>
                  {Object.entries(STANDARD_CATEGORY_STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
              <button className="btn-tool btn-tool--add"
                disabled={!draft.categoryName.trim() || (category.depth !== 1 && !draft.parentId)}
                onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
            </div>
            <div className="info-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <dl className="info-dl">
                <div className="info-row"><dt>카테고리ID</dt><dd style={{ fontWeight: 600 }}>{category.categoryId}</dd></div>
                <div className="info-row"><dt>카테고리명</dt><dd style={{ fontWeight: 600 }}>{category.categoryName}</dd></div>
                <div className="info-row"><dt>구분</dt><dd>{STANDARD_CATEGORY_DEPTH_LABEL[category.depth]}</dd></div>
                <div className="info-row"><dt>상위카테고리</dt><dd>{getParentName(categories, category.parentId)}</dd></div>
              </dl>
              <dl className="info-dl">
                <div className="info-row"><dt>노출순서</dt><dd>{category.sortOrder}</dd></div>
                <div className="info-row"><dt>상태</dt><dd><StandardCategoryStatusBadge status={category.status} /></dd></div>
                <div className="info-row"><dt>최초등록</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{category.createdBy} / {category.createdAt}</dd></div>
                <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{category.updatedBy} / {category.updatedAt}</dd></div>
              </dl>
            </div>
          </>
        )}
      </div>
    </DetailShell>
  )
}
