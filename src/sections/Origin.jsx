import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AlertOctagon } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import SplitWords from '../components/SplitWords'
import StageArt from '../visuals/StageArt'
import { ORIGIN } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/useDevice'

gsap.registerPlugin(ScrollTrigger)

function Stage({ s, i }) {
  const left = i % 2 === 0
  const danger = s.scene === 'transform' || s.scene === 'rise'
  return (
    <div className="origin-stage relative grid items-center gap-6 md:grid-cols-2 md:gap-16">
      {/* node on the timeline */}
      <div className="origin-node absolute left-4 top-0 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
        <div className={`grid h-9 w-9 place-items-center rounded-full border-2 bg-abyss font-mono text-[10px] font-bold ${danger ? 'border-danger text-danger' : 'border-cyan text-cyan'}`}>
          {s.no}
        </div>
      </div>

      {/* trigger lives on an unclipped wrapper: IntersectionObserver ignores fully clip-pathed targets */}
      <motion.div
        className={`pl-12 md:pl-0 ${left ? 'md:order-1' : 'md:order-2'}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.div
          variants={{ hidden: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.3 }, show: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } }}
          transition={{ duration: 1.3, ease: [0.7, 0, 0.2, 1] }}
          className={`hud-frame relative aspect-[16/10] overflow-hidden rounded-sm border ${danger ? 'danger border-danger/30' : 'border-ice/15'}`}
        >
          <motion.div className="h-full w-full" variants={{ hidden: { scale: 1.25 }, show: { scale: 1 } }} transition={{ duration: 2.2, ease: 'easeOut' }}>
            <StageArt scene={s.scene} />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/60 to-transparent" />
          <div className="absolute left-3 top-3 rounded-sm bg-abyss/70 px-2 py-1 font-mono text-[9px] tracking-[0.25em] text-steel backdrop-blur">{s.log}</div>
        </motion.div>
      </motion.div>

      <div className={`pl-12 md:pl-0 ${left ? 'md:order-2' : 'md:order-1 md:text-right'}`}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }}>
          <div className={`font-mono text-[11px] tracking-[0.35em] ${danger ? 'text-danger' : 'text-cyan'}`}>STAGE {s.no}</div>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-wide text-foam md:text-4xl">
            <SplitWords text={s.en} stagger={0.06} />
          </h3>
          <div className="mt-1 font-display text-lg text-ice/80">{s.th}</div>
        </motion.div>
        <div className="mt-5 space-y-3">
          {s.text.map((p, k) => (
            <p key={k} className="thai-tight text-[15px] text-foam/85 md:text-base">
              <SplitWords text={p} stagger={0.012} delay={0.2 + k * 0.2} />
            </p>
          ))}
        </div>
        {s.changes && (
          <motion.div
            className="glass mt-6 rounded-sm border-danger/30 p-4 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-danger">
              <AlertOctagon size={13} /> การเปลี่ยนแปลง — PERMANENT MUTATION
            </div>
            <ul className="mt-3 grid gap-2">
              {s.changes.map((c, k) => (
                <motion.li
                  key={c}
                  className="flex items-start gap-3 text-sm text-foam/85"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + k * 0.12 }}
                >
                  <span className="mt-2 h-1 w-3 shrink-0 bg-danger" />
                  {c}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function Origin() {
  const root = useRef(null)
  const line = useRef(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.origin-track', start: 'top 60%', end: 'bottom 60%', scrub: true },
        },
      )
      gsap.utils.toArray('.origin-node').forEach((n) => {
        gsap.fromTo(n, { scale: 0.4, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(3)', scrollTrigger: { trigger: n, start: 'top 62%', toggleActions: 'play none none reverse' } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="origin" ref={root} className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1300px]">
        <SectionHeader code="SECTION 06 // ORIGIN STORY" title={ORIGIN.title} th={ORIGIN.subtitle} align="center">
          บันทึกลับที่ถูกกู้คืนจากฐานข้อมูลขององค์กรวิจัยที่ไม่เปิดเผยชื่อ
        </SectionHeader>

        <div className="origin-track relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-ice/10 md:left-1/2" />
          <div ref={line} className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-cyan via-cyan to-danger shadow-[0_0_12px_#00d9ff] md:left-1/2" />
          <div className="flex flex-col gap-24 md:gap-32">
            {ORIGIN.stages.map((s, i) => (
              <Stage key={s.no} s={s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
