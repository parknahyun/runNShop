'use client'
import { useState } from 'react'
import { getGroupOptions } from '../../common/commonCode'

const FIELD_TYPES = ['이미지', '상품', '텍스트', '링크', '색상', '숫자', '날짜시간', '선택', '이미지배열', '상품배열', '텍스트배열']

export interface FieldFormData {
  key: string
  label: string
  fieldType: string
  required: boolean
  placeholder?: string
  defaultValue?: string
}

interface Props {
  onClose: () => void
  /** 편집 모드일 때 초기값 전달 */
  initialData?: FieldFormData
  /** 저장/수정 시 데이터 반환 */
  onSave?: (data: FieldFormData) => void
}

export default function AddFieldModal({ onClose, initialData, onSave }: Props) {
  const isEdit = !!initialData
  const [fieldKey, setFieldKey] = useState(initialData?.key || '')
  const [label, setLabel] = useState(initialData?.label || '')
  const [fieldType, setFieldType] = useState(initialData?.fieldType || '텍스트')
  const [required, setRequired] = useState(initialData?.required || false)
  const [placeholder, setPlaceholder] = useState(initialData?.placeholder || '')
  const [defaultValue, setDefaultValue] = useState(initialData?.defaultValue || '')

  function handleSave() {
    if (!fieldKey.trim() || !label.trim()) {
      alert('필드 키와 라벨은 필수입니다.')
      return
    }
    const data: FieldFormData = {
      key: fieldKey.trim(), label: label.trim(), fieldType, required, placeholder, defaultValue,
    }
    if (onSave) {
      onSave(data)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal" style={{ width: 520, padding: '24px 20px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
          <h2>{isEdit ? '필드 편집' : '필드 추가'}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="add-form" style={{ gap: 16, padding: '0 4px' }}>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>필드 키 <span className="add-form__req">*</span></label>
              <input type="text" value={fieldKey} onChange={(e) => setFieldKey(e.target.value)} placeholder="예) imageUrl"
                disabled={isEdit} style={isEdit ? { background: '#f1f5f9', color: '#1e293b', fontWeight: 600 } : undefined} />
            </div>
            <div className="add-form__field">
              <label>라벨 <span className="add-form__req">*</span></label>
              <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="예) 이미지 URL" />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>타입 <span className="add-form__req">*</span></label>
              <select value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
                {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="add-form__field">
              <label>입력조건</label>
              <div className="pgm-status-radio">
                <label className={`pgm-status-radio__item${required ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setRequired(true)}>
                  <input type="radio" name="field-required" checked={required} onChange={() => setRequired(true)} />필수
                </label>
                <label className={`pgm-status-radio__item${!required ? ' pgm-status-radio__item--on' : ''}`} onClick={() => setRequired(false)}>
                  <input type="radio" name="field-required" checked={!required} onChange={() => setRequired(false)} />선택
                </label>
              </div>
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>기본값</label>
              {fieldType === '선택' ? (
                <select value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}>
                  <option value="">그룹코드 선택</option>
                  {getGroupOptions().map(g => (
                    <option key={g.groupCode} value={g.groupCode}>{g.groupCode} ({g.groupName})</option>
                  ))}
                </select>
              ) : fieldType === '숫자' ? (
                <input type="number" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} placeholder="숫자 입력" />
              ) : (
                <input type="text" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} placeholder="초기 기본값" />
              )}
            </div>
            {fieldType === '텍스트' && (
              <div className="add-form__field">
                <label>플레이스홀더</label>
                <input type="text" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="입력 힌트 텍스트" />
              </div>
            )}
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleSave}>{isEdit ? '수정' : '저장'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
