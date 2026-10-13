import { api } from '@/lib/api';
import { AddressSection } from '@/components/order/AddressSection';
import { OrderItemList } from '@/components/order/OrderItemList';
import { CouponSection } from '@/components/order/CouponSection';
import { PointSection } from '@/components/order/PointSection';
import { PaymentMethod } from '@/components/order/PaymentMethod';
import { PriceSummary } from '@/components/order/PriceSummary';
import { TermsAgreement } from '@/components/order/TermsAgreement';
import { OrderBottomBar } from '@/components/order/OrderBottomBar';

interface OrderSheetData {
  order_sheet_id: string;
  orderer: { name: string; phone: string; email: string };
  addresses: Address[];
  orders: OrderGroup[];
  coupons: { available_count: number; items: Coupon[] };
  point: { balance: number; usable: number; min_use: number };
  payment_methods: { type: string; label: string }[];
  price_summary: PriceSummaryData;
  terms: Term[];
}

interface Address {
  address_id: number;
  recipient: string;
  phone: string;
  zip_code: string;
  address: string;
  address_detail: string;
  is_default: boolean;
}

interface OrderGroup {
  vendor_id: number;
  vendor_name: string;
  items: OrderItem[];
}

interface OrderItem {
  product_id: number;
  product_name: string;
  image_url: string;
  color: string;
  size: string;
  price_sale: number;
  quantity: number;
}

interface Coupon {
  coupon_id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  max_discount: number;
  min_order: number;
}

interface PriceSummaryData {
  total_product_price: number;
  product_discount: number;
  cart_discount: number;
  coupon_discount: number;
  point_used: number;
  shipping_fee: number;
  total_payment: number;
}

interface Term {
  term_id: string;
  title: string;
  required: boolean;
}

export default async function OrderNewPage() {
  let sheet: OrderSheetData | null = null;

  try {
    sheet = await api<OrderSheetData>('/my/orders/sheet');
  } catch (e) {
    // fallback
  }

  if (!sheet) {
    return (
      <main className="p-4">
        <p className="text-sm text-gray-500">주문서 정보를 불러올 수 없습니다.</p>
      </main>
    );
  }

  const defaultAddress = sheet.addresses.find(a => a.is_default) || sheet.addresses[0];

  return (
    <main className="pb-28 bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">주문서</h1>
      </div>

      {/* 배송지 */}
      <AddressSection address={defaultAddress} />

      {/* 주문 상품 */}
      <OrderItemList orders={sheet.orders} />

      {/* 쿠폰 */}
      <CouponSection coupons={sheet.coupons} />

      {/* 포인트 */}
      <PointSection point={sheet.point} />

      {/* 결제 수단 */}
      <PaymentMethod methods={sheet.payment_methods} />

      {/* 금액 요약 */}
      <PriceSummary summary={sheet.price_summary} />

      {/* 약관 동의 + 결제하기 */}
      <TermsAgreement terms={sheet.terms} />
      <OrderBottomBar totalPayment={sheet.price_summary.total_payment} />
    </main>
  );
}
