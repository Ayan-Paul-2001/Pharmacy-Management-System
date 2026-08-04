'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import {
  getInitialOwnerStore,
  MedicineItem,
  TransactionItem,
  PrescriptionQueueItem,
  CustomerRecord,
} from '@/lib/owner-store'
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')
  const [profile, setProfile] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const list: Array<{
      title: string
      detail: string
      category: string
      link: string
      icon: string
      badgeBg?: string
      badgeColor?: string
    }> = []

    const store = typeof window !== 'undefined' ? getInitialOwnerStore() : null

    // 1. Navigation items
    nav.forEach(([label, href]) => {
      if (!q || label.toLowerCase().includes(q)) {
        list.push({
          title: label,
          detail: `Navigate to ${label}`,
          category: 'Navigation',
          link: href,
          icon: '🔗',
          badgeBg: 'rgba(52, 211, 153, 0.15)',
          badgeColor: '#34d399',
        })
      }
    })

    if (!store) return list

    // 2. Medicines & Catalog (Partial matching on name, generic, brand, category, barcode)
    store.medicines.forEach((m: MedicineItem) => {
      if (
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.barcode.includes(q) ||
        m.id.toLowerCase().includes(q)
      ) {
        list.push({
          title: m.name,
          detail: `${m.category} · ৳ ${m.sellingPrice.toFixed(2)} · Stock: ${m.stockQuantity} units (${m.genericName})`,
          category: 'Medicine',
          link: '/inventory',
          icon: '💊',
          badgeBg: 'rgba(56, 189, 248, 0.15)',
          badgeColor: '#38bdf8',
        })
      }
    })

    // 3. Transactions & Invoices
    store.transactions.forEach((t: TransactionItem) => {
      if (
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.total.toLowerCase().includes(q) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q))
      ) {
        list.push({
          title: `${t.id} - ${t.customer}`,
          detail: `${t.type} · ${t.total} via ${t.paymentMethod || 'Cash'} (${t.items} items)`,
          category: 'Invoice',
          link: '/pos',
          icon: '🧾',
          badgeBg: 'rgba(251, 191, 36, 0.15)',
          badgeColor: '#fbbf24',
        })
      }
    })

    // 4. Prescriptions
    store.prescriptions.forEach((rx: PrescriptionQueueItem) => {
      if (
        !q ||
        rx.id.toLowerCase().includes(q) ||
        rx.patientName.toLowerCase().includes(q) ||
        rx.doctorName.toLowerCase().includes(q) ||
        rx.medicineName.toLowerCase().includes(q)
      ) {
        list.push({
          title: `${rx.id} - ${rx.patientName}`,
          detail: `Prescribed: ${rx.medicineName} by ${rx.doctorName} (${rx.status})`,
          category: 'Prescription',
          link: '/prescriptions',
          icon: '📋',
          badgeBg: 'rgba(167, 139, 250, 0.15)',
          badgeColor: '#c084fc',
        })
      }
    })

    // 5. Customers
    store.customers.forEach((cust: CustomerRecord) => {
      if (
        !q ||
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.phone.includes(q) ||
        cust.tier.toLowerCase().includes(q)
      ) {
        list.push({
          title: cust.name,
          detail: `${cust.tier} Member · ${cust.email} · Spent: ৳ ${cust.totalSpent}`,
          category: 'Customer',
          link: '/customers',
          icon: '👤',
          badgeBg: 'rgba(236, 72, 153, 0.15)',
          badgeColor: '#f472b6',
        })
      }
    })

    return list.slice(0, 20)
  }, [searchQuery])

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
            <div style={{ position: 'relative' }}>
              <label className="search" style={{ position: 'relative', width: 280 }}>
                <Search size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchOpen(true)
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 220)}
                  placeholder="Search medicines, orders, invoices..."
                />
                {searchQuery ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSearchQuery('')
                      setSearchOpen(false)
                    }}
                    style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: 14, cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                ) : (
                  <kbd>⌘ K</kbd>
                )}
              </label>

              {/* Inline Partial Search Dropdown Results */}
              {searchOpen && searchQuery.trim() && (
                <div
                  style={{
                    position: 'absolute',
                    top: 42,
                    left: 0,
                    width: 420,
                    maxHeight: 380,
                    overflowY: 'auto',
                    background: '#0a1728',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: 14,
                    padding: '8px 10px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 20px rgba(56, 189, 248, 0.2)',
                    zIndex: 9999,
                  }}
                >
                  {searchResults.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: 12 }}>
                      No matching results for "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchOpen(false)
                          setSearchQuery('')
                          if (item.link) window.location.href = item.link
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 11px',
                          borderRadius: 10,
                          cursor: 'pointer',
                          marginBottom: 4,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'
                          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <b style={{ color: '#ffffff', fontSize: 12, display: 'block' }}>{item.title}</b>
                            <span style={{ color: '#94a3b8', fontSize: 10 }}>{item.detail}</span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: item.badgeBg || 'rgba(56,189,248,0.15)',
                            color: item.badgeColor || '#38bdf8',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
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
          <div style={{ fontSize: 10, fontWeight: 700, color: '#34d399', background: 'rgba(52, 211, 153, 0.12)', padding: '2px 8px', borderRadius: 10, marginTop: 6, display: 'inline-block' }}>
            🔒 Administrator
          </div>
          <hr />
          <button onClick={() => { setProfile(false); window.location.href = '/owner/settings'; }}>
            <Settings size={14} />
            <span>Account Settings</span>
          </button>
          <button className="signout-btn" onClick={handleSignOut}>
            <LogOut size={14} />
            <span>Sign Out</span>
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
