'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export default function CustomerProfilePage() {
  const [name, setName] = useState('Sarah Mitchell')
  const [email, setEmail] = useState('sarah.mitchell@email.com')
  const [phone, setPhone] = useState('+1 (555) 982-1029')
  const [address, setAddress] = useState('742 Evergreen Terrace, Suite 2B, Springfield')
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    notify('Saved profile and delivery address!')
  }

  return (
    <RoleShell role="customer" title="My Profile Settings">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Personal Health Account</div>
          <h1>Account & Delivery Profile</h1>
          <p>Update contact information, emergency phone number, and default shipping addresses.</p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSave}>
          <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 12 }}>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
            />
          </label>

          <div className="form-two" style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: '#475569' }}>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>

            <label style={{ fontSize: 11, color: '#475569' }}>
              Phone Number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
              />
            </label>
          </div>

          <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 16 }}>
            Saved Delivery Address
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4, fontFamily: 'inherit' }}
            />
          </label>

          <button className="primary">Save Profile Settings <span>✓</span></button>
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
