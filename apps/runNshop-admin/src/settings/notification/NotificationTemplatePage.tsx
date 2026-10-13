'use client'
import { useState, useId } from 'react'
import {
  type NotificationTemplate, type ReceiverType, type NotificationChannel,
  type TemplateStatus, type NotificationTemplateFilter,
  RECEIVER_TYPE_LABEL, CHANNEL_LABEL, TEMPLATE_STATUS_LABEL,
  MOCK_NOTIFICATION_TEMPLATES, filterNotificationTemplates, nextTemplateId,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const RECEIVER_OPTIONS: Array<{ label: string; value: ReceiverType | 'ALL' }> = [
  { label: '전체 수신자', value: 'ALL' },
  ...Object.entries(RECEIVER_TYPE_LABEL).map(([k, v]) => ({ label: v, value: k as ReceiverType })),
]

const CHANNEL_OPTIONS: Array<{ label: string; value: NotificationChannel | 'ALL' }> = [
  { label: '전체 채널', value: 'ALL' },
  ...Object.entries(CHANNEL_LABEL).map(([k, v]) => ({ label: v, value: k as NotificationChannel })),
]

const STATUS_OPTIONS: Array<{ label: string; value: TemplateStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(TEMPLATE_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as TemplateStatus })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: NotificationTemplateFilter
  onChange: (f: NotificationTemplateFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="템플릿코드 · 템플릿명 · 이벤트유형" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.receiverType}
        onChange={(e) => onChange({ ...filter, receiverType: e.target.value as NotificationTemplateFilter['receiverType'] })}>
        {RECEIVER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.channel}
        onChange={(e) => onChange({ ...filter, channel: e.target.value as NotificationTemplateFilter['channel'] })}>
        {CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as NotificationTemplateFilter['status'] })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function TemplateStatusBadge({ status }: { status: TemplateStatus }) {
  return <span className="badge" data-ntf-status={status}>{TEMPLATE_STATUS_LABEL[status]}</span>
}

