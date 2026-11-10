import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor, ChevronLeft, ChevronRight, Crosshair, Dna, Droplet, Maximize2, Radar, ShieldHalf, Sparkles, Volume2, X, Zap } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import AbilityViz from '../visuals/AbilityViz'
import { ABILITIES } from '../data/content'
import { useLenis } from '../hooks/useNavigate'

const ICONS = [Radar, Volume2, ShieldHalf, Anchor, Crosshair, Zap, Droplet]

function PowerMeter({ value, segments = 20 }) {
  const on = Math.round((value / 100) * segments)
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={`h-3 flex-1 rounded-[1px] transition-all duration-500 ${i < on ? (i > segments * 0.85 ? 'bg-danger' : 'bg-cyan') : 'bg-ice/10'}`}
          style={{ transitionDelay: `${i * 20}ms` }}
        />
      ))}
    </div>
  )
}

function AbilityModal({ index, onClose, onNav }) {
  const a = ABILITIES[index]
  const Icon = ICONS[index]
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-abyss/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={a.en}
    >
      <motion.div
        layoutId={`ability-${a.id}`}
        className="glass-strong hud-frame relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-xl sm:rounded-sm"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square border-b border-ice/10 md:border-b-0 md:border-r">
            <AbilityViz type={a.viz} />
            <div className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.3em] text-cyan">VISUALIZATION // {a.no}</div>
            <div className="scanline" />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] text-cyan">ABILITY {a.no}</div>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-wide text-foam md:text-4xl">{a.en}</h3>
                <div className="mt-1 font-display text-xl text-ice">{a.th}</div>
              </div>
              <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ice/20 text-foam transition-colors hover:border-cyan hover:text-cyan" aria-label="ปิด">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-3 text-[15px] text-foam/85">
              {a.detail.map((p, i) => (
                <motion.p key={i} className="thai-tight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  {p}
                </motion.p>
              ))}
            </div>
            <div className="mt-6">
              <div className="font-mono text-[10px] tracking-[0.3em] text-steel">COMBAT APPLICATION</div>
              <ul className="mt-2 grid gap-2">
                {a.combat.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-foam/80">
                    <Icon size={14} className="text-cyan" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-ice/25 bg-ice/5 p-3">
                <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-ice">
                  <Dna size={12} /> BIOLOGICAL INSPIRATION (REAL)
                </div>
                <div className="mt-1 font-display text-sm font-semibold text-foam">{a.bio}</div>
                <div className="mt-1 text-xs text-steel">{a.bioTh}</div>
              </div>
              <div className="rounded-sm border border-dashed border-cyan/25 p-3">
                <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-cyan">
                  <Sparkles size={12} /> QUIRK ABILITY (FICTION)
                </div>
                <div className="mt-1 text-xs leading-relaxed text-steel">พลังนี้เป็นเรื่องแต่งในจักรวาลของตัวละคร ไม่ใช่ความสามารถของวาฬจริง</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.3em]">
                <span className="text-steel">POWER LEVEL</span>
                <span className="text-cyan">{a.power} / 100</span>
              </div>
              <PowerMeter value={a.power} />
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-ice/10 pt-4">
              <button onClick={() => onNav(-1)} className="flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] text-steel transition-colors hover:text-cyan">
                <ChevronLeft size={16} /> PREV
              </button>
              <span className="font-mono text-[10px] text-steel">
                {a.no} / 0{ABILITIES.length}
              </span>
              <button onClick={() => onNav(1)} className="flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] text-steel transition-colors hover:text-cyan">
                NEXT <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Quirk() {
  const [open, setOpen] = useState(null)
  const lenis = useLenis()

  const close = useCallback(() => setOpen(null), [])
  const nav = useCallback((d) => setOpen((i) => (i + d + ABILITIES.length) % ABILITIES.length), [])

  useEffect(() => {
    if (open === null) return
    lenis.current?.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') nav(1)
      if (e.key === 'ArrowLeft') nav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      lenis.current?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, nav, lenis])

  return (
    <section id="quirk" className="relative px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader code="SECTION 04 // QUIRK SYSTEM" title="DEEP SEA PREDATOR" th="ระบบอัตลักษณ์ — 7 ความสามารถของนักล่าแห่งทะเลลึก">
          คลิกที่การ์ดเพื่อเปิดข้อมูลเชิงลึกและภาพจำลองการทำงานของแต่ละความสามารถ
        </SectionHeader>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ABILITIES.map((a, i) => {
            const Icon = ICONS[i]
            const wide = i === 0
            return (
              <Reveal key={a.id} delay={(i % 4) * 0.08} className={wide ? 'sm:col-span-2' : ''}>
                <motion.div layoutId={`ability-${a.id}`} className="h-full">
                  <TiltCard
                    as="button"
                    onClick={() => setOpen(i)}
                    data-cursor="EXPAND"
                    className="glass hud-frame flex h-full w-full flex-col overflow-hidden rounded-sm text-left transition-[border-color,box-shadow] duration-300 hover:border-cyan/50 hover:shadow-[0_0_40px_-10px_rgba(0,217,255,0.5)]"
                  >
                    <div className={`relative overflow-hidden border-b border-ice/10 h-44`}>
                      <div className="absolute inset-0 scale-100 opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100">
                        <AbilityViz type={a.viz} slice />
                      </div>
                      <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-cyan/40 bg-abyss/70 backdrop-blur">
                        <Icon size={16} className="text-cyan transition-transform duration-500 group-hover:scale-125" />
                      </div>
                      <Maximize2 size={14} className="absolute right-3 top-3 text-ice/50 transition-colors group-hover:text-cyan" />
                    </div>
                    <div className="relative z-10 flex flex-1 flex-col p-5">
                      <div className="font-mono text-[10px] tracking-[0.3em] text-cyan">ABILITY {a.no}</div>
                      <div className={`mt-2 font-display font-bold tracking-wide text-foam ${wide ? 'text-3xl' : 'text-xl'}`}>{a.en}</div>
                      <div className="text-ice/90">{a.th}</div>
                      <p className={`thai-tight mt-3 flex-1 text-sm text-steel ${wide ? '' : 'line-clamp-3'}`}>{a.desc}</p>
                      <div className="mt-4 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-ice/70">
                        <Dna size={11} /> {a.bio}
                      </div>
                      <div className="mt-3">
                        <div className="mb-1.5 flex justify-between font-mono text-[9px] tracking-[0.25em]">
                          <span className="text-steel">POWER</span>
                          <span className="text-cyan">{a.power}</span>
                        </div>
                        <PowerMeter value={a.power} segments={wide ? 24 : 14} />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
      <AnimatePresence>{open !== null && <AbilityModal key="modal" index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  )
}
