import { ArrowDownToLine, AudioWaveform, Brain, Droplets, FlaskConical, Fish, Gauge, Microscope, Radar, Sparkles, Timer } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import { BIOLOGY } from '../data/content'
import { DepthDiagram, EchoDiagram } from '../visuals/BioDiagrams'
import { usePrefersReducedMotion } from '../hooks/useDevice'

const ICONS = { ArrowDownToLine, Timer, Radar, AudioWaveform, Brain, Fish, Droplets, Gauge }

export default function Biology() {
  const reduced = usePrefersReducedMotion()
  return (
    <section id="biology" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-abyss-2/60 to-transparent" />
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeader code="SECTION 03 // BIOLOGICAL INSPIRATION" title="SPERM WHALE" th="แรงบันดาลใจทางชีววิทยา — วาฬสเปิร์ม (Physeter macrocephalus)">
          ก่อนจะเข้าใจพลังของ ABYSSAL KING ต้องรู้จักสิ่งมีชีวิตต้นแบบเสียก่อน วาฬสเปิร์มคือหนึ่งในนักล่าที่ดำน้ำได้ลึกที่สุดของมหาสมุทร
        </SectionHeader>

        {/* Fact vs fiction separator */}
        <Reveal className="mb-10 grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-sm border border-ice/30 bg-ice/5 p-4">
            <Microscope className="mt-1 shrink-0 text-ice" size={22} />
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-ice">REAL-WORLD BIOLOGY</div>
              <p className="mt-1 text-sm text-foam/80">ข้อมูลในส่วนนี้เป็นคุณลักษณะทางชีววิทยาของวาฬสเปิร์มในโลกจริง</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-sm border border-cyan/20 border-dashed p-4">
            <Sparkles className="mt-1 shrink-0 text-cyan" size={22} />
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-cyan">FICTIONAL QUIRK</div>
              <p className="mt-1 text-sm text-steel">
                พลังของ ABYSSAL KING ในหัวข้อถัดไปเป็น<strong className="font-medium text-foam">เรื่องแต่ง</strong>ที่ได้แรงบันดาลใจจากข้อมูลเหล่านี้เท่านั้น ไม่ใช่ข้อเท็จจริงทางวิทยาศาสตร์
              </p>
            </div>
          </div>
        </Reveal>

        {/* diagrams */}
        <div className="mb-12 grid gap-6 lg:grid-cols-5">
          <Reveal dir="left" className="glass hud-frame overflow-hidden rounded-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-ice/10 px-4 py-3 font-mono text-[10px] tracking-[0.25em]">
              <span className="text-ice">FIG. 01 — DIVE PROFILE</span>
              <span className="text-steel">DEEP DIVING</span>
            </div>
            <div className="aspect-[34/40]">
              <DepthDiagram reduced={reduced} />
            </div>
          </Reveal>
          <div className="flex flex-col gap-6 lg:col-span-3">
            <Reveal dir="right" className="glass hud-frame overflow-hidden rounded-sm">
              <div className="flex items-center justify-between border-b border-ice/10 px-4 py-3 font-mono text-[10px] tracking-[0.25em]">
                <span className="text-ice">ECHOLOCATION MODEL</span>
                <span className="flex items-center gap-1.5 text-cyan">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" /> SIMULATION
                </span>
              </div>
              <div className="aspect-[40/22]">
                <EchoDiagram reduced={reduced} />
              </div>
            </Reveal>
            <Reveal dir="right" delay={0.1} className="glass rounded-sm p-5">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ice">
                <FlaskConical size={14} /> FIELD NOTE
              </div>
              <p className="thai-tight mt-3 text-[15px] text-foam/80">
                วาฬสเปิร์มใช้เสียงคลิกที่มีความเข้มสูงเพื่อตรวจจับเหยื่อและสื่อสาร และใช้คลื่นเสียงสะท้อนกลับเพื่อระบุตำแหน่ง
                ทำให้สามารถล่าเหยื่อในทะเลลึกที่มืดสนิทได้ เช่น ปลาหมึก — นี่คือรากฐานที่ PROJECT LEVIATHAN พยายามลอกเลียนแบบ
              </p>
            </Reveal>
          </div>
        </div>

        {/* 8 biology cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BIOLOGY.map((b, i) => {
            const Icon = ICONS[b.icon]
            return (
              <Reveal key={b.id} delay={(i % 4) * 0.08}>
                <TiltCard className="glass hud-frame h-full overflow-hidden rounded-sm p-5 transition-colors hover:border-ice/40">
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className="relative grid h-12 w-12 place-items-center rounded-full border border-ice/30 bg-ice/5">
                        <span className="absolute inset-0 rounded-full border border-ice/30 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
                        <Icon size={20} className="text-ice" />
                      </div>
                      <span className="font-mono text-2xl font-bold text-ice/15 transition-colors group-hover:text-ice/40">0{i + 1}</span>
                    </div>
                    <div className="mt-5 font-display text-lg font-bold tracking-wide text-foam">{b.en}</div>
                    <p className="thai-tight mt-2 flex-1 text-sm text-steel">{b.th}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-ice/10 pt-3">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-ice/70">REAL BIOLOGY</span>
                      <span className="font-mono text-xs text-ice">{b.metric}</span>
                    </div>
                  </div>
                  <svg className="absolute bottom-0 left-0 h-6 w-[200%] opacity-0 transition-opacity duration-500 group-hover:opacity-60 [animation:marquee_6s_linear_infinite]" viewBox="0 0 800 24" preserveAspectRatio="none">
                    <path d="M0 12 Q25 0 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 T450 12 T500 12 T550 12 T600 12 T650 12 T700 12 T750 12 T800 12" fill="none" stroke="#76e5ff" strokeWidth="1" />
                  </svg>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
