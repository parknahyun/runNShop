import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'runNshop Admin',
  description: '런앤샵 플랫폼 어드민',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
