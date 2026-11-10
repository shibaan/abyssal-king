import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, [data-cursor]'

/** Sonar-style custom cursor (desktop / fine pointer only). */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('has-custom-cursor')
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let scale = 1
    let targetScale = 1
    let raf
    let visible = false

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        rx = x
        ry = y
        dot.current.style.opacity = '1'
        ring.current.style.opacity = '1'
      }
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null
      const hoverCanvas = root.dataset.cursor === 'hover'
      targetScale = el || hoverCanvas ? 2.1 : 1
      const text = el?.getAttribute('data-cursor') || (hoverCanvas ? 'SCAN' : '')
      if (label.current.textContent !== text) label.current.textContent = text
    }
    const onDown = () => (targetScale *= 0.75)
    const onUp = () => (targetScale /= 0.75)
    const onLeave = () => {
      visible = false
      dot.current.style.opacity = '0'
      ring.current.style.opacity = '0'
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      scale += (targetScale - scale) * 0.15
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-cyan opacity-0 shadow-[0_0_10px_#00d9ff]" />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[199] grid h-9 w-9 place-items-center rounded-full border border-cyan/60 opacity-0 transition-opacity duration-300"
      >
        <span className="absolute inset-[-6px] rounded-full border border-cyan/15" />
        <span ref={label} className="absolute top-full mt-1 font-mono text-[6px] tracking-[0.2em] text-cyan" />
      </div>
    </>
  )
}
