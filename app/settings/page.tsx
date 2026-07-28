'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

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
  { id: 'aud_1', timestamp: '2026-07-28 11:40:12', user: 'Alex Kim', action: 'USER_LOGIN_FIREBASE', ip: '192.168.1.104', fingerprint: 'fp_9a2b8c71', role: 'owner' },
  { id: 'aud_2', timestamp: '2026-07-28 11:15:45', user: 'Jordan Lee', action: 'COMPLETED_POS_SALE_INV9821', ip: '192.168.1.108', fingerprint: 'fp_3f4e5d6a', role: 'employee' },
  { id: 'aud_3', timestamp: '2026-07-28 10:50:00', user: 'Alex Kim', action: 'UPDATED_MEDICINE_STOCK_MED1001', ip: '192.168.1.104', fingerprint: 'fp_9a2b8c71', role: 'owner' },
  { id: 'aud_4', timestamp: '2026-07-28 09:30:22', user: 'Sarah Mitchell', action: 'UPLOADED_PRESCRIPTION_RX901', ip: '172.56.21.90', fingerprint: 'fp_8819ab21', role: 'customer' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<'pharmacy' | 'security' | 'audit'>('pharmacy')
  const [pharmacyName, setPharmacyName] = useState('Northstar Pharmacy & Wellness')
  const [taxRate, setTaxRate] = useState(5)
  const [currency, setCurrency] = useState('$ (USD)')
  const [invoiceHeader, setInvoiceHeader] = useState('104 Health Plaza, Suite 400 · License #PH-99201')
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(defaultLogs)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('mediflow_audit_logs')
    if (saved) {
      try {
        setAuditLogs(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleSavePharmacy(e: React.FormEvent) {
    e.preventDefault()
    notify('Saved Pharmacy Configuration & Currency Settings')
  }

  return (
    <RoleShell role="owner" title="System Settings & Audit Log">
      <div className="page-intro">
        <div>
          <div className="eyebrow">System Configuration & Security Audit</div>
          <h1>Pharmacy Settings</h1>
          <p>Configure tax rates, default currency, receipt layout, security passkeys, and view immutable audit logs.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Navigation Column */}
        <div className="panel settings-nav">
          <b>Workspace Settings</b>
          <button className={tab === 'pharmacy' ? 'selected-setting' : ''} onClick={() => setTab('pharmacy')}>
            ⚙ Pharmacy Info & Tax
          </button>
          <button className={tab === 'security' ? 'selected-setting' : ''} onClick={() => setTab('security')}>
            🔒 Security & Passkeys
          </button>
          <button className={tab === 'audit' ? 'selected-setting' : ''} onClick={() => setTab('audit')}>
            📜 Security Audit Log
          </button>
        </div>

        {/* Content Column */}
        <div className="panel settings-form">
          {tab === 'pharmacy' && (
            <form onSubmit={handleSavePharmacy}>
              <h2 style={{ font: '800 18px Manrope', margin: '0 0 16px' }}>Pharmacy Business Profile</h2>

              <label>
                Pharmacy Business Name
                <input type="text" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} required />
              </label>

              <div className="form-two">
                <label>
                  Default Sales Tax / VAT (%)
                  <input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} required />
                </label>

                <label>
                  Default Currency Symbol
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="$ (USD)">$ (USD)</option>
                    <option value="৳ (BDT)">৳ (BDT)</option>
                    <option value="€ (EUR)">€ (EUR)</option>
                    <option value="£ (GBP)">£ (GBP)</option>
                  </select>
                </label>
              </div>

              <label>
                Printed Invoice Subheader Text
                <input type="text" value={invoiceHeader} onChange={(e) => setInvoiceHeader(e.target.value)} required />
              </label>

              <button className="primary" style={{ marginTop: 24 }}>
                Save Configuration
              </button>
            </form>
          )}

          {tab === 'security' && (
            <div>
              <h2 style={{ font: '800 18px Manrope', margin: '0 0 16px' }}>Authentication & Device Protection</h2>

              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                <b style={{ color: '#1e293b', fontSize: 13 }}>WebAuthn Biometric Passkeys</b>
                <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 12px' }}>
                  Register Windows Hello, TouchID, or FaceID passkeys for passwordless authentication.
                </p>

                <button className="primary" onClick={() => notify('Passkey registration challenge issued')}>
                  Register New Passkey Device <span>＋</span>
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <b style={{ color: '#1e293b', fontSize: 13 }}>FingerprintJS Device Identification</b>
                <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 12px' }}>
                  Every login & transaction records your unique hardware browser signature to prevent account spoofing.
                </p>
                <div style={{ font: '500 11px DM Mono', color: '#2563eb' }}>✓ Active Device Fingerprinting</div>
              </div>
            </div>
          )}

          {tab === 'audit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h2 style={{ font: '800 18px Manrope', margin: '0 0 4px' }}>System Security Audit Log</h2>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Every critical system operation is recorded for accountability</p>
                </div>
                <button
                  className="filter-btn"
                  onClick={() => {
                    localStorage.removeItem('mediflow_audit_logs')
                    setAuditLogs(defaultLogs)
                    notify('Reset audit trail view')
                  }}
                >
                  Refresh Logs
                </button>
              </div>

              <div className="data-table">
                <div className="table-row table-head" style={{ minWidth: 600 }}>
                  <span>Timestamp</span>
                  <span>User / Role</span>
                  <span>Action Performed</span>
                  <span>IP & Fingerprint</span>
                </div>

                {auditLogs.map((log) => (
                  <div className="table-row" key={log.id} style={{ minWidth: 600, gridTemplateColumns: '1.2fr 1fr 1.6fr 1.4fr' }}>
                    <span className="mono">{log.timestamp}</span>

                    <div>
                      <b style={{ color: '#1e293b', fontSize: 11 }}>{log.user}</b>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>{log.role}</div>
                    </div>

                    <span className="status blue" style={{ fontSize: 9 }}>
                      {log.action}
                    </span>

                    <div>
                      <div className="mono" style={{ fontSize: 10 }}>
                        {log.ip}
                      </div>
                      <div className="mono" style={{ fontSize: 9, color: '#94a3b8' }}>
                        {log.fingerprint}
                      </div>
                    </div>
                  </div>
                ))}
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
