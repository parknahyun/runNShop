import Link from 'next/link';

interface OrderStatusSummary {
  paymentCompleted: number;
  preparing: number;
  inDelivery: number;
  delivered: number;
}

export function OrderStatusBar({ summary }: { summary: OrderStatusSummary }) {
  return (
    <div className="bg-white mt-2 px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-900">주문/배송</h2>
        <Link href="/my/orders" className="text-xs text-gray-400">전체보기 →</Link>
      </div>
      <div className="flex items-center justify-between">
        <StatusStep label="결제완료" count={summary.paymentCompleted} />
        <Arrow />
        <StatusStep label="준비중" count={summary.preparing} />
        <Arrow />
        <StatusStep label="배송중" count={summary.inDelivery} highlight />
        <Arrow />
        <StatusStep label="배송완료" count={summary.delivered} />
      </div>
    </div>
  );
}

function StatusStep({ label, count, highlight }: { label: string; count: number; highlight?: boolean }) {
  return (
    <div className="text-center flex-1">
      <p className={`text-lg font-bold ${highlight && count > 0 ? 'text-primary' : 'text-gray-900'}`}>
        {count}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function Arrow() {
  return <span className="text-gray-300 text-xs">›</span>;
}
