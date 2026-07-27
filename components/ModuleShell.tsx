'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  ['Overview', '/', '▦'], ['Inventory', '/inventory', '◇'], ['Point of sale', '/pos', '🛒'], ['Orders', '/orders', '◌'], ['Prescriptions', '/prescriptions', '▤'], ['Customers', '/customers', '♙'], ['Suppliers', '/suppliers', '⌁'], ['Purchases', '/purchases', '▱'], ['Employees', '/employees', '♧'], ['Reports', '/reports', '⌁'],
]

export function ModuleShell({ children, title, eyebrow = 'Workspace' }: { children: React.ReactNode; title: string; eyebrow?: string }) {
  const pathname = usePathname(); const [search, setSearch] = useState(''); const [toast, setToast] = useState(''); const [profile, setProfile] = useState(false)
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(''), 2300) }
  return <main className="shell">
    <aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark">✦</span><span>mediflow</span></Link><div className="workspace"><span className="workspace-dot"/><span><b>Northstar Pharmacy</b><small>Owner workspace</small></span><span className="chevron">⌄</span></div><div className="nav-label">Workspace</div><nav>{nav.map(([label, href, glyph]) => <Link key={href} href={href} className={(pathname === href) ? 'nav-item active' : 'nav-item'}><span className="module-glyph">{glyph}</span><span>{label}</span>{label === 'Point of sale' && <em>⌘P</em>}</Link>)}</nav><div className="nav-label manage-label">System</div><nav><Link href="/notifications" className={pathname === '/notifications' ? 'nav-item active' : 'nav-item'}><span className="module-glyph">◉</span><span>Notifications</span><b className="nav-badge">6</b></Link><Link href="/settings" className={pathname === '/settings' ? 'nav-item active' : 'nav-item'}><span className="module-glyph">⚙</span><span>Settings</span></Link></nav><div className="sidebar-bottom"><div className="help-card"><div className="help-icon">?</div><div><b>Need a hand?</b><span>Visit the help center</span></div><span className="help-arrow">→</span></div><button className="user-row" onClick={() => setProfile(!profile)}><div className="avatar">AK</div><div><b>Alex Kim</b><span>Administrator</span></div><span className="more">•••</span></button></div></aside>
    <section className="content"><header className="topbar"><div className="crumb"><span>{eyebrow}</span><b>/</b><strong>{title}</strong></div><div className="top-actions"><label className="search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search anything..."/><kbd>⌘ K</kbd></label><button className="icon-button" onClick={() => notify('You’re all caught up')}>♧<i/></button><button className="mini-avatar" onClick={() => setProfile(!profile)}>AK</button></div></header><div className="module-content">{children}</div></section>
    {profile && <div className="profile-pop"><div className="avatar">AK</div><b>Alex Kim</b><span>alex@northstarpharmacy.com</span><hr/><button onClick={() => notify('Profile settings opened')}>Account settings</button><button onClick={() => notify('Signed out safely')}>Sign out</button></div>}{toast && <div className="toast"><span>✓</span>{toast}</div>}
  </main>
}

export function PageIntro({ kicker, title, description, action, onAction }: { kicker: string; title: string; description: string; action: string; onAction?: () => void }) { return <div className="page-intro"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{description}</p></div><button className="primary" onClick={onAction}>{action} <span>＋</span></button></div> }

export function DataTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) { return <div className="data-table"><div className="table-row table-head">{headers.map(h => <span key={h}>{h}</span>)}</div>{rows.map((row, i) => <div className="table-row" key={i}>{row.map((cell, j) => <span key={j}>{cell}</span>)}</div>)}</div> }

export const Status = ({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) => <span className={`status ${tone}`}>{children}</span>
