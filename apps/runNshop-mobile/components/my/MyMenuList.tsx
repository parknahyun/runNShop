import Link from 'next/link';

const MENU_SECTIONS = [
  {
    title: '주문·결제',
    items: [
      { label: '주문/배송 조회', href: '/my/orders' },
      { label: '취소/반품/교환 내역', href: '/my/claims' },
      { label: '결제수단 관리', href: '/my/payment-methods' },
    ],
  },
  {
    title: '혜택',
    items: [
      { label: '쿠폰함', href: '/my/coupons' },
      { label: '포인트 내역', href: '/my/points' },
    ],
  },
  {
    title: '활동',
    items: [
      { label: '리뷰 관리', href: '/my/reviews' },
      { label: '문의 내역', href: '/my/inquiries' },
    ],
  },
  {
    title: '설정',
    items: [
      { label: '배송지 관리', href: '/my/addresses' },
      { label: '회원정보 수정', href: '/my/profile' },
      { label: '로그아웃', href: '#' },
    ],
  },
];

export function MyMenuList() {
  return (
    <div className="mt-2">
      {MENU_SECTIONS.map((section) => (
        <div key={section.title} className="bg-white mt-2 first:mt-0">
          <h3 className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase">{section.title}</h3>
          <ul>
            {section.items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 active:bg-gray-50"
                >
                  <span>{item.label}</span>
                  <span className="text-gray-300 text-xs">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
