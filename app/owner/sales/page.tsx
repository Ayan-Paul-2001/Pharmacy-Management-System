'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import {
  getInitialOwnerStore,
  saveMedicinesStore,
  saveTransactionsStore,
  MedicineItem,
  TransactionItem,
} from '@/lib/owner-store'
import { addLiveNotification } from '@/lib/notification-store'
import {
  Search,
  ScanLine,
  Plus,
  Minus,
  ShoppingCart,
  Printer,
  Mail,
  Trash2,
  Pill,
  CheckCircle,
} from 'lucide-react'

interface CartItem extends MedicineItem {
  qty: number
}

export default function OwnerSalesPage() {
  const [products, setProducts] = useState<MedicineItem[]>([])
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('Cash')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastInvoice, setLastInvoice] = useState<any>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const store = getInitialOwnerStore()
    setProducts(store.medicines)
    setTransactions(store.transactions)
    if (store.medicines.length > 1) {
      setCart([
        { ...store.medicines[0], qty: 1 },
        { ...store.medicines[1], qty: 2 },
      ])
    }
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function addToCart(p: MedicineItem) {
    if (p.stockQuantity <= 0) {
      alert(`${p.name} is currently out of stock!`)
      return
    }
    const existing = cart.find((item) => item.id === p.id)
    if (existing) {
      if (existing.qty + 1 > p.stockQuantity) {
        alert(`Cannot add more than available stock (${p.stockQuantity})`)
        return
      }
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
            if (newQty > item.stockQuantity) {
              alert(`Cannot exceed available stock (${item.stockQuantity})`)
              return item
            }
            return newQty > 0 ? { ...item, qty: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  function simulateBarcodeScan() {
    if (products.length === 0) return
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    addToCart(randomProduct)
    notify(`Scanned Barcode [${randomProduct.barcode}] → ${randomProduct.name}`)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.sellingPrice * item.qty, 0)
  const discountVal = (subtotal * discountPercent) / 100
  const tax = (subtotal - discountVal) * 0.05
  const grandTotal = subtotal - discountVal + tax

  function handleCompleteSale() {
    if (cart.length === 0) return alert('Cart is empty!')

    const invoiceNo = 'INV-' + Math.floor(100000 + Math.random() * 900000)

    const invoice = {
      invoiceNo,
      date: new Date().toLocaleString(),
      items: [...cart],
      subtotal,
      discountVal,
      tax,
      grandTotal,
      paymentMethod,
      cashier: 'Ayan Paul (Owner)',
    }

    // Deduct stock in real time
    const updatedProducts = products.map((p) => {
      const cartMatch = cart.find((c) => c.id === p.id)
      if (cartMatch) {
        return { ...p, stockQuantity: Math.max(0, p.stockQuantity - cartMatch.qty) }
      }
      return p
    })
    setProducts(updatedProducts)
    saveMedicinesStore(updatedProducts)

    // Add transaction to store
    const newTx: TransactionItem = {
      id: invoiceNo,
      type: 'POS Sale',
      customer: 'Walk-in Customer',
      items: cart.reduce((acc, c) => acc + c.qty, 0),
      total: `৳ ${grandTotal.toFixed(2)}`,
      totalAmount: grandTotal,
      status: 'Completed',
      time: 'Just now',
      paymentMethod,
      timestamp: new Date().toISOString(),
    }

    const updatedTxs = [newTx, ...transactions]
    setTransactions(updatedTxs)
    saveTransactionsStore(updatedTxs)

    setLastInvoice(invoice)
    setShowReceipt(true)

    // Trigger real-time live notification
    addLiveNotification({
      title: '✓ POS Terminal Sale',
      detail: `Processed Invoice ${invoiceNo} for ৳ ${grandTotal.toFixed(2)} (${cart.reduce((acc, c) => acc + c.qty, 0)} items) via ${paymentMethod}.`,
      type: 'mint',
      link: '/owner/reports',
    })

    // Check for low stock alerts
    updatedProducts.forEach((p) => {
      if (p.stockQuantity <= p.reorderLevel) {
        addLiveNotification({
          title: '⚠️ Stock Warning',
          detail: `${p.name} dropped to ${p.stockQuantity} units (Reorder limit: ${p.reorderLevel}).`,
          type: 'amber',
          link: '/owner/inventory',
        })
      }
    })

    setCart([])
    notify(`Transaction ${invoiceNo} completed successfully!`)
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    if (activeCategory === 'All') return matchesSearch
    return matchesSearch && p.category === activeCategory
  })

  return (
    <RoleShell role="owner" title="Point of Sale (POS)">
      <div className="pos-head">
        <div>
          <div className="eyebrow">High-Speed Billing & Checkout Terminal</div>
          <h1>Point of Sale (POS)</h1>
          <p>Scan barcodes, process multi-channel payments, auto-calculate tax, and print receipts.</p>
        </div>
        <div className="pos-status">
          <span className="live-dot" /> Terminal 01 Active
          <span className="status mint">Cashier: Ayan Paul (Owner)</span>
        </div>
      </div>

      <div className="pos-layout">
        {/* Left Catalog & Scanner */}
        <div className="panel product-panel">
          <div className="pos-search">
            <Search size={16} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search medicine, generic name, or scan barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd>⌘ K</kbd>
            <button onClick={simulateBarcodeScan}>
              <ScanLine size={14} style={{ display: 'inline', marginRight: 6 }} />
              Scan Barcode
            </button>
          </div>

          <div className="category-row">
            {['All', 'Antibiotics', 'Pain Relief', 'Diabetes', 'Gastrointestinal', 'Cardiovascular', 'Supplements'].map((cat) => (
              <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((p) => (
              <button className="product-card" key={p.id} onClick={() => addToCart(p)}>
                <div className="product-art">
                  <Pill size={16} />
                </div>
                <div>
                  <b>{p.name}</b>
                  <span>
                    {p.category} · Qty: <strong style={{ color: '#34d399' }}>{p.stockQuantity}</strong>
                    {p.requiresPrescription && <strong style={{ color: '#a7f3d0', marginLeft: 4 }}>· Rx</strong>}
                  </span>
                  <strong>৳ {p.sellingPrice.toFixed(2)}</strong>
                </div>
                <i>
                  <Plus size={14} />
                </i>
              </button>
            ))}
          </div>
        </div>

        {/* Right Cart Panel */}
        <div className="panel cart-panel">
          <div className="cart-head">
            <div>
              <h2>Order Cart ({cart.reduce((a, c) => a + c.qty, 0)})</h2>
              <p>Walk-in Counter Sale</p>
            </div>
            <button className="filter-btn" onClick={() => setCart([])} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Trash2 size={12} />
              Clear
            </button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b', fontSize: 12 }}>
                <ShoppingCart size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                Cart is empty. Scan barcode or select medicines.
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="product-art small">
                    <Pill size={13} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <b>{item.name}</b>
                    <span>৳ {item.sellingPrice.toFixed(2)} / unit</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => updateQty(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <b style={{ fontSize: 12, minWidth: 16, textAlign: 'center' }}>{item.qty}</b>
                    <button onClick={() => updateQty(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>

                  <span style={{ fontWeight: 800, fontSize: 12, minWidth: 55, textAlign: 'right', color: '#34d399' }}>
                    ৳ {(item.sellingPrice * item.qty).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Payment Method */}
          <div style={{ margin: '14px 0' }}>
            <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Select Payment Channel
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {(['Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Bank'] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`filter-btn ${paymentMethod === pm ? 'active' : ''}`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="cart-totals">
            <span>
              Subtotal <b>৳ {subtotal.toFixed(2)}</b>
            </span>
            <span>
              Discount ({discountPercent}%)
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4 }}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={15}>15%</option>
              </select>
            </span>
            <span>
              VAT Tax (5%) <b>৳ {tax.toFixed(2)}</b>
            </span>
            <strong>
              Total Amount <b>৳ {grandTotal.toFixed(2)}</b>
            </strong>
          </div>

          <button className="checkout-btn" onClick={handleCompleteSale} disabled={cart.length === 0}>
            Complete Checkout (৳ {grandTotal.toFixed(2)}) →
          </button>
          <button className="hold-btn" onClick={() => notify('Order held for later billing')}>
            Hold Order
          </button>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {showReceipt && lastInvoice && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ width: 440 }}>
            <button className="close-modal-btn" onClick={() => setShowReceipt(false)}>
              ×
            </button>

            <div style={{ textAlign: 'center', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ font: '800 20px Manrope', color: '#ffffff' }}>✦ NORTHSTAR PHARMACY</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>104 Health Plaza, Suite 400 · License: #PH-99201</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#34d399', marginTop: 8 }}>INVOICE: {lastInvoice.invoiceNo}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{lastInvoice.date}</div>
            </div>

            <div style={{ margin: '14px 0', fontSize: 12 }}>
              {lastInvoice.items.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <b style={{ color: '#ffffff' }}>৳ {(item.sellingPrice * item.qty).toFixed(2)}</b>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal:</span>
                <span>৳ {lastInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Discount:</span>
                <span>-৳ {lastInvoice.discountVal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>VAT Tax (5%):</span>
                <span>৳ {lastInvoice.tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '800 16px Manrope', marginTop: 10, color: '#34d399' }}>
                <span>Paid via {lastInvoice.paymentMethod}:</span>
                <span>৳ {lastInvoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                className="primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => window.print()}
              >
                <Printer size={15} style={{ marginRight: 6 }} />
                Print Receipt
              </button>
              <button
                className="filter-btn"
                style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
                onClick={() => {
                  notify(`Invoice ${lastInvoice.invoiceNo} sent to customer`)
                  setShowReceipt(false)
                }}
              >
                <Mail size={15} style={{ marginRight: 6 }} />
                Email Invoice
              </button>
            </div>
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
