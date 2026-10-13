'use client'
import { type ScreenAccessHistory } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

export default function ScreenHistoryTab({ history }: { history: ScreenAccessHistory[] }) {
  const pager = usePager(history, 3)
  return (
    <div className="tab-panel-content">
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>일시</th><th>메뉴</th><th>화면</th><th>액션</th><th>IP</th></tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={5} className="state-msg">이력이 없습니다.</td></tr>
              : pager.slice.map((h, i) => (
                <tr key={i}>
                  <td>{h.accessAt}</td>
                  <td>{h.menu}</td>
                  <td>{h.screen}</td>
                  <td>
                    <span className={`badge ${h.action === '수정' ? 'op-action--write' : 'op-action--read'}`}>
                      {h.action}
                    </span>
                  </td>
                  <td>{h.ip}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <MiniPager page={pager.page} totalPages={pager.totalPages} onChange={pager.setPage} />
    </div>
  )
}
