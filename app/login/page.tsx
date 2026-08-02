'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimePharmaHero } from '@/components/AnimePharmaHero'
import { getDemoSession, getFingerprint, signInWithFirebase, signUpWithFirebase, signInWithPasskey } from '@/lib/auth-client'
import {
  PhoneIcon,
  MailIcon,
  SearchIcon,
  WhatsAppIcon,
  RxDocumentIcon,
  UserIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  HospitalIcon,
  PillCapsuleIcon,
  KeyPasskeyIcon,
} from '@/components/Icons'

const categories = [
  { name: 'Prescription Medicine', color: '#e0f2fe' },
  { name: 'OTC Medicine', color: '#fef3c7' },
  { name: 'Supplements & Vitamins', color: '#dcfce7' },
  { name: 'Diabetic Accessories', color: '#ffe4e6' },
  { name: 'Skin Care Products', color: '#f3e8ff' },
  { name: 'Women\'s Care', color: '#fce7f3' },
  { name: 'Men\'s Care', color: '#e0e7ff' },
  { name: 'Baby & Mom Products', color: '#ffedd5' },
]

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [authMethod, setAuthMethod] = useState<'password' | 'passkey'>('password')
  
  // Search & Navigation states
  const [search, setSearch] = useState('')
  const [showCategories, setShowCategories] = useState(false)
  const [cartCount, setCartCount] = useState(2)

  // Login form state
  const [email, setEmail] = useState('ayanpaul.pro@gmail.com')
  const [password, setPassword] = useState('Admin@owner')
  
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

  function quickFill(presetEmail: string, presetPass: string = 'Admin@owner') {
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
        const inputEmail = signupEmail || 'ayanpaul.pro@gmail.com'
        const inputPass = signupPassword || 'Admin@owner'
        result = await signUpWithFirebase(inputEmail, inputPass, fullName)
      } else if (authMethod === 'passkey') {
        result = await signInWithPasskey(email || 'ayanpaul.pro@gmail.com')
      } else {
        result = await signInWithFirebase(email || 'ayanpaul.pro@gmail.com', password || 'Admin@owner')
      }

      // Save session credentials in localStorage & cookies for Middleware
      localStorage.setItem('mediflow_token', result.accessToken)
      localStorage.setItem('mediflow_user', JSON.stringify(result.user))
      localStorage.setItem('mediflow_fingerprint', fp.visitorId)
      document.cookie = `mediflow_token=${result.accessToken}; path=/; max-age=86400; SameSite=Lax`
      document.cookie = `mediflow_user=${encodeURIComponent(JSON.stringify(result.user))}; path=/; max-age=86400; SameSite=Lax`

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
        targetEmail.includes('owner') || targetEmail.includes('alex') || targetEmail.includes('admin') || targetEmail.includes('ayanpaul')
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
    <main className="lazz-homepage">
      {/* 1. Top Contact Header */}
      <div className="lazz-top-bar">
        <div className="lazz-container flex-between">
          <div className="top-bar-left">
            <a href="tel:01319864049" className="top-link">
              <PhoneIcon size={14} />
              <span>Hotline: 01319-864049 / 01952-444471</span>
            </a>
            <span className="divider">|</span>
            <a href="mailto:support@mediflow.com" className="top-link">
              <MailIcon size={14} />
              <span>support@mediflow.com</span>
            </a>
          </div>
          <div className="top-bar-right">
            <span className="model-pharmacy-badge">
              First Ever Model Pharmacy System in Bangladesh
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="lazz-main-header">
        <div className="lazz-container flex-between">
          {/* Logo */}
          <Link href="/" className="lazz-brand">
            <span className="brand-mark-green">✦</span>
            <span className="brand-title">mediflow</span>
            <span className="model-tag">PHARMACY</span>
          </Link>

          {/* Search Bar */}
          <div className="lazz-search-box">
            <input
              type="text"
              placeholder="Search medicine by Name, Generic, or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="search-btn">
              <SearchIcon size={15} />
              <span>Search</span>
            </button>
          </div>

          {/* Action CTA Buttons */}
          <div className="lazz-header-actions">
            <a
              href="https://wa.me/8801952444471"
              target="_blank"
              rel="noreferrer"
              className="lazz-cta-btn wa-cta"
            >
              <WhatsAppIcon size={18} className="cta-icon-svg" />
              <div>
                <span className="cta-title">WhatsApp Order</span>
                <span className="cta-sub">+880 1952-444471</span>
              </div>
            </a>

            <Link href="/customer/prescriptions" className="lazz-cta-btn rx-cta">
              <RxDocumentIcon size={18} className="cta-icon-svg" />
              <div>
                <span className="cta-title">Upload Prescription</span>
                <span className="cta-sub">Fast Verification</span>
              </div>
            </Link>

            <Link href="/login" className="lazz-login-btn">
              <UserIcon size={16} />
              <span>Sign In</span>
            </Link>

            <Link href="/customer/shop" className="lazz-cart-badge">
              <ShoppingBagIcon size={16} />
              <span className="cart-num">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Navigation Bar */}
      <nav className="lazz-navbar">
        <div className="lazz-container flex-start">
          <div className="category-dropdown-wrapper">
            <button
              type="button"
              className="category-trigger-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="menu-icon">≡</span>
              <span>Categories</span>
              <span className="arrow-icon">▼</span>
            </button>

            {showCategories && (
              <div className="category-flyout-menu">
                {categories.map((c, i) => (
                  <Link
                    href="/customer/shop"
                    key={i}
                    className="category-item-link"
                    onClick={() => setShowCategories(false)}
                  >
                    <PillCapsuleIcon size={14} className="cat-icon-svg" />
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lazz-nav-links">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/customer/shop" className="nav-link">
              Shop Medicines
            </Link>
            <Link href="/customer/prescriptions" className="nav-link">
              Prescription Order
            </Link>
            <Link href="/reports" className="nav-link">
              Branch Locations
            </Link>
            <Link href="/customer/orders" className="nav-link">
              Track Order
            </Link>
            <Link href="/login" className="nav-link active">
              Customer Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Central Hero Auth Section with Anime.js Drug Animation */}
      <section className="lazz-hero-banner-section auth-layout">
        {/* Background Animated Hero Visual */}
        <AnimePharmaHero />

        <div className="lazz-hero-overlay-content lazz-container hero-auth-grid">
          {/* Left Hero Copy Card */}
          <div className="banner-copy-card">
            <span className="banner-tag">UNIFIED PORTAL ACCESS</span>
            <h1>
              Authentic Medicine &<br />
              <em>Pharmacy Workspace</em>
            </h1>
            <p>
              100% Genuine prescription drugs, real-time inventory sync, and secure single sign-on access for Owners, Pharmacists, and Customers.
            </p>

            <div className="banner-features-pill">
              <span className="flex-center-gap"><ShieldCheckIcon size={14} /> FingerprintJS Verified</span>
              <span className="flex-center-gap"><KeyPasskeyIcon size={14} /> WebAuthn Biometrics</span>
              <span className="flex-center-gap"><PillCapsuleIcon size={14} /> Realtime POS Sync</span>
            </div>
          </div>

          {/* Right Main Login & Signup Glass Portal */}
          <div className="auth-portal-wrapper">
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
                        className={`method-chip flex-center-gap ${authMethod === 'passkey' ? 'selected' : ''}`}
                        onClick={() => setAuthMethod('passkey')}
                      >
                        <KeyPasskeyIcon size={14} /> Biometric Passkey
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
                      <button type="button" onClick={() => quickFill('ayanpaul.pro@gmail.com', 'Admin@owner')}>
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
                    <ShieldCheckIcon size={14} className="icon-emerald" />
                    <span>Protected by FingerprintJS · Device ID: <code className="fp-code">{fingerprintInfo.visitorId}</code></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Four Feature Value Boxes Strip */}
      <section className="lazz-features-strip">
        <div className="lazz-container grid-four">
          <a
            href="https://wa.me/8801952444471"
            target="_blank"
            rel="noreferrer"
            className="feature-value-box"
          >
            <div className="feature-circle wa">
              <WhatsAppIcon size={20} />
            </div>
            <div>
              <h4>Order Via WhatsApp</h4>
              <p>+880 1952-444471</p>
            </div>
          </a>

          <Link href="/customer/prescriptions" className="feature-value-box">
            <div className="feature-circle rx">
              <RxDocumentIcon size={20} />
            </div>
            <div>
              <h4>Upload Prescription</h4>
              <p>Hassle-Free Verification</p>
            </div>
          </Link>

          <div className="feature-value-box">
            <div className="feature-circle auth">
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <h4>100% Authentic</h4>
              <p>Verified Manufacturers</p>
            </div>
          </div>

          <div className="feature-value-box">
            <div className="feature-circle store">
              <HospitalIcon size={20} />
            </div>
            <div>
              <h4>Model Pharmacy</h4>
              <p>24/7 Fast Express Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Moving Marquee Notice Ticker */}
      <div className="lazz-notice-ticker">
        <div className="notice-inner">
          <span>
            Welcome to Mediflow Model Pharmacy – Your trusted online medicine store for fast, 100% authentic, and convenient healthcare shopping! Emergency Hotline: 01319-864049
          </span>
        </div>
      </div>

      {/* 7. Footer */}
      <footer className="lazz-footer">
        <div className="lazz-container footer-grid">
          <div className="footer-col">
            <div className="lazz-brand white">
              <span className="brand-mark-green">✦</span>
              <span className="brand-title">mediflow</span>
            </div>
            <p className="footer-about">
              First Model Pharmacy system in Bangladesh. Providing 100% genuine OTC medicines, prescription drugs, surgical items, and personal care products with fast home delivery.
            </p>
            <div className="contact-line">
              <PhoneIcon size={14} />
              <span>Emergency Hotline: 01319-864049</span>
            </div>
            <div className="contact-line">
              <MailIcon size={14} />
              <span>Email: support@mediflow.com</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/customer/shop">Online Medicine Store</Link></li>
              <li><Link href="/customer/prescriptions">Upload Doctor Prescription</Link></li>
              <li><Link href="/customer/orders">Track Active Order</Link></li>
              <li><Link href="/login">Unified Portal Sign In</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link href="/customer/shop">Prescription Medicine</Link></li>
              <li><Link href="/customer/shop">OTC & Health Care</Link></li>
              <li><Link href="/customer/shop">Supplements & Vitamins</Link></li>
              <li><Link href="/customer/shop">Diabetic Devices</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Payment Methods</h4>
            <p className="footer-subtext">100% Safe & Secure Payment Options</p>
            <div className="payment-badges">
              <span className="pay-chip">bKash</span>
              <span className="pay-chip">Nagad</span>
              <span className="pay-chip">Rocket</span>
              <span className="pay-chip">Visa</span>
              <span className="pay-chip">Mastercard</span>
              <span className="pay-chip">Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="lazz-container flex-between">
            <span>© 2026 Mediflow Pharmacy Limited. All Rights Reserved.</span>
            <span>First Model Pharmacy System</span>
          </div>
        </div>
      </footer>

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
