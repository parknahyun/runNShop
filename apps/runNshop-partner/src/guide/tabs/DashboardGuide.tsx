'use client'

export default function DashboardGuide() {
  return (
    <div>
      <h2 className="section-title">대시보드 (Dashboard) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>첫 번째 고정 탭. 이 입점사의 운영 현황 카드를 표시합니다.</p>

      {/* 화면구성 (시각적 레이아웃) */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div id="layout-wrapper" style={{ width: 1000, background: '#ffffff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 16 }}>
        <div id="layout-inner" style={{ width: 900, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'visible', background: '#f5f6fa', padding: 20 }}>
          {/* 타이틀 영역 */}
          <div id="area-title" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: '8px 12px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>나이키코리아 · 대시보드</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>2026년 6월 26일 (목) 기준 · 우수 (Pacer) 78점</span>
            </div>
          </div>
          {/* 카드 영역 */}
          <div id="area-cards" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { icon: '🛒', title: '주문 현황', metrics: '오늘 주문 12 · 출고 대기 5 · 클레임 3' },
                { icon: '⚡', title: '처리 필요', metrics: '출고대기 5 · 반품수거 2 · 교환수거 1 · QnA답변 7' },
                { icon: '📦', title: '내 상품 현황', metrics: '판매중 87 · 품절 12 · 심사중 3 · 반려 1' },
                { icon: '📢', title: '공지사항', metrics: '플랫폼 공지 목록 (최신 3건)' },
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
            <tr><td>1</td><td>타이틀 영역</td><td>입점사명 + 대시보드 제목 + 기준 일시 · 현재 등급(예: 우수/Pacer) 및 활동점수</td><td>약 30px (1줄)</td></tr>
            <tr><td>2</td><td>카드 영역</td><td>2열 그리드. 주문 현황·처리 필요(출고대기/반품수거/교환수거/QnA답변)·내 상품 현황·공지사항 카드</td><td>가변 (카드 내용에 따라)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>대시보드는 첫 번째 <strong>pinned 탭</strong>으로 고정 (닫기 불가)</li>
        <li>이 앱은 단일 입점사 전용이므로, 모든 카드는 로그인한 입점사 자신의 데이터만 보여준다 (다른 입점사 데이터 노출 금지)</li>
        <li>&quot;처리 필요&quot; 카드는 출고·수거·QnA 답변처럼 이 입점사가 지금 액션을 취해야 하는 항목만 모아 보여준다 — 건수가 0보다 크면 강조색(<code>dash-claim--warn</code>)으로 표시</li>
        <li>카드 내부 지표는 <code>Metric</code> 컴포넌트(<code>dash-metric</code>) 재사용, 위험/경고 수치는 <code>variant=&quot;warn&quot;</code>·<code>&quot;danger&quot;</code>로 강조</li>
        <li>새 카드 추가 시 기존 <code>dash-card</code> 구조를 복사 후 내용만 교체</li>
      </ul>
    </div>
  )
}
