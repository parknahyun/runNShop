'use client'
import { useState } from 'react'
import { type InventoryItem, type StockStatus, type StockHistoryEntry, STOCK_STATUS_LABEL, MOCK_INVENTORY } from './mockData'
import { Pagination } from '@/shell/shared/Pagination'

const STATUS_OPTIONS: Array<{ label: string; value: StockStatus | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  { label: '판매중', value: 'ON_SALE' },
  { label: '품절', value: 'SOLD_OUT' },
]

function nowStr() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY)
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'ALL'>('ALL')
  const [keyword, setKeyword] = useState('')
  const [displayed, setDisplayed] = useState<InventoryItem[]>(MOCK_INVENTORY)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Record<string, number>>({})
  const [history, setHistory] = useState<StockHistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  function applyFilter(source: InventoryItem[]) {
    let result = source
    if (statusFilter !== 'ALL') result = result.filter((i) => i.status === statusFilter)
    if (keyword) result = result.filter((i) => i.product_name.includes(keyword))
    return result
  }

  function handleSearch() {
    setDisplayed(applyFilter(items))
    setPage(1)
  }

  function startEdit() {
    const draftMap: Record<string, number> = {}
    displayed.forEach((i) => { draftMap[i.sku_id] = i.stock })
    setDraft(draftMap)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setDraft({})
  }

  function saveEdit() {
    const now = nowStr()
    const newHistory: StockHistoryEntry[] = []
    const updatedItems = items.map((item) => {
      const newStock = draft[item.sku_id]
      if (newStock === undefined || newStock === item.stock) return item
      newHistory.push({ at: now, sku_id: item.sku_id, product_name: item.product_name, option_name: item.option_name, before: item.stock, after: newStock })
      return { ...item, stock: newStock, status: (newStock === 0 ? 'SOLD_OUT' : 'ON_SALE') as StockStatus, updated_at: now }
    })
    setItems(updatedItems)
    setDisplayed(applyFilter(updatedItems))
    if (newHistory.length > 0) setHistory((prev) => [...newHistory, ...prev])
    setEditing(false)
    setDraft({})
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  const onSale = displayed.filter((i) => i.status === 'ON_SALE').length
  const soldOut = displayed.filter((i) => i.status === 'SOLD_OUT').length
  const lowStock = displayed.filter((i) => i.stock < i.safety_stock).length

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">재고 관리</h1>
      </div>

      {/* FilterBar */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StockStatus | 'ALL')}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="text" placeholder="상품명" value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className="btn-search" onClick={handleSearch}>조회</button>
      </div>

      <div className="op-summary-row">
        {/* SummaryBar */}
        <div className="summary-bar">
          <div className="summary-card"><div className="summary-card__label">전체</div><div className="summary-card__count">{displayed.length}개</div></div>
          <div className="summary-card"><div className="summary-card__label">판매중</div><div className="summary-card__count">{onSale}</div></div>
          {soldOut > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 품절</div><div className="summary-card__count">{soldOut}</div></div>}
          {lowStock > 0 && <div className="summary-card summary-card--warn"><div className="summary-card__label">⚠ 안전재고 부족</div><div className="summary-card__count">{lowStock}</div></div>}
        </div>

        {/* Toolbar */}
        <div className="pgm-toolbar">
          <span />
          <div className="pgm-toolbar__actions">
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>재고 엑셀 양식 다운로드</button>
            <button className="btn-tool" onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}>재고 엑셀 업로드</button>
            {editing ? (
              <>
                <button className="btn-tool btn-tool--cancel" onClick={cancelEdit}>취소</button>
                <button className="btn-tool btn-tool--add" onClick={saveEdit}>저장</button>
              </>
            ) : (
              <button className="btn-tool btn-tool--toggle" onClick={startEdit}>편집</button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {pageItems.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU ID</th>
                <th>상품명</th>
                <th>옵션</th>
                <th>재고</th>
                <th>안전재고 대비</th>
                <th>상태</th>
                <th>최종수정</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((i) => {
                const currentStock = editing ? (draft[i.sku_id] ?? i.stock) : i.stock
                const isLow = currentStock < i.safety_stock
                return (
                  <tr key={i.sku_id}>
                    <td>{i.sku_id}</td>
                    <td>{i.product_name}</td>
                    <td>{i.option_name}</td>
                    <td>
                      {editing ? (
                        <input type="number" min={0} value={draft[i.sku_id] ?? i.stock}
                          onChange={(e) => setDraft((d) => ({ ...d, [i.sku_id]: Math.max(0, Number(e.target.value)) }))}
                          style={{ width: 70 }} />
                      ) : (
                        <span>{i.stock}개</span>
                      )}
                    </td>
                    <td>{isLow ? <span className="badge" data-safety-status="LOW">부족</span> : '-'}</td>
                    <td><span className="badge" data-stock-status={i.status}>{STOCK_STATUS_LABEL[i.status]}</span></td>
                    <td>{i.updated_at}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap"><p className="state-msg">조건에 맞는 재고가 없습니다.</p></div>
      )}

      <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />

      {history.length > 0 && (
        <div className="detail-section" style={{ marginTop: 20 }}>
          <div className="detail-section__head">
            <h2 className="section-title" style={{ marginBottom: 0 }}>재고 변경 이력</h2>
            <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }}
              onClick={() => setShowHistory((v) => !v)}>{showHistory ? '접기' : `펼치기 (${history.length})`}</button>
          </div>
          {showHistory && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>변경일시</th><th>SKU ID</th><th>상품명</th><th>옵션</th><th>변경 전</th><th>변경 후</th></tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr key={`${h.sku_id}-${h.at}-${idx}`}>
                      <td>{h.at}</td>
                      <td>{h.sku_id}</td>
                      <td>{h.product_name}</td>
                      <td>{h.option_name}</td>
                      <td>{h.before}개</td>
                      <td>{h.after}개</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
