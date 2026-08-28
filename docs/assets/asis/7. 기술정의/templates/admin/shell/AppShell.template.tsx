'use client'
import { type ReactElement, useState, useEffect, useRef } from 'react'
import { TabProvider, useTabContext, MAX_TABS } from './TabContext'
import Dashboard from './Dashboard'

// ⚠️ 화면정의서 메뉴 트리를 참조하여 채우기
// 어드민: 6. 화면정의/screen_definition 3.3 메뉴 트리
// 입점사: 6. 화면정의/screen_definition 4.2 메뉴 트리
//
// 예시:
// {
//   id: 'order',
//   label: '주문 관리',
//   items: [
//     { id: 'order/list', label: '주문 목록', getElement: () => <PlaceholderPage title="주문 목록" /> },
//   ],
// },
const NAV_MENUS: {
  id: string
  label: string
  items: { id: string; label: string; getElement: () => ReactElement; implemented?: boolean }[]
}[] = []

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <p className="state-msg">이 화면은 아직 구현되지 않았습니다.</p>
    </div>
  )
}

/* NavBar */
function NavBar({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const { tabs, openTab } = useTabContext()
  const isFull = tabs.length >= MAX_TABS
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function handleItemClick(item: { id: string; label: string; getElement: () => ReactElement }) {
    openTab({ id: item.id, label: item.label, element: item.getElement() })
    setOpenMenuId(null)
  }

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-left">
        <div className="nav-brand"><span className="nav-brand__icon">🛍</span>Admin</div>
        <div className="nav-menu">
          {NAV_MENUS.map((menu) => (
            <div key={menu.id} className="nav-item">
              <span
                className={`nav-item__label${openMenuId === menu.id ? ' nav-item__label--active' : ''}`}
                onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)}
              >
                {menu.label}
              </span>
              <ul className={`nav-dropdown${openMenuId === menu.id ? ' nav-dropdown--open' : ''}`}>
                {menu.items.map((item) => {
                  const isOpen = tabs.some((t) => t.id === item.id)
                  const disabled = isFull && !isOpen
                  return (
                    <li key={item.id}
                      className={`nav-dropdown__item${isOpen ? ' is-open' : ''}${disabled ? ' is-disabled' : ''}`}
                      onClick={() => !disabled && handleItemClick(item)}
                    >
                      {'implemented' in item && item.implemented && <span className="nav-dropdown__impl" />}
                      {item.label}
                      {isOpen && <span className="nav-dropdown__dot" />}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        {isFull && <span className="nav-limit-badge">탭 최대 {MAX_TABS}개</span>}
      </div>
      <div className="nav-right">
        <div className="nav-user">
          <span className="nav-user__name">{userId}</span>
          <button className="nav-user__logout" onClick={onLogout}>로그아웃</button>
        </div>
      </div>
    </nav>
  )
}

/* TabBar */
function TabBar() {
  const { tabs, activeTabId, activateTab, closeTab } = useTabContext()
  return (
    <div className="tabbar" role="tablist">
      {tabs.map((tab) => (
        <div key={tab.id} role="tab" aria-selected={tab.id === activeTabId}
          className={`tab${tab.id === activeTabId ? ' tab--active' : ''}${tab.pinned ? ' tab--pinned' : ''}`}
          onClick={() => activateTab(tab.id)}>
          <span className="tab__label">{tab.pinned ? `📌 ${tab.label}` : tab.label}</span>
          {!tab.pinned && (
            <button className="tab__close" onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}>×</button>
          )}
        </div>
      ))}
    </div>
  )
}

/* TabContent */
function TabContent() {
  const { tabs, activeTabId } = useTabContext()
  return (
    <div className="tab-content">
      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" hidden={tab.id !== activeTabId}>{tab.element}</div>
      ))}
    </div>
  )
}

/* AppShell */
export default function AppShell({ userId = 'guest', onLogout }: { userId?: string; onLogout?: () => void }) {
  const initialTabs = [
    { id: 'dashboard', label: '대시보드', element: <Dashboard />, pinned: true }
  ]
  return (
    <TabProvider initialTabs={initialTabs}>
      <div className="shell">
        <NavBar userId={userId} onLogout={onLogout ?? (() => {})} />
        <TabBar />
        <TabContent />
      </div>
    </TabProvider>
  )
}
