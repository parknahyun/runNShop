'use client'
import { useState } from 'react'
import {
  type AccountManager,
  type SettlementAccount,
  BANK_OPTIONS,
  MOCK_MANAGER,
  MOCK_SETTLEMENT_ACCOUNT,
  maskAccountNumber,
} from './mockData'

export default function AccountSettingsPage() {
  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">계정 관리</h1>
      </div>

      <ManagerInfoSection />
      <PasswordSection />
      <TwoFactorSection />
      <SessionSection />
      <SettlementAccountSection />
    </div>
  )
}

// ---------------------------------------------------------------------------
// 담당자 정보
// ---------------------------------------------------------------------------

function ManagerInfoSection() {
  const [manager, setManager] = useState<AccountManager>(MOCK_MANAGER)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<AccountManager>(MOCK_MANAGER)

  function startEdit() {
    setDraft(manager)
    setEditing(true)
  }

  function handleSave() {
    setManager(draft)
    setEditing(false)
    alert('저장되었습니다.')
  }

  return (
    <section className="detail-section" style={{ marginTop: 0 }}>
      <div className="detail-section__head">
        <h2 className="section-title" style={{ marginBottom: 0 }}>담당자 정보</h2>
        {!editing && (
          <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={startEdit}>편집</button>
        )}
      </div>

      {editing ? (
        <div className="add-form">
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>담당자명 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.manager_name} onChange={(e) => setDraft((d) => ({ ...d, manager_name: e.target.value }))} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>이메일 <span className="add-form__req">*</span></label>
              <input type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
            <div className="add-form__field">
              <label>연락처 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
          </div>
        </div>
      ) : (
        <div className="info-grid" style={{ marginTop: 12 }}>
          <dl className="info-dl">
            <div className="info-row"><dt>담당자명</dt><dd>{manager.manager_name}</dd></div>
            <div className="info-row"><dt>이메일</dt><dd>{manager.email}</dd></div>
            <div className="info-row"><dt>연락처</dt><dd>{manager.phone}</dd></div>
          </dl>
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// 비밀번호 변경
// ---------------------------------------------------------------------------

function PasswordSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  function handleChange() {
    if (!current || !next || !confirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (next !== confirm) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }
    setError('')
    alert('비밀번호가 변경되었습니다.')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <section className="detail-section">
      <div className="detail-section__head">
        <h2 className="section-title" style={{ marginBottom: 0 }}>비밀번호 변경</h2>
      </div>
      <div className="add-form">
        <div className="add-form__row">
          <div className="add-form__field add-form__field--full">
            <label>현재 비밀번호</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
        </div>
        <div className="add-form__row">
          <div className="add-form__field">
            <label>새 비밀번호</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div className="add-form__field">
            <label>새 비밀번호 확인</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        {error && <span className="add-form__err">{error}</span>}
        <div className="add-form__footer">
          <button className="btn-tool btn-tool--add" onClick={handleChange}>변경</button>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 2단계 인증
// ---------------------------------------------------------------------------

function TwoFactorSection() {
  const [enabled, setEnabled] = useState(false)
  const [method, setMethod] = useState<'SMS' | 'APP'>('SMS')

  function handleSave() {
    alert('저장되었습니다.')
  }

  return (
    <section className="detail-section">
      <div className="detail-section__head">
        <h2 className="section-title" style={{ marginBottom: 0 }}>2단계 인증</h2>
      </div>
      <div className="add-form">
        <div className="add-form__row">
          <div className="add-form__field">
            <label>사용 여부</label>
            <div className="pgm-status-radio">
              {(['ACTIVE', 'INACTIVE'] as const).map((v) => {
                const isOn = v === 'ACTIVE' ? enabled : !enabled
                return (
                  <label key={v}
                    className={`pgm-status-radio__item${isOn ? ' pgm-status-radio__item--on' : ''}`}
                    data-value={v}>
                    <input type="radio" name="two-fa" checked={isOn}
                      onChange={() => setEnabled(v === 'ACTIVE')} />
                    {v === 'ACTIVE' ? '활성화' : '비활성화'}
                  </label>
                )
              })}
            </div>
          </div>
          <div className="add-form__field">
            <label>인증 방식</label>
            <div className="pgm-status-radio" style={enabled ? undefined : { opacity: 0.5, pointerEvents: 'none' }}>
              {(['SMS', 'APP'] as const).map((m) => (
                <label key={m}
                  className={`pgm-status-radio__item${method === m ? ' pgm-status-radio__item--on' : ''}`}
                  data-value={m}>
                  <input type="radio" name="two-fa-method" checked={method === m} disabled={!enabled}
                    onChange={() => setMethod(m)} />
                  {m === 'SMS' ? 'SMS 인증' : 'App 인증'}
                </label>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
          2단계 인증을 활성화하면 로그인 시 SMS 또는 인증 앱을 통한 추가 인증이 필요합니다.
        </p>
        <div className="add-form__footer">
          <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 세션 관리
// ---------------------------------------------------------------------------

function SessionSection() {
  function handleLogoutAll() {
    if (window.confirm('모든 기기에서 로그아웃하시겠습니까?')) {
      alert('모든 세션이 종료되었습니다.')
    }
  }

  return (
    <section className="detail-section">
      <div className="detail-section__head">
        <h2 className="section-title" style={{ marginBottom: 0 }}>세션 관리</h2>
      </div>
      <div className="info-grid" style={{ marginTop: 12, alignItems: 'center' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>현재 로그인된 기기</dt><dd>3개</dd></div>
        </dl>
      </div>
      <div className="add-form__footer" style={{ justifyContent: 'flex-start', paddingTop: 12 }}>
        <button className="btn-tool btn-tool--delete" onClick={handleLogoutAll}>전체 세션 종료</button>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 정산계좌 정보
// ---------------------------------------------------------------------------

function SettlementAccountSection() {
  const [account, setAccount] = useState<SettlementAccount>(MOCK_SETTLEMENT_ACCOUNT)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<SettlementAccount>(MOCK_SETTLEMENT_ACCOUNT)

  function startEdit() {
    setDraft(account)
    setEditing(true)
  }

  function handleSave() {
    setAccount(draft)
    setEditing(false)
    alert('저장되었습니다.')
  }

  function handleVerify() {
    alert('계좌 인증 요청이 접수되었습니다.')
  }

  return (
    <section className="detail-section">
      <div className="detail-section__head">
        <h2 className="section-title" style={{ marginBottom: 0 }}>정산계좌 정보</h2>
        {!editing && (
          <button className="btn-tool btn-tool--toggle" style={{ height: 28, padding: '0 10px', fontSize: 12 }} onClick={startEdit}>편집</button>
        )}
      </div>

      {editing ? (
        <div className="add-form">
          <div className="add-form__row">
            <div className="add-form__field">
              <label>은행</label>
              <select value={draft.bank_name} onChange={(e) => setDraft((d) => ({ ...d, bank_name: e.target.value }))}>
                {BANK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="add-form__field">
              <label>계좌번호</label>
              <input type="text" value={draft.account_number} onChange={(e) => setDraft((d) => ({ ...d, account_number: e.target.value }))} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>예금주</label>
              <input type="text" value={draft.account_holder} onChange={(e) => setDraft((d) => ({ ...d, account_holder: e.target.value }))} />
            </div>
          </div>
          <div className="add-form__footer">
            <button className="btn-tool" onClick={handleVerify} style={{ marginRight: 'auto' }}>계좌 인증</button>
            <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
            <button className="btn-tool btn-tool--add" onClick={handleSave}>저장</button>
          </div>
        </div>
      ) : (
        <div className="info-grid" style={{ marginTop: 12 }}>
          <dl className="info-dl">
            <div className="info-row"><dt>은행</dt><dd>{account.bank_name}</dd></div>
            <div className="info-row"><dt>계좌번호</dt><dd>{maskAccountNumber(account.account_number)}</dd></div>
            <div className="info-row"><dt>예금주</dt><dd>{account.account_holder}</dd></div>
          </dl>
        </div>
      )}
    </section>
  )
}
