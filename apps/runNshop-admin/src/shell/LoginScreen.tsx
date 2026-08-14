'use client'
import { useState } from 'react'
import { login, type Session } from './mockAuth'

export default function LoginScreen({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('1234')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    login(email, password).then((result) => {
      setLoading(false)
      if (result.ok) onLogin(result.session)
      else setError(result.message)
    })
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <span className="login-logo__icon">🛍</span>
          <span className="login-logo__name">runNshop Admin</span>
        </div>
        <p className="login-subtitle">런앤샵 플랫폼 관리</p>
        <h1 className="login-title">운영자 로그인</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-field__label">이메일</span>
            <input
              className="login-field__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@runNshop.com"
              disabled={loading}
              autoComplete="username"
            />
          </label>
          <label className="login-field">
            <span className="login-field__label">비밀번호</span>
            <span className="login-field__hint">8자 이상, 영문+숫자 포함</span>
            <div className="login-field__pw-wrap">
              <input
                className="login-field__input login-field__input--pw"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-field__pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.22 4.53M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </label>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
        <div className="login-links">
          <span className="login-links__apply" title="미구현 — ADM-000-002">운영자 신청</span>
          <span className="login-links__forgot" title="미구현 — ADM-000-003">비밀번호 찾기</span>
        </div>
        <p className="login-hint">5회 연속 로그인 실패 시 계정이 잠깁니다(안내만 구현, 실제 잠금은 적용 안 됨).</p>
        <p className="login-hint">Mock 로그인 — 이메일·비밀번호를 채우면 최상위 권한으로 진입합니다.</p>
      </div>
    </div>
  )
}
