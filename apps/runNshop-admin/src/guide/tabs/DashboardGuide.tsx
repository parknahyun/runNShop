'use client'

export default function DashboardGuide() {
  return (
    <div>
      <h2 className="section-title">대시보드 (Dashboard) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>첫 번째 고정 탭. KPI 카드와 운영 현황을 표시합니다.</p>

      {/* 화면구성 (시각적 레이아웃) */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div id="layout-wrapper" style={{ width: 1000, background: '#ffffff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 16 }}>
        <div id="layout-inner" style={{ width: 900, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'visible', background: '#f5f6fa', padding: 20 }}>
          {/* 타이틀 영역 */}
          <div id="area-title" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: '8px 12px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>대시보드</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>2026년 6월 26일 (목) 09:35 기준</span>
            </div>
          </div>
          {/* 카드 영역 */}
          <div id="area-cards" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
              {[
                { icon: '🛒', title: '주문 현황', metrics: '금일 47건 · 배송중 15 · 실패 3' },
                { icon: '📋', title: '클레임 현황', metrics: '취소 5 · 반품 3 · 교환 1' },
                { icon: '📦', title: '상품 현황', metrics: '판매중 1,247 · 품절 89 · 심사 15' },
              ].map((card) => (
                <div key={card.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span>{card.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{card.title}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b' }}>{card.metrics}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11 }}>👥 회원 현황 카드</div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11 }}>추가 카드 영역</div>
            </div>
          </div>
        </div>
        {/* 영역명 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 11, color: '#64748b', gap: 0, minWidth: 70 }}>
          <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>← 타이틀 영역</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>← 카드 영역</div>
        </div>
      </div>

      {/* 영역 정의 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>영역 정의</h3>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead>
            <tr>
              <th>순서</th>
              <th>영역</th>
              <th>설명</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>타이틀 영역</td><td>대시보드 제목 + 기준 일시(리플레쉬)</td><td>약 30px (1줄)</td></tr>
            <tr><td>2</td><td>카드 영역</td><td>KPI 카드 그리드 (2~3열). 주문·클레임·상품·회원 등 현황 카드</td><td>가변 (카드 내용에 따라)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>대시보드는 첫 번째 <strong>pinned 탭</strong>으로 고정 (닫기 불가)</li>
        <li>새 대시보드는 기존 구조를 복사 후 카드 구성만 교체</li>
        <li>동일한 카드 UI는 공통 컴포넌트로 분리</li>
        <li>카드 내부: 지표 숫자 나열 또는 미니 테이블</li>
      </ul>
    </div>
  )
}
