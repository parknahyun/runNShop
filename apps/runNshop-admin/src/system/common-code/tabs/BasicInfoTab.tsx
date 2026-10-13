'use client'
import { useState, useEffect, useId } from 'react'
import { type CodeGroup, type CodeGroupStatus, CODE_GROUP_STATUS_LABEL } from '../mockData'

function CodeStatusBadge({ status }: { status: CodeGroupStatus }) {
  return <span className="badge" data-code-status={status}>{CODE_GROUP_STATUS_LABEL[status]}</span>
}

export interface EditGroupDraft {
  groupName: string; description: string; status: CodeGroupStatus
}

function toDraft(g: CodeGroup): EditGroupDraft {
  return { groupName: g.groupName, description: g.description, status: g.status }
}

export default function BasicInfoTab({ group, codesCount, onSave }: {
  group: CodeGroup
  codesCount: number
  onSave: (draft: EditGroupDraft) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState<EditGroupDraft>(toDraft(group))
  const uid = useId()

  useEffect(() => {
    setDraft(toDraft(group))
  }, [group])

  function fid(key: keyof EditGroupDraft) { return `${uid}-${key}` }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: '14px 0 0' }}>
        <div className="add-form__row">
          <div className="add-form__field">
            <label>상태</label>
            <div className="pgm-status-radio">
              {(['ACTIVE', 'INACTIVE'] as CodeGroupStatus[]).map((s) => (
                <label key={s} className={`pgm-status-radio__item${draft.status === s ? ' pgm-status-radio__item--on' : ''}`}>
                  <input type="radio" name={fid('status')} value={s}
                    checked={draft.status === s}
                    onChange={() => setDraft({ ...draft, status: s })} />
                  {CODE_GROUP_STATUS_LABEL[s]}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field">
            <label htmlFor={fid('groupName')}>그룹코드명 <span className="add-form__req">*</span></label>
            <input id={fid('groupName')} type="text" value={draft.groupName}
              onChange={(e) => setDraft({ ...draft, groupName: e.target.value })} />
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field add-form__field--full">
            <label htmlFor={fid('description')}>설명</label>
            <input id={fid('description')} type="text" value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
        </div>
        <div className="add-form__footer">
          <button className="btn-tool btn-tool--cancel"
            onClick={() => { setDraft(toDraft(group)); setEditing(false) }}>취소</button>
          <button className="btn-tool btn-tool--add"
            onClick={() => { onSave(draft); setEditing(false) }}>저장</button>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle"
          style={{ height: 28, padding: '0 10px', fontSize: 12 }}
          onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid">
        <dl className="info-dl">
          <div className="info-row"><dt>그룹코드ID</dt><dd>{group.groupId}</dd></div>
          <div className="info-row"><dt>그룹코드명</dt><dd>{group.groupName}</dd></div>
          <div className="info-row"><dt>설명</dt><dd>{group.description || '—'}</dd></div>
          <div className="info-row"><dt>상태</dt><dd><CodeStatusBadge status={group.status} /></dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상세코드 수</dt><dd>{codesCount}건</dd></div>
          <div className="info-row"><dt>최초등록</dt><dd>{group.createdBy} / {group.createdAt}</dd></div>
          <div className="info-row"><dt>최종수정</dt><dd>{group.updatedBy} / {group.updatedAt}</dd></div>
        </dl>
      </div>
    </div>
  )
}
