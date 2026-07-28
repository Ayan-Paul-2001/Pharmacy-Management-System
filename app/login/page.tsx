'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { GsapHero } from '@/components/GsapHero'
import { getDemoSession, getFingerprint, signInWithFirebase, signInWithPasskey } from '@/lib/auth-client'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [authMethod, setAuthMethod] = useState<'password' | 'passkey'>('password')
  
  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Signup form state
  const [fullName, setFullName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [fingerprintInfo, setFingerprintInfo] = useState<{ visitorId: string; confidence: number } | null>(null)

  // Forgot password modal
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    getFingerprint().then((fp) => setFingerprintInfo(fp)).catch(() => {})
  }, [])

  function quickFill(presetEmail: string, presetPass: string = 'password123') {
    setEmail(presetEmail)
    setPassword(presetPass)
    setSignupEmail(presetEmail)
    setSignupPassword(presetPass)
    setMessage('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const fp = fingerprintInfo || (await getFingerprint())
      let result

      if (activeTab === 'signup') {
        const inputEmail = signupEmail || 'user@pharmacy.com'
        result = getDemoSession(inputEmail)
        if (fullName) result.user.name = fullName
      } else if (authMethod === 'passkey') {
        result = await signInWithPasskey(email || 'user@pharmacy.com')
      } else {
        result = await signInWithFirebase(email || 'user@pharmacy.com', password || 'password123')
      }

      // Save session credentials
      localStorage.setItem('mediflow_token', result.accessToken)
      localStorage.setItem('mediflow_user', JSON.stringify(result.user))
      localStorage.setItem('mediflow_fingerprint', fp.visitorId)

      // Audit Log trigger
      const logs = JSON.parse(localStorage.getItem('mediflow_audit_logs') || '[]')
      logs.unshift({
        id: 'aud_' + Date.now(),
        timestamp: new Date().toISOString(),
        user: result.user.name,
        action: activeTab === 'signup' ? 'NEW_ACCOUNT_REGISTRATION' : `USER_SIGNIN_${authMethod.toUpperCase()}`,
        ip: '192.168.1.104',
        fingerprint: fp.visitorId,
        email: result.user.email,
      })
      localStorage.setItem('mediflow_audit_logs', JSON.stringify(logs.slice(0, 50)))

      // Access granted automatically according to email address
      const targetEmail = (result.user.email || '').toLowerCase()
      const destination =
        targetEmail.includes('owner') || targetEmail.includes('alex') || targetEmail.includes('admin')
          ? '/owner/dashboard'
          : targetEmail.includes('employee') || targetEmail.includes('jordan') || targetEmail.includes('staff') || targetEmail.includes('pharmacist')
          ? '/employee/dashboard'
          : '/customer/dashboard'

      window.location.href = destination
    } catch (err: any) {
      setMessage(err.message || 'Authentication failed. Please check your inputs.')
    } finally {
      setBusy(false)
    }
  }

  function handleForgotSubmit(e: FormEvent) {
    e.preventDefault()
    setForgotSent(true)
    setTimeout(() => {
      setShowForgot(false)
      setForgotSent(false)
      setMessage(`Password recovery instructions sent to ${forgotEmail}`)
    }, 1600)
  }

  return (
    <main className="unified-auth-page">
      {/* Background Animated Hero Visual */}
      <GsapHero />

      {/* Main Single Login & Signup Portal */}
      <div className="auth-portal-wrapper">
        <header className="auth-portal-header">
          <Link href="/" className="brand-dark">
            <span className="brand-mark-glow">✦</span>
            <span className="brand-name">mediflow</span>
          </Link>
          <span className="portal-pill">Unified Access Portal</span>
        </header>

        <div className="auth-glass-card">
          {/* Sign In / Sign Up Segmented Switcher */}
          <div className="auth-segmented-nav">
            <button
              type="button"
              className={activeTab === 'signin' ? 'nav-active' : ''}
              onClick={() => {
                setActiveTab('signin')
                setMessage('')
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={activeTab === 'signup' ? 'nav-active' : ''}
              onClick={() => {
                setActiveTab('signup')
                setMessage('')
              }}
            >
              Create Account
            </button>
          </div>

          <div className="auth-card-body">
            {activeTab === 'signin' ? (
              <>
                <h2>Sign In to Mediflow</h2>
                <p className="auth-subtitle">Enter your registered email address to access your pharmacy workspace.</p>

                {/* Sub-toggle for Authentication Method */}
                <div className="auth-method-row">
                  <button
                    type="button"
                    className={`method-chip ${authMethod === 'password' ? 'selected' : ''}`}
                    onClick={() => setAuthMethod('password')}
                  >
                    Email & Password
                  </button>
                  <button
                    type="button"
                    className={`method-chip ${authMethod === 'passkey' ? 'selected' : ''}`}
                    onClick={() => setAuthMethod('passkey')}
                  >
                    Biometric Passkey 🔑
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-unified">
                  <label className="input-group-dark">
                    <span>Email Address</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@pharmacy.com"
                    />
                  </label>

                  {authMethod === 'password' && (
                    <label className="input-group-dark">
                      <div className="label-with-action">
                        <span>Password</span>
                        <button
                          type="button"
                          className="text-action-btn"
                          onClick={() => setShowForgot(true)}
                        >
                          Forgot?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                      />
                    </label>
                  )}

                  {message && <div className="auth-alert-box">{message}</div>}

                  <button className="auth-submit-btn" disabled={busy}>
                    {busy
                      ? 'Verifying access...'
                      : authMethod === 'password'
                      ? 'Sign In to Workspace →'
                      : 'Authenticate with Passkey →'}
                  </button>
                </form>

                {/* Demo Quick Fill Helper Pills */}
                <div className="demo-autofill-strip">
                  <span className="demo-label">Quick Fill:</span>
                  <button type="button" onClick={() => quickFill('owner@northstar.com')}>
                    Owner
                  </button>
                  <button type="button" onClick={() => quickFill('staff@northstar.com')}>
                    Staff
                  </button>
                  <button type="button" onClick={() => quickFill('customer@northstar.com')}>
                    Customer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Create Your Account</h2>
                <p className="auth-subtitle">Register your email to manage medicines, prescriptions, and orders.</p>

                <form onSubmit={handleSubmit} className="auth-form-unified">
                  <label className="input-group-dark">
                    <span>Full Name</span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Mitchell"
                    />
                  </label>

                  <label className="input-group-dark">
                    <span>Email Address</span>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@pharmacy.com"
                    />
                  </label>

                  <div className="input-row-two">
                    <label className="input-group-dark">
                      <span>Phone Number</span>
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                      />
                    </label>

                    <label className="input-group-dark">
                      <span>Password</span>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </label>
                  </div>

                  {message && <div className="auth-alert-box">{message}</div>}

                  <button className="auth-submit-btn" disabled={busy}>
                    {busy ? 'Creating Account...' : 'Register Account →'}
                  </button>
                </form>
              </>
            )}

            {/* Device Security Status Footer */}
            {fingerprintInfo && (
              <div className="auth-security-footer">
                <span className="shield-icon">🛡️</span>
                <span>Protected by FingerprintJS · Device ID: <code className="fp-code">{fingerprintInfo.visitorId}</code></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      {showForgot && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setShowForgot(false)}>
              ×
            </button>
            <h2>Reset Your Password</h2>
            <p>Enter your registered email address to receive password recovery instructions.</p>

            {forgotSent ? (
              <div className="auth-alert-success">✓ Recovery instructions sent! Please check your inbox.</div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <label className="input-group-dark" style={{ marginBottom: 16 }}>
                  <span>Registered Email</span>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@pharmacy.com"
                  />
                </label>
                <button className="auth-submit-btn">Send Recovery Link</button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
