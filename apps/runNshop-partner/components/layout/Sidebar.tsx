'use client';

import { useState } from 'react';

const MENU_ITEMS = [
  { key: 'home', label: '홈', icon: '🏠', href: '/' },
  { key: 'products', label: '상품 관리', icon: '📦', href: '/products' },
  { key: 'orders', label: '주문 관리', icon: '📋', href: '/orders' },
  { key: 'claims', label: '클레임 관리', icon: '🔄', href: '/claims' },
  { key: 'settlements', label: '정산 관리', icon: '💰', href: '/settlements' },
  { key: 'community', label: '커뮤니티', icon: '💬', href: '/community' },
  { key: 'promotions', label: '프로모션', icon: '🎁', href: '/promotions' },
  { key: 'stats', label: '통계', icon: '📊', href: '/stats' },
  { key: 'settings', label: '운영 설정', icon: '⚙️', href: '/settings' },
];

export function Sidebar() {
  const [active, setActive] = useState('home');

  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-gray-900 text-white flex flex-col">
      {/* 로고 */}
      <div className="h-14 flex items-center px-5 border-b border-gray-800">
        <span className="text-lg font-bold text-primary">runNshop</span>
        <span className="text-xs text-gray-400 ml-1">Partners</span>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left ${
              active === item.key
                ? 'bg-gray-800 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 입점사 정보 */}
      <div className="px-5 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-400">나이키코리아</p>
        <p className="text-sm text-white">partner@nike.co.kr</p>
      </div>
    </aside>
  );
}
