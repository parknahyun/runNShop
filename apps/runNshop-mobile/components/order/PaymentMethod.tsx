'use client';

import { useState } from 'react';

interface Method {
  type: string;
  label: string;
}

export function PaymentMethod({ methods }: { methods: Method[] }) {
  const [selected, setSelected] = useState(methods[0]?.type || '');

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <h2 className="text-sm font-bold text-gray-900 mb-2">결제 수단</h2>
      <div className="flex gap-2">
        {methods.map((m) => (
          <button
            key={m.type}
            onClick={() => setSelected(m.type)}
            className={`px-4 py-2 text-sm rounded border ${
              selected === m.type
                ? 'border-primary text-primary font-medium'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
