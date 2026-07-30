'use client'
import { useState } from 'react'
import {
  type PageItem, type PageSection,
  getSectionLabel, getSectionColor, nextSectionId,
} from '../mockData'
import { MOCK_SECTIONS } from '../../section/mockData'
import { getCodesByGroup } from '../../common/commonCode'

// 활성 섹션 목록
const SECTION_OPTIONS = MOCK_SECTIONS.filter(s => s.status === 'ACTIVE').map(s => ({
  code: s.sectionCode,
  label: s.sectionName,
  color: s.previewColor,
}))

// sectionCode → type 매핑 후 필드 목록 반환
interface FieldDef {
  key: string
  label: string
  fieldType: string
  required: boolean
  defaultValue: string
}

function getFieldsBySectionCode(sectionCode: string): FieldDef[] {
  const sectionDef = MOCK_SECTIONS.find(s => s.sectionCode === sectionCode)
  if (!sectionDef) return []
  const type = sectionDef.type
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

// ---------------------------------------------------------------------------
// 섹션 타입 선택 모달
// ---------------------------------------------------------------------------

function SectionTypePickerModal({ onClose, onSelect }: {
  onClose: () => void
  onSelect: (code: string) => void
}) {
  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <span className="detail-modal__title">섹션 선택</span>
          <button className="detail-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="detail-modal__body" style={{ padding: '16px 24px 20px' }}>
          <div className="section-type-grid">
            {SECTION_OPTIONS.map((opt) => (
              <div key={opt.code} className="section-type-card" onClick={() => onSelect(opt.code)}>
                <div className="section-type-card__dot" style={{ background: opt.color }} />
                <div>
                  <div className="section-type-card__name">{opt.label}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{opt.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionListItem
// ---------------------------------------------------------------------------

function SectionListItem({ section, selected, onSelect, onToggleVisible, onMoveUp, onMoveDown, onDelete, canUp, canDown, readOnly }: {
  section: PageSection
  selected: boolean
  onSelect: () => void
  onToggleVisible: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  canUp: boolean
  canDown: boolean
  readOnly?: boolean
}) {
  return (
    <div
      className={`section-item${selected ? ' section-item--selected' : ''}${!section.visible ? ' section-item--hidden' : ''}`}
      onClick={onSelect}
    >
      <span className="section-item__dot" style={{ background: getSectionColor(section.sectionType) }} />
      <span className="section-item__label">{section.sectionName}</span>
      <span className="section-item__type">{getSectionLabel(section.sectionType)}</span>
      <div className="section-item__actions" onClick={(e) => e.stopPropagation()}>
        {!readOnly && (
          <>
            <button
              className={`section-item__btn${!section.visible ? ' section-item__btn--vis-off' : ''}`}
              title={section.visible ? '숨김으로 전환' : '표시로 전환'}
              onClick={onToggleVisible}
            >
              {section.visible ? '👁' : '—'}
            </button>
            <button className="section-item__btn" title="위로" onClick={onMoveUp} disabled={!canUp}>↑</button>
            <button className="section-item__btn" title="아래로" onClick={onMoveDown} disabled={!canDown}>↓</button>
            <button className="section-item__btn section-item__btn--danger" title="삭제" onClick={onDelete}>×</button>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 섹션 필드 정보 (우측 패널)
// ---------------------------------------------------------------------------

function SectionFieldsPanel({ sectionCode, sectionName, onNameChange, readOnly }: {
  sectionCode: string
  sectionName: string
  onNameChange: (name: string) => void
  readOnly?: boolean
}) {
  const sectionDef = MOCK_SECTIONS.find(s => s.sectionCode === sectionCode)
  const fields = getFieldsBySectionCode(sectionCode)

  return (
    <>
      <div className="section-config-panel__body">
        {fields.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 12px' }}>
            {fields.map((f) => {
              const isFullWidth = f.fieldType === '이미지배열' || f.fieldType === '상품배열' || f.fieldType === '텍스트배열' || f.key === 'title'
              return (
                <div key={f.key} style={isFullWidth ? { gridColumn: '1 / -1' } : undefined}>
                  {(f.fieldType === '이미지배열' || f.fieldType === '상품배열' || f.fieldType === '텍스트배열') ? (
                    renderFieldInput(f, readOnly)
                  ) : (
                    <div className="add-form__field">
                      <label>
                        {f.label}
                        {f.required && <span className="add-form__req">*</span>}
                        <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>({f.fieldType})</span>
                      </label>
                      {renderFieldInput(f, readOnly)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: '#94a3b8' }}>정의된 필드가 없습니다.</p>
        )}
      </div>
    </>
  )
}

function renderFieldInput(field: FieldDef, readOnly?: boolean) {
  const disabled = readOnly

  switch (field.fieldType) {
    case '텍스트':
      return <input type="text" placeholder={`${field.label} 입력`} defaultValue={field.defaultValue} disabled={disabled} />

    case '링크':
      return <input type="url" placeholder="URL 입력 (예: /path 또는 https://...)" defaultValue={field.defaultValue} disabled={disabled} />

    case '숫자':
      return <input type="number" placeholder={field.label} defaultValue={field.defaultValue} disabled={disabled} />

    case '색상':
      return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" defaultValue={field.defaultValue || '#ffffff'} disabled={disabled}
            style={{ width: 32, height: 28, border: '1px solid #cbd5e1', borderRadius: 4, padding: 0 }} />
          <input type="text" defaultValue={field.defaultValue} placeholder="#ffffff" disabled={disabled} style={{ width: 100 }} />
        </div>
      )

    case '날짜시간':
      return <input type="datetime-local" defaultValue={field.defaultValue} disabled={disabled} />

    case '선택':
      return <SelectFieldInput groupCode={field.defaultValue} disabled={disabled} />

    case '이미지':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input type="text" placeholder="이미지 URL" disabled={disabled} />
          <input type="text" placeholder="링크 URL" disabled={disabled} />
          <input type="text" placeholder="대체 텍스트" disabled={disabled} />
          <select defaultValue="_self" disabled={disabled} style={{ width: 140 }}>
            <option value="_self">현재 창</option>
            <option value="_blank">새 창</option>
          </select>
        </div>
      )

    case '이미지배열':
      return <ImageArrayInput disabled={disabled} />

    case '상품배열':
      return <ProductArrayInput disabled={disabled} />

    case '텍스트배열':
      return <TextArrayInput disabled={disabled} />

    default:
      return <input type="text" placeholder={`${field.label} 입력`} defaultValue={field.defaultValue} disabled={disabled} />
  }
}

function SelectFieldInput({ groupCode, disabled }: { groupCode: string; disabled?: boolean }) {
  const codes = getCodesByGroup(groupCode)
  return (
    <select defaultValue={codes[0]?.code || ''} disabled={disabled}>
      {codes.length === 0 ? (
        <option value="">그룹코드 '{groupCode}' 없음</option>
      ) : (
        codes.map(c => <option key={c.code} value={c.code}>{c.label}</option>)
      )}
    </select>
  )
}

function ImageArrayInput({ disabled }: { disabled?: boolean }) {
  const [items, setItems] = useState<Array<{ id: number; imageUrl: string; linkUrl: string; altText: string; linkTarget: string }>>([
    { id: 1, imageUrl: 'https://via.placeholder.com/300x200/dbeafe/475569?text=Banner+1', linkUrl: '/event/spring', altText: '봄 세일 배너', linkTarget: '_self' },
    { id: 2, imageUrl: 'https://via.placeholder.com/300x200/dcfce7/475569?text=Banner+2', linkUrl: '/event/new-arrival', altText: '신상품 입고', linkTarget: '_self' },
    { id: 3, imageUrl: 'https://via.placeholder.com/300x200/fef9c3/475569?text=Banner+3', linkUrl: '/event/brand-week', altText: '브랜드 위크', linkTarget: '_blank' },
    { id: 4, imageUrl: 'https://via.placeholder.com/300x200/fee2e2/475569?text=Banner+4', linkUrl: '/event/flash-sale', altText: '타임세일', linkTarget: '_self' },
    { id: 5, imageUrl: 'https://via.placeholder.com/300x200/ede9fe/475569?text=Banner+5', linkUrl: '/event/member', altText: '회원 전용 혜택', linkTarget: '_self' },
    { id: 6, imageUrl: 'https://via.placeholder.com/300x200/fce7f3/475569?text=Banner+6', linkUrl: '/event/coupon', altText: '쿠폰 페스티벌', linkTarget: '_blank' },
    { id: 7, imageUrl: 'https://via.placeholder.com/300x200/e0f2fe/475569?text=Banner+7', linkUrl: '/event/summer', altText: '여름 특가', linkTarget: '_self' },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newImage, setNewImage] = useState({ imageUrl: '', linkUrl: '', altText: '', linkTarget: '_self' })

  function handleAddSave() {
    if (!newImage.imageUrl.trim()) { alert('이미지 URL을 입력하세요.'); return }
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: nextId, ...newImage }])
    setNewImage({ imageUrl: '', linkUrl: '', altText: '', linkTarget: '_self' })
    setShowAddModal(false)
  }

  function removeItem(id: number) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div>
      {/* 라벨 + 추가 버튼 동일 라인 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>이미지 목록 <span className="add-form__req">*</span> <span style={{ fontSize: 10, color: '#94a3b8' }}>({items.length}건)</span></label>
        {!disabled && (
          <button className="btn-tool btn-tool--add" style={{ fontSize: 11, padding: '2px 10px', height: 24 }} onClick={() => setShowAddModal(true)}>+ 이미지 추가</button>
        )}
      </div>

      {/* 그리드 테이블 */}
      {items.length > 0 ? (
        <div style={{ height: 180, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: 6, padding: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: 50, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.altText} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#94a3b8"/>
                    <path d="M3 16l4-4 3 3 4-5 7 6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="4" y1="20" x2="20" y2="4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>#{idx + 1} {item.altText || '미입력'}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.linkUrl || '링크 없음'}</div>
              </div>
              {!disabled && (
                <button onClick={() => removeItem(item.id)}
                  style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', lineHeight: '18px', textAlign: 'center' }}>×</button>
              )}
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>등록된 이미지가 없습니다.</p>
      )}

      {/* 이미지 추가 팝업 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal" style={{ width: 440, padding: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15 }}>이미지 추가</h2>
              <button onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="add-form" style={{ padding: 0, gap: 12 }}>
              <div className="add-form__row">
                <div className="add-form__field add-form__field--full">
                  <label>이미지 URL <span className="add-form__req">*</span></label>
                  <input type="text" value={newImage.imageUrl} onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="add-form__row">
                <div className="add-form__field add-form__field--full">
                  <label>링크 URL</label>
                  <input type="text" value={newImage.linkUrl} onChange={(e) => setNewImage({ ...newImage, linkUrl: e.target.value })} placeholder="/event/..." />
                </div>
              </div>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>대체 텍스트</label>
                  <input type="text" value={newImage.altText} onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })} placeholder="이미지 설명" />
                </div>
                <div className="add-form__field">
                  <label>링크 타겟</label>
                  <select value={newImage.linkTarget} onChange={(e) => setNewImage({ ...newImage, linkTarget: e.target.value })}>
                    <option value="_self">현재 창</option>
                    <option value="_blank">새 창</option>
                  </select>
                </div>
              </div>
              <div className="add-form__footer">
                <button className="btn-tool btn-tool--cancel" onClick={() => setShowAddModal(false)}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={handleAddSave}>저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductArrayInput({ disabled }: { disabled?: boolean }) {
  const [items, setItems] = useState([
    { id: 1, productId: 'P001', productName: '슬림 데님 팬츠', price: 59000, imageUrl: '' },
    { id: 2, productId: 'P002', productName: '오버핏 티셔츠', price: 29000, imageUrl: '' },
    { id: 3, productId: 'P003', productName: '크로스백', price: 89000, imageUrl: '' },
    { id: 4, productId: 'P004', productName: '런닝화', price: 129000, imageUrl: '' },
    { id: 5, productId: 'P005', productName: '울 코트', price: 189000, imageUrl: '' },
    { id: 6, productId: 'P006', productName: '캐주얼 후드', price: 69000, imageUrl: '' },
    { id: 7, productId: 'P007', productName: '치노 팬츠', price: 79000, imageUrl: '' },
  ])
  const [showSearch, setShowSearch] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  const MOCK_PRODUCTS = [
    { productId: 'P001', productName: '슬림 데님 팬츠', price: 59000 },
    { productId: 'P002', productName: '오버핏 티셔츠', price: 29000 },
    { productId: 'P003', productName: '크로스백', price: 89000 },
    { productId: 'P004', productName: '런닝화', price: 129000 },
    { productId: 'P005', productName: '울 코트', price: 189000 },
    { productId: 'P006', productName: '캐주얼 후드', price: 69000 },
    { productId: 'P007', productName: '치노 팬츠', price: 79000 },
    { productId: 'P008', productName: '토트백', price: 99000 },
  ]

  const searchResults = searchKeyword.trim()
    ? MOCK_PRODUCTS.filter(p => p.productName.includes(searchKeyword) || p.productId.includes(searchKeyword))
    : MOCK_PRODUCTS

  function addProduct(product: typeof MOCK_PRODUCTS[0]) {
    if (items.some(i => i.productId === product.productId)) return
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: nextId, ...product, imageUrl: '' }])
  }

  function removeItem(id: number) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div>
      {/* 라벨 + 추가 버튼 동일 라인 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>상품 목록 <span className="add-form__req">*</span> <span style={{ fontSize: 10, color: '#94a3b8' }}>({items.length}건)</span></label>
        {!disabled && (
          <button className="btn-tool btn-tool--add" style={{ fontSize: 11, padding: '2px 10px', height: 24 }} onClick={() => setShowSearch(true)}>+ 상품 추가</button>
        )}
      </div>

      {/* 그리드 테이블 */}
      {items.length > 0 ? (
        <div style={{ height: 180, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: 6, padding: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: 50, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20 }}>🛍</span>
              </div>
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>#{idx + 1} {item.productName}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{item.productId} · {item.price.toLocaleString()}원</div>
              </div>
              {!disabled && (
                <button onClick={() => removeItem(item.id)}
                  style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', lineHeight: '18px', textAlign: 'center' }}>×</button>
              )}
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>등록된 상품이 없습니다.</p>
      )}

      {/* 상품 검색 팝업 */}
      {showSearch && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal" style={{ width: 480, padding: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15 }}>상품 검색</h2>
              <button onClick={() => setShowSearch(false)}>✕</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="상품ID 또는 상품명 검색" style={{ width: '100%' }} />
            </div>
            <div className="table-wrap" style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 12 }}>
              <table>
                <thead>
                  <tr>
                    <th>상품ID</th>
                    <th>상품명</th>
                    <th>가격</th>
                    <th style={{ width: 50 }}>선택</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((p) => {
                    const already = items.some(i => i.productId === p.productId)
                    return (
                      <tr key={p.productId}>
                        <td style={{ fontSize: 12 }}>{p.productId}</td>
                        <td style={{ fontSize: 12 }}>{p.productName}</td>
                        <td style={{ fontSize: 12 }}>{p.price.toLocaleString()}원</td>
                        <td>
                          {already
                            ? <span style={{ fontSize: 10, color: '#94a3b8' }}>추가됨</span>
                            : <button className="btn-tool btn-tool--add" style={{ fontSize: 10, padding: '2px 8px', height: 22 }} onClick={() => addProduct(p)}>추가</button>
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => setShowSearch(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TextArrayInput({ disabled }: { disabled?: boolean }) {
  const [items, setItems] = useState([{ id: 1, text: '' }])

  function addItem() {
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: nextId, text: '' }])
  }

  function removeItem(id: number) {
    if (items.length <= 1) return
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, idx) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', minWidth: 20 }}>#{idx + 1}</span>
          <input type="text" placeholder="텍스트 입력" disabled={disabled} defaultValue={item.text} style={{ flex: 1 }} />
          {!disabled && items.length > 1 && (
            <button className="btn-tool btn-tool--cancel" style={{ fontSize: 10, padding: '1px 6px' }} onClick={() => removeItem(item.id)}>삭제</button>
          )}
        </div>
      ))}
      {!disabled && (
        <button className="btn-tool btn-tool--toggle" style={{ width: '100%' }} onClick={addItem}>+ 텍스트 추가</button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionsTab — 좌: 섹션 목록, 우: 선택된 섹션 필드 정보
// ---------------------------------------------------------------------------

export default function SectionsTab({ eventPage, onSave, readOnly = false }: {
  eventPage: PageItem
  onSave: (sections: PageSection[]) => void
  readOnly?: boolean
}) {
  const [sections, setSections] = useState<PageSection[]>(eventPage.sections)
  const [selectedId, setSelectedId] = useState<string | null>(
    eventPage.sections.length > 0 ? eventPage.sections[0].sectionId : null
  )
  const [showTypePicker, setShowTypePicker] = useState(false)

  const isDirty = JSON.stringify(sections) !== JSON.stringify(eventPage.sections)
  const selectedSection = sections.find((s) => s.sectionId === selectedId) ?? null

  function toggleVisible(id: string) {
    setSections((prev) => prev.map((s) => s.sectionId === id ? { ...s, visible: !s.visible } : s))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    setSections((prev) => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      next.forEach((s, i) => { s.sortOrder = i + 1 })
      return next
    })
  }

  function moveDown(idx: number) {
    setSections((prev) => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      next.forEach((s, i) => { s.sortOrder = i + 1 })
      return next
    })
  }

  function deleteSection(id: string) {
    setSections((prev) => {
      const next = prev.filter((s) => s.sectionId !== id)
      next.forEach((s, i) => { s.sortOrder = i + 1 })
      if (selectedId === id) {
        setSelectedId(next.length > 0 ? next[0].sectionId : null)
      }
      return next
    })
  }

  function addSection(code: string) {
    const opt = SECTION_OPTIONS.find(o => o.code === code)
    const count = sections.filter(s => s.sectionType === code).length + 1
    const newSection: PageSection = {
      sectionId: nextSectionId(),
      sectionName: `${opt?.label || code}_${count}`,
      sectionType: code,
      sortOrder: sections.length + 1,
      visible: true,
    }
    setSections((prev) => [...prev, newSection])
    setSelectedId(newSection.sectionId)
    setShowTypePicker(false)
  }

  function handleNameChange(name: string) {
    if (!selectedId) return
    setSections((prev) => prev.map((s) => s.sectionId === selectedId ? { ...s, sectionName: name } : s))
  }

  function handleSave() {
    onSave(sections)
  }

  function handleCancel() {
    setSections(eventPage.sections)
    setSelectedId(eventPage.sections.length > 0 ? eventPage.sections[0].sectionId : null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="section-editor">
        {/* 좌측: 섹션 목록 */}
        <div className="section-list-panel">
          <div className="section-list-panel__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>섹션 목록 ({sections.length})</span>
            {!readOnly && (
              <button className="btn-tool btn-tool--add" style={{ fontSize: 11, padding: '2px 10px', height: 22 }}
                onClick={() => setShowTypePicker(true)}>+ 섹션 추가</button>
            )}
          </div>
          <div className="section-list-panel__body">
            {sections.length === 0 ? (
              <p className="state-msg" style={{ padding: '24px 16px', fontSize: 12 }}>
                섹션이 없습니다. 아래 버튼으로 추가하세요.
              </p>
            ) : (
              sections.map((sec, idx) => (
                <SectionListItem
                  key={sec.sectionId}
                  section={sec}
                  selected={selectedId === sec.sectionId}
                  onSelect={() => setSelectedId(sec.sectionId)}
                  onToggleVisible={() => toggleVisible(sec.sectionId)}
                  onMoveUp={() => moveUp(idx)}
                  onMoveDown={() => moveDown(idx)}
                  onDelete={() => deleteSection(sec.sectionId)}
                  canUp={idx > 0}
                  canDown={idx < sections.length - 1}
                  readOnly={readOnly}
                />
              ))
            )}
          </div>
        </div>

        {/* 우측: 선택된 섹션 필드 정보 */}
        <div className="section-config-panel">
          {selectedSection ? (
            <SectionFieldsPanel
              sectionCode={selectedSection.sectionType}
              sectionName={selectedSection.sectionName}
              onNameChange={handleNameChange}
              readOnly={readOnly}
            />
          ) : (
            <div className="section-config-panel__empty">
              ← 섹션을 선택하세요
            </div>
          )}
        </div>
      </div>

      {/* 하단 footer */}
      {!readOnly && (
        <div className="section-editor-footer">
          <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
          <button className="btn-tool btn-tool--add" disabled={!isDirty} onClick={handleSave}>
            저장
          </button>
        </div>
      )}

      {showTypePicker && (
        <SectionTypePickerModal
          onClose={() => setShowTypePicker(false)}
          onSelect={addSection}
        />
      )}
    </div>
  )
}
