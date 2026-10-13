'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import MemberDetail from './MemberDetail'
import {
  type Member, type MemberGrade, type MemberStatus, type MemberFilter,
  MEMBER_GRADE_LABEL, MEMBER_STATUS_LABEL,
  MOCK_MEMBERS, filterMembers,
} from './mockData'
import { MemberStatusBadge } from './MemberStatusBadge'
import { MemberGradeBadge } from './MemberGradeBadge'

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

const GRADE_OPTIONS: Array<{ label: string; value: MemberGrade | 'ALL' }> = [
  { label: '전체 등급', value: 'ALL' },
  ...Object.entries(MEMBER_GRADE_LABEL).map(([k, v]) => ({ label: v, value: k as MemberGrade })),
]

const STATUS_OPTIONS: Array<{ label: string; value: MemberStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(MEMBER_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as MemberStatus })),
]

function FilterBar({ filter, onChange, onSearch, error }: {
  filter: MemberFilter
  onChange: (f: MemberFilter) => void
  onSearch: () => void
  error: string | null
}) {
  return (
    <div>
      <div className="filter-bar">
        <input type="text" placeholder="이름 · 이메일 · 휴대폰 (1개 이상 필수)" value={filter.keyword}
          onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
        <select value={filter.grade}
          onChange={(e) => onChange({ ...filter, grade: e.target.value as MemberGrade | 'ALL' })}>
          {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filter.status}
          onChange={(e) => onChange({ ...filter, status: e.target.value as MemberStatus | 'ALL' })}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" value={filter.from}
          onChange={(e) => onChange({ ...filter, from: e.target.value })} />
        <span className="sep">~</span>
        <input type="date" value={filter.to}
          onChange={(e) => onChange({ ...filter, to: e.target.value })} />
        <button className="btn-search" onClick={onSearch}>조회</button>
      </div>
      {error && <p className="add-form__err" style={{ marginTop: 6 }}>{error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SummaryBar
// ---------------------------------------------------------------------------

function SummaryBar({ items }: { items: Member[] }) {
  const active = items.filter(m => m.status === 'ACTIVE').length
  const locked = items.filter(m => m.status === 'LOCKED').length
  const inactive = items.filter(m => m.status === 'INACTIVE').length
  const withdrawn = items.filter(m => m.status === 'WITHDRAWN').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card">
        <div className="summary-card__label">정상</div>
        <div className="summary-card__count">{active}건</div>
      </div>
      <div className="summary-card summary-card--warn">
        <div className="summary-card__label">잠금</div>
        <div className="summary-card__count">{locked}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">정지</div>
        <div className="summary-card__count">{inactive}건</div>
      </div>
      <div className="summary-card summary-card--muted">
        <div className="summary-card__label">탈퇴</div>
        <div className="summary-card__count">{withdrawn}건</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function Toolbar() {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool" onClick={() => alert('엑셀 다운로드 기능은 준비 중입니다.')}>엑셀 다운로드</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MemberTable
// ---------------------------------------------------------------------------

function MemberTable({ items, onRowClick }: {
  items: Member[]
  onRowClick: (m: Member) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>회원ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>휴대폰</th>
            <th>등급</th>
            <th>상태</th>
            <th>누적구매금액</th>
            <th>포인트</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.memberId} onClick={() => onRowClick(m)}>
              <td className="link-cell">{m.memberId}</td>
              <td style={{ fontWeight: 500 }}>{m.name}</td>
              <td style={{ fontSize: 12 }}>{m.email}</td>
              <td style={{ fontSize: 12 }}>{m.phone}</td>
              <td><MemberGradeBadge grade={m.grade} /></td>
              <td><MemberStatusBadge status={m.status} /></td>
              <td className="amount-cell">{m.purchaseAmount.toLocaleString()}원</td>
              <td className="amount-cell">{m.pointBalance.toLocaleString()}P</td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{m.joinedAt.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

// 호출방식: 'modal'(팝업) 또는 'tab'(MDI 탭)으로 전환 가능 — MemberDetail 소스는 그대로 재사용된다
const DETAIL_MODE: DetailMode = 'modal'

export default function MemberPage({ currentUser = 'admin' }: { currentUser?: string }) {
  const [allItems, setAllItems] = useState<Member[]>(MOCK_MEMBERS)
  const [filter, setFilter] = useState<MemberFilter>({ keyword: '김도윤', grade: 'ALL', status: 'ALL', from: '', to: '' })
  const [displayed, setDisplayed] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<Member>({
    mode: DETAIL_MODE,
    getTabId: (item) => `member-detail/${item.memberId}`,
    getTabLabel: (item) => `회원 ${item.name}`,
    renderDetail: (item, onClose) => (
      <MemberDetail mode={DETAIL_MODE} member={item} currentUser={currentUser} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    // 개인정보 조회 화면 공통 규칙: 이름·이메일·휴대폰 중 1개 이상 입력 필수 (검색어 없이 전체 목록 노출 금지)
    if (!filter.keyword.trim()) {
      setSearchError('이름 · 이메일 · 휴대폰 중 하나 이상 입력해주세요.')
      return
    }
    setSearchError(null)
    setLoading(true)
    setTimeout(() => {
      setDisplayed(filterMembers(allItems, filter))
      setPage(1)
      setSearched(true)
      setLoading(false)
    }, 300)
  }

  function handleUpdate(updated: Member) {
    const next = allItems.map((m) => m.memberId === updated.memberId ? updated : m)
    setAllItems(next)
    setDisplayed(filterMembers(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">회원 목록</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} error={searchError} />

      {loading && <p className="state-msg">불러오는 중...</p>}

      {!loading && (
        <>
          <div className="op-summary-row">
            {displayed.length > 0 && <SummaryBar items={displayed} />}
            <Toolbar />
          </div>
          {displayed.length > 0 ? (
            <>
              <MemberTable items={pageItems} onRowClick={openDetail} />
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
            </>
          ) : (
            <div className="table-wrap">
              <p className="state-msg">
                {searched
                  ? '조건에 맞는 회원이 없습니다.'
                  : '이름 · 이메일 · 휴대폰 중 하나 이상 입력 후 조회 버튼을 눌러주세요.'}
              </p>
            </div>
          )}
        </>
      )}

      {detailModal}
    </div>
  )
}
