'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
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
  Heart,
  User,
  MoreHorizontal,
  Search,
  LogOut,
} from 'lucide-react'
import {
  getLiveNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotification,
  clearAllNotifications,
  startLiveSimulation,
  LiveNotification,
} from '@/lib/notification-store'

type Role = 'owner' | 'employee' | 'customer'

const configs = {
  owner: {
    name: 'Northstar Pharmacy',
    subtitle: 'Verified Workspace',
    initials: 'AP',
    role: 'Administrator',
    accent: 'blue',
    nav: [
      ['Dashboard', '/owner/dashboard'],
      ['Inventory', '/owner/inventory'],
      ['Sales & POS', '/owner/sales'],
      ['Purchases', '/owner/purchases'],
      ['Suppliers', '/owner/suppliers'],
      ['Customers', '/owner/customers'],
      ['Employees', '/owner/employees'],
      ['Reports', '/owner/reports'],
      ['Settings', '/owner/settings'],
    ],
  },
  employee: {
    name: 'Northstar Pharmacy',
    subtitle: 'Verified Workspace',
    initials: 'JL',
    role: 'Pharmacist',
    accent: 'mint',
    nav: [
      ['Dashboard', '/employee/dashboard'],
      ['Point of sale', '/employee/pos'],
      ['Orders', '/employee/orders'],
      ['Prescriptions', '/employee/prescriptions'],
      ['Inventory', '/employee/inventory'],
      ['Customers', '/employee/customers'],
      ['My tasks', '/employee/tasks'],
    ],
  },
  customer: {
    name: 'Northstar Pharmacy',
    subtitle: 'Member Account',
    initials: 'SM',
    role: 'Gold Member',
    accent: 'lavender',
    nav: [
      ['Home', '/customer/dashboard'],
      ['Shop medicines', '/customer/shop'],
      ['My orders', '/customer/orders'],
      ['Prescriptions', '/customer/prescriptions'],
      ['Invoices', '/customer/invoices'],
      ['Wishlist', '/customer/wishlist'],
      ['Profile', '/customer/profile'],
    ],
  },
} as const

function getNavIcon(label: string) {
  switch (label) {
    case 'Dashboard':
    case 'Home':
      return <LayoutDashboard size={18} />
    case 'Inventory':
    case 'Shop medicines':
      return <Boxes size={18} />
    case 'Sales & POS':
    case 'Point of sale':
      return <ShoppingCart size={18} />
    case 'Purchases':
    case 'My orders':
    case 'Orders':
      return <Truck size={18} />
    case 'Suppliers':
      return <Building2 size={18} />
    case 'Customers':
      return <Users size={18} />
    case 'Employees':
    case 'My tasks':
      return <UserCheck size={18} />
    case 'Prescriptions':
    case 'Invoices':
      return <FileText size={18} />
    case 'Reports':
      return <BarChart3 size={18} />
    case 'Settings':
      return <Settings size={18} />
    case 'Wishlist':
      return <Heart size={18} />
    case 'Profile':
      return <User size={18} />
    default:
      return <LayoutDashboard size={18} />
  }
}

