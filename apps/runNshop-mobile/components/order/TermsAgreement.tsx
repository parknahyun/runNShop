'use client';

import { useState } from 'react';

interface Term {
  term_id: string;
  title: string;
  required: boolean;
}

export function TermsAgreement({ terms }: { terms: Term[] }) {
  const [agreed, setAgreed] = useState<Set<string>>(new Set());

  const allRequired = terms.filter(t => t.required);
  const isAllAgreed = allRequired.every(t => agreed.has(t.term_id));

  const toggleAll = () => {
    if (isAllAgreed) {
      setAgreed(new Set());
    } else {
      setAgreed(new Set(terms.map(t => t.term_id)));
    }
  };

  const toggle = (termId: string) => {
    const next = new Set(agreed);
    if (next.has(termId)) next.delete(termId);
    else next.add(termId);
    setAgreed(next);
  };

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={isAllAgreed}
          onChange={toggleAll}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-sm font-bold text-gray-900">전체 동의</span>
      </label>
      <div className="space-y-2 pl-1">
        {terms.map((term) => (
          <label key={term.term_id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed.has(term.term_id)}
              onChange={() => toggle(term.term_id)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs text-gray-600">
              {term.required && <span className="text-red-500">[필수] </span>}
              {term.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
