'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface MyOrder {
  id: string
  date: string
  items: string
  total: number
  status: 'Processing' | 'Out for Delivery' | 'Delivered'
}

const myOrders: MyOrder[] = [
  { id: 'ORD-8821', date: '2026-07-28', items: 'Amoxicillin 500mg × 1, Paracetamol × 2', total: 22.0, status: 'Processing' },
  { id: 'ORD-8790', date: '2026-07-15', items: 'Vitamin D3 1000IU × 2', total: 23.6, status: 'Delivered' },
  { id: 'ORD-8640', date: '2026-06-20', items: 'Omeprazole 20mg × 1', total: 9.6, status: 'Delivered' },
]

export default function CustomerOrdersPage() {
  const [orders] = useState<MyOrder[]>(myOrders)

  return (
    <RoleShell role="customer" title="My Orders">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Purchase History & Live Tracking</div>
          <h1>My Orders & Deliveries</h1>
          <p>Track active prescription orders, delivery status, and view past purchases.</p>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <h2>Order History ({orders.length})</h2>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Order ID / Date</span>
            <span>Items Purchased</span>
            <span>Total Paid</span>
            <span>Delivery Status</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {orders.map((o) => (
            <div className="table-row" key={o.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{o.id}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>{o.date}</div>
              </div>

              <span>{o.items}</span>

              <span style={{ fontWeight: 700, color: '#2563eb' }}>${o.total.toFixed(2)}</span>

              <div>
                <span className={`status ${o.status === 'Delivered' ? 'mint' : 'amber'}`}>
                  {o.status === 'Processing' ? '⏳ Processing' : '✓ Delivered'}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button className="filter-btn" style={{ background: '#edf4ff', color: '#2563eb' }}>
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleShell>
  )
}
