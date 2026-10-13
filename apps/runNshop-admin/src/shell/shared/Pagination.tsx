'use client'
import { useState } from 'react'

export const PAGE_SIZE_OPTIONS = [7, 14, 30, 50, 100]

export function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: {
  page: number; totalPages: number; pageSize: number
  onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void
}) {
  return (
    <div className="pagination">
      <select className="pagination__size" value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}>
        {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}개</option>)}
      </select>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>←</button>
      <span>{page} / {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>→</button>
    </div>
  )
}

export function usePager<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const slice = items.slice((page - 1) * pageSize, page * pageSize)
  return { page, setPage, totalPages, slice }
}

export function MiniPager({ page, totalPages, onChange }: {
  page: number; totalPages: number; onChange: (p: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="mini-pager">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>‹</button>
      <span>{page} / {totalPages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>›</button>
    </div>
  )
}
