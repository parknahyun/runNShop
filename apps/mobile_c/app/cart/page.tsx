'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// === 타입 (화면레이아웃 §1 API 응답 기반) ===
interface CartItem {
  cart_item_id: string;
  product_id: string;
  sku_id: string;
  product_name: string;
  option_name: string;
  image_url: string;
  original_price: number;
  sale_price: number;
  quantity: number;
  status: 'ON_SALE' | 'SOLD_OUT';
}

interface Vendor {
  vendor_id: string;
  vendor_name: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  items: CartItem[];
}

interface CartPromotion {
  promotion_name: string;
  discount_amount: number;
  applied: boolean;
}

interface CartSummary {
  total_product_amount: number;
  product_discount: number;
  cart_discount: number;
  shipping_fee: number;
  total_payment: number;
  coupon_benefit_text: string;
  point_balance: number;
}

interface CartResponse {
  vendors: Vendor[];
  cart_promotions: CartPromotion[];
  summary: CartSummary;
  total_count: number;
}

// === 금액 포맷 ===
function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

// === 장바구니 페이지 (C-3 L-FORM: BackHeader + Content + StickyBottom) ===
export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/cart');
      if (!res.ok) throw new Error('장바구니 정보를 불러올 수 없습니다.');
      const data = await res.json();
      setCart(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuantityChange(cartItemId: string, delta: number) {
    await fetch(`/api/v1/cart/items/${cartItemId}/quantity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    });
    fetchCart();
  }

  async function handleDelete(cartItemId: string) {
    await fetch(`/api/v1/cart/items/${cartItemId}`, { method: 'DELETE' });
    fetchCart();
  }

  // --- 로딩 ---
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // --- 에러 ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-sm">
        <p>{error}</p>
        <button onClick={fetchCart} className="mt-3 text-primary text-sm">다시 시도</button>
      </div>
    );
  }

  // --- 빈 장바구니 ---
  if (!cart || cart.total_count === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-sm">
        <p>장바구니가 비어있습니다.</p>
        <Link href="/" className="mt-3 bg-primary text-white px-4 py-2 rounded text-sm font-bold">
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Content */}
      <div className="px-3 pt-3 pb-20 space-y-3">
        {/* 입점사별 상품 그룹 */}
        {cart.vendors.map((vendor) => (
          <section key={vendor.vendor_id} className="bg-white rounded-lg border border-gray-200 p-3">
            {/* VendorGroup 헤더 */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-secondary">{vendor.vendor_name}</span>
              <span className="text-xs text-gray-400">
                {vendor.shipping_fee === 0 ? '무료배송' : `배송비 ${formatPrice(vendor.shipping_fee)}`}
              </span>
            </div>

            {/* CartItem 목록 */}
            <div className="space-y-3">
              {vendor.items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className={`flex gap-2 ${item.status === 'SOLD_OUT' ? 'opacity-50' : ''}`}
                >
                  {/* 상품 이미지 */}
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 relative">
                    {item.status === 'SOLD_OUT' && (
                      <div className="absolute inset-0 bg-gray-500/70 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">품절</span>
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary truncate">{item.product_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{item.option_name}</span>
                      <button className="text-xs text-primary">[옵션변경]</button>
                    </div>

                    {/* 가격 */}
                    <div className="flex items-center gap-1 mt-1">
                      {item.original_price !== item.sale_price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.original_price)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-secondary">
                        {formatPrice(item.sale_price)}
                      </span>
                    </div>

                    {/* 수량 + 삭제 */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.cart_item_id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 border border-gray-300 rounded text-xs disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.cart_item_id, 1)}
                          className="w-6 h-6 border border-gray-300 rounded text-xs"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(item.cart_item_id)}
                        className="text-xs text-gray-400"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* 장바구니 할인행사 안내 */}
        {cart.cart_promotions.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-xs font-bold text-secondary mb-2">🏷 장바구니 할인 행사</p>
            <div className="space-y-1">
              {cart.cart_promotions.map((promo, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  <span>{promo.applied ? '🔥' : '💡'}</span>
                  <span className={promo.applied ? 'text-secondary' : 'text-gray-400'}>
                    {promo.promotion_name}
                    {promo.applied && ` (-${formatPrice(promo.discount_amount)})`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 혜택 안내 */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            💡 사용 가능 쿠폰 {cart.summary.coupon_benefit_text} · 포인트 {cart.summary.point_balance.toLocaleString()}P
          </span>
          <span className="text-xs text-gray-400">[&gt;]</span>
        </div>

        {/* CartSummary 결제 예상 금액 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm font-bold text-secondary mb-2">결제 예상 금액</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">상품 금액</span>
              <span>{formatPrice(cart.summary.total_product_amount)}</span>
            </div>
            {cart.summary.product_discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">상품 할인</span>
                <span className="text-primary">-{formatPrice(cart.summary.product_discount)}</span>
              </div>
            )}
            {cart.summary.cart_discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">장바구니 할인</span>
                <span className="text-primary">-{formatPrice(cart.summary.cart_discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">배송비</span>
              <span>{cart.summary.shipping_fee === 0 ? '무료' : formatPrice(cart.summary.shipping_fee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-bold text-sm">
              <span>총 결제 예상금액</span>
              <span className="text-secondary">{formatPrice(cart.summary.total_payment)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* StickyBottom CTA (C-3: L-FORM StickyBottom) */}
      <div className="fixed bottom-12 left-0 right-0 max-w-[360px] mx-auto bg-white border-t border-gray-200 p-3 z-20">
        <Link
          href="/orders/new"
          className="block w-full bg-primary text-white text-center py-3 rounded font-bold text-sm"
        >
          선택상품 주문하기 · {formatPrice(cart.summary.total_payment)}
        </Link>
      </div>
    </>
  );
}
