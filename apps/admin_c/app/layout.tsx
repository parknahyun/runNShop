import '../styles/globals.css'

export const metadata = {
  title: 'runNshop Admin (C-3 검증)',
  description: 'C-3 디자인시스템 검증용 admin app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">
          {/* NavBar */}
          <nav className="navbar">
            <span className="nav-brand">runNshop Admin</span>
            <div className="nav-menu">
              <button className="nav-item">홈</button>
              <button className="nav-item nav-item--active">주문 관리</button>
              <button className="nav-item">상품 관리</button>
              <button className="nav-item">회원 관리</button>
              <button className="nav-item">프로모션</button>
              <button className="nav-item">운영 설정</button>
            </div>
          </nav>

          {/* TabBar */}
          <div className="tabbar">
            <button className="tab tab--active">
              <span>주문 현황</span>
              <span className="tab__close">×</span>
            </button>
          </div>

          {/* TabContent */}
          <div className="tab-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
