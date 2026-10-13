'use client'
import { type LoginHistory } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

export default function LoginHistoryTab({ history }: { history: LoginHistory[] }) {
  const pager = usePager(history, 3)
  return (
    <div className="tab-panel-content">
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>일시</th><th>IP</th><th>기기</th><th>결과</th></tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={4} className="state-msg">이력이 없습니다.</td></tr>
              : pager.slice.map((h, i) => (
                <tr key={i}>
                  <td>{h.loginAt}</td>
                  <td>{h.ip}</td>
                  <td>{h.device}</td>
                  <td>
                    <span className="badge" data-login-result={h.result}>
                      {h.result === 'SUCCESS' ? '성공' : '실패'}
                    </span>
                  </td>
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
