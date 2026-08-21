import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    code: 'SUCCESS',
    data: {
      order_sheet_id: 'SHEET-001',
      addresses: [
        {
          address_id: 'ADDR001',
          recipient_name: '홍길동',
          phone: '010-****-5678',
          zip_code: '06234',
          address: '서울 강남구 테헤란로 123',
          address_detail: '런앤샵타워 5층',
          is_default: true,
        },
        {
          address_id: 'ADDR002',
          recipient_name: '홍길동',
          phone: '010-****-5678',
          zip_code: '13529',
          address: '경기 성남시 분당구 판교로 228',
          address_detail: '판교테크원 3층',
          is_default: false,
        },
      ],
      orders: [
        {
          vendor_name: '나이키코리아',
          items: [
            { product_name: '나이키 페가수스 41', option_name: '블랙/265', quantity: 1, sale_price: 152000, image_url: '' },
            { product_name: '나이키 드라이핏 티셔츠', option_name: '네이비/L', quantity: 2, sale_price: 59000, image_url: '' },
          ],
        },
        {
          vendor_name: '아식스코리아',
          items: [
            { product_name: '아식스 젤카야노 31', option_name: '화이트/270', quantity: 1, sale_price: 199000, image_url: '' },
          ],
        },
      ],
      coupons: { available_count: 2 },
      point: { balance: 5200, usable: 5200 },
      payment_methods: [
        { method_id: 'PM01', method_type: 'CARD', display_name: '신용카드' },
        { method_id: 'PM02', method_type: 'ACCOUNT', display_name: '계좌이체' },
        { method_id: 'PM03', method_type: 'SIMPLE_PAY', display_name: '카카오페이' },
      ],
      price_summary: {
        product_amount: 469000,
        product_discount: 48000,
        cart_discount: 3000,
        coupon_discount: 0,
        point_used: 0,
        shipping_fee: 0,
        total_payment: 418000,
      },
      terms: [
        { term_id: 'T01', title: '구매조건 확인 및 결제 진행 동의', required: true },
        { term_id: 'T02', title: '개인정보 제3자 제공 동의', required: true },
        { term_id: 'T03', title: '결제대행 서비스 이용약관 동의', required: true },
      ],
    },
  });
}
