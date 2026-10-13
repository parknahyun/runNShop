import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ClaimStatusTimeline } from '@/components/my/ClaimStatusTimeline';
import Link from 'next/link';

interface OrderProduct {
  productName: string;
  imageUrl: string;
  optionName: string;
  quantity: number;
  amount: number;
  claimableQuantity: number;
}

interface OrderItemGroup {
  vendorName: string;
  vendorStatus?: string;
  products: OrderProduct[];
}

interface OrderPayment {
  productAmount: number;
  productDiscount: number;
  cartDiscount: number;
  shippingFee: number;
  totalAmount: number;
  method: string;
  paidAt: string;
}

interface OrderShipping {
  recipientName: string;
  phone: string;
  address: string;
  memo: string;
  carrier: string;
  trackingNumber: string;
  deliveryStatus: string;
}

interface OrderHistoryItem {
  at: string;
  event: string;
}

interface OrderDetailData {
  orderId: string;
  platformOrderNo: string;
  status: string;
  orderDate: string;
  items: OrderItemGroup[];
  payment: OrderPayment;
  shipping: OrderShipping;
  history: OrderHistoryItem[];
}

const STATUS_BADGE: Record<string, string> = {
  ORDER_RECEIVED: 'bg-gray-50 text-gray-600',
  PAYMENT_COMPLETED: 'bg-blue-50 text-blue-600',
  PREPARING: 'bg-blue-50 text-blue-600',
  IN_DELIVERY: 'bg-amber-50 text-amber-600',
  DELIVERED: 'bg-green-50 text-green-600',
  CONFIRMED: 'bg-gray-50 text-gray-600',
  CANCELLED: 'bg-red-50 text-red-500',
};

const STATUS_LABEL: Record<string, string> = {
  ORDER_RECEIVED: '주문접수',
  PAYMENT_COMPLETED: '결제완료',
  PREPARING: '상품준비중',
  IN_DELIVERY: '배송중',
  DELIVERED: '배송완료',
  CONFIRMED: '구매확정',
  CANCELLED: '취소',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  let data: OrderDetailData | null = null;

  try {
    data = await api<OrderDetailData>(`/my/orders/${orderId}`);
  } catch (e) {
    // fallback
  }

  if (!data) {
    return (
      <main className="pb-16">
        <Header />
        <div className="p-4">
          <p className="text-sm text-gray-500">주문 정보를 불러올 수 없습니다.</p>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="pb-16 bg-gray-50">
      <Header />

      {/* 헤더 + 상태뱃지 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <Link href="/my/orders" className="text-gray-400 text-sm">←</Link>
        <h1 className="text-base font-bold text-gray-900">주문 상세</h1>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[data.status] || 'bg-gray-50 text-gray-600'}`}>
          {STATUS_LABEL[data.status] || data.status}
        </span>
      </div>

      {/* 주문 기본 정보 */}
      <div className="bg-white mt-2 px-4 py-4 text-sm space-y-1">
        <InfoRow label="주문번호" value={data.platformOrderNo} />
        <InfoRow label="주문일시" value={data.orderDate} />
      </div>

      {/* 주문 상품 목록 */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">주문 상품</h2>
        <div className="space-y-4">
          {data.items.map((group, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4 border-t border-gray-100' : ''}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">■ {group.vendorName}</span>
                {group.vendorStatus && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[group.vendorStatus] || 'bg-gray-50 text-gray-600'}`}>
                    {STATUS_LABEL[group.vendorStatus] || group.vendorStatus}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {group.products.map((product, pIdx) => (
                  <div key={pIdx} className="flex gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.productName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{product.optionName} · {product.quantity}개</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">{product.amount.toLocaleString()}원</p>
                      {product.claimableQuantity > 0 && data.status === 'DELIVERED' && (
                        <div className="flex gap-2 mt-2">
                          <ProductActionButton label="구매확정" />
                          <ProductActionButton label="반품/교환" variant="secondary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">결제 정보</h2>
        <div className="space-y-1 text-sm">
          <InfoRow label="상품 금액" value={`${data.payment.productAmount.toLocaleString()}원`} />
          <InfoRow label="상품 할인" value={`${data.payment.productDiscount.toLocaleString()}원`} />
          <InfoRow label="장바구니 할인" value={`${data.payment.cartDiscount.toLocaleString()}원`} />
          <InfoRow label="배송비" value={data.payment.shippingFee === 0 ? '무료' : `${data.payment.shippingFee.toLocaleString()}원`} />
          <div className="border-t border-gray-100 my-2" />
          <InfoRow label="총 결제금액" value={`${data.payment.totalAmount.toLocaleString()}원`} bold />
          <div className="border-t border-gray-100 my-2" />
          <InfoRow label="결제수단" value={data.payment.method} />
          <InfoRow label="결제일시" value={data.payment.paidAt} />
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">배송 정보</h2>
        <div className="space-y-1 text-sm">
          <InfoRow label="수령인" value={data.shipping.recipientName} />
          <InfoRow label="연락처" value={data.shipping.phone} />
          <InfoRow label="주소" value={data.shipping.address} />
          <InfoRow label="배송메모" value={data.shipping.memo} />
          <div className="border-t border-gray-100 my-2" />
          <InfoRow label="택배사" value={data.shipping.carrier} />
          <InfoRow label="운송장" value={data.shipping.trackingNumber} />
          <InfoRow label="배송상태" value={data.shipping.deliveryStatus} highlight />
        </div>
      </div>

      {/* 주문 이력 (Timeline) */}
      {data.history.length > 0 && (
        <ClaimStatusTimeline timeline={data.history.map((h) => ({ ...h, description: '' }))} />
      )}

      {/* 하단 고정 주문취소 버튼 */}
      {data.status === 'PAYMENT_COMPLETED' && (
        <OrderCancelBar />
      )}

      <BottomNav />
    </main>
  );
}

function InfoRow({ label, value, highlight, bold }: { label: string; value: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`${highlight ? 'text-primary font-medium' : bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
        {value}
      </span>
    </div>
  );
}

function ProductActionButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  const base = 'px-3 py-1.5 text-xs rounded border';
  const styles = {
    primary: 'border-primary text-primary font-medium',
    secondary: 'border-gray-200 text-gray-600',
  };

  return (
    <button
      onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}
      className={`${base} ${styles[variant]}`}
    >
      {label}
    </button>
  );
}

function OrderCancelBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto bg-white border-t border-gray-200 px-4 py-3">
      <button
        onClick={() => alert('프로토타입에서는 지원하지 않는 기능입니다.')}
        className="w-full h-12 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg text-sm"
      >
        주문취소
      </button>
    </div>
  );
}
