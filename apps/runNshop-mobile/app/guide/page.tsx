'use client';

import Link from 'next/link';

export default function StyleGuide() {
  return (
    <main className="pb-16">
      {/* 헤더 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-2">
        <Link href="/" aria-label="메인으로" className="text-gray-500 text-lg leading-none">
          &lt;
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">스타일 가이드</h1>
          <p className="text-xs text-gray-500">runNshop-mobile · 360px</p>
        </div>
      </div>

      {/* 색상 */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Colors</h2>
        <div className="grid grid-cols-4 gap-2">
          <ColorSwatch color="bg-primary" label="Primary" hex="#FF4D00" />
          <ColorSwatch color="bg-gray-900" label="Secondary" hex="#1A1A1A" />
          <ColorSwatch color="bg-green-500" label="Success" hex="#00C853" />
          <ColorSwatch color="bg-yellow-500" label="Warning" hex="#FF9800" />
          <ColorSwatch color="bg-red-500" label="Error" hex="#F44336" />
          <ColorSwatch color="bg-gray-100" label="Gray100" hex="#F5F5F5" />
          <ColorSwatch color="bg-gray-300" label="Gray300" hex="#E0E0E0" />
          <ColorSwatch color="bg-gray-500" label="Gray500" hex="#9E9E9E" />
        </div>
      </section>

      {/* 타이포그래피 */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Typography</h2>
        <div className="space-y-2 bg-white rounded-lg p-4">
          <p className="text-[28px] font-bold">2XL Bold (28px)</p>
          <p className="text-[22px] font-bold">XL Bold (22px)</p>
          <p className="text-[18px] font-bold">LG Bold (18px)</p>
          <p className="text-[15px] font-medium">MD Medium (15px)</p>
          <p className="text-[13px] text-gray-600">SM Regular (13px)</p>
          <p className="text-[11px] text-gray-500">XS Regular (11px)</p>
        </div>
      </section>

      {/* 버튼 */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Buttons</h2>
        <div className="space-y-3 bg-white rounded-lg p-4">
          <button className="w-full h-12 bg-primary text-white font-bold rounded-lg text-sm">Primary Button (CTA)</button>
          <button className="w-full h-12 border border-primary text-primary font-bold rounded-lg text-sm">Outlined Button</button>
          <button className="w-full h-12 bg-gray-200 text-gray-500 font-bold rounded-lg text-sm" disabled>Disabled Button</button>
          <div className="flex gap-2">
            <button className="flex-1 h-10 bg-gray-900 text-white text-sm rounded-lg">Small Dark</button>
            <button className="flex-1 h-10 border border-gray-300 text-gray-700 text-sm rounded-lg">Small Light</button>
          </div>
        </div>
      </section>

      {/* 상품 카드 */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Product Card (Type A)</h2>
        <div className="grid grid-cols-2 gap-3">
          <ProductCardSample hasDiscount />
          <ProductCardSample hasDiscount={false} />
        </div>
      </section>

      {/* 배지 */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Badges</h2>
        <div className="flex flex-wrap gap-2 bg-white rounded-lg p-4">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">SALE 15%</span>
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">선착순 5개</span>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">진행중</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">D-7</span>
          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded">종료</span>
        </div>
      </section>

      {/* 입력 */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Inputs</h2>
        <div className="space-y-3 bg-white rounded-lg p-4">
          <input type="text" placeholder="기본 입력" className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm" />
          <input type="text" placeholder="에러 상태" className="w-full h-10 border border-red-500 rounded-lg px-3 text-sm" />
          <p className="text-xs text-red-500 -mt-2">필수 입력 항목입니다.</p>
          <input type="text" placeholder="비활성" disabled className="w-full h-10 border border-gray-100 rounded-lg px-3 text-sm bg-gray-50" />
        </div>
      </section>

      {/* Toast / Alert */}
      <section className="px-4 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Toast & Alert</h2>
        <div className="space-y-2 bg-white rounded-lg p-4">
          <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg">✅ 장바구니에 담았습니다.</div>
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">❌ 품절된 상품입니다.</div>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-lg">⚠️ 프로토타입에서는 지원하지 않는 기능입니다.</div>
        </div>
      </section>

      {/* 와이어프레임 레이아웃 */}
      <section className="px-4 mt-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Wireframe Layout</h2>
        <div className="border border-gray-300 rounded-lg overflow-hidden text-xs text-center text-gray-500">
          <div className="bg-white h-12 border-b border-gray-200 flex items-center justify-between px-3">
            <span>🏠 로고</span>
            <span>🔍 🛒 MY</span>
          </div>
          <div className="bg-gray-50 h-8 border-b border-gray-200 flex items-center justify-center">GNB (카테고리)</div>
          <div className="bg-gray-100 h-[120px] flex items-center justify-center">메인 배너 (360×200)</div>
          <div className="bg-white h-[200px] flex items-center justify-center border-b border-gray-100">상품 그리드 (2열)</div>
          <div className="bg-gray-50 h-[80px] flex items-center justify-center border-b border-gray-100">기획전 (가로 스크롤)</div>
          <div className="bg-white h-[100px] flex items-center justify-center">브랜드 배너 (4열)</div>
          <div className="bg-gray-900 text-white h-12 flex items-center justify-around">
            <span>홈</span><span>기획전</span><span>검색</span><span>MY</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function ColorSwatch({ color, label, hex }: { color: string; label: string; hex: string }) {
  return (
    <div className="text-center">
      <div className={`w-full aspect-square rounded-lg ${color}`} />
      <p className="text-[10px] text-gray-600 mt-1">{label}</p>
      <p className="text-[9px] text-gray-400">{hex}</p>
    </div>
  );
}

function ProductCardSample({ hasDiscount }: { hasDiscount: boolean }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative bg-gray-100 aspect-square flex items-center justify-center text-gray-400 text-xs">
        360×360
        {hasDiscount && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            SALE 15%
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[10px] text-gray-500">Brand</p>
        <p className="text-xs text-gray-900 font-medium mt-0.5">상품명 예시</p>
        <div className="mt-1">
          {hasDiscount && <span className="text-[10px] text-gray-400 line-through mr-1">179,000원</span>}
          <span className="text-xs font-bold text-gray-900">{hasDiscount ? '152,000' : '179,000'}원</span>
        </div>
        <div className="flex items-center mt-0.5 text-[10px] text-gray-500">
          <span className="text-yellow-400">★</span> 4.7 (324)
        </div>
      </div>
    </div>
  );
}
