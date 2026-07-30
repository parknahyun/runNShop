'use client'
import { useState } from 'react'
import {
  type Product, type ProductImage, type ProductImageResizeType,
  PRODUCT_IMAGE_RESIZE_TYPE_LABEL, nextImageId, nextResizeId,
} from '../mockData'

// ---------------------------------------------------------------------------
// 대표이미지 리사이징 관리 팝업
// ---------------------------------------------------------------------------

function ResizeManageModal({ image, onClose, onChange }: {
  image: ProductImage
  onClose: () => void
  onChange: (resizes: ProductImage['resizes']) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [resizeType, setResizeType] = useState<ProductImageResizeType>('LIST')
  const [url, setUrl] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  function canAdd() {
    return url.trim() !== '' && Number(width) > 0 && Number(height) > 0
      && !image.resizes.some((r) => r.resizeType === resizeType)
  }

  function addResize() {
    if (!canAdd()) return
    onChange([...image.resizes, {
      resizeId: nextResizeId(), resizeType, imageUrl: url.trim(), width: Number(width), height: Number(height),
    }])
    setShowAdd(false)
    setUrl(''); setWidth(''); setHeight('')
  }

  function removeResize(resizeId: string) {
    onChange(image.resizes.filter((r) => r.resizeId !== resizeId))
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">대표이미지 리사이징 관리</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body tab-panel-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>리사이징 이미지 ({image.resizes.length}건)</span>
            <button className="btn-tool btn-tool--add" disabled={showAdd} onClick={() => setShowAdd(true)}>+ 리사이징 추가</button>
          </div>

          {image.resizes.length === 0 ? (
            <div className="table-wrap">
              <p className="state-msg">등록된 리사이징 이미지가 없습니다.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>용도</th>
                    <th>크기</th>
                    <th>이미지</th>
                    <th style={{ width: 60 }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {image.resizes.map((r) => (
                    <tr key={r.resizeId}>
                      <td style={{ fontWeight: 500 }}>{PRODUCT_IMAGE_RESIZE_TYPE_LABEL[r.resizeType]}</td>
                      <td style={{ fontSize: 12 }}>{r.width} × {r.height}</td>
                      <td><img src={r.imageUrl} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} /></td>
                      <td>
                        <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }}
                          onClick={() => removeResize(r.resizeId)}>삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showAdd && (
            <div className="add-form" style={{ padding: 0, marginTop: 12 }}>
              <div className="add-form__row">
                <div className="add-form__field">
                  <label>용도</label>
                  <select value={resizeType} onChange={(e) => setResizeType(e.target.value as ProductImageResizeType)}>
                    {Object.entries(PRODUCT_IMAGE_RESIZE_TYPE_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="add-form__field">
                  <label>너비(px) <span className="add-form__req">*</span></label>
                  <input type="number" min={1} value={width} onChange={(e) => setWidth(e.target.value)} placeholder="예) 200" />
                </div>
                <div className="add-form__field">
                  <label>높이(px) <span className="add-form__req">*</span></label>
                  <input type="number" min={1} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="예) 200" />
                </div>
              </div>
              <div className="add-form__row">
                <div className="add-form__field add-form__field--full">
                  <label>이미지 URL <span className="add-form__req">*</span></label>
                  <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                    placeholder="예) https://example.com/product/image-list.png" />
                </div>
              </div>
              {image.resizes.some((r) => r.resizeType === resizeType) && (
                <p style={{ fontSize: 12, color: '#dc2626', margin: '0 0 8px' }}>이미 등록된 용도입니다. 기존 항목을 삭제한 후 다시 추가하세요.</p>
              )}
              <div className="add-form__footer">
                <button className="btn-tool btn-tool--cancel" onClick={() => setShowAdd(false)}>취소</button>
                <button className="btn-tool btn-tool--add" disabled={!canAdd()} onClick={addResize}>추가</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ImagesTab
// ---------------------------------------------------------------------------

export default function ImagesTab({ product, onSave, readOnly = false }: {
  product: Product
  onSave: (images: ProductImage[]) => void
  readOnly?: boolean
}) {
  const [images, setImages] = useState<ProductImage[]>(product.images)
  const [showAdd, setShowAdd] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [resizeManagingId, setResizeManagingId] = useState<string | null>(null)

  const isDirty = JSON.stringify(images) !== JSON.stringify(product.images)
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
  const resizeManagingImage = images.find((i) => i.imageId === resizeManagingId) ?? null

  function addImage() {
    if (!newUrl.trim()) return
    const image: ProductImage = {
      imageId: nextImageId(),
      imageUrl: newUrl.trim(),
      sortOrder: images.length === 0 ? 1 : Math.max(...images.map((i) => i.sortOrder)) + 1,
      isMain: images.length === 0,
      resizes: [],
    }
    setImages((prev) => [...prev, image])
    setNewUrl('')
    setShowAdd(false)
  }

  function removeImage(imageId: string) {
    setImages((prev) => {
      const next = prev.filter((i) => i.imageId !== imageId)
      const removedWasMain = prev.find((i) => i.imageId === imageId)?.isMain
      if (removedWasMain && next.length > 0 && !next.some((i) => i.isMain)) {
        next[0] = { ...next[0], isMain: true }
      }
      return next
    })
  }

  function setMain(imageId: string) {
    setImages((prev) => prev.map((i) => ({ ...i, isMain: i.imageId === imageId })))
  }

  function move(imageId: string, dir: -1 | 1) {
    const list = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
    const idx = list.findIndex((i) => i.imageId === imageId)
    const swapIdx = idx + dir
    if (idx === -1 || swapIdx < 0 || swapIdx >= list.length) return
    const a = list[idx], b = list[swapIdx]
    setImages((prev) => prev.map((i) => {
      if (i.imageId === a.imageId) return { ...i, sortOrder: b.sortOrder }
      if (i.imageId === b.imageId) return { ...i, sortOrder: a.sortOrder }
      return i
    }))
  }

  function updateResizes(imageId: string, resizes: ProductImage['resizes']) {
    setImages((prev) => prev.map((i) => i.imageId === imageId ? { ...i, resizes } : i))
  }

  function handleSave() {
    onSave(images)
  }

  function handleCancel() {
    setImages(product.images)
    setShowAdd(false)
    setNewUrl('')
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>이미지 ({images.length}건)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowAdd(true)}>+ 이미지 추가</button>
      </div>

      {sorted.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 이미지가 없습니다. 상단 버튼으로 이미지를 추가하세요.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {sorted.map((img, idx) => (
            <div key={img.imageId} style={{ width: 140, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: 100, background: '#f8fafc' }}>
                <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {img.isMain && (
                  <span style={{
                    position: 'absolute', top: 4, left: 4, fontSize: 10, fontWeight: 600,
                    background: '#15803d', color: '#fff', borderRadius: 4, padding: '2px 6px',
                  }}>대표</span>
                )}
                <span style={{
                  position: 'absolute', top: 4, right: 4, fontSize: 10, fontWeight: 600,
                  background: 'rgba(15,23,42,0.65)', color: '#fff', borderRadius: 10, padding: '1px 6px',
                }}>순서 {img.sortOrder}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 6 }}>
                <button className="btn-tool" style={{ height: 22, padding: '0 6px', fontSize: 11 }}
                  disabled={readOnly || idx === 0} onClick={() => move(img.imageId, -1)}>↑</button>
                <button className="btn-tool" style={{ height: 22, padding: '0 6px', fontSize: 11 }}
                  disabled={readOnly || idx === sorted.length - 1} onClick={() => move(img.imageId, 1)}>↓</button>
                {!img.isMain && (
                  <button className="btn-tool btn-tool--toggle" style={{ height: 22, padding: '0 6px', fontSize: 11 }}
                    disabled={readOnly} onClick={() => setMain(img.imageId)}>대표설정</button>
                )}
                <button className="btn-tool btn-tool--delete" style={{ height: 22, padding: '0 6px', fontSize: 11 }}
                  disabled={readOnly} onClick={() => removeImage(img.imageId)}>삭제</button>
                {img.isMain && (
                  <button className="btn-tool btn-tool--toggle" style={{ height: 22, padding: '0 6px', fontSize: 11 }}
                    disabled={readOnly} onClick={() => setResizeManagingId(img.imageId)}>리사이징({img.resizes.length})</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0' }}>
        대표이미지는 목록형/카드형 등 화면 용도별로 별도 리사이징 이미지를 등록해둘 수 있다. 대표이미지를 변경하면 새 대표이미지에 리사이징을 다시 등록해야 한다.
      </p>

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>

      {showAdd && (
        <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={() => setShowAdd(false)}>
          <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal__header">
              <span className="detail-modal__title">이미지 추가</span>
              <button className="detail-modal__close" onClick={() => setShowAdd(false)} aria-label="닫기">✕</button>
            </div>
            <div className="detail-modal__body tab-panel-content">
              <div className="add-form" style={{ padding: 0 }}>
                <div className="add-form__row">
                  <div className="add-form__field add-form__field--full">
                    <label>이미지 URL <span className="add-form__req">*</span></label>
                    <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="예) https://example.com/product/image.png" />
                  </div>
                </div>
                <div className="add-form__footer">
                  <button className="btn-tool btn-tool--cancel" onClick={() => setShowAdd(false)}>취소</button>
                  <button className="btn-tool btn-tool--add" disabled={!newUrl.trim()} onClick={addImage}>추가</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {resizeManagingImage && (
        <ResizeManageModal
          image={resizeManagingImage}
          onClose={() => setResizeManagingId(null)}
          onChange={(resizes) => updateResizes(resizeManagingImage.imageId, resizes)}
        />
      )}
    </div>
  )
}
