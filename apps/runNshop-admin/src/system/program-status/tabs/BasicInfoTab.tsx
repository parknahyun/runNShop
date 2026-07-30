'use client'
import { useState, useId } from 'react'
import {
  type Program, type ProgramType, type ProgramStatus, type ProgramMethod,
  TYPE_LABEL, STATUS_LABEL,
} from '../mockData'

const METHOD_OPTIONS: ProgramMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const TYPE_INPUT_OPTIONS: ProgramType[] = ['PAGE', 'API', 'BATCH', 'EVENT']

function TypeBadge({ type }: { type: ProgramType }) {
  return <span className="badge" data-pgm-type={type}>{TYPE_LABEL[type]}</span>
}

function StatusBadge({ status }: { status: ProgramStatus }) {
  return <span className="badge" data-pgm-status={status}>{STATUS_LABEL[status]}</span>
}

interface EditDraft {
  name: string; description: string; type: ProgramType
  method: ProgramMethod | ''; uri: string; domain: string
  version: string; owner: string; status: ProgramStatus
}

function toDraft(p: Program): EditDraft {
  return {
    name: p.name, description: p.description,
    type: p.type, method: p.method ?? '',
    uri: p.uri, domain: p.domain,
    version: p.version, owner: p.owner, status: p.status,
  }
}

