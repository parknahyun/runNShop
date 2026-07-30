'use client'
import { type Template, TEMPLATE_TYPE_LABEL } from '../mockData'
import { useTabContext } from '@/shell/TabContext'
import { MOCK_PAGES } from '../../page/mockData'
import PageDetail from '../../page/PageDetail'

export default function PagesTab({ template }: { template: Template }) {
  const { openTab } = useTabContext()

  const pages = template.usedPageCount > 0
    ? Array.from({ length: template.usedPageCount }, (_, i) => ({
        pageId: `PG-${String(i + 1).padStart(3, '0')}`,
        pageName: `${TEMPLATE_TYPE_LABEL[template.templateType]} 페이지 ${i + 1}`,
        status: i === 0 ? '게시중' : i === 1 ? '예약' : '미게시',
        publishedAt: i === 0 ? '26-06-20 09:00' : i === 1 ? '26-07-01 00:00 (예정)' : '26-07-15 09:00 (예정)',
        updatedAt: `26-06-${20 - i} 10:00`,
      }))
    : []

  function handlePageClick(pageId: string) {
    const eventPage = MOCK_PAGES.find(p => p.pageId === pageId)
    if (eventPage) {
      openTab({
        id: `page-detail/${pageId}`,
        label: `페이지 ${pageId}`,
        element: <PageDetail eventPage={eventPage} currentUser="admin" onClose={() => {}} onUpdate={() => {}} />,
      })
    }
  }

  return (
    <div className="tab-panel-content">
      <section className="detail-section" style={{ marginTop: 0 }}>
        <div className="section-title-row">
          <h2 className="section-title">적용 페이지 <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>{pages.length}개</span></h2>
        </div>
        {pages.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>페이지ID</th>
                  <th>페이지명</th>
                  <th>상태</th>
                  <th>게시일시</th>
                  <th>최종수정</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.pageId}>
                    <td className="link-cell" onClick={() => handlePageClick(p.pageId)} style={{ cursor: 'pointer' }}>{p.pageId}</td>
                    <td style={{ fontWeight: 500 }}>{p.pageName}</td>
                    <td>
                      <span className="badge" data-product-status={p.status === '게시중' ? 'ON_SALE' : p.status === '예약' ? 'RESERVED' : 'DRAFT'}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{p.publishedAt || '—'}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{p.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="state-msg">이 템플릿을 사용하는 페이지가 없습니다.</p>
        )}
      </section>
    </div>
  )
}
