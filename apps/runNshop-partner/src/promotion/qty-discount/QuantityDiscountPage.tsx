'use client'
import { useState } from 'react'
import { type QuantityDiscount, type QtyDiscountStatus, QTY_DISCOUNT_STATUS_LABEL, MOCK_QTY_DISCOUNTS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import QuantityDiscountRegister from './QuantityDiscountRegister'
import QuantityDiscountDetail from './QuantityDiscountDetail'

const STATUS_OPTIONS: Array<{ label: string; value: QtyDiscountStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '승인대기', value: 'PENDING_APPROVAL' },
  { label: '활성', value: 'ACTIVE' },
  { label: '반려', value: 'REJECTED' },
  { label: '종료', value: 'ENDED' },
]

let nextDiscountSeq = MOCK_QTY_DISCOUNTS.length + 1

export default function QuantityDiscountPage() {
  const [discounts, setDiscounts] = useState<QuantityDiscount[]>(MOCK_QTY_DISCOUNTS)
  const [statusFilter, setStatusFilter] = useState<QtyDiscountStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<QuantityDiscount[]>(MOCK_QTY_DISCOUNTS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<QuantityDiscount | null>(null)

  function handleSearch(base: QuantityDiscount[] = discounts) {
    let result = base
    if (statusFilter !== 'ALL') result = result.filter((d) => d.status === statusFilter)
    if (keyword) result = result.filter((d) => d.event_name.includes(keyword) || d.product_name.includes(keyword) || d.discount_id.includes(keyword))
    setDisplayed(result)
    setPage(1)
  }

  function handleCreate(input: {
    event_name: string
    product_name: string
    tiers: QuantityDiscount['tiers']
    start_at: string
    end_at: string
  }) {
    const now = '2026.07.08 09:00'
    const newDiscount: QuantityDiscount = {
      discount_id: `QD-${2000 + nextDiscountSeq++}`,
      event_name: input.event_name,
      product_name: input.product_name,
      tiers: input.tiers,
      status: 'PENDING_APPROVAL',
      reject_reason: null,
      start_at: input.start_at,
      end_at: input.end_at,
      created_at: now,
      updated_at: now,
    }
    const updated = [newDiscount, ...discounts]
    setDiscounts(updated)
    handleSearch(updated)
    setShowRegister(false)
    alert('수량할인이 등록되었습니다. MD 승인 후 노출됩니다.')
  }

  function handleEnd(discountId: string) {
    const now = '2026.07.08 09:00'
    const updater = (d: QuantityDiscount) => d.discount_id === discountId ? { ...d, status: 'ENDED' as const, updated_at: now } : d
    setDiscounts((prev) => prev.map(updater))
    setDisplayed((prev) => prev.map(updater))
    setSelectedDiscount((prev) => prev && prev.discount_id === discountId ? { ...prev, status: 'ENDED', updated_at: now } : prev)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const pendingCount = displayed.filter((d) => d.status === 'PENDING_APPROVAL').length
  const activeCount = displayed.filter((d) => d.status === 'ACTIVE').length
  const rejectedCount = displayed.filter((d) => d.status === 'REJECTED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">수량 할인 관리</h1>
      </div>

      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as QtyDiscountStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="text" placeholder="행사명 · 상품명 · 행사ID" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={() => handleSearch()}>조회</button>
      </div>

      <div className="op-summary-row">
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}개</div></div>
          <div className="summary-card summary-card--info"><div className="summary-card__label">승인대기</div><div className="summary-card__count">{pendingCount}</div></div>
          <div className="summary-card"><div className="summary-card__label">활성</div><div className="summary-card__count">{activeCount}</div></div>
          {rejectedCount > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 반려</div><div className="summary-card__count">{rejectedCount}</div></div>}
        </div>

        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
            <button className="btn-tool btn-tool--add" onClick={() => setShowRegister(true)}>+ 수량할인 등록</button>
          </div>
        </div>
      </div>

      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>행사ID</th>
                <th>행사명</th>
                <th>적용상품</th>
                <th>구간</th>
                <th>진행기간</th>
                <th>상태</th>
                <th>최종수정</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((d) => (
                <tr key={d.discount_id} onClick={() => setSelectedDiscount(d)}>
                  <td className="link-cell">{d.discount_id}</td>
                  <td>{d.event_name}</td>
                  <td>{d.product_name}</td>
                  <td>{d.tiers.map((t) => `${t.min_qty}개+ ${t.discount_rate}%`).join(' / ')}</td>
                  <td>{d.start_at} ~ {d.end_at}</td>
                  <td><span className="badge" data-qty-status={d.status}>{QTY_DISCOUNT_STATUS_LABEL[d.status]}</span></td>
                  <td>{d.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 수량할인이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {showRegister && <QuantityDiscountRegister onClose={() => setShowRegister(false)} onCreate={handleCreate} />}
      {selectedDiscount && <QuantityDiscountDetail discount={selectedDiscount} onClose={() => setSelectedDiscount(null)} onEnd={handleEnd} />}
    </div>
  )
}
