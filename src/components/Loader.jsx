import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  'ESTABLISHING SECURE LINK…',
  'DECRYPTING HERO INTELLIGENCE ARCHIVE…',
  'LOADING SUBJECT LVT-07 BIOMETRICS…',
  'CALIBRATING SONAR SIGNATURE…',
  'ACCESS GRANTED',
]

export default function Loader({ onDone, fast }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const duration = fast ? 500 : 2600
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      // eased, slightly irregular progress
      const eased = 1 - Math.pow(1 - p, 2.4)
      setProgress(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, fast ? 50 : 450)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone, fast])

  const lineIndex = Math.min(LINES.length - 1, Math.floor((progress / 100) * LINES.length))

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-abyss"
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] } }}
    >
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative h-44 w-44 md:h-56 md:w-56">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="ring-expand absolute left-1/2 top-1/2 h-full w-full rounded-full border border-cyan/60"
              style={{ animationDelay: `${i * 1.05}s` }}
            />
          ))}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(118,229,255,0.12)" strokeWidth="1" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#00d9ff"
              strokeWidth="1.5"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div className="font-display text-5xl font-bold text-foam text-glow md:text-6xl">{progress}</div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-cyan">PERCENT</div>
            </div>
          </div>
        </div>
        <div className="mt-10 font-display text-2xl font-bold tracking-[0.3em] text-foam md:text-3xl">ABYSSAL KING</div>
        <div className="mt-2 font-display text-sm text-ice/80">ราชันแห่งห้วงลึก</div>
        <div className="mt-6 h-5 font-mono text-[11px] tracking-[0.25em] text-cyan">
          {LINES[lineIndex]}
          <span className="blink">_</span>
        </div>
        <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-danger">
          <span className="h-1.5 w-1.5 rounded-full bg-danger pulse-red" /> CLASSIFIED — LEVEL 9 CLEARANCE
        </div>
      </div>
    </motion.div>
  )
}
