'use client'
import { useState } from 'react'
import {
  type Exhibition, type ExhibitionPromotion,
  PROMOTION_ITEM_TYPE_LABEL, MOCK_PROMOTION_CATALOG,
} from '../mockData'

// ---------------------------------------------------------------------------
// 프로모션 검색 팝업
// ---------------------------------------------------------------------------

function PromotionSearchModal({ existingIds, onClose, onSelect }: {
  existingIds: string[]
  onClose: () => void
  onSelect: (item: typeof MOCK_PROMOTION_CATALOG[0]) => void
}) {
  const [keyword, setKeyword] = useState('')
  const results = keyword.trim()
    ? MOCK_PROMOTION_CATALOG.filter(p => p.promotionName.includes(keyword) || p.promotionId.includes(keyword))
    : MOCK_PROMOTION_CATALOG

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">프로모션 검색</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body tab-panel-content">
          <div style={{ marginBottom: 12 }}>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
              placeholder="프로모션ID 또는 프로모션명 검색" style={{ width: '100%' }} />
          </div>
          <div className="table-wrap" style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>유형</th>
                  <th>프로모션ID</th>
                  <th>프로모션명</th>
                  <th style={{ width: 50 }}>선택</th>
                </tr>
              </thead>
              <tbody>
                {results.map((p) => {
                  const already = existingIds.includes(p.promotionId)
                  return (
                    <tr key={p.promotionId}>
                      <td><span className="badge">{PROMOTION_ITEM_TYPE_LABEL[p.promotionType]}</span></td>
                      <td style={{ fontSize: 12 }}>{p.promotionId}</td>
                      <td style={{ fontSize: 12 }}>{p.promotionName}</td>
                      <td>
                        {already
                          ? <span style={{ fontSize: 10, color: '#94a3b8' }}>추가됨</span>
                          : <button className="btn-tool btn-tool--add" style={{ fontSize: 10, padding: '2px 8px', height: 22 }} onClick={() => onSelect(p)}>추가</button>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PromotionsTab
// ---------------------------------------------------------------------------

export default function PromotionsTab({ exhibition, onSave, readOnly = false }: {
  exhibition: Exhibition
  onSave: (promotions: ExhibitionPromotion[]) => void
  readOnly?: boolean
}) {
  const [promotions, setPromotions] = useState<ExhibitionPromotion[]>(exhibition.promotions)
  const [showSearch, setShowSearch] = useState(false)

  const isDirty = JSON.stringify(promotions) !== JSON.stringify(exhibition.promotions)

  function addPromotion(p: typeof MOCK_PROMOTION_CATALOG[0]) {
    if (promotions.some(item => item.promotionId === p.promotionId)) return
    setPromotions(prev => [...prev, { ...p, sortOrder: prev.length + 1 }])
  }

  function removePromotion(promotionId: string) {
    setPromotions(prev => {
      const next = prev.filter(p => p.promotionId !== promotionId)
      next.forEach((p, i) => { p.sortOrder = i + 1 })
      return next
    })
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    setPromotions(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      next.forEach((p, i) => { p.sortOrder = i + 1 })
      return next
    })
  }

  function moveDown(idx: number) {
    setPromotions(prev => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      next.forEach((p, i) => { p.sortOrder = i + 1 })
      return next
    })
  }

  function handleSave() {
    onSave(promotions)
  }

  function handleCancel() {
    setPromotions(exhibition.promotions)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>소속 프로모션 ({promotions.length}건)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowSearch(true)}>+ 프로모션 추가</button>
      </div>

      {promotions.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 프로모션이 없습니다. 상단 버튼으로 즉시할인·쿠폰할인·수량별 할인·장바구니할인을 추가하세요.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>순서</th>
                <th>유형</th>
                <th>프로모션ID</th>
                <th>프로모션명</th>
                <th style={{ width: 120 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p, idx) => (
                <tr key={p.promotionId}>
                  <td style={{ fontSize: 12 }}>{p.sortOrder}</td>
                  <td><span className="badge">{PROMOTION_ITEM_TYPE_LABEL[p.promotionType]}</span></td>
                  <td style={{ fontSize: 12 }}>{p.promotionId}</td>
                  <td style={{ fontWeight: 500 }}>{p.promotionName}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="section-item__btn" title="위로" onClick={() => moveUp(idx)} disabled={readOnly || idx === 0}>↑</button>
                      <button className="section-item__btn" title="아래로" onClick={() => moveDown(idx)} disabled={readOnly || idx === promotions.length - 1}>↓</button>
                      <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }} disabled={readOnly} onClick={() => removePromotion(p.promotionId)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>

      {showSearch && (
        <PromotionSearchModal
          existingIds={promotions.map(p => p.promotionId)}
          onClose={() => setShowSearch(false)}
          onSelect={addPromotion}
        />
      )}
    </div>
  )
}
