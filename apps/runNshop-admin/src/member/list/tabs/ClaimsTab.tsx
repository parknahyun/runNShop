'use client'
import { type Member } from '../mockData'

export default function ClaimsTab({ member }: { member: Member }) {
  return (
    <div className="tab-panel-content">
      {member.claims.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">클레임 이력이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>클레임번호</th>
                <th>유형</th>
                <th>상태</th>
                <th>환불금액</th>
                <th>신청일시</th>
              </tr>
            </thead>
            <tbody>
              {member.claims.map((c) => (
                <tr key={c.claimNo}>
                  <td style={{ fontSize: 12 }}>{c.claimNo}</td>
                  <td style={{ fontSize: 12 }}>{c.claimType}</td>
                  <td style={{ fontSize: 12 }}>{c.status}</td>
                  <td className="amount-cell">{c.refundAmount.toLocaleString()}원</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{c.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
