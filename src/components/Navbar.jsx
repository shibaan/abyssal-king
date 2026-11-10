import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Radio } from 'lucide-react'
import { NAV_ITEMS } from '../data/content'
import { useNavigate } from '../hooks/useNavigate'

function useActiveSection() {
  const [active, setActive] = useState('hero')
  useEffect(() => {
    const els = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

/** Vertical depth gauge: page scroll mapped to dive depth. */
function DepthGauge() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const height = useTransform(smooth, (v) => `${v * 100}%`)
  const [depth, setDepth] = useState(0)
  useMotionValueEvent(smooth, 'change', (v) => setDepth(Math.round(v * 3000)))
  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
      <span className="font-mono text-[9px] tracking-[0.3em] text-steel [writing-mode:vertical-rl]">DEPTH</span>
      <div className="relative h-48 w-px bg-ice/15">
        <motion.div style={{ height }} className="absolute left-0 top-0 w-px bg-cyan shadow-[0_0_8px_#00d9ff]" />
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <span key={p} className="absolute -left-1 h-px w-2 bg-ice/30" style={{ top: `${p * 100}%` }} />
        ))}
      </div>
      <span className="font-mono text-[10px] text-cyan">{depth.toLocaleString()}m</span>
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress, scrollY } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  const go = (id) => {
    setOpen(false)
    navigate(id)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-ice/10 bg-abyss/70 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <motion.div style={{ scaleX: bar }} className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-cyan via-ice to-danger" />
        <nav className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <button onClick={() => go('hero')} className="group flex items-center gap-3" data-cursor="TOP">
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-cyan/50">
              <span className="absolute inset-1 rounded-full border border-cyan/30 transition-transform duration-500 group-hover:scale-125" />
              <Radio size={15} className="text-cyan" />
            </span>
            <span className="text-left leading-none">
              <span className="block font-display text-sm font-bold tracking-[0.25em] text-foam">ABYSSAL KING</span>
              <span className="mt-1 block font-mono text-[9px] tracking-[0.3em] text-steel">HERO INTEL ARCHIVE</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.slice(1).map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => go(n.id)}
                  className={`relative px-3 py-2 font-mono text-[11px] tracking-[0.2em] transition-colors ${
                    active === n.id ? 'text-cyan' : 'text-steel hover:text-foam'
                  }`}
                >
                  {n.label}
                  {active === n.id && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-2 -bottom-0.5 h-px bg-cyan shadow-[0_0_8px_#00d9ff]" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-danger/40 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-danger sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-danger pulse-red" /> EXTREME
            </span>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-ice/20 text-foam lg:hidden"
              aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[45] bg-abyss/95 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
          >
            <div className="grid-lines absolute inset-0 opacity-30" />
            <ul className="relative flex h-full flex-col justify-center gap-1 px-8 pt-16">
              {NAV_ITEMS.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                  <button onClick={() => go(n.id)} className="flex w-full items-baseline gap-4 border-b border-ice/10 py-3 text-left">
                    <span className="font-mono text-[10px] text-cyan">{String(i).padStart(2, '0')}</span>
                    <span className={`font-display text-2xl font-bold tracking-wider ${active === n.id ? 'text-cyan' : 'text-foam'}`}>{n.label}</span>
                    <span className="ml-auto text-sm text-steel">{n.th}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <DepthGauge />
    </>
  )
}
