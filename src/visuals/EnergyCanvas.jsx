import { useEffect, useRef } from 'react'

/**
 * 2D canvas energy effects for the Ultimate Moves.
 * modes: roar | silence | pressure | lock | impact | abyss
 * For 'abyss', progressRef.current (0..1) drives charge → release, burstRef.current is a timestamp for replay bursts.
 */
export default function EnergyCanvas({ mode, reduced = false, progressRef, burstRef, className = '' }) {
  const canvasRef = useRef(null)
  const modeRef = useRef(mode)
  const modeStart = useRef(0)

  useEffect(() => {
    modeRef.current = mode
    modeStart.current = performance.now()
  }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = false

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // particle pool
    const N = 220
    const parts = Array.from({ length: N }, () => ({ a: Math.random() * Math.PI * 2, r: Math.random(), s: 0.2 + Math.random(), z: Math.random() }))
    const targets = Array.from({ length: 5 }, (_, i) => ({ ph: i * 1.3, sp: 0.4 + Math.random() * 0.5, rx: 0.25 + Math.random() * 0.15, ry: 0.18 + Math.random() * 0.15 }))

    const ring = (x, y, r, alpha, width = 2, color = '0,217,255') => {
      if (r <= 0 || alpha <= 0) return
      ctx.strokeStyle = `rgba(${color},${alpha})`
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    const glow = (x, y, r, alpha, color = '0,217,255') => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(${color},${alpha})`)
      g.addColorStop(1, `rgba(${color},0)`)
      ctx.fillStyle = g
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    }

    const draw = (now) => {
      const t = now / 1000
      const lt = (now - modeStart.current) / 1000
      const m = modeRef.current
      const cx = w / 2
      const cy = h / 2
      const R = Math.hypot(w, h) / 2
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = m === 'silence' ? 'rgba(3,9,18,0.35)' : 'rgba(3,9,18,0.28)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      if (m === 'roar') {
        glow(cx, cy, 120, 0.5)
        for (let i = 0; i < 6; i++) {
          const p = ((t * 0.5 + i / 6) % 1)
          ring(cx, cy, p * R, (1 - p) * 0.9, 3 * (1 - p) + 1)
        }
        parts.forEach((q) => {
          const p = (q.r + t * 0.35 * q.s) % 1
          const rr = p * R
          ctx.fillStyle = `rgba(118,229,255,${(1 - p) * 0.8})`
          ctx.fillRect(cx + Math.cos(q.a) * rr, cy + Math.sin(q.a) * rr, 2, 2)
        })
      } else if (m === 'silence') {
        const p = (t * 0.18) % 1
        ring(cx, cy, p * R * 0.9, (1 - p) * 0.25, 1)
        glow(cx, cy, 30, 0.25)
        targets.forEach((tg, i) => {
          const x = cx + Math.cos(t * tg.sp * 0.4 + tg.ph) * w * tg.rx * 1.4
          const y = cy + Math.sin(t * tg.sp * 0.5 + tg.ph) * h * tg.ry * 1.6
          const d = Math.hypot(x - cx, y - cy)
          const hit = Math.abs(d - p * R * 0.9) < 30
          if (hit) {
            glow(x, y, 26, 0.6, '255,53,77')
            ring(x, y, 12, 0.7, 1, '255,53,77')
          } else {
            ctx.fillStyle = 'rgba(130,149,165,0.15)'
            ctx.fillRect(x - 1, y - 1, 2, 2)
          }
          if (i === 0) {
            ctx.font = '10px JetBrains Mono'
            ctx.fillStyle = 'rgba(118,229,255,0.35)'
            ctx.fillText('NOISE: 0 dB', 16, h - 16)
          }
        })
      } else if (m === 'pressure') {
        const cycle = lt % 3.2
        const charge = Math.min(1, cycle / 2.4)
        parts.forEach((q) => {
          const p = (1 - ((q.r + t * 0.45 * q.s) % 1)) * (1 - charge * 0.3)
          const a = q.a + p * 3
          const rr = p * R * 0.8
          ctx.fillStyle = `rgba(0,217,255,${(1 - p) * 0.9})`
          ctx.fillRect(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2, 2)
        })
        glow(cx, cy, 40 + charge * 120, 0.3 + charge * 0.6)
        ring(cx, cy, 20 + charge * 30, 0.8, 2)
        if (cycle > 2.4) {
          const k = (cycle - 2.4) / 0.8
          ring(cx, cy, k * R, (1 - k), 8 * (1 - k) + 1, '234,247,255')
          glow(cx, cy, R * k, (1 - k) * 0.5, '118,229,255')
        }
      } else if (m === 'lock') {
        glow(cx, cy, 50, 0.35)
        ring(cx, cy, 14, 0.9, 2)
        targets.forEach((tg, i) => {
          const x = cx + Math.cos(t * tg.sp + tg.ph) * w * tg.rx
          const y = cy + Math.sin(t * tg.sp * 1.3 + tg.ph) * h * tg.ry
          const locked = lt % 4 > i * 0.6 + 0.4
          ctx.strokeStyle = locked ? 'rgba(255,53,77,0.55)' : 'rgba(0,217,255,0.12)'
          ctx.lineWidth = 1
          ctx.setLineDash(locked ? [] : [4, 6])
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(x, y)
          ctx.stroke()
          ctx.setLineDash([])
          const s = locked ? 16 : 26 - Math.sin(t * 4) * 4
          ctx.strokeStyle = locked ? 'rgba(255,53,77,0.95)' : 'rgba(0,217,255,0.6)'
          ctx.lineWidth = 2
          ctx.strokeRect(x - s / 2, y - s / 2, s, s)
          ctx.fillStyle = locked ? '#ff354d' : 'rgba(234,247,255,0.6)'
          ctx.fillRect(x - 2, y - 2, 4, 4)
          if (locked) {
            ctx.font = '9px JetBrains Mono'
            ctx.fillText(`LOCK-0${i + 1}`, x + 12, y - 10)
          }
        })
      } else if (m === 'impact') {
        parts.forEach((q) => {
          const p = (q.r + t * 1.6 * q.s) % 1
          const y = q.z * h
          const x = w - p * w * 1.3
          ctx.strokeStyle = `rgba(118,229,255,${0.15 + q.s * 0.35})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + 40 + q.s * 80, y)
          ctx.stroke()
        })
        const bob = Math.sin(t * 8) * 3
        const hx = cx + 40
        glow(hx + 30, cy, 160, 0.45)
        ctx.fillStyle = 'rgba(42,56,70,0.95)'
        ctx.beginPath()
        ctx.roundRect(hx - 120, cy - 55 + bob, 150, 110, 30)
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,217,255,0.9)'
        ctx.lineWidth = 3
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(hx + 30 + i * 22, cy + bob, 50 + i * 18, -0.9, 0.9)
          ctx.globalAlpha = 1 - i * 0.3
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      } else if (m === 'abyss') {
        const pr = progressRef ? progressRef.current : 1
        const burst = burstRef ? (now - burstRef.current) / 1000 : 99
        const charge = Math.min(1, pr / 0.5)
        const release = pr > 0.5 ? Math.min(1, (pr - 0.5) / 0.35) : 0
        const b = burst < 2.2 ? burst / 2.2 : -1
        // converging charge particles
        parts.forEach((q) => {
          const p = 1 - ((q.r + t * 0.5 * q.s) % 1)
          const rr = p * R * (1.1 - charge * 0.6) * (1 - release)
          if (release >= 1) return
          ctx.fillStyle = `rgba(0,217,255,${(1 - p) * charge})`
          ctx.fillRect(cx + Math.cos(q.a + p) * rr, cy + Math.sin(q.a + p) * rr, 2, 2)
        })
        glow(cx, cy, 30 + charge * 160 + release * R, 0.15 + charge * 0.6 * (1 - release * 0.6))
        // release rings
        const k = b >= 0 ? b : release
        if (k > 0) {
          for (let i = 0; i < 9; i++) {
            const p = Math.max(0, k * 1.4 - i * 0.08)
            ring(cx, cy, p * R * 1.2, Math.max(0, 1 - p) * 0.9, 10 * Math.max(0, 1 - p) + 1, i % 3 === 0 ? '234,247,255' : '0,217,255')
          }
          if (k < 0.25) glow(cx, cy, R, (0.25 - k) * 3, '200,245,255')
        }
        // idle shimmer rings
        for (let i = 0; i < 3; i++) {
          const p = (t * 0.3 + i / 3) % 1
          ring(cx, cy, 20 + p * 120 * (0.5 + charge), (1 - p) * 0.4 * charge, 1)
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)
    if (reduced) requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [reduced, progressRef, burstRef])

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />
}