export function RoleShell({ role, title, children }: { role: Role; title: string; children: React.ReactNode }) {
  const c = configs[role]
  const pathname = usePathname()
  const [profile, setProfile] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifTab, setNotifTab] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState<LiveNotification[]>([])
  const [fbToast, setFbToast] = useState<LiveNotification | null>(null)
  const [toast, setToast] = useState('')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    function loadNotifs() {
      setNotifications(getLiveNotifications())
    }
    loadNotifs()

    function handleNewToast(e: any) {
      if (e.detail) {
        setFbToast(e.detail)
        setTimeout(() => {
          setFbToast((current) => (current?.id === e.detail.id ? null : current))
        }, 5500)
      }
    }

    window.addEventListener('mediflow_notifications_changed', loadNotifs)
    window.addEventListener('mediflow_new_toast', handleNewToast as EventListener)

    return () => {
      window.removeEventListener('mediflow_notifications_changed', loadNotifs)
      window.removeEventListener('mediflow_new_toast', handleNewToast as EventListener)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const token = localStorage.getItem('mediflow_token')
    const userStr = localStorage.getItem('mediflow_user')
    if (!token || !userStr) {
      window.location.href = '/login?redirect=' + encodeURIComponent(pathname)
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (role === 'owner' && user.role !== 'owner') {
        window.location.href = user.role === 'employee' ? '/employee/dashboard' : '/customer/dashboard'
        return
      }
      if (role === 'employee' && !['employee', 'owner'].includes(user.role)) {
        window.location.href = '/customer/dashboard'
        return
      }
      setAuthorized(true)
    } catch {
      handleSignOut()
    }
  }, [pathname, role])

  const notify = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2200)
  }

  function handleSignOut() {
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
    <main className={`shell role-shell ${role}-portal`}>
      <aside className="sidebar">
        <Link href="/" className="lazz-brand sidebar-brand">
          <span className="brand-mark-green">✦</span>
          <span className="brand-title">mediflow</span>
          <span className="model-tag">PHARMACY</span>
        </Link>

        <div className="role-switcher">
          <div className={`role-orb ${c.accent}`}>{c.initials}</div>
          <div className="role-meta">
            <b>{c.name}</b>
            <small>{c.subtitle}</small>
          </div>
        </div>

        <div className="nav-label">Navigation</div>
        <nav>
          {c.nav.map(([label, href]) => (
            <Link href={href} key={href} className={pathname === href ? 'nav-item active' : 'nav-item'}>
              {getNavIcon(label)}
              <span>{label}</span>
              {label === 'Sales & POS' && <em>⌘P</em>}
            </Link>
          ))}
        </nav>

        <div className="nav-label manage-label">Workspace</div>
        <nav>
          {role === 'customer' ? (
            <>
              <Link href="/customer/notifications" className={pathname === '/customer/notifications' ? 'nav-item active' : 'nav-item'}>
                <Bell size={18} />
                <span>Notifications</span>
                <b className="nav-badge">3</b>
              </Link>
              <Link href="/customer/help" className={pathname === '/customer/help' ? 'nav-item active' : 'nav-item'}>
                <HelpCircle size={18} />
                <span>Help center</span>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/${role}/notifications`} className={pathname === `/${role}/notifications` ? 'nav-item active' : 'nav-item'}>
                <Bell size={18} />
                <span>Notifications</span>
                {unreadCount > 0 && <b className="nav-badge">{unreadCount}</b>}
              </Link>
              <Link href={`/${role}/settings`} className={pathname === `/${role}/settings` ? 'nav-item active' : 'nav-item'}>
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </>
          )}
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
            <div className={`avatar ${c.accent}`}>{c.initials}</div>
            <div>
              <b>{role === 'customer' ? 'Sarah Mitchell' : role === 'employee' ? 'Jordan Lee' : 'Ayan Paul'}</b>
              <span>{c.role}</span>
            </div>
            <MoreHorizontal size={16} className="more" />
          </button>
        </div>
      </aside>

      <section className="content">
        {/* Model Pharmacy Top Bar Accent */}
        <div className="lazz-top-bar" style={{ background: 'linear-gradient(90deg, #0c8542 0%, #059669 100%)', padding: '6px 24px', color: '#fff', fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span>📞 Hotline: 01319-864049 / 01952-444471</span>
              <span>|</span>
              <span>✉ support@mediflow.com</span>
            </div>
            <span className="model-pharmacy-badge" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: 'none', fontSize: 10, padding: '2px 8px', borderRadius: 10 }}>
              First Ever Model Pharmacy System in Bangladesh
            </span>
          </div>
        </div>

        <header className="topbar">
          <div className="crumb">
            <span>Mediflow</span>
            <b>/</b>
            <strong>{title}</strong>
          </div>
          <div className="top-actions">
            <label className="search">
              <Search size={14} />
              <input placeholder="Search medicines, orders, invoices..." />
              <kbd>⌘ K</kbd>
            </label>
            <a
              href="https://wa.me/8801952444471"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(52, 211, 153, 0.3)',
              }}
            >
              💬 WhatsApp
            </a>

            <div style={{ position: 'relative' }}>
              <button className="icon-button" style={{ position: 'relative' }} onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: 9,
                      fontWeight: 800,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      border: '2px solid #091424',
                      boxShadow: '0 0 10px rgba(239,68,68,0.8)',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Facebook-Style Live Notification Dropdown Popover */}
              {notifOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 44,
                    width: 380,
                    background: '#0a1728',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 16,
                    padding: '16px 18px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                    zIndex: 250,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                    <b style={{ color: '#ffffff', font: '800 18px Manrope' }}>Notifications</b>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsAsRead()}
                        style={{ background: 'transparent', border: 0, color: '#38bdf8', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Facebook-Style Filter Chips: All vs Unread */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    <button
                      onClick={() => setNotifTab('all')}
                      style={{
                        background: notifTab === 'all' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)',
                        color: notifTab === 'all' ? '#38bdf8' : '#94a3b8',
                        border: `1px solid ${notifTab === 'all' ? '#38bdf8' : 'transparent'}`,
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotifTab('unread')}
                      style={{
                        background: notifTab === 'unread' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)',
                        color: notifTab === 'unread' ? '#38bdf8' : '#94a3b8',
                        border: `1px solid ${notifTab === 'unread' ? '#38bdf8' : 'transparent'}`,
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  <div style={{ maxHeight: 330, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(notifTab === 'unread' ? notifications.filter((n) => !n.read) : notifications).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b', fontSize: 12 }}>
                        No notifications found in this tab. You're all caught up!
                      </div>
                    ) : (
                      (notifTab === 'unread' ? notifications.filter((n) => !n.read) : notifications).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id)
                            if (n.link) window.location.href = n.link
                          }}
                          style={{
                            background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(15,32,56,0.9)',
                            border: `1px solid ${n.read ? 'rgba(255,255,255,0.06)' : 'rgba(56,189,248,0.3)'}`,
                            borderRadius: 12,
                            padding: '10px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: n.type === 'amber' ? 'rgba(245,158,11,0.2)' : n.type === 'mint' ? 'rgba(16,185,129,0.2)' : 'rgba(56,189,248,0.2)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: 16,
                              flexShrink: 0,
                            }}
                          >
                            {n.avatarIcon || (n.type === 'amber' ? '⚠️' : n.type === 'mint' ? '🛒' : '📋')}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                              <b style={{ color: n.read ? '#cbd5e1' : '#ffffff', fontSize: 12 }}>{n.title}</b>
                              <span style={{ fontSize: 10, color: '#64748b' }}>{n.timestamp}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: 11, color: n.read ? '#64748b' : '#94a3b8', lineHeight: 1.35 }}>
                              {n.detail}
                            </p>
                          </div>

                          {/* Facebook-Style Blue Unread Dot Indicator */}
                          {!n.read && (
                            <div
                              style={{
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                background: '#38bdf8',
                                boxShadow: '0 0 8px #38bdf8',
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={`/${role}/notifications`} onClick={() => setNotifOpen(false)} style={{ color: '#34d399', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      See all in Notifications →
                    </Link>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => clearAllNotifications()}
                        style={{ background: 'transparent', border: 0, color: '#f87171', fontSize: 11, cursor: 'pointer' }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className={`mini-avatar ${c.accent}`} onClick={() => setProfile(!profile)}>
              {c.initials}
            </button>
          </div>
        </header>

        <div className="module-content">{children}</div>
      </section>

      {profile && (
        <div className="profile-pop">
          <div className={`avatar ${c.accent}`}>{c.initials}</div>
          <b>{role === 'customer' ? 'Sarah Mitchell' : role === 'employee' ? 'Jordan Lee' : 'Ayan Paul'}</b>
          <span>{role === 'customer' ? 'sarah.mitchell@email.com' : 'Signed in securely'}</span>
          <hr />
          <button onClick={() => notify('Account settings opened')}>Account Settings</button>
          <button onClick={handleSignOut} style={{ color: '#de6870', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Facebook-Style Live Floating Toast Banner */}
      {fbToast && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          style={{
            position: 'fixed',
            top: 75,
            right: 24,
            width: 350,
            background: '#09182d',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 14,
            padding: '14px 16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(56, 189, 248, 0.2)',
            zIndex: 9999,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (fbToast.link) window.location.href = fbToast.link
            setFbToast(null)
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: fbToast.type === 'amber' ? 'rgba(245,158,11,0.25)' : fbToast.type === 'mint' ? 'rgba(16,185,129,0.25)' : 'rgba(56,189,248,0.25)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {fbToast.avatarIcon || '🔔'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <b style={{ color: '#ffffff', fontSize: 13 }}>{fbToast.title}</b>
              <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700 }}>Just now</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#cbd5e1', lineHeight: 1.35 }}>
              {fbToast.detail}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setFbToast(null)
            }}
            style={{
              background: 'transparent',
              border: 0,
              color: '#94a3b8',
              fontSize: 16,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </motion.div>
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

export function RoleIntro({ kicker, title, description, action }: { kicker: string; title: string; description: string; action: string }) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">{kicker}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <button className="primary">
        {action} <span>＋</span>
      </button>
    </div>
  )
}

export function PortalCard({ href, icon, title, description, metric }: { href: string; icon: string; title: string; description: string; metric: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 330, damping: 24 }}>
      <Link href={href} className="portal-card">
        <span className="portal-card-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
          <b>{metric}</b>
        </div>
        <span className="portal-arrow">→</span>
      </Link>
    </motion.div>
  )
}
