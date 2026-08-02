'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Truck,
  Building2,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  FileText,
  Search,
  LogOut,
  MoreHorizontal,
} from 'lucide-react'

const nav = [
  ['Overview', '/'],
  ['Inventory', '/inventory'],
  ['Point of sale', '/pos'],
  ['Orders', '/orders'],
  ['Prescriptions', '/prescriptions'],
  ['Customers', '/customers'],
  ['Suppliers', '/suppliers'],
  ['Purchases', '/purchases'],
  ['Employees', '/employees'],
  ['Reports', '/reports'],
]

function getModuleIcon(label: string) {
  switch (label) {
    case 'Overview':
      return <LayoutDashboard size={18} />
    case 'Inventory':
      return <Boxes size={18} />
    case 'Point of sale':
      return <ShoppingCart size={18} />
    case 'Orders':
    case 'Purchases':
      return <Truck size={18} />
    case 'Prescriptions':
      return <FileText size={18} />
    case 'Customers':
      return <Users size={18} />
    case 'Suppliers':
      return <Building2 size={18} />
    case 'Employees':
      return <UserCheck size={18} />
    case 'Reports':
      return <BarChart3 size={18} />
    default:
      return <LayoutDashboard size={18} />
  }
}

export function ModuleShell({ children, title, eyebrow = 'Workspace' }: { children: React.ReactNode; title: string; eyebrow?: string }) {
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [profile, setProfile] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  const notify = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2300)
  }

  useEffect(() => {
    const token = localStorage.getItem('mediflow_token')
    const userStr = localStorage.getItem('mediflow_user')
    if (!token || !userStr) {
      window.location.href = '/login?redirect=' + encodeURIComponent(pathname)
      return
    }
    setAuthorized(true)
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem('mediflow_token')
    localStorage.removeItem('mediflow_user')
    document.cookie = 'mediflow_token=; path=/; max-age=0'
    document.cookie = 'mediflow_user=; path=/; max-age=0'
    window.location.href = '/login'
  }

  if (!authorized) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 32, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 24, marginBottom: 8, fontWeight: 600 }}>🔒 Verifying Workspace Access</div>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Validating session security tokens & role permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <Link href="/" className="lazz-brand sidebar-brand">
          <span className="brand-mark-green">✦</span>
          <span className="brand-title">mediflow</span>
          <span className="model-tag">PHARMACY</span>
        </Link>

        <div className="role-switcher">
          <div className="role-orb blue">AP</div>
          <div className="role-meta">
            <b>Northstar Pharmacy</b>
            <small>Owner workspace</small>
          </div>
        </div>

        <div className="nav-label">Workspace</div>
        <nav>
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? 'nav-item active' : 'nav-item'}>
              {getModuleIcon(label)}
              <span>{label}</span>
              {label === 'Point of sale' && <em>⌘P</em>}
            </Link>
          ))}
        </nav>

        <div className="nav-label manage-label">System</div>
        <nav>
          <Link href="/notifications" className={pathname === '/notifications' ? 'nav-item active' : 'nav-item'}>
            <Bell size={18} />
            <span>Notifications</span>
            <b className="nav-badge">6</b>
          </Link>
          <Link href="/settings" className={pathname === '/settings' ? 'nav-item active' : 'nav-item'}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <HelpCircle size={18} />
            </div>
            <div>
              <b>Need help?</b>
              <span>24/7 Support Desk</span>
            </div>
            <ChevronRight size={14} className="help-arrow" />
          </div>

          <button className="user-row" onClick={() => setProfile(!profile)}>
            <div className="avatar">AP</div>
            <div>
              <b>Ayan Paul</b>
              <span>Administrator</span>
            </div>
            <MoreHorizontal size={16} className="more" />
          </button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div className="crumb">
            <span>{eyebrow}</span>
            <b>/</b>
            <strong>{title}</strong>
          </div>
          <div className="top-actions">
            <label className="search">
              <Search size={14} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button" onClick={() => notify('You’re all caught up')}>
              <Bell size={16} />
            </button>
            <button className="mini-avatar" onClick={() => setProfile(!profile)}>
              AP
            </button>
          </div>
        </header>

        <div className="module-content">{children}</div>
      </section>

      {profile && (
        <div className="profile-pop">
          <div className="avatar">AP</div>
          <b>Ayan Paul</b>
          <span>ayanpaul.pro@gmail.com</span>
          <hr />
          <button onClick={() => notify('Profile settings opened')}>Account settings</button>
          <button onClick={handleSignOut} style={{ color: '#de6870', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </main>
  )
}

export function PageIntro({ kicker, title, description, action, onAction }: { kicker: string; title: string; description: string; action: string; onAction?: () => void }) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">{kicker}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <button className="primary" onClick={onAction}>
        {action} <span>＋</span>
      </button>
    </div>
  )
}

export function DataTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="data-table">
      <div className="table-row table-head">
        {headers.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div className="table-row" key={i}>
          {row.map((cell, j) => (
            <span key={j}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export const Status = ({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) => <span className={`status ${tone}`}>{children}</span>
