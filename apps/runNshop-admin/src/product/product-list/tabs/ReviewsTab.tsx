'use client'
import { type Product } from '../mockData'

export default function ReviewsTab({ product, onToggleHidden, readOnly = false }: {
  product: Product
  onToggleHidden: (reviewId: string) => void
  readOnly?: boolean
}) {
  const avgRating = product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : '-'

  return (
    <div className="tab-panel-content">
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>상품평 ({product.reviews.length}건 · 평균 {avgRating}점)</span>
      </div>

      {product.reviews.length === 0 ? (
        <div className="table-wrap">
          <p className="state-msg">등록된 상품평이 없습니다.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>상품평ID</th>
                <th>작성자</th>
                <th>평점</th>
                <th>상품평내용</th>
                <th>노출상태</th>
                <th>등록일</th>
                <th style={{ width: 90 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {product.reviews.map((r) => (
                <tr key={r.reviewId} style={{ opacity: r.hidden ? 0.5 : 1 }}>
                  <td style={{ fontSize: 12 }}>{r.reviewId}</td>
                  <td style={{ fontWeight: 500 }}>{r.memberName}</td>
                  <td style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td style={{ fontSize: 12 }}>{r.content}</td>
                  <td style={{ fontSize: 12 }}>{r.hidden ? '숨김' : '노출'}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{r.createdAt}</td>
                  <td>
                    <button className={`btn-tool ${r.hidden ? 'btn-tool--add' : 'btn-tool--delete'}`}
                      style={{ height: 24, padding: '0 8px', fontSize: 11 }}
                      disabled={readOnly} onClick={() => onToggleHidden(r.reviewId)}>{r.hidden ? '복원' : '숨김처리'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
