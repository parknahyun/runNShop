import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MyPageHeader } from '@/components/my/MyPageHeader';
import { OrderStatusBar } from '@/components/my/OrderStatusBar';
import { MyMenuList } from '@/components/my/MyMenuList';

interface MemberSummary {
  memberId: string;
  name: string;
  grade: string;
  gradeIcon: string;
  point: number;
  couponCount: number;
  reviewCount: number;
  orderStatusSummary: {
    paymentCompleted: number;
    preparing: number;
    inDelivery: number;
    delivered: number;
  };
}

export default async function MyPage() {
  let member: MemberSummary | null = null;

  try {
    member = await api<MemberSummary>('/my/summary');
  } catch (e) {
    // fallback
  }

  if (!member) {
    return (
      <main className="pb-16">
        <Header />
        <div className="p-4">
          <p className="text-sm text-gray-500">회원 정보를 불러올 수 없습니다.</p>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="pb-16 bg-gray-50">
      <Header />

      {/* 회원 정보 + 포인트/쿠폰/리뷰 */}
      <MyPageHeader member={member} />

      {/* 주문/배송 현황 (결제완료 → 준비중 → 배송중 → 배송완료) */}
      <OrderStatusBar summary={member.orderStatusSummary} />

      {/* 메뉴 리스트 */}
      <MyMenuList />

      <BottomNav />
    </main>
  );
}
