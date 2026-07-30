'use client'
import { useState } from 'react'
import { type SectionItem } from '../mockData'
import AddFieldModal, { type FieldFormData } from './AddFieldModal'

interface FieldItem {
  key: string
  label: string
  fieldType: string
  required: boolean
  defaultValue: string
}

export default function FieldsTab({ section }: { section: SectionItem }) {
  const [fields, setFields] = useState<FieldItem[]>(() => getFieldsByType(section.type))
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
    alert('저장되었습니다.')
  }

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="section-title-row">
          <h2 className="section-title">필드 목록 <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>{fields.length}개</span></h2>
          <button className="btn-tool btn-tool--add" style={{ height: 30, padding: '0 12px', fontSize: 12 }} onClick={() => setShowAddField(true)}>+ 필드 추가</button>
        </div>
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
                    {f.required && <span style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700, lineHeight: '24px', textAlign: 'center' }}>필수</span>}
                    {!f.required && <span style={{ color: '#94a3b8' }}>—</span>}
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

function getFieldsByType(type: string): FieldItem[] {
  switch (type) {
    case 'BANNER': return [
      { key: 'title', label: '섹션 제목', fieldType: '텍스트', required: false, defaultValue: '' },
      { key: 'bannerImages', label: '이미지 목록', fieldType: '이미지배열', required: true, defaultValue: '' },
      { key: 'displayType', label: '노출방법', fieldType: '선택', required: true, defaultValue: 'DISPLAY_TYPE' },
      { key: 'maxCount', label: '최대 수', fieldType: '숫자', required: true, defaultValue: '10' },
    ]
    case 'PRODUCT_GRID': return [
      { key: 'title', label: '섹션 제목', fieldType: '텍스트', required: false, defaultValue: '' },
      { key: 'products', label: '상품 목록', fieldType: '상품배열', required: true, defaultValue: '' },
      { key: 'displayType', label: '노출방법', fieldType: '선택', required: true, defaultValue: 'DISPLAY_TYPE' },
      { key: 'columns', label: '열 수', fieldType: '숫자', required: true, defaultValue: '2' },
    ]
    case 'PRODUCT_CAROUSEL': return [
      { key: 'title', label: '섹션 제목', fieldType: '텍스트', required: false, defaultValue: '' },
      { key: 'products', label: '상품 목록', fieldType: '상품배열', required: true, defaultValue: '' },
      { key: 'displayType', label: '노출방법', fieldType: '선택', required: true, defaultValue: 'DISPLAY_TYPE' },
      { key: 'viewMoreLink', label: '더보기 링크', fieldType: '링크', required: false, defaultValue: '' },
    ]
    case 'TEXT': return [
      { key: 'content', label: '내용', fieldType: '텍스트', required: true, defaultValue: '' },
      { key: 'bgColor', label: '배경색', fieldType: '색상', required: false, defaultValue: '#ffffff' },
    ]
    case 'IMAGE_LINK': return [
      { key: 'image', label: '이미지', fieldType: '이미지', required: true, defaultValue: '' },
    ]
    case 'COUNTDOWN': return [
      { key: 'title', label: '제목', fieldType: '텍스트', required: true, defaultValue: '' },
      { key: 'targetAt', label: '목표 일시', fieldType: '날짜시간', required: true, defaultValue: '' },
    ]
    case 'COUPON_BAND': return [
      { key: 'title', label: '버튼 문구', fieldType: '텍스트', required: true, defaultValue: '쿠폰 받기' },
      { key: 'bgColor', label: '배경색', fieldType: '색상', required: false, defaultValue: '#1d4ed8' },
      { key: 'textColor', label: '글자색', fieldType: '색상', required: false, defaultValue: '#ffffff' },
    ]
    case 'DIVIDER': return [
      { key: 'height', label: '높이(px)', fieldType: '숫자', required: false, defaultValue: '16' },
      { key: 'color', label: '배경색', fieldType: '색상', required: false, defaultValue: '#f1f5f9' },
    ]
    default: return [
      { key: 'title', label: '제목', fieldType: '텍스트', required: true, defaultValue: '' },
    ]
  }
}
