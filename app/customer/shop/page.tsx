'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface Product {
  id: string
  name: string
  category: string
  price: number
  requiresRx: boolean
  desc: string
  image: string
}

const shopProducts: Product[] = [
  { id: '1', name: 'Amoxicillin 500mg Capsule', category: 'Antibiotics', price: 12.4, requiresRx: true, desc: 'Broad-spectrum antibiotic for bacterial infections.', image: '/pharma-hero.png' },
  { id: '2', name: 'Paracetamol 500mg Tablet', category: 'Pain Relief', price: 4.8, requiresRx: false, desc: 'Fast fever reduction and pain relief.', image: '/pharma-hero.png' },
  { id: '3', name: 'Metformin 850mg Tablet', category: 'Diabetes', price: 8.2, requiresRx: true, desc: 'Blood sugar control for Type-2 Diabetes.', image: '/pharma-hero.png' },
  { id: '4', name: 'Omeprazole 20mg Capsule', category: 'Gastrointestinal', price: 9.6, requiresRx: false, desc: 'Relief from acid reflux and heartburn.', image: '/pharma-hero.png' },
  { id: '5', name: 'Atorvastatin 20mg Tablet', category: 'Cardiovascular', price: 14.2, requiresRx: true, desc: 'Cholesterol-lowering cardiovascular medication.', image: '/pharma-hero.png' },
  { id: '6', name: 'Vitamin D3 1000IU Softgel', category: 'Supplements', price: 11.8, requiresRx: false, desc: 'Daily immune & bone support supplement.', image: '/pharma-hero.png' },
]

export default function ShopPage() {
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showCheckout, setShowCheckout] = useState(false)
  const [rxFile, setRxFile] = useState<File | null>(null)
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function addToCart(p: Product) {
    const existing = cart.find((item) => item.product.id === p.id)
    if (existing) {
      setCart(cart.map((item) => (item.product.id === p.id ? { ...item, qty: item.qty + 1 } : item)))
    } else {
      setCart([...cart, { product: p, qty: 1 }])
    }
    notify(`Added ${p.name} to cart`)
  }

  const subtotal = cart.reduce((acc, c) => acc + c.product.price * c.qty, 0)
  const hasRxItem = cart.some((c) => c.product.requiresRx)

  function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasRxItem && !rxFile) {
      return alert('One or more items in your cart require a Doctor Prescription. Please attach a prescription file!')
    }
    setShowCheckout(false)
    setCart([])
    setRxFile(null)
    notify('Order #ORD-8822 placed successfully! Track status in My Orders.')
  }

  const filtered = shopProducts.filter((p) => {
    const match = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    if (category === 'All') return match
    return match && p.category === category
  })

  return (
    <RoleShell role="customer" title="Online Pharmacy Shop">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Online Medicine Store</div>
          <h1>Shop Medicines & Wellness</h1>
          <p>Browse genuine pharmaceutical products, health supplements, and upload prescriptions for home delivery.</p>
        </div>

        <button className="primary" onClick={() => setShowCheckout(true)} disabled={cart.length === 0}>
          View Cart ({cart.reduce((a, c) => a + c.qty, 0)}) · ${subtotal.toFixed(2)} <span>→</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search medicines, vitamins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: 11, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
        />
        <div className="category-row" style={{ margin: 0 }}>
          {['All', 'Antibiotics', 'Pain Relief', 'Diabetes', 'Gastrointestinal', 'Cardiovascular', 'Supplements'].map((cat) => (
            <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="customer-shop-grid">
        {filtered.map((p) => (
          <div className="portal-card" key={p.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="portal-card-icon" style={{ margin: 0 }}>
                ✦
              </div>
              {p.requiresRx && <span className="status lavender">🔒 Prescription Required</span>}
            </div>

            <h2>{p.name}</h2>
            <p>{p.desc}</p>

            <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ font: '800 18px Manrope', color: '#2563eb' }}>${p.price.toFixed(2)}</strong>
              <button className="primary" style={{ padding: '8px 14px', fontSize: 11 }} onClick={() => addToCart(p)}>
                Add to Cart ＋
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout & Prescription Modal */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-modal-btn" onClick={() => setShowCheckout(false)}>
              ×
            </button>
            <h2>Checkout & Prescription Upload</h2>
            <p>Review your cart items and attach your prescription if required.</p>

            <form onSubmit={handleOrderSubmit}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 14 }}>
                {cart.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                    <span>
                      {item.product.name} × {item.qty} {item.product.requiresRx && <strong style={{ color: '#8873d8' }}>(Rx)</strong>}
                    </span>
                    <b>${(item.product.price * item.qty).toFixed(2)}</b>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', font: '800 15px Manrope', marginTop: 10 }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#2563eb' }}>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {hasRxItem && (
                <div style={{ background: '#fff5df', border: '1px solid #fef08a', padding: 14, borderRadius: 8, marginBottom: 16 }}>
                  <b style={{ color: '#d39a32', fontSize: 12 }}>🔒 Doctor Prescription Attachment Required</b>
                  <p style={{ fontSize: 11, color: '#713f12', margin: '4px 0 10px' }}>
                    Your order contains prescription-only medicine. Upload a photo or PDF scan of your prescription.
                  </p>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => setRxFile(e.target.files?.[0] || null)} required={hasRxItem} />
                </div>
              )}

              <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 12 }}>
                Delivery Address
                <input
                  type="text"
                  required
                  defaultValue="742 Evergreen Terrace, Suite 2B, Springfield"
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                />
              </label>

              <button className="primary" style={{ width: '100%' }}>
                Place Order (${subtotal.toFixed(2)}) <span>→</span>
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
