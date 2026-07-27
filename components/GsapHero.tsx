'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function GsapHero() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.landing-orbit', { rotation: 0, transformOrigin: '50% 50%' }, { rotation: 360, duration: 28, repeat: -1, ease: 'none' })
      gsap.to('.landing-orbit-dot', { y: -12, x: 8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: .45 })
      gsap.to('.landing-particle', { opacity: .25, scale: .7, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: .3 })
    }, root)
    return () => ctx.revert()
  }, [])
  return <div className="gsap-hero-visual" ref={root} aria-hidden="true"><div className="landing-orbit"><span className="orbit-line orbit-one"/><span className="orbit-line orbit-two"/><span className="landing-orbit-dot dot-one"/><span className="landing-orbit-dot dot-two"/><span className="landing-orbit-dot dot-three"/></div><div className="hero-capsule capsule-one"/><div className="hero-capsule capsule-two"/><div className="hero-vial"><i/><b/></div><span className="landing-particle particle-one"/><span className="landing-particle particle-two"/><span className="landing-particle particle-three"/></div>
}
