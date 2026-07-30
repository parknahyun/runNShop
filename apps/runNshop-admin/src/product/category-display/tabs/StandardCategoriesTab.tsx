'use client'
import { useState } from 'react'
import { type DisplayCategory } from '../mockData'
import {
  MOCK_STANDARD_CATEGORIES, STANDARD_CATEGORY_DEPTH_LABEL, getParentName,
} from '@/product/category-std/mockData'

export default function StandardCategoriesTab({ category, onSave, readOnly = false }: {
  category: DisplayCategory
  onSave: (standardCategoryIds: string[]) => void
  readOnly?: boolean
}) {
  const [standardCategoryIds, setStandardCategoryIds] = useState<string[]>(category.standardCategoryIds)

  const isDirty = JSON.stringify(standardCategoryIds) !== JSON.stringify(category.standardCategoryIds)

  function toggle(categoryId: string) {
    setStandardCategoryIds((prev) => prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId])
  }

  function handleSave() {
    onSave(standardCategoryIds)
  }

  function handleCancel() {
    setStandardCategoryIds(category.standardCategoryIds)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>매핑된 표준카테고리 ({standardCategoryIds.length}건 선택)</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 50 }}>선택</th>
              <th>카테고리ID</th>
              <th>구분</th>
              <th>카테고리명</th>
              <th>상위카테고리</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STANDARD_CATEGORIES.map((cat) => {
              const checked = standardCategoryIds.includes(cat.categoryId)
              return (
                <tr key={cat.categoryId} onClick={() => !readOnly && toggle(cat.categoryId)} style={{ cursor: readOnly ? 'default' : 'pointer' }}>
                  <td><input type="checkbox" checked={checked} disabled={readOnly}
                    onChange={() => toggle(cat.categoryId)} onClick={(e) => e.stopPropagation()} /></td>
                  <td style={{ fontSize: 12 }}>{cat.categoryId}</td>
                  <td style={{ fontSize: 12 }}>{STANDARD_CATEGORY_DEPTH_LABEL[cat.depth]}</td>
                  <td style={{ fontWeight: 500, paddingLeft: cat.depth > 1 ? (cat.depth - 1) * 20 : undefined }}>
                    {cat.depth > 1 && '└ '}{cat.categoryName}
                  </td>
                  <td style={{ fontSize: 12 }}>{getParentName(MOCK_STANDARD_CATEGORIES, cat.parentId)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>
    </div>
  )
}
