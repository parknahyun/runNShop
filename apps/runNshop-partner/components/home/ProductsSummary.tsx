interface ProductsSummaryData {
  on_sale: number;
  sold_out: number;
  under_review: number;
  rejected: number;
  draft: number;
}

export function ProductsSummary({ data }: { data: ProductsSummaryData }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">내 상품 현황</h3>
      <div className="space-y-2">
        <Row label="판매중" value={data.on_sale} color="text-green-600" />
        <Row label="품절" value={data.sold_out} color="text-red-500" />
        <Row label="심사중" value={data.under_review} color="text-yellow-600" />
        <Row label="반려" value={data.rejected} color="text-red-400" />
        <Row label="임시저장" value={data.draft} color="text-gray-500" />
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}개</span>
    </div>
  );
}
