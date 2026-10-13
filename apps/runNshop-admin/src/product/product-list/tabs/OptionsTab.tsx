'use client'
import { useState } from 'react'
import {
  type Product, type ProductOptionGroup, type ProductSku, type ProductSkuStatus,
  PRODUCT_SKU_STATUS_LABEL, getSkuCombinations, getCurrentStock, nextOptionGroupId, nextSkuId,
} from '../mockData'

const MAX_OPTION_GROUPS = 2

export default function OptionsTab({ product, onSave, readOnly = false }: {
  product: Product
  onSave: (options: ProductOptionGroup[], skus: ProductSku[]) => void
  readOnly?: boolean
}) {
  const [options, setOptions] = useState<ProductOptionGroup[]>(product.options)
  const [skus, setSkus] = useState<ProductSku[]>(product.skus)
  const [showForm, setShowForm] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [optionName, setOptionName] = useState('')
  const [optionValuesText, setOptionValuesText] = useState('')

  const isDirty = JSON.stringify(options) !== JSON.stringify(product.options)
    || JSON.stringify(skus) !== JSON.stringify(product.skus)
  const combos = getSkuCombinations(options)
  const pendingCombos = combos.filter((c) => !skus.some((s) => s.skuKey === c))
  const atMaxGroups = options.length >= MAX_OPTION_GROUPS

  function canSubmitForm() {
    return optionName.trim() !== '' && optionValuesText.split(',').map((v) => v.trim()).filter(Boolean).length > 0
  }

  function openAddForm() {
    setEditingGroupId(null)
    setOptionName('')
    setOptionValuesText('')
    setShowForm(true)
  }

  function openEditForm(group: ProductOptionGroup) {
    setEditingGroupId(group.optionGroupId)
    setOptionName(group.optionName)
    setOptionValuesText(group.optionValues.join(', '))
    setShowForm(true)
  }

  function submitForm() {
    if (!canSubmitForm()) return
    const values = optionValuesText.split(',').map((v) => v.trim()).filter(Boolean)
    if (editingGroupId) {
      setOptions((prev) => prev.map((g) => g.optionGroupId === editingGroupId
        ? { ...g, optionName: optionName.trim(), optionValues: values }
        : g))
    } else {
      if (atMaxGroups) return
      const group: ProductOptionGroup = {
        optionGroupId: nextOptionGroupId(),
        optionName: optionName.trim(),
        optionValues: values,
      }
      setOptions((prev) => [...prev, group])
    }
    setShowForm(false)
  }

  function removeGroup(optionGroupId: string) {
    setOptions((prev) => prev.filter((g) => g.optionGroupId !== optionGroupId))
  }

  function generateSkus() {
    if (pendingCombos.length === 0) return
    const created: ProductSku[] = pendingCombos.map((skuKey) => ({ skuId: nextSkuId(), skuKey, status: 'ACTIVE' }))
    setSkus((prev) => [...prev, ...created])
  }

  function updateSkuStatus(skuId: string, status: ProductSkuStatus) {
    setSkus((prev) => prev.map((s) => s.skuId === skuId ? { ...s, status } : s))
  }

  function handleSave() {
    onSave(options, skus)
  }

  function handleCancel() {
    setOptions(product.options)
    setSkus(product.skus)
    setShowForm(false)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>옵션그룹 ({options.length}/{MAX_OPTION_GROUPS}건)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly || atMaxGroups} onClick={openAddForm}>+ 옵션그룹 추가</button>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>옵션그룹은 최대 {MAX_OPTION_GROUPS}개까지 등록할 수 있습니다.</p>

      {options.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 옵션이 없습니다. 옵션이 없으면 상품 단위로 재고가 관리됩니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>옵션명</th>
                <th>옵션값</th>
                <th style={{ width: 130 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {options.map((g) => (
                <tr key={g.optionGroupId}>
                  <td style={{ fontWeight: 500 }}>{g.optionName}</td>
                  <td style={{ fontSize: 12 }}>{g.optionValues.join(', ')}</td>
                  <td>
                    <button className="btn-tool btn-tool--edit" style={{ height: 24, padding: '0 8px', fontSize: 11, marginRight: 4 }}
                      disabled={readOnly} onClick={() => openEditForm(g)}>편집</button>
                    <button className="btn-tool btn-tool--delete" style={{ height: 24, padding: '0 8px', fontSize: 11 }}
                      disabled={readOnly} onClick={() => removeGroup(g.optionGroupId)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>SKU별 현재고 ({skus.length}건)</span>
          <button className="btn-tool btn-tool--add" disabled={readOnly || pendingCombos.length === 0} onClick={generateSkus}>
            SKU생성{pendingCombos.length > 0 ? ` (${pendingCombos.length})` : ''}
          </button>
        </div>
        {skus.length === 0 ? (
          <div className="table-wrap">
            <p className="state-msg">생성된 SKU가 없습니다. "SKU생성" 버튼으로 현재 옵션조합의 SKU를 생성하세요.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>옵션조합</th>
                  <th style={{ width: 110 }}>상태</th>
                  <th style={{ width: 120 }}>현재고</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => {
                  const stock = getCurrentStock(product.stockHistories, sku.skuKey)
                  return (
                    <tr key={sku.skuId}>
                      <td style={{ fontWeight: 500 }}>{sku.skuKey}</td>
                      <td>
                        <select value={sku.status} disabled={readOnly}
                          onChange={(e) => updateSkuStatus(sku.skuId, e.target.value as ProductSkuStatus)}>
                          {Object.entries(PRODUCT_SKU_STATUS_LABEL).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ fontWeight: 600, color: stock <= 0 ? '#dc2626' : undefined }}>{stock.toLocaleString()}개</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {isDirty && (
          <p style={{ fontSize: 12, color: '#64748b', margin: '6px 0 0' }}>
            저장하지 않은 변경 사항입니다. 재고이력은 저장된 옵션조합 기준으로 쌓입니다.
          </p>
        )}
      </div>

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>

      {showForm && (
        <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={() => setShowForm(false)}>
          <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal__header">
              <span className="detail-modal__title">{editingGroupId ? '옵션그룹 편집' : '옵션그룹 추가'}</span>
              <button className="detail-modal__close" onClick={() => setShowForm(false)} aria-label="닫기">✕</button>
            </div>
            <div className="detail-modal__body tab-panel-content">
              <div className="add-form" style={{ padding: 0 }}>
                <div className="add-form__row">
                  <div className="add-form__field add-form__field--full">
                    <label>옵션명 <span className="add-form__req">*</span></label>
                    <input type="text" value={optionName} onChange={(e) => setOptionName(e.target.value)}
                      placeholder="예) 사이즈" />
                  </div>
                </div>
                <div className="add-form__row">
                  <div className="add-form__field add-form__field--full">
                    <label>옵션값 <span className="add-form__req">*</span></label>
                    <input type="text" value={optionValuesText} onChange={(e) => setOptionValuesText(e.target.value)}
                      placeholder="쉼표(,)로 구분해 입력 — 예) S, M, L" />
                  </div>
                </div>
                <div className="add-form__footer">
                  <button className="btn-tool btn-tool--cancel" onClick={() => setShowForm(false)}>취소</button>
                  <button className="btn-tool btn-tool--add" disabled={!canSubmitForm()} onClick={submitForm}>
                    {editingGroupId ? '저장' : '추가'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
