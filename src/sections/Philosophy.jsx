import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote } from 'lucide-react'
import { PHILOSOPHY } from '../data/content'
import { segmentWords } from '../components/SplitWords'
import { usePrefersReducedMotion } from '../hooks/useDevice'

gsap.registerPlugin(ScrollTrigger)

function DeepParticles() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let w, h, raf
    const dots = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.3, s: Math.random() * 0.3 + 0.05 }))
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2)
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * d
      c.height = h * d
      ctx.setTransform(d, 0, 0, d, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    let visible = false
    const loop = (now) => {
      ctx.clearRect(0, 0, w, h)
      dots.forEach((p, i) => {
        p.y -= p.s * 0.0008
        if (p.y < -0.02) p.y = 1.02
        const x = (p.x + Math.sin(now * 0.0002 + i) * 0.01) * w
        ctx.fillStyle = `rgba(118,229,255,${0.15 + p.r * 0.2})`
        ctx.beginPath()
        ctx.arc(x, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      if (visible) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(loop)
    })
    io.observe(c)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}

const TRAIT_POS = [
  'left-[4%] top-[14%]',
  'right-[6%] top-[18%]',
  'left-[10%] bottom-[20%]',
  'right-[8%] bottom-[16%]',
  'left-[38%] top-[7%]',
  'left-1/2 -translate-x-1/2 bottom-[6%]',
]

export default function Philosophy() {
  const reduced = usePrefersReducedMotion()
  const wrap = useRef(null)
  const words = useMemo(() => segmentWords(PHILOSOPHY.quote), [])

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
      tl.fromTo('.ph-word', { opacity: 0.06, filter: 'blur(8px)', y: 12 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }, 0.05)
        .fromTo('.ph-author', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, '>-0.1')
        .fromTo('.ph-trait', { opacity: 0 }, { opacity: 1, stagger: 0.05, duration: 0.3 }, 0)
      gsap.utils.toArray('.ph-trait').forEach((el, i) => {
        gsap.to(el, { yPercent: (i % 2 ? -1 : 1) * 120, ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: true } })
      })
    }, wrap)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="philosophy" className="relative bg-abyss">
      <div ref={wrap} className={reduced ? 'relative' : 'relative h-[220vh]'}>
        <div className={`${reduced ? 'relative py-32' : 'sticky top-0 h-[100svh]'} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#0b2538_0%,#030912_60%)]" />
          {/* light shafts */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            {[18, 42, 66].map((l, i) => (
              <div
                key={l}
                className="absolute top-0 h-full w-40 origin-top bg-gradient-to-b from-ice/15 to-transparent blur-2xl"
                style={{ left: `${l}%`, transform: `rotate(${-12 + i * 10}deg)`, animation: `shaft ${5 + i * 2}s ease-in-out infinite alternate` }}
              />
            ))}
          </div>
          <DeepParticles />

          {PHILOSOPHY.traits.map((t, i) => (
            <span
              key={t}
              className={`ph-trait pointer-events-none absolute hidden max-w-[40vw] font-display text-2xl font-bold text-transparent md:block lg:text-4xl ${TRAIT_POS[i]}`}
              style={{ WebkitTextStroke: '1px rgba(118,229,255,0.28)' }}
            >
              {t}
            </span>
          ))}

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <div className="font-mono text-[11px] tracking-[0.4em] text-cyan">SECTION 09 // PERSONALITY & PHILOSOPHY</div>
            <Quote className="mx-auto mt-8 text-cyan/60" size={40} />
            <blockquote className="mt-6 font-display text-[clamp(1.6rem,4.6vw,3.6rem)] font-semibold leading-[1.45] text-foam" aria-label={PHILOSOPHY.quote}>
              {words.map((w, i) => (
                <span key={i} aria-hidden className="ph-word inline-block whitespace-pre">
                  {w}
                </span>
              ))}
            </blockquote>
            <div className="ph-author mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-cyan/60" />
              <span className="font-mono text-xs tracking-[0.4em] text-ice">ABYSSAL KING</span>
              <span className="h-px w-12 bg-cyan/60" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-3 px-4 pb-8 sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:px-10">
        {PHILOSOPHY.traits.map((t, i) => (
          <div key={t} className="glass hud-frame rounded-sm p-4 text-center transition-colors hover:border-cyan/40">
            <div className="font-mono text-[10px] text-cyan">TRAIT 0{i + 1}</div>
            <div className="mt-2 font-display text-[15px] font-semibold text-foam">{t}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
