'use client';

import { useState } from 'react';

const MENU_ITEMS = [
  { key: 'home', label: '홈', icon: '🏠', href: '/' },
  { key: 'products', label: '상품 관리', icon: '📦', href: '/products' },
  { key: 'promotions', label: '프로모션', icon: '🎁', href: '/promotions' },
  { key: 'orders', label: '주문 관리', icon: '📋', href: '/orders' },
  { key: 'members', label: '회원 관리', icon: '👥', href: '/members' },
  { key: 'vendors', label: '입점사 관리', icon: '🏪', href: '/vendors' },
  { key: 'settlements', label: '정산 관리', icon: '💰', href: '/settlements' },
  { key: 'community', label: '커뮤니티', icon: '💬', href: '/community' },
  { key: 'settings', label: '운영 설정', icon: '⚙️', href: '/settings' },
  { key: 'system', label: '시스템', icon: '🖥️', href: '/system' },
];

export function Sidebar() {
  const [active, setActive] = useState('home');

  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-gray-900 text-white flex flex-col">
      {/* 로고 */}
      <div className="h-14 flex items-center px-5 border-b border-gray-800">
        <span className="text-lg font-bold text-primary">runNshop</span>
        <span className="text-xs text-gray-400 ml-1">Admin</span>
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

      {/* 사용자 */}
      <div className="px-5 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-400">슈퍼관리자</p>
        <p className="text-sm text-white">admin@runNshop.com</p>
      </div>
    </aside>
  );
}
