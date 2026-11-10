import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flame, RotateCcw } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import EnergyCanvas from '../visuals/EnergyCanvas'
import { BLACK_ABYSS, ULTIMATES } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/useDevice'

gsap.registerPlugin(ScrollTrigger)

function MoveSelector() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const u = ULTIMATES[active]

  useEffect(() => {
    if (!auto || reduced) return
    const id = setInterval(() => setActive((i) => (i + 1) % ULTIMATES.length), 5200)
    return () => clearInterval(id)
  }, [auto, reduced])

  const pick = (i) => {
    setAuto(false)
    setActive(i)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* list */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
        {ULTIMATES.map((m, i) => {
          const on = i === active
          return (
            <button
              key={m.no}
              onClick={() => pick(i)}
              onMouseEnter={() => pick(i)}
              className={`group relative shrink-0 border-ice/10 px-4 py-3 text-left transition-colors lg:border-b lg:px-0 lg:py-5 ${
                on ? 'text-foam' : 'text-steel hover:text-foam'
              } rounded-sm border lg:rounded-none lg:border-x-0 lg:border-t-0 ${on ? 'border-cyan/50 bg-cyan/5 lg:bg-transparent' : ''}`}
            >
              <div className="flex items-baseline gap-4">
                <span className={`font-mono text-xs ${on ? 'text-cyan' : 'text-steel'}`}>{m.no}</span>
                <span className={`font-display font-bold tracking-wide transition-all duration-500 ${on ? 'text-xl lg:text-4xl' : 'text-base lg:text-2xl'}`}>{m.en}</span>
              </div>
              {on && <motion.span layoutId="ult-bar" className="absolute -left-0 bottom-0 hidden h-px w-full bg-gradient-to-r from-cyan to-transparent shadow-[0_0_10px_#00d9ff] lg:block" />}
              {on && auto && !reduced && (
                <motion.span
                  key={`p${active}`}
                  className="absolute bottom-0 left-0 hidden h-[2px] bg-cyan lg:block"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5.2, ease: 'linear' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* stage */}
      <div className="glass hud-frame relative min-h-[420px] overflow-hidden rounded-sm lg:col-span-7 lg:min-h-[520px]">
        <EnergyCanvas mode={u.mode} reduced={reduced} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/30" />
        <AnimatePresence mode="wait">
          <motion.div
            key={u.no}
            className="absolute inset-x-0 bottom-0 p-6 md:p-8"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-cyan">
              <span>ULTIMATE {u.no}</span>
              <span className="h-px w-8 bg-cyan/50" />
              <span className="text-steel">{u.type}</span>
            </div>
            <div className="mt-3 font-display text-4xl font-bold leading-none tracking-tight text-foam text-glow md:text-6xl">{u.en}</div>
            <p className="thai-tight mt-4 max-w-lg text-base text-foam/85 md:text-lg">{u.th}</p>
          </motion.div>
        </AnimatePresence>
        <div className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.25em] text-steel">ENERGY SIM // LIVE</div>
      </div>
    </div>
  )
}

function BlackAbyss() {
  const reduced = usePrefersReducedMotion()
  const wrap = useRef(null)
  const stage = useRef(null)
  const title = useRef(null)
  const charge = useRef(null)
  const flash = useRef(null)
  const rings = useRef([])
  const progressRef = useRef(reduced ? 1 : 0)
  const burstRef = useRef(-1e9)
  const [pct, setPct] = useState(0)
  const released = useRef(false)

  const shake = () => {
    const el = stage.current
    if (!el || reduced) return
    el.classList.remove('shake')
    void el.offsetWidth
    el.classList.add('shake')
  }

  const replay = () => {
    burstRef.current = performance.now()
    shake()
    if (flash.current) gsap.fromTo(flash.current, { opacity: 0.9 }, { opacity: 0, duration: 1.1, ease: 'power2.out' })
    gsap.fromTo(rings.current, { scale: 0, opacity: 1 }, { scale: 6, opacity: 0, duration: 1.8, stagger: 0.08, ease: 'power3.out' })
  }

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            progressRef.current = self.progress
            setPct(Math.min(100, Math.round((self.progress / 0.5) * 100)))
            if (self.progress > 0.5 && !released.current) {
              released.current = true
              shake()
            } else if (self.progress < 0.45) released.current = false
          },
        },
      })
      tl.fromTo(title.current, { scale: 0.6, opacity: 0.15, letterSpacing: '0.6em' }, { scale: 1, opacity: 1, letterSpacing: '0.05em', duration: 0.5, ease: 'power2.in' }, 0)
        .fromTo(charge.current, { opacity: 1 }, { opacity: 0, duration: 0.05 }, 0.48)
        .fromTo(flash.current, { opacity: 0 }, { opacity: 0.95, duration: 0.03 }, 0.5)
        .to(flash.current, { opacity: 0, duration: 0.15 }, 0.53)
        .fromTo(rings.current, { scale: 0.05, opacity: 1 }, { scale: 6, opacity: 0, duration: 0.4, stagger: 0.02, ease: 'power2.out' }, 0.5)
        .to(title.current, { scale: 1.35, duration: 0.3 }, 0.5)
        .to(stage.current, { '--fade': 1, duration: 0.18 }, 0.82)
    }, wrap)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={wrap} className={reduced ? 'relative' : 'relative h-[260vh]'}>
      <div ref={stage} className={`${reduced ? 'relative h-[100svh]' : 'sticky top-0 h-[100svh]'} overflow-hidden bg-abyss`} style={{ '--fade': 0 }}>
        <EnergyCanvas mode="abyss" progressRef={progressRef} burstRef={burstRef} reduced={false} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030912_80%)]" />
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => (rings.current[i] = el)}
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-[25vmin] -mt-[25vmin] h-[50vmin] w-[50vmin] rounded-full border-2 border-cyan opacity-0 shadow-[0_0_40px_rgba(0,217,255,0.6),inset_0_0_40px_rgba(0,217,255,0.4)]"
          />
        ))}
        <div ref={flash} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#eaf7ff_0%,#00d9ff_40%,transparent_75%)] opacity-0 mix-blend-screen" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center gap-2 rounded-full border border-danger/50 bg-danger/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.35em] text-danger">
            <Flame size={12} /> {BLACK_ABYSS.tag}
          </div>
          <h3 ref={title} className="mt-6 font-display text-[clamp(3rem,13vw,11rem)] font-bold leading-none text-foam text-glow will-change-transform">
            {BLACK_ABYSS.en}
          </h3>
          <p className="thai-tight mt-6 max-w-2xl text-base text-foam/90 md:text-xl">{BLACK_ABYSS.th}</p>
          <div ref={charge} className="mt-8 w-64 max-w-full">
            <div className="flex justify-between font-mono text-[10px] tracking-[0.3em] text-cyan">
              <span>{reduced ? 'RELEASED' : 'CHARGING'}</span>
              <span>{reduced ? 100 : pct}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ice/10">
              <div className="h-full bg-cyan shadow-[0_0_12px_#00d9ff]" style={{ width: `${reduced ? 100 : pct}%` }} />
            </div>
          </div>
          <button
            onClick={replay}
            data-cursor="FIRE"
            className="mt-8 flex items-center gap-2 border border-cyan/50 bg-abyss/60 px-5 py-2.5 font-mono text-[11px] tracking-[0.3em] text-cyan backdrop-blur transition-all hover:bg-cyan hover:text-abyss"
          >
            <RotateCcw size={14} /> UNLEASH AGAIN
          </button>
        </div>
        {/* dramatic dive into the next section */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-abyss" style={{ opacity: 'var(--fade)' }} />
      </div>
    </div>
  )
}

export default function Ultimates() {
  return (
    <section id="ultimates" className="relative">
      <div className="px-4 py-24 sm:px-6 md:py-32 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader code="SECTION 05 // COMBAT SYSTEM" title="ULTIMATE MOVES" th="ระบบการต่อสู้ — ท่าไม้ตายแห่งห้วงลึก" />
          <Reveal>
            <MoveSelector />
          </Reveal>
          <Reveal className="mt-16 flex flex-col items-center gap-3 text-center">
            <span className="font-mono text-[10px] tracking-[0.4em] text-danger">WARNING — FINAL ULTIMATE DETECTED</span>
            <span className="h-16 w-px bg-gradient-to-b from-danger to-transparent" />
            <span className="text-sm text-steel">เลื่อนลงเพื่อปลดปล่อยพลัง</span>
          </Reveal>
        </div>
      </div>
      <BlackAbyss />
    </section>
  )
}
