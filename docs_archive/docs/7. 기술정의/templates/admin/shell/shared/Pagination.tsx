'use client'

interface Props {
  page: number
  totalPages: number
  pageSize: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
}

export function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: Props) {
  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>
      <span>{page} / {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>›</button>
      <select className="pagination__size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
        <option value={10}>10건</option>
        <option value={20}>20건</option>
        <option value={50}>50건</option>
      </select>
    </div>
  )
}
