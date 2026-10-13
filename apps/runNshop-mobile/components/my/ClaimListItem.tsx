import Link from 'next/link';

interface ClaimData {
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
  refundAmount: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  RECEIVED: 'bg-blue-50 text-blue-600',
  IN_PROGRESS: 'bg-amber-50 text-amber-600',
  COMPLETED: 'bg-green-50 text-green-600',
  REJECTED: 'bg-red-50 text-red-500',
};

const TYPE_COLOR: Record<string, string> = {
  CANCEL: 'text-red-500',
  RETURN: 'text-orange-500',
  EXCHANGE: 'text-blue-600',
};

export function ClaimListItem({ claim }: { claim: ClaimData }) {
  return (
    <Link href={`/my/claims/${claim.claimId}`} className="block bg-white px-4 py-4">
      {/* 상단: 날짜 + 클레임 번호 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${TYPE_COLOR[claim.claimType] || 'text-gray-600'}`}>
            {claim.claimTypeLabel}
          </span>
          <span className="text-xs text-gray-400">{claim.claimNo}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[claim.status] || 'bg-gray-50 text-gray-600'}`}>
          {claim.statusLabel}
        </span>
      </div>

      {/* 상품 정보 */}
      <div className="flex gap-3">
        <img
          src={claim.imageUrl}
          alt={claim.productName}
          className="w-14 h-14 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 line-clamp-1">{claim.productName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{claim.optionName}</p>
          <p className="text-xs text-gray-400 mt-1">사유: {claim.reason}</p>
        </div>
        {claim.refundAmount > 0 && (
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-gray-400">환불금액</p>
            <p className="text-sm font-bold text-gray-900">{claim.refundAmount.toLocaleString()}원</p>
          </div>
        )}
      </div>

      {/* 하단: 접수일 + 상세보기 안내 */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">접수일 {claim.createdAt}</span>
        <span className="text-xs text-gray-300">상세보기 ›</span>
      </div>
    </Link>
  );
}
