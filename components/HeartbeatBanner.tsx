'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Heart, Activity, ShieldCheck } from 'lucide-react'

// Generate a mathematically perfect parametric Wired Heart shape curve
const generateWiredHeartPoints = (centerX: number, centerY: number, scale: number) => {
  const pts: { x: number; y: number }[] = []
  const steps = 40
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    // Mathematical Parametric Heart Equation
    const rawX = 16 * Math.pow(Math.sin(t), 3)
    const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    pts.push({
      x: centerX + rawX * scale,
      y: centerY + rawY * scale,
    })
  }
  return pts
}

// Build high-precision ECG path with center Wired Heart loop at x = 570px
const HEART_CENTER_X = 570
const HEART_CENTER_Y = 100
const HEART_POINTS = generateWiredHeartPoints(HEART_CENTER_X, HEART_CENTER_Y, 2.2)

const BASE_POINTS = [
  { x: 0, y: 100 },
  { x: 140, y: 100 },
  { x: 160, y: 62 },
  { x: 175, y: 142 },
  { x: 195, y: 18 },
  { x: 215, y: 178 },
  { x: 235, y: 100 },
  { x: 330, y: 100 },
  { x: 345, y: 78 },
  { x: 360, y: 128 },
  { x: 375, y: 32 },
  { x: 390, y: 162 },
  { x: 405, y: 100 },
  { x: 470, y: 100 },

  // Embed Parametric Wired Heart Loop
  ...HEART_POINTS,

  { x: 670, y: 100 },

  // Right side ECG Spikes
  { x: 740, y: 100 },
  { x: 755, y: 62 },
  { x: 770, y: 142 },
  { x: 790, y: 18 },
  { x: 810, y: 178 },
  { x: 830, y: 100 },
  { x: 940, y: 100 },
  { x: 955, y: 78 },
  { x: 970, y: 128 },
  { x: 985, y: 40 },
  { x: 1000, y: 158 },
  { x: 1015, y: 100 },
  { x: 1200, y: 100 },
]

