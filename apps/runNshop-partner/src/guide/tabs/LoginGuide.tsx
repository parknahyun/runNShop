'use client'

export default function LoginGuide() {
  return (
    <div>
      <h2 className="section-title">로그인(Auth) 화면 구성</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Shell 이전에 단독으로 표시되는 전체 페이지. 인증 성공 시 AppShell로 전환됩니다.</p>

      {/* 화면구성 (시각적 레이아웃) */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div id="layout-wrapper" style={{ background: '#ffffff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div id="layout-inner" style={{ width: 380, background: '#f5f6fa', borderRadius: 8, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '12px 0' }}>
          <div style={{ width: 300, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 20 }}>
            {/* 로고 영역 */}
            <div id="area-logo" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: 6, marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>🏪 Partners</span>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>런앤샵 입점사 BO</p>
              </div>
            </div>
            {/* 입력 폼 */}
            <div id="area-form" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: 6, marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'block' }}>이메일</label>
                  <div style={{ height: 30, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px', display: 'flex', alignItems: 'center', fontSize: 12, color: '#94a3b8' }}>partner@nike.co.kr</div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'block' }}>비밀번호</label>
                  <div style={{ height: 30, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px', display: 'flex', alignItems: 'center', fontSize: 12, color: '#94a3b8' }}>••••••••</div>
                </div>
                <div style={{ height: 34, background: '#c2410c', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600, marginTop: 4 }}>로그인</div>
              </div>
            </div>
            {/* 하단 링크 */}
            <div id="area-links" style={{ border: '1px dashed #94a3b8', borderRadius: 6, padding: 6 }}>
              <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 16 }}>
                <span style={{ fontSize: 11, color: '#c2410c' }}>아이디 찾기</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>비밀번호 찾기</span>
              </div>
            </div>
          </div>
        </div>
        {/* 영역명 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 11, color: '#64748b', gap: 0, minWidth: 70 }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center' }}>← 로고 영역</div>
          <div style={{ height: 160, display: 'flex', alignItems: 'center' }}>← 입력 폼</div>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>← 하단 링크</div>
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
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>로고 영역</td><td>앱 아이콘 + 앱명 + 부가 설명 (중앙 정렬)</td></tr>
            <tr><td>2</td><td>입력 폼</td><td>이메일(필수) + 비밀번호(필수, 8자+영문+숫자) + 로그인 버튼</td></tr>
            <tr><td>3</td><td>하단 링크</td><td>아이디 찾기 + 비밀번호 찾기 — 입점 신청 자체는 이 앱이 아니라 플랫폼 어드민의 승인 절차(입점 신청 심사)를 통해 별도로 이루어지므로 이 화면에는 &quot;입점 신청&quot; 링크를 두지 않는다</td></tr>
          </tbody>
        </table>
      </div>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>Shell 이전 단독 전체 페이지 (NavBar/TabBar 없음)</li>
        <li>로그인 성공 → AppShell(메뉴+탭+대시보드)로 전환</li>
        <li>프로토타입: API 항상 성공 응답</li>
        <li>로그인 실패 5회 잠금: UI 안내 구현, 실제 잠금 미적용</li>
        <li>세션 만료 없이 항상 로그인 유지</li>
        <li>이 앱은 단일 입점사 계정 전용이므로, 로그인 후 입점사를 선택하는 화면은 없다 (로그인 = 그 입점사로 즉시 진입)</li>
      </ul>
    </div>
  )
}
