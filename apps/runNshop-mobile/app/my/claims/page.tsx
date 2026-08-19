import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ClaimListItem } from '@/components/my/ClaimListItem';
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

interface ClaimListData {
  totalCount: number;
  claims: ClaimData[];
}

export default async function MyClaimsPage() {
  let data: ClaimListData | null = null;

  try {
    data = await api<ClaimListData>('/members/me/claims');
  } catch (e) {
    // fallback
  }

  return (
    <main className="pb-16 bg-gray-50">
      <Header />
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <Link href="/my" className="text-gray-400 text-sm">←</Link>
        <h1 className="text-base font-bold text-gray-900">취소/반품/교환 내역</h1>
      </div>

      {!data ? (
        <div className="p-4">
          <p className="text-sm text-gray-500">클레임 정보를 불러올 수 없습니다.</p>
        </div>
      ) : data.claims.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-400">접수된 클레임이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 상태 요약 */}
          <div className="bg-white mt-2 px-4 py-3">
            <div className="flex items-center justify-around text-center">
              <StatusCount label="접수" count={data.claims.filter(c => c.status === 'RECEIVED').length} />
              <StatusCount label="처리중" count={data.claims.filter(c => c.status === 'IN_PROGRESS').length} highlight />
              <StatusCount label="완료" count={data.claims.filter(c => c.status === 'COMPLETED').length} />
              <StatusCount label="반려" count={data.claims.filter(c => c.status === 'REJECTED').length} />
            </div>
          </div>

          {/* 목록 */}
          <div className="mt-2 divide-y divide-gray-100">
            {data.claims.map((claim) => (
              <ClaimListItem key={claim.claimId} claim={claim} />
            ))}
          </div>
        </>
      )}

      <BottomNav />
    </main>
  );
}

function StatusCount({ label, count, highlight }: { label: string; count: number; highlight?: boolean }) {
  return (
    <div>
      <p className={`text-lg font-bold ${highlight && count > 0 ? 'text-primary' : 'text-gray-900'}`}>{count}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
