interface PriceSummaryData {
  total_product_price: number;
  product_discount: number;
  cart_discount: number;
  coupon_discount: number;
  point_used: number;
  shipping_fee: number;
  total_payment: number;
}

export function PriceSummary({ summary }: { summary: PriceSummaryData }) {
  return (
    <div className="bg-white mt-2 px-4 py-4">
      <h2 className="text-sm font-bold text-gray-900 mb-3">결제 금액</h2>
      <div className="space-y-1.5 text-sm">
        <Row label="상품 금액" value={summary.total_product_price} />
        {summary.product_discount !== 0 && <Row label="상품 할인" value={summary.product_discount} isDiscount />}
        {summary.cart_discount !== 0 && <Row label="장바구니 할인" value={summary.cart_discount} isDiscount />}
        {summary.coupon_discount !== 0 && <Row label="쿠폰 할인" value={summary.coupon_discount} isDiscount />}
        {summary.point_used !== 0 && <Row label="포인트 사용" value={-summary.point_used} isDiscount />}
        <Row label="배송비" value={summary.shipping_fee} isFree={summary.shipping_fee === 0} />
        <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between items-center">
          <span className="font-bold text-gray-900">최종 결제금액</span>
          <span className="font-bold text-lg text-primary">{summary.total_payment.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, isDiscount, isFree }: { label: string; value: number; isDiscount?: boolean; isFree?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={isDiscount ? 'text-red-500' : 'text-gray-900'}>
        {isFree ? '무료' : `${value.toLocaleString()}원`}
      </span>
    </div>
  );
}
