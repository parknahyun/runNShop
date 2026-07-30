'use client'
import { useState } from 'react'
import { type DeliverySettings, DELIVERY_COMPANY_OPTIONS, MOCK_DELIVERY_SETTINGS } from './mockData'

export default function DeliverySettingsPage() {
  const [settings, setSettings] = useState<DeliverySettings>(MOCK_DELIVERY_SETTINGS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<DeliverySettings>(MOCK_DELIVERY_SETTINGS)

  function startEdit() {
    setDraft(settings)
    setEditing(true)
  }

  function handleSave() {
    setSettings(draft)
    setEditing(false)
    alert('저장되었습니다.')
  }

  function updateNumber(field: keyof Omit<DeliverySettings, 'delivery_company'>, value: string) {
    const num = Number(value.replace(/[^0-9]/g, '')) || 0
    setDraft((d) => ({ ...d, [field]: num }))
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">배송 설정</h1>
      </div>

      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>배송 정책</h2>
          {!editing && (
            <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={startEdit}>편집</button>
          )}
        </div>

        {editing ? (
          <div className="add-form">
            <div className="add-form__row">
              <div className="add-form__field">
                <label>택배사</label>
                <select value={draft.delivery_company} onChange={(e) => setDraft((d) => ({ ...d, delivery_company: e.target.value }))}>
                  {DELIVERY_COMPANY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="add-form__field">
                <label>무료배송 최소금액</label>
                <input type="text" value={draft.free_shipping_min.toLocaleString()} style={{ textAlign: 'right' }}
                  onChange={(e) => updateNumber('free_shipping_min', e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
              설정한 금액 이상 구매 시 고객에게 무료배송이 적용됩니다.
            </p>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>기본배송비</label>
                <input type="text" value={draft.base_shipping_fee.toLocaleString()} style={{ textAlign: 'right' }}
                  onChange={(e) => updateNumber('base_shipping_fee', e.target.value)} />
              </div>
              <div className="add-form__field">
                <label>반품배송비</label>
                <input type="text" value={draft.return_shipping_fee.toLocaleString()} style={{ textAlign: 'right' }}
                  onChange={(e) => updateNumber('return_shipping_fee', e.target.value)} />
              </div>
              <div className="add-form__field">
                <label>제주/도서산간 추가배송비</label>
                <input type="text" value={draft.jeju_extra_fee.toLocaleString()} style={{ textAlign: 'right' }}
                  onChange={(e) => updateNumber('jeju_extra_fee', e.target.value)} />
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <>
            <div className="info-grid" style={{ marginTop: 12 }}>
              <dl className="info-dl">
                <div className="info-row"><dt>택배사</dt><dd>{settings.delivery_company}</dd></div>
                <div className="info-row"><dt>무료배송 최소금액</dt><dd>{settings.free_shipping_min.toLocaleString()}원</dd></div>
                <div className="info-row"><dt>기본배송비</dt><dd>{settings.base_shipping_fee.toLocaleString()}원</dd></div>
              </dl>
              <dl className="info-dl">
                <div className="info-row"><dt>반품배송비</dt><dd>{settings.return_shipping_fee.toLocaleString()}원</dd></div>
                <div className="info-row"><dt>제주/도서산간 추가배송비</dt><dd>{settings.jeju_extra_fee.toLocaleString()}원</dd></div>
              </dl>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
              설정한 금액 이상 구매 시 고객에게 무료배송이 적용됩니다.
            </p>
          </>
        )}
      </section>
    </div>
  )
}
