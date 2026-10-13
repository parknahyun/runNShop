'use client'

export default function DetailGuide() {
  return (
    <div>
      <h2 className="section-title">상세화면 (Detail) 구조</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        목록 화면에서 행 클릭 시 여는 상세. <strong>팝업(모달)</strong> 또는 <strong>MDI 탭</strong> 두 가지 호출방식을 지원하며,
        내부(InnerTabs·탭 컴포넌트)는 완전히 동일한 소스를 공유한다 — 아래 &quot;호출방식&quot; 절 참조.
        admin 앱과 동일하게 <code>src/shell/shared/DetailShell.tsx</code>·<code>useDetailOpener.ts</code>를 그대로 이식해서 쓴다.
      </p>

      {/* 화면구성 (시각적 레이아웃) — 팝업 모드 / 탭 모드 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>화면구성</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>

        {/* 팝업 모드 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>① 팝업 모드 (<code>mode=&apos;modal&apos;</code>)</div>
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', background: 'rgba(15,23,42,0.15)', borderRadius: 8, padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ width: '100%', background: '#fff', borderRadius: 12, overflow: 'visible', boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }}>
                {/* 헤더 영역 */}
                <div id="area-header" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>ORD-20260626-001</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>#1</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>결제완료</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>홍*동</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 15, color: '#94a3b8', cursor: 'pointer' }}>✕</span>
                  </div>
                </div>
                {/* 탭 바 */}
                <div id="area-tabbar" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', padding: '0 16px' }}>
                    <span style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #c2410c', marginBottom: -2 }}>주문정보</span>
                    <span style={{ padding: '8px 12px', fontSize: 11, color: '#64748b' }}>처리이력</span>
                  </div>
                </div>
                {/* 탭 콘텐츠 */}
                <div id="area-tab-content" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>주문 정보</div>
                    {[
                      { dt: '주문ID', dd: '1' },
                      { dt: '상품명', dd: '나이키 페가수스 41' },
                    ].map((row) => (
                      <div key={row.dt} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>{row.dt}</span>
                        <span style={{ color: '#1e293b', fontWeight: 600 }}>{row.dd}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '10px 16px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 10, padding: '5px 12px', border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569' }}>취소</span>
                    <span style={{ fontSize: 10, color: '#fff', padding: '5px 12px', borderRadius: 6, background: '#1e293b', fontWeight: 600 }}>저장</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
            화면 위에 오버레이로 뜨는 카드. 자체 닫기(✕) 버튼을 갖는다. 클레임·정산·QnA 등 대부분의 화면이 이 방식을 쓴다.
            편집 중인 탭 하단에는 취소/저장 Footer가 붙는다.
          </p>
        </div>

        {/* 탭 모드 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>② 탭 모드 (<code>mode=&apos;tab&apos;</code>)</div>
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            {/* MDI 탭바 (컨텍스트 표시용) */}
            <div style={{ height: 28, background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', padding: '0 6px', gap: 2, marginBottom: 12, borderRadius: '4px 4px 0 0' }}>
              <span style={{ fontSize: 10, background: '#fff', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '4px 4px 0 0', padding: '4px 8px', color: '#64748b' }}>📌 대시보드</span>
              <span style={{ fontSize: 10, background: '#fff', border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '4px 4px 0 0', padding: '4px 8px', fontWeight: 700, color: '#1e293b' }}>주문 ORD-20260626-001 ×</span>
            </div>
            {/* 헤더 영역 (page-title-row, 닫기 버튼 없음) */}
            <div id="area-header-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0, marginBottom: 4 }}>
              <div style={{ padding: '4px 4px 14px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>ORD-20260626-001</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>#1</span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>결제완료</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>홍*동</span>
                </div>
              </div>
            </div>
            {/* 탭 바 */}
            <div id="area-tabbar-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
              <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', padding: '0 4px' }}>
                <span style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #c2410c', marginBottom: -2 }}>주문정보</span>
                <span style={{ padding: '8px 12px', fontSize: 11, color: '#64748b' }}>처리이력</span>
              </div>
            </div>
            {/* 탭 콘텐츠 */}
            <div id="area-tab-content-tab" style={{ border: '1px dashed #94a3b8', borderRadius: 0, margin: 0 }}>
              <div style={{ padding: '16px 4px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>주문 정보</div>
                {[
                  { dt: '주문ID', dd: '1' },
                  { dt: '상품명', dd: '나이키 페가수스 41' },
                ].map((row) => (
                  <div key={row.dt} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                    <span style={{ color: '#64748b' }}>{row.dt}</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{row.dd}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '10px 4px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 10, padding: '5px 12px', border: '1px solid #cbd5e1', borderRadius: 6, color: '#475569' }}>취소</span>
                <span style={{ fontSize: 10, color: '#fff', padding: '5px 12px', borderRadius: 6, background: '#1e293b', fontWeight: 600 }}>저장</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
            오버레이 없이 MDI 탭 콘텐츠 영역에 페이지처럼 그려진다. 카드·그림자·✕ 버튼이 없고, 닫기는 상단 탭바의 × 버튼이 담당한다.
            헤더·탭바·탭콘텐츠·Footer 구성은 팝업 모드와 완전히 동일한 소스를 재사용한다.
            <code>order/order-list/OrderListPage.tsx</code>가 실제로 이 방식을 쓰는데, 편집 폼이 아니라 상태 전이 화면이라
            Footer에는 취소/저장 대신 &quot;출고 처리&quot; 버튼 하나만 둔다 — Footer 자리는 같고 버튼 구성만 화면에 맞게 바뀐다.
          </p>
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
            <tr><td>1</td><td>헤더 영역</td><td>타이틀(주문번호 등) + 부가정보(ID, 배지, 금액) + 닫기(✕, 팝업 모드에서만)</td><td>약 76px (2줄: 타이틀+배지 행)</td></tr>
            <tr><td>2</td><td>탭 바 영역</td><td><code>InnerTabs</code> 버튼. 활성 탭: 진한 하단선</td><td>약 40px (1줄)</td></tr>
            <tr><td>3</td><td>탭 콘텐츠 영역</td><td>활성 탭의 내용. 읽기(<code>info-grid</code>) ↔ 편집(<code>add-form</code>) 전환. 좌우 여백은 <code>tab-panel-content</code> 클래스로 확보</td><td>가변 (탭 내용에 따라)</td></tr>
            <tr><td>4</td><td>액션 영역</td><td>편집 폼이면 취소/저장, 상태 전이 화면이면 그 화면에 맞는 액션 버튼(예: &quot;출고 처리&quot;) 하나. <code>readOnly</code>일 때 비활성화된다 (아래 &quot;권한모드&quot; 절 참조)</td><td>약 58px (1줄)</td></tr>
          </tbody>
        </table>
      </div>

      {/* 호출방식: 팝업 ↔ 탭 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>호출방식 옵션: 팝업 ↔ 탭 (DetailShell)</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        상세 화면은 <code>src/shell/shared/DetailShell.tsx</code>를 통해 렌더링한다 (admin 앱과 동일한 파일을 그대로 이식했다).
        내부 콘텐츠(보통 InnerTabs)는 완전히 동일하게 두고, <code>mode: &apos;modal&apos; | &apos;tab&apos;</code> prop 하나로
        팝업(오버레이 + 자체 닫기 버튼)과 MDI 탭(page-title-row, 닫기는 탭바가 담당) 사이를 전환한다. 목록 화면은
        <code>useDetailOpener</code> 훅으로 호출방식에 맞춰 여는 방법(로컬 state vs <code>openTab()</code>)까지 함께 처리한다.
      </p>
      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table>
          <thead>
            <tr>
              <th>파일</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>DetailShell.tsx</code></td><td>상세 컴포넌트 내부에서 사용. <code>mode</code>에 따라 팝업/탭 껍데기(header, 닫기 버튼 유무, 크기)만 바꿔 렌더링. <code>children</code>은 그대로 통과</td></tr>
            <tr><td><code>useDetailOpener.ts</code></td><td>목록 화면에서 사용. <code>mode</code>가 <code>tab</code>이면 <code>openTab()</code>으로 등록, <code>modal</code>이면 로컬 state로 표시. <code>open(item)</code>과 렌더링할 <code>modalElement</code>를 반환</td></tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        사용법:
      </p>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20, marginBottom: 12 }}>
        <li>상세 컴포넌트: 상세 데이터를 <code>initialX</code>로 받아 <code>const [x, setX] = useState(initialX)</code>로 로컬 복사본을 들고, 액션 핸들러는 이 로컬 state를 갱신하면서 <code>onUpdate(updated)</code>로 목록 화면에도 알린다 (탭 모드에서는 한 번 열린 탭이 계속 마운트된 채로 유지되므로, prop이 아니라 자기 자신의 state로 최신값을 그려야 한다)</li>
        <li>최상위는 <code>&lt;DetailShell mode={'{mode}'} title={'{...}'} meta={'{...}'} onClose={'{onClose}'}&gt;{'{'}InnerTabs 등{'}'}&lt;/DetailShell&gt;</code>으로 감싼다</li>
        <li>목록 화면: 파일 상단에 <code>const DETAIL_MODE: DetailMode = &apos;modal&apos;</code> (또는 <code>&apos;tab&apos;</code>) 상수를 두고, <code>useDetailOpener({'{ mode: DETAIL_MODE, getTabId, getTabLabel, renderDetail }'})</code>로 <code>open</code>/<code>modalElement</code>를 얻어 행 클릭에는 <code>open</code>을, 목록 하단에는 <code>{'{modalElement}'}</code>를 배치한다</li>
        <li>호출방식을 바꿀 땐 이 <code>DETAIL_MODE</code> 한 줄만 수정하면 된다 — 상세 컴포넌트·탭 구성은 그대로 재사용</li>
        <li>
          <strong>실제 사용 예</strong>: <code>order/order-list/OrderListPage.tsx</code>는 <code>DETAIL_MODE = &apos;tab&apos;</code>을 쓴다
          (주문 상세를 열어둔 채 다른 주문을 확인하거나 배송 화면을 오가는 흐름이 자연스럽기 때문 — admin 앱의 기획전과 같은 이유).
          그 외 화면(클레임, 정산, QnA, 쿠폰 등)은 지금처럼 손으로 작성한 팝업 마크업을 그대로 써도 되고, 필요하면 같은 방식으로
          <code>DetailShell</code>로 옮겨 <code>mode</code>를 옵션으로 노출할 수 있다 — 모든 상세 화면이 반드시 이 구조를 써야 하는 것은 아니다
        </li>
      </ul>

      {/* 권한모드 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>권한모드 옵션: 조회 / 수정 (readOnly)</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        상세 컴포넌트는 <code>readOnly?: boolean</code> prop을 지원할 수 있다 (기본값 <code>false</code> = 수정모드).
        <code>true</code>면 상태 전이·저장 같은 액션 버튼에 <code>disabled={'{readOnly}'}</code>를 걸어 조회 전용으로 만든다.
      </p>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20, marginBottom: 12 }}>
        <li>
          <strong>숨기지 않고 비활성화한다</strong> — 조회모드에서도 버튼은 항상 렌더링되고 <code>disabled={'{readOnly}'}</code>만 추가한다.
          버튼을 조건부로 렌더링해 사라지게 만들지 않는다 (레이아웃이 모드에 따라 흔들리지 않게 하기 위함)
        </li>
        <li>읽기/편집 토글형 섹션(<code>detail-section</code> + &quot;편집&quot; 버튼)은 그 토글 버튼 자체에 <code>disabled={'{readOnly}'}</code>를 건다</li>
        <li>용도: 같은 상세 컴포넌트를 다른 화면에서 조회 전용으로 재사용하고 싶을 때를 대비해 미리 배선해두는 것 — 지금 당장 <code>readOnly={'{true}'}</code>로 호출하는 곳이 없어도 된다</li>
        <li>
          <strong>실제 사용 예</strong>: <code>order/order-list/OrderDetail.tsx</code>가 &quot;출고 처리&quot; 버튼에
          <code>disabled={'{readOnly}'}</code>를 걸어 이 규칙을 지원한다. admin 앱에서도 대부분의 상세 컴포넌트가
          <code>readOnly</code>를 지원하지만 실제로 <code>true</code>로 호출하는 곳은 상품심사 화면(<code>ProductReviewDetail</code>이
          <code>ProductDetail</code>을 재사용) 한 곳뿐이다 — 옵션을 지원하는 것과, 그 옵션을 실제로 쓰는 화면이 있는 것은 별개다
        </li>
      </ul>

      {/* 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>모달 내부는 기본 <strong>InnerTabs (탭 방식)</strong>, 탭이 1개뿐이거나 조회 전용이면 InnerTabs 없이 단일 섹션으로 구성해도 된다</li>
        <li>등록 모달은 항상 팝업(모달)로 고정 — <code>DetailShell</code>을 쓰지 않고 기존 <code>.detail-modal</code> 마크업 그대로 사용</li>
        <li>서브 모달(검색/추가 팝업): overlay 클릭 닫기 차단 (데이터 유실 방지)</li>
        <li>
          <strong>좌우 여백 필수</strong>: <code>DetailShell</code>은 패딩을 추가하지 않는다 — 콘텐츠 쪽이 스스로 책임진다.
          InnerTabs를 쓰는 상세는 각 탭 컴포넌트가 자신의 최상위 요소에 <code>tab-panel-content</code> 클래스를 직접 붙인다.
          InnerTabs 없이 단일 섹션인 상세는 그 섹션 전체를 감싸는 최상위 요소에 <code>tab-panel-content</code>를 붙인다
        </li>
        <li>
          <strong>탭 콘텐츠 내부 표(하위 목록) 행의 편집·삭제 버튼은 아이콘이 아니라 글자로 표기</strong>한다 —
          <code>btn-tool btn-tool--edit</code> 클래스에 &quot;편집&quot; 텍스트, <code>btn-tool btn-tool--delete</code> 클래스에
          &quot;삭제&quot; 텍스트를 쓴다. 순서이동(↑/↓) 같은 비파괴적 토글은 아이콘을 유지해도 된다
        </li>
        <li>지원하지 않는 기능(엑셀 업로드 등)은 <code>alert(&apos;프로토타입에서는 지원하지 않는 기능입니다.&apos;)</code>로 안내한다</li>
      </ul>
    </div>
  )
}
