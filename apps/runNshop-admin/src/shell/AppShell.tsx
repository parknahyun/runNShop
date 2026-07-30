'use client'
import { type ReactElement, useState, useEffect, useRef } from 'react'
import { TabProvider, useTabContext } from './TabContext'
import { fetchProgramList, type NavMenuGroup, type OperatorRole } from './navMenus'
import Dashboard from './Dashboard'
import OrderHistory from '@/order/order-history/OrderHistory'
import ClaimPage from '@/order/claim/ClaimPage'
import MemberPage from '@/member/list/MemberPage'
import GradeCriteriaPage from '@/member/grade/GradeCriteriaPage'
import Pages from '@/display/page/Pages'
import ExhibitionPage from '@/promotion/exhibition/ExhibitionPage'
import EventPricePage from '@/promotion/event-price/EventPricePage'
import CouponPage from '@/promotion/coupon/CouponPage'
import QuantityDiscountPage from '@/promotion/quantity-discount/QuantityDiscountPage'
import CartDiscountPage from '@/promotion/cart-discount/CartDiscountPage'
import BrandPage from '@/product/brand/BrandPage'
import StandardCategoryPage from '@/product/category-std/StandardCategoryPage'
import DisplayCategoryPage from '@/product/category-display/DisplayCategoryPage'
import ProductListPage from '@/product/product-list/ProductListPage'
import ProductReviewPage from '@/product/product-review/ProductReviewPage'
import Templates from '@/display/template/Templates'
import Sections from '@/display/section/Sections'
import GuidePage from '@/guide/GuidePage'
import OperatorStatus from '@/system/operator-status/OperatorStatus'
import CommonCodes from '@/system/common-code/CommonCodes'
import ProgramStatus from '@/system/program-status/ProgramStatus'
import RoleStatus from '@/system/role-status/RoleStatus'
import BatchJobStatus from '@/system/batch-job/BatchJobStatus'
import VendorApplicationPage from '@/vendor/apply/VendorApplicationPage'
import VendorListPage from '@/vendor/list/VendorListPage'
import DeliveryCompanyPage from '@/vendor/delivery/DeliveryCompanyPage'
import SettlementListPage from '@/settlement/list/SettlementListPage'
import SettlementPaymentPage from '@/settlement/payment/SettlementPaymentPage'
import ExternalSettlementPage from '@/settlement/external/ExternalSettlementPage'
import ReviewPage from '@/community/review/ReviewPage'
import QnaPage from '@/community/qna/QnaPage'
import NotificationTemplatePage from '@/settings/notification/NotificationTemplatePage'
import BannedWordPage from '@/settings/banned-word/BannedWordPage'
import NoticePage from '@/settings/notice/NoticePage'
import TermsPage from '@/settings/terms/TermsPage'
import BannerPage from '@/settings/banner/BannerPage'
import MemberAccessLogPage from '@/settings/access-log/MemberAccessLogPage'
import OperatorApplicationPage from '@/system/operator-apply/OperatorApplicationPage'
import OutboxDlqPage from '@/system/outbox-dlq/OutboxDlqPage'
import AuditLogs from '@/system/audit-log/AuditLogs'

// 화면 id → 컴포넌트 매핑. 메뉴의 라벨·그룹·롤 구성 자체는 navMenus.ts(NAV_MENU_STRUCTURE)가
// 단일 소스다 — 여기서는 각 항목에 실제 구현체만 연결한다.
const SCREEN_REGISTRY: Record<string, () => ReactElement> = {
  'product/review': () => <ProductReviewPage />,
  'product/list': () => <ProductListPage />,
  'product/category-std': () => <StandardCategoryPage />,
  'product/category-display': () => <DisplayCategoryPage />,
  'product/brand': () => <BrandPage />,
  'product/display-page': () => <Pages />,
  'product/display-template': () => <Templates />,
  'product/section-type': () => <Sections />,
  'promotion/exhibition': () => <ExhibitionPage />,
  'promotion/event-price': () => <EventPricePage />,
  'promotion/coupon': () => <CouponPage />,
  'promotion/qty-discount': () => <QuantityDiscountPage />,
  'promotion/cart-discount': () => <CartDiscountPage />,
  'order/order-history': () => <OrderHistory />,
  'order/claim': () => <ClaimPage />,
  'member/list': () => <MemberPage />,
  'member/grade': () => <GradeCriteriaPage />,
  'vendor/apply': () => <VendorApplicationPage />,
  'vendor/list': () => <VendorListPage />,
  'vendor/delivery': () => <DeliveryCompanyPage />,
  'settlement/list': () => <SettlementListPage />,
  'settlement/payment': () => <SettlementPaymentPage />,
  'settlement/external': () => <ExternalSettlementPage />,
  'community/review': () => <ReviewPage />,
  'community/qna': () => <QnaPage />,
  'settings/notification': () => <NotificationTemplatePage />,
  'settings/banned-word': () => <BannedWordPage />,
  'settings/notice': () => <NoticePage />,
  'settings/terms': () => <TermsPage />,
  'settings/banner': () => <BannerPage />,
  'settings/access-log': () => <MemberAccessLogPage />,
  'system/operator': () => <OperatorStatus />,
  'system/operator-apply': () => <OperatorApplicationPage />,
  'system/permission': () => <ProgramStatus />,
  'system/role': () => <RoleStatus />,
  'system/common-code': () => <CommonCodes />,
  'system/batch': () => <BatchJobStatus />,
  'system/outbox-dlq': () => <OutboxDlqPage />,
  'system/audit-log': () => <AuditLogs />,
  'guide/ui': () => <GuidePage />,
}

