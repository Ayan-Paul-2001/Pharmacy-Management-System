'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface Supplier {
  id: string
  name: string
  company: string
  phone: string
  email: string
  totalPurchases: number
  outstandingDues: number
  license: string
  status: 'Active' | 'Pending'
}

const initialSuppliers: Supplier[] = [
  { id: 'SUP-101', name: 'Robert Chen', company: 'GSK Pharmaceuticals', phone: '+1 (555) 234-5678', email: 'robert@gskpharma.com', totalPurchases: 45200, outstandingDues: 3450, license: 'TL-98201-US', status: 'Active' },
  { id: 'SUP-102', name: 'Elena Rostova', company: 'AstraZeneca Global', phone: '+1 (555) 345-6789', email: 'elena@astrazeneca.com', totalPurchases: 62800, outstandingDues: 0, license: 'TL-44021-EU', status: 'Active' },
  { id: 'SUP-103', name: 'Marcus Vance', company: 'Pfizer Supplies', phone: '+1 (555) 456-7890', email: 'marcus@pfizer.com', totalPurchases: 89400, outstandingDues: 12500, license: 'TL-11029-US', status: 'Active' },
  { id: 'SUP-104', name: 'Anita Patel', company: 'Sun Pharma Lab', phone: '+1 (555) 567-8901', email: 'anita@sunpharma.com', totalPurchases: 28100, outstandingDues: 1200, license: 'TL-88230-IN', status: 'Active' },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [payingSupplier, setPayingSupplier] = useState<Supplier | null>(null)
  const [payAmount, setPayAmount] = useState(0)
  const [toast, setToast] = useState('')

  const [newSup, setNewSup] = useState({ company: '', name: '', phone: '', email: '', license: '' })

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault()
    const sup: Supplier = {
      id: 'SUP-' + Math.floor(100 + Math.random() * 900),
      company: newSup.company,
      name: newSup.name,
      phone: newSup.phone,
      email: newSup.email,
      totalPurchases: 0,
      outstandingDues: 0,
      license: newSup.license || 'TL-PENDING',
      status: 'Active',
    }
    setSuppliers([sup, ...suppliers])
    notify(`Registered ${sup.company}`)
    setShowAdd(false)
  }

  function handlePayDues(e: React.FormEvent) {
    e.preventDefault()
    if (!payingSupplier) return
    setSuppliers(
      suppliers.map((s) => (s.id === payingSupplier.id ? { ...s, outstandingDues: Math.max(0, s.outstandingDues - payAmount) } : s))
    )
    notify(`Recorded $${payAmount} payment to ${payingSupplier.company}`)
    setPayingSupplier(null)
  }

  const filtered = suppliers.filter(
    (s) =>
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <RoleShell role="owner" title="Suppliers">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Supplier Relationship & Dues Tracking</div>
          <h1>Supplier Management</h1>
          <p>Maintain pharmaceutical supplier records, purchase invoices, and payment clearings.</p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>
          Register Supplier <span>＋</span>
        </button>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Active Suppliers</span>
          <b>{suppliers.length} Registered</b>
          <em>Pharma distribution partners</em>
        </div>
        <div>
          <span>Total Purchases YTD</span>
          <b>${suppliers.reduce((acc, s) => acc + s.totalPurchases, 0).toLocaleString()}</b>
          <em>Combined order value</em>
        </div>
        <div>
          <span>Outstanding Dues</span>
          <b className="amber-text">${suppliers.reduce((acc, s) => acc + s.outstandingDues, 0).toLocaleString()}</b>
          <em>Pending supplier balances</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Suppliers Directory ({filtered.length})</h2>
            <p>Filter by company name, contact person, or license</p>
          </div>
          <input
            type="text"
            className="table-search"
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Supplier / Company</span>
            <span>Contact Details</span>
            <span>Trade License</span>
            <span>Total Purchases</span>
            <span>Outstanding Dues</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map((s) => (
            <div className="table-row" key={s.id}>
              <div>
                <b style={{ color: '#1e293b', fontSize: 12 }}>{s.company}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>Contact: {s.name}</div>
              </div>

              <div>
                <span>{s.phone}</span>
                <div style={{ fontSize: 10, color: '#64748b' }}>{s.email}</div>
              </div>

              <span className="mono">{s.license}</span>

              <span style={{ fontWeight: 600 }}>${s.totalPurchases.toLocaleString()}</span>

              <span style={{ fontWeight: 700, color: s.outstandingDues > 0 ? '#de6870' : '#35ad80' }}>
                ${s.outstandingDues.toLocaleString()}
              </span>

              <div style={{ textAlign: 'right' }}>
                {s.outstandingDues > 0 && (
                  <button
                    className="filter-btn"
                    style={{ background: '#eaf2ff', color: '#2563eb' }}
                    onClick={() => {
                      setPayingSupplier(s)
                      setPayAmount(s.outstandingDues)
                    }}
                  >
                    Clear Dues
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setShowAdd(false)}>
              ×
            </button>
            <h2>Register New Supplier</h2>
            <p>Add pharmaceutical distributor details and trade license info.</p>

            <form onSubmit={handleAddSupplier}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Company Name
                <input
                  type="text"
                  required
                  value={newSup.company}
                  onChange={(e) => setNewSup({ ...newSup, company: e.target.value })}
                  placeholder="e.g. Novartis Pharma"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <label style={{ fontSize: 11, color: '#475569', marginTop: 10, display: 'block' }}>
                Contact Person Name
                <input
                  type="text"
                  required
                  value={newSup.name}
                  onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Phone Number
                  <input
                    type="tel"
                    required
                    value={newSup.phone}
                    onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Email Address
                  <input
                    type="email"
                    required
                    value={newSup.email}
                    onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                    placeholder="contact@novartis.com"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <label style={{ fontSize: 11, color: '#475569', marginTop: 10, display: 'block' }}>
                Trade License Number
                <input
                  type="text"
                  value={newSup.license}
                  onChange={(e) => setNewSup({ ...newSup, license: e.target.value })}
                  placeholder="e.g. TL-90812-US"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <button className="primary" style={{ width: '100%', marginTop: 18 }}>
                Save Supplier Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pay Dues Modal */}
      {payingSupplier && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setPayingSupplier(null)}>
              ×
            </button>
            <h2>Clear Supplier Balance</h2>
            <p>
              Record payment to <strong>{payingSupplier.company}</strong> (Current Dues: ${payingSupplier.outstandingDues})
            </p>

            <form onSubmit={handlePayDues}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Payment Amount ($)
                <input
                  type="number"
                  max={payingSupplier.outstandingDues}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <button className="primary" style={{ width: '100%', marginTop: 16 }}>
                Record Payment
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
