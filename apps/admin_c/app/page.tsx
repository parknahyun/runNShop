import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="page">
      <h1 className="page-title">대시보드</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>C-3 디자인시스템 검증용 Admin 앱</p>
      <Link href="/orders" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
        → 주문 현황 페이지로 이동
      </Link>
    </div>
  );
}
