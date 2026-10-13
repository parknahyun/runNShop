'use client'
import { useState } from 'react'
import { type NotificationPreference, MOCK_NOTIFICATION_PREFERENCES } from './mockData'

type Channel = 'email_enabled' | 'sms_enabled' | 'push_enabled'

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPreference[]>(MOCK_NOTIFICATION_PREFERENCES)

  function toggle(eventType: string, channel: Channel) {
    setPrefs((list) => list.map((p) => (p.event_type === eventType ? { ...p, [channel]: !p[channel] } : p)))
  }

  function handleSave() {
    alert('저장되었습니다.')
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">알림 설정</h1>
      </div>

      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>이벤트별 알림 수신 설정</h2>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 12 }}>
          신규 주문 접수, 클레임 접수는 정상적인 거래 진행을 위한 필수 거래 알림입니다.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>이벤트</th>
                <th style={{ textAlign: 'center' }}>이메일</th>
                <th style={{ textAlign: 'center' }}>SMS</th>
                <th style={{ textAlign: 'center' }}>앱푸시</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((p) => (
                <tr key={p.event_type}>
                  <td>
                    {p.event_label}
                    {p.is_required && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#c2410c', background: '#fff7ed', padding: '1px 6px', borderRadius: 999, marginLeft: 6 }}>필수</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={p.email_enabled} onChange={() => toggle(p.event_type, 'email_enabled')} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={p.sms_enabled} onChange={() => toggle(p.event_type, 'sms_enabled')} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={p.push_enabled} onChange={() => toggle(p.event_type, 'push_enabled')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="add-form__footer">
          <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
        </div>
      </section>
    </div>
  )
}