export function HeartbeatBanner({ onUploadClick }: { onUploadClick?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const [lineColor, setLineColor] = useState('#ef4444')
  const [heartColor, setHeartColor] = useState('#ef4444')
  const [heartPulse, setHeartPulse] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let startTime = performance.now()
    const SWEEP_DURATION = 8800 // 8.8s per sweep

    // Precalculate cumulative distances
    const distances: number[] = [0]
    let totalLength = 0
    for (let i = 1; i < BASE_POINTS.length; i++) {
      const dx = BASE_POINTS[i].x - BASE_POINTS[i - 1].x
      const dy = BASE_POINTS[i].y - BASE_POINTS[i - 1].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      totalLength += dist
      distances.push(totalLength)
    }

    const getPointAtDist = (d: number) => {
      const targetD = Math.max(0, Math.min(totalLength, d))
      for (let i = 1; i < distances.length; i++) {
        if (distances[i] >= targetD) {
          const prevD = distances[i - 1]
          const nextD = distances[i]
          const ratio = (targetD - prevD) / (nextD - prevD || 1)
          const p1 = BASE_POINTS[i - 1]
          const p2 = BASE_POINTS[i]
          return {
            x: p1.x + (p2.x - p1.x) * ratio,
            y: p1.y + (p2.y - p1.y) * ratio,
          }
        }
      }
      return BASE_POINTS[BASE_POINTS.length - 1]
    }

    const render = (now: number) => {
      const elapsed = now - startTime
      const cycleIndex = Math.floor(elapsed / SWEEP_DURATION)
      const isLeftToRight = cycleIndex % 2 === 0
      const progress = (elapsed % SWEEP_DURATION) / SWEEP_DURATION // 0 -> 1

      const headDist = isLeftToRight ? progress * totalLength : (1 - progress) * totalLength
      const headPoint = getPointAtDist(headDist)

      // ── DYNAMIC DOM BOUNDING BOX TOUCH ALIGNMENT ──
      let touchX = HEART_CENTER_X
      if (canvasRef.current && heartRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const heartRect = heartRef.current.getBoundingClientRect()
        if (canvasRect.width > 0) {
          const heartCenterPx = (heartRect.left + heartRect.width / 2) - canvasRect.left
          touchX = (heartCenterPx / canvasRect.width) * 1200
        }
      }

      let activeLineColor = '#ef4444'
      let activeHeartColor = '#ef4444'

      if (isLeftToRight) {
        if (headPoint.x < touchX) {
          activeLineColor = '#ef4444'
          activeHeartColor = '#ef4444'
          setHeartPulse(false)
        } else {
          activeLineColor = '#10b981'
          activeHeartColor = '#10b981'
          setHeartPulse(headPoint.x - touchX < 90)
        }
      } else {
        if (headPoint.x > touchX) {
          activeLineColor = '#10b981'
          activeHeartColor = '#10b981'
          setHeartPulse(false)
        } else {
          activeLineColor = '#ef4444'
          activeHeartColor = '#ef4444'
          setHeartPulse(touchX - headPoint.x < 90)
        }
      }

      setLineColor(activeLineColor)
      setHeartColor(activeHeartColor)

      // Canvas dimensions scaling
      const width = canvas.clientWidth || 1200
      const height = canvas.clientHeight || 200
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      ctx.clearRect(0, 0, width, height)

      const scaleX = width / 1200
      const scaleY = height / 200

      // 1. Background grid mesh (Ultra low opacity behind text)
      ctx.save()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      ctx.restore()

      // 2. Static baseline trace (REDUCED OPACITY 0.04 FOR x < 480 BEHIND TEXT)
      ctx.save()
      // Left segment (behind text copy x < 480)
      ctx.beginPath()
      ctx.moveTo(BASE_POINTS[0].x * scaleX, BASE_POINTS[0].y * scaleY)
      let splitIdx = 0
      for (let i = 1; i < BASE_POINTS.length; i++) {
        if (BASE_POINTS[i].x <= 480) {
          ctx.lineTo(BASE_POINTS[i].x * scaleX, BASE_POINTS[i].y * scaleY)
          splitIdx = i
        }
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)' // Reduced opacity behind text
      ctx.lineWidth = 2
      ctx.stroke()

      // Right segment (Wired heart & right side x >= 480)
      ctx.beginPath()
      ctx.moveTo(BASE_POINTS[splitIdx].x * scaleX, BASE_POINTS[splitIdx].y * scaleY)
      for (let i = splitIdx + 1; i < BASE_POINTS.length; i++) {
        ctx.lineTo(BASE_POINTS[i].x * scaleX, BASE_POINTS[i].y * scaleY)
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)' // Full trace opacity
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // 3. SINGLE LASER PULSE BEAM WITH REDUCED OPACITY (0.28) BEHIND TEXT
      const tailLength = 260
      const tailDist = isLeftToRight ? Math.max(0, headDist - tailLength) : Math.min(totalLength, headDist + tailLength)

      const pHead = getPointAtDist(headDist)
      const pTail = getPointAtDist(tailDist)

      ctx.save()
      ctx.lineWidth = 4.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = activeLineColor

      const stepCount = 50
      const startD = Math.min(headDist, tailDist)
      const endD = Math.max(headDist, tailDist)
      const step = (endD - startD) / stepCount

      for (let i = 1; i <= stepCount; i++) {
        const d1 = startD + (i - 1) * step
        const d2 = startD + i * step
        const pt1 = getPointAtDist(d1)
        const pt2 = getPointAtDist(d2)

        const segmentProgress = i / stepCount // 0 -> 1 along beam tail
        const isBehindText = pt2.x < 480

        // REDUCE OPACITY TO 0.28 BEHIND TEXT SECTION, FULL 1.0 OPACITY ELSEWHERE
        ctx.globalAlpha = isBehindText ? 0.28 : 1.0
        ctx.shadowBlur = isBehindText ? 6 : 20

        ctx.strokeStyle = activeLineColor
        ctx.lineWidth = isBehindText ? 3.0 : 4.5

        ctx.beginPath()
        ctx.moveTo(pt1.x * scaleX, pt1.y * scaleY)
        ctx.lineTo(pt2.x * scaleX, pt2.y * scaleY)
        ctx.stroke()
      }
      ctx.restore()

      // 4. Leading Pulse Head Orb (Softened when behind text)
      const isHeadBehindText = pHead.x < 480
      ctx.save()
      ctx.globalAlpha = isHeadBehindText ? 0.35 : 1.0
      ctx.beginPath()
      ctx.arc(pHead.x * scaleX, pHead.y * scaleY, isHeadBehindText ? 4 : 5.5, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = activeLineColor
      ctx.shadowBlur = isHeadBehindText ? 8 : 24
      ctx.fill()
      ctx.restore()

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        background: '#050c18',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '36px 28px',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dynamic Radial Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '46%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '240px',
          background: `radial-gradient(ellipse at center, ${heartColor}26 0%, rgba(5, 12, 24, 0) 75%)`,
          transition: 'background 0.3s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* HTML5 Canvas Single Laser Pulse Engine */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Container */}
      <div
        className="lazz-container"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1180px',
          flexWrap: 'wrap',
          gap: 36,
        }}
      >
        {/* Left Copy Panel */}
        <div style={{ maxWidth: '580px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                background: `${heartColor}1c`,
                color: heartColor,
                border: `1px solid ${heartColor}44`,
                fontSize: 10.5,
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
              }}
            >
              <Heart size={12} style={{ color: heartColor, fill: heartColor }} />
              24/7 LIVE PHARMACY HEALTHCARE
            </span>

            <span
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <ShieldCheck size={13} />
              Express 60-Min Delivery
            </span>
          </div>

          <h2
            style={{
              font: '800 25px/1.25 "DM Sans", sans-serif',
              color: '#ffffff',
              margin: '0 0 6px',
              letterSpacing: '-0.3px',
            }}
          >
            Empowering Health With Every Beat &amp; Prescription
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>
            100% Verified genuine OTC medicines, cold-chain insulin, and doctor prescription drugs delivered directly to your doorstep.
          </p>
        </div>

        {/* Central Beating Heart Icon with Ref for Dynamic DOM Measurement */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            ref={heartRef}
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${heartColor}38 0%, ${heartColor}08 70%)`,
              border: `1px solid ${heartColor}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: heartPulse ? `0 0 42px ${heartColor}` : `0 0 18px ${heartColor}44`,
              transform: heartPulse ? 'scale(1.26)' : 'scale(1)',
              transition: 'all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Heart size={30} style={{ color: heartColor, fill: heartColor, transition: 'all 0.25s ease' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
