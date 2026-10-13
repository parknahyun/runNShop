interface SummaryData {
  total_product_price: number;
  total_discount: number;
  cart_discount: number;
  total_shipping_fee: number;
  total_payment: number;
  point_balance: number;
  coupon_benefit_text: string;
}

export function CartSummary({ summary }: { summary: SummaryData }) {
  return (
    <div className="mx-4 mt-4 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-bold text-gray-900 mb-3">결제 예상 금액</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">상품 금액</span>
          <span className="text-gray-900">{summary.total_product_price.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">상품 할인</span>
          <span className="text-red-500">{summary.total_discount.toLocaleString()}원</span>
        </div>
        {summary.cart_discount !== 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">장바구니 할인</span>
            <span className="text-red-500">{summary.cart_discount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">배송비</span>
          <span className="text-gray-900">
            {summary.total_shipping_fee === 0 ? '무료' : `${summary.total_shipping_fee.toLocaleString()}원`}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
          <span className="font-bold text-gray-900">총 결제 예상금액</span>
          <span className="font-bold text-lg text-gray-900">{summary.total_payment.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
