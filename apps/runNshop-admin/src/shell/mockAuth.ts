import type { OperatorRole } from './navMenus'

export interface Session {
  userId: string
  role: OperatorRole
}

// guide/ui "로그인" 가이드(LoginGuide.tsx) 규칙: "세션 만료 없이 항상 로그인 유지" — 새로고침해도
// 로그인 상태가 풀리면 안 된다. 그래서 모듈 변수가 아니라 localStorage에 저장한다(로그인 API
// 연동 시 실제로는 서버가 세션 토큰을 검증하는 API, 예: GET /api/admin/v1/auth/me 를 호출한다).
const STORAGE_KEY = 'runNshop_admin_mock_session'

function readStoredSession(): Session | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

function writeStoredSession(session: Session | null): void {
  if (typeof window === 'undefined') return
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  else window.localStorage.removeItem(STORAGE_KEY)
}

// GET /api/admin/v1/auth/me 격 — 로그인 유효 여부 확인
export function checkSession(): Promise<Session | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readStoredSession()), 300)
  })
}

// POST /api/admin/v1/auth/login 격 — 실제 인증 로직 없음(Mock). 이메일·비밀번호가 모두
// 채워져 있으면 성공 처리하고, 로그인 정보에서 가져올 예정인 role은 최상위 권한(SUPER)으로
// 고정한다(로그인 API 연동 시 실제 role로 교체).
export function login(email: string, password: string): Promise<{ ok: true; session: Session } | { ok: false; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!email || !password) {
        resolve({ ok: false, message: '이메일과 비밀번호를 입력하세요.' })
        return
      }
      const session: Session = { userId: email, role: 'SUPER' }
      writeStoredSession(session)
      resolve({ ok: true, session })
    }, 300)
  })
}

// POST /api/admin/v1/auth/logout 격
export function logout(): void {
  writeStoredSession(null)
}
