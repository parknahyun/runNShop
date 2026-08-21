import Link from 'next/link';

export function Header() {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-3 sticky top-0 z-20">
      <Link href="/" className="font-bold text-secondary text-sm">
        runNshop
      </Link>
      <div className="flex items-center gap-3 text-lg">
        <Link href="/search" aria-label="검색">🔍</Link>
        <Link href="/cart" aria-label="장바구니">🛒</Link>
        <Link href="/my" aria-label="마이페이지" className="text-xs font-bold">MY</Link>
      </div>
    </div>
  );
}
