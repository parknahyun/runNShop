interface Card {
  key: string;
  label: string;
  value: number;
  change: number;
  unit: string;
}

export function SummaryCards({ cards }: { cards: Card[] }) {
  const formatValue = (value: number, unit: string) => {
    if (unit === '원') return `${(value / 10000).toFixed(0)}만`;
    return value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs text-gray-500">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(card.value, card.unit)}
            <span className="text-xs font-normal text-gray-500 ml-1">{card.unit}</span>
          </p>
          <p className={`text-xs mt-1 ${card.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {card.change >= 0 ? '▲' : '▼'} {Math.abs(card.change).toLocaleString()} 전일비
          </p>
        </div>
      ))}
    </div>
  );
}
