import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'runNshop Partners',
  description: '런앤샵 입점사 BO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
