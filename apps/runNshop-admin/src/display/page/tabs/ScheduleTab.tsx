'use client'
import { useState } from 'react'
import { type PageItem, type PageStatus, PAGE_STATUS_LABEL } from '../mockData'
import { PageStatusBadge } from '../PageStatusBadge'

// ---------------------------------------------------------------------------
// ScheduleTab — 예약 관리
// ---------------------------------------------------------------------------

export default function ScheduleTab({ eventPage, currentUser, onUpdate }: {
  eventPage: PageItem
  currentUser: string
  onUpdate: (updated: PageItem) => void
}) {
  const [scheduling, setScheduling] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')

  function handlePublishNow() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...eventPage,
      status: 'PUBLISHED',
      publishedAt: now,
      updatedBy: currentUser,
      updatedAt: now,
    })
  }

  function handleSchedule() {
    if (!scheduleAt) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...eventPage,
      status: 'SCHEDULED',
      publishedAt: scheduleAt.replace('T', ' '),
      updatedBy: currentUser,
      updatedAt: now,
    })
    setScheduling(false)
    setScheduleAt('')
  }

  function handleDeprecate() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...eventPage,
      status: 'DEPRECATED',
      updatedBy: currentUser,
      updatedAt: now,
    })
  }

  function handleUnpublish() {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    onUpdate({
      ...eventPage,
      status: 'DRAFT',
      updatedBy: currentUser,
      updatedAt: now,
    })
  }

  return (
    <section className="detail-section" style={{ marginTop: 0 }}>
      <h2 className="section-title" style={{ marginBottom: 12 }}>예약 관리</h2>
      <div className="info-grid" style={{ marginTop: 0 }}>
        <dl className="info-dl">
          <div className="info-row"><dt>현재 상태</dt><dd><PageStatusBadge status={eventPage.status} /></dd></div>
          <div className="info-row"><dt>게시일시</dt><dd>{eventPage.publishedAt || '-'}</dd></div>
          <div className="info-row"><dt>시작 일시</dt><dd>{eventPage.startAt}</dd></div>
          <div className="info-row"><dt>종료 일시</dt><dd>{eventPage.endAt}</dd></div>
        </dl>
      </div>

      {scheduling && (
        <div className="add-form" style={{ marginTop: 12, padding: '12px 0 0' }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>게시 예약 일시 <span className="add-form__req">*</span></label>
              <input type="datetime-local" value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)} />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => setScheduling(false)}>취소</button>
            <button className="btn-tool btn-tool--add" disabled={!scheduleAt} onClick={handleSchedule}>예약 설정</button>
          </div>
        </div>
      )}

      <div className="add-form__footer" style={{ marginTop: 16, gap: 8 }}>
        {eventPage.status === 'DRAFT' && (
          <>
            <button className="btn-tool btn-tool--add" onClick={handlePublishNow}>즉시 게시</button>
            <button className="btn-tool btn-tool--toggle" onClick={() => setScheduling(true)}>예약 게시</button>
          </>
        )}
        {eventPage.status === 'SCHEDULED' && (
          <>
            <button className="btn-tool btn-tool--add" onClick={handlePublishNow}>즉시 게시</button>
            <button className="btn-tool btn-tool--cancel" onClick={handleUnpublish}>예약 취소</button>
          </>
        )}
        {eventPage.status === 'PUBLISHED' && (
          <>
            <button className="btn-tool btn-tool--cancel" onClick={handleUnpublish}>게시 취소</button>
            <button className="btn-tool btn-tool--cancel" onClick={handleDeprecate}>폐기</button>
          </>
        )}
        {eventPage.status === 'DEPRECATED' && (
          <button className="btn-tool btn-tool--toggle" onClick={handleUnpublish}>미게시로 복원</button>
        )}
      </div>
    </section>
  )
}
