'use client';

import { useState } from 'react';

export function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={img} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      {/* 좌우 버튼 */}
      {current > 0 && (
        <button
          onClick={() => setCurrent(current - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center"
        >
          ‹
        </button>
      )}
      {current < images.length - 1 && (
        <button
          onClick={() => setCurrent(current + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center"
        >
          ›
        </button>
      )}
      {/* 카운터 */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}
