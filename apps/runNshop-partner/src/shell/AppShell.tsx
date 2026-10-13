'use client'
import { type ReactElement, useState, useEffect, useRef } from 'react'
import { TabProvider, useTabContext, MAX_TABS } from './TabContext'
import Dashboard from './Dashboard'
import ProductList from '@/product/product-list/ProductList'
import InventoryPage from '@/product/inventory/InventoryPage'
import OrderListPage from '@/order/order-list/OrderListPage'
import ShippingPage from '@/order/shipping/ShippingPage'
import CancelClaimPage from '@/claim/cancel/CancelClaimPage'
import ReturnClaimPage from '@/claim/return/ReturnClaimPage'
import ExchangeClaimPage from '@/claim/exchange/ExchangeClaimPage'
import SettlementListPage from '@/settlement/settlement-list/SettlementListPage'
import SettlementPaymentPage from '@/settlement/settlement-payment/SettlementPaymentPage'
import QnaPage from '@/community/qna/QnaPage'
import CouponPage from '@/promotion/coupon/CouponPage'
import QuantityDiscountPage from '@/promotion/qty-discount/QuantityDiscountPage'
import SalesStatsPage from '@/stats/sales/SalesStatsPage'
import ClaimStatsPage from '@/stats/claim/ClaimStatsPage'
import AccountSettingsPage from '@/settings/account/AccountSettingsPage'
import DeliverySettingsPage from '@/settings/delivery/DeliverySettingsPage'
import NotificationSettingsPage from '@/settings/notification/NotificationSettingsPage'
import GuidePage from '@/guide/GuidePage'

const NAV_MENUS = [
  {
    id: 'product',
    label: '상품 관리',
    items: [
      { id: 'product/list', label: '상품 목록', getElement: () => <ProductList />, implemented: true },
      { id: 'product/inventory', label: '재고 관리', getElement: () => <InventoryPage />, implemented: true },
    ],
  },
  {
    id: 'order',
    label: '주문 관리',
    items: [
      { id: 'order/list', label: '주문 목록', getElement: () => <OrderListPage />, implemented: true },
      { id: 'order/shipping', label: '배송 관리', getElement: () => <ShippingPage />, implemented: true },
    ],
  },
  {
    id: 'claim',
    label: '클레임 관리',
    items: [
      { id: 'claim/cancel', label: '취소 목록', getElement: () => <CancelClaimPage />, implemented: true },
      { id: 'claim/return', label: '반품 목록', getElement: () => <ReturnClaimPage />, implemented: true },
      { id: 'claim/exchange', label: '교환 목록', getElement: () => <ExchangeClaimPage />, implemented: true },
    ],
  },
  {
    id: 'settlement',
    label: '정산 관리',
    items: [
      { id: 'settlement/list', label: '정산 목록', getElement: () => <SettlementListPage />, implemented: true },
      { id: 'settlement/payment', label: '지급 내역', getElement: () => <SettlementPaymentPage />, implemented: true },
    ],
  },
  {
    id: 'community',
    label: '커뮤니티',
    items: [
      { id: 'community/qna', label: '상품 QnA', getElement: () => <QnaPage />, implemented: true },
    ],
  },
  {
    id: 'promotion',
    label: '프로모션',
    items: [
      { id: 'promotion/coupon', label: '쿠폰 관리', getElement: () => <CouponPage />, implemented: true },
      { id: 'promotion/qty-discount', label: '수량 할인', getElement: () => <QuantityDiscountPage />, implemented: true },
    ],
  },
  {
    id: 'stats',
    label: '통계',
    items: [
      { id: 'stats/sales', label: '판매 통계', getElement: () => <SalesStatsPage />, implemented: true },
      { id: 'stats/claim', label: '클레임 통계', getElement: () => <ClaimStatsPage />, implemented: true },
    ],
  },
  {
    id: 'settings',
    label: '운영 설정',
    items: [
      { id: 'settings/account', label: '계정 관리', getElement: () => <AccountSettingsPage />, implemented: true },
      { id: 'settings/delivery', label: '배송 설정', getElement: () => <DeliverySettingsPage />, implemented: true },
      { id: 'settings/notification', label: '알림 설정', getElement: () => <NotificationSettingsPage />, implemented: true },
      { id: 'guide/ui', label: '화면 작성 가이드', getElement: () => <GuidePage />, implemented: true },
    ],
  },
]

/* NavBar */
function NavBar({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const { tabs, openTab } = useTabContext()
  const isFull = tabs.length >= MAX_TABS
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenuId(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function handleItemClick(item: { id: string; label: string; getElement: () => ReactElement }) {
    openTab({ id: item.id, label: item.label, element: item.getElement() })
    setOpenMenuId(null)
  }

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-left">
        <div className="nav-brand"><span className="nav-brand__icon">🏪</span>Partners</div>
        <div className="nav-menu">
          {NAV_MENUS.map((menu) => (
            <div key={menu.id} className="nav-item">
              <span className={`nav-item__label${openMenuId === menu.id ? ' nav-item__label--active' : ''}`}
                onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)}>{menu.label}</span>
              <ul className={`nav-dropdown${openMenuId === menu.id ? ' nav-dropdown--open' : ''}`}>
                {menu.items.map((item) => {
                  const isOpen = tabs.some((t) => t.id === item.id)
                  const disabled = isFull && !isOpen
                  return (
                    <li key={item.id} className={`nav-dropdown__item${isOpen ? ' is-open' : ''}${disabled ? ' is-disabled' : ''}`}
                      onClick={() => !disabled && handleItemClick(item)}>
                      {'implemented' in item && item.implemented && <span className="nav-dropdown__impl" />}
                      {item.label}{isOpen && <span className="nav-dropdown__dot" />}
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
          {!tab.pinned && <button className="tab__close" onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}>×</button>}
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
