'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, saveMedicinesStore, MedicineItem } from '@/lib/owner-store'

export default function OwnerInventoryPage() {
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null)
  const [toast, setToast] = useState('')

  const [formData, setFormData] = useState<Partial<MedicineItem>>({
    name: '',
    genericName: '',
    brand: '',
    manufacturer: '',
    category: 'Antibiotics',
    barcode: '',
    purchasePrice: 5.0,
    sellingPrice: 9.0,
    taxRate: 5,
    stockQuantity: 100,
    reorderLevel: 20,
    expiryDate: '2027-06-30',
    storage: 'Store below 25°C',
    requiresPrescription: false,
  })

  useEffect(() => {
    const store = getInitialOwnerStore()
    setMedicines(store.medicines)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateAndSaveMedicines(newMeds: MedicineItem[]) {
    setMedicines(newMeds)
    saveMedicinesStore(newMeds)
  }

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.barcode.includes(search) ||
      m.category.toLowerCase().includes(search.toLowerCase())

    if (categoryFilter === 'All') return matchesSearch
    if (categoryFilter === 'Low Stock') return matchesSearch && m.stockQuantity <= m.reorderLevel
    if (categoryFilter === 'Rx Required') return matchesSearch && m.requiresPrescription
    return matchesSearch && m.category === categoryFilter
  })

  function handleSaveMedicine(e: React.FormEvent) {
    e.preventDefault()
    if (editingMed) {
      const updated = medicines.map((m) => (m.id === editingMed.id ? ({ ...m, ...formData } as MedicineItem) : m))
      updateAndSaveMedicines(updated)
      notify(`Updated ${formData.name}`)
      setEditingMed(null)
    } else {
      const newMed: MedicineItem = {
        id: 'MED-' + Math.floor(1000 + Math.random() * 9000),
        barcode: formData.barcode || '890' + Math.floor(1000000000 + Math.random() * 9000000000),
        name: formData.name || 'New Medicine',
        genericName: formData.genericName || 'Generic Name',
        brand: formData.brand || 'Brand',
        manufacturer: formData.manufacturer || 'Pharma Corp',
        category: formData.category || 'General',
        purchasePrice: Number(formData.purchasePrice) || 5.0,
        sellingPrice: Number(formData.sellingPrice) || 8.0,
        taxRate: Number(formData.taxRate) || 5,
        stockQuantity: Number(formData.stockQuantity) || 50,
        reorderLevel: Number(formData.reorderLevel) || 15,
        expiryDate: formData.expiryDate || '2027-12-31',
        storage: formData.storage || 'Standard storage',
        requiresPrescription: Boolean(formData.requiresPrescription),
        image: '/pharma-hero.png',
      }
      const updated = [newMed, ...medicines]
      updateAndSaveMedicines(updated)
      notify(`Added ${newMed.name} to inventory`)
      setShowAddModal(false)
    }
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to remove this medicine record?')) {
      const updated = medicines.filter((m) => m.id !== id)
      updateAndSaveMedicines(updated)
      notify('Medicine deleted from database')
    }
  }

  return (
    <RoleShell role="owner" title="Medicine Inventory">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Inventory Control & Stock Management</div>
          <h1>Medicine Database</h1>
          <p>Maintain full stock history, reorder alerts, pricing, barcode lookup, and prescription rules.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          Add Medicine <span>＋</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="stat-strip">
        <div>
          <span>Total Medicines</span>
          <b>{medicines.length} SKUs</b>
          <em>Catalog cataloged</em>
        </div>
        <div>
          <span>Low Stock Items</span>
          <b className="amber-text">{medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length} Alert</b>
          <em>Below reorder limit</em>
        </div>
        <div>
          <span>Prescription Required</span>
          <b className="blue-text">{medicines.filter((m) => m.requiresPrescription).length} Rx Medicines</b>
          <em>Strict sales control</em>
        </div>
        <div>
          <span>Total Inventory Valuation</span>
          <b>${medicines.reduce((acc, m) => acc + m.stockQuantity * m.sellingPrice, 0).toFixed(2)}</b>
          <em>Current stock value</em>
        </div>
      </div>

      {/* Search & Toolbar */}
      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Medicine Catalog ({filteredMedicines.length})</h2>
            <p>Filter by barcode, category, prescription status, or name</p>
          </div>
          <div className="toolbar-actions">
            <input
              type="text"
              className="table-search"
              placeholder="Search name, barcode, generic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-btn"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
              <option value="Supplements">Supplements</option>
              <option value="Low Stock">⚠️ Low Stock</option>
              <option value="Rx Required">🔒 Rx Required</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table">
          <div className="table-row table-head">
            <span>Medicine Name / Generic</span>
            <span>Category / Brand</span>
            <span>Stock / Reorder</span>
            <span>Prices</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filteredMedicines.map((m) => {
            const isLow = m.stockQuantity <= m.reorderLevel
            return (
              <div className="table-row" key={m.id}>
                <div>
                  <b style={{ color: '#ffffff', fontSize: 13 }}>{m.name}</b>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {m.genericName} · Barcode: <span className="mono">{m.barcode}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{m.category}</span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.manufacturer}</div>
                </div>

                <div>
                  <strong style={{ fontSize: 13, color: isLow ? '#f87171' : '#34d399' }}>
                    {m.stockQuantity} units
                  </strong>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Reorder level: {m.reorderLevel}</div>
                </div>

                <div>
                  <span style={{ color: '#60a5fa', fontWeight: 700 }}>৳{m.sellingPrice.toFixed(2)}</span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Cost: ৳{m.purchasePrice.toFixed(2)}</div>
                </div>

                <div>
                  {isLow ? (
                    <span className="status amber">⚠️ Low Stock</span>
                  ) : m.requiresPrescription ? (
                    <span className="status lavender">🔒 Rx Required</span>
                  ) : (
                    <span className="status mint">✓ In Stock</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button
                    className="filter-btn"
                    style={{ padding: '4px 8px' }}
                    onClick={() => {
                      setEditingMed(m)
                      setFormData(m)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="filter-btn"
                    style={{ padding: '4px 8px', color: '#de6870' }}
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {(showAddModal || editingMed) && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button
              className="close-modal-btn"
              onClick={() => {
                setShowAddModal(false)
                setEditingMed(null)
              }}
            >
              ×
            </button>
            <h2>{editingMed ? 'Edit Medicine' : 'Add New Medicine'}</h2>
            <p>Maintain accurate catalog information, prices, tax rate, and stock rules.</p>

            <form onSubmit={handleSaveMedicine}>
              <div className="form-two">
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Medicine Name
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Amoxicillin 500mg"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Generic Name
                  <input
                    type="text"
                    required
                    value={formData.genericName || ''}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin Trihydrate"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div className="form-two" style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Category
                  <select
                    value={formData.category || 'Antibiotics'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Supplements">Supplements</option>
                  </select>
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Manufacturer / Supplier
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g. GSK Pharma"
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div className="form-two" style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Purchase Price ($)
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.purchasePrice || 0}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Selling Price ($)
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.sellingPrice || 0}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div className="form-two" style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Initial Stock Qty
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Reorder Level Alert
                  <input
                    type="number"
                    required
                    value={formData.reorderLevel || 15}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requiresPrescription || false}
                    onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                  />
                  <span>Requires valid Doctor Prescription (Rx)</span>
                </label>
              </div>

              <button className="primary" style={{ width: '100%', marginTop: 20 }}>
                {editingMed ? 'Update Medicine Record' : 'Save to Inventory Catalog'}
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
