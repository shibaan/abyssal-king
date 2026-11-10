import Reveal from './Reveal'
import SplitWords from './SplitWords'

export default function SectionHeader({ code, title, th, align = 'left', danger = false, children }) {
  const center = align === 'center'
  return (
    <div className={`mb-12 max-w-4xl md:mb-16 ${center ? 'mx-auto text-center' : ''}`}>
      <Reveal dir="left" className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <span className={`h-px w-10 ${danger ? 'bg-danger' : 'bg-cyan'}`} />
        <span className={`font-mono text-[11px] tracking-[0.35em] ${danger ? 'text-danger' : 'text-cyan'}`}>{code}</span>
        {center && <span className={`h-px w-10 ${danger ? 'bg-danger' : 'bg-cyan'}`} />}
      </Reveal>
      <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        <SplitWords text={title} className={danger ? 'text-foam' : ''} wordClassName={danger ? '' : 'title-gradient'} stagger={0.08} />
      </h2>
      {th && (
        <Reveal delay={0.25} className="mt-4">
          <p className={`font-display text-lg md:text-2xl ${danger ? 'text-danger/90' : 'text-ice/90'}`}>{th}</p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={0.35} className="thai-tight mt-5 text-steel">
          {children}
        </Reveal>
      )}
    </div>
  )
}
