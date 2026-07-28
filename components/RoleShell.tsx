'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'

type Role = 'owner' | 'employee' | 'customer'
const configs = {
  owner: { name: 'Northstar Pharmacy', subtitle: 'Verified Workspace', initials: 'AK', role: 'Administrator', accent: 'blue', nav: [['Dashboard','/owner/dashboard','⌂'],['Inventory','/owner/inventory','◇'],['Sales & POS','/owner/sales','＋'],['Purchases','/owner/purchases','▱'],['Suppliers','/owner/suppliers','⌁'],['Customers','/owner/customers','♙'],['Employees','/owner/employees','♧'],['Reports','/owner/reports','⌁'],['Settings','/owner/settings','⚙']] },
  employee: { name: 'Northstar Pharmacy', subtitle: 'Verified Workspace', initials: 'JL', role: 'Pharmacist', accent: 'mint', nav: [['Dashboard','/employee/dashboard','⌂'],['Point of sale','/employee/pos','＋'],['Orders','/employee/orders','◌'],['Prescriptions','/employee/prescriptions','▤'],['Inventory','/employee/inventory','◇'],['Customers','/employee/customers','♙'],['My tasks','/employee/tasks','✓']] },
  customer: { name: 'Northstar Pharmacy', subtitle: 'Member Account', initials: 'SM', role: 'Gold Member', accent: 'lavender', nav: [['Home','/customer/dashboard','⌂'],['Shop medicines','/customer/shop','⌕'],['My orders','/customer/orders','◌'],['Prescriptions','/customer/prescriptions','▤'],['Invoices','/customer/invoices','▤'],['Wishlist','/customer/wishlist','♡'],['Profile','/customer/profile','♙']] },
} as const

export function RoleShell({ role, title, children }: { role: Role; title: string; children: React.ReactNode }) {
  const c = configs[role]
  const pathname = usePathname()
  const [profile, setProfile] = useState(false)
  const [toast, setToast] = useState('')

  const notify = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2200)
  }

  function handleSignOut() {
    localStorage.removeItem('mediflow_token')
    localStorage.removeItem('mediflow_user')
    window.location.href = '/login'
  }

  return (
    <main className={`shell role-shell ${role}-portal`}>
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>mediflow</span>
        </Link>

        <div className="role-switcher">
          <div className={`role-orb ${c.accent}`}>{c.initials}</div>
          <div>
            <b>{c.name}</b>
            <small>{c.subtitle}</small>
          </div>
        </div>

        <div className="nav-label">Navigation</div>
        <nav>
          {c.nav.map(([label, href, glyph]) => (
            <Link href={href} key={href} className={pathname === href ? 'nav-item active' : 'nav-item'}>
              <span className="module-glyph">{glyph}</span>
              <span>{label}</span>
              {label === 'Point of sale' && <em>⌘P</em>}
            </Link>
          ))}
        </nav>

        <div className="nav-label manage-label">Workspace</div>
        <nav>
          {role === 'customer' ? (
            <>
              <Link href="/customer/notifications" className="nav-item">
                <span className="module-glyph">◉</span>
                <span>Notifications</span>
                <b className="nav-badge">3</b>
              </Link>
              <Link href="/customer/help" className="nav-item">
                <span className="module-glyph">?</span>
                <span>Help center</span>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/${role}/notifications`} className="nav-item">
                <span className="module-glyph">◉</span>
                <span>Notifications</span>
                <b className="nav-badge">6</b>
              </Link>
              <Link href={`/${role}/settings`} className="nav-item">
                <span className="module-glyph">⚙</span>
                <span>Settings</span>
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <div>
              <b>Need help?</b>
              <span>Visit the help center</span>
            </div>
            <span className="help-arrow">→</span>
          </div>

          <button className="user-row" onClick={() => setProfile(!profile)}>
            <div className={`avatar ${c.accent}`}>{c.initials}</div>
            <div>
              <b>{role === 'customer' ? 'Sarah Mitchell' : role === 'employee' ? 'Jordan Lee' : 'Alex Kim'}</b>
              <span>{c.role}</span>
            </div>
            <span className="more">•••</span>
          </button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div className="crumb">
            <span>Mediflow</span>
            <b>/</b>
            <strong>{title}</strong>
          </div>
          <div className="top-actions">
            <label className="search">
              <span>⌕</span>
              <input placeholder="Search medicines, orders, invoices..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button" onClick={() => notify('You’re all caught up')}>
              ♧<i />
            </button>
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
          <b>{role === 'customer' ? 'Sarah Mitchell' : role === 'employee' ? 'Jordan Lee' : 'Alex Kim'}</b>
          <span>{role === 'customer' ? 'sarah.mitchell@email.com' : 'Signed in securely'}</span>
          <hr />
          <button onClick={() => notify('Account settings opened')}>Account Settings</button>
          <button onClick={handleSignOut} style={{ color: '#de6870', fontWeight: 600 }}>
            Sign Out
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
