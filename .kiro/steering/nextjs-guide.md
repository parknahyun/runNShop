---
inclusion: fileMatch
fileMatchPattern: "**/*.tsx,**/*.ts"
---
# Next.js 개발 가이드

## 기술 스택
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Query (서버 상태) + Zustand (클라이언트 상태)

## App Router 규칙
- Server Component 우선, 인터랙션 필요 시 'use client' 추가
- 앱별 `lib/api.ts` 유틸로 API 호출 (path prefix 내장)
- 레이아웃은 `app/layout.tsx`에서 공통 처리

## API 호출 패턴
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
const PREFIX = '/api/v1';  // 앱별로 다름

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${PREFIX}${path}`);
  const json = await res.json();
  if (json.code !== 'SUCCESS') {
    throw new ApiError(json.code, json.message);
  }
  return json.data;
}
```

## 앱별 해상도
- runNshop-mobile: 360px (모바일)
- runNshop-admin: 1280px+ (PC)
- runNshop-partner: 1280px+ (PC)

## 디자인 토큰
- Primary: #FF4D00 (러닝 오렌지)
- Secondary: #1A1A1A
- Gray 스케일: 100(#F5F5F5) ~ 900(#212121)

## 컴포넌트 디렉토리
```
components/
├── common/    ← Button, Input, Modal, Toast, Badge
├── layout/    ← Header, BottomNav, GNB, Sidebar
└── product/   ← ProductCard, PriceDisplay
```

## 프로토타입 제약
- 데이터 수정/등록 버튼 → Toast로 "프로토타입에서는 지원하지 않는 기능입니다" 안내
- 유효성 검증/에러 안내는 실제와 동일하게 구현
