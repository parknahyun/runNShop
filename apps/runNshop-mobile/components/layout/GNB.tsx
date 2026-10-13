import Link from 'next/link';

const CATEGORIES = [
  { code: 'RUNNING_SHOES', label: '러닝화' },
  { code: 'APPAREL', label: '의류' },
  { code: 'ACCESSORY', label: '액세서리' },
  { code: 'TRAIL', label: '트레일' },
  { code: 'MARATHON', label: '마라톤' },
  { code: 'BRAND', label: '브랜드' },
];

export function GNB() {
  return (
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center gap-4 px-3 overflow-x-auto sticky top-12 z-10">
      {CATEGORIES.map((c) => (
        <Link
          key={c.code}
          href={`/category/${c.code}`}
          className="text-xs text-gray-600 whitespace-nowrap"
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