function RequiredBadge({ isRequired }: { isRequired: boolean }) {
  return (
    <span className="badge" data-ntf-required={isRequired ? 'true' : 'false'}>
      {isRequired ? '필수' : '선택'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: NotificationTemplate[] }) {
  const active = items.filter((t) => t.status === 'ACTIVE').length
  const inactive = items.filter((t) => t.status === 'INACTIVE').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">활성</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      {inactive > 0 && (
        <div className="summary-card summary-card--muted">
          <div className="summary-card__label">비활성</div>
          <div className="summary-card__count">{inactive}건</div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 알림 템플릿 등록</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TemplateTable
// ---------------------------------------------------------------------------

function TemplateTable({ items, onRowClick }: {
  items: NotificationTemplate[]
  onRowClick: (t: NotificationTemplate) => void
}) {
  if (items.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 알림 템플릿이 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>템플릿코드</th>
            <th>템플릿명</th>
            <th>이벤트유형</th>
            <th>수신자유형</th>
            <th>채널</th>
            <th>거래알림여부</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.templateId} onClick={() => onRowClick(t)}>
              <td className="link-cell">{t.templateCode}</td>
              <td>{t.templateName}</td>
              <td style={{ fontSize: 12 }}><code style={{ fontSize: 12 }}>{t.eventType}</code></td>
              <td>{RECEIVER_TYPE_LABEL[t.receiverType]}</td>
              <td>{CHANNEL_LABEL[t.channel]}</td>
              <td><RequiredBadge isRequired={t.isRequired} /></td>
              <td><TemplateStatusBadge status={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddEditTemplateModal
// ---------------------------------------------------------------------------

interface TemplateForm {
  templateCode: string; templateName: string; eventType: string
  receiverType: ReceiverType; channel: NotificationChannel
  title: string; body: string; isRequired: boolean; status: TemplateStatus
}

function toForm(t: NotificationTemplate): TemplateForm {
  return {
    templateCode: t.templateCode, templateName: t.templateName, eventType: t.eventType,
    receiverType: t.receiverType, channel: t.channel,
    title: t.title ?? '', body: t.body, isRequired: t.isRequired, status: t.status,
  }
}

const EMPTY_TEMPLATE_FORM: TemplateForm = {
  templateCode: '', templateName: '', eventType: '',
  receiverType: 'CUSTOMER', channel: 'KAKAO',
  title: '', body: '', isRequired: true, status: 'ACTIVE',
}

function AddEditTemplateModal({ mode, template, allItems, onClose, onSubmit, onDelete }: {
  mode: 'add' | 'edit'
  template?: NotificationTemplate
  allItems: NotificationTemplate[]
  onClose: () => void
  onSubmit: (t: NotificationTemplate) => void
  onDelete: (templateId: string) => void
}) {
  const uid = useId()
  const [form, setForm] = useState<TemplateForm>(() =>
    mode === 'edit' && template ? toForm(template) : { ...EMPTY_TEMPLATE_FORM, templateCode: '' }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof TemplateForm, string>>>({})

  function f(key: keyof TemplateForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.templateCode.trim()) e.templateCode = '필수'
    if (!form.templateName.trim()) e.templateName = '필수'
    if (!form.eventType.trim())    e.eventType    = '필수'
    if (!form.body.trim())         e.body         = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      templateId:   mode === 'edit' && template ? template.templateId : nextTemplateId(allItems),
      templateCode: form.templateCode.trim(),
      templateName: form.templateName.trim(),
      eventType:    form.eventType.trim(),
      receiverType: form.receiverType,
      channel:      form.channel,
      title:        form.title.trim() || null,
      body:         form.body.trim(),
      isRequired:   form.isRequired,
      status:       form.status,
      createdAt:    mode === 'edit' && template ? template.createdAt : now,
      updatedAt:    now,
    })
  }

  function handleDelete() {
    if (template) onDelete(template.templateId)
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">알림 템플릿 {mode === 'add' ? '등록' : '수정'}</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('templateCode')}>템플릿코드 <span className="add-form__req">*</span></label>
                <input id={f('templateCode')} type="text" placeholder="예) ORDER_CONFIRMED_KAKAO"
                  disabled={mode === 'edit'}
                  style={mode === 'edit' ? { background: '#f8fafc', color: '#64748b' } : undefined}
                  value={form.templateCode} onChange={(e) => setForm({ ...form, templateCode: e.target.value })} />
                {errors.templateCode && <span className="add-form__err">{errors.templateCode}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('templateName')}>템플릿명 <span className="add-form__req">*</span></label>
                <input id={f('templateName')} type="text" placeholder="예) 주문 확인 안내"
                  value={form.templateName} onChange={(e) => setForm({ ...form, templateName: e.target.value })} />
                {errors.templateName && <span className="add-form__err">{errors.templateName}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('eventType')}>이벤트유형 <span className="add-form__req">*</span></label>
                <input id={f('eventType')} type="text" placeholder="예) CLAIM_RECEIVED"
                  value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} />
                {errors.eventType && <span className="add-form__err">{errors.eventType}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('receiverType')}>수신자유형 <span className="add-form__req">*</span></label>
                <select id={f('receiverType')} value={form.receiverType}
                  onChange={(e) => setForm({ ...form, receiverType: e.target.value as ReceiverType })}>
                  {Object.entries(RECEIVER_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="add-form__field">
                <label htmlFor={f('channel')}>채널 <span className="add-form__req">*</span></label>
                <select id={f('channel')} value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value as NotificationChannel })}>
                  {Object.entries(CHANNEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('title')}>제목</label>
                <input id={f('title')} type="text" placeholder="예) [runNshop] 정산 완료 안내 (미입력 시 제목 없음)"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('body')}>내용 <span className="add-form__req">*</span></label>
                <textarea id={f('body')} rows={4} placeholder="발송 내용을 입력하세요. #{변수} 형식으로 치환 변수를 넣을 수 있습니다."
                  value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
                {errors.body && <span className="add-form__err">{errors.body}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label>
                  <input type="checkbox" checked={form.isRequired}
                    onChange={(e) => setForm({ ...form, isRequired: e.target.checked })}
                    style={{ marginRight: 6 }} />
                  거래 알림 (수신거부 불가)
                </label>
              </div>
              <div className="add-form__field">
                <label htmlFor={f('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={f('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as TemplateStatus })}>
                  {Object.entries(TEMPLATE_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="add-form__footer" style={{ justifyContent: mode === 'edit' ? 'space-between' : 'flex-end' }}>
              {mode === 'edit' && (
                <button className="btn-tool btn-tool--delete" onClick={handleDelete}>삭제</button>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={handleSubmit}>{mode === 'add' ? '등록' : '저장'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationTemplatePage() {
  const [allItems, setAllItems] = useState<NotificationTemplate[]>(MOCK_NOTIFICATION_TEMPLATES)
  const [filter, setFilter]     = useState<NotificationTemplateFilter>({ keyword: '', receiverType: 'ALL', channel: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed] = useState<NotificationTemplate[]>([])
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; template?: NotificationTemplate } | null>(null)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterNotificationTemplates(allItems, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleSubmit(t: NotificationTemplate) {
    const exists = allItems.some((i) => i.templateId === t.templateId)
    const next = exists ? allItems.map((i) => i.templateId === t.templateId ? t : i) : [t, ...allItems]
    setAllItems(next)
    setDisplayed(filterNotificationTemplates(next, filter))
    setModal(null)
  }

  function handleDelete(templateId: string) {
    const next = allItems.filter((i) => i.templateId !== templateId)
    setAllItems(next)
    setDisplayed(filterNotificationTemplates(next, filter))
    setModal(null)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">알림 템플릿</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar onAdd={() => setModal({ mode: 'add' })} />
          </div>
          {displayed.length > 0
            ? <>
                <TemplateTable items={pageItems} onRowClick={(t) => setModal({ mode: 'edit', template: t })} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 알림 템플릿 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {modal && (
        <AddEditTemplateModal
          mode={modal.mode}
          template={modal.template}
          allItems={allItems}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
