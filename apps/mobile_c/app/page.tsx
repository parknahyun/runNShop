import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="px-3 pt-4 space-y-4">
      <h1 className="text-base font-bold text-secondary">C-3 디자인시스템 검증</h1>
      <p className="text-xs text-gray-500">mobile_c — 디자인시스템 + 화면레이아웃만으로 생성한 검증 앱</p>
      <div className="space-y-2">
        <Link href="/cart" className="block bg-white border border-gray-200 rounded-lg p-3 text-sm text-secondary">
          🛒 장바구니 →
        </Link>
        <Link href="/orders/new" className="block bg-white border border-gray-200 rounded-lg p-3 text-sm text-secondary">
          📝 주문서 →
        </Link>
      </div>
    </div>
  );
}
