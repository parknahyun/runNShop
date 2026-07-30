interface PriceInfoProps {
  priceOriginal: number;
  priceSale: number;
  discountRate: number;
}

export function PriceInfo({ priceOriginal, priceSale, discountRate }: PriceInfoProps) {
  return (
    <div className="mt-2">
      {discountRate > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-red-500">{discountRate}%</span>
          <span className="text-sm text-gray-400 line-through">
            {priceOriginal.toLocaleString()}원
          </span>
        </div>
      )}
      <p className="text-2xl font-bold text-gray-900">
        {priceSale.toLocaleString()}원
      </p>
    </div>
  );
}
