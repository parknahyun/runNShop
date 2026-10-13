'use client'
import { useState } from 'react'

const COURIER_OPTIONS = ['CJ대한통운', '한진택배', '롯데택배', '로젠택배', '우체국택배']

interface Props {
  onSubmit: (company: string, trackingNo: string) => void
  onCancel: () => void
}

// 수거 운송장 등록 — 반품/교환 상세에서 공용으로 사용하는 인라인 폼
export function PickupForm({ onSubmit, onCancel }: Props) {
  const [company, setCompany] = useState(COURIER_OPTIONS[0])
  const [trackingNo, setTrackingNo] = useState('')

  function handleSubmit() {
    if (!trackingNo.trim()) {
      alert('운송장번호를 입력하세요.')
      return
    }
    onSubmit(company, trackingNo.trim())
  }

  return (
    <div className="add-form" style={{ padding: '14px 0 0' }}>
      <div className="add-form__row">
        <div className="add-form__field">
          <label>택배사 <span className="add-form__req">*</span></label>
          <select value={company} onChange={(e) => setCompany(e.target.value)}>
            {COURIER_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="add-form__field">
          <label>운송장번호 <span className="add-form__req">*</span></label>
          <input type="text" placeholder="운송장번호 입력" value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)} />
        </div>
      </div>
      <div className="add-form__footer">
        <button className="btn-tool btn-tool--cancel" onClick={onCancel}>취소</button>
        <button className="btn-tool btn-tool--add" onClick={handleSubmit}>등록</button>
      </div>
    </div>
  )
}
