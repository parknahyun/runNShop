'use client'
import { useState } from 'react'
import {
  type Operator, type OperatorRole, type OperatorStatus, type OperatorFilter,
  ROLE_LABEL, STATUS_LABEL,
  MOCK_OPERATORS, filterOperators,
} from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import OperatorDetail    from './OperatorDetail'
import AddOperatorModal  from './AddOperatorModal'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const ROLE_OPTIONS: Array<{ label: string; value: OperatorRole | 'ALL' }> = [
  { label: '전체 권한',   value: 'ALL'        },
  { label: '최고 관리자', value: 'SUPER_ADMIN' },
  { label: '관리자',      value: 'ADMIN'       },
  { label: '운영자',      value: 'OPERATOR'    },
  { label: '조회자',      value: 'VIEWER'      },
]

const STATUS_OPTIONS: Array<{ label: string; value: OperatorStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL'       },
  { label: '신청',      value: 'APPLIED'   },
  { label: '활동',      value: 'ACTIVE'    },
  { label: '중지',      value: 'SUSPENDED' },
  { label: '탈퇴',      value: 'WITHDRAWN' },
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: OperatorFilter
  onChange: (f: OperatorFilter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="이름" value={filter.name}
        onChange={(e) => onChange({ ...filter, name: e.target.value })} />
      <input type="text" placeholder="로그인 ID" value={filter.loginId}
        onChange={(e) => onChange({ ...filter, loginId: e.target.value })} />
      <select value={filter.role}
        onChange={(e) => onChange({ ...filter, role: e.target.value as OperatorFilter['role'] })}>
        {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as OperatorFilter['status'] })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: OperatorRole }) {
  return <span className="badge" data-op-role={role}>{ROLE_LABEL[role]}</span>
}

function StatusBadge({ status }: { status: OperatorStatus }) {
  return <span className="badge" data-op-status={status}>{STATUS_LABEL[status]}</span>
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ operators }: { operators: Operator[] }) {
  const applied   = operators.filter((o) => o.status === 'APPLIED').length
  const active    = operators.filter((o) => o.status === 'ACTIVE').length
  const suspended = operators.filter((o) => o.status === 'SUSPENDED').length
  const withdrawn = operators.filter((o) => o.status === 'WITHDRAWN').length

  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{operators.length}명</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">활동</div>
        <div className="summary-card__count">{active}명</div>
      </div>
      {applied > 0 && (
        <div className="summary-card summary-card--info">
          <div className="summary-card__label">신청</div>
          <div className="summary-card__count">{applied}명</div>
        </div>
      )}
      {suspended > 0 && (
        <div className="summary-card summary-card--warn">
          <div className="summary-card__label">⚠ 중지</div>
          <div className="summary-card__count">{suspended}명</div>
        </div>
      )}
      {withdrawn > 0 && (
        <div className="summary-card summary-card--muted">
          <div className="summary-card__label">탈퇴</div>
          <div className="summary-card__count">{withdrawn}명</div>
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
        <button className="btn-tool btn-tool--add" onClick={onAdd}>+ 운영자 추가</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OperatorTable
// ---------------------------------------------------------------------------

function OperatorTable({ operators, onRowClick }: {
  operators: Operator[]
  onRowClick: (op: Operator) => void
}) {
  if (operators.length === 0) {
    return <div className="table-wrap"><p className="state-msg">조회된 운영자가 없습니다.</p></div>
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>운영자 ID</th>
            <th>이름</th>
            <th>로그인 ID</th>
            <th>부서</th>
            <th>권한</th>
            <th>상태</th>
            <th>최근 로그인</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.operatorId} onClick={() => onRowClick(op)}
              data-op-status-row={op.status}>
              <td className="link-cell">{op.operatorId}</td>
              <td>{op.name}</td>
              <td>{op.loginId}</td>
              <td>{op.department}</td>
              <td><RoleBadge role={op.role} /></td>
              <td><StatusBadge status={op.status} /></td>
              <td>{op.lastLoginAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page (default export)
// ---------------------------------------------------------------------------

export default function OperatorStatus({ currentUser = 'guest' }: { currentUser?: string }) {
  const [allOperators, setAllOperators]     = useState<Operator[]>(MOCK_OPERATORS)
  const [filter, setFilter]                 = useState<OperatorFilter>({ name: '', loginId: '', role: 'ALL', status: 'ALL' })
  const [displayed, setDisplayed]           = useState<Operator[]>([])
  const [loading, setLoading]               = useState(false)
  const [page, setPage]                     = useState(1)
  const [pageSize, setPageSize]             = useState(7)
  const [detailOperator, setDetailOperator] = useState<Operator | null>(null)
  const [showAdd, setShowAdd]               = useState(false)

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems  = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterOperators(allOperators, filter))
      setPage(1)
      setLoading(false)
    }, 300)
  }

  function handleAdd(op: Operator) {
    const next = [...allOperators, op]
    setAllOperators(next)
    setDisplayed(filterOperators(next, filter))
    setShowAdd(false)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">운영자 계정</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar operators={displayed} />}
            <Toolbar onAdd={() => setShowAdd(true)} />
          </div>
          {displayed.length > 0
            ? <>
                <OperatorTable operators={pageItems} onRowClick={(op) => setDetailOperator(op)} />
                <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                  onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
              </>
            : <div className="table-wrap">
                <p className="state-msg">조회 버튼을 눌러 운영자 목록을 불러오세요.</p>
              </div>
          }
        </>
      )}

      {detailOperator && (
        <OperatorDetail
          operator={detailOperator}
          currentUser={currentUser}
          onClose={() => setDetailOperator(null)}
          onUpdate={(updated) => {
            const next = allOperators.map((o) => o.operatorId === updated.operatorId ? updated : o)
            setAllOperators(next)
            setDisplayed(filterOperators(next, filter))
            setDetailOperator(updated)
          }}
        />
      )}

      {showAdd && (
        <AddOperatorModal
          allOperators={allOperators}
          currentUser={currentUser}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  )
}
