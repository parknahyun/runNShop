'use client'
import { useState } from 'react'
import { type VendorCoupon, type CouponStatus, COUPON_STATUS_LABEL, formatDiscountValue, MOCK_COUPONS } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'
import CouponRegister from './CouponRegister'
import CouponDetail from './CouponDetail'

const STATUS_OPTIONS: Array<{ label: string; value: CouponStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '승인대기', value: 'PENDING_APPROVAL' },
  { label: '활성', value: 'ACTIVE' },
  { label: '반려', value: 'REJECTED' },
  { label: '비활성', value: 'INACTIVE' },
]

let nextCouponSeq = MOCK_COUPONS.length + 1

export default function CouponPage() {
  const [coupons, setCoupons] = useState<VendorCoupon[]>(MOCK_COUPONS)
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<VendorCoupon[]>(MOCK_COUPONS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<VendorCoupon | null>(null)

  function handleSearch(base: VendorCoupon[] = coupons) {
    let result = base
    if (statusFilter !== 'ALL') result = result.filter((c) => c.status === statusFilter)
    if (keyword) result = result.filter((c) => c.coupon_name.includes(keyword) || c.coupon_id.includes(keyword))
    setDisplayed(result)
    setPage(1)
  }

  function handleCreate(input: {
    coupon_name: string
    discount_type: VendorCoupon['discount_type']
    discount_value: number
    min_order_amount: number
    issue_limit: number | null
    valid_from: string
    valid_to: string
  }) {
    const now = '2026.07.08 09:00'
    const newCoupon: VendorCoupon = {
      coupon_id: `CPN-${1000 + nextCouponSeq++}`,
      coupon_name: input.coupon_name,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      min_order_amount: input.min_order_amount,
      issue_limit: input.issue_limit,
      issued_count: 0,
      valid_from: input.valid_from,
      valid_to: input.valid_to,
      status: 'PENDING_APPROVAL',
      reject_reason: null,
      created_at: now,
      updated_at: now,
    }
    const updated = [newCoupon, ...coupons]
    setCoupons(updated)
    handleSearch(updated)
    setShowRegister(false)
    alert('쿠폰이 등록되었습니다. MD 승인 후 노출됩니다.')
  }

  function handleDeactivate(couponId: string) {
    const updated = coupons.map((c) => c.coupon_id === couponId ? { ...c, status: 'INACTIVE' as const, updated_at: '2026.07.08 09:00' } : c)
    setCoupons(updated)
    setDisplayed((prev) => prev.map((c) => c.coupon_id === couponId ? { ...c, status: 'INACTIVE' as const, updated_at: '2026.07.08 09:00' } : c))
    setSelectedCoupon((prev) => prev && prev.coupon_id === couponId ? { ...prev, status: 'INACTIVE', updated_at: '2026.07.08 09:00' } : prev)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const pendingCount = displayed.filter((c) => c.status === 'PENDING_APPROVAL').length
  const activeCount = displayed.filter((c) => c.status === 'ACTIVE').length
  const rejectedCount = displayed.filter((c) => c.status === 'REJECTED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">쿠폰 관리</h1>
      </div>

      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CouponStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="text" placeholder="쿠폰명 · 쿠폰ID" value={keyword}
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
            <button className="btn-tool btn-tool--add" onClick={() => setShowRegister(true)}>+ 쿠폰 등록</button>
          </div>
        </div>
      </div>

      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>쿠폰ID</th>
                <th>쿠폰명</th>
                <th>할인</th>
                <th>최소주문금액</th>
                <th>발급현황</th>
                <th>유효기간</th>
                <th>상태</th>
                <th>최종수정</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <tr key={c.coupon_id} onClick={() => setSelectedCoupon(c)}>
                  <td className="link-cell">{c.coupon_id}</td>
                  <td>{c.coupon_name}</td>
                  <td>{formatDiscountValue(c)}</td>
                  <td className="amount-cell">{c.min_order_amount.toLocaleString()}원</td>
                  <td>{c.issued_count.toLocaleString()} / {c.issue_limit === null ? '무제한' : c.issue_limit.toLocaleString()}</td>
                  <td>{c.valid_from} ~ {c.valid_to}</td>
                  <td><span className="badge" data-coupon-status={c.status}>{COUPON_STATUS_LABEL[c.status]}</span></td>
                  <td>{c.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 쿠폰이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {showRegister && <CouponRegister onClose={() => setShowRegister(false)} onCreate={handleCreate} />}
      {selectedCoupon && <CouponDetail coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} onDeactivate={handleDeactivate} />}
    </div>
  )
}
