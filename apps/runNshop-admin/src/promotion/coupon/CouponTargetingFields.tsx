'use client'
import {
  type CouponMemberTargetType, type MemberGrade,
  COUPON_MEMBER_TARGET_TYPE_LABEL, MEMBER_GRADE_LABEL,
} from './mockData'

// ---------------------------------------------------------------------------
// 적용회원 (전체 / 회원등급(다중선택) / 임의지정(엑셀업로드))
// ---------------------------------------------------------------------------

export interface MemberTargetingValue {
  memberTargetType: CouponMemberTargetType
  targetGrades: MemberGrade[]
  targetMemberFile: string
  targetMemberCount: number | null
}

export function MemberTargetingFields({ value, onChange, disabled = false }: {
  value: MemberTargetingValue
  onChange: (v: MemberTargetingValue) => void
  disabled?: boolean
}) {
  function toggleGrade(grade: MemberGrade) {
    const next = value.targetGrades.includes(grade)
      ? value.targetGrades.filter((g) => g !== grade)
      : [...value.targetGrades, grade]
    onChange({ ...value, targetGrades: next })
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onChange({ ...value, targetMemberFile: file.name, targetMemberCount: Math.floor(Math.random() * 450) + 50 })
  }

  return (
    <div>
      <div className="add-form__row">
        <div className="add-form__field">
          <label>적용회원</label>
          <select value={value.memberTargetType} disabled={disabled}
            onChange={(e) => onChange({ ...value, memberTargetType: e.target.value as CouponMemberTargetType })}>
            {Object.entries(COUPON_MEMBER_TARGET_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {value.memberTargetType === 'GRADE' && (
        <div className="add-form__row">
          <div className="add-form__field add-form__field--full">
            <label>회원등급 (다중선택)</label>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {Object.entries(MEMBER_GRADE_LABEL).map(([k, label]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 400 }}>
                  <input type="checkbox" checked={value.targetGrades.includes(k as MemberGrade)} disabled={disabled}
                    onChange={() => toggleGrade(k as MemberGrade)} />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {value.memberTargetType === 'MANUAL' && (
        <div className="add-form__row">
          <div className="add-form__field add-form__field--full">
            <label>임의지정 (엑셀업로드)</label>
            <input type="file" accept=".xlsx,.xls,.csv" disabled={disabled} onChange={handleFile} />
            {value.targetMemberFile ? (
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                업로드된 파일: <strong>{value.targetMemberFile}</strong>
                {value.targetMemberCount != null && ` · 확인된 대상 회원 ${value.targetMemberCount.toLocaleString()}명`}
              </p>
            ) : (
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>업로드된 파일이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