/* NavBar — menus는 프로그램목록 API(fetchProgramList) 응답. null이면 아직 로딩 중. */
function NavBar({ userId, menus, onLogout }: { userId: string; menus: NavMenuGroup[] | null; onLogout: () => void }) {
  const { tabs, openTab } = useTabContext()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function handleItemClick(item: { id: string; label: string }) {
    const getElement = SCREEN_REGISTRY[item.id]
    if (!getElement) return
    openTab({ id: item.id, label: item.label, element: getElement() })
    setOpenMenuId(null)
  }

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-left">
        <div className="nav-brand"><span className="nav-brand__icon">🛍</span>Admin</div>
        <div className="nav-menu">
          {menus === null ? (
            <span className="nav-menu__loading">메뉴 불러오는 중...</span>
          ) : (
            menus.map((menu) => (
              <div key={menu.id} className="nav-item">
                <span
                  className={`nav-item__label${openMenuId === menu.id ? ' nav-item__label--active' : ''}`}
                  onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)}
                >
                  {menu.label}
                </span>
                <ul className={`nav-dropdown${openMenuId === menu.id ? ' nav-dropdown--open' : ''}`}>
                  {menu.items.map((item, idx) => {
                    // 3depth: children이 있으면 이 항목은 클릭 불가한 2depth 그룹 라벨이고,
                    // children이 3depth 리프다(navMenus.ts 구조 정책 참고).
                    if (item.children) {
                      return (
                        <li key={item.id} className="nav-dropdown__group-wrap">
                          {idx > 0 && <div className="nav-dropdown__divider" />}
                          <div className="nav-dropdown__group-label">{item.label}</div>
                          <ul className="nav-dropdown__nested">
                            {item.children.map((child) => {
                              const isOpen = tabs.some((t) => t.id === child.id)
                              const implemented = Boolean(SCREEN_REGISTRY[child.id])
                              return (
                                <li key={child.id}
                                  className={`nav-dropdown__item nav-dropdown__item--nested${isOpen ? ' is-open' : ''}`}
                                  onClick={() => handleItemClick(child)}
                                >
                                  {implemented && <span className="nav-dropdown__impl" />}
                                  {child.label}
                                  {isOpen && <span className="nav-dropdown__dot" />}
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      )
                    }
                    const isOpen = tabs.some((t) => t.id === item.id)
                    const implemented = Boolean(SCREEN_REGISTRY[item.id])
                    return (
                      <li key={item.id}
                        className={`nav-dropdown__item${isOpen ? ' is-open' : ''}`}
                        onClick={() => handleItemClick(item)}
                      >
                        {implemented && <span className="nav-dropdown__impl" />}
                        {item.label}
                        {isOpen && <span className="nav-dropdown__dot" />}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
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

/* AppShell — role은 로그인 세션에서 받아온다(app/page.tsx 참고). 메뉴는 role이 정해진 뒤
   프로그램목록 API(fetchProgramList)로 받아와 권한이 있는 메뉴만 활성화한다. */
export default function AppShell({ userId = 'guest', role, onLogout }: { userId?: string; role: OperatorRole; onLogout?: () => void }) {
  const [menus, setMenus] = useState<NavMenuGroup[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setMenus(null)
    fetchProgramList(role).then((list) => {
      if (!cancelled) setMenus(list)
    })
    return () => { cancelled = true }
  }, [role])

  const initialTabs = [
    { id: 'dashboard', label: '대시보드', element: <Dashboard />, pinned: true }
  ]
  return (
    <TabProvider initialTabs={initialTabs}>
      <div className="shell">
        <NavBar userId={userId} menus={menus} onLogout={onLogout ?? (() => {})} />
        <TabBar />
        <TabContent />
      </div>
    </TabProvider>
  )
}
