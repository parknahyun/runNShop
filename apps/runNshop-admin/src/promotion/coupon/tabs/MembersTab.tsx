'use client'
import { useState } from 'react'
import { type Coupon, type CouponMemberTargetType, type MemberGrade } from '../mockData'
import { MemberTargetingFields } from '../CouponTargetingFields'

export default function MembersTab({ coupon, onSave, readOnly = false }: {
  coupon: Coupon
  onSave: (v: { memberTargetType: CouponMemberTargetType; targetGrades: MemberGrade[]; targetMemberFile: string; targetMemberCount: number | null }) => void
  readOnly?: boolean
}) {
  const [value, setValue] = useState({
    memberTargetType: coupon.memberTargetType,
    targetGrades: coupon.targetGrades,
    targetMemberFile: coupon.targetMemberFile,
    targetMemberCount: coupon.targetMemberCount,
  })

  const isDirty = JSON.stringify(value) !== JSON.stringify({
    memberTargetType: coupon.memberTargetType,
    targetGrades: coupon.targetGrades,
    targetMemberFile: coupon.targetMemberFile,
    targetMemberCount: coupon.targetMemberCount,
  })

  function handleSave() {
    onSave(value)
  }

  function handleCancel() {
    setValue({
      memberTargetType: coupon.memberTargetType,
      targetGrades: coupon.targetGrades,
      targetMemberFile: coupon.targetMemberFile,
      targetMemberCount: coupon.targetMemberCount,
    })
  }

  return (
    <div className="tab-panel-content">
      <div className="add-form" style={{ padding: 0 }}>
        <MemberTargetingFields value={value} onChange={setValue} disabled={readOnly} />
      </div>

      <div className="section-editor-footer">
        <button className="btn-tool btn-tool--cancel" disabled={readOnly} onClick={handleCancel}>취소</button>
        <button className="btn-tool btn-tool--add" disabled={readOnly || !isDirty} onClick={handleSave}>저장</button>
      </div>
    </div>
  )
}
