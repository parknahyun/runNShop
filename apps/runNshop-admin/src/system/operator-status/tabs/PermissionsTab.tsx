'use client'
import { type OperatorPermission } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

export default function PermissionsTab({ permissions }: { permissions: OperatorPermission[] }) {
  const pager = usePager(permissions, 5)
  return (
    <div className="tab-panel-content">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>프로그램</th>
              <th style={{ textAlign: 'center' }}>조회</th>
              <th style={{ textAlign: 'center' }}>수정</th>
            </tr>
          </thead>
          <tbody>
            {pager.slice.map((p) => (
              <tr key={p.menu}>
                <td>{p.menu}</td>
                <td className="op-perm-cell">
                  {p.read
                    ? <span className="op-perm op-perm--on">✓</span>
                    : <span className="op-perm op-perm--off">—</span>}
                </td>
                <td className="op-perm-cell">
                  {p.write
                    ? <span className="op-perm op-perm--on">✓</span>
                    : <span className="op-perm op-perm--off">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MiniPager page={pager.page} totalPages={pager.totalPages} onChange={pager.setPage} />
    </div>
  )
}
