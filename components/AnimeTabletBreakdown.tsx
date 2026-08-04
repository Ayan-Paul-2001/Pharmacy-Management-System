'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  PillCapsuleIcon,
  RxDocumentIcon,
  ShieldCheckIcon,
  HospitalIcon,
  WhatsAppIcon,
  KeyPasskeyIcon,
  CheckCircleIcon,
} from './Icons'
import { Play, Pause, RefreshCw } from 'lucide-react'

interface OptionNode {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  badge: string
  // Direction vector when expanding/contracting to/from center
  dx: number
  dy: number
}

const optionNodes: OptionNode[] = [
  { id: 'opt-1', title: 'Instant Medicine Store',    subtitle: '5,000+ Genuine OTC & Prescription Drugs',              icon: <PillCapsuleIcon size={20} />, color: '#10b981', badge: '100% Genuine',  dx: 260, dy: 160 },
  { id: 'opt-2', title: 'Cloud Prescription Sync',   subtitle: 'Cloudinary Image Scan & Pharmacist Verification',       icon: <RxDocumentIcon  size={20} />, color: '#3b82f6', badge: 'Fast Review',   dx: -260, dy: 160 },
  { id: 'opt-3', title: '100% Authentic Guarantee',  subtitle: 'Direct Manufacturer Cold-Chain Supply',                 icon: <ShieldCheckIcon size={20} />, color: '#06b6d4', badge: 'Verified',      dx: 300, dy: 0 },
  { id: 'opt-4', title: '24/7 Express Home Delivery',subtitle: 'Under 60 Mins Express Model Pharmacy Service',          icon: <HospitalIcon    size={20} />, color: '#8b5cf6', badge: 'Express 24/7',  dx: -300, dy: 0 },
  { id: 'opt-5', title: 'Biometric Passkey Security', subtitle: 'FingerprintJS & WebAuthn Anti-Fraud Portal',           icon: <KeyPasskeyIcon  size={20} />, color: '#f59e0b', badge: 'High Security', dx: 220, dy: -170 },
  { id: 'opt-6', title: 'WhatsApp Instant Order',    subtitle: 'One-Tap Hotline & Prescription Support',                icon: <WhatsAppIcon    size={20} />, color: '#25d366', badge: 'Hotline Active',dx: -220, dy: -170 },
]

