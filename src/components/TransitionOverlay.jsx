import { AnimatePresence, motion } from 'framer-motion'
import { NAV_ITEMS } from '../data/content'

/** Cinematic "sonar sweep" page transition shown while jumping between sections. */
export default function TransitionOverlay({ target }) {
  const item = NAV_ITEMS.find((n) => n.id === target)
  return (
    <AnimatePresence>
      {target && (
        <motion.div
          key={target}
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-abyss"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(100% 0 0 0)' }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.3, 1] }}
        >
          <div className="grid-lines absolute inset-0 opacity-40" />
          <motion.div
            className="absolute inset-x-0 h-px bg-cyan shadow-[0_0_20px_#00d9ff]"
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 0.8, ease: 'linear' }}
          />
          <div className="relative text-center">
            <div className="font-mono text-[10px] tracking-[0.5em] text-cyan">ACCESSING FILE</div>
            <div className="mt-3 font-display text-4xl font-bold tracking-[0.2em] text-foam md:text-6xl">{item?.label}</div>
            <div className="mt-2 text-ice/80">{item?.th}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
