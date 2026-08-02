'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, saveCustomersStore, CustomerRecord } from '@/lib/owner-store'

export default function OwnerCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tier, setTier] = useState<'Gold' | 'Silver' | 'Platinum' | 'Regular'>('Silver')

  useEffect(() => {
    const store = getInitialOwnerStore()
    setCustomers(store.customers)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateAndSaveCustomers(newCustomers: CustomerRecord[]) {
    setCustomers(newCustomers)
    saveCustomersStore(newCustomers)
  }

  function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault()
    const newCust: CustomerRecord = {
      id: 'CUST-' + Math.floor(100 + Math.random() * 900),
      name: name || 'New Customer',
      email: email || 'customer@gmail.com',
      phone: phone || '+880 1700-112233',
      tier: tier,
      totalSpent: 0,
      ordersCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    }
    const updated = [newCust, ...customers]
    updateAndSaveCustomers(updated)
    notify(`Added ${newCust.name} to customer directory`)
    setShowAddModal(false)
    setName('')
    setEmail('')
    setPhone('')
  }

  return (
    <RoleShell role="owner" title="Customer Directory">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Membership & Customer Relationship</div>
          <h1>Customer Management</h1>
          <p>Track registered patients, loyalty tiers, total purchases, and prescription profiles.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          Add Customer <span>＋</span>
        </button>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Registered Customers</span>
          <b>{customers.length} Members</b>
          <em>Active directory</em>
        </div>
        <div>
          <span>Gold / Platinum VIPs</span>
          <b className="blue-text">
            {customers.filter((c) => c.tier === 'Gold' || c.tier === 'Platinum').length} Members
          </b>
          <em>High loyalty tier</em>
        </div>
        <div>
          <span>Total Customer Lifetime Value</span>
          <b>৳{customers.reduce((acc, c) => acc + c.totalSpent, 0).toFixed(2)}</b>
          <em>Total spend history</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Customer Members ({customers.length})</h2>
            <p>Member profile information, contact lines, and order statistics</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Customer Name / ID</span>
            <span>Contact Info</span>
            <span>Loyalty Tier</span>
            <span>Total Orders</span>
            <span>Total Lifetime Spent</span>
            <span>Member Since</span>
          </div>

          {customers.map((c) => (
            <div className="table-row" key={c.id}>
              <div>
                <b style={{ color: '#ffffff' }}>{c.name}</b>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {c.id}</div>
              </div>

              <div>
                <span className="mono" style={{ fontSize: 11, color: '#e2e8f0' }}>{c.phone}</span>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.email}</div>
              </div>

              <div>
                <span className={`status ${c.tier === 'Platinum' ? 'lavender' : c.tier === 'Gold' ? 'amber' : 'blue'}`}>
                  ✦ {c.tier} Member
                </span>
              </div>

              <span style={{ fontWeight: 600, color: '#cbd5e1' }}>{c.ordersCount} Orders</span>

              <span style={{ fontWeight: 700, color: '#34d399' }}>৳{c.totalSpent.toFixed(2)}</span>

              <span style={{ color: '#94a3b8', fontSize: 11 }}>{c.joinedDate}</span>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
              ×
            </button>
            <h2>Register New Customer</h2>
            <p>Add customer profile to pharmacy loyalty program.</p>

            <form onSubmit={handleAddCustomer}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Full Name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Mitchell"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Email Address
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@gmail.com"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Phone Number
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Loyalty Tier
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  >
                    <option value="Regular">Regular Member</option>
                    <option value="Silver">Silver Member</option>
                    <option value="Gold">Gold Member</option>
                    <option value="Platinum">Platinum Member</option>
                  </select>
                </label>
              </div>

              <button className="primary" style={{ width: '100%', marginTop: 18 }}>
                Save Customer Member
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </RoleShell>
  )
}
