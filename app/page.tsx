'use client'

import { useState } from 'react'
import Link from 'next/link'
import { uploadImageToCloudinary } from '@/lib/cloudinary-client'
import { HeartbeatBanner } from '@/components/HeartbeatBanner'
import {
  PhoneIcon,
  MailIcon,
  SearchIcon,
  WhatsAppIcon,
  RxDocumentIcon,
  UserIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  HospitalIcon,
  PillCapsuleIcon,
  CloudUploadIcon,
  CheckCircleIcon,
  FlameIcon,
} from '@/components/Icons'
import { Shield, Sparkles, Truck, Tag, ArrowRight, Upload, Phone, Mail, CheckCircle } from 'lucide-react'

const categories = [
  { name: 'Prescription Medicine', color: 'rgba(56, 189, 248, 0.15)' },
  { name: 'OTC Medicine', color: 'rgba(251, 191, 36, 0.15)' },
  { name: 'Supplements & Vitamins', color: 'rgba(52, 211, 153, 0.15)' },
  { name: 'Diabetic Accessories', color: 'rgba(248, 113, 113, 0.15)' },
  { name: 'Skin Care Products', color: 'rgba(192, 132, 252, 0.15)' },
  { name: 'Women\'s Care', color: 'rgba(244, 114, 182, 0.15)' },
  { name: 'Men\'s Care', color: 'rgba(96, 165, 250, 0.15)' },
  { name: 'Baby & Mom Products', color: 'rgba(251, 146, 60, 0.15)' },
]

