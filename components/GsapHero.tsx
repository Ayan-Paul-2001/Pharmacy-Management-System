'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function GsapHero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const particlesRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    // GSAP Context for memory safety & easy cleanup
    const ctx = gsap.context(() => {
      // 1. Slow breathing float & scale for the background hero image
      gsap.to(imgRef.current, {
        scale: 1.06,
        y: -10,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // 2. Continuous rotating energy ring & floating elements
      gsap.to('.hero-ring', {
        rotation: 360,
        duration: 35,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })

      gsap.to('.floating-pill-1', {
        y: -18,
        x: 12,
        rotation: 15,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.floating-pill-2', {
        y: 16,
        x: -10,
        rotation: -20,
        duration: 5.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      })

      gsap.to('.glowing-orb-1', {
        opacity: 0.85,
        scale: 1.25,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.glowing-orb-2', {
        opacity: 0.9,
        scale: 1.3,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8,
      })

      // 3. Mouse Parallax effect over background image
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        const moveX = (clientX / window.innerWidth - 0.5) * 25
        const moveY = (clientY / window.innerHeight - 0.5) * 25

        gsap.to(imgRef.current, {
          x: moveX,
          y: moveY - 5,
          duration: 1.5,
          ease: 'power2.out',
        })

        gsap.to('.parallax-layer-front', {
          x: moveX * 1.8,
          y: moveY * 1.8,
          duration: 1.2,
          ease: 'power2.out',
        })
      }

      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }, rootRef)

    // Canvas particle system for ambient pharmaceutical sparks & floating dots
    const canvas = particlesRef.current
    if (canvas) {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        let animationFrameId: number
        const width = (canvas.width = window.innerWidth)
        const height = (canvas.height = window.innerHeight)

        const particles = Array.from({ length: 38 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          speedY: Math.random() * -0.4 - 0.1,
          speedX: (Math.random() - 0.5) * 0.3,
          color: Math.random() > 0.5 ? '#5aa0ff' : '#45e0b0',
        }))

        const render = () => {
          ctx2d.clearRect(0, 0, width, height)
          particles.forEach((p) => {
            p.y += p.speedY
            p.x += p.speedX
            if (p.y < 0) {
              p.y = height + 10
              p.x = Math.random() * width
            }
            ctx2d.beginPath()
            ctx2d.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx2d.fillStyle = p.color
            ctx2d.globalAlpha = p.alpha
            ctx2d.shadowBlur = 12
            ctx2d.shadowColor = p.color
            ctx2d.fill()
          })
          animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
          cancelAnimationFrame(animationFrameId)
          ctx.revert()
        }
      }
    }

    return () => ctx.revert()
  }, [])

  return (
    <div className="gsap-hero-container" ref={rootRef} aria-hidden="true">
      {/* Background Image with GSAP Zoom/Parallax */}
      <div className="hero-bg-wrapper">
        <img
          ref={imgRef}
          src="/pharma-hero.png"
          alt="Mediflow Background"
          className="hero-bg-img"
        />
        <div className="hero-vignette-overlay" />
        <div className="hero-light-sweep" />
      </div>

      {/* Floating Canvas Particles */}
      <canvas ref={particlesRef} className="hero-particle-canvas" />

      {/* Parallax Floating Biotech Graphics & Orbs */}
      <div className="parallax-layer-front">
        <div className="hero-ring" />
        <div className="glowing-orb-1" />
        <div className="glowing-orb-2" />

        {/* Dynamic Glass Pill Badges */}
        <div className="floating-pill-1 glass-badge">
          <span className="pill-dot blue" />
          <span>99.9% Compliance</span>
        </div>

        <div className="floating-pill-2 glass-badge">
          <span className="pill-dot mint" />
          <span>Realtime Sync</span>
        </div>
      </div>
    </div>
  )
}
