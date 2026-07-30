'use client'
import { useState } from 'react'
import { type ShippingItem, type ShippingStatus, SHIPPING_STATUS_LABEL, DELIVERY_COMPANIES, MOCK_SHIPPING } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

const STATUS_OPTIONS: Array<{ label: string; value: ShippingStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '송장 미입력', value: 'PREPARING' },
  { label: '배송중', value: 'IN_DELIVERY' },
  { label: '배송완료', value: 'DELIVERED' },
]

function nowStr() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ShippingPage() {
  const [items, setItems] = useState<ShippingItem[]>(MOCK_SHIPPING)
  const [statusFilter, setStatusFilter] = useState<ShippingStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<ShippingItem[]>(MOCK_SHIPPING)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleSearch() {
    let result = items
    if (statusFilter !== 'ALL') result = result.filter((i) => i.status === statusFilter)
    if (keyword) {
      result = result.filter((i) =>
        i.platform_order_no.includes(keyword) || i.product_name.includes(keyword) || i.customer_name.includes(keyword))
    }
    setDisplayed(result)
    setPage(1)
  }

  function handleSubmitShipping(orderId: string, company: string, trackingNo: string) {
    const at = nowStr()
    const apply = (i: ShippingItem): ShippingItem => i.order_id !== orderId ? i : {
      ...i,
      status: 'IN_DELIVERY',
      delivery_company: company,
      tracking_no: trackingNo,
      shipped_at: at,
    }
    setItems((prev) => prev.map(apply))
    setDisplayed((prev) => prev.map(apply))
    setSelectedId(null)
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)
  const selectedItem = items.find((i) => i.order_id === selectedId) ?? null

  const preparing = displayed.filter((i) => i.status === 'PREPARING').length
  const inDelivery = displayed.filter((i) => i.status === 'IN_DELIVERY').length
  const delivered = displayed.filter((i) => i.status === 'DELIVERED').length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">배송 관리</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ShippingStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="text" placeholder="주문번호 · 상품명 · 고객명" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}개</div></div>
          {preparing > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 송장 미입력</div><div className="summary-card__count">{preparing}</div></div>}
          <div className="summary-card"><div className="summary-card__label">배송중</div><div className="summary-card__count">{inDelivery}</div></div>
          <div className="summary-card"><div className="summary-card__label">배송완료</div><div className="summary-card__count">{delivered}</div></div>
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>배송 엑셀 양식</button>
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 업로드</button>
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>엑셀 다운로드</button>
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>일괄 배송정보 입력</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>상품명</th>
                <th>고객명</th>
                <th>상태</th>
                <th>택배사</th>
                <th>운송장번호</th>
                <th>발송일시</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((i) => (
                <tr key={i.order_id} onClick={() => setSelectedId(i.order_id)}>
                  <td className="link-cell">{i.platform_order_no}</td>
                  <td>{i.product_name}</td>
                  <td>{i.customer_name}</td>
                  <td><span className="badge" data-shipping-status={i.status}>{SHIPPING_STATUS_LABEL[i.status]}</span></td>
                  <td>{i.delivery_company ?? '-'}</td>
                  <td>{i.tracking_no ?? '-'}</td>
                  <td>{i.shipped_at ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 배송 건이 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {selectedItem && (
        <ShippingModal item={selectedItem} onClose={() => setSelectedId(null)}
          onSubmit={(company, trackingNo) => handleSubmitShipping(selectedItem.order_id, company, trackingNo)} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ShippingModal
// ---------------------------------------------------------------------------

function ShippingModal({ item, onClose, onSubmit }: {
  item: ShippingItem
  onClose: () => void
  onSubmit: (company: string, trackingNo: string) => void
}) {
  const [company, setCompany] = useState(item.delivery_company ?? DELIVERY_COMPANIES[0])
  const [trackingNo, setTrackingNo] = useState(item.tracking_no ?? '')
  const editable = item.status === 'PREPARING'

  function handleSubmit() {
    if (!trackingNo.trim()) { alert('운송장번호를 입력해주세요.'); return }
    onSubmit(company, trackingNo.trim())
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal detail-modal--sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal__header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="detail-modal__title">{item.platform_order_no}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>#{item.order_id}</span>
              <span className="badge" data-shipping-status={item.status}>{SHIPPING_STATUS_LABEL[item.status]}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{item.customer_name}</span>
            </div>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="detail-modal__body">
          <div className="tab-panel-content">
            <section className="detail-section" style={{ marginTop: 0 }}>
              <h2 className="section-title">배송 정보</h2>
              {editable ? (
                <div className="add-form" style={{ padding: '14px 0 0' }}>
                  <div className="add-form__row">
                    <div className="add-form__field">
                      <label>택배사 <span className="add-form__req">*</span></label>
                      <select value={company} onChange={(e) => setCompany(e.target.value)}>
                        {DELIVERY_COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="add-form__field">
                      <label>운송장번호 <span className="add-form__req">*</span></label>
                      <input type="text" value={trackingNo} placeholder="숫자만 입력"
                        onChange={(e) => setTrackingNo(e.target.value)} />
                    </div>
                  </div>
                  <div className="add-form__footer">
                    <button className="btn-tool btn-tool--cancel" onClick={onClose}>취소</button>
                    <button className="btn-tool btn-tool--add" onClick={handleSubmit}>배송정보 입력</button>
                  </div>
                </div>
              ) : (
                <div className="info-grid" style={{ marginTop: 12 }}>
                  <dl className="info-dl">
                    <div className="info-row"><dt>택배사</dt><dd>{item.delivery_company ?? '-'}</dd></div>
                    <div className="info-row"><dt>운송장번호</dt><dd>{item.tracking_no ?? '-'}</dd></div>
                  </dl>
                  <dl className="info-dl">
                    <div className="info-row"><dt>상태</dt><dd><span className="badge" data-shipping-status={item.status}>{SHIPPING_STATUS_LABEL[item.status]}</span></dd></div>
                    <div className="info-row"><dt>발송일시</dt><dd>{item.shipped_at ?? '-'}</dd></div>
                  </dl>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
