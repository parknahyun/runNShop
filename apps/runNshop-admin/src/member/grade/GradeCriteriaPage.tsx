'use client'
import { useState } from 'react'
import { type GradeCriteria, GRADE_ORDER, MOCK_GRADE_CRITERIA } from './mockData'
import { MemberGradeBadge } from '@/member/list/MemberGradeBadge'

export default function GradeCriteriaPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [criteria, setCriteria] = useState<GradeCriteria[]>(MOCK_GRADE_CRITERIA)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<GradeCriteria[]>([])

  const rows = editing ? draft : criteria
  const sorted = GRADE_ORDER.map((code) => rows.find((r) => r.gradeCode === code)!).filter(Boolean)

  function startEdit() {
    setDraft(criteria.map((c) => ({ ...c })))
    setEditing(true)
  }

  function handleCancel() {
    setEditing(false)
    setDraft([])
  }

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    setCriteria(draft.map((c) => ({ ...c, updatedBy: currentUser, updatedAt: now })))
    setEditing(false)
    setDraft([])
  }

  function updateRow(gradeCode: GradeCriteria['gradeCode'], patch: Partial<GradeCriteria>) {
    setDraft((prev) => prev.map((c) => c.gradeCode === gradeCode ? { ...c, ...patch } : c))
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">등급 기준 관리</h1>
      </div>

      <div className="pgm-toolbar" style={{ marginBottom: 8 }}>
        <span />
        {editing ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
          </div>
        ) : (
          <button className="btn-tool btn-tool--toggle" onClick={startEdit}>편집</button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>등급</th>
              <th>구매금액 기준</th>
              <th>활동지수 기준</th>
              <th>포인트 적립률</th>
              <th>무료배송 기준</th>
              <th>월 지급 쿠폰</th>
              <th>최종수정</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.gradeCode}>
                <td><MemberGradeBadge grade={c.gradeCode} /></td>
                <td style={{ textAlign: 'right' }}>
                  {editing ? (
                    <input type="number" className="cc-inline-input" style={{ width: 120, textAlign: 'right' }}
                      value={c.minPurchaseAmount}
                      onChange={(e) => updateRow(c.gradeCode, { minPurchaseAmount: Number(e.target.value) })} />
                  ) : `${c.minPurchaseAmount.toLocaleString()}원`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editing ? (
                    <input type="number" className="cc-inline-input cc-inline-input--sm"
                      value={c.minActivityScore}
                      onChange={(e) => updateRow(c.gradeCode, { minActivityScore: Number(e.target.value) })} />
                  ) : `${c.minActivityScore}점`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editing ? (
                    <input type="number" step="0.1" className="cc-inline-input cc-inline-input--sm"
                      value={c.pointBonusRate}
                      onChange={(e) => updateRow(c.gradeCode, { pointBonusRate: Number(e.target.value) })} />
                  ) : `${c.pointBonusRate}%`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editing ? (
                    <input type="number" className="cc-inline-input" style={{ width: 120, textAlign: 'right' }}
                      value={c.freeShippingMin}
                      onChange={(e) => updateRow(c.gradeCode, { freeShippingMin: Number(e.target.value) })} />
                  ) : (c.freeShippingMin === 0 ? '무조건 무료' : `${c.freeShippingMin.toLocaleString()}원 이상`)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editing ? (
                    <input type="number" className="cc-inline-input cc-inline-input--sm"
                      value={c.monthlyCouponCount}
                      onChange={(e) => updateRow(c.gradeCode, { monthlyCouponCount: Number(e.target.value) })} />
                  ) : `${c.monthlyCouponCount}장`}
                </td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{c.updatedBy} / {c.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
