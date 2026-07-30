import { api } from '@/lib/api';
import { ImageSlider } from '@/components/product/ImageSlider';
import { PriceInfo } from '@/components/product/PriceInfo';
import { SkuSelector } from '@/components/product/SkuSelector';
import { ReviewSummary } from '@/components/product/ReviewSummary';
import { ProductTabs } from '@/components/product/ProductTabs';
import { BottomActions } from '@/components/product/BottomActions';

interface ProductData {
  product_id: number;
  product_name: string;
  brand: string;
  category_name: string;
  images: string[];
  price_original: number;
  price_sale: number;
  discount_rate: number;
  description: string;
  detail_html: string;
  skus: Sku[];
  review_summary: {
    average_rating: number;
    total_count: number;
    rating_distribution: Record<string, number>;
  };
  qna_count: number;
  shipping: {
    fee: number;
    free_threshold: number;
    delivery_days: string;
  };
}

interface Sku {
  sku_id: number;
  color: string;
  size: string;
  stock: number;
  status: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  let product: ProductData | null = null;

  try {
    product = await api<ProductData>(`/products/${params.productId}`);
  } catch (e) {
    // fallback
  }

  if (!product) {
    return (
      <main className="p-4">
        <p className="text-sm text-gray-500">상품 정보를 불러올 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="pb-20">
      {/* 이미지 슬라이더 */}
      <ImageSlider images={product.images} />

      {/* 상품 기본 정보 */}
      <div className="px-4 pt-4">
        <p className="text-xs text-gray-500">{product.brand}</p>
        <h1 className="text-lg font-bold text-gray-900 mt-1">{product.product_name}</h1>
        <PriceInfo
          priceOriginal={product.price_original}
          priceSale={product.price_sale}
          discountRate={product.discount_rate}
        />
        <p className="text-sm text-gray-600 mt-3">{product.description}</p>
      </div>

      {/* 배송 정보 */}
      <div className="px-4 mt-4 py-3 border-y border-gray-100">
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-16">배송비</span>
          <span className="text-gray-900">
            {product.shipping.fee > 0
              ? `${product.shipping.fee.toLocaleString()}원 (${product.shipping.free_threshold.toLocaleString()}원 이상 무료)`
              : '무료배송'}
          </span>
        </div>
        <div className="flex items-center text-sm mt-1">
          <span className="text-gray-500 w-16">배송기간</span>
          <span className="text-gray-900">{product.shipping.delivery_days}</span>
        </div>
      </div>

      {/* 옵션 선택 */}
      <SkuSelector skus={product.skus} />

      {/* 리뷰 요약 */}
      <ReviewSummary
        averageRating={product.review_summary.average_rating}
        totalCount={product.review_summary.total_count}
        distribution={product.review_summary.rating_distribution}
      />

      {/* 탭 (상품정보 / 리뷰 / QnA) */}
      <ProductTabs
        detailHtml={product.detail_html}
        reviewCount={product.review_summary.total_count}
        qnaCount={product.qna_count}
      />

      {/* 하단 고정 액션 */}
      <BottomActions productName={product.product_name} />
    </main>
  );
}
