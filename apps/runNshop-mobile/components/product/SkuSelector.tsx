'use client';

import { useState } from 'react';

interface Sku {
  sku_id: number;
  color: string;
  size: string;
  stock: number;
  status: string;
}

export function SkuSelector({ skus }: { skus: Sku[] }) {
  const colors = [...new Set(skus.map(s => s.color))];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const availableSizes = selectedColor
    ? skus.filter(s => s.color === selectedColor)
    : [];

  return (
    <div className="px-4 mt-4">
      <h3 className="text-sm font-bold text-gray-900 mb-2">옵션 선택</h3>

      {/* 색상 */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1.5">색상</p>
        <div className="flex gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
              className={`px-3 py-1.5 text-sm rounded border ${
                selectedColor === color
                  ? 'border-primary text-primary font-medium'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* 사이즈 */}
      {selectedColor && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">사이즈</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(sku => {
              const isSoldOut = sku.status === 'SOLD_OUT';
              return (
                <button
                  key={sku.sku_id}
                  disabled={isSoldOut}
                  onClick={() => setSelectedSize(sku.size)}
                  className={`px-3 py-1.5 text-sm rounded border ${
                    isSoldOut
                      ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                      : selectedSize === sku.size
                        ? 'border-primary text-primary font-medium'
                        : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {sku.size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
