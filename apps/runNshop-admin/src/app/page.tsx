'use client'
import { useEffect, useState } from 'react'
import AppShell from '@/shell/AppShell'
import LoginScreen from '@/shell/LoginScreen'
import { checkSession, logout, type Session } from '@/shell/mockAuth'

export default function Home() {
  const [session, setSession] = useState<Session | null | 'loading'>('loading')

  useEffect(() => {
    checkSession().then(setSession)
  }, [])

  if (session === 'loading') return <div className="auth-loading">로그인 확인 중...</div>
  if (!session) return <LoginScreen onLogin={setSession} />

  return (
    <AppShell
      userId={session.userId}
      role={session.role}
      onLogout={() => { logout(); setSession(null) }}
    />
  )
}
