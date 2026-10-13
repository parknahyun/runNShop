import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { OrderListItem } from '@/components/my/OrderListItem';
import Link from 'next/link';

interface OrderData {
  orderId: string;
  platformOrderNo: string;
  productName: string;
  imageUrl: string;
  optionName: string;
  quantity: number;
  amount: number;
  status: string;
  statusLabel: string;
  orderDate: string;
}

interface OrderListData {
  totalCount: number;
  orders: OrderData[];
}

export default async function MyOrdersPage() {
  let data: OrderListData | null = null;

  try {
    data = await api<OrderListData>('/my/orders');
  } catch (e) {
    // fallback
  }

  return (
    <main className="pb-16">
      <Header />
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <Link href="/my" className="text-gray-400 text-sm">←</Link>
        <h1 className="text-base font-bold text-gray-900">주문/배송 조회</h1>
      </div>

      {!data ? (
        <div className="p-4">
          <p className="text-sm text-gray-500">주문 정보를 불러올 수 없습니다.</p>
        </div>
      ) : data.orders.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-400">주문 내역이 없습니다.</p>
          <Link href="/" className="inline-block mt-3 text-sm text-primary font-medium">쇼핑하러 가기</Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {data.orders.map((order) => (
            <OrderListItem key={order.orderId} order={order} />
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
