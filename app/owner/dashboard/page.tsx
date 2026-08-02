'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RoleShell, RoleIntro } from '@/components/RoleShell'
import { getInitialOwnerStore, TransactionItem, MedicineItem } from '@/lib/owner-store'

export default function OwnerDashboard() {
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today')
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    const store = getInitialOwnerStore()
    setTransactions(store.transactions)
    setMedicines(store.medicines)
  }, [])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  // Calculated KPI stats from store
  const totalRevenue = transactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0)
  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length
  const inventoryValue = medicines.reduce((acc, m) => acc + m.stockQuantity * m.sellingPrice, 0)
  const totalSKUs = medicines.reduce((acc, m) => acc + m.stockQuantity, 0)

  return (
    <RoleShell role="owner" title="Executive Dashboard">
      <RoleIntro
        kicker="Owner Workspace · Executive Overview"
        title="Welcome Back, Ayan Paul ✦"
        description="Real-time analytics for Northstar Pharmacy, sales revenue, inventory health, and management portals."
        action="Generate Executive Summary"
      />

      {/* Primary Financial & Operational KPI Cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Sales Revenue</span>
            <span className="trend mint">↗ Live Sync</span>
          </div>
          <strong>৳{totalRevenue > 0 ? totalRevenue.toFixed(2) : '12,840.50'}</strong>
          <div className="metric-bottom">
            <span>{transactions.length} Transactions processed</span>
            <span style={{ color: '#34d399' }}>
              ৳{transactions.length > 0 ? (totalRevenue / transactions.length).toFixed(2) : '69.78'} avg order
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Net Profit Margin (Est.)</span>
            <span className="trend blue">↗ 28.4%</span>
          </div>
          <strong>৳{(totalRevenue * 0.284 || 3646.7).toFixed(2)}</strong>
          <div className="metric-bottom">
            <span>Est. COGS: ৳{(totalRevenue * 0.716 || 9193.8).toFixed(2)}</span>
            <span>VAT Collected: ৳{(totalRevenue * 0.05 || 642.0).toFixed(2)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Inventory Stock Valuation</span>
            <span className="trend amber">{lowStockCount} Reorders Alert</span>
          </div>
          <strong>৳{inventoryValue > 0 ? inventoryValue.toFixed(2) : '84,290.00'}</strong>
          <div className="metric-bottom">
            <span>{totalSKUs > 0 ? totalSKUs : 1248} Units in stock</span>
            <span style={{ color: '#de6870' }}>{lowStockCount} SKUs below reorder limit</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="main-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Sales & Revenue Performance</h2>
              <p>Comparison of gross revenue over selected time period</p>
            </div>
            <div className="segmented">
              <button className={range === 'today' ? 'selected' : ''} onClick={() => setRange('today')}>
                Today
              </button>
              <button className={range === 'week' ? 'selected' : ''} onClick={() => setRange('week')}>
                7 Days
              </button>
              <button className={range === 'month' ? 'selected' : ''} onClick={() => setRange('month')}>
                30 Days
              </button>
            </div>
          </div>

          <div className="chart-wrap">
            <div className="y-axis">
              <span>৳15k</span>
              <span>৳10k</span>
              <span>৳5k</span>
              <span>৳0</span>
            </div>
            <div className="chart">
              <div className="grid-lines">
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4d8ef7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4d8ef7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,140 Q70,90 140,110 T280,40 T420,70 T500,20 L500,180 L0,180 Z" className="area" fill="url(#areaGrad)" />
                <path d="M0,140 Q70,90 140,110 T280,40 T420,70 T500,20" className="line" />
                <circle cx="280" cy="40" r="5" />
                <circle cx="500" cy="20" r="5" />
              </svg>
              <div className="x-axis">
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>18:00</span>
                <span>20:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Breakdown Donut */}
        <div className="panel stock-panel">
          <div className="panel-head">
            <h2>Inventory Stock Health</h2>
            <button className="dots" onClick={() => notify('Stock health synced with inventory database')}>•••</button>
          </div>

          <div className="donut-wrap">
            <div className="donut">
              <div>
                <b>{medicines.length}</b>
                <span>Catalog SKUs</span>
              </div>
            </div>
            <div className="legend">
              <div>
                <span className="dot in" /> Optimal Stock <b>{medicines.length - lowStockCount} SKUs</b>
              </div>
              <div>
                <span className="dot low" /> Low Stock Warning <b>{lowStockCount} SKUs</b>
              </div>
              <div>
                <span className="dot out" /> Rx Controlled <b>{medicines.filter((m) => m.requiresPrescription).length} SKUs</b>
              </div>
            </div>
          </div>

          <Link href="/owner/inventory" className="text-link">
            Manage complete catalog <span>→</span>
          </Link>
        </div>
      </div>

      {/* Lower Operations & Recent Transactions Grid */}
      <div className="lower-grid">
        <div className="panel activity-panel">
          <div className="panel-head">
            <div>
              <h2>Recent Business Activity & Invoices</h2>
              <p>Live feed of sales transactions, purchases, and order statuses</p>
            </div>
            <Link href="/owner/sales" className="text-link">
              View all sales <span>→</span>
            </Link>
          </div>

          <div className="activity-list">
            {transactions.slice(0, 6).map((tx) => (
              <div className="activity-row" key={tx.id}>
                <div className={`activity-icon ${tx.type.includes('POS') ? 'blue' : tx.type.includes('Purchase') ? 'amber' : 'mint'}`}>
                  {tx.type.includes('POS') ? '＋' : tx.type.includes('Purchase') ? '▱' : '♡'}
                </div>
                <div className="activity-name">
                  <b>{tx.id} · {tx.customer}</b>
                  <span>{tx.type} ({tx.items} items) · {tx.paymentMethod || 'Cash'}</span>
                </div>
                <strong>{tx.total}</strong>
                <time>{tx.time}</time>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Action Cards */}
        <div className="panel">
          <div className="panel-head">
            <h2>Management Portals</h2>
            <p>Direct workspace shortcuts</p>
          </div>

          <div className="quick-actions">
            <Link href="/owner/inventory">
              <button>
                <div className="quick-icon blue">◇</div>
                <div>
                  <b>Inventory & Medicine Database</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{medicines.length} cataloged SKUs · {lowStockCount} reorders alert</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/owner/sales">
              <button>
                <div className="quick-icon mint">＋</div>
                <div>
                  <b>Point of Sale Terminal</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Scan barcode & process walk-in sale</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/owner/prescriptions">
              <button>
                <div className="quick-icon lavender">▤</div>
                <div>
                  <b>Prescription Review Queue</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Verify doctor prescription approvals</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/owner/reports">
              <button>
                <div className="quick-icon blue">⌁</div>
                <div>
                  <b>Financial & Expiry Analytics</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Revenue breakdown & CSV export</span>
                </div>
                <span>→</span>
              </button>
            </Link>
          </div>
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
