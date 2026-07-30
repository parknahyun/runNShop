'use client'

export default function ListGuide() {
  return (
    <div>
      <h2 className="section-title">현황목록 (Table) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>검색·필터·요약·테이블·페이지네이션으로 구성된 현황 화면. MDI 탭으로 열립니다.</p>

      {/* 화면구성 (시각적 레이아웃) */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div id="layout-wrapper" style={{ width: 1000, background: '#ffffff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 16 }}>
        <div id="layout-inner" style={{ width: 900, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'visible' }}>
          {/* TitleBar */}
          <div id="area-title" style={{ padding: '16px 20px 8px', background: '#fff', border: '1px dashed #94a3b8' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>상품 목록</span>
          </div>
          {/* FilterBar */}
          <div id="area-filter" style={{ padding: '8px 20px', background: '#fff', border: '1px dashed #94a3b8' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px' }}>
              <span style={{ fontSize: 11, color: '#94a3b8', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff' }}>전체 상태 ▾</span>
              <span style={{ fontSize: 11, color: '#94a3b8', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff' }}>상품명 · 카테고리</span>
              <span style={{ fontSize: 11, color: '#fff', padding: '6px 14px', borderRadius: 6, background: '#c2410c', fontWeight: 600 }}>조회</span>
            </div>
          </div>
          {/* SummaryBar + Toolbar */}
          <div id="area-summary" style={{ padding: '12px 20px', border: '1px dashed #94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff' }}>전체 <b>8개</b></span>
                <span style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #60a5fa', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8', fontWeight: 600 }}>판매중 <b>5개</b></span>
                <span style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #fca5a5', borderRadius: 6, background: '#fef2f2', color: '#dc2626' }}>⚠ 품절 <b>1개</b></span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#374151', padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff' }}>엑셀 다운로드</span>
                <span style={{ fontSize: 11, color: '#fff', padding: '6px 12px', borderRadius: 6, background: '#1e293b', fontWeight: 600 }}>+ 상품 등록</span>
              </div>
            </div>
          </div>
          {/* Table */}
          <div id="area-table" style={{ border: '1px dashed #94a3b8', padding: '8px 20px 16px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['상품ID', '상품명', '카테고리', '상태', '판매가', '재고', '평점', '최종수정'].map((col) => (
                      <th key={col} style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 101, name: '나이키 페가수스 41', cat: '러닝화', active: true, price: '152,000원' },
                    { id: 102, name: '나이키 보메로 18', cat: '러닝화', active: true, price: '189,000원' },
                    { id: 104, name: '나이키 에어 줌 스트럭쳐 25', cat: '러닝화', active: false, price: '159,000원' },
                  ].map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', color: '#c2410c', fontWeight: 500 }}>{row.id}</td>
                      <td style={{ padding: '10px', fontWeight: 500, color: '#1e293b' }}>{row.name}</td>
                      <td style={{ padding: '10px', color: '#64748b' }}>{row.cat}</td>
                      <td style={{ padding: '10px' }}><span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: row.active ? '#dcfce7' : '#fee2e2', color: row.active ? '#15803d' : '#dc2626', fontWeight: 600 }}>{row.active ? '판매중' : '품절'}</span></td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{row.price}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{row.active ? '22개' : '0개'}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>★ 4.5</td>
                      <td style={{ padding: '10px', color: '#94a3b8', fontSize: 10 }}>2026.06.24 10:15</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div id="area-pagination" style={{ padding: '8px 20px 16px', border: '1px dashed #94a3b8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 24, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#94a3b8' }}>‹</span>
              <span style={{ width: 24, height: 24, background: '#1e293b', color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</span>
              <span style={{ width: 24, height: 24, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#64748b' }}>2</span>
              <span style={{ width: 24, height: 24, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#94a3b8' }}>›</span>
            </div>
          </div>
        </div>
        {/* 영역명 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 11, color: '#64748b', gap: 0, minWidth: 90 }}>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>← 타이틀 영역</div>
          <div style={{ height: 52, display: 'flex', alignItems: 'center' }}>← 필터 영역</div>
          <div style={{ height: 44, display: 'flex', alignItems: 'center' }}>← 요약 영역</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>← 테이블 영역</div>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>← 페이지네이션 영역</div>
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
              <th>노출 조건</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>타이틀 영역</td><td>메뉴(화면)명만 표시</td><td>항상</td><td>약 30px (1줄)</td></tr>
            <tr><td>2</td><td>필터 영역</td><td>상태 드롭다운 + 키워드 검색 + 조회 버튼</td><td>항상</td><td>약 64px (1줄)</td></tr>
            <tr><td>3</td><td>요약 영역</td><td>전체/상태별 카운트 + 엑셀 다운로드·등록 버튼. 반드시 <code>&lt;div className=&quot;op-summary-row&quot;&gt;</code> 하나로 두 블록을 함께 감싸서 한 줄에 배치한다 (아래 규칙 참조)</td><td>항상</td><td>약 84px (2줄: 라벨+카운트)</td></tr>
            <tr><td>4</td><td>테이블 영역</td><td>화면별 컬럼 구성 + 상태 배지</td><td>항상</td><td>가변 (행 수에 따라, 행당 약 40px)</td></tr>
            <tr><td></td><td></td><td style={{ paddingLeft: 16 }}>• 행 클릭 → 상세화면 오픈 (화면별로 팝업 또는 탭, 아래 &quot;상세화면&quot; 탭 참고)</td><td></td><td></td></tr>
            <tr><td>5</td><td>페이지네이션 영역</td><td>공통 컴포넌트 (페이지 + 사이즈 변경)</td><td>항상</td><td>약 32px (1줄)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>
          <strong>admin 앱과의 핵심 차이</strong>: admin 앱은 조회 버튼을 누르기 전까지 데이터를 숨기지만,
          이 앱(partner)은 진입 시 <strong>전체 목록을 즉시 표시</strong>한다 (<code>ProductList.tsx</code> 등 기존 화면 참고).
          조회 버튼은 필터 조건을 적용해 <code>displayed</code>를 다시 계산하는 용도로만 쓴다
        </li>
        <li>Enter 키로도 조회 가능</li>
        <li>행 클릭 → 상세화면 오픈. 대부분 팝업(모달)이지만, 상세를 열어둔 채 다른 작업을 병행할 필요가 있는 화면(예: 주문 목록)은 탭으로 열 수도 있다 (아래 &quot;상세화면&quot; 탭의 호출방식 옵션 참고)</li>
        <li>등록 버튼이 있는 화면은 등록 모달 오픈, 없는 화면(클레임·정산 등 읽기 전용 목록)은 등록 버튼 자체를 두지 않는다</li>
        <li>페이지 사이즈 변경 시 1페이지로 리셋</li>
        <li>지원하지 않는 기능(엑셀 업로드/다운로드 등)은 실제 동작 없이 <code>alert(&apos;프로토타입에서는 지원하지 않는 기능입니다.&apos;)</code>로 안내한다</li>
        <li>
          <strong>SummaryBar와 Toolbar는 반드시 <code>op-summary-row</code>로 함께 감싼다</strong> — 둘을 따로따로 렌더링하면
          <code>summary-bar</code>가 자기 줄을 다 차지해버려 <code>pgm-toolbar</code>(버튼 영역)가 다음 줄로 밀려 내려가고,
          SummaryBar 높이도 의도보다 커 보이는 레이아웃 버그가 생긴다 (실제로 발생했던 버그).
          올바른 마크업:
          <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginTop: 6, marginBottom: 6, overflowX: 'auto' }}>
{`<div className="op-summary-row">
  <div className="summary-bar">...</div>
  <div className="pgm-toolbar">...</div>
</div>`}
          </pre>
          <code>.op-summary-row</code>는 <code>globals.css</code>에 이미 정의되어 있다 (두 자식을 <code>flex: 1</code>로 나눠 한 줄에 배치) — 새 CSS를 추가할 필요 없이 마크업만 이 구조로 감싸면 된다.
        </li>
      </ul>
    </div>
  )
}
