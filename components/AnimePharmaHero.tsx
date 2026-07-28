'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { PillCapsuleIcon, ShieldCheckIcon, CheckCircleIcon, RxDocumentIcon } from './Icons'

export function AnimePharmaHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 1. Anime.js v4 Wave Physics
    const pathAnim = animate('.anime-dna-path', {
      strokeDashoffset: [400, 0],
      easing: 'easeInOutSine',
      duration: 4000,
      delay: stagger(300),
      alternate: true,
      loop: true,
    })

    // 2. Anime.js v4 Staggered Molecular Grid
    const gridAnim = animate('.molecule-grid-dot', {
      scale: [0.3, 1.4, 1],
      opacity: [0.2, 0.95, 0.35],
      delay: stagger(150, { grid: [6, 4], from: 'center' }),
      loop: true,
    })

    // 3. Anime.js v4 Floating Capsule Vectors
    const capsuleAnim = animate('.hero-anime-capsule', {
      translateY: [-15, 15],
      rotate: [-10, 10],
      scale: [0.96, 1.05],
      duration: 5000,
      alternate: true,
      loop: true,
      easing: 'easeInOutSine',
      delay: stagger(400),
    })

    // 4. Anime.js v4 Glass Pill Badges Micro-motion
    const badgeAnim = animate('.hero-glass-pill', {
      translateY: [-6, 6],
      duration: 3800,
      alternate: true,
      loop: true,
      easing: 'easeInOutSine',
      delay: stagger(500),
    })

    // 5. Anime.js v4 Radiant Ring Pulsing
    const ringAnim = animate('.hero-pulse-ring', {
      scale: [0.75, 1.35],
      opacity: [0.7, 0],
      easing: 'easeOutExpo',
      duration: 4500,
      loop: true,
      delay: stagger(1500),
    })

    return () => {
      pathAnim.pause()
      gridAnim.pause()
      capsuleAnim.pause()
      badgeAnim.pause()
      ringAnim.pause()
    }
  }, [])

  return (
    <div className="anime-pharma-hero-container" ref={containerRef} aria-hidden="true">
      {/* Background Hero Image with Professional Vignette */}
      <div className="hero-bg-wrapper">
        <img src="/pharma-hero.png" alt="Pharmaceutical Science Backdrop" className="hero-bg-img" />
        <div className="hero-vignette-overlay" />
        <div className="hero-light-sweep" />
      </div>

      {/* SVG Motion Graphic Canvas (Anime.js Powered) */}
      <svg className="anime-svg-layer" viewBox="0 0 1200 600">
        <defs>
          <linearGradient id="blueGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Double-Helix Morphing Wave Paths */}
        <path
          className="anime-dna-path"
          d="M 50,150 C 200,50 350,250 500,150 C 650,50 800,250 950,150 C 1100,50 1200,200 1250,150"
          fill="none"
          stroke="url(#blueGreenGrad)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        <path
          className="anime-dna-path"
          d="M 50,250 C 200,350 350,150 500,250 C 650,350 800,150 950,250 C 1100,350 1200,200 1250,250"
          fill="none"
          stroke="url(#cyanPurpleGrad)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Chemical Molecular Connections */}
        <line x1="200" y1="100" x2="200" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="500" y1="150" x2="500" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="800" y1="100" x2="800" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Anime.js Staggered Grid Dots */}
        {Array.from({ length: 24 }).map((_, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          return (
            <circle
              key={i}
              className="molecule-grid-dot"
              cx={180 + col * 160}
              cy={120 + row * 110}
              r="6"
              fill={i % 2 === 0 ? '#10b981' : '#3b82f6'}
              filter="url(#glow)"
            />
          )
        })}
      </svg>

      {/* Floating 3D Vector Badges (No Emojis) */}
      <div className="anime-hero-floating-elements">
        {/* Pulse Rings */}
        <div className="hero-pulse-ring r1" />
        <div className="hero-pulse-ring r2" />

        {/* Floating Capsule 1 */}
        <div className="hero-anime-capsule cap-pos-1">
          <div className="capsule-body">
            <span className="cap-half c-emerald" />
            <span className="cap-half c-blue" />
          </div>
          <div className="capsule-label">
            <PillCapsuleIcon size={14} className="icon-emerald" />
            <span>Rx 500mg</span>
          </div>
        </div>

        {/* Floating Capsule 2 */}
        <div className="hero-anime-capsule cap-pos-2">
          <div className="capsule-body">
            <span className="cap-half c-purple" />
            <span className="cap-half c-cyan" />
          </div>
          <div className="capsule-label">
            <ShieldCheckIcon size={14} className="icon-blue" />
            <span>Mediflow Verified</span>
          </div>
        </div>

        {/* Clean Corporate Glass Badges */}
        <div className="hero-glass-pill b-pos-1">
          <CheckCircleIcon size={15} className="icon-emerald" />
          <span>100% Authentic Quality</span>
        </div>

        <div className="hero-glass-pill b-pos-2">
          <RxDocumentIcon size={15} className="icon-blue" />
          <span>Fast Prescription Sync</span>
        </div>
      </div>
    </div>
  )
}
