'use client'
import { useState } from 'react'
import {
  type Vendor, type VendorStatus,
  VENDOR_STATUS_LABEL, VENDOR_BUSINESS_TYPE_LABEL, VENDOR_TYPE_LABEL,
} from '../mockData'
import { VendorStatusBadge } from '../VendorStatusBadge'
import { VendorGradeBadge } from '../VendorGradeBadge'

interface Draft {
  status: VendorStatus
}

function toDraft(v: Vendor): Draft {
  return { status: v.status }
}

export default function BasicInfoTab({ vendor, currentUser, onUpdate }: {
  vendor: Vendor
  currentUser: string
  onUpdate: (updated: Vendor) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(toDraft(vendor))

  function handleSave() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...vendor,
      status: draft.status,
      updatedAt: now,
    })
    setEditing(false)
  }

  function handleCancel() {
    setDraft(toDraft(vendor))
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="add-form" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <div className="add-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className="add-form__field">
              <label>상태 변경</label>
              <select value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as VendorStatus })}>
                {Object.entries(VENDOR_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle" onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>입점사ID</dt><dd style={{ fontWeight: 600 }}>{vendor.vendorId}</dd></div>
          <div className="info-row"><dt>사업자명</dt><dd style={{ fontWeight: 600 }}>{vendor.businessName}</dd></div>
          <div className="info-row"><dt>사업자번호</dt><dd>{vendor.businessNo}</dd></div>
          <div className="info-row"><dt>대표자</dt><dd>{vendor.representative}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>사업자유형</dt><dd>{VENDOR_BUSINESS_TYPE_LABEL[vendor.businessType]}</dd></div>
          <div className="info-row"><dt>입점유형</dt><dd>{VENDOR_TYPE_LABEL[vendor.vendorType]}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><VendorStatusBadge status={vendor.status} /></dd></div>
          <div className="info-row"><dt>등급</dt><dd><VendorGradeBadge grade={vendor.gradeCode} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>이메일</dt><dd>{vendor.contactEmail}</dd></div>
          <div className="info-row"><dt>연락처</dt><dd>{vendor.contactPhone}</dd></div>
          <div className="info-row"><dt>입점일시</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{vendor.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd style={{ fontSize: 12, color: '#64748b' }}>{vendor.updatedAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
