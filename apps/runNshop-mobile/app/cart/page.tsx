import { api } from '@/lib/api';
import { VendorGroup } from '@/components/cart/VendorGroup';
import { CartSummary } from '@/components/cart/CartSummary';
import { CartBottomBar } from '@/components/cart/CartBottomBar';

interface CartData {
  total_count: number;
  vendors: VendorData[];
  summary: SummaryData;
}

interface VendorData {
  vendor_id: number;
  vendor_name: string;
  shipping_fee: number;
  free_threshold: number;
  items: CartItem[];
}

interface CartItem {
  cart_item_id: number;
  product_id: number;
  product_name: string;
  image_url: string;
  color: string;
  size: string;
  price_original: number;
  price_sale: number;
  quantity: number;
  stock: number;
  status: string;
}

interface SummaryData {
  total_product_price: number;
  total_discount: number;
  cart_discount: number;
  total_shipping_fee: number;
  total_payment: number;
  point_balance: number;
  coupon_benefit_text: string;
}

export default async function CartPage() {
  let cartData: CartData | null = null;

  try {
    cartData = await api<CartData>('/my/cart');
  } catch (e) {
    // fallback
  }

  if (!cartData) {
    return (
      <main className="p-4">
        <p className="text-sm text-gray-500">장바구니 정보를 불러올 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="pb-24 bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">
          장바구니 <span className="text-primary">{cartData.total_count}</span>
        </h1>
      </div>

      {/* 입점사별 그룹 */}
      {cartData.vendors.map((vendor) => (
        <VendorGroup key={vendor.vendor_id} vendor={vendor} />
      ))}

      {/* 혜택 안내 */}
      <div className="mx-4 mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">💡 {cartData.summary.coupon_benefit_text} · 포인트 잔액 {cartData.summary.point_balance.toLocaleString()}P</p>
        <p className="text-xs text-blue-600 mt-0.5">쿠폰·포인트는 주문서에서 적용할 수 있습니다.</p>
      </div>

      {/* 금액 요약 */}
      <CartSummary summary={cartData.summary} />

      {/* 하단 고정 바 */}
      <CartBottomBar totalPayment={cartData.summary.total_payment} />
    </main>
  );
}
