import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'runNshop - 러닝 전문 쇼핑몰',
  description: '러너를 위한 프리미엄 커머스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="max-w-[360px] mx-auto bg-gray-50">{children}</body>
    </html>
  )
}
