'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RoleShell, RoleIntro } from '@/components/RoleShell'

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Verify 3 pending doctor prescriptions in queue', done: false },
    { id: 2, text: 'Process online order #ORD-8821 for pickup', done: true },
    { id: 3, text: 'Restock Amoxicillin 500mg from warehouse', done: false },
    { id: 4, text: 'Perform end-of-shift register drawer count', done: false },
  ])

  function toggleTask(id: number) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <RoleShell role="employee" title="Shift Dashboard">
      <RoleIntro
        kicker="Employee Room · Operational Workspace"
        title="Good day, Jordan Lee ✦"
        description="Your active shift tasks, fast POS launcher, prescription queue, and low-stock alerts."
        action="Open POS Terminal"
      />

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Today's Counter Sales</span>
            <span className="trend mint">↗ 42 Transactions</span>
          </div>
          <strong>$3,240.00</strong>
          <div className="metric-bottom">
            <span>Shift Register 01</span>
            <span style={{ color: '#35ad80' }}>$77.14 avg invoice</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Pending Prescriptions</span>
            <span className="trend amber">3 Verification needed</span>
          </div>
          <strong>3 Items</strong>
          <div className="metric-bottom">
            <span>Doctor verification required</span>
            <Link href="/employee/prescriptions" style={{ color: '#2563eb', fontWeight: 600 }}>
              Review queue →
            </Link>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Online Orders Queue</span>
            <span className="trend blue">2 Pending pickup</span>
          </div>
          <strong>4 Orders</strong>
          <div className="metric-bottom">
            <span>Ready to pack</span>
            <Link href="/employee/orders" style={{ color: '#2563eb', fontWeight: 600 }}>
              View orders →
            </Link>
          </div>
        </div>
      </div>

      <div className="main-grid">
        {/* Quick Operational Launchers */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Operational Tools</h2>
              <p>Launch key shift workflows</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link href="/employee/pos">
              <button>
                <div className="quick-icon mint">＋</div>
                <div>
                  <b>Launch Point of Sale (POS)</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Barcode scanning & instant billing</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/employee/orders">
              <button>
                <div className="quick-icon blue">◌</div>
                <div>
                  <b>Fulfill Online Customer Orders</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Pack and update order statuses</span>
                </div>
                <span>→</span>
              </button>
            </Link>

            <Link href="/employee/prescriptions">
              <button>
                <div className="quick-icon lavender">▤</div>
                <div>
                  <b>Verify Prescriptions</b>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Doctor document validation</span>
                </div>
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Shift Tasks Checklist */}
        <div className="panel">
          <div className="panel-head">
            <h2>Shift Tasks Checklist</h2>
            <p>
              {tasks.filter((t) => t.done).length} / {tasks.length} Completed
            </p>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((t) => (
              <label
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 12,
                  padding: '8px 10px',
                  background: t.done ? '#f8fafc' : '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textDecoration: t.done ? 'line-through' : 'none',
                  color: t.done ? '#94a3b8' : '#1e293b',
                }}
              >
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <span>{t.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </RoleShell>
  )
}
