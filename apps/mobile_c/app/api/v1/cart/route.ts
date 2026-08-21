import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    code: 'SUCCESS',
    data: {
      total_count: 4,
      vendors: [
        {
          vendor_id: 'V001',
          vendor_name: '나이키코리아',
          shipping_fee: 0,
          free_shipping_threshold: 50000,
          items: [
            {
              cart_item_id: 'CI001',
              product_id: 'P001',
              sku_id: 'SKU001',
              product_name: '나이키 페가수스 41',
              option_name: '블랙 / 265',
              image_url: '',
              original_price: 179000,
              sale_price: 152000,
              quantity: 1,
              status: 'ON_SALE',
            },
            {
              cart_item_id: 'CI002',
              product_id: 'P002',
              sku_id: 'SKU002',
              product_name: '나이키 드라이핏 러닝 티셔츠',
              option_name: '네이비 / L',
              image_url: '',
              original_price: 59000,
              sale_price: 59000,
              quantity: 2,
              status: 'ON_SALE',
            },
          ],
        },
        {
          vendor_id: 'V002',
          vendor_name: '아식스코리아',
          shipping_fee: 0,
          free_shipping_threshold: 50000,
          items: [
            {
              cart_item_id: 'CI003',
              product_id: 'P003',
              sku_id: 'SKU003',
              product_name: '아식스 젤카야노 31',
              option_name: '화이트 / 270',
              image_url: '',
              original_price: 229000,
              sale_price: 199000,
              quantity: 1,
              status: 'ON_SALE',
            },
            {
              cart_item_id: 'CI004',
              product_id: 'P004',
              sku_id: 'SKU004',
              product_name: '아식스 매직스피드 4',
              option_name: '블루 / 265',
              image_url: '',
              original_price: 249000,
              sale_price: 249000,
              quantity: 1,
              status: 'SOLD_OUT',
            },
          ],
        },
      ],
      cart_promotions: [
        { promotion_name: '나이키 2개 이상 구매 시 할인', discount_amount: 2000, applied: true },
        { promotion_name: '러닝화+의류 세트 할인', discount_amount: 1000, applied: true },
      ],
      summary: {
        total_product_amount: 469000,
        product_discount: 57000,
        cart_discount: 3000,
        shipping_fee: 0,
        total_payment: 409000,
        coupon_benefit_text: '2장',
        point_balance: 5200,
      },
    },
  });
}
