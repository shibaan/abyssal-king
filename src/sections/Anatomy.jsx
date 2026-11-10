import { lazy, Suspense, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand, Move3d, ScanLine } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import ErrorBoundary from '../components/ErrorBoundary'
import WhaleFallback from '../visuals/WhaleFallback'
import { ANATOMY, COSTUME } from '../data/content'
import { detectWebGL, useInViewport, useIsMobile, usePrefersReducedMotion } from '../hooks/useDevice'

const AnatomyScene = lazy(() => import('../three/AnatomyScene'))

// approximate 2D hotspot positions for the SVG fallback (percent of the illustration box)
const FALLBACK_POS = {
  forehead: [50, 17], eyes: [66, 26], neck: [38, 36], body: [50, 46], arms: [79, 62], armor: [56, 64], sonar: [36, 16], back: [27, 52],
}

function FallbackStage({ selected, onSelect }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="relative aspect-[2/3] h-full max-h-full">
        <WhaleFallback className="h-full w-full" />
        {ANATOMY.map((a, i) => {
          const [x, y] = FALLBACK_POS[a.id]
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className={`absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[10px] font-bold text-cyan ${selected === a.id ? 'border-cyan bg-cyan/30' : 'border-cyan/60 bg-abyss/70'}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={a.en}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Anatomy() {
  const [selected, setSelected] = useState(ANATOMY[0].id)
  const stageRef = useRef(null)
  const inView = useInViewport(stageRef, '100px')
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const [webgl] = useState(() => detectWebGL())
  const current = ANATOMY.find((a) => a.id === selected)
  const index = ANATOMY.findIndex((a) => a.id === selected)
  // lazy-mount the WebGL scene the first time the stage approaches the viewport, then keep it alive
  const [mounted, setMounted] = useState(false)
  if (inView && !mounted) setMounted(true)

  return (
    <section id="anatomy" className="relative px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader code="SECTION 07 // VISUAL ANATOMY" title="CHARACTER DESIGN" th="การออกแบบตัวละคร — วิเคราะห์โครงสร้างร่างกาย">
          ลากเพื่อหมุนโมเดล 3D และแตะจุด Hotspot เพื่อดูรายละเอียดของแต่ละส่วน
        </SectionHeader>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 3D stage */}
          <Reveal dir="scale" className="lg:col-span-7">
            <div ref={stageRef} className="glass hud-frame relative h-[520px] overflow-hidden rounded-sm sm:h-[600px] lg:h-[680px]">
              <div className="grid-lines absolute inset-0 opacity-50" />
              <div className="scanline" />
              {webgl ? (
                <ErrorBoundary fallback={<FallbackStage selected={selected} onSelect={setSelected} />}>
                  <Suspense fallback={<FallbackStage selected={selected} onSelect={setSelected} />}>
                    {mounted ? (
                      <AnatomyScene selected={selected} onSelect={setSelected} active={inView} mobile={mobile} reduced={reduced} />
                    ) : null}
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <FallbackStage selected={selected} onSelect={setSelected} />
              )}
              <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] leading-relaxed tracking-[0.25em] text-steel">
                <div className="flex items-center gap-2 text-cyan">
                  <ScanLine size={12} /> BODY SCAN ACTIVE
                </div>
                <div>MODEL // LVT-07-A</div>
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-steel">
                {mobile ? <Hand size={13} /> : <Move3d size={13} />} DRAG TO ROTATE
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] text-cyan">
                {String(index + 1).padStart(2, '0')} / {String(ANATOMY.length).padStart(2, '0')}
              </div>
            </div>
          </Reveal>

          {/* details */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="glass-strong hud-frame relative min-h-[190px] overflow-hidden rounded-sm p-6">
              <AnimatePresence mode="wait">
                <motion.div key={current.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
                  <div className="font-mono text-[10px] tracking-[0.3em] text-cyan">FEATURE {String(index + 1).padStart(2, '0')}</div>
                  <div className="mt-2 font-display text-2xl font-bold tracking-wide text-foam">{current.en}</div>
                  <div className="text-ice/90">{current.th}</div>
                  <p className="thai-tight mt-3 text-[15px] text-foam/80">{current.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ANATOMY.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  className={`group flex items-center gap-3 rounded-sm border px-3 py-2.5 text-left transition-all ${
                    selected === a.id ? 'border-cyan/60 bg-cyan/10' : 'border-ice/10 bg-abyss-2/40 hover:border-ice/30'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${selected === a.id ? 'text-cyan' : 'text-steel'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[13px] leading-tight text-foam/85">{a.th}</span>
                </button>
              ))}
            </div>
            <Reveal className="glass rounded-sm p-5">
              <div className="font-mono text-[10px] tracking-[0.3em] text-cyan">COSTUME DESIGN</div>
              <div className="mt-4 flex flex-col gap-3">
                {COSTUME.map((c) => (
                  <div key={c.en} className="group flex items-center gap-3">
                    <span
                      className="h-8 w-8 shrink-0 rounded-sm border border-ice/20 transition-transform group-hover:scale-110"
                      style={{ background: c.color, boxShadow: c.color === '#00d9ff' ? '0 0 14px #00d9ff' : 'none' }}
                    />
                    <div className="min-w-0">
                      <div className="font-display text-sm font-semibold text-foam">{c.en}</div>
                      <div className="text-xs text-steel">{c.th}</div>
                    </div>
                    <span className="ml-auto font-mono text-[10px] uppercase text-steel">{c.color}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
