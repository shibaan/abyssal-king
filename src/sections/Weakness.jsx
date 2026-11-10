import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, BatteryLow, Brain, Footprints, Radio, Thermometer, Target } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { WEAKNESSES } from '../data/content'

const ICONS = [Brain, Thermometer, Radio, Footprints, BatteryLow]
// marker positions on the scanner silhouette (viewBox 0 0 300 460)
const MARKS = [
  [150, 70],
  [150, 175],
  [196, 92],
  [120, 380],
  [204, 220],
]

function Scanner({ active, setActive }) {
  return (
    <div className="glass hud-frame danger relative overflow-hidden rounded-sm">
      <div className="flex items-center justify-between border-b border-danger/20 px-4 py-3 font-mono text-[10px] tracking-[0.25em]">
        <span className="flex items-center gap-2 text-danger">
          <Target size={12} /> TACTICAL SCAN
        </span>
        <span className="blink text-danger">● ANALYZING</span>
      </div>
      <div className="relative">
        <svg viewBox="0 0 300 460" className="mx-auto block h-[440px] w-full max-w-sm sm:h-[520px]">
          <defs>
            <linearGradient id="wk-sweep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff354d" stopOpacity="0" />
              <stop offset="1" stopColor="#ff354d" stopOpacity=".35" />
            </linearGradient>
            <pattern id="wk-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 H0 V20" fill="none" stroke="#ff354d" strokeOpacity=".08" />
            </pattern>
          </defs>
          <rect width="300" height="460" fill="url(#wk-grid)" />
          {/* wireframe silhouette */}
          <g fill="none" stroke="#76e5ff" strokeOpacity=".55" strokeWidth="1.2">
            <rect x="100" y="20" width="100" height="100" rx="26" />
            <path d="M110 50 H190 M106 80 H194" strokeOpacity=".2" />
            <rect x="128" y="118" width="44" height="12" rx="4" />
            <path d="M128 128 L130 135" />
            <path d="M90 140 Q150 125 210 140 L200 250 Q190 280 180 292 L120 292 Q110 280 100 250 Z" />
            <path d="M150 150 V285 M105 200 H195 M110 240 H190" strokeOpacity=".2" />
            <ellipse cx="70" cy="150" rx="30" ry="20" />
            <ellipse cx="230" cy="150" rx="30" ry="20" />
            <path d="M52 165 L42 270 L72 270 L84 170 M248 165 L258 270 L228 270 L216 170" />
            <rect x="34" y="270" width="44" height="38" rx="10" />
            <rect x="222" y="270" width="44" height="38" rx="10" />
            <path d="M120 292 L112 420 L140 420 L148 300 M180 292 L188 420 L160 420 L152 300" />
            <rect x="104" y="418" width="40" height="18" rx="5" />
            <rect x="156" y="418" width="40" height="18" rx="5" />
          </g>
          <circle cx="150" cy="70" r="12" fill="none" stroke="#00d9ff" strokeOpacity=".6" />
          {/* sweep */}
          <rect x="0" y="0" width="300" height="60" fill="url(#wk-sweep)">
            <animate attributeName="y" values="-60;460" dur="3.6s" repeatCount="indefinite" />
          </rect>
          {/* weak points */}
          {MARKS.map(([x, y], i) => {
            const on = active === i
            return (
              <g key={i} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="cursor-pointer">
                <circle cx={x} cy={y} r={on ? 20 : 12} fill="#ff354d" fillOpacity={on ? 0.2 : 0.1} stroke="#ff354d" strokeWidth={on ? 2 : 1} style={{ transition: 'all .3s' }} />
                <circle cx={x} cy={y} r="4" fill="#ff354d" />
                <circle cx={x} cy={y} r="12" fill="none" stroke="#ff354d">
                  <animate attributeName="r" values="12;30" dur="1.8s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values=".8;0" dur="1.8s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <text x={x + (x > 150 ? 24 : -24)} y={y + 4} textAnchor={x > 150 ? 'start' : 'end'} fill="#ff354d" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">
                  W-0{i + 1}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[9px] tracking-[0.2em] text-steel">
          <span>VULNERABILITIES: 05</span>
          <span className="text-danger">EXPLOITABLE</span>
        </div>
      </div>
    </div>
  )
}

export default function Weakness() {
  const [active, setActive] = useState(0)
  return (
    <section id="weakness" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,53,77,0.07),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader code="SECTION 08 // LIMITATIONS" title="WEAKNESS ANALYSIS" th="การวิเคราะห์จุดอ่อนเชิงยุทธวิธี — สำหรับหน่วยฮีโร่ภาคสนาม" danger />

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal dir="left" className="lg:col-span-5">
            <Scanner active={active} setActive={setActive} />
          </Reveal>
          <div className="flex flex-col gap-3 lg:col-span-7">
            {WEAKNESSES.map((w, i) => {
              const Icon = ICONS[i]
              const on = active === i
              return (
                <Reveal key={w.no} delay={i * 0.07} dir="right">
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`relative w-full overflow-hidden rounded-sm border p-5 text-left transition-all duration-300 ${
                      on ? 'border-danger/60 bg-danger/[0.07] shadow-[0_0_40px_-15px_rgba(255,53,77,0.7)]' : 'border-ice/10 bg-abyss-2/40 hover:border-danger/30'
                    }`}
                  >
                    {on && <motion.span layoutId="weak-bar" className="absolute inset-y-0 left-0 w-1 bg-danger shadow-[0_0_12px_#ff354d]" />}
                    <div className="flex items-start gap-4">
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-sm border ${on ? 'border-danger bg-danger/15' : 'border-danger/30'}`}>
                        <Icon size={20} className="text-danger" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div className="font-display text-lg font-bold tracking-wide text-foam md:text-xl">
                            <span className="mr-2 font-mono text-xs text-danger">W-{w.no}</span>
                            {w.en}
                          </div>
                          <span className="flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] text-danger">
                            <AlertTriangle size={11} /> {w.severity}% EXPLOIT
                          </span>
                        </div>
                        <p className="thai-tight mt-1.5 text-sm text-foam/80 md:text-[15px]">{w.th}</p>
                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-ice/10">
                          <motion.div
                            className="h-full bg-gradient-to-r from-danger/50 to-danger"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${w.severity}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2 + i * 0.1 }}
                          />
                        </div>
                        <motion.div
                          initial={false}
                          animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex items-center gap-2 border-t border-danger/20 pt-3 font-mono text-[11px] text-ice">
                            <span className="text-danger">TACTICAL NOTE ▸</span> <span className="font-body text-[13px]">{w.exploit}</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
