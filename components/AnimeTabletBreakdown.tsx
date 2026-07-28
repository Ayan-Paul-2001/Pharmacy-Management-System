'use client'

import React, { useEffect, useRef } from 'react'
import {
  PillCapsuleIcon,
  RxDocumentIcon,
  ShieldCheckIcon,
  HospitalIcon,
  WhatsAppIcon,
  KeyPasskeyIcon,
  CheckCircleIcon,
} from './Icons'

interface OptionNode {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  badge: string
}

const optionNodes: OptionNode[] = [
  { id: 'opt-1', title: 'Instant Medicine Store',    subtitle: '5,000+ Genuine OTC & Prescription Drugs',              icon: <PillCapsuleIcon size={20} />, color: '#10b981', badge: '100% Genuine'  },
  { id: 'opt-2', title: 'Cloud Prescription Sync',   subtitle: 'Cloudinary Image Scan & Pharmacist Verification',       icon: <RxDocumentIcon  size={20} />, color: '#3b82f6', badge: 'Fast Review'   },
  { id: 'opt-3', title: '100% Authentic Guarantee',  subtitle: 'Direct Manufacturer Cold-Chain Supply',                 icon: <ShieldCheckIcon size={20} />, color: '#06b6d4', badge: 'Verified'      },
  { id: 'opt-4', title: '24/7 Express Home Delivery',subtitle: 'Under 60 Mins Express Model Pharmacy Service',          icon: <HospitalIcon    size={20} />, color: '#8b5cf6', badge: 'Express 24/7'  },
  { id: 'opt-5', title: 'Biometric Passkey Security', subtitle: 'FingerprintJS & WebAuthn Anti-Fraud Portal',           icon: <KeyPasskeyIcon  size={20} />, color: '#f59e0b', badge: 'High Security' },
  { id: 'opt-6', title: 'WhatsApp Instant Order',    subtitle: 'One-Tap Hotline & Prescription Support',                icon: <WhatsAppIcon    size={20} />, color: '#25d366', badge: 'Hotline Active'},
]

