import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, FileLock2, ScanEye, Waves } from 'lucide-react'
import { HERO } from '../data/content'
import { detectWebGL, useInViewport, useIsMobile, usePrefersReducedMotion } from '../hooks/useDevice'
import { useNavigate } from '../hooks/useNavigate'
import ErrorBoundary from '../components/ErrorBoundary'
import WhaleFallback from '../visuals/WhaleFallback'

const HeroScene = lazy(() => import('../three/HeroScene'))

function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[8%]">
      <WhaleFallback className="h-[70%] max-h-[640px] w-auto opacity-90" />
    </div>
  )
}

function LiveReadout({ label, base, unit, jitter = 3, decimals = 0 }) {
  const [v, setV] = useState(base)
  useEffect(() => {
    const id = setInterval(() => setV(base + (Math.random() - 0.5) * jitter), 900)
    return () => clearInterval(id)
  }, [base, jitter])
  return (
    <div className="border-l border-cyan/30 pl-3">
      <div className="font-mono text-[9px] tracking-[0.3em] text-steel">{label}</div>
      <div className="font-mono text-sm text-ice">
        {v.toFixed(decimals)}
        <span className="ml-1 text-[10px] text-steel">{unit}</span>
      </div>
    </div>
  )
}

export default function Hero({ ready }) {
  const navigate = useNavigate()
  const section = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const inView = useInViewport(section, '0px')
  const [webgl] = useState(() => detectWebGL())
  const [eventSource, setEventSource] = useState(null)

  // DOM parallax values
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const hudX = useTransform(sx, (v) => v * -14)
  const hudY = useTransform(sy, (v) => v * -10)
  const textX = useTransform(sx, (v) => v * 8)

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  useEffect(() => {
    setEventSource(section.current)
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.current.x = x
      pointer.current.y = y
      mx.set(x)
      my.set(y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  const title = HERO.title.split('')

  return (
    <section id="hero" ref={section} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* 3D layer */}
      <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : sceneScale }}>
        {webgl ? (
          <ErrorBoundary fallback={<Fallback />}>
            <Suspense fallback={<Fallback />}>
              {eventSource && <HeroScene pointer={pointer} reduced={reduced} mobile={mobile} active={inView} eventSource={eventSource} />}
            </Suspense>
          </ErrorBoundary>
        ) : (
          <Fallback />
        )}
      </motion.div>

      {/* legibility gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-abyss via-abyss/50 to-transparent md:via-abyss/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-abyss via-abyss/75 to-transparent md:h-1/3 md:via-abyss/60" />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* HUD layer */}
      <motion.div style={{ x: hudX, y: hudY }} className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-10 top-24 font-mono text-[10px] leading-relaxed tracking-[0.25em] text-steel">
          <div>SUBJECT ID // LVT-07</div>
          <div>LOC // 11°21′N 142°12′E</div>
          <div className="text-cyan">SIGNAL // LOCKED</div>
        </div>
        <div className="absolute right-12 top-28 flex flex-col gap-4 xl:right-20">
          <LiveReadout label="DEPTH" base={2250} unit="M" jitter={6} />
          <LiveReadout label="PRESSURE" base={226.4} unit="ATM" jitter={0.8} decimals={1} />
          <LiveReadout label="SONAR FREQ" base={18.6} unit="kHz" jitter={1.4} decimals={1} />
          <LiveReadout label="HEARTBEAT" base={22} unit="BPM" jitter={3} />
        </div>
        <svg className="absolute right-[24%] top-[18%] h-24 w-24 opacity-60" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#00d9ff" strokeOpacity=".4" strokeDasharray="4 6" />
          <path d="M50 4 V18 M50 82 V96 M4 50 H18 M82 50 H96" stroke="#00d9ff" />
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: reduced ? 0 : contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-4 pb-24 sm:px-6 md:justify-center md:pb-0 lg:px-10"
      >
        <motion.div style={{ x: textX }} className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-danger/40 bg-danger/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-danger backdrop-blur sm:text-[11px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-danger pulse-red" />
            {HERO.classification}
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(3.1rem,11vw,8.5rem)] font-bold leading-[0.9] tracking-tight" aria-label={HERO.title}>
            {title.map((c, i) => (
              <motion.span
                key={i}
                aria-hidden
                className={`inline-block ${c === ' ' ? 'w-[0.3em]' : ''} title-gradient`}
                initial={{ opacity: 0, y: 60, rotateX: -80, filter: 'blur(10px)' }}
                animate={ready ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 1, delay: 0.25 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {c === ' ' ? ' ' : c}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={ready ? { opacity: 1, letterSpacing: '0.08em' } : {}}
            transition={{ duration: 1.4, delay: 0.9 }}
            className="mt-3 font-display text-2xl font-semibold text-ice text-glow sm:text-3xl md:text-4xl"
          >
            {HERO.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-5 flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-steel"
          >
            <Waves size={16} className="text-cyan" />
            QUIRK : <span className="text-cyan">{HERO.quirk}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="thai-tight mt-6 max-w-xl border-l-2 border-cyan/50 pl-4 text-[15px] text-foam/85 sm:text-base md:text-lg"
          >
            {HERO.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 1.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate('profile')}
              data-cursor="OPEN"
              className="group relative overflow-hidden rounded-sm border border-cyan bg-cyan px-6 py-3.5 font-display text-sm font-bold tracking-[0.2em] text-abyss transition-shadow hover:shadow-[0_0_30px_rgba(0,217,255,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ScanEye size={16} /> EXPLORE CHARACTER
              </span>
              <span className="absolute inset-0 -translate-x-full bg-ice transition-transform duration-500 group-hover:translate-x-0" />
            </button>
            <button
              onClick={() => navigate('report')}
              data-cursor="DECRYPT"
              className="hud-frame group flex items-center gap-2 border border-ice/25 bg-abyss/40 px-6 py-3.5 font-display text-sm font-bold tracking-[0.2em] text-foam backdrop-blur transition-colors hover:border-cyan hover:text-cyan"
            >
              <FileLock2 size={16} /> CLASSIFIED FILE
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* sonar trigger + scroll hint */}
      <div className="absolute bottom-6 right-4 z-10 flex items-center gap-3 sm:right-6 lg:right-10">
        <button
          onClick={() => window.dispatchEvent(new Event('abyssal-sonar'))}
          data-cursor="PING"
          className="group flex items-center gap-2 rounded-full border border-cyan/40 bg-abyss/50 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-cyan backdrop-blur transition-all hover:border-cyan hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          EMIT SONAR
        </button>
      </div>
      <button
        onClick={() => navigate('profile')}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[9px] tracking-[0.4em] text-steel md:flex"
        aria-label="เลื่อนลง"
      >
        DIVE
        <ChevronDown size={16} className="animate-bounce text-cyan" />
      </button>
    </section>
  )
}
