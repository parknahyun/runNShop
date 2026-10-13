interface ProductsSummaryData {
  on_sale: number;
  sold_out: number;
  under_review: number;
}

export function ProductsSummary({ data }: { data: ProductsSummaryData }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">판매 상품 현황</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-gray-600">판매중</span>
          <span className="text-sm font-bold text-green-600">{data.on_sale.toLocaleString()}개</span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-gray-600">품절</span>
          <span className="text-sm font-bold text-red-500">{data.sold_out}개</span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-gray-600">심사중</span>
          <span className="text-sm font-bold text-yellow-600">{data.under_review}개</span>
        </div>
      </div>
    </div>
  );
}
