import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Segments text into words (Thai-aware via Intl.Segmenter) so vowel/tone marks never split from their base characters. */
export function segmentWords(text) {
  try {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const seg = new Intl.Segmenter('th', { granularity: 'word' })
      return Array.from(seg.segment(text), (s) => s.segment)
    }
  } catch {
    /* fall through */
  }
  return text.split(/(\s+)/)
}

export default function SplitWords({ text, className = '', wordClassName = '', delay = 0, stagger = 0.04, once = true }) {
  const words = useMemo(() => segmentWords(text), [text])
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
      role="text"
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`inline-block whitespace-pre ${wordClassName}`}
          variants={{
            hidden: { opacity: 0, y: '0.4em', filter: 'blur(8px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  )
}
