'use client'

import { useState, useEffect } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { User, Shield, Building, Bell, History, Key, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react'

interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  ip: string
  fingerprint: string
  role: string
}

const defaultLogs: AuditLogEntry[] = [
  { id: 'aud_1', timestamp: '2026-08-04 11:40:12', user: 'Ayan Paul', action: 'USER_LOGIN_SECURE', ip: '103.114.172.90', fingerprint: 'fp_9a2b8c71', role: 'Owner / Admin' },
  { id: 'aud_2', timestamp: '2026-08-04 11:15:45', user: 'Jordan Lee', action: 'COMPLETED_POS_SALE_INV9821', ip: '192.168.1.108', fingerprint: 'fp_3f4e5d6a', role: 'Pharmacist' },
  { id: 'aud_3', timestamp: '2026-08-04 10:50:00', user: 'Ayan Paul', action: 'UPDATED_MEDICINE_STOCK_MED1001', ip: '103.114.172.90', fingerprint: 'fp_9a2b8c71', role: 'Owner / Admin' },
  { id: 'aud_4', timestamp: '2026-08-04 09:30:22', user: 'Sarah Mitchell', action: 'UPLOADED_PRESCRIPTION_RX901', ip: '172.56.21.90', fingerprint: 'fp_8819ab21', role: 'Customer' },
]

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'store' | 'notifications' | 'audit'>('profile')

  // User Profile State
  const [name, setName] = useState('Ayan Paul')
  const [email, setEmail] = useState('ayanpaul.pro@gmail.com')
  const [phone, setPhone] = useState('+880 1952-444471')
  const [jobTitle, setJobTitle] = useState('Chief Executive & Administrator')

  // Password Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Store Configuration State
  const [pharmacyName, setPharmacyName] = useState('Northstar Pharmacy Limited')
  const [licenseNo, setLicenseNo] = useState('PH-99201-BD')
  const [hotline, setHotline] = useState('01319-864049')
  const [supportEmail, setSupportEmail] = useState('support@mediflow.com')
  const [address, setAddress] = useState('104 Health Plaza, Suite 400, Dhaka 1212')
  const [taxRate, setTaxRate] = useState(5)
  const [currency, setCurrency] = useState('৳ (BDT)')

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(defaultLogs)
  const [toast, setToast] = useState('')

  useEffect(() => {
    // Load persisted user state if available
    const userStr = localStorage.getItem('mediflow_user')
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        if (u.name) setName(u.name)
        if (u.email) setEmail(u.email)
      } catch (e) {}
    }

    const savedLogs = localStorage.getItem('mediflow_audit_logs')
    if (savedLogs) {
      try {
        setAuditLogs(JSON.parse(savedLogs))
      } catch (e) {}
    }
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    const userStr = localStorage.getItem('mediflow_user')
    let userObj = { role: 'owner', name, email }
    if (userStr) {
      try {
        userObj = { ...JSON.parse(userStr), name, email }
      } catch (e) {}
    }
    localStorage.setItem('mediflow_user', JSON.stringify(userObj))
    notify('Profile details updated successfully!')
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      notify('Password must be at least 6 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      notify('New password and confirm password do not match')
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    notify('Security password changed successfully!')
  }

  function handleSaveStoreSettings(e: React.FormEvent) {
    e.preventDefault()
    notify('Pharmacy Store Settings saved successfully!')
  }

  return (
    <RoleShell role="owner" title="Account & Workspace Settings">
      <div className="page-intro">
        <div>
          <div className="eyebrow">User Management & System Preferences</div>
          <h1>Account & Settings</h1>
          <p>Manage your account profile, security passwords, store configurations, notifications, and security audit logs.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Settings Navigation Sidebar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Account Menu
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              border: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
              background: activeTab === 'profile' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'profile' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'profile' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <User size={16} />
            <span>Personal Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              border: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
              background: activeTab === 'security' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'security' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'security' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <Shield size={16} />
            <span>Security & Passwords</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              border: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
              background: activeTab === 'store' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'store' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'store' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <Building size={16} />
            <span>Store Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              border: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
              background: activeTab === 'notifications' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'notifications' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'notifications' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              border: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
              background: activeTab === 'audit' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'audit' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'audit' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <History size={16} />
            <span>Security Audit Log</span>
          </button>
        </div>

        {/* Settings Content Area */}
        <div
          style={{
            background: '#0a1728',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '24px 28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Personal Profile Details</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Update your personal identity, contact information, and role credentials.</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  AP
                </div>
                <div>
                  <b style={{ color: '#fff', fontSize: 16, display: 'block' }}>{name}</b>
                  <span style={{ color: '#38bdf8', fontSize: 12, fontWeight: 600 }}>Administrator & Owner</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  color: '#fff',
                  border: 0,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* TAB 2: SECURITY & PASSWORDS */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange}>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Password & Authentication</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Ensure your account is using a strong password and multi-factor biometric verification.</p>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Key size={18} style={{ color: '#38bdf8' }} />
                    <b style={{ color: '#fff', fontSize: 14 }}>Biometric Passkey Authentication</b>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: 6 }}>
                    ✓ Active (Windows Hello / TouchID)
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 12px' }}>
                  Use hardware biometric sensors to sign in without entering your password every time.
                </p>
                <button
                  type="button"
                  onClick={() => notify('Passkey registration challenge issued')}
                  style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Register New Hardware Device
                </button>
              </div>

              <h3 style={{ font: '700 14px Manrope', color: '#fff', marginBottom: 16 }}>Change Password</h3>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Current Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Confirm New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPass ? 'Hide password characters' : 'Show password characters'}</span>
              </button>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  color: '#fff',
                  border: 0,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                Update Password
              </button>
            </form>
          )}

          {/* TAB 3: STORE CONFIGURATION */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStoreSettings}>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Pharmacy Business Profile</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Configure licensing details, support hotlines, VAT tax percentages, and store credentials.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Pharmacy Registered Name</label>
                  <input
                    type="text"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>DGDA Pharmacy License No.</label>
                  <input
                    type="text"
                    required
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Emergency Hotline Phone</label>
                  <input
                    type="text"
                    required
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Support Email Address</label>
                  <input
                    type="email"
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Physical Store Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Default Sales VAT (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Currency Display</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#09172a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                  >
                    <option value="৳ (BDT)">৳ (BDT - Taka)</option>
                    <option value="$ (USD)">$ (USD - Dollar)</option>
                    <option value="€ (EUR)">€ (EUR - Euro)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  color: '#fff',
                  border: 0,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                Save Store Settings
              </button>
            </form>
          )}

          {/* TAB 4: NOTIFICATION PREFERENCES */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Notification & Alert Preferences</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Choose which alerts and automated system events you receive in real-time.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <b style={{ color: '#fff', fontSize: 14, display: 'block', marginBottom: 2 }}>Low Stock & Expiry Alerts</b>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Receive immediate notification when medicine inventory drops below threshold.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lowStockAlerts}
                    onChange={(e) => setLowStockAlerts(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#38bdf8' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <b style={{ color: '#fff', fontSize: 14, display: 'block', marginBottom: 2 }}>POS Checkout Notifications</b>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Receive notification when high-value sales or customer purchases are completed.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#38bdf8' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <b style={{ color: '#fff', fontSize: 14, display: 'block', marginBottom: 2 }}>Doctor Prescription Uploads</b>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Notify when a customer submits a new prescription for verification.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#38bdf8' }}
                  />
                </div>
              </div>

              <button
                onClick={() => notify('Notification preferences updated!')}
                style={{
                  marginTop: 24,
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  color: '#fff',
                  border: 0,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                Save Alert Preferences
              </button>
            </div>
          )}

          {/* TAB 5: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>System Security Audit Log</h2>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>Immutable security audit trail of all store operations and logins.</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('mediflow_audit_logs')
                    setAuditLogs(defaultLogs)
                    notify('Audit logs refreshed')
                  }}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Refresh Logs
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Timestamp</th>
                      <th style={{ padding: '10px 12px' }}>User</th>
                      <th style={{ padding: '10px 12px' }}>Action</th>
                      <th style={{ padding: '10px 12px' }}>IP / Fingerprint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px', color: '#94a3b8', fontFamily: 'DM Mono' }}>{log.timestamp}</td>
                        <td style={{ padding: '12px', color: '#fff', fontWeight: 600 }}>
                          {log.user}
                          <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>{log.role}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#cbd5e1', fontFamily: 'DM Mono', fontSize: 11 }}>
                          {log.ip}
                          <span style={{ display: 'block', fontSize: 9, color: '#64748b' }}>{log.fingerprint}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </RoleShell>
  )
}
