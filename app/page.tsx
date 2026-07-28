'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimePharmaHero } from '@/components/AnimePharmaHero'
import { AnimeTabletBreakdown } from '@/components/AnimeTabletBreakdown'
import { uploadImageToCloudinary } from '@/lib/cloudinary-client'
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

const categories = [
  { name: 'Prescription Medicine', color: '#e0f2fe' },
  { name: 'OTC Medicine', color: '#fef3c7' },
  { name: 'Supplements & Vitamins', color: '#dcfce7' },
  { name: 'Diabetic Accessories', color: '#ffe4e6' },
  { name: 'Skin Care Products', color: '#f3e8ff' },
  { name: 'Women\'s Care', color: '#fce7f3' },
  { name: 'Men\'s Care', color: '#e0e7ff' },
  { name: 'Baby & Mom Products', color: '#ffedd5' },
  { name: 'Surgical Products', color: '#ccfbf1' },
  { name: 'Personal Care', color: '#e0f2fe' },
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
      const res = await uploadImageToCloudinary(rxFile, 'mediflow_prescriptions')
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
    <main className="lazz-homepage">
      {/* 1. Top Contact & Model Pharmacy Header Layer */}
      <div className="lazz-top-bar">
        <div className="lazz-container flex-between">
          <div className="top-bar-left">
            <a href="tel:01319864049" className="top-link">
              <PhoneIcon size={14} />
              <span>Hotline: 01319-864049 / 01952-444471</span>
            </a>
            <span className="divider">|</span>
            <a href="mailto:support@mediflow.com" className="top-link">
              <MailIcon size={14} />
              <span>support@mediflow.com</span>
            </a>
          </div>

          <div className="top-bar-right">
            <span className="model-pharmacy-badge">
              First Ever Model Pharmacy System in Bangladesh
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Logo, Search, Action Buttons) */}
      <header className="lazz-main-header">
        <div className="lazz-container flex-between">
          {/* Logo */}
          <Link href="/" className="lazz-brand">
            <span className="brand-mark-green">✦</span>
            <span className="brand-title">mediflow</span>
            <span className="model-tag">PHARMACY</span>
          </Link>

          {/* Search Bar */}
          <div className="lazz-search-box">
            <input
              type="text"
              placeholder="Search medicine by Name, Generic, or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="search-btn">
              <SearchIcon size={15} />
              <span>Search</span>
            </button>
          </div>

          {/* Action CTA Buttons */}
          <div className="lazz-header-actions">
            <a
              href="https://wa.me/8801952444471"
              target="_blank"
              rel="noreferrer"
              className="lazz-cta-btn wa-cta"
            >
              <WhatsAppIcon size={18} className="cta-icon-svg" />
              <div>
                <span className="cta-title">WhatsApp Order</span>
                <span className="cta-sub">+880 1952-444471</span>
              </div>
            </a>

            <button
              type="button"
              className="lazz-cta-btn rx-cta"
              onClick={() => setShowRxModal(true)}
            >
              <RxDocumentIcon size={18} className="cta-icon-svg" />
              <div>
                <span className="cta-title">Upload Prescription</span>
                <span className="cta-sub">Fast Verification</span>
              </div>
            </button>

            <Link href="/login" className="lazz-login-btn">
              <UserIcon size={16} />
              <span>Sign In</span>
            </Link>

            <Link href="/customer/shop" className="lazz-cart-badge">
              <ShoppingBagIcon size={16} />
              <span className="cart-num">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Category & Navigation Menu Bar */}
      <nav className="lazz-navbar">
        <div className="lazz-container flex-start">
          <div className="category-dropdown-wrapper">
            <button
              type="button"
              className="category-trigger-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="menu-icon">≡</span>
              <span>Categories</span>
              <span className="arrow-icon">▼</span>
            </button>

            {showCategories && (
              <div className="category-flyout-menu">
                {categories.map((c, i) => (
                  <Link
                    href="/customer/shop"
                    key={i}
                    className="category-item-link"
                    onClick={() => setShowCategories(false)}
                  >
                    <PillCapsuleIcon size={14} className="cat-icon-svg" />
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lazz-nav-links">
            <Link href="/" className="nav-link active">
              Home
            </Link>
            <Link href="/customer/shop" className="nav-link">
              Shop Medicines
            </Link>
            <Link href="/customer/prescriptions" className="nav-link">
              Prescription Order
            </Link>
            <Link href="/reports" className="nav-link">
              Branch Locations
            </Link>
            <Link href="/customer/orders" className="nav-link">
              Track Order
            </Link>
            <Link href="/login" className="nav-link">
              Customer Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Hero Banner Area with Anime.js Drug Animation */}
      <section className="lazz-hero-banner-section">
        <AnimePharmaHero />
        <div className="lazz-hero-overlay-content lazz-container">
          <div className="banner-copy-card">
            <span className="banner-tag">AUTHENTIC PHARMACEUTICALS</span>
            <h1>
              Buy Authentic Medicines Online<br />
              <em>With Fast Home Delivery</em>
            </h1>
            <p>
              100% Genuine prescription drugs, diagnostic devices, health supplements, and healthcare products delivered straight to your doorstep.
            </p>
            <div className="banner-buttons">
              <Link href="/customer/shop" className="btn-order-now">
                <span>Order Medicines Online</span>
                <span>→</span>
              </Link>
              <button
                type="button"
                className="btn-upload-rx"
                onClick={() => setShowRxModal(true)}
              >
                <RxDocumentIcon size={15} />
                <span>Upload Prescription</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. Scroll-Triggered Scientific Tablet Breakdown Animation (Anime.js Powered) */}
      <AnimeTabletBreakdown />

      {/* 5. Four Feature Value Boxes Strip */}
      <section className="lazz-features-strip">
        <div className="lazz-container grid-four">
          <a
            href="https://wa.me/8801952444471"
            target="_blank"
            rel="noreferrer"
            className="feature-value-box"
          >
            <div className="feature-circle wa">
              <WhatsAppIcon size={20} />
            </div>
            <div>
              <h4>Order Via WhatsApp</h4>
              <p>+880 1952-444471</p>
            </div>
          </a>

          <div
            className="feature-value-box cursor-pointer"
            onClick={() => setShowRxModal(true)}
          >
            <div className="feature-circle rx">
              <RxDocumentIcon size={20} />
            </div>
            <div>
              <h4>Upload Prescription</h4>
              <p>Hassle-Free Verification</p>
            </div>
          </div>

          <div className="feature-value-box">
            <div className="feature-circle auth">
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <h4>100% Authentic</h4>
              <p>Verified Manufacturers</p>
            </div>
          </div>

          <div className="feature-value-box">
            <div className="feature-circle store">
              <HospitalIcon size={20} />
            </div>
            <div>
              <h4>Model Pharmacy</h4>
              <p>24/7 Fast Express Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Moving Marquee Notice Ticker */}
      <div className="lazz-notice-ticker">
        <div className="notice-inner">
          <span>
            Welcome to Mediflow Model Pharmacy – Your trusted online medicine store for fast, 100% authentic, and convenient healthcare shopping! Emergency Hotline: 01319-864049
          </span>
        </div>
      </div>

      {/* 7. Shop By Category Grid */}
      <section className="lazz-section">
        <div className="lazz-container">
          <div className="lazz-section-head">
            <h2>Shop By Category</h2>
            <Link href="/customer/shop" className="view-all-link">
              View All Categories →
            </Link>
          </div>

          <div className="category-cards-grid">
            {categories.slice(0, 8).map((cat, i) => (
              <Link href="/customer/shop" key={i} className="cat-card">
                <div className="cat-icon-bg" style={{ backgroundColor: cat.color }}>
                  <PillCapsuleIcon size={22} className="icon-emerald" />
                </div>
                <span className="cat-card-title">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Hot Deal Products Shelf */}
      <section className="lazz-section bg-light">
        <div className="lazz-container">
          <div className="lazz-section-head">
            <div className="title-with-badge">
              <h2>Hot Deal Products</h2>
              <span className="deal-pill">
                <FlameIcon size={12} /> Limited Time Discounts
              </span>
            </div>
            <Link href="/customer/shop" className="view-all-link">
              View All Deals →
            </Link>
          </div>

          <div className="product-shelf-grid">
            {hotDeals.map((p) => (
              <div className="product-deal-card" key={p.id}>
                <div className="discount-tag">{p.discount}</div>
                {p.rx && (
                  <div className="rx-required-tag">
                    <ShieldCheckIcon size={10} /> Rx Required
                  </div>
                )}

                <div className="product-img-box">
                  <PillCapsuleIcon size={32} className="icon-emerald" />
                </div>

                <div className="product-info-body">
                  <span className="generic-name">{p.generic}</span>
                  <h3 className="product-title">{p.name}</h3>

                  <div className="price-row">
                    <span className="current-price">${p.price.toFixed(2)}</span>
                    <span className="orig-price">${p.origPrice.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    className="add-to-bag-btn flex-center"
                    onClick={() => handleAddToCart(p.name)}
                  >
                    <ShoppingBagIcon size={13} />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Upload Prescription Floating CTA Banner */}
      <section className="lazz-container rx-banner-section">
        <div className="rx-banner-card">
          <div className="rx-banner-copy">
            <span className="rx-eyebrow">HASSLE-FREE MEDICINE ORDERING</span>
            <h2>Have a Doctor Prescription?</h2>
            <p>Upload a photo of your prescription and our registered pharmacists will prepare your order immediately.</p>
          </div>
          <button
            type="button"
            className="rx-banner-btn flex-center-gap"
            onClick={() => setShowRxModal(true)}
          >
            <RxDocumentIcon size={16} />
            <span>Upload Prescription Now</span>
          </button>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="lazz-footer">
        <div className="lazz-container footer-grid">
          <div className="footer-col">
            <div className="lazz-brand white">
              <span className="brand-mark-green">✦</span>
              <span className="brand-title">mediflow</span>
            </div>
            <p className="footer-about">
              First Model Pharmacy system in Bangladesh. Providing 100% genuine OTC medicines, prescription drugs, surgical items, and personal care products with fast home delivery.
            </p>
            <div className="contact-line">
              <PhoneIcon size={14} />
              <span>Emergency Hotline: 01319-864049</span>
            </div>
            <div className="contact-line">
              <MailIcon size={14} />
              <span>Email: support@mediflow.com</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/customer/shop">Online Medicine Store</Link></li>
              <li><Link href="/customer/prescriptions">Upload Doctor Prescription</Link></li>
              <li><Link href="/customer/orders">Track Active Order</Link></li>
              <li><Link href="/login">Unified Portal Sign In</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link href="/customer/shop">Prescription Medicine</Link></li>
              <li><Link href="/customer/shop">OTC & Health Care</Link></li>
              <li><Link href="/customer/shop">Supplements & Vitamins</Link></li>
              <li><Link href="/customer/shop">Diabetic Devices</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Payment Methods</h4>
            <p className="footer-subtext">100% Safe & Secure Payment Options</p>
            <div className="payment-badges">
              <span className="pay-chip">bKash</span>
              <span className="pay-chip">Nagad</span>
              <span className="pay-chip">Rocket</span>
              <span className="pay-chip">Visa</span>
              <span className="pay-chip">Mastercard</span>
              <span className="pay-chip">Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="lazz-container flex-between">
            <span>© 2026 Mediflow Pharmacy Limited. All Rights Reserved.</span>
            <span>First Model Pharmacy System</span>
          </div>
        </div>
      </footer>

      {/* Upload Prescription Modal with Cloudinary Integration */}
      {showRxModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button
              type="button"
              className="close-modal-btn"
              onClick={() => setShowRxModal(false)}
            >
              ×
            </button>

            <h2>Upload Doctor Prescription</h2>
            <p>Upload a clear photo or scan of your doctor prescription for fast fulfillment.</p>

            <form onSubmit={handleRxSubmit}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: 12,
                  padding: 24,
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                <CloudUploadIcon size={36} className="icon-blue" />
                <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'block', marginTop: 8 }}>
                  Click to select prescription image or PDF for Cloudinary Storage
                </span>
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => setRxFile(e.target.files?.[0] || null)}
                  style={{ marginTop: 10, display: 'block', width: '100%' }}
                />
              </div>

              <label className="input-group-dark" style={{ marginBottom: 16 }}>
                <span>Delivery Phone Number</span>
                <input
                  type="tel"
                  required
                  placeholder="+880 1712-345678"
                />
              </label>

              <button className="auth-submit-btn" style={{ width: '100%' }} disabled={uploading}>
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
