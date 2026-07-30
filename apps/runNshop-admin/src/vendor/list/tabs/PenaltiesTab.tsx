'use client'
import { useState } from 'react'
import { type Vendor, type VendorPenalty } from '../mockData'

let _penaltySeq = 1000

export default function PenaltiesTab({ vendor, onSave }: {
  vendor: Vendor
  onSave: (penalties: VendorPenalty[]) => void
}) {
  const [penaltyType, setPenaltyType] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  function handleGrant() {
    const value = parseInt(amount, 10)
    if (!penaltyType.trim() || !value || value <= 0 || !reason.trim()) return
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    const entry: VendorPenalty = {
      penaltyId: `PN-${String(_penaltySeq++).padStart(4, '0')}`,
      penaltyType: penaltyType.trim(),
      amount: value,
      reason: reason.trim(),
      penaltyDate: today,
    }
    onSave([...vendor.penalties, entry])
    setPenaltyType('')
    setAmount('')
    setReason('')
  }

  return (
    <div className="tab-panel-content">
      <div className="add-form" style={{ padding: 0, marginBottom: 16 }}>
        <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: '140px 120px 1fr 100px', gap: 12 }}>
          <div className="add-form__field">
            <label>유형 <span className="add-form__req">*</span></label>
            <input type="text" placeholder="예) 배송지연" value={penaltyType}
              onChange={(e) => setPenaltyType(e.target.value)} />
          </div>
          <div className="add-form__field">
            <label>금액 <span className="add-form__req">*</span></label>
            <input type="number" placeholder="예) 50000" value={amount}
              onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="add-form__field">
            <label>사유 <span className="add-form__req">*</span></label>
            <input type="text" placeholder="부과 사유를 입력하세요" value={reason}
              onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="add-form__field" style={{ justifyContent: 'flex-end', display: 'flex' }}>
            <button className="btn-tool btn-tool--add" style={{ marginTop: 20 }}
              disabled={!penaltyType.trim() || !amount || Number(amount) <= 0 || !reason.trim()}
              onClick={handleGrant}>부과</button>
          </div>
        </div>
      </div>

      {vendor.penalties.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">부과된 패널티가 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>유형</th>
                <th>금액</th>
                <th>사유</th>
                <th>부과일</th>
              </tr>
            </thead>
            <tbody>
              {[...vendor.penalties].reverse().map((p) => (
                <tr key={p.penaltyId}>
                  <td style={{ fontSize: 12 }}>{p.penaltyType}</td>
                  <td className="amount-cell" style={{ color: '#dc2626' }}>{p.amount.toLocaleString()}원</td>
                  <td style={{ fontSize: 12 }}>{p.reason}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{p.penaltyDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
