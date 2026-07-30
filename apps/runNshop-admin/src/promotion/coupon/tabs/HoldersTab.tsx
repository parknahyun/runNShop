'use client'
import { useState } from 'react'
import {
  type Coupon, type CouponHolder,
  COUPON_HOLDER_ISSUED_VIA_LABEL, COUPON_HOLDER_STATUS_LABEL,
  MOCK_MEMBER_CATALOG, type CatalogMember,
} from '../mockData'

// ---------------------------------------------------------------------------
// 회원 검색 팝업 (임의발행, 다중선택)
// ---------------------------------------------------------------------------

function MemberSearchModal({ existingIds, onClose, onIssue }: {
  existingIds: string[]
  onClose: () => void
  onIssue: (members: CatalogMember[]) => void
}) {
  const [keyword, setKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const results = keyword.trim()
    ? MOCK_MEMBER_CATALOG.filter((m) => m.memberName.includes(keyword) || m.memberId.includes(keyword) || m.email.includes(keyword))
    : MOCK_MEMBER_CATALOG

  function toggle(memberId: string) {
    setSelectedIds((prev) => prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId])
  }

  function handleIssue() {
    const members = MOCK_MEMBER_CATALOG.filter((m) => selectedIds.includes(m.memberId))
    onIssue(members)
  }

  return (
    <div className="detail-modal-overlay" style={{ zIndex: 500 }} onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <span className="detail-modal__title">회원 검색 · 임의발행</span>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body tab-panel-content">
          <div style={{ marginBottom: 12 }}>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
              placeholder="회원ID / 회원명 / 이메일 검색" style={{ width: '100%' }} />
          </div>
          <div className="table-wrap" style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 0 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 50 }}>선택</th>
                  <th>회원ID</th>
                  <th>회원명</th>
                  <th>이메일</th>
                  <th>등급</th>
                </tr>
              </thead>
              <tbody>
                {results.map((m) => {
                  const already = existingIds.includes(m.memberId)
                  const checked = selectedIds.includes(m.memberId)
                  return (
                    <tr key={m.memberId}
                      onClick={() => !already && toggle(m.memberId)}
                      style={{ cursor: already ? 'default' : 'pointer', opacity: already ? 0.5 : 1 }}>
                      <td>
                        {already
                          ? <span style={{ fontSize: 10, color: '#94a3b8' }}>발급됨</span>
                          : <input type="checkbox" checked={checked} onChange={() => toggle(m.memberId)} onClick={(e) => e.stopPropagation()} />
                        }
                      </td>
                      <td style={{ fontSize: 12 }}>{m.memberId}</td>
                      <td style={{ fontWeight: 500 }}>{m.memberName}</td>
                      <td style={{ fontSize: 12 }}>{m.email}</td>
                      <td style={{ fontSize: 12 }}>{m.grade}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
            <button className="btn-tool btn-tool--add" disabled={selectedIds.length === 0} onClick={handleIssue}>
              선택 발행 ({selectedIds.length}명)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// HoldersTab
// ---------------------------------------------------------------------------

export default function HoldersTab({ coupon, onIssue, readOnly = false }: {
  coupon: Coupon
  onIssue: (newHolders: CouponHolder[]) => void
  readOnly?: boolean
}) {
  const [showSearch, setShowSearch] = useState(false)

  function handleIssueToMembers(members: CatalogMember[]) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const fresh: CouponHolder[] = members
      .filter((m) => !coupon.holders.some((h) => h.memberId === m.memberId))
      .map((m) => ({
        memberId: m.memberId,
        memberName: m.memberName,
        memberGrade: m.grade,
        issuedVia: 'MANUAL',
        issuedAt: now,
        usedAt: null,
        status: 'UNUSED',
      }))
    if (fresh.length > 0) onIssue(fresh)
    setShowSearch(false)
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>보유회원 ({coupon.holders.length}명)</span>
        <button className="btn-tool btn-tool--add" disabled={readOnly} onClick={() => setShowSearch(true)}>+ 임의발행</button>
      </div>

      {coupon.holders.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">발급된 회원이 없습니다. 상단 버튼으로 임의발행할 수 있습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>회원ID</th>
                <th>회원명</th>
                <th>등급</th>
                <th>발급경로</th>
                <th>발급일시</th>
                <th>사용일시</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {coupon.holders.map((h) => (
                <tr key={h.memberId}>
                  <td style={{ fontSize: 12 }}>{h.memberId}</td>
                  <td style={{ fontWeight: 500 }}>{h.memberName}</td>
                  <td style={{ fontSize: 12 }}>{h.memberGrade}</td>
                  <td style={{ fontSize: 12 }}>{COUPON_HOLDER_ISSUED_VIA_LABEL[h.issuedVia]}</td>
                  <td style={{ fontSize: 12 }}>{h.issuedAt}</td>
                  <td style={{ fontSize: 12 }}>{h.usedAt ?? '-'}</td>
                  <td style={{ fontSize: 12 }}>{COUPON_HOLDER_STATUS_LABEL[h.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSearch && (
        <MemberSearchModal
          existingIds={coupon.holders.map((h) => h.memberId)}
          onClose={() => setShowSearch(false)}
          onIssue={handleIssueToMembers}
        />
      )}
    </div>
  )
}
