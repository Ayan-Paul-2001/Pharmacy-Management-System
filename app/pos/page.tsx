'use client'

import { useState } from 'react'
import { ModuleShell } from '@/components/ModuleShell'
import { addLiveNotification } from '@/lib/notification-store'

interface POSProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  barcode: string
  requiresRx: boolean
}

interface CartItem extends POSProduct {
  qty: number
}

const posProducts: POSProduct[] = [
  { id: '1', name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 12.4, stock: 145, barcode: '8901234567890', requiresRx: true },
  { id: '2', name: 'Paracetamol 500mg', category: 'Pain relief', price: 4.8, stock: 320, barcode: '8901234567891', requiresRx: false },
  { id: '3', name: 'Metformin 850mg', category: 'Diabetes', price: 8.2, stock: 18, barcode: '8901234567892', requiresRx: true },
  { id: '4', name: 'Omeprazole 20mg', category: 'Gastrointestinal', price: 9.6, stock: 82, barcode: '8901234567893', requiresRx: false },
  { id: '5', name: 'Atorvastatin 20mg', category: 'Cardiovascular', price: 14.2, stock: 12, barcode: '8901234567894', requiresRx: true },
  { id: '6', name: 'Vitamin D3 1000IU', category: 'Supplements', price: 11.8, stock: 210, barcode: '8901234567895', requiresRx: false },
]

