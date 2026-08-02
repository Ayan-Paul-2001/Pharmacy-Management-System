'use client'

import { useEffect, useState } from 'react'
import { RoleShell } from '@/components/RoleShell'
import { getInitialOwnerStore, savePurchasesStore, PurchaseOrder } from '@/lib/owner-store'

export default function OwnerPurchasesPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const [poSupplier, setPoSupplier] = useState('GSK Pharmaceuticals')
  const [poQty, setPoQty] = useState(100)
  const [poAmount, setPoAmount] = useState(2500)

  useEffect(() => {
    const store = getInitialOwnerStore()
    setOrders(store.purchases)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateAndSavePurchases(newOrders: PurchaseOrder[]) {
    setOrders(newOrders)
    savePurchasesStore(newOrders)
  }

  function handleCreatePO(e: React.FormEvent) {
    e.preventDefault()
    const newPO: PurchaseOrder = {
      id: 'PO-' + Math.floor(1000 + Math.random() * 9000),
      supplier: poSupplier,
      itemsCount: Number(poQty),
      total: Number(poAmount),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    }
    const updated = [newPO, ...orders]
    updateAndSavePurchases(updated)
    notify(`Created Purchase Order ${newPO.id}`)
    setShowAddModal(false)
  }

  function markReceived(id: string) {
    const updated = orders.map((o) => (o.id === id ? { ...o, status: 'Received' as const } : o))
    updateAndSavePurchases(updated)
    notify(`Marked ${id} as Received & updated stock inventory`)
  }

  return (
    <RoleShell role="owner" title="Supplier Purchases">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Stock Procurement & Purchase Orders</div>
          <h1>Purchases & Stock Receiving</h1>
          <p>Create purchase orders, receive medicine shipments from suppliers, and verify invoices.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          Create Purchase Order <span>＋</span>
        </button>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Total Purchase Orders</span>
          <b>{orders.length} Orders</b>
          <em>Procurement log</em>
        </div>
        <div>
          <span>Received Deliveries</span>
          <b className="blue-text">{orders.filter((o) => o.status === 'Received').length} Completed</b>
          <em>Stock updated</em>
        </div>
        <div>
          <span>Total Purchase Spend</span>
          <b>৳{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</b>
          <em>Vendor outlay</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Purchase Orders Log ({orders.length})</h2>
            <p>Procurement records and stock delivery confirmation status</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>PO Number / Date</span>
            <span>Supplier Company</span>
            <span>Units / Items</span>
            <span>Total Value</span>
            <span>Delivery Status</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {orders.map((o) => (
            <div className="table-row" key={o.id}>
              <div>
                <b style={{ color: '#ffffff' }}>{o.id}</b>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Ordered: {o.date}</div>
              </div>

              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{o.supplier}</span>

              <span style={{ color: '#cbd5e1' }}>{o.itemsCount} units</span>

              <span style={{ fontWeight: 700, color: '#34d399' }}>৳{o.total.toLocaleString()}</span>

              <div>
                {o.status === 'Received' ? (
                  <span className="status mint">✓ Received</span>
                ) : o.status === 'Ordered' ? (
                  <span className="status blue">🚚 In Transit</span>
                ) : (
                  <span className="status amber">⏳ Pending Delivery</span>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                {o.status !== 'Received' && (
                  <button className="filter-btn" style={{ background: '#eaf2ff', color: '#2563eb' }} onClick={() => markReceived(o.id)}>
                    Receive Delivery
                  </button>
                )}
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
            <h2>New Purchase Order</h2>
            <p>Order stock batches from authorized distributors.</p>

            <form onSubmit={handleCreatePO}>
              <label style={{ fontSize: 11, color: '#475569' }}>
                Select Supplier
                <select
                  value={poSupplier}
                  onChange={(e) => setPoSupplier(e.target.value)}
                  style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                >
                  <option value="GSK Pharmaceuticals">GSK Pharmaceuticals</option>
                  <option value="AstraZeneca Bangladesh">AstraZeneca Bangladesh</option>
                  <option value="Bayer Healthcare">Bayer Healthcare</option>
                  <option value="Square Pharmaceuticals">Square Pharmaceuticals</option>
                </select>
              </label>

              <div className="form-two" style={{ marginTop: 10 }}>
                <label style={{ fontSize: 11, color: '#475569' }}>
                  Total Quantity (units)
                  <input
                    type="number"
                    required
                    value={poQty}
                    onChange={(e) => setPoQty(Number(e.target.value))}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 11, color: '#475569' }}>
                  Estimated Invoice Total ($)
                  <input
                    type="number"
                    required
                    value={poAmount}
                    onChange={(e) => setPoAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: 9, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                  />
                </label>
              </div>

              <button className="primary" style={{ width: '100%', marginTop: 18 }}>
                Issue Purchase Order
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
