import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'runNshop (C-3 검증)',
  description: 'C-3 디자인시스템 검증용 mobile app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="max-w-[360px] mx-auto bg-gray-50">
        <Header />
        <main className="pb-12">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
