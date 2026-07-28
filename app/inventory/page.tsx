'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

export interface MedicineItem {
  id: string
  barcode: string
  name: string
  genericName: string
  brand: string
  manufacturer: string
  category: string
  purchasePrice: number
  sellingPrice: number
  taxRate: number
  stockQuantity: number
  reorderLevel: number
  expiryDate: string
  storage: string
  requiresPrescription: boolean
  image: string
}

const initialMedicines: MedicineItem[] = [
  {
    id: 'MED-1001',
    barcode: '8901234567890',
    name: 'Amoxicillin 500mg Capsule',
    genericName: 'Amoxicillin Trihydrate',
    brand: 'Amoxil',
    manufacturer: 'GSK Pharmaceuticals',
    category: 'Antibiotics',
    purchasePrice: 8.5,
    sellingPrice: 12.4,
    taxRate: 5,
    stockQuantity: 145,
    reorderLevel: 30,
    expiryDate: '2027-08-15',
    storage: 'Store below 25°C',
    requiresPrescription: true,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1002',
    barcode: '8901234567891',
    name: 'Paracetamol 500mg Tablet',
    genericName: 'Acetaminophen',
    brand: 'Panadol',
    manufacturer: 'Haleon Healthcare',
    category: 'Pain Relief',
    purchasePrice: 2.1,
    sellingPrice: 4.8,
    taxRate: 5,
    stockQuantity: 320,
    reorderLevel: 50,
    expiryDate: '2028-02-10',
    storage: 'Store in a dry place',
    requiresPrescription: false,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1003',
    barcode: '8901234567892',
    name: 'Metformin 850mg Tablet',
    genericName: 'Metformin Hydrochloride',
    brand: 'Glucophage',
    manufacturer: 'Merck Group',
    category: 'Diabetes',
    purchasePrice: 5.2,
    sellingPrice: 8.2,
    taxRate: 5,
    stockQuantity: 18,
    reorderLevel: 40,
    expiryDate: '2026-11-20',
    storage: 'Store below 30°C',
    requiresPrescription: true,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1004',
    barcode: '8901234567893',
    name: 'Omeprazole 20mg Capsule',
    genericName: 'Omeprazole Magnesium',
    brand: 'Prilosec',
    manufacturer: 'AstraZeneca',
    category: 'Gastrointestinal',
    purchasePrice: 6.0,
    sellingPrice: 9.6,
    taxRate: 5,
    stockQuantity: 82,
    reorderLevel: 25,
    expiryDate: '2026-09-05',
    storage: 'Protect from light',
    requiresPrescription: false,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1005',
    barcode: '8901234567894',
    name: 'Atorvastatin 20mg Tablet',
    genericName: 'Atorvastatin Calcium',
    brand: 'Lipitor',
    manufacturer: 'Pfizer Inc.',
    category: 'Cardiovascular',
    purchasePrice: 9.4,
    sellingPrice: 14.2,
    taxRate: 5,
    stockQuantity: 12,
    reorderLevel: 20,
    expiryDate: '2026-08-18',
    storage: 'Store below 25°C',
    requiresPrescription: true,
    image: '/pharma-hero.png',
  },
  {
    id: 'MED-1006',
    barcode: '8901234567895',
    name: 'Vitamin D3 1000IU Softgel',
    genericName: 'Cholecalciferol',
    brand: 'D-3 Vital',
    manufacturer: 'Bayer Healthcare',
    category: 'Supplements',
    purchasePrice: 7.0,
    sellingPrice: 11.8,
    taxRate: 5,
    stockQuantity: 210,
    reorderLevel: 35,
    expiryDate: '2027-12-30',
    storage: 'Store in cool place',
    requiresPrescription: false,
    image: '/pharma-hero.png',
  },
]

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<MedicineItem[]>(initialMedicines)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null)
  const [toast, setToast] = useState('')

  // New medicine form state
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

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
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
      setMedicines(medicines.map((m) => (m.id === editingMed.id ? { ...m, ...formData } as MedicineItem : m)))
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
      setMedicines([newMed, ...medicines])
      notify(`Added ${newMed.name} to inventory`)
      setShowAddModal(false)
    }
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to remove this medicine record?')) {
      setMedicines(medicines.filter((m) => m.id !== id))
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
                  <b style={{ color: '#1e293b', fontSize: 12 }}>{m.name}</b>
                  <div style={{ fontSize: 10, color: '#64748b' }}>
                    {m.genericName} · Barcode: <span className="mono">{m.barcode}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontWeight: 600 }}>{m.category}</span>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{m.manufacturer}</div>
                </div>

                <div>
                  <strong style={{ fontSize: 12, color: isLow ? '#de6870' : '#0f172a' }}>
                    {m.stockQuantity} units
                  </strong>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Reorder level: {m.reorderLevel}</div>
                </div>

                <div>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>${m.sellingPrice.toFixed(2)}</span>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Cost: ${m.purchasePrice.toFixed(2)}</div>
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
