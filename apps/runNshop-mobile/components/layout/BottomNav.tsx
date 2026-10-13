'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: '홈' },
  { href: '/exhibitions', label: '기획전' },
  { href: '/search', label: '검색' },
  { href: '/my', label: 'MY' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto h-12 bg-gray-900 text-white flex items-center justify-around z-30">
      {TABS.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-xs ${active ? 'font-bold text-white' : 'text-gray-400'}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