export default function BasicInfoTab({ program, currentUser, onUpdate }: {
  program: Program
  currentUser: string
  onUpdate: (updated: Program) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState<EditDraft>(toDraft(program))
  const [errors, setErrors]   = useState<Partial<Record<keyof EditDraft, string>>>({})
  const uid = useId()

  function fid(key: keyof EditDraft) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!draft.name.trim())    e.name    = '필수'
    if (!draft.uri.trim())     e.uri     = '필수'
    if (!draft.domain.trim())  e.domain  = '필수'
    if (!draft.version.trim()) e.version = '필수'
    if (!draft.owner.trim())   e.owner   = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onUpdate({
      ...program,
      name: draft.name, description: draft.description,
      type: draft.type, method: (draft.method as ProgramMethod) || undefined,
      uri: draft.uri, domain: draft.domain,
      version: draft.version, owner: draft.owner,
      status: draft.status, updatedBy: currentUser, updatedAt: now,
    })
    setEditing(false)
    setErrors({})
  }

  function handleCancel() {
    setDraft(toDraft(program))
    setErrors({})
    setEditing(false)
  }

  const needsMethod = draft.type === 'API'

  return (
    <div className="tab-panel-content">
      {/* 기본 정보 */}
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="detail-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>기본 정보</h2>
          {!editing && (
            <button className="btn-tool btn-tool--toggle"
              style={{ height: 28, padding: '0 10px', fontSize: 12 }}
              onClick={() => setEditing(true)}>편집</button>
          )}
        </div>

        {editing ? (
          <div className="add-form" style={{ padding: '14px 0 0' }}>
            <div className="add-form__row">
              <div className="add-form__field">
                <label>상태</label>
                <div className="pgm-status-radio">
                  {(['ACTIVE', 'INACTIVE', 'DEPRECATED'] as ProgramStatus[]).map((s) => (
                    <label key={s} className={`pgm-status-radio__item${draft.status === s ? ' pgm-status-radio__item--on' : ''}`}>
                      <input type="radio" name={fid('status')} value={s}
                        checked={draft.status === s}
                        onChange={() => setDraft({ ...draft, status: s })} />
                      {STATUS_LABEL[s]}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={fid('name')}>프로그램명 <span className="add-form__req">*</span></label>
                <input id={fid('name')} type="text" value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                {errors.name && <span className="add-form__err">{errors.name}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={fid('type')}>유형</label>
                <select id={fid('type')} value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value as ProgramType, method: '' })}>
                  {TYPE_INPUT_OPTIONS.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              </div>
              {needsMethod && (
                <div className="add-form__field">
                  <label htmlFor={fid('method')}>HTTP 메서드</label>
                  <select id={fid('method')} value={draft.method}
                    onChange={(e) => setDraft({ ...draft, method: e.target.value as ProgramMethod })}>
                    <option value="">선택</option>
                    {METHOD_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
              <div className="add-form__field">
                <label htmlFor={fid('version')}>버전 <span className="add-form__req">*</span></label>
                <input id={fid('version')} type="text" value={draft.version}
                  onChange={(e) => setDraft({ ...draft, version: e.target.value })} />
                {errors.version && <span className="add-form__err">{errors.version}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={fid('owner')}>담당팀 <span className="add-form__req">*</span></label>
                <input id={fid('owner')} type="text" value={draft.owner}
                  onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
                {errors.owner && <span className="add-form__err">{errors.owner}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={fid('uri')}>URI <span className="add-form__req">*</span></label>
                <input id={fid('uri')} type="text" value={draft.uri}
                  onChange={(e) => setDraft({ ...draft, uri: e.target.value })} />
                {errors.uri && <span className="add-form__err">{errors.uri}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={fid('domain')}>도메인 <span className="add-form__req">*</span></label>
                <input id={fid('domain')} type="text" value={draft.domain}
                  onChange={(e) => setDraft({ ...draft, domain: e.target.value })} />
                {errors.domain && <span className="add-form__err">{errors.domain}</span>}
              </div>
            </div>
            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={fid('description')}>설명</label>
                <textarea id={fid('description')} rows={2} value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
            </div>
            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={handleCancel}>취소</button>
              <button className="btn-tool btn-tool--add"    onClick={handleSave}>저장</button>
            </div>
          </div>
        ) : (
          <>
            <div className="info-grid" style={{ marginTop: 12 }}>
              <dl className="info-dl">
                <div className="info-row"><dt>프로그램 ID</dt><dd>{program.programId}</dd></div>
                <div className="info-row"><dt>프로그램명</dt><dd>{program.name}</dd></div>
                <div className="info-row"><dt>유형</dt><dd><TypeBadge type={program.type} /></dd></div>
                <div className="info-row"><dt>도메인</dt><dd>{program.domain}</dd></div>
                <div className="info-row"><dt>URI</dt><dd className="pgm-uri">{program.method ? `[${program.method}] ` : ''}{program.uri}</dd></div>
              </dl>
              <dl className="info-dl">
                <div className="info-row"><dt>버전</dt><dd>{program.version}</dd></div>
                <div className="info-row"><dt>담당팀</dt><dd>{program.owner}</dd></div>
                <div className="info-row"><dt>상태</dt><dd><StatusBadge status={program.status} /></dd></div>
                <div className="info-row"><dt>최초등록</dt><dd>{program.createdBy} / {program.createdAt}</dd></div>
                <div className="info-row"><dt>최종수정</dt><dd>{program.updatedBy} / {program.updatedAt}</dd></div>
              </dl>
            </div>
            {program.description && <p className="pgm-desc">{program.description}</p>}
          </>
        )}
      </section>

      {/* 운영 지표 */}
      <section className="detail-section">
        <h2 className="section-title">운영 지표 (최근 30일)</h2>
        <div className="pgm-metrics">
          <div className="pgm-metric-card">
            <div className="pgm-metric-card__value">{program.callCount30d.toLocaleString()}</div>
            <div className="pgm-metric-card__label">총 호출 수</div>
          </div>
          <div className="pgm-metric-card">
            <div className="pgm-metric-card__value">{program.avgDurationMs.toLocaleString()}ms</div>
            <div className="pgm-metric-card__label">평균 응답 시간</div>
          </div>
          <div className={`pgm-metric-card${program.errorRate > 1 ? ' pgm-metric-card--warn' : ''}`}>
            <div className="pgm-metric-card__value">{program.errorRate.toFixed(1)}%</div>
            <div className="pgm-metric-card__label">오류율</div>
          </div>
        </div>
      </section>
    </div>
  )
}
