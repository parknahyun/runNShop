'use client'
import { useState } from 'react'

const STEPS = [
  { key: 'basic', label: '기본정보' },
  { key: 'price', label: '가격' },
  { key: 'image', label: '이미지' },
  { key: 'detail', label: '상세소개' },
  { key: 'sku', label: 'SKU' },
  { key: 'complete', label: '완료' },
]

interface Props {
  onClose: () => void
}

export default function ProductRegister({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0)

  function handleNext() {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1)
  }

  function handlePrev() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  function handleSave() {
    alert('저장되었습니다.')
  }

  function handleSubmitReview() {
    alert('심사 요청이 완료되었습니다.')
    onClose()
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-modal__header">
          <div>
            <span className="detail-modal__title">상품 등록</span>
            <div className="step-indicator">
              {STEPS.map((step, i) => (
                <span key={step.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span className={`step-indicator__dot${i < currentStep ? ' step-indicator__dot--done' : i === currentStep ? ' step-indicator__dot--active' : ''}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </span>
                  {i < STEPS.length - 1 && <span className="step-indicator__line" />}
                </span>
              ))}
              <span className="step-indicator__label">{STEPS[currentStep].label}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="detail-modal__body" style={{ overflowY: 'auto' }}>
          <div className="tab-panel-content">
            {currentStep === 0 && <BasicInfoStep />}
            {currentStep === 1 && <PriceStep />}
            {currentStep === 2 && <ImageStep />}
            {currentStep === 3 && <DetailStep />}
            {currentStep === 4 && <SkuStep />}
            {currentStep === 5 && <CompleteStep />}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div>
            {currentStep > 0 && (
              <button className="btn-tool btn-tool--cancel" onClick={handlePrev}>← 이전</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-tool" onClick={handleSave}>임시저장</button>
            {currentStep < STEPS.length - 1 ? (
              <button className="btn-tool btn-tool--add" onClick={handleNext}>다음 →</button>
            ) : (
              <button className="btn-tool btn-tool--add" onClick={handleSubmitReview}>심사 요청</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BasicInfoStep() {
  return (
    <div className="add-form">
      <div className="add-form__row">
        <div className="add-form__field">
          <label>카테고리 <span className="add-form__req">*</span></label>
          <select><option>러닝화</option><option>러닝 의류</option><option>러닝 기어·액세서리</option><option>보충제·영양식품</option><option>웨어러블·디바이스</option></select>
        </div>
        <div className="add-form__field">
          <label>브랜드 <span className="add-form__req">*</span></label>
          <input type="text" placeholder="브랜드명" defaultValue="Nike" />
        </div>
      </div>
      <div className="add-form__row">
        <div className="add-form__field add-form__field--full">
          <label>상품명 <span className="add-form__req">*</span></label>
          <input type="text" placeholder="상품명을 입력하세요" />
        </div>
      </div>
      <div className="add-form__row">
        <div className="add-form__field">
          <label>성별</label>
          <select><option>공용</option><option>남성</option><option>여성</option></select>
        </div>
        <div className="add-form__field">
          <label>출시일</label>
          <input type="date" />
        </div>
      </div>
    </div>
  )
}

function PriceStep() {
  return (
    <div className="add-form">
      <div className="add-form__row">
        <div className="add-form__field">
          <label>정가 (소비자가) <span className="add-form__req">*</span></label>
          <input type="text" placeholder="0" style={{ textAlign: 'right' }} />
        </div>
        <div className="add-form__field">
          <label>판매가 <span className="add-form__req">*</span></label>
          <input type="text" placeholder="0" style={{ textAlign: 'right' }} />
        </div>
      </div>
      <div className="add-form__row">
        <div className="add-form__field">
          <label>공급가 <span className="add-form__req">*</span></label>
          <input type="text" placeholder="0" style={{ textAlign: 'right' }} />
        </div>
        <div className="add-form__field">
          <label>수수료율</label>
          <input type="text" value="8%" disabled style={{ textAlign: 'right', background: '#f8fafc' }} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>※ 판매가 ≤ 정가, 공급가 ≤ 판매가 조건을 만족해야 합니다.</p>
    </div>
  )
}

function ImageStep() {
  return (
    <div className="add-form">
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>상품 이미지를 등록하세요. (최대 10장, 5MB 이하)</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: '100%', aspectRatio: '1', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#94a3b8', cursor: 'pointer' }}>+</div>
        ))}
      </div>
    </div>
  )
}

function DetailStep() {
  return (
    <div className="add-form">
      <div className="add-form__field add-form__field--full">
        <label>상세 소개</label>
        <textarea rows={10} placeholder="상품 상세 소개를 입력하세요." style={{ height: 200, padding: 12, resize: 'vertical' }} />
      </div>
    </div>
  )
}

function SkuStep() {
  return (
    <div className="add-form">
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>옵션값을 입력하면 SKU가 자동 생성됩니다. (최대 2 depth: 색상 + 사이즈)</p>
      <div className="add-form__row">
        <div className="add-form__field">
          <label>옵션 1 (색상)</label>
          <input type="text" placeholder="블랙, 화이트, 레드 (쉼표 구분)" />
        </div>
        <div className="add-form__field">
          <label>옵션 2 (사이즈)</label>
          <input type="text" placeholder="250, 255, 260, 265, 270 (쉼표 구분)" />
        </div>
      </div>
      <button className="btn-tool" style={{ marginTop: 12 }} onClick={() => alert('SKU가 생성되었습니다. (10개)')}>SKU 자동 생성</button>
    </div>
  )
}

function CompleteStep() {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>✅</p>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>상품 등록 준비 완료</h2>
      <p style={{ fontSize: 14, color: '#64748b' }}>미리보기를 확인하고 심사 요청을 진행하세요.</p>
      <button className="btn-tool" style={{ marginTop: 16 }} onClick={() => alert('미리보기 (고객 화면 기준 렌더링)')}>미리보기</button>
    </div>
  )
}
