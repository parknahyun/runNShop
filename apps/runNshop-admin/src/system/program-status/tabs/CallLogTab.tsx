'use client'
import { type Program, type LogRoleGroup, ROLE_GROUP_LABEL } from '../mockData'
import { usePager, MiniPager } from '@/shell/shared/Pagination'

function RoleGroupBadge({ roleGroup }: { roleGroup: LogRoleGroup }) {
  return (
    <span className="badge"
      data-op-role={roleGroup !== 'SYSTEM' ? roleGroup : undefined}
      data-log-role={roleGroup === 'SYSTEM' ? 'SYSTEM' : undefined}>
      {ROLE_GROUP_LABEL[roleGroup]}
    </span>
  )
}

export default function CallLogTab({ program }: { program: Program }) {
  const pager = usePager(program.logs, 5)

  return (
    <div className="tab-panel-content">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>호출 일시</th>
              <th>운영자</th>
              <th>권한 그룹</th>
              <th>요청 URI</th>
              <th style={{ textAlign: 'center' }}>상태코드</th>
              <th style={{ textAlign: 'right' }}>응답시간</th>
            </tr>
          </thead>
          <tbody>
            {pager.slice.length === 0
              ? <tr><td colSpan={6} className="state-msg">호출 로그가 없습니다.</td></tr>
              : pager.slice.map((log, i) => (
                <tr key={i} data-pgm-log-error={log.statusCode >= 400}>
                  <td>{log.calledAt}</td>
                  <td>{log.operatorName}</td>
                  <td><RoleGroupBadge roleGroup={log.roleGroup} /></td>
                  <td className="pgm-uri pgm-uri--sm">{log.requestUri}</td>
                  <td className="op-perm-cell">
                    <span className="badge" data-http-status={log.statusCode >= 400 ? 'error' : 'ok'}>
                      {log.statusCode}
                    </span>
                  </td>
                  <td className="amount-cell">{log.durationMs.toLocaleString()}ms</td>
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
