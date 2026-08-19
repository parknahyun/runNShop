import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ClaimStatusTimeline } from '@/components/my/ClaimStatusTimeline';
import Link from 'next/link';

interface PickupInfo {
  carrier: string;
  trackingNo: string;
  status: string;
  requestedAt: string;
}

interface RefundInfo {
  method: string;
  status: string;
  expectedAt: string;
}

interface TimelineItem {
  at: string;
  event: string;
  description: string;
}

interface ClaimDetail {
  claimId: string;
  claimNo: string;
  claimType: string;
  claimTypeLabel: string;
  status: string;
  statusLabel: string;
  orderId: string;
  platformOrderNo: string;
  productName: string;
  imageUrl: string;
  optionName: string;
  quantity: number;
  amount: number;
  refundAmount: number;
  reason: string;
  detailReason: string;
  responsibility: string;
  responsibilityLabel: string;
  returnShippingFee: number;
  createdAt: string;
  pickup: PickupInfo | null;
  refund: RefundInfo | null;
  timeline: TimelineItem[];
}

const STATUS_BADGE: Record<string, string> = {
  RECEIVED: 'bg-blue-50 text-blue-600',
  IN_PROGRESS: 'bg-amber-50 text-amber-600',
  COMPLETED: 'bg-green-50 text-green-600',
  REJECTED: 'bg-red-50 text-red-500',
};

export default async function ClaimDetailPage({ params }: { params: Promise<{ claimId: string }> }) {
  const { claimId } = await params;
  let claim: ClaimDetail | null = null;

  try {
    claim = await api<ClaimDetail>(`/members/me/claims/${claimId}`);
  } catch (e) {
    // fallback
  }

  if (!claim) {
    return (
      <main className="pb-16">
        <Header />
        <div className="p-4">
          <p className="text-sm text-gray-500">클레임 정보를 불러올 수 없습니다.</p>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="pb-16 bg-gray-50">
      <Header />

      {/* 헤더 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <Link href="/my/claims" className="text-gray-400 text-sm">←</Link>
        <h1 className="text-base font-bold text-gray-900">{claim.claimTypeLabel} 상세</h1>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[claim.status] || 'bg-gray-50 text-gray-600'}`}>
          {claim.statusLabel}
        </span>
      </div>

      {/* 상품 정보 */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex gap-3">
          <img src={claim.imageUrl} alt={claim.productName} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{claim.productName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{claim.optionName} · {claim.quantity}개</p>
            <p className="text-sm font-bold text-gray-900 mt-1">{claim.amount.toLocaleString()}원</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p>주문번호: {claim.platformOrderNo}</p>
          <p>클레임번호: {claim.claimNo}</p>
          <p>접수일시: {claim.createdAt}</p>
        </div>
      </div>

      {/* 클레임 사유 */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2">{claim.claimTypeLabel} 사유</h2>
        <p className="text-sm text-gray-700">{claim.reason}</p>
        {claim.detailReason && (
          <p className="text-xs text-gray-500 mt-1">{claim.detailReason}</p>
        )}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span>귀책: {claim.responsibilityLabel}</span>
          {claim.returnShippingFee > 0 && (
            <span>반품 배송비: {claim.returnShippingFee.toLocaleString()}원</span>
          )}
        </div>
      </div>

      {/* 수거 정보 */}
      {claim.pickup && (
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">수거 정보</h2>
          <div className="space-y-1 text-sm">
            <InfoRow label="택배사" value={claim.pickup.carrier} />
            <InfoRow label="운송장번호" value={claim.pickup.trackingNo} />
            <InfoRow label="수거 상태" value={claim.pickup.status} highlight />
            <InfoRow label="요청일시" value={claim.pickup.requestedAt} />
          </div>
        </div>
      )}

      {/* 환불 정보 */}
      {claim.refund && (
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">환불 정보</h2>
          <div className="space-y-1 text-sm">
            <InfoRow label="환불 수단" value={claim.refund.method} />
            <InfoRow label="환불 상태" value={claim.refund.status} highlight />
            <InfoRow label="환불 예상" value={claim.refund.expectedAt} />
            <InfoRow label="환불 금액" value={`${claim.refundAmount.toLocaleString()}원`} bold />
          </div>
        </div>
      )}

      {/* 처리 타임라인 */}
      {claim.timeline.length > 0 && (
        <ClaimStatusTimeline timeline={claim.timeline} />
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
