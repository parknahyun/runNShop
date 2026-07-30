'use client'
import { useState } from 'react'
import MainGuide from './tabs/MainGuide'
import DashboardGuide from './tabs/DashboardGuide'
import ListGuide from './tabs/ListGuide'
import DetailGuide from './tabs/DetailGuide'
import LoginGuide from './tabs/LoginGuide'
import DesignSystemGuide from './tabs/DesignSystemGuide'
import ComponentGuide from './tabs/ComponentGuide'
import NewScreenGuide from './tabs/NewScreenGuide'

const TABS = [
  { key: 'design', label: '디자인 시스템' },
  { key: 'component', label: '컴포넌트' },
  { key: 'main', label: '메인 프레임' },
  { key: 'dashboard', label: '대시보드 탭' },
  { key: 'list', label: '현황목록 탭' },
  { key: 'detail', label: '상세화면' },
  { key: 'login', label: '로그인' },
  { key: 'newscreen', label: '새 화면 만들기' },
]

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('design')

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">화면 작성 가이드</h1>
      </div>

      <div className="inner-tabs__bar" style={{ marginBottom: 24 }}>
        {TABS.map((tab) => (
          <button key={tab.key}
            className={`inner-tabs__btn${activeTab === tab.key ? ' inner-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'main' && <MainGuide />}
      {activeTab === 'dashboard' && <DashboardGuide />}
      {activeTab === 'list' && <ListGuide />}
      {activeTab === 'detail' && <DetailGuide />}
      {activeTab === 'login' && <LoginGuide />}
      {activeTab === 'design' && <DesignSystemGuide />}
      {activeTab === 'component' && <ComponentGuide />}
      {activeTab === 'newscreen' && <NewScreenGuide />}
    </div>
  )
}
