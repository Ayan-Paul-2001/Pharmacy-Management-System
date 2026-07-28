'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface PurchaseOrder {
  poNumber: string
  supplier: string
  itemsCount: number
  totalAmount: number
  orderDate: string
  deliveryDate: string
  status: 'Received' | 'Pending' | 'In Transit'
}

const initialOrders: PurchaseOrder[] = [
  { poNumber: 'PO-9801', supplier: 'GSK Pharmaceuticals', itemsCount: 200, totalAmount: 4850.0, orderDate: '2026-07-20', deliveryDate: '2026-07-22', status: 'Received' },
  { poNumber: 'PO-9802', supplier: 'AstraZeneca Global', itemsCount: 150, totalAmount: 3200.0, orderDate: '2026-07-24', deliveryDate: '2026-07-27', status: 'Received' },
  { poNumber: 'PO-9803', supplier: 'Pfizer Supplies', itemsCount: 400, totalAmount: 12500.0, orderDate: '2026-07-27', deliveryDate: '2026-07-30', status: 'In Transit' },
]

export default function PurchasesPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')

  const [poSupplier, setPoSupplier] = useState('GSK Pharmaceuticals')
  const [poQty, setPoQty] = useState(100)
  const [poAmount, setPoAmount] = useState(2500)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleCreatePO(e: React.FormEvent) {
    e.preventDefault()
    const newPO: PurchaseOrder = {
      poNumber: 'PO-' + Math.floor(1000 + Math.random() * 9000),
      supplier: poSupplier,
      itemsCount: Number(poQty),
      totalAmount: Number(poAmount),
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: 'Pending Delivery',
      status: 'Pending',
    }
    setOrders([newPO, ...orders])
    notify(`Created Purchase Order ${newPO.poNumber}`)
    setShowAddModal(false)
  }

  function markReceived(poNumber: string) {
    setOrders(orders.map((o) => (o.poNumber === poNumber ? { ...o, status: 'Received', deliveryDate: 'Today' } : o)))
    notify(`Marked ${poNumber} as Received & updated inventory stock`)
  }

  return (
    <RoleShell role="owner" title="Purchases & Deliveries">
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
          <span>Pending Shipments</span>
          <b className="amber-text">{orders.filter((o) => o.status !== 'Received').length} In Transit</b>
          <em>Awaiting verification</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Purchase Orders Log ({orders.length})</h2>
            <p>Track purchase invoices and inventory batch arrivals</p>
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
            <div className="table-row" key={o.poNumber}>
              <div>
                <b style={{ color: '#1e293b' }}>{o.poNumber}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>Ordered: {o.orderDate}</div>
              </div>

              <span style={{ fontWeight: 600 }}>{o.supplier}</span>

              <span>{o.itemsCount} units</span>

              <span style={{ fontWeight: 700, color: '#2563eb' }}>${o.totalAmount.toLocaleString()}</span>

              <div>
                {o.status === 'Received' ? (
                  <span className="status mint">✓ Received</span>
                ) : o.status === 'In Transit' ? (
                  <span className="status blue">🚚 In Transit</span>
                ) : (
                  <span className="status amber">⏳ Pending Delivery</span>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                {o.status !== 'Received' && (
                  <button className="filter-btn" style={{ background: '#eaf2ff', color: '#2563eb' }} onClick={() => markReceived(o.poNumber)}>
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
                  <option value="AstraZeneca Global">AstraZeneca Global</option>
                  <option value="Pfizer Supplies">Pfizer Supplies</option>
                  <option value="Sun Pharma Lab">Sun Pharma Lab</option>
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
