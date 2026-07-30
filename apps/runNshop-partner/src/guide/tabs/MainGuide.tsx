'use client'

function Hint({ text }: { text: string }) {
  return (
    <span
      title={text}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 14, height: 14, borderRadius: '50%', background: '#e2e8f0', color: '#475569',
        fontSize: 10, fontWeight: 700, marginLeft: 5, cursor: 'help', verticalAlign: 'middle',
      }}
    >?</span>
  )
}

export default function MainGuide() {
  return (
    <div>
      <h2 className="section-title">메인프레임 (Shell) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        메뉴영역 → 탭영역 → 컨텐츠 3단 수직 구조. 권장 해상도 <strong>1440×900px</strong>, 최소 지원 너비 <strong>1280px</strong>
        <Hint text={
          '900px는 OS 화면 해상도 기준값이며, 실제 브라우저 뷰포트 높이는 OS 메뉴바·작업표시줄 + 브라우저 탭·주소창만큼 줄어든다.\n' +
          'macOS + Chrome 기준 OS 메뉴바 25px + 브라우저 탭바·주소창 75px ≈ 100px 차감 → 실제 약 800px.\n' +
          '별도의 모바일 반응형 대응은 없다.'
        } />
      </p>

      {/* 프레임 구성도 (시각적 레이아웃) */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>프레임 구성도</h3>
      <div id="layout-wrapper" style={{ width: 1000, background: '#ffffff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 16 }}>
        <div id="layout-inner" style={{ width: 900, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'visible' }}>
          {/* 메뉴 영역 */}
          <div id="area-menu" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
            <div style={{ height: 48, background: '#1e293b', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16 }}>
              <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>🏪 Partners</span>
              <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                {['상품 관리', '주문 관리', '클레임 관리', '정산 관리', '커뮤니티', '프로모션', '통계', '운영 설정'].map((m) => (
                  <span key={m} style={{ fontSize: 11, color: '#94a3b8', padding: '4px 8px', borderRadius: 4 }}>{m}</span>
                ))}
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>partner@nike.co.kr | 로그아웃</span>
            </div>
          </div>
          {/* 탭 영역 */}
          <div id="area-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
            <div style={{ height: 36, background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', padding: '0 8px', gap: 2 }}>
              <span style={{ fontSize: 11, background: '#fff', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '6px 6px 0 0', padding: '6px 12px', fontWeight: 700, color: '#1e293b' }}>📌 대시보드</span>
              <span style={{ fontSize: 11, background: '#fff', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '6px 6px 0 0', padding: '6px 12px', color: '#1e293b', fontWeight: 600 }}>주문 목록 ×</span>
              <span style={{ fontSize: 11, padding: '6px 12px', color: '#64748b' }}>반품 목록 ×</span>
              <span style={{ fontSize: 11, padding: '6px 12px', color: '#64748b' }}>재고 관리 ×</span>
            </div>
          </div>
          {/* 컨텐츠 영역 */}
          <div id="area-content" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
            <div style={{ height: 200, background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>컨텐츠 영역</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>활성 탭의 화면 렌더링 (대시보드 or 현황목록 탭)</p>
              </div>
            </div>
          </div>
        </div>
        {/* 영역명 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 11, color: '#64748b', gap: 0, minWidth: 90 }}>
          <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>← 메뉴 영역 · 56px</div>
          <div style={{ height: 36, display: 'flex', alignItems: 'center' }}>← 탭 영역 · 40px</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>← 컨텐츠 영역 · 약 704px</div>
        </div>
      </div>

      {/* 영역 정의 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>영역 정의</h3>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead>
            <tr>
              <th>영역</th>
              <th>설명</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>메뉴 영역</td>
              <td>로고(좌측) + 1depth 메뉴 최대 9개(중앙, 클릭 시 드롭다운) + 사용자 정보(우측). 이 앱은 단일 입점사(예: 나이키코리아) 전용이므로 입점사 선택 UI는 없다</td>
              <td>
                <strong>56px</strong>
                <Hint text="높이 56px 고정, 너비는 뷰포트 전체(100%), 좌우 패딩 24px." />
              </td>
            </tr>
            <tr>
              <td>탭 영역</td>
              <td>대시보드(📌 고정, 닫기 불가) + 일반 탭(최대 8개, 닫기 가능)</td>
              <td>
                <strong>40px</strong>
                <Hint text="높이 40px 고정, 너비는 뷰포트 전체. 탭이 넘치면 가로 스크롤." />
              </td>
            </tr>
            <tr>
              <td>컨텐츠 영역</td>
              <td>활성 탭의 화면 렌더링 (대시보드 or 현황목록)</td>
              <td>
                <strong>약 704px</strong>
                <Hint text={
                  '높이 calc(100vh - 96px) — 메뉴 56px + 탭 40px을 제외한 나머지. 실제 뷰포트 800px 기준 약 704px.\n' +
                  '너비는 뷰포트 전체이지만 내부 .page 콘텐츠는 최대 1200px로 중앙 정렬된다.\n' +
                  '1440px 기준 좌우 여백 각 120px, 1280px(최소 지원 너비) 기준 각 40px.'
                } />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>대시보드는 첫 번째 <strong>pinned 탭</strong>으로 고정 (닫기 불가)</li>
        <li>1depth 메뉴 클릭 → 드롭다운 열림 → 2depth 화면 선택 → 탭으로 오픈</li>
        <li>이미 열려 있는 화면 클릭 → 해당 탭으로 이동 (중복 오픈 안 함)</li>
        <li>탭 최대 8개 초과 시 안내 배지 표시, 기존 탭 닫기 후 열기</li>
        <li>활성 탭: 흰색 배경 + 볼드체 / 비활성: 회색 텍스트</li>
        <li>구현 완료된 메뉴에는 초록 원(●) 표시</li>
      </ul>
    </div>
  )
}
