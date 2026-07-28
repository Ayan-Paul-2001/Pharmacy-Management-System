'use client'

import { useState } from 'react'
import { RoleShell } from '@/components/RoleShell'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  loyaltyTier: 'Gold' | 'Silver' | 'Bronze'
  rewardPoints: number
  status: 'Active' | 'Disabled'
}

const initialCustomers: Customer[] = [
  { id: 'CUST-301', name: 'Sarah Mitchell', email: 'sarah.mitchell@email.com', phone: '+1 (555) 982-1029', totalOrders: 24, totalSpent: 1240.5, loyaltyTier: 'Gold', rewardPoints: 240, status: 'Active' },
  { id: 'CUST-302', name: 'David Miller', email: 'david.miller@email.com', phone: '+1 (555) 321-4567', totalOrders: 12, totalSpent: 680.0, loyaltyTier: 'Silver', rewardPoints: 120, status: 'Active' },
  { id: 'CUST-303', name: 'Emily Watson', email: 'emily.watson@email.com', phone: '+1 (555) 654-9870', totalOrders: 5, totalSpent: 195.2, loyaltyTier: 'Bronze', rewardPoints: 35, status: 'Active' },
]

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers)
  const [search, setSearch] = useState('')

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  return (
    <RoleShell role="owner" title="Customer Accounts">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Customer Directory & Loyalty Program</div>
          <h1>Customer Profiles</h1>
          <p>View registered pharmacy accounts, purchase histories, prescription logs, and loyalty tiers.</p>
        </div>
      </div>

      <div className="stat-strip three">
        <div>
          <span>Total Registered Clients</span>
          <b>{customers.length} Accounts</b>
          <em>Registered active members</em>
        </div>
        <div>
          <span>Gold Tier Members</span>
          <b className="amber-text">{customers.filter((c) => c.loyaltyTier === 'Gold').length} Gold</b>
          <em>High-value customers</em>
        </div>
        <div>
          <span>Total Client Spending</span>
          <b>${customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}</b>
          <em>Lifetime revenue generated</em>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Client Accounts ({filtered.length})</h2>
            <p>Filter by name, phone number, or reward tier</p>
          </div>
          <input
            type="text"
            className="table-search"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <span>Customer Name / ID</span>
            <span>Contact Details</span>
            <span>Orders / Spent</span>
            <span>Loyalty Tier</span>
            <span>Reward Points</span>
            <span style={{ textAlign: 'right' }}>Status</span>
          </div>

          {filtered.map((c) => (
            <div className="table-row" key={c.id}>
              <div>
                <b style={{ color: '#1e293b' }}>{c.name}</b>
                <div style={{ fontSize: 10, color: '#64748b' }}>ID: {c.id}</div>
              </div>

              <div>
                <span>{c.email}</span>
                <div style={{ fontSize: 10, color: '#64748b' }}>{c.phone}</div>
              </div>

              <div>
                <b>{c.totalOrders} Orders</b>
                <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 600 }}>${c.totalSpent.toFixed(2)}</div>
              </div>

              <div>
                <span
                  className="status"
                  style={{
                    background: c.loyaltyTier === 'Gold' ? '#fff5df' : c.loyaltyTier === 'Silver' ? '#f1f5f9' : '#e2e8f0',
                    color: c.loyaltyTier === 'Gold' ? '#d39a32' : '#475569',
                    fontWeight: 700,
                  }}
                >
                  ★ {c.loyaltyTier} Tier
                </span>
              </div>

              <b style={{ color: '#0f172a' }}>{c.rewardPoints} pts</b>

              <div style={{ textAlign: 'right' }}>
                <span className="status mint">✓ Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleShell>
  )
}
