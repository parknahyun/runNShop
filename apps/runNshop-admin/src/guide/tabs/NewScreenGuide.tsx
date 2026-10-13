'use client'

export default function NewScreenGuide() {
  return (
    <div>
      <h2 className="section-title">새 화면 만들기 체크리스트</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        다른 가이드 탭이 화면 각각의 <strong>시각적 구조</strong>를 다룬다면, 이 탭은 화면을 만든 뒤
        <strong> 실제로 앱에 연결</strong>하는 배선 단계를 다룬다. 이 순서대로 하면 기존 화면과 동일한 방식으로 동작한다.
        예시는 <code>promotion/exhibition/</code>(기획전) 기준.
      </p>

      {/* 1. 파일/폴더 구조 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>1. 파일/폴더 구조</h3>
      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table>
          <thead><tr><th>파일</th><th>역할</th></tr></thead>
          <tbody>
            <tr><td><code>&lt;도메인&gt;/&lt;기능&gt;/&lt;Feature&gt;Page.tsx</code></td><td>목록 화면 (필터+요약+테이블+페이지네이션)</td></tr>
            <tr><td><code>&lt;Feature&gt;Detail.tsx</code></td><td>상세 화면 (DetailShell 기반)</td></tr>
            <tr><td><code>Add&lt;Feature&gt;Modal.tsx</code></td><td>신규 등록 모달 (있는 경우)</td></tr>
            <tr><td><code>mockData.ts</code></td><td>타입 + 목업 데이터 (같은 폴더)</td></tr>
            <tr><td><code>&lt;Feature&gt;StatusBadge.tsx</code></td><td>상태 배지 (컴포넌트 가이드의 StatusBadge 컨벤션 참조)</td></tr>
            <tr><td><code>tabs/&lt;Name&gt;Tab.tsx</code></td><td>상세화면에 InnerTabs가 2개 이상이면 하위 폴더로 분리</td></tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
        예: <code>promotion/exhibition/{'{ExhibitionPage.tsx, ExhibitionDetail.tsx, mockData.ts, ExhibitionStatusBadge.tsx, tabs/BasicInfoTab.tsx, tabs/ProductsTab.tsx, tabs/PromotionsTab.tsx}'}</code>
      </p>

      {/* 2. mockData.ts 작성 규칙 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>2. mockData.ts 작성 규칙</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 1.9, paddingLeft: 20, marginBottom: 20 }}>
        <li>상태 타입: <code>export type &lt;Domain&gt;Status = &apos;A&apos; | &apos;B&apos; | ...</code></li>
        <li>엔티티: <code>export interface &lt;Domain&gt; {'{ <domain>Id, ...필드, createdBy, createdAt, updatedBy, updatedAt }'}</code> — 감사(audit) 필드 4종은 거의 모든 도메인에 공통</li>
        <li>필터: <code>export interface &lt;Domain&gt;Filter {'{ keyword, status, ... }'}</code></li>
        <li>라벨 맵: <code>export const &lt;DOMAIN&gt;_STATUS_LABEL: Record&lt;Status, string&gt;</code></li>
        <li>시드 데이터: <code>export const MOCK_&lt;DOMAIN_PLURAL&gt;: &lt;Domain&gt;[] = [...]</code>, 보통 5~7건</li>
        <li>ID 포맷: <code>&lt;PREFIX&gt;-NNN</code> (예: <code>EXH-001</code>, <code>CPN-001</code>)</li>
        <li>신규 등록 시 다음 ID 채번용: <code>let _&lt;prefix&gt;Seq = MOCK_XXX.length + 1</code></li>
      </ul>

      {/* 3. 메뉴 등록 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>3. 메뉴 등록 (AppShell.tsx)</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        화면을 아무리 잘 만들어도 <code>src/shell/AppShell.tsx</code>에 등록하지 않으면 클릭할 방법 자체가 없다.
        별도 라우팅은 없고, 메뉴 클릭이 곧 MDI 탭 오픈이다.
      </p>
      <ol style={{ fontSize: 13, color: '#374151', lineHeight: 1.9, paddingLeft: 20, marginBottom: 10 }}>
        <li>파일 상단에 페이지 컴포넌트 import 추가: <code>import &lt;Feature&gt;Page from &apos;@/&lt;도메인&gt;/&lt;기능&gt;/&lt;Feature&gt;Page&apos;</code></li>
        <li><code>NAV_MENUS</code> 배열에서 해당하는 1depth 메뉴(예: <code>promotion</code>)를 찾아 <code>items</code>에 추가:
          <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginTop: 6, overflowX: 'auto' }}>
{`{ id: '<도메인>/<기능>', label: '<한글 메뉴명>', getElement: () => <FeaturePage />, implemented: true }`}
          </pre>
        </li>
        <li>어디에도 속하지 않는 완전히 새로운 1depth 카테고리라면 <code>NAV_MENUS</code>에 <code>{'{ id, label, items: [...] }'}</code> 형태로 새 그룹을 추가한다</li>
      </ol>
      <p style={{ fontSize: 12, color: '#94a3b8' }}>
        <code>implemented: true</code>면 드롭다운에 초록 원(●)이 표시된다. 클릭 시 <code>openTab({'{ id, label, element: item.getElement() }'})</code>이 자동으로 MDI 탭을 연다 — 이 부분은 손댈 필요 없음.
      </p>

      {/* 4. StatusBadge 도메인 예외 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>4. StatusBadge 규칙의 프로모션 도메인 예외</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        컴포넌트 가이드의 기본 규칙은 &quot;새 도메인은 새 <code>data-*-status</code> 속성을 만든다&quot;이지만,
        프로모션 계열 5개 화면(기획전·즉시할인·쿠폰할인·수량별 할인·장바구니 할인)은 전부 예외적으로
        기존 <code>data-product-status</code> 속성을 재사용해서 자신의 상태값을 <code>ON_SALE</code>/<code>RESERVED</code>/
        <code>DRAFT</code>/<code>DISCONTINUED</code> 중 하나로 매핑한다 (상품 배지와 같은 색 체계를 쓰려는 의도적 선택).
        프로모션 계열에 새 화면(예: 이벤트관리)을 추가할 때는 새 속성을 만들지 말고 이 예외를 따라간다.
        그 외 도메인(클레임·회원·정산 등)은 기본 규칙대로 새 속성을 만든다.
      </p>

      {/* 5. CSS 추가 위치 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>5. CSS 추가 위치</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
        <code>globals.css</code>는 도메인마다 <code>{'/* ===== \\n DomainName \\n ===== */'}</code> 헤더 주석 블록으로
        구분해 파일 끝에 이어 붙인다. 특별한 정렬 규칙(가나다순 등)은 없고 만든 순서대로 쌓여 있다 —
        새 도메인 CSS도 같은 방식으로 파일 맨 끝에 헤더 주석과 함께 추가하면 된다.
      </p>

      {/* 6. 자동화 하네스 */}
      <h3 className="section-title" style={{ fontSize: 14, marginBottom: 8 }}>6. 자동화 하네스 (repo 루트 <code>scripts/harness/screen/</code>)</h3>
      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 }}>
        위 1~5번을 매번 손으로 하지 않도록 세 개의 스크립트가 있다. 의존성(Playwright)은 <code>scripts/</code>에
        설치돼 있고, 스크립트 파일 자체는 <code>scripts/harness/screen/</code>에 있다 — <code>scripts/</code>에서
        <code>npm install</code>을 한 번 해두면 바로 쓸 수 있다.
      </p>
      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table>
          <thead><tr><th>스크립트</th><th>역할</th><th>실행 시점</th></tr></thead>
          <tbody>
            <tr>
              <td><code>scaffold-screen.js</code></td>
              <td>폴더/파일 생성 + <code>AppShell.tsx</code> import·메뉴 등록까지 자동 배선. 이름 충돌(다른 화면과 컴포넌트명이 겹치는 경우) 사전 검사 포함</td>
              <td>새 화면을 시작할 때 (1~3번 대체)</td>
            </tr>
            <tr>
              <td><code>check-screen-conventions.js</code></td>
              <td>메뉴 미등록·<code>op-summary-row</code> 누락·배지 속성 충돌 등 정적 검사. 브라우저·dev 서버 불필요, 즉시 종료</td>
              <td>화면 코드를 다 쓴 직후 / 커밋 전 (몇 초짜리라 CI에도 적합)</td>
            </tr>
            <tr>
              <td><code>audit-screens.js</code></td>
              <td><code>AppShell.tsx</code>의 <code>NAV_MENUS</code>를 직접 읽어 메뉴를 하나씩 실제로 열어보고 콘솔 에러·빈 화면을 잡는다. dev 서버가 떠 있어야 함</td>
              <td>정적 검사를 통과한 뒤, 실제 렌더링까지 확인하는 마지막 단계</td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginBottom: 10, overflowX: 'auto' }}>
{`cd scripts && npm install   # 최초 1회

# 1) 새 화면 뼈대 생성 (--write 없으면 dry-run으로 미리보기만)
node harness/screen/scaffold-screen.js --app=admin --domain=promotion --feature=event-mgmt --label="이벤트관리" --menu=promotion --write

# 2) mockData.ts/Page.tsx/Detail.tsx에 실제 필드·로직 채운 뒤 정적 검사
node harness/screen/check-screen-conventions.js admin

# 3) dev 서버 실행 상태에서 실제 렌더링 확인
node harness/screen/audit-screens.js admin`}
      </pre>
      <p style={{ fontSize: 12, color: '#94a3b8' }}>
        <code>check-screen-conventions.js</code>는 판단이 필요한 규칙(간격 스케일, 레이아웃이 실제로 안 깨지는지 등)은 다루지 않는다 —
        &quot;기계적으로 확실히 검사 가능한 것&quot;만 본다. 나머지는 <code>audit-screens.js</code>로 실제 화면을 열어보거나 사람/AI 리뷰로 확인한다.
      </p>

      {/* 요약 */}
      <h3 className="section-title" style={{ fontSize: 14 }}>요약</h3>
      <ul style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20 }}>
        <li>폴더/파일 만들기 → mockData.ts 작성 → Page/Detail 컴포넌트 작성(다른 가이드 탭 기준) → AppShell.tsx에 등록 → globals.css에 배지/도메인 스타일 추가</li>
        <li>이 순서를 건너뛰면 화면은 만들어져도 메뉴에서 열 수 없거나, 다른 화면과 다른 배지 색을 쓰게 된다</li>
        <li>1~4번은 <code>scaffold-screen.js</code> + <code>check-screen-conventions.js</code> + <code>audit-screens.js</code>로 자동화할 수 있다 (6번 참고)</li>
      </ul>
    </div>
  )
}
