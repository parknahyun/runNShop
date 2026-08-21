'use client';

import { useEffect, useState } from 'react';

// === 타입 (화면레이아웃 §2 API 응답 기반) ===
interface Address {
  address_id: string;
  recipient_name: string;
  phone: string;
  zip_code: string;
  address: string;
  address_detail: string;
  is_default: boolean;
}

interface OrderItem {
  product_name: string;
  option_name: string;
  quantity: number;
  sale_price: number;
  image_url: string;
}

interface OrderVendor {
  vendor_name: string;
  items: OrderItem[];
}

interface CouponInfo {
  available_count: number;
}

interface PointInfo {
  balance: number;
  usable: number;
}

interface PriceSummary {
  product_amount: number;
  product_discount: number;
  cart_discount: number;
  coupon_discount: number;
  point_used: number;
  shipping_fee: number;
  total_payment: number;
}

interface PaymentMethod {
  method_id: string;
  method_type: string;
  display_name: string;
}

interface Term {
  term_id: string;
  title: string;
  required: boolean;
}

interface OrderSheet {
  order_sheet_id: string;
  addresses: Address[];
  orders: OrderVendor[];
  coupons: CouponInfo;
  point: PointInfo;
  payment_methods: PaymentMethod[];
  price_summary: PriceSummary;
  terms: Term[];
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

// === 주문서 페이지 (C-3 L-FORM: BackHeader + Content + StickyBottom) ===
export default function OrderNewPage() {
  const [sheet, setSheet] = useState<OrderSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [pointInput, setPointInput] = useState<number>(0);
  const [agreedTerms, setAgreedTerms] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrderSheet();
  }, []);

  async function fetchOrderSheet() {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/orders/sheet', { method: 'POST' });
      if (!res.ok) throw new Error('주문서 정보를 불러올 수 없습니다.');
      const data = await res.json();
      const s = data.data as OrderSheet;
      setSheet(s);
      // 기본값 설정
      const defaultAddr = s.addresses.find((a) => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.address_id);
      if (s.payment_methods.length > 0) setSelectedPayment(s.payment_methods[0].method_id);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }

  function toggleTerm(termId: string) {
    setAgreedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) next.delete(termId);
      else next.add(termId);
      return next;
    });
  }

  function allRequiredAgreed(): boolean {
    if (!sheet) return false;
    return sheet.terms.filter((t) => t.required).every((t) => agreedTerms.has(t.term_id));
  }

  async function handlePay() {
    if (!sheet || !allRequiredAgreed()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/orders/${sheet.order_sheet_id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address_id: selectedAddress,
          payment_method_id: selectedPayment,
          point_used: pointInput,
        }),
      });
      if (res.ok) {
        window.location.href = '/orders/complete';
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        주문서 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const currentAddr = sheet.addresses.find((a) => a.address_id === selectedAddress);

  return (
    <>
      <div className="px-3 pt-3 pb-24 space-y-3">
        {/* 배송지 섹션 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-secondary">배송지</span>
            <button className="text-xs text-primary">[변경]</button>
          </div>
          {currentAddr && (
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>{currentAddr.recipient_name}  {currentAddr.phone}</p>
              <p>[{currentAddr.zip_code}] {currentAddr.address} {currentAddr.address_detail}</p>
              {currentAddr.is_default && (
                <span className="inline-block mt-0.5 px-1 border border-gray-300 rounded text-xs text-gray-500">
                  기본 배송지
                </span>
              )}
            </div>
          )}
        </section>

        {/* 주문 상품 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3">
          {sheet.orders.map((vendor, vi) => (
            <div key={vi} className={vi > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}>
              <p className="text-xs font-bold text-secondary mb-2">■ {vendor.vendor_name}</p>
              <div className="space-y-2">
                {vendor.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <p className="text-secondary">{item.product_name}</p>
                      <p>{item.option_name} · {item.quantity}개  {formatPrice(item.sale_price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* 쿠폰 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
          <span className="text-sm text-secondary">쿠폰</span>
          <span className="text-xs text-primary">사용 가능 {sheet.coupons.available_count}장 [&gt;]</span>
        </section>

        {/* 포인트 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary">포인트</span>
            <span className="text-xs text-gray-400">보유 {sheet.point.balance.toLocaleString()}P</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={pointInput}
              onChange={(e) => setPointInput(Math.min(Number(e.target.value), sheet.point.usable))}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="0"
            />
            <span className="text-xs">P</span>
            <button
              onClick={() => setPointInput(sheet.point.usable)}
              className="text-xs text-primary border border-primary rounded px-2 py-1"
            >
              전액사용
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">최소 1,000P부터 사용 가능</p>
        </section>

        {/* 결제수단 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm text-secondary mb-2">결제 수단</p>
          <div className="flex gap-2 flex-wrap">
            {sheet.payment_methods.map((pm) => (
              <button
                key={pm.method_id}
                onClick={() => setSelectedPayment(pm.method_id)}
                className={`px-3 py-2 rounded text-xs border ${
                  selectedPayment === pm.method_id
                    ? 'border-primary text-primary font-bold'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                {pm.display_name}
              </button>
            ))}
          </div>
        </section>

        {/* 금액 요약 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm font-bold text-secondary mb-2">결제 금액</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">상품 금액</span>
              <span>{formatPrice(sheet.price_summary.product_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상품 할인</span>
              <span className="text-primary">-{formatPrice(sheet.price_summary.product_discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">장바구니 할인</span>
              <span className="text-primary">-{formatPrice(sheet.price_summary.cart_discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">쿠폰 할인</span>
              <span>{formatPrice(sheet.price_summary.coupon_discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">포인트 사용</span>
              <span>{formatPrice(sheet.price_summary.point_used)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">배송비</span>
              <span>{sheet.price_summary.shipping_fee === 0 ? '무료' : formatPrice(sheet.price_summary.shipping_fee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-bold text-sm">
              <span>최종 결제금액</span>
              <span className="text-secondary">{formatPrice(sheet.price_summary.total_payment)}</span>
            </div>
          </div>
        </section>

        {/* 약관 동의 */}
        <section className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
          {sheet.terms.map((term) => (
            <label key={term.term_id} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms.has(term.term_id)}
                onChange={() => toggleTerm(term.term_id)}
                className="w-4 h-4"
              />
              <span>
                {term.title} {term.required && <span className="text-error">(필수)</span>}
              </span>
            </label>
          ))}
        </section>
      </div>

      {/* StickyBottom CTA */}
      <div className="fixed bottom-12 left-0 right-0 max-w-[360px] mx-auto bg-white border-t border-gray-200 p-3 z-20">
        <button
          onClick={handlePay}
          disabled={!allRequiredAgreed() || submitting}
          className={`w-full py-3 rounded font-bold text-sm text-center ${
            allRequiredAgreed() && !submitting
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? '결제 진행 중...' : `${formatPrice(sheet.price_summary.total_payment)} 결제하기`}
        </button>
      </div>
    </>
  );
}
