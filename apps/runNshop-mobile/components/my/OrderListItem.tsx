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

const STATUS_COLOR: Record<string, string> = {
  PAYMENT_COMPLETED: 'text-blue-600',
  PREPARING: 'text-blue-600',
  IN_DELIVERY: 'text-primary',
  DELIVERED: 'text-green-600',
  CONFIRMED: 'text-gray-500',
  CANCELLED: 'text-red-500',
  PAYMENT_FAILED: 'text-red-500',
};

export function OrderListItem({ order }: { order: OrderData }) {
  return (
    <div className="bg-white px-4 py-4">
      {/* 주문일자 + 주문번호 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{order.orderDate}</span>
        <span className="text-xs text-gray-400">{order.platformOrderNo}</span>
      </div>

      {/* 상품 정보 */}
      <div className="flex gap-3">
        <img
          src={order.imageUrl}
          alt={order.productName}
          className="w-16 h-16 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 line-clamp-1">{order.productName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{order.optionName} · {order.quantity}개</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{order.amount.toLocaleString()}원</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className={`text-xs font-medium ${STATUS_COLOR[order.status] || 'text-gray-600'}`}>
            {order.statusLabel}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 mt-3">
        {order.status === 'DELIVERED' && (
          <>
            <ActionButton label="구매확정" />
            <ActionButton label="반품/교환" variant="secondary" />
          </>
        )}
        {order.status === 'IN_DELIVERY' && (
          <ActionButton label="배송조회" variant="secondary" />
        )}
        {order.status === 'PAYMENT_COMPLETED' && (
          <ActionButton label="주문취소" variant="danger" />
        )}
        {order.status === 'CONFIRMED' && (
          <ActionButton label="리뷰 작성" variant="secondary" />
        )}
      </div>
    </div>
  );
}

function ActionButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' | 'danger' }) {
  const base = 'px-3 py-1.5 text-xs rounded border';
  const styles = {
    primary: 'border-primary text-primary font-medium',
    secondary: 'border-gray-200 text-gray-600',
    danger: 'border-red-200 text-red-500',
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