export function AnimeTabletBreakdown() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // ─── Custom Scroll-Scrub Implementation ───────────────────────────────────
    // Uses the exact same concept as animejs.com:
    //   • A tall outer div (300vh) gives "scroll room"
    //   • A sticky inner panel stays pinned in the viewport
    //   • Progress 0→1 is mapped across the scroll travel of the outer div
    //   • A lerp loop gives the silky smooth lag that animejs.com has
    // ──────────────────────────────────────────────────────────────────────────

    const scroller = scrollerRef.current
    if (!scroller) return

    let rafId: number
    let targetP = 0
    let currentP = 0
    let started  = false

    // ── Seek all elements to a given progress 0→1 ──
    const seek = (p: number) => {
      // 1. Capsule halves split
      const leftShell  = scroller.querySelector<HTMLElement>('.atb-left-shell')
      const rightShell = scroller.querySelector<HTMLElement>('.atb-right-shell')
      if (leftShell)  leftShell.style.transform  = `translateX(${-188 * p}px) rotate(${-30 * p}deg) scale(${1 + 0.07 * p})`
      if (rightShell) rightShell.style.transform = `translateX(${ 188 * p}px) rotate(${ 30 * p}deg) scale(${1 + 0.07 * p})`

      // 2. Core glow
      const glow = scroller.querySelector<HTMLElement>('.atb-core-glow')
      if (glow) {
        glow.style.transform = `scale(${0.4 + 1.1 * p})`
        glow.style.opacity   = `${0.05 + 0.95 * p}`
      }

      // 3. Particles burst outward
      const particles = scroller.querySelectorAll<HTMLElement>('.atb-particle')
      particles.forEach((el, i) => {
        const pp = Math.max(0, Math.min(1, (p - 0.04) / 0.82)) // slight delay vs capsule
        const tx = Math.sin(i * 0.76) * 235
        const ty = Math.cos(i * 0.76) * 195
        el.style.transform = `translate(${tx * pp}px, ${ty * pp}px) scale(${1.4 * pp})`
        el.style.opacity   = `${pp}`
      })

      // 4. Laser beams draw out (staggered)
      const beams = scroller.querySelectorAll<SVGLineElement>('.atb-beam-line')
      beams.forEach((line, i) => {
        const bp = Math.max(0, Math.min(1, (p - 0.12 - i * 0.03) / 0.65))
        line.style.strokeDashoffset = `${700 * (1 - bp)}`
        ;(line as any).style.opacity = `${bp * 0.9}`
      })

      // 5. Feature cards fly in (staggered)
      const cards = scroller.querySelectorAll<HTMLElement>('.atb-option-card')
      cards.forEach((card, i) => {
        const cp = Math.max(0, Math.min(1, (p - 0.20 - i * 0.04) / 0.60))
        card.style.opacity   = `${cp}`
        card.style.transform = `scale(${0.72 + 0.28 * cp}) translateY(${45 * (1 - cp)}px)`
      })

      // 6. Synthesis badge
      const badge = scroller.querySelector<HTMLElement>('.atb-synthesis-badge')
      if (badge) {
        const bp = Math.max(0, Math.min(1, (p - 0.80) / 0.20))
        badge.style.opacity   = `${bp}`
        badge.style.transform = `translateX(-50%) scale(${0.3 + 0.7 * bp})`
      }
    }

    // ── Calculate raw scroll progress ──
    const getProgress = () => {
      const rect = scroller.getBoundingClientRect()
      const vh   = window.innerHeight
      // Animation starts when top of scroller enters viewport bottom (rect.top < vh)
      // Animation ends   when bottom of scroller leaves viewport top  (rect.bottom < 0)
      // Total travel = scroller.offsetHeight = 300vh
      const rawP = (vh - rect.top) / (rect.height - vh)
      return Math.max(0, Math.min(1, rawP))
    }

    // ── rAF lerp loop ──────────────────────────────────────────────────────────
    // The lerp factor 0.1 = silky smooth lag identical to animejs.com homepage
    const tick = () => {
      currentP += (targetP - currentP) * 0.10
      if (Math.abs(targetP - currentP) < 0.0005) currentP = targetP
      seek(currentP)
      rafId = requestAnimationFrame(tick)
    }

    // ── Scroll handler ─────────────────────────────────────────────────────────
    const onScroll = () => {
      targetP = getProgress()
    }

    // Start rAF loop immediately, update targetP on scroll
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Set initial state immediately
    targetP  = getProgress()
    currentP = targetP
    seek(currentP)

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    /*
     * ANIMEJS.COM STICKY SCROLL-PIN LAYOUT
     * .atb-scroller  → 300vh outer div  — the "scroll rail"
     * .atb-sticky    → 100vh sticky div — stays pinned while you scroll
     *
     * As you scroll through the 300vh outer div, progress goes 0 → 1,
     * scrubbing the capsule-breakdown animation via the lerp rAF loop.
     */
    <div className="atb-scroller" ref={scrollerRef}>
      <div className="atb-sticky">

        {/* Header */}
        <div className="atb-header">
          <div className="atb-tag-pill">⚡ SCROLL TO REVEAL · ANIMEJS.COM PATTERN</div>
          <h2 className="atb-title">Scientific Capsule Breakdown &amp; Re-assembly</h2>
          <p className="atb-sub">
            Scroll down to break the Mediflow capsule open into its active components.
            Scroll back up to magnetize it whole again.
          </p>
        </div>

        {/* Animated Stage */}
        <div className="atb-stage">

          {/* SVG Laser Beams */}
          <svg className="atb-svg" viewBox="0 0 1100 560" aria-hidden="true">
            <defs>
              <linearGradient id="atbBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="50%"  stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
              </linearGradient>
              <filter id="atbGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <line className="atb-beam-line" x1="550" y1="280" x2="195" y2="90"  stroke="url(#atbBeamGrad)" strokeWidth="2.5" strokeDasharray="700" strokeDashoffset="700" filter="url(#atbGlow)" opacity="0" />
            <line className="atb-beam-line" x1="550" y1="280" x2="905" y2="90"  stroke="url(#atbBeamGrad)" strokeWidth="2.5" strokeDasharray="700" strokeDashoffset="700" filter="url(#atbGlow)" opacity="0" />
            <line className="atb-beam-line" x1="550" y1="280" x2="140" y2="280" stroke="url(#atbBeamGrad)" strokeWidth="2.5" strokeDasharray="700" strokeDashoffset="700" filter="url(#atbGlow)" opacity="0" />
            <line className="atb-beam-line" x1="550" y1="280" x2="960" y2="280" stroke="url(#atbBeamGrad)" strokeWidth="2.5" strokeDasharray="700" strokeDashoffset="700" filter="url(#atbGlow)" opacity="0" />
            <line className="atb-beam-line" x1="550" y1="280" x2="290" y2="490" stroke="url(#atbBeamGrad)" strokeWidth="2.5" strokeDasharray="700" strokeDashoffset="700" filter="url(#atbGlow)" opacity="0" />
            <line className="atb-beam-line" x1="550" y1="280" x2="810" y2="490" stroke="url(#atbBeamGrad)" strokeWidth="2.5" strokeDasharray="700" strokeDashoffset="700" filter="url(#atbGlow)" opacity="0" />
          </svg>

          {/* Central Capsule */}
          <div className="atb-capsule-anchor">
            <div className="atb-core-glow" style={{ transform: 'scale(0.4)', opacity: 0.05 }} />

            {/* LEFT half — MEDI */}
            <div className="atb-half atb-left-shell">
              <div className="atb-cap-inner atb-cap-emerald">
                <div className="atb-sheen" />
                <div className="atb-rim" />
                <span className="atb-brand">MEDI</span>
              </div>
            </div>

            {/* RIGHT half — FLOW */}
            <div className="atb-half atb-right-shell">
              <div className="atb-cap-inner atb-cap-blue">
                <div className="atb-sheen" />
                <div className="atb-rim" />
                <span className="atb-brand">FLOW</span>
              </div>
            </div>

            {/* Micro-pellet particles */}
            <div className="atb-particles" aria-hidden="true">
              {Array.from({ length: 26 }).map((_, i) => (
                <div
                  key={i}
                  className="atb-particle"
                  style={{
                    width:        6 + (i % 5) * 3,
                    height:       6 + (i % 5) * 3,
                    background:   i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#3b82f6' : '#06b6d4',
                    borderRadius: i % 4 === 0 ? '3px' : '50%',
                    opacity: 0,
                  }}
                />
              ))}
            </div>

            {/* Synthesis badge */}
            <div className="atb-synthesis-badge" style={{ opacity: 0, transform: 'translateX(-50%) scale(0.3)' }}>
              <span className="atb-badge-ring" />
              <CheckCircleIcon size={14} className="icon-emerald" />
              <span>SYNTHESIS ACTIVE</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="atb-cards-layer">
            {optionNodes.map((opt, idx) => (
              <div
                key={opt.id}
                className={`atb-option-card atb-card-${idx + 1}`}
                style={{ borderColor: `${opt.color}40`, opacity: 0, transform: 'scale(0.72) translateY(45px)' }}
              >
                <div className="atb-card-head">
                  <div className="atb-icon-ring" style={{ background: `${opt.color}1a`, color: opt.color }}>
                    {opt.icon}
                  </div>
                  <span className="atb-card-badge" style={{ background: `${opt.color}1a`, color: opt.color }}>
                    {opt.badge}
                  </span>
                </div>
                <h3 className="atb-card-title">{opt.title}</h3>
                <p className="atb-card-sub">{opt.subtitle}</p>
                <div className="atb-card-link">
                  <span>Explore Feature</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

        </div>{/* /atb-stage */}
      </div>{/* /atb-sticky */}
    </div>   /* /atb-scroller */
  )
}
