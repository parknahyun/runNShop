'use client';

import { useState } from 'react';

interface ProductTabsProps {
  detailHtml: string;
  reviewCount: number;
  qnaCount: number;
}

export function ProductTabs({ detailHtml, reviewCount, qnaCount }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'review' | 'qna'>('detail');

  const tabs = [
    { key: 'detail' as const, label: '상품정보' },
    { key: 'review' as const, label: `리뷰 (${reviewCount})` },
    { key: 'qna' as const, label: `QnA (${qnaCount})` },
  ];

  return (
    <div className="mt-4">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === tab.key
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="px-4 py-4">
        {activeTab === 'detail' && (
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: detailHtml }}
          />
        )}
        {activeTab === 'review' && (
          <p className="text-sm text-gray-500">리뷰 목록은 별도 화면(CUS-070)에서 구현됩니다.</p>
        )}
        {activeTab === 'qna' && (
          <p className="text-sm text-gray-500">QnA 목록은 별도 화면(CUS-071)에서 구현됩니다.</p>
        )}
      </div>
    </div>
  );
}
