'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export default function OwnerSettingsPage() {
  const [pharmacyName, setPharmacyName] = useState('Northstar Pharmacy Limited')
  const [licenseNo, setLicenseNo] = useState('PH-99201-BD')
  const [hotline, setHotline] = useState('01319-864049')
  const [email, setEmail] = useState('support@mediflow.com')
  const [address, setAddress] = useState('104 Health Plaza, Suite 400, Dhaka 1212')
  const [taxRate, setTaxRate] = useState(5)
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    notify('Pharmacy Workspace Settings updated successfully!')
  }

  return (
    <RoleShell role="owner" title="Workspace Settings">
      <div className="page-intro">
        <div>
          <div className="eyebrow">System Configuration & Licensing</div>
          <h1>Pharmacy Workspace Settings</h1>
          <p>Configure store profile, licensing credentials, VAT tax rate, hotline numbers, and billing policies.</p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 800 }}>
        <form onSubmit={handleSaveSettings}>
          <h2 style={{ font: '700 16px Manrope', marginBottom: 16 }}>Store Business Profile</h2>

          <div className="form-two">
            <label style={{ fontSize: 11, color: '#475569' }}>
              Pharmacy Name
              <input
                type="text"
                required
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>

            <label style={{ fontSize: 11, color: '#475569' }}>
              Pharmacy License Number
              <input
                type="text"
                required
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>
          </div>

          <div className="form-two" style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, color: '#475569' }}>
              Emergency Hotline Phone
              <input
                type="text"
                required
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>

            <label style={{ fontSize: 11, color: '#475569' }}>
              Support Email Address
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, color: '#475569' }}>
              Physical Store Address
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>
          </div>

          <hr style={{ border: 0, borderTop: '1px dashed #e2e8f0', margin: '20px 0' }} />

          <h2 style={{ font: '700 16px Manrope', marginBottom: 16 }}>Taxation & Billing Rules</h2>

          <div className="form-two">
            <label style={{ fontSize: 11, color: '#475569' }}>
              Default VAT Tax Rate (%)
              <input
                type="number"
                step="0.1"
                required
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>

            <label style={{ fontSize: 11, color: '#475569' }}>
              Owner Account Email
              <input
                type="text"
                disabled
                value="ayanpaul.pro@gmail.com"
                style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4, background: '#f1f5f9' }}
              />
            </label>
          </div>

          <button className="primary" style={{ marginTop: 24 }}>
            Save Settings Changes
          </button>
        </form>
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
