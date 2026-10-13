'use client'
import { useState, useId } from 'react'
import {
  type CodeGroup, type CodeGroupStatus, type CodeGroupFilter,
  CODE_GROUP_STATUS_LABEL,
  MOCK_CODE_GROUPS, filterCodeGroups, nextGroupId,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import CodeGroupDetail from './CodeGroupDetail'

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: Array<{ label: string; value: CodeGroupStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL'      },
  { label: '활성',      value: 'ACTIVE'   },
  { label: '비활성',    value: 'INACTIVE' },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: CodeGroupFilter
  onChange: (f: CodeGroupFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="그룹코드ID" value={filter.groupId}
        onChange={(e) => onChange({ ...filter, groupId: e.target.value })} />
      <input type="text" placeholder="그룹코드명" value={filter.groupName}
        onChange={(e) => onChange({ ...filter, groupName: e.target.value })} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as CodeGroupFilter['status'] })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="text" placeholder="상세코드" value={filter.codeId}
        onChange={(e) => onChange({ ...filter, codeId: e.target.value })} />
      <input type="text" placeholder="상세코드명" value={filter.codeName}
        onChange={(e) => onChange({ ...filter, codeName: e.target.value })} />
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

function CodeStatusBadge({ status }: { status: CodeGroupStatus }) {
  return <span className="badge" data-code-status={status}>{CODE_GROUP_STATUS_LABEL[status]}</span>
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ groups }: { groups: CodeGroup[] }) {
  const active   = groups.filter((g) => g.status === 'ACTIVE').length
  const inactive = groups.filter((g) => g.status === 'INACTIVE').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{groups.length}건</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 그룹코드 추가</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CodeGroupTable
// ---------------------------------------------------------------------------

function CodeGroupTable({ groups, onRowClick }: {
  groups: CodeGroup[]
  onRowClick: (g: CodeGroup) => void
}) {
  if (groups.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 공통코드 그룹이 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>그룹코드ID</th>
            <th>그룹코드명</th>
            <th>상세코드 수</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.groupId} onClick={() => onRowClick(g)}>
              <td className="link-cell">{g.groupId}</td>
              <td>{g.groupName}</td>
              <td>{g.codes.length}</td>
              <td><CodeStatusBadge status={g.status} /></td>
              <td>{g.updatedBy} / {g.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddGroupModal
// ---------------------------------------------------------------------------

interface AddGroupForm {
  groupId: string; groupName: string; description: string; status: CodeGroupStatus
}

const EMPTY_ADD_GROUP_FORM: AddGroupForm = {
  groupId: '', groupName: '', description: '', status: 'ACTIVE',
}

function AddGroupModal({ allGroups, currentUser, onClose, onSubmit }: {
  allGroups: CodeGroup[]
  currentUser: string
  onClose: () => void
  onSubmit: (g: CodeGroup) => void
}) {
  const uid = useId()
  const [form, setForm]     = useState<AddGroupForm>({ ...EMPTY_ADD_GROUP_FORM, groupId: nextGroupId(allGroups) })
  const [errors, setErrors] = useState<Partial<Record<keyof AddGroupForm, string>>>({})

  function f(key: keyof AddGroupForm) { return `${uid}-${key}` }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.groupId.trim())   e.groupId   = '필수'
    if (!form.groupName.trim()) e.groupName = '필수'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    onSubmit({
      groupId:     form.groupId.trim(),
      groupName:   form.groupName.trim(),
      description: form.description.trim(),
      status:      form.status,
      codes:       [],
      createdBy:   currentUser,
      createdAt:   now,
      updatedBy:   currentUser,
      updatedAt:   now,
    })
  }

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true">
        <div className="detail-modal__header">
          <div><span className="detail-modal__title">그룹코드 추가</span></div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="detail-modal__body">
          <div className="add-form">

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('groupId')}>그룹코드ID <span className="add-form__req">*</span></label>
                <input id={f('groupId')} type="text" placeholder="예) GROUP-008"
                  value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })} />
                {errors.groupId && <span className="add-form__err">{errors.groupId}</span>}
              </div>
              <div className="add-form__field">
                <label htmlFor={f('groupName')}>그룹코드명 <span className="add-form__req">*</span></label>
                <input id={f('groupName')} type="text" placeholder="예) 배송 방법"
                  value={form.groupName} onChange={(e) => setForm({ ...form, groupName: e.target.value })} />
                {errors.groupName && <span className="add-form__err">{errors.groupName}</span>}
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field add-form__field--full">
                <label htmlFor={f('description')}>설명</label>
                <input id={f('description')} type="text" placeholder="코드 그룹에 대한 설명을 입력하세요"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="add-form__row">
              <div className="add-form__field">
                <label htmlFor={f('status')}>상태 <span className="add-form__req">*</span></label>
                <select id={f('status')} value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CodeGroupStatus })}>
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                </select>
              </div>
            </div>

            <div className="add-form__footer">
              <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
              <button className="btn-tool btn-tool--add" onClick={handleSubmit}>등록</button>
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

export default function CommonCodes({ currentUser = 'guest' }: { currentUser?: string }) {
  const [allGroups, setAllGroups]     = useState<CodeGroup[]>(MOCK_CODE_GROUPS)
  const [filter, setFilter]           = useState<CodeGroupFilter>({ groupId: '', groupName: '', status: 'ALL', codeId: '', codeName: '' })
  const [displayed, setDisplayed]     = useState<CodeGroup[]>([])
  const [loading, setLoading]         = useState(false)
  const [page, setPage]               = useState(1)
  const [pageSize, setPageSize]       = useState(7)
  const [detailGroup, setDetailGroup] = useState<CodeGroup | null>(null)
  const [showAdd, setShowAdd]         = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterCodeGroups(allGroups, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleAdd(g: CodeGroup) {
    const next = [...allGroups, g]
    setAllGroups(next)
    setDisplayed(filterCodeGroups(next, filter))
    setShowAdd(false)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">공통코드</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar groups={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0
            ? <>
                <CodeGroupTable groups={pageItems} onRowClick={(g) => setDetailGroup(g)} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 공통코드 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {detailGroup && (
        <CodeGroupDetail
          group={detailGroup}
          currentUser={currentUser}
          onClose={() => setDetailGroup(null)}
          onUpdate={(updated) => {
            const next = allGroups.map((g) => g.groupId === updated.groupId ? updated : g)
            setAllGroups(next)
            setDisplayed(filterCodeGroups(next, filter))
            setDetailGroup(updated)
          }}
        />
      )}

      {showAdd && (
        <AddGroupModal
          allGroups={allGroups}
          currentUser={currentUser}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  )
}
