'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RoleShell, RoleIntro, PortalCard } from '@/components/RoleShell'

const mockTransactions = [
  { id: 'INV-9821', type: 'POS Sale', customer: 'Walk-in Customer', items: 3, total: '$48.50', status: 'Completed', time: '10 min ago' },
  { id: 'INV-9820', type: 'Online Order', customer: 'Sarah Mitchell', items: 2, total: '$34.20', status: 'Processing', time: '24 min ago' },
  { id: 'PO-4402', type: 'Supplier Purchase', customer: 'AstraZeneca Pharma', items: 150, total: '$3,850.00', status: 'Received', time: '1 hr ago' },
  { id: 'INV-9819', type: 'POS Sale', customer: 'David Miller', items: 5, total: '$112.00', status: 'Completed', time: '2 hrs ago' },
]

export default function OwnerDashboard() {
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today')

  return (
    <RoleShell role="owner" title="Dashboard">
      <RoleIntro
        kicker="Owner Room · Executive Overview"
        title="Good morning, Alex Kim ✦"
        description="Comprehensive real-time view of Northstar Pharmacy performance, sales, inventory alerts, and pending tasks."
        action="Generate Daily Executive Report"
      />

      {/* Primary Financial & Operational KPI Cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Today's Sales Revenue</span>
            <span className="trend mint">↗ +14.2%</span>
          </div>
          <strong>$12,840.50</strong>
          <div className="metric-bottom">
            <span>184 Transactions processed today</span>
            <span style={{ color: '#35ad80' }}>$69.78 avg invoice</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Net Profit Margin (Est.)</span>
            <span className="trend blue">↗ 28.4%</span>
          </div>
          <strong>$3,646.70</strong>
          <div className="metric-bottom">
            <span>Cost of Goods: $9,193.80</span>
            <span>Tax Collected: $1,027.20</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Inventory Valuation</span>
            <span className="trend amber">42 Reorders needed</span>
          </div>
          <strong>$84,290.00</strong>
          <div className="metric-bottom">
            <span>1,248 SKUs in stock</span>
            <span style={{ color: '#de6870' }}>18 Expiring within 30 days</span>
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
              <span>$15k</span>
              <span>$10k</span>
              <span>$5k</span>
              <span>$0</span>
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
            <button className="dots">•••</button>
          </div>

          <div className="donut-wrap">
            <div className="donut">
              <div>
                <b>1,248</b>
                <span>Total Items</span>
              </div>
            </div>
            <div className="legend">
              <div>
                <span className="dot in" /> Optimal Stock <b>1,188 (95%)</b>
              </div>
              <div>
                <span className="dot low" /> Low Stock Warning <b>42 (3.4%)</b>
              </div>
              <div>
                <span className="dot out" /> Expiring / Out <b>18 (1.6%)</b>
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
            {mockTransactions.map((tx) => (
              <div className="activity-row" key={tx.id}>
                <div className={`activity-icon ${tx.type.includes('POS') ? 'blue' : tx.type.includes('Purchase') ? 'amber' : 'mint'}`}>
                  {tx.type.includes('POS') ? '＋' : tx.type.includes('Purchase') ? '▱' : '♡'}
                </div>
                <div className="activity-name">
                  <b>{tx.id} · {tx.customer}</b>
                  <span>{tx.type} ({tx.items} items)</span>
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
            <p>Direct room shortcuts</p>
          </div>

          <div className="quick-actions">
            <Link href="/owner/inventory">
              <button>
                <div className="quick-icon blue">◇</div>
                <div>
                  <b>Inventory & Medicine Database</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>1,248 medicines · 42 reorders</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/owner/sales">
              <button>
                <div className="quick-icon mint">＋</div>
                <div>
                  <b>Point of Sale Terminal</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Scan barcode & process sale</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/owner/prescriptions">
              <button>
                <div className="quick-icon lavender">▤</div>
                <div>
                  <b>Prescription Review Queue</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>12 pending approvals</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/owner/reports">
              <button>
                <div className="quick-icon blue">⌁</div>
                <div>
                  <b>Financial & Expiry Analytics</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Export CSV reports</span>
                </div>
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </RoleShell>
  )
}
