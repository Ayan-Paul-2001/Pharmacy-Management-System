'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, saveMedicinesStore, getCategoriesStore, MedicineItem, CategoryItem } from '@/lib/owner-store'
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertTriangle, ShieldAlert, Pill } from 'lucide-react'

export default function OwnerInventoryPage() {
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null)
  const [toast, setToast] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

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
    image: '',
  })

  useEffect(() => {
    const store = getInitialOwnerStore()
    setMedicines(store.medicines)
    setCategories(getCategoriesStore())

    function handleCatsChanged() {
      setCategories(getCategoriesStore())
    }
    window.addEventListener('mediflow_categories_changed', handleCatsChanged)
    return () => window.removeEventListener('mediflow_categories_changed', handleCatsChanged)
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

  async function handleCloudinaryUpload(file: File) {
    setUploadingImage(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', 'docs_upload_example_us_preset') // Cloudinary unsigned preset
      const res = await fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.secure_url) {
        setFormData((prev) => ({ ...prev, image: json.secure_url }))
        notify('Cloudinary Image Uploaded Successfully!')
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFormData((prev) => ({ ...prev, image: e.target?.result as string }))
          notify('Medicine Image Attached!')
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }))
        notify('Medicine Image Attached!')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

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
        image: formData.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=120&q=80',
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
          <p>Maintain full stock history, Cloudinary image assets, reorder alerts, pricing, barcode lookup, and prescription rules.</p>
        </div>
        <button
          className="primary"
          onClick={() => {
            setFormData({
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
              image: '',
            })
            setShowAddModal(true)
          }}
        >
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
          <b>৳ {medicines.reduce((acc, m) => acc + m.stockQuantity * m.sellingPrice, 0).toFixed(2)}</b>
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
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="Low Stock">Low Stock</option>
              <option value="Rx Required">Rx Required</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table">
          <div className="table-row table-head" style={{ gridTemplateColumns: '2.2fr 1.2fr 1fr 1fr 1.2fr 0.8fr' }}>
            <span>Medicine / Image</span>
            <span>Category / Brand</span>
            <span>Stock / Reorder</span>
            <span>Prices</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filteredMedicines.map((m) => {
            const isLow = m.stockQuantity <= m.reorderLevel
            return (
              <div className="table-row" key={m.id} style={{ gridTemplateColumns: '2.2fr 1.2fr 1fr 1fr 1.2fr 0.8fr', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Medicine Image Thumbnail */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {m.image ? (
                      <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Pill size={20} style={{ color: '#38bdf8' }} />
                    )}
                  </div>

                  <div>
                    <b style={{ color: '#ffffff', fontSize: 13, display: 'block' }}>{m.name}</b>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {m.genericName} · <span className="mono">{m.barcode}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontWeight: 600, color: '#e2e8f0', display: 'block' }}>{m.category}</span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.manufacturer}</div>
                </div>

                <div>
                  <strong style={{ fontSize: 13, color: isLow ? '#f87171' : '#34d399', display: 'block' }}>
                    {m.stockQuantity} units
                  </strong>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Reorder level: {m.reorderLevel}</div>
                </div>

                <div>
                  <span style={{ color: '#60a5fa', fontWeight: 700, display: 'block' }}>৳ {m.sellingPrice.toFixed(2)}</span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Cost: ৳ {m.purchasePrice.toFixed(2)}</div>
                </div>

                {/* High Contrast SVG Status Badges */}
                <div>
                  {isLow ? (
                    <span
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  ) : m.requiresPrescription ? (
                    <span
                      style={{
                        background: 'rgba(167, 139, 250, 0.15)',
                        color: '#c084fc',
                        border: '1px solid rgba(167, 139, 250, 0.35)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ShieldAlert size={12} /> Rx Required
                    </span>
                  ) : (
                    <span
                      style={{
                        background: 'rgba(52, 211, 153, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(52, 211, 153, 0.35)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle size={12} /> In Stock
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button
                    className="filter-btn"
                    style={{ padding: '5px 10px' }}
                    onClick={() => {
                      setEditingMed(m)
                      setFormData(m)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="filter-btn"
                    style={{ padding: '5px 10px', color: '#de6870' }}
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
        <div
          onClick={() => {
            setShowAddModal(false)
            setEditingMed(null)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 12, 24, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 620,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#09172a',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 18,
              padding: '24px 28px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 30px rgba(56, 189, 248, 0.2)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ font: '800 20px Manrope', color: '#ffffff', margin: 0 }}>
                {editingMed ? 'Edit Medicine Record' : 'Add New Medicine'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingMed(null)
                }}
                style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 20px' }}>
              Upload medicine images directly to Cloudinary and set stock levels & pricing.
            </p>

            <form onSubmit={handleSaveMedicine}>
              {/* CLOUDINARY MEDICINE IMAGE UPLOAD SECTION */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(56, 189, 248, 0.35)',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    background: '#061222',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Medicine Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={28} style={{ color: '#38bdf8' }} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <b style={{ color: '#ffffff', fontSize: 13, display: 'block', marginBottom: 2 }}>
                    Cloudinary Image Upload
                  </b>
                  <span style={{ color: '#94a3b8', fontSize: 11, display: 'block', marginBottom: 10 }}>
                    Upload medicine picture via Cloudinary CDN or paste image URL
                  </span>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label
                      style={{
                        background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                      }}
                    >
                      <UploadCloud size={14} />
                      <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleCloudinaryUpload(file)
                        }}
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste Cloudinary URL..."
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#ffffff',
                        fontSize: 11,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* FORM FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Amoxicillin 500mg"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Generic Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genericName || ''}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin Trihydrate"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={formData.category || (categories[0]?.name || 'Antibiotics')}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: '#061222', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.icon || '💊'} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Manufacturer / Brand
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g. GSK Pharma"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Purchase Price (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.purchasePrice || 0}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Selling Price (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.sellingPrice || 0}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Initial Stock Qty
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                    Reorder Level Alert
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.reorderLevel || 15}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#e2e8f0', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requiresPrescription || false}
                    onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                    style={{ accentColor: '#38bdf8', width: 16, height: 16 }}
                  />
                  <span>Requires valid Doctor Prescription (Rx)</span>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  color: '#ffffff',
                  border: 0,
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
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
