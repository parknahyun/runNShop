'use client'
import { useState } from 'react'
import { type Member, type MemberPointEntry, MEMBER_POINT_TYPE_LABEL } from '../mockData'

let _pointSeq = 1000

export default function PointsTab({ member, currentUser, onSave }: {
  member: Member
  currentUser: string
  onSave: (points: MemberPointEntry[], pointBalance: number) => void
}) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  function handleGrant() {
    const value = parseInt(amount, 10)
    if (!value || value <= 0 || !reason.trim()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const balanceAfter = member.pointBalance + value
    const entry: MemberPointEntry = {
      pointId: `PT-${String(_pointSeq++).padStart(4, '0')}`,
      type: 'EARN',
      amount: value,
      balanceAfter,
      reason: `${reason.trim()} (${currentUser} 수동지급)`,
      createdAt: now,
    }
    onSave([...member.points, entry], balanceAfter)
    setAmount('')
    setReason('')
  }

  return (
    <div className="tab-panel-content">
      <div className="add-form" style={{ padding: 0, marginBottom: 16 }}>
        <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px', gap: 12 }}>
          <div className="add-form__field">
            <label>지급 포인트</label>
            <input type="number" placeholder="예) 1000" value={amount}
              onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="add-form__field">
            <label>지급 사유 <span className="add-form__req">*</span></label>
            <input type="text" placeholder="지급 사유를 입력하세요" value={reason}
              onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="add-form__field" style={{ justifyContent: 'flex-end', display: 'flex' }}>
            <button className="btn-tool btn-tool--add" style={{ marginTop: 20 }}
              disabled={!amount || Number(amount) <= 0 || !reason.trim()}
              onClick={handleGrant}>지급</button>
          </div>
        </div>
      </div>

      {member.points.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">포인트 이력이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th>포인트</th>
                <th>변경 후 잔액</th>
                <th>사유</th>
                <th>일시</th>
              </tr>
            </thead>
            <tbody>
              {[...member.points].reverse().map((p) => (
                <tr key={p.pointId}>
                  <td style={{ fontSize: 12 }}>{MEMBER_POINT_TYPE_LABEL[p.type]}</td>
                  <td className="amount-cell" style={{ color: p.amount < 0 ? '#dc2626' : '#15803d' }}>
                    {p.amount > 0 ? '+' : ''}{p.amount.toLocaleString()}P
                  </td>
                  <td className="amount-cell">{p.balanceAfter.toLocaleString()}P</td>
                  <td style={{ fontSize: 12 }}>{p.reason}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