export function AnimeTabletBreakdown() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [capsuleState, setCapsuleState] = useState<'open' | 'closed'>('open')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    let rafId: number
    let startTime = performance.now()
    let currentP = 0
    let targetP = 1

    // Smooth seeking renderer (maps progress p from 0 [unbroken] to 1 [broken open])
    const seek = (p: number) => {
      // 1. Capsule halves split & assemble
      const leftShell  = container.querySelector<HTMLElement>('.atb-left-shell')
      const rightShell = container.querySelector<HTMLElement>('.atb-right-shell')
      if (leftShell)  leftShell.style.transform  = `translateX(${-188 * p}px) rotate(${-28 * p}deg) scale(${1 + 0.08 * p})`
      if (rightShell) rightShell.style.transform = `translateX(${ 188 * p}px) rotate(${ 28 * p}deg) scale(${1 + 0.08 * p})`

      // 2. Core glow expansion
      const glow = container.querySelector<HTMLElement>('.atb-core-glow')
      if (glow) {
        glow.style.transform = `scale(${0.3 + 1.2 * p})`
        glow.style.opacity   = `${0.05 + 0.95 * p}`
      }

      // 3. Micro-pellet particles burst outward
      const particles = container.querySelectorAll<HTMLElement>('.atb-particle')
      particles.forEach((el, i) => {
        const pp = Math.max(0, Math.min(1, (p - 0.04) / 0.85))
        const tx = Math.sin(i * 0.76) * 240
        const ty = Math.cos(i * 0.76) * 200
        el.style.transform = `translate(${tx * pp}px, ${ty * pp}px) scale(${1.4 * pp})`
        el.style.opacity   = `${pp}`
      })

      // 4. Laser beam lines draw outward
      const beams = container.querySelectorAll<SVGLineElement>('.atb-beam-line')
      beams.forEach((line, i) => {
        const bp = Math.max(0, Math.min(1, (p - 0.10 - i * 0.03) / 0.70))
        line.style.strokeDashoffset = `${700 * (1 - bp)}`
        ;(line as any).style.opacity = `${bp * 0.95}`
      })

      // 5. Feature cards burst out / contract back into the tablet
      const cards = container.querySelectorAll<HTMLElement>('.atb-option-card')
      cards.forEach((card, i) => {
        const node = optionNodes[i]
        const cp = Math.max(0, Math.min(1, (p - 0.08 - i * 0.02) / 0.75))
        
        // When p=0 (unbroken), translate straight towards center (node.dx, node.dy) & scale(0.2)
        const currentDx = node.dx * (1 - cp)
        const currentDy = node.dy * (1 - cp)
        const scaleVal  = 0.2 + 0.8 * cp

        card.style.opacity   = `${cp}`
        card.style.transform = `translate(${currentDx}px, ${currentDy}px) scale(${scaleVal})`
      })

      // 6. Synthesis badge
      const badge = container.querySelector<HTMLElement>('.atb-synthesis-badge')
      if (badge) {
        const bp = Math.max(0, Math.min(1, (p - 0.75) / 0.25))
        badge.style.opacity   = `${bp}`
        badge.style.transform = `translateX(-50%) scale(${0.3 + 0.7 * bp})`
      }
    }

    // ── Continuous Automatic Loop Timeline ──
    // Total Loop Duration: 7.0 seconds
    // 0.0s - 0.8s  → Unbroken / Closed State (p = 0)
    // 0.8s - 2.8s  → Breaking Open (p = 0 → 1)
    // 2.8s - 4.5s  → Fully Open State (p = 1)
    // 4.5s - 6.5s  → Re-assembling / Closed (p = 1 → 0)
    // 6.5s - 7.0s  → Unbroken Hold (p = 0)

    const tick = (now: number) => {
      if (isPlaying) {
        const elapsed = (now - startTime) % 7000
        let p = 0

        if (elapsed < 800) {
          p = 0
          setCapsuleState('closed')
        } else if (elapsed >= 800 && elapsed < 2800) {
          const t = (elapsed - 800) / 2000
          // Smooth sine easing for breakdown
          p = 0.5 - 0.5 * Math.cos(t * Math.PI)
          setCapsuleState('open')
        } else if (elapsed >= 2800 && elapsed < 4500) {
          p = 1
          setCapsuleState('open')
        } else if (elapsed >= 4500 && elapsed < 6500) {
          const t = (elapsed - 4500) / 2000
          // Smooth sine easing for re-assembly
          p = 0.5 + 0.5 * Math.cos(t * Math.PI)
          setCapsuleState('closed')
        } else {
          p = 0
          setCapsuleState('closed')
        }
        targetP = p
      }

      // Smooth Lerp step for fluid motion
      currentP += (targetP - currentP) * 0.12
      seek(currentP)

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [isPlaying])

  return (
    <div className="atb-scroller" ref={containerRef}>
      <div className="atb-sticky">

        {/* Header */}
        <div className="atb-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <span className="atb-tag-pill" style={{ margin: 0 }}>⚡ AUTOMATIC CAPSULE SYNTHESIS</span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'Pause Auto-Loop' : 'Play Animation'}</span>
            </button>
          </div>

          <h2 className="atb-title">Scientific Capsule Breakdown &amp; Re-assembly</h2>
          <p className="atb-sub">
            Watch the Mediflow capsule automatically split open to reveal active components, then magnetize back together into an unbroken tablet.
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
          <div
            className="atb-capsule-anchor"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ cursor: 'pointer' }}
            title="Click to toggle breakdown animation"
          >
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
                style={{
                  borderColor: `${opt.color}45`,
                  opacity: 0,
                  transform: `translate(${opt.dx}px, ${opt.dy}px) scale(0.2)`,
                  transition: 'border-color 0.3s ease',
                }}
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
