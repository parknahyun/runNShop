'use client'
import { useState } from 'react'
import { type Member, type MemberCouponEntry, MEMBER_COUPON_STATUS_LABEL } from '../mockData'

const ISSUABLE_COUPONS = [
  { couponId: 'CPN-ADHOC-1', couponName: 'CS 보상 쿠폰 5,000원' },
  { couponId: 'CPN-ADHOC-2', couponName: 'CS 보상 쿠폰 10,000원' },
  { couponId: 'CPN-ADHOC-3', couponName: '재구매 유도 쿠폰 10%' },
]

let _couponSeq = 1

export default function CouponsTab({ member, onSave }: {
  member: Member
  onSave: (coupons: MemberCouponEntry[]) => void
}) {
  const [selected, setSelected] = useState(ISSUABLE_COUPONS[0].couponId)

  function handleIssue() {
    const template = ISSUABLE_COUPONS.find((c) => c.couponId === selected)
    if (!template) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const expireAt = new Date().toISOString().slice(0, 10) // mock: 90일 상한은 UI 밖에서 관리, 표시만 today
    const entry: MemberCouponEntry = {
      couponId: `${template.couponId}-${_couponSeq++}`,
      couponName: template.couponName,
      status: 'AVAILABLE',
      issuedAt: now,
      expireAt: `${expireAt} 23:59`,
      usedAt: null,
    }
    onSave([...member.coupons, entry])
  }

  return (
    <div className="tab-panel-content">
      <div className="add-form" style={{ padding: 0, marginBottom: 16 }}>
        <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 12 }}>
          <div className="add-form__field">
            <label>발급 쿠폰</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              {ISSUABLE_COUPONS.map((c) => <option key={c.couponId} value={c.couponId}>{c.couponName}</option>)}
            </select>
          </div>
          <div className="add-form__field" style={{ justifyContent: 'flex-end', display: 'flex' }}>
            <button className="btn-tool btn-tool--add" style={{ marginTop: 20 }} onClick={handleIssue}>발급</button>
          </div>
        </div>
      </div>

      {member.coupons.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">보유 쿠폰이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>쿠폰ID</th>
                <th>쿠폰명</th>
                <th>상태</th>
                <th>발급일시</th>
                <th>만료일시</th>
                <th>사용일시</th>
              </tr>
            </thead>
            <tbody>
              {member.coupons.map((c) => (
                <tr key={c.couponId}>
                  <td style={{ fontSize: 12 }}>{c.couponId}</td>
                  <td style={{ fontWeight: 500 }}>{c.couponName}</td>
                  <td style={{ fontSize: 12 }}>{MEMBER_COUPON_STATUS_LABEL[c.status]}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{c.issuedAt}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{c.expireAt}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{c.usedAt ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
