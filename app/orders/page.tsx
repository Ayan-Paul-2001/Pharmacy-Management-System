'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface OnlineOrder {
  id: string
  customerName: string
  items: string
  totalAmount: number
  date: string
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Completed'
  paymentMethod: string
}

const initialOrders: OnlineOrder[] = [
  { id: 'ORD-8821', customerName: 'Sarah Mitchell', items: 'Amoxicillin 500mg × 1, Paracetamol × 2', totalAmount: 22.0, date: '2026-07-28 10:15', status: 'Pending', paymentMethod: 'bKash' },
  { id: 'ORD-8820', customerName: 'David Miller', items: 'Metformin 850mg × 2', totalAmount: 16.4, date: '2026-07-28 09:40', status: 'Preparing', paymentMethod: 'Credit Card' },
  { id: 'ORD-8819', customerName: 'Emily Watson', items: 'Vitamin D3 1000IU × 1', totalAmount: 11.8, date: '2026-07-27 16:20', status: 'Out for Delivery', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-8818', customerName: 'Robert Vance', items: 'Omeprazole 20mg × 1', totalAmount: 9.6, date: '2026-07-27 14:10', status: 'Completed', paymentMethod: 'Card' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<OnlineOrder[]>(initialOrders)
  const [toast, setToast] = useState('')

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function updateStatus(id: string, newStatus: OnlineOrder['status']) {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    notify(`Updated ${id} status to ${newStatus}`)
  }

  return (
    <RoleShell role="employee" title="Online Orders Fulfillment">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Customer E-Commerce Orders</div>
          <h1>Online Orders Management</h1>
          <p>Review incoming customer orders, pack items, attach prescription approvals, and update delivery status.</p>
        </div>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Pending Orders</span>
          <b className="amber-text">{orders.filter((o) => o.status === 'Pending').length} Action Required</b>
          <em>Needs stock verification</em>
        </div>
        <div>
          <span>Preparing / Packing</span>
          <b className="blue-text">{orders.filter((o) => o.status === 'Preparing').length} Packing</b>
          <em>In fulfillment</em>
        </div>
        <div>
          <span>Out for Delivery</span>
          <b className="mint-text">{orders.filter((o) => o.status === 'Out for Delivery').length} Dispatched</b>
          <em>En route to customer</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Active Orders List ({orders.length})</h2>
            <p>Fulfill orders sequentially</p>
          </div>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Order ID / Date</span>
            <span>Customer Name</span>
            <span>Items Ordered</span>
            <span>Total Value / Payment</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Fulfillment Action</span>
          </div>

          {orders.map((o) => (
            <div className="table-row" key={o.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{o.id}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>{o.date}</div>
              </div>

              <span style={{ fontWeight: 600 }}>{o.customerName}</span>

              <span style={{ fontSize: 11 }}>{o.items}</span>

              <div>
                <b style={{ color: '#2563eb' }}>${o.totalAmount.toFixed(2)}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>Via {o.paymentMethod}</div>
              </div>

              <div>
                <span
                  className={`status ${
                    o.status === 'Completed' ? 'mint' : o.status === 'Out for Delivery' ? 'blue' : o.status === 'Preparing' ? 'lavender' : 'amber'
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                {o.status === 'Pending' && (
                  <button className="filter-btn" style={{ background: '#edf4ff', color: '#2563eb' }} onClick={() => updateStatus(o.id, 'Preparing')}>
                    Pack Order
                  </button>
                )}

                {o.status === 'Preparing' && (
                  <button className="filter-btn" style={{ background: '#e8f8f1', color: '#35ad80' }} onClick={() => updateStatus(o.id, 'Out for Delivery')}>
                    Dispatch 🚚
                  </button>
                )}

                {o.status === 'Out for Delivery' && (
                  <button className="filter-btn" style={{ background: '#e8f8f1', color: '#35ad80' }} onClick={() => updateStatus(o.id, 'Completed')}>
                    Mark Delivered ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </RoleShell>
  )
}
