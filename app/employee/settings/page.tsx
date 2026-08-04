'use client'

import { useState, useEffect } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { User, Shield, Bell, Key, Eye, EyeOff } from 'lucide-react'

export default function EmployeeSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')

  // User Profile State
  const [name, setName] = useState('Jordan Lee')
  const [email, setEmail] = useState('jordan.lee@northstar.com')
  const [phone, setPhone] = useState('+880 1812-998877')
  const [jobTitle, setJobTitle] = useState('Lead Pharmacist & Inventory Specialist')

  // Password Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const userStr = localStorage.getItem('mediflow_user')
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        if (u.name) setName(u.name)
        if (u.email) setEmail(u.email)
      } catch (e) {}
    }
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    notify('Employee profile updated successfully!')
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
    notify('Account password updated successfully!')
  }

  return (
    <RoleShell role="employee" title="Account Settings">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Pharmacist Credentials & Preferences</div>
          <h1>Account Settings</h1>
          <p>Manage your pharmacist profile, password credentials, and alert preferences.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Navigation */}
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
              background: activeTab === 'security' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'security' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'security' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <Shield size={16} />
            <span>Password & Security</span>
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
              background: activeTab === 'notifications' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'notifications' ? '#38bdf8' : '#94a3b8',
              borderLeft: activeTab === 'notifications' ? '3px solid #38bdf8' : '3px solid transparent',
            }}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            background: '#0a1728',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '24px 28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Pharmacist Profile Details</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Manage your personal details and staff identity.</p>

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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Job Designation</label>
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

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange}>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Password & Credentials</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Update your account login password.</p>

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

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ font: '800 18px Manrope', color: '#ffffff', margin: '0 0 4px' }}>Notification Settings</h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px' }}>Configure alert notifications for your employee workspace.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <b style={{ color: '#fff', fontSize: 14, display: 'block', marginBottom: 2 }}>Low Stock Alerts</b>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Receive alert popups when medicine stock quantities drop low.</span>
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
                    <b style={{ color: '#fff', fontSize: 14, display: 'block', marginBottom: 2 }}>POS Sale Notifications</b>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Show confirmation toasts on POS transactions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#38bdf8' }}
                  />
                </div>
              </div>

              <button
                onClick={() => notify('Employee notification settings saved!')}
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
                Save Preferences
              </button>
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
