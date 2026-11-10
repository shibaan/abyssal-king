import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lock, ShieldX, Siren } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import SplitWords from '../components/SplitWords'
import { REPORT } from '../data/content'
import { useNavigate } from '../hooks/useNavigate'

function TypeText({ text, start, speed = 28 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!start) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [start, text, speed])
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && start && <span className="blink">▌</span>}
    </span>
  )
}

function RadarChart() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const n = REPORT.radar.length
  const cx = 150
  const cy = 150
  const R = 105
  const pt = (i, v) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]
  }
  const poly = (v) => REPORT.radar.map((_, i) => pt(i, v).join(',')).join(' ')
  const data = REPORT.radar.map((d, i) => pt(i, d.v).join(',')).join(' ')
  return (
    <svg ref={ref} viewBox="0 0 300 300" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <polygon key={v} points={poly(v)} fill="none" stroke="#76e5ff" strokeOpacity=".15" />
      ))}
      {REPORT.radar.map((d, i) => {
        const [x, y] = pt(i, 1)
        const [lx, ly] = pt(i, 1.2)
        return (
          <g key={d.k}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#76e5ff" strokeOpacity=".12" />
            <text x={lx} y={ly} fill="#8295a5" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" dominantBaseline="middle">
              {d.k}
            </text>
          </g>
        )
      })}
      <motion.polygon
        points={data}
        fill="rgba(255,53,77,0.18)"
        stroke="#ff354d"
        strokeWidth="2"
        style={{ transformOrigin: '150px 150px', transformBox: 'view-box' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {REPORT.radar.map((d, i) => {
        const [x, y] = pt(i, d.v)
        return (
          <motion.circle key={d.k} cx={x} cy={y} r="3.5" fill="#ff354d" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1 + i * 0.08 }} />
        )
      })}
    </svg>
  )
}

function RangeBar() {
  return (
    <div>
      <div className="flex justify-between font-mono text-[9px] tracking-[0.2em] text-steel">
        <span>CLOSE</span>
        <span>MID</span>
        <span>LONG</span>
      </div>
      <div className="relative mt-2 h-3 rounded-full bg-ice/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-danger via-cyan to-cyan shadow-[0_0_14px_rgba(0,217,255,0.5)]"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {[0, 50, 100].map((p) => (
          <span key={p} className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-foam/50" style={{ left: `${p}%` }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 text-center text-[11px] text-steel">
        <span className="text-left">Melon Crusher</span>
        <span>Sonic Cannon</span>
        <span className="text-right">Sonar Vision</span>
      </div>
    </div>
  )
}

export default function ThreatReport() {
  const navigate = useNavigate()
  const tableRef = useRef(null)
  const tableIn = useInView(tableRef, { once: true, amount: 0.4 })
  const marquee = 'CLASSIFIED — ACCESS RESTRICTED ✦ '.repeat(8)

  return (
    <section id="report" className="relative overflow-hidden pt-24 md:pt-32">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader code="SECTION 10 // FINAL REPORT" title="THREAT REPORT" th="รายงานประเมินภัยคุกคามฉบับสมบูรณ์" danger />

          <div className="grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div ref={tableRef} className="glass-strong hud-frame danger relative overflow-hidden rounded-sm">
                <div className="scanline" />
                <div className="flex items-center justify-between border-b border-danger/20 px-5 py-3 font-mono text-[10px] tracking-[0.25em]">
                  <span className="flex items-center gap-2 text-danger">
                    <ShieldX size={13} /> VILLAIN DOSSIER // LVT-07
                  </span>
                  <span className="text-steel">REV. 9.4</span>
                </div>
                <dl className="divide-y divide-ice/10">
                  {REPORT.rows.map((r, i) => (
                    <div key={r.k} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:items-center sm:gap-4">
                      <dt className="font-mono text-[10px] tracking-[0.3em] text-steel">{r.k}</dt>
                      <dd className={`font-display text-lg font-bold tracking-wide md:text-xl ${r.danger ? 'text-danger text-glow-red' : 'text-foam'}`}>
                        <TypeText text={r.v} start={tableIn} speed={22 + i * 4} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <Reveal dir="right" className="glass hud-frame rounded-sm p-5">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em]">
                  <span className="text-cyan">COMBAT PROFILE</span>
                  <span className="text-danger">OVERALL: S+</span>
                </div>
                <RadarChart />
              </Reveal>
              <Reveal dir="right" delay={0.1} className="glass hud-frame rounded-sm p-5">
                <div className="mb-4 font-mono text-[10px] tracking-[0.3em] text-cyan">COMBAT RANGE — CLOSE TO LONG RANGE</div>
                <RangeBar />
              </Reveal>
            </div>
          </div>

          {/* Final verdict */}
          <div className="relative py-28 text-center md:py-40">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <span key={i} className="ring-expand absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] rounded-full border border-danger/30" style={{ animationDelay: `${i * 1.1}s`, animationDuration: '3.3s' }} />
              ))}
            </div>
            <h3 className="relative font-display text-[clamp(2.4rem,8vw,7rem)] font-bold leading-none tracking-tight text-foam">
              <SplitWords text="THE OCEAN HAS NO MERCY." stagger={0.1} />
            </h3>
            <Reveal delay={0.6} className="relative mt-6">
              <p className="font-display text-xl text-ice md:text-3xl">มหาสมุทรไม่เคยปรานีผู้ใด</p>
            </Reveal>
            <Reveal delay={0.9} className="relative mt-12 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('hero')}
                className="border border-ice/25 px-6 py-3 font-mono text-[11px] tracking-[0.3em] text-foam transition-colors hover:border-cyan hover:text-cyan"
              >
                RE-ENTER ARCHIVE ↑
              </button>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Red warning */}
      <div className="relative">
        <div className="hazard-stripes h-3" />
        <div className="relative overflow-hidden bg-danger/10 py-6">
          <motion.div
            className="pointer-events-none absolute inset-0 bg-danger/20"
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative flex items-center justify-center gap-3 px-4 text-center">
            <Siren className="shrink-0 text-danger" size={22} />
            <span className="font-display text-lg font-bold tracking-[0.25em] text-danger text-glow-red sm:text-2xl md:text-3xl">CLASSIFIED — ACCESS RESTRICTED</span>
            <Lock className="shrink-0 text-danger" size={20} />
          </div>
        </div>
        <div className="overflow-hidden border-y border-danger/30 bg-abyss py-2">
          <div className="marquee flex w-max whitespace-nowrap font-mono text-[11px] tracking-[0.35em] text-danger/80">
            <span>{marquee}</span>
            <span>{marquee}</span>
          </div>
        </div>
        <div className="hazard-stripes h-3" />
      </div>

      <footer className="px-4 py-10 text-center sm:px-6">
        <div className="font-display text-sm font-bold tracking-[0.3em] text-foam">ABYSSAL KING — ราชันแห่งห้วงลึก</div>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-steel">
          ตัวละครวายร้ายต้นฉบับ (Original Character) ที่สร้างขึ้นโดยได้รับแรงบันดาลใจจากโลกและแนวคิดการออกแบบตัวละครของ My Hero Academia
          ไม่มีความเกี่ยวข้องอย่างเป็นทางการกับผู้ถือลิขสิทธิ์ ข้อมูลชีววิทยาของวาฬสเปิร์มแยกจากพลัง Quirk ซึ่งเป็นเรื่องแต่งทั้งหมด
        </p>
        <div className="mt-4 font-mono text-[10px] tracking-[0.3em] text-steel/60">HERO INTELLIGENCE ARCHIVE // END OF FILE</div>
      </footer>
    </section>
  )
}
