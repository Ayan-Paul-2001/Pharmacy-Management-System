import Link from 'next/link'
import { GsapHero } from '@/components/GsapHero'

const rooms = [
  { href: '/owner/dashboard', role: 'Owner room', title: 'Run the whole pharmacy', copy: 'Analytics, inventory, staff, suppliers, purchases, billing, reports, and system controls.', badge: 'Full access', tone: 'blue', icon: '✦' },
  { href: '/employee/dashboard', role: 'Employee room', title: 'Work the shift', copy: 'Fast POS, prescription review, online orders, stock lookup, customers, and tasks.', badge: 'Operational access', tone: 'mint', icon: '＋' },
  { href: '/customer/dashboard', role: 'Customer room', title: 'Manage your care', copy: 'Shop medicines, track orders, upload prescriptions, view invoices, and earn rewards.', badge: 'Personal account', tone: 'lavender', icon: '♡' },
]

export default function Home() { return <main className="room-landing"><div className="landing-glow"/><GsapHero/><header className="landing-header"><Link href="/" className="brand"><span className="brand-mark">✦</span><span>mediflow</span></Link><span className="secure-pill">◉ Secure pharmacy workspace</span></header><section className="landing-content"><div className="landing-hero-copy"><div className="eyebrow">NORTHSTAR PHARMACY · ROLE PORTALS</div><h1>Everything has<br/><em>its own room.</em></h1><p className="landing-copy">Mediflow keeps every workflow focused. Choose the room that belongs to you to enter your dedicated workspace.</p></div><div className="room-grid">{rooms.map(room=><Link href={room.href} className="room-card" key={room.href}><div className={`room-icon ${room.tone}`}>{room.icon}</div><div className="room-meta"><span>{room.role}</span><b>{room.badge}</b></div><h2>{room.title}</h2><p>{room.copy}</p><div className="enter-room">Enter room <span>→</span></div></Link>)}</div><div className="landing-footer"><span>Built for calmer, safer pharmacy operations.</span><span>Firebase · MongoDB · WebAuthn protected</span></div></section></main> }
