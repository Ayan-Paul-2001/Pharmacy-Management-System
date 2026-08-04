'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getCategoriesStore, saveCategoriesStore, getInitialOwnerStore, CategoryItem, defaultCategories } from '@/lib/owner-store'
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  Layers,
  Package,
  Pill,
  Stethoscope,
  Activity,
  Heart,
  TestTube,
  Sparkles,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react'

// Helper to render Lucide SVG Icon for category
export function renderCategoryIcon(iconName: string, color: string = '#38bdf8', size: number = 22) {
  switch (iconName) {
    case 'Stethoscope':
      return <Stethoscope size={size} style={{ color }} />
    case 'Activity':
      return <Activity size={size} style={{ color }} />
    case 'Heart':
      return <Heart size={size} style={{ color }} />
    case 'TestTube':
      return <TestTube size={size} style={{ color }} />
    case 'Sparkles':
      return <Sparkles size={size} style={{ color }} />
    case 'ShieldAlert':
      return <ShieldAlert size={size} style={{ color }} />
    case 'Tag':
      return <Tag size={size} style={{ color }} />
    case 'Pill':
    default:
      return <Pill size={size} style={{ color }} />
  }
}

export default function OwnerCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [toast, setToast] = useState('')

  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    name: '',
    description: '',
    icon: 'Pill',
    color: '#38bdf8',
  })

  useEffect(() => {
    const cats = getCategoriesStore()
    setCategories(cats)
    const store = getInitialOwnerStore()
    setMedicines(store.medicines)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateAndSaveCategories(cats: CategoryItem[]) {
    setCategories(cats)
    saveCategoriesStore(cats)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mediflow_categories_changed'))
    }
  }

  function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name?.trim()) return

    if (editingCategory) {
      const updated = categories.map((c) => (c.id === editingCategory.id ? ({ ...c, ...formData } as CategoryItem) : c))
      updateAndSaveCategories(updated)
      notify(`Category "${formData.name}" updated!`)
      setEditingCategory(null)
    } else {
      const newCat: CategoryItem = {
        id: 'CAT-' + Math.floor(1000 + Math.random() * 9000),
        name: formData.name.trim(),
        description: formData.description || 'Pharmacy medicine category',
        icon: formData.icon || 'Pill',
        color: formData.color || '#38bdf8',
      }
      const updated = [...categories, newCat]
      updateAndSaveCategories(updated)
      notify(`Category "${newCat.name}" created successfully!`)
      setShowAddModal(false)
    }
  }

  function handleDeleteCategory(id: string, name: string) {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      const updated = categories.filter((c) => c.id !== id)
      updateAndSaveCategories(updated)
      notify(`Category "${name}" deleted`)
    }
  }

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  )

  const availableIcons = ['Pill', 'Stethoscope', 'Activity', 'Heart', 'TestTube', 'Sparkles', 'ShieldAlert', 'Tag']
  const colorOptions = ['#38bdf8', '#34d399', '#f87171', '#c084fc', '#fbbf24', '#4ade80', '#f472b6', '#a78bfa']

  return (
    <RoleShell role="owner" title="Medicine Categories">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Category Master & Classification</div>
          <h1>Medicine Categories</h1>
          <p>Create, edit, and manage medicine categories. Changes automatically sync to Inventory, POS, and Filters across the system.</p>
        </div>
        <button
          className="primary"
          onClick={() => {
            setFormData({ name: '', description: '', icon: 'Pill', color: '#38bdf8' })
            setShowAddModal(true)
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="stat-strip">
        <div>
          <span>Total Categories</span>
          <b>{categories.length} Categories</b>
          <em>System classifications</em>
        </div>
        <div>
          <span>Total Medicines</span>
          <b className="blue-text">{medicines.length} SKUs</b>
          <em>Cataloged in store</em>
        </div>
        <div>
          <span>Category Status</span>
          <b className="mint-text">Fully Synced</b>
          <em>Live project synchronization</em>
        </div>
      </div>

      {/* Categories Toolbar */}
      <div className="panel table-panel" style={{ marginTop: 24 }}>
        <div className="table-toolbar">
          <div>
            <h2>Category List ({filteredCategories.length})</h2>
            <p>Manage pharmaceutical categories & product groupings</p>
          </div>
          <div className="toolbar-actions">
            <input
              type="text"
              className="table-search"
              placeholder="Search category name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: '16px 20px 24px' }}>
          {filteredCategories.map((cat) => {
            const count = medicines.filter((m) => m.category === cat.name).length
            return (
              <div
                key={cat.id}
                style={{
                  background: '#09172a',
                  border: `1px solid ${cat.color}35`,
                  borderRadius: 14,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 15px ${cat.color}15`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${cat.color}20`,
                        border: `1px solid ${cat.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {renderCategoryIcon(cat.icon, cat.color, 22)}
                    </div>
                    <div>
                      <b style={{ color: '#ffffff', fontSize: 16, display: 'block' }}>{cat.name}</b>
                      <span style={{ color: cat.color, fontSize: 11, fontWeight: 700 }}>
                        {count} {count === 1 ? 'Medicine' : 'Medicines'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => {
                        setEditingCategory(cat)
                        setFormData(cat)
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#cbd5e1',
                        padding: 6,
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#f87171',
                        padding: 6,
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {(showAddModal || editingCategory) && (
        <div
          onClick={() => {
            setShowAddModal(false)
            setEditingCategory(null)
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
              maxWidth: 480,
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
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingCategory(null)
                }}
                style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 20px' }}>
              Categories will instantly sync across Inventory, POS, and Medicine filters.
            </p>

            <form onSubmit={handleSaveCategory}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Antibiotics, Pain Relief, Eye Care..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of this pharmaceutical category..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Category Icon
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {availableIcons.map((iconKey) => (
                      <div
                        key={iconKey}
                        onClick={() => setFormData({ ...formData, icon: iconKey })}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: formData.icon === iconKey ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.05)',
                          border: formData.icon === iconKey ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {renderCategoryIcon(iconKey, formData.icon === iconKey ? '#38bdf8' : '#94a3b8', 18)}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Color Theme Badge
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                    {colorOptions.map((c) => (
                      <div
                        key={c}
                        onClick={() => setFormData({ ...formData, color: c })}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: c,
                          cursor: 'pointer',
                          border: formData.color === c ? '2px solid #ffffff' : '2px solid transparent',
                          boxShadow: formData.color === c ? `0 0 8px ${c}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
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
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}
    </RoleShell>
  )
}
