'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, saveSuppliersStore, SupplierItem } from '@/lib/owner-store'

export default function OwnerSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('General Medicine')

  useEffect(() => {
    const store = getInitialOwnerStore()
    setSuppliers(store.suppliers)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateAndSaveSuppliers(newSuppliers: SupplierItem[]) {
    setSuppliers(newSuppliers)
    saveSuppliersStore(newSuppliers)
  }

  function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault()
    const newSup: SupplierItem = {
      id: 'SUP-' + Math.floor(10 + Math.random() * 90),
      name: name || 'New Distributor',
      contactPerson: contactPerson || 'Sales Rep',
      email: email || 'contact@distributor.com',
      phone: phone || '+880 1700-000000',
      category: category || 'General Medicine',
      status: 'Active',
      totalOrders: 1,
    }
    const updated = [newSup, ...suppliers]
    updateAndSaveSuppliers(updated)
    notify(`Added ${newSup.name} to supplier directory`)
    setShowAddModal(false)
    setName('')
    setContactPerson('')
    setEmail('')
    setPhone('')
  }

  return (
    <RoleShell role="owner" title="Suppliers Directory">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Vendor Directory & Procurement Partners</div>
          <h1>Supplier Management</h1>
          <p>Maintain pharmaceutical manufacturer contacts, categories, and active order records.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          Add Supplier <span>＋</span>
        </button>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Total Suppliers</span>
          <b>{suppliers.length} Vendors</b>
          <em>Registered partners</em>
        </div>
        <div>
          <span>Active Vendors</span>
          <b className="mint-text">{suppliers.filter((s) => s.status === 'Active').length} Active</b>
          <em>Fulfilling orders</em>
        </div>
        <div>
          <span>Total Orders Placed</span>
          <b className="blue-text">{suppliers.reduce((acc, s) => acc + s.totalOrders, 0)} POs</b>
          <em>All time history</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Authorized Distributors ({suppliers.length})</h2>
            <p>Vendor contact persons, categories, and direct line information</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Supplier Name / ID</span>
            <span>Contact Person</span>
            <span>Category</span>
            <span>Phone / Email</span>
            <span>Total Orders</span>
            <span>Status</span>
          </div>

          {suppliers.map((s) => (
            <div className="table-row" key={s.id}>
              <div>
                <b style={{ color: '#ffffff' }}>{s.name}</b>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {s.id}</div>
              </div>

              <span style={{ color: '#e2e8f0' }}>{s.contactPerson}</span>

              <span style={{ color: '#cbd5e1' }}>{s.category}</span>

              <div>
                <span className="mono" style={{ fontSize: 11, color: '#e2e8f0' }}>{s.phone}</span>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.email}</div>
              </div>

              <span style={{ fontWeight: 600, color: '#34d399' }}>{s.totalOrders} POs</span>

              <div>
                <span className={`status ${s.status === 'Active' ? 'mint' : 'amber'}`}>
                  {s.status === 'Active' ? '✓ Active' : 'Pause'}
                </span>
              </div>
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
            <h2>Add New Supplier</h2>
            <p>Register pharmaceutical vendor details in system directory.</p>

            <form onSubmit={handleAddSupplier}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Company / Supplier Name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Square Pharmaceuticals"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Contact Person
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Category
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Antibiotics & Surgical"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Email Address
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@supplier.com"
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
                    placeholder="+880 1700-000000"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <button className="primary" style={{ width: '100%', marginTop: 18 }}>
                Save Supplier Record
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
