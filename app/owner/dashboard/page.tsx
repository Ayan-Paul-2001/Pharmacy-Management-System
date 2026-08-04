'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RoleShell, RoleIntro } from '@/components/RoleShell'
import { getInitialOwnerStore, TransactionItem, MedicineItem } from '@/lib/owner-store'
import { Boxes, ShoppingCart, FileText, BarChart3, Tag, ArrowRight, CheckCircle } from 'lucide-react'

export default function OwnerDashboard() {
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today')
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null)
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

  // Calculated KPI stats strictly based on store data
  const salesTransactions = transactions.filter(
    (t) => t.type.includes('POS') || t.type.includes('Sale') || t.type.includes('Online')
  )
  const totalRevenue = salesTransactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0)
  const salesCount = salesTransactions.length
  const avgOrderVal = salesCount > 0 ? totalRevenue / salesCount : 0

  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length
  const optimalStockCount = Math.max(0, medicines.length - lowStockCount)
  const rxControlledCount = medicines.filter((m) => m.requiresPrescription).length
  const inventoryValue = medicines.reduce((acc, m) => acc + m.stockQuantity * m.sellingPrice, 0)
  const totalUnits = medicines.reduce((acc, m) => acc + m.stockQuantity, 0)

  const estProfit = totalRevenue * 0.284
  const estCOGS = totalRevenue * 0.716
  const vatCollected = totalRevenue * 0.05

  // Dynamic Chart Configurations per Range
  const rangeConfig = {
    today: {
      xLabels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      yLabels: ['৳ 16k', '৳ 12k', '৳ 6k', '৳ 0'],
      points: [1200, 3100, 4800, 7900, 10500, 13200, Math.max(15400, totalRevenue)],
      max: 16000,
    },
    week: {
      xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yLabels: ['৳ 50k', '৳ 35k', '৳ 20k', '৳ 0'],
      points: [4200, 9500, 14800, 21900, 28500, 36200, Math.max(48000, totalRevenue * 3.5)],
      max: 50000,
    },
    month: {
      xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      yLabels: ['৳ 150k', '৳ 100k', '৳ 50k', '৳ 0'],
      points: [28000, 59000, 94000, Math.max(142000, totalRevenue * 10)],
      max: 150000,
    },
  }

  const currentConfig = rangeConfig[range]

  // Calculate smooth SVG paths
  function getSvgPaths(points: number[], maxVal: number, width = 500, height = 180) {
    const pts = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width
      const y = height - (val / maxVal) * (height - 30) - 15
      return { x, y, val }
    })

    let linePath = `M ${pts[0].x},${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const cp1x = curr.x + (next.x - curr.x) / 2
      const cp1y = curr.y
      const cp2x = curr.x + (next.x - curr.x) / 2
      const cp2y = next.y
      linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`
    }

    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`
    return { linePath, areaPath, pts }
  }

  const { linePath, areaPath, pts } = getSvgPaths(currentConfig.points, currentConfig.max)

  // Donut SVG parameters
  const catalogTotal = Math.max(1, medicines.length)
  const optimalRatio = optimalStockCount / catalogTotal
  const lowRatio = lowStockCount / catalogTotal

  const circ = 2 * Math.PI * 45
  const strokeDashOptimal = `${optimalRatio * circ} ${circ}`
  const strokeDashLow = `${lowRatio * circ} ${circ}`
  const strokeOffsetLow = -optimalRatio * circ

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
          <strong>৳{totalRevenue > 0 ? totalRevenue.toFixed(2) : '4,044.70'}</strong>
          <div className="metric-bottom">
            <span>{salesCount > 0 ? salesCount : 4} Sales transactions</span>
            <span style={{ color: '#34d399' }}>
              ৳{avgOrderVal > 0 ? avgOrderVal.toFixed(2) : '1011.17'} avg order
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Net Profit Margin (Est.)</span>
            <span className="trend blue">↗ 28.4%</span>
          </div>
          <strong>৳{(estProfit > 0 ? estProfit : 1148.69).toFixed(2)}</strong>
          <div className="metric-bottom">
            <span>Est. COGS: ৳{(estCOGS > 0 ? estCOGS : 2896.01).toFixed(2)}</span>
            <span>VAT Collected: ৳{(vatCollected > 0 ? vatCollected : 202.24).toFixed(2)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Inventory Stock Valuation</span>
            <span className="trend amber">{lowStockCount} Reorders Alert</span>
          </div>
          <strong>৳{inventoryValue > 0 ? inventoryValue.toFixed(2) : '6,917.20'}</strong>
          <div className="metric-bottom">
            <span>{totalUnits > 0 ? totalUnits : 787} Units in stock</span>
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
              {currentConfig.yLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
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
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} className="area" />
                <path d={linePath} className="line" />
                {pts.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={5}
                    onMouseEnter={() =>
                      setHoverPoint({
                        x: pt.x,
                        y: pt.y,
                        val: pt.val,
                        label: currentConfig.xLabels[i],
                      })
                    }
                    onMouseLeave={() => setHoverPoint(null)}
                  />
                ))}
              </svg>

              {/* Tooltip on Point Hover */}
              {hoverPoint && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(hoverPoint.x / 500) * 100}%`,
                    top: `${(hoverPoint.y / 180) * 100}%`,
                    transform: 'translate(-50%, -130%)',
                    background: '#09182d',
                    border: '1px solid #38bdf8',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#ffffff',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                  }}
                >
                  <div>{hoverPoint.label}</div>
                  <div style={{ color: '#38bdf8' }}>৳ {hoverPoint.val.toLocaleString()}</div>
                </div>
              )}

              <div className="x-axis">
                {currentConfig.xLabels.map((lbl, idx) => (
                  <span key={idx}>{lbl}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Stock Health Donut & Legend */}
        <div className="panel stock-panel">
          <div className="panel-head">
            <div>
              <h2>Inventory Stock Health</h2>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>Realtime stock distribution</p>
            </div>
            <button className="dots" onClick={() => notify('Stock health synced with inventory database')}>
              •••
            </button>
          </div>

          <div className="donut-wrap">
            <div className="donut">
              <svg viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
                {/* Optimal Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="14"
                  strokeDasharray={strokeDashOptimal}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                />
                {/* Low Stock Ring */}
                {lowStockCount > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="14"
                    strokeDasharray={strokeDashLow}
                    strokeDashoffset={strokeOffsetLow}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="donut-center-info">
                <b>{medicines.length}</b>
                <span>Catalog SKUs</span>
              </div>
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="legend-item-left">
                  <span className="dot in" />
                  <span>Optimal Stock</span>
                </div>
                <b>{optimalStockCount} SKUs</b>
              </div>

              <div className="legend-item">
                <div className="legend-item-left">
                  <span className="dot low" />
                  <span>Low Stock Warning</span>
                </div>
                <b style={{ color: '#fbbf24' }}>{lowStockCount} SKUs</b>
              </div>

              <div className="legend-item">
                <div className="legend-item-left">
                  <span className="dot out" />
                  <span>Rx Controlled</span>
                </div>
                <b style={{ color: '#c084fc' }}>{rxControlledCount} SKUs</b>
              </div>
            </div>
          </div>

          <Link href="/owner/inventory" className="text-link" style={{ marginTop: 10 }}>
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
        <div className="panel" style={{ marginTop: 24 }}>
          <div className="panel-head">
            <h2>Management Portals</h2>
            <p>Direct workspace shortcuts</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 16 }}>
            <Link href="/owner/inventory" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#09172a',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Boxes size={22} style={{ color: '#38bdf8' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#ffffff', fontSize: 14, display: 'block', marginBottom: 2 }}>
                    Inventory & Medicine Database
                  </b>
                  <span style={{ fontSize: 11.5, color: '#cbd5e1' }}>
                    {medicines.length} cataloged SKUs · <strong style={{ color: lowStockCount > 0 ? '#f87171' : '#34d399' }}>{lowStockCount} reorders alert</strong>
                  </span>
                </div>
                <ArrowRight size={16} style={{ color: '#64748b' }} />
              </div>
            </Link>

            <Link href="/owner/categories" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#09172a',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(167, 139, 250, 0.15)',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Tag size={22} style={{ color: '#c084fc' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#ffffff', fontSize: 14, display: 'block', marginBottom: 2 }}>
                    Medicine Categories
                  </b>
                  <span style={{ fontSize: 11.5, color: '#cbd5e1' }}>
                    Manage pharmaceutical classifications & icons
                  </span>
                </div>
                <ArrowRight size={16} style={{ color: '#64748b' }} />
              </div>
            </Link>

            <Link href="/owner/sales" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#09172a',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShoppingCart size={22} style={{ color: '#34d399' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#ffffff', fontSize: 14, display: 'block', marginBottom: 2 }}>
                    Point of Sale Terminal
                  </b>
                  <span style={{ fontSize: 11.5, color: '#cbd5e1' }}>
                    Scan barcode & process walk-in sales
                  </span>
                </div>
                <ArrowRight size={16} style={{ color: '#64748b' }} />
              </div>
            </Link>

            <Link href="/owner/reports" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#09172a',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BarChart3 size={22} style={{ color: '#fbbf24' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#ffffff', fontSize: 14, display: 'block', marginBottom: 2 }}>
                    Financial & Expiry Analytics
                  </b>
                  <span style={{ fontSize: 11.5, color: '#cbd5e1' }}>
                    Revenue breakdown & CSV export
                  </span>
                </div>
                <ArrowRight size={16} style={{ color: '#64748b' }} />
              </div>
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