export default function POSPage() {
  const [products] = useState<POSProduct[]>(posProducts)
  const [cart, setCart] = useState<CartItem[]>([
    { ...posProducts[0], qty: 1 },
    { ...posProducts[1], qty: 2 },
  ])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('Cash')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastInvoice, setLastInvoice] = useState<any>(null)
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function addToCart(p: POSProduct) {
    const existing = cart.find((item) => item.id === p.id)
    if (existing) {
      setCart(cart.map((item) => (item.id === p.id ? { ...item, qty: item.qty + 1 } : item)))
    } else {
      setCart([...cart, { ...p, qty: 1 }])
    }
    notify(`Added ${p.name} to cart`)
  }

  function updateQty(id: string, delta: number) {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta
            return newQty > 0 ? { ...item, qty: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  function simulateBarcodeScan() {
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    addToCart(randomProduct)
    notify(`Scanned Barcode [${randomProduct.barcode}] → ${randomProduct.name}`)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const discountVal = (subtotal * discountPercent) / 100
  const tax = (subtotal - discountVal) * 0.05
  const grandTotal = subtotal - discountVal + tax

  function handleCompleteSale() {
    if (cart.length === 0) return alert('Cart is empty!')

    const invoice = {
      invoiceNo: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString(),
      items: [...cart],
      subtotal,
      discountVal,
      tax,
      grandTotal,
      paymentMethod,
      cashier: 'Alex Kim (Owner)',
    }

    setLastInvoice(invoice)
    setShowReceipt(true)

    // Trigger real-time notification
    addLiveNotification({
      title: '✓ POS Counter Sale',
      detail: `Walk-in sale ${invoice.invoiceNo} billed for ৳ ${grandTotal.toFixed(2)} via ${paymentMethod}.`,
      type: 'mint',
      link: '/owner/reports',
      avatarIcon: '🛒',
    })

    // Save to audit log
    const logs = JSON.parse(localStorage.getItem('mediflow_audit_logs') || '[]')
    logs.unshift({
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString(),
      user: 'Alex Kim',
      action: `COMPLETED_SALE_${invoice.invoiceNo}`,
      ip: '192.168.1.104',
      fingerprint: localStorage.getItem('mediflow_fingerprint') || 'fp_pos_01',
      role: 'owner',
    })
    localStorage.setItem('mediflow_audit_logs', JSON.stringify(logs.slice(0, 50)))

    // Reset cart
    setCart([])
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search) || p.category.toLowerCase().includes(search.toLowerCase())
    if (activeCategory === 'All') return matchesSearch
    return matchesSearch && p.category === activeCategory
  })

  return (
    <ModuleShell title="Point of Sale (POS)">
      <div className="pos-head">
        <div>
          <div className="eyebrow">High-Speed POS & Billing Terminal</div>
          <h1>Point of Sale (POS)</h1>
          <p>Scan barcodes, process multi-payment sales, calculate taxes, and print invoices instantly.</p>
        </div>
        <div className="pos-status">
          <span className="live-dot" /> Terminal 01 Online
          <span className="status mint">Cashier: Alex Kim</span>
        </div>
      </div>

      <div className="pos-layout">
        {/* Left Medicine Catalog & Barcode Scanner Panel */}
        <div className="panel product-panel">
          <div className="pos-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by product name, generic, or scan barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd>⌘ K</kbd>
            <button onClick={simulateBarcodeScan}>▦ Scan Barcode</button>
          </div>

          <div className="category-row">
            {['All', 'Antibiotics', 'Pain relief', 'Diabetes', 'Gastrointestinal', 'Cardiovascular', 'Supplements'].map((cat) => (
              <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((p) => (
              <button className="product-card" key={p.id} onClick={() => addToCart(p)}>
                <div className="product-art">✦</div>
                <div>
                  <b>{p.name}</b>
                  <span>
                    {p.category} {p.requiresRx && <strong style={{ color: '#8873d8' }}>· Rx</strong>}
                  </span>
                  <strong>${p.price.toFixed(2)}</strong>
                </div>
                <i>＋</i>
              </button>
            ))}
          </div>
        </div>

        {/* Right Cart & Checkout Calculations Panel */}
        <div className="panel cart-panel">
          <div className="cart-head">
            <div>
              <h2>Current Order Cart ({cart.reduce((a, c) => a + c.qty, 0)})</h2>
              <p>Walk-in Counter Sale</p>
            </div>
            <button className="dots" onClick={() => setCart([])}>
              Clear
            </button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: 12 }}>
                Cart is empty. Scan a barcode or select medicines from the catalog.
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="product-art small">✦</div>
                  <div>
                    <b>{item.name}</b>
                    <span>${item.price.toFixed(2)} / unit</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ fontSize: 14 }}>
                      -
                    </button>
                    <b style={{ fontSize: 11 }}>{item.qty}</b>
                    <button onClick={() => updateQty(item.id, 1)} style={{ fontSize: 14 }}>
                      +
                    </button>
                  </div>

                  <span style={{ fontWeight: 700, fontSize: 11, minWidth: 50, textAlign: 'right' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div style={{ margin: '14px 0' }}>
            <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {(['Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Bank'] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`filter-btn ${paymentMethod === pm ? 'active-pm' : ''}`}
                  style={{
                    background: paymentMethod === pm ? '#edf4ff' : '#fff',
                    color: paymentMethod === pm ? '#2563eb' : '#64748b',
                    borderColor: paymentMethod === pm ? '#93c5fd' : '#e2e8f0',
                    fontWeight: paymentMethod === pm ? 700 : 500,
                  }}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Discount & Totals */}
          <div className="cart-totals">
            <span>
              Subtotal <b>${subtotal.toFixed(2)}</b>
            </span>
            <span>
              Discount ({discountPercent}%)
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                style={{ fontSize: 10, padding: 2, borderRadius: 4 }}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={15}>15%</option>
              </select>
            </span>
            <span>
              VAT Tax (5%) <b>${tax.toFixed(2)}</b>
            </span>
            <strong>
              Total Amount <b>${grandTotal.toFixed(2)}</b>
            </strong>
          </div>

          <button className="checkout-btn" onClick={handleCompleteSale} disabled={cart.length === 0}>
            Complete Sale (${grandTotal.toFixed(2)}) <span>→</span>
          </button>
          <button className="hold-btn" onClick={() => notify('Order held for later processing')}>
            Hold Sale
          </button>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {showReceipt && lastInvoice && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ width: 420 }}>
            <button className="close-modal-btn" onClick={() => setShowReceipt(false)}>
              ×
            </button>

            <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ font: '800 20px Manrope', color: '#1e293b' }}>✦ NORTHSTAR PHARMACY</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>104 Health Plaza, Suite 400 · License: #PH-99201</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginTop: 8 }}>INVOICE: {lastInvoice.invoiceNo}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{lastInvoice.date}</div>
            </div>

            <div style={{ margin: '14px 0', fontSize: 11 }}>
              {lastInvoice.items.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <b>${(item.price * item.qty).toFixed(2)}</b>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 10, fontSize: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span>${lastInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Discount:</span>
                <span>-${lastInvoice.discountVal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>VAT Tax (5%):</span>
                <span>${lastInvoice.tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '800 15px Manrope', marginTop: 8, color: '#0f172a' }}>
                <span>Paid via {lastInvoice.paymentMethod}:</span>
                <span>${lastInvoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                className="primary"
                style={{ flex: 1 }}
                onClick={() => {
                  window.print()
                }}
              >
                🖨️ Print Receipt
              </button>
              <button
                className="filter-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  notify(`Invoice ${lastInvoice.invoiceNo} emailed to customer`)
                  setShowReceipt(false)
                }}
              >
                ✉️ Email Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </ModuleShell>
  )
}
