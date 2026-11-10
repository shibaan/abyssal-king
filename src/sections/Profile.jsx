import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, Brain, EarOff, Fingerprint, Hourglass, ShieldAlert, Skull, Snowflake, Swords } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import { PROFILE } from '../data/content'

const LEVELS = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME']
const TRAIT_ICONS = [Snowflake, Brain, EarOff, Skull, Hourglass, Swords]

function ThreatGauge() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const cx = 150
  const cy = 150
  const r = 118
  const arc = (a0, a1, rad) => {
    const p = (a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]
    const [x0, y0] = p(a0)
    const [x1, y1] = p(a1)
    return `M${x0} ${y0} A${rad} ${rad} 0 0 1 ${x1} ${y1}`
  }
  const seg = Math.PI / LEVELS.length
  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 300 175" className="w-full">
        {LEVELS.map((l, i) => {
          const a0 = Math.PI + i * seg + 0.02
          const a1 = Math.PI + (i + 1) * seg - 0.02
          const danger = i >= 3
          return (
            <g key={l}>
              <motion.path
                d={arc(a0, a1, r)}
                fill="none"
                stroke={i === 4 ? '#ff354d' : danger ? '#ff7a5c' : '#00d9ff'}
                strokeWidth="14"
                strokeOpacity={i === 4 ? 1 : 0.35 + i * 0.1}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              />
              <text
                x={cx + (r - 30) * Math.cos(a0 + seg / 2)}
                y={cy + (r - 30) * Math.sin(a0 + seg / 2)}
                fill={i === 4 ? '#ff354d' : '#8295a5'}
                fontSize="8"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {l}
              </text>
            </g>
          )
        })}
        <path d={arc(Math.PI, Math.PI * 2, r + 14)} fill="none" stroke="#76e5ff" strokeOpacity=".15" strokeDasharray="2 5" />
        <motion.g
          initial={{ rotate: -90 }}
          animate={inView ? { rotate: [-90, 80, 68, 74] } : {}}
          transition={{ duration: 2.2, delay: 0.8, ease: 'easeOut' }}
        >
          {/* invisible symmetric circle keeps the group's bounding-box centered on the pivot */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="none" />
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 12} stroke="#ff354d" strokeWidth="3" strokeLinecap="round" />
          <circle cx={cx} cy={cy - r + 12} r="4" fill="#ff354d" />
        </motion.g>
        <circle cx={cx} cy={cy} r="10" fill="#071827" stroke="#ff354d" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="3" fill="#ff354d" />
      </svg>
      <div className="-mt-2 text-center">
        <div className="font-mono text-[10px] tracking-[0.35em] text-steel">DANGER CLASSIFICATION</div>
        <div className="font-display text-3xl font-bold tracking-[0.2em] text-danger text-glow-red">EXTREME</div>
      </div>
    </div>
  )
}

function StatBar({ label, th, value, i }) {
  const low = value < 50
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-foam/80">
          {label} <span className="ml-1 font-body text-[11px] tracking-normal text-steel">{th}</span>
        </span>
        <span className={`font-mono text-xs ${low ? 'text-steel' : 'text-cyan'}`}>{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ice/10">
        <motion.div
          className={`h-full rounded-full ${low ? 'bg-steel' : 'bg-gradient-to-r from-cyan/60 to-cyan shadow-[0_0_10px_#00d9ff]'}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export default function Profile() {
  return (
    <section id="profile" className="relative px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader code="SECTION 02 // CLASSIFIED FILE" title="CLASSIFIED FILE" th="แฟ้มข้อมูลลับของวายร้าย — เข้าถึงได้เฉพาะระดับสูงสุด">
          ข้อมูลประจำตัวที่ถูกรวบรวมโดยหน่วยข่าวกรองฮีโร่ ผู้ไม่ได้รับอนุญาตห้ามเปิดอ่านโดยเด็ดขาด
        </SectionHeader>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* identity */}
          <div className="lg:col-span-7">
            <Reveal className="glass hud-frame relative mb-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-sm p-5">
              <div className="scanline" />
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-cyan/40 bg-cyan/5">
                  <Fingerprint className="text-cyan" size={26} />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.3em] text-steel">FILE NO.</div>
                  <div className="font-display text-xl font-bold tracking-widest text-foam">LVT-07 / AK-∞</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.2em]">
                <span className="rounded-sm border border-danger/50 px-2 py-1 text-danger">TOP SECRET</span>
                <span className="rounded-sm border border-cyan/40 px-2 py-1 text-cyan">BIOMETRIC VERIFIED</span>
                <span className="rounded-sm bg-foam/10 px-2 py-1 text-steel">
                  ORIGIN: <span className="bg-steel/60 text-transparent select-none">██████</span>
                </span>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {PROFILE.fields.map((f, i) => (
                <Reveal key={f.key} delay={i * 0.06} className={i === 0 ? 'sm:col-span-2' : ''}>
                  <TiltCard className="glass hud-frame h-full rounded-sm p-5 transition-colors hover:border-cyan/40" data-cursor="DATA">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-[0.3em] text-steel">{f.key}</span>
                        <span className="font-mono text-[10px] text-cyan/60">0{i + 1}</span>
                      </div>
                      <div className={`mt-3 font-display font-bold tracking-wide text-foam transition-colors group-hover:text-cyan ${i === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                        {f.value}
                      </div>
                      <div className="mt-1 text-sm text-ice/70">{f.th}</div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>

          {/* danger panel */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal dir="right" className="glass-strong hud-frame danger relative overflow-hidden rounded-sm p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-danger">
                  <ShieldAlert size={14} /> THREAT ASSESSMENT
                </span>
                <span className="blink font-mono text-[10px] text-danger">● LIVE</span>
              </div>
              <ThreatGauge />
              <div className="mt-6 grid grid-cols-3 gap-2">
                {['LETHAL', 'EVASIVE', 'UNSTABLE'].map((t, i) => (
                  <div key={t} className="flex items-center justify-center gap-1.5 rounded-sm border border-danger/30 bg-danger/5 py-2 font-mono text-[9px] tracking-[0.15em] text-danger">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" style={{ animation: `blink 1s steps(2,start) ${i * 0.33}s infinite` }} />
                    {t}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal dir="right" delay={0.1} className="glass hud-frame rounded-sm p-6">
              <div className="mb-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyan">
                <AlertTriangle size={14} /> COMBAT METRICS
                <span className="ml-auto text-steel">IN-UNIVERSE EST.</span>
              </div>
              <div className="flex flex-col gap-4">
                {PROFILE.threatStats.map((s, i) => (
                  <StatBar key={s.label} {...s} i={i} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* personality */}
        <div className="mt-14">
          <Reveal className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.35em] text-cyan">PERSONALITY PROFILE</span>
            <span className="h-px flex-1 bg-gradient-to-r from-cyan/40 to-transparent" />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {PROFILE.personality.map((p, i) => {
              const Icon = TRAIT_ICONS[i]
              return (
                <Reveal key={p.en} delay={i * 0.07} dir="scale">
                  <TiltCard className="glass h-full rounded-sm p-4 transition-colors hover:border-cyan/50" max={12}>
                    <div className="relative z-10">
                      <Icon size={22} className="text-cyan transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" />
                      <div className="mt-4 font-display text-sm font-bold tracking-wide text-foam">{p.en}</div>
                      <div className="mt-1 text-[13px] leading-relaxed text-steel">{p.th}</div>
                    </div>
                  </TiltCard>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