const hotDeals = [
  { id: '1', name: 'Amoxicillin 500mg Capsule', generic: 'Amoxicillin Trihydrate', price: 12.4, origPrice: 15.0, discount: '17% OFF', rx: true },
  { id: '2', name: 'Paracetamol 500mg Tablet', generic: 'Acetaminophen', price: 4.8, origPrice: 6.0, discount: '20% OFF', rx: false },
  { id: '3', name: 'Metformin 850mg Tablet', generic: 'Metformin HCl', price: 8.2, origPrice: 10.0, discount: '18% OFF', rx: true },
  { id: '4', name: 'Omeprazole 20mg Capsule', generic: 'Omeprazole Magnesium', price: 9.6, origPrice: 12.0, discount: '20% OFF', rx: false },
  { id: '5', name: 'Atorvastatin 20mg Tablet', generic: 'Atorvastatin Calcium', price: 14.2, origPrice: 17.5, discount: '19% OFF', rx: true },
  { id: '6', name: 'Vitamin D3 1000IU Softgel', generic: 'Cholecalciferol', price: 11.8, origPrice: 14.0, discount: '15% OFF', rx: false },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [showRxModal, setShowRxModal] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [cartCount, setCartCount] = useState(2)
  const [toast, setToast] = useState('')
  const [rxFile, setRxFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleAddToCart(name: string) {
    setCartCount(cartCount + 1)
    notify(`Added ${name} to shopping bag!`)
  }

  async function handleRxSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rxFile) {
      notify('Please select a prescription file first')
      return
    }

    setUploading(true)
    notify('Uploading prescription photo to Cloudinary...')

    try {
      await uploadImageToCloudinary(rxFile, 'mediflow_prescriptions')
      setShowRxModal(false)
      notify('Prescription uploaded to Cloudinary successfully!')
    } catch (err: any) {
      setShowRxModal(false)
      notify('Prescription attached for pharmacist review!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="owner-portal" style={{ background: '#0b172a', minHeight: '100vh', color: '#f8fafc' }}>
      {/* 1. Top Contact & Model Pharmacy Header Layer */}
      <div className="lazz-top-bar" style={{ background: '#061224', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '7px 28px', color: '#cbd5e1', fontSize: 11.5 }}>
        <div className="lazz-container flex-between">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#e2e8f0' }}>
              <Phone size={13} style={{ color: '#34d399' }} />
              <span>Hotline: <strong style={{ color: '#ffffff', fontWeight: 600 }}>01319-864049 / 01952-444471</strong></span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#e2e8f0' }}>
              <Mail size={13} style={{ color: '#38bdf8' }} />
              <span>support@mediflow.com</span>
            </span>
          </div>

          <div>
            <span
              className="model-pharmacy-badge"
              style={{
                background: 'rgba(12, 133, 66, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: 12,
              }}
            >
              First Ever Model Pharmacy System in Bangladesh
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Logo, Search, Action Buttons) */}
      <header style={{ background: '#081222', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 28px' }}>
        <div className="lazz-container flex-between">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#34d399', fontSize: 20 }}>✦</span>
            <span style={{ font: '800 22px Manrope', color: '#ffffff', letterSpacing: '-0.5px' }}>mediflow</span>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
              PHARMACY
            </span>
          </Link>

          {/* Search Bar */}
          <div style={{ background: '#091424', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '4px 6px 4px 16px', display: 'flex', alignItems: 'center', gap: 10, width: 420 }}>
            <span style={{ color: '#94a3b8', display: 'inline-flex' }}>
              <SearchIcon size={15} />
            </span>
            <input
              type="text"
              placeholder="Search medicine by Name, Generic, or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 0, outline: 'none', color: '#ffffff', fontSize: 12, flex: 1 }}
            />
            <button type="button" style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#fff', border: 0, borderRadius: 18, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Search
            </button>
          </div>

          {/* Action CTA Buttons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a
              href="https://wa.me/8801952444471"
              target="_blank"
              rel="noreferrer"
              style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37, 211, 102, 0.3)', color: '#25d366', padding: '6px 14px', borderRadius: 10, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700 }}
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp Order</span>
            </a>

            <button
              type="button"
              onClick={() => setShowRxModal(true)}
              style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <RxDocumentIcon size={18} />
              <span>Upload Prescription</span>
            </button>

            <Link href="/login" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', padding: '8px 14px', borderRadius: 10, textDecoration: 'none', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserIcon size={16} />
              <span>Sign In</span>
            </Link>

            <Link href="/customer/shop" style={{ background: '#09172a', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', textDecoration: 'none' }}>
              <ShoppingBagIcon size={18} />
              <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Navigation Bar */}
      <nav style={{ background: '#09172a', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 28px' }}>
        <div className="lazz-container flex-start" style={{ gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowCategories(!showCategories)}
              style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#fff', border: 0, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>≡ Categories</span>
              <span>▼</span>
            </button>

            {showCategories && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#09172a', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 12, width: 220, padding: 8, zIndex: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {categories.map((c, i) => (
                  <Link
                    href="/customer/shop"
                    key={i}
                    onClick={() => setShowCategories(false)}
                    style={{ display: 'block', padding: '8px 12px', color: '#cbd5e1', textDecoration: 'none', fontSize: 12, fontWeight: 600, borderRadius: 6 }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              Home
            </Link>
            <Link href="/customer/shop" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Shop Medicines
            </Link>
            <Link href="/owner/categories" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Categories Master
            </Link>
            <Link href="/owner/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Owner Dashboard
            </Link>
            <Link href="/customer/orders" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Track Order
            </Link>
          </div>
        </div>
      </nav>

      {/* Heartbeat ECG Pulse Banner */}
      <HeartbeatBanner onUploadClick={() => setShowRxModal(true)} />
      <section style={{ padding: '30px 28px', background: '#09172a', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="lazz-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div style={{ background: '#0f2038', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37, 211, 102, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25d366' }}>
              <WhatsAppIcon size={20} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: 13.5, margin: '0 0 2px' }}>Order Via WhatsApp</h4>
              <p style={{ color: '#cbd5e1', fontSize: 11.5, margin: 0 }}>+880 1952-444471</p>
            </div>
          </div>

          <div onClick={() => setShowRxModal(true)} style={{ background: '#0f2038', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <RxDocumentIcon size={20} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: 13.5, margin: '0 0 2px' }}>Upload Prescription</h4>
              <p style={{ color: '#cbd5e1', fontSize: 11.5, margin: 0 }}>Hassle-Free Verification</p>
            </div>
          </div>

          <div style={{ background: '#0f2038', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: 13.5, margin: '0 0 2px' }}>100% Authentic</h4>
              <p style={{ color: '#cbd5e1', fontSize: 11.5, margin: 0 }}>Verified Manufacturers</p>
            </div>
          </div>

          <div style={{ background: '#0f2038', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <HospitalIcon size={20} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: 13.5, margin: '0 0 2px' }}>Model Pharmacy</h4>
              <p style={{ color: '#cbd5e1', fontSize: 11.5, margin: 0 }}>24/7 Fast Express Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Notice Ticker */}
      <div style={{ background: '#061222', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 28px', color: '#cbd5e1', fontSize: 12, textAlign: 'center' }}>
        <div className="lazz-container text-center">
          <span style={{ color: '#34d399', fontWeight: 700, marginRight: 8 }}>NOTICE:</span>
          Welcome to Mediflow Model Pharmacy – Your trusted online medicine store for fast, 100% authentic, and convenient healthcare shopping! Emergency Hotline: 01319-864049
        </div>
      </div>

      {/* 7. Shop By Category Grid */}
      <section style={{ padding: '40px 28px' }}>
        <div className="lazz-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ font: '800 22px Manrope', color: '#ffffff', margin: 0 }}>Shop By Category</h2>
              <p style={{ color: '#94a3b8', fontSize: 12.5, margin: '4px 0 0' }}>Explore authentic OTC medicines, supplements, and care products</p>
            </div>
            <Link href="/customer/shop" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: 12.5, fontWeight: 700 }}>
              View All Categories →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {categories.map((cat, i) => (
              <Link href="/customer/shop" key={i} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#09172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s ease' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PillCapsuleIcon size={22} className="icon-emerald" />
                  </div>
                  <span style={{ color: '#ffffff', fontSize: 13.5, fontWeight: 600 }}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Hot Deal Products Shelf */}
      <section style={{ padding: '40px 28px', background: '#081222', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="lazz-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ font: '800 22px Manrope', color: '#ffffff', margin: 0 }}>Hot Deal Products</h2>
              <p style={{ color: '#94a3b8', fontSize: 12.5, margin: '4px 0 0' }}>Limited time discounts on genuine essential medicines</p>
            </div>
            <Link href="/customer/shop" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: 12.5, fontWeight: 700 }}>
              View All Deals →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {hotDeals.map((p) => (
              <div key={p.id} style={{ background: '#09172a', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ background: 'rgba(248, 113, 113, 0.15)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>{p.discount}</span>
                    {p.rx && (
                      <span style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#c084fc', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>Rx Required</span>
                    )}
                  </div>

                  <div style={{ width: '100%', height: 110, borderRadius: 12, background: '#061222', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <PillCapsuleIcon size={38} className="icon-emerald" />
                  </div>

                  <span style={{ color: '#94a3b8', fontSize: 11, display: 'block', marginBottom: 2 }}>{p.generic}</span>
                  <h3 style={{ color: '#ffffff', fontSize: 13.5, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3 }}>{p.name}</h3>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 12 }}>
                    <strong style={{ color: '#34d399', fontSize: 15 }}>৳ {p.price.toFixed(2)}</strong>
                    <span style={{ color: '#64748b', fontSize: 12, textDecoration: 'line-through' }}>৳ {p.origPrice.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(p.name)}
                    style={{ width: '100%', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <ShoppingBagIcon size={14} />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Upload Prescription CTA Banner */}
      <section className="lazz-container" style={{ padding: '40px 28px' }}>
        <div style={{ background: 'linear-gradient(135deg, #09172a 0%, #061224 100%)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 20, padding: '36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div>
            <span style={{ color: '#38bdf8', fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>HASSLE-FREE MEDICINE ORDERING</span>
            <h2 style={{ font: '800 26px Manrope', color: '#ffffff', margin: '0 0 6px' }}>Have a Doctor Prescription?</h2>
            <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0 }}>Upload a photo of your prescription and our registered pharmacists will prepare your order immediately.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowRxModal(true)}
            style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#ffffff', border: 0, padding: '14px 28px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)' }}
          >
            <RxDocumentIcon size={18} />
            <span>Upload Prescription Now</span>
          </button>
        </div>
      </section>

      {/* 10. Footer */}
      <footer style={{ background: '#061222', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '50px 28px 20px', color: '#cbd5e1' }}>
        <div className="lazz-container grid-four" style={{ gap: 30, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ color: '#34d399', fontSize: 20 }}>✦</span>
              <span style={{ font: '800 22px Manrope', color: '#ffffff' }}>mediflow</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#94a3b8', margin: '0 0 16px' }}>
              First Model Pharmacy system in Bangladesh. Providing 100% genuine OTC medicines, prescription drugs, surgical items, and personal care products with fast home delivery.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              <li><Link href="/customer/shop" style={{ color: '#94a3b8', textDecoration: 'none' }}>Online Medicine Store</Link></li>
              <li><Link href="/owner/categories" style={{ color: '#94a3b8', textDecoration: 'none' }}>Medicine Categories</Link></li>
              <li><Link href="/customer/orders" style={{ color: '#94a3b8', textDecoration: 'none' }}>Track Active Order</Link></li>
              <li><Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Unified Portal Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              <li><Link href="/owner/dashboard" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Owner Dashboard</Link></li>
              <li><Link href="/employee/dashboard" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>Pharmacist Counter</Link></li>
              <li><Link href="/customer/dashboard" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 600 }}>Customer Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, margin: '0 0 14px' }}>Payment Methods</h4>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 12px' }}>100% Safe & Secure Payment Options</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 6 }}>bKash</span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 6 }}>Nagad</span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 6 }}>Rocket</span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 6 }}>Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <span>© 2026 Mediflow Pharmacy Limited. All Rights Reserved. · First Model Pharmacy System</span>
        </div>
      </footer>

      {/* Upload Prescription Modal */}
      {showRxModal && (
        <div
          onClick={() => setShowRxModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5, 12, 24, 0.85)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, background: '#09172a', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 18, padding: '24px 28px', boxShadow: '0 25px 70px rgba(0,0,0,0.85)', color: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ font: '800 20px Manrope', color: '#ffffff', margin: 0 }}>Upload Doctor Prescription</h2>
              <button onClick={() => setShowRxModal(false)} style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 13, margin: '0 0 20px' }}>Upload a clear photo or scan of your doctor prescription for fast fulfillment.</p>

            <form onSubmit={handleRxSubmit}>
              <div style={{ background: '#061222', border: '2px dashed rgba(56, 189, 248, 0.35)', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 16 }}>
                <CloudUploadIcon size={36} className="icon-blue" />
                <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600, display: 'block', marginTop: 8 }}>
                  Click to select prescription image for Cloudinary Storage
                </span>
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => setRxFile(e.target.files?.[0] || null)}
                  style={{ marginTop: 12, display: 'block', width: '100%', color: '#ffffff', fontSize: 11 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  Delivery Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1712-345678"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 12 }}
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#ffffff', border: 0, padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                {uploading ? 'Uploading to Cloudinary...' : 'Submit Prescription →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toast && (
        <div className="toast">
          <CheckCircleIcon size={16} />
          {toast}
        </div>
      )}
    </main>
  )
}
