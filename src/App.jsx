import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import TransitionOverlay from './components/TransitionOverlay'
import { NavContext } from './hooks/useNavigate'
import { useFinePointer, usePrefersReducedMotion } from './hooks/useDevice'
import Hero from './sections/Hero'
import Profile from './sections/Profile'
import Biology from './sections/Biology'
import Quirk from './sections/Quirk'
import Ultimates from './sections/Ultimates'
import Origin from './sections/Origin'
import Anatomy from './sections/Anatomy'
import Weakness from './sections/Weakness'
import Philosophy from './sections/Philosophy'
import ThreatReport from './sections/ThreatReport'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const [loading, setLoading] = useState(true)
  const [transitionTarget, setTransitionTarget] = useState(null)
  const lenisRef = useRef(null)

  // Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  // Lock scroll while the loader is up
  useEffect(() => {
    if (loading) {
      lenisRef.current?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenisRef.current?.start()
      document.documentElement.style.overflow = ''
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [loading])

  const navigate = useCallback(
    (id) => {
      const el = document.getElementById(id)
      if (!el) return
      const jump = () => {
        if (lenisRef.current) lenisRef.current.scrollTo(el, { immediate: true, force: true })
        else el.scrollIntoView({ behavior: 'auto' })
        ScrollTrigger.update()
      }
      if (reduced) {
        jump()
        return
      }
      setTransitionTarget(id)
      setTimeout(jump, 480)
      setTimeout(() => setTransitionTarget(null), 820)
    },
    [reduced],
  )

  const ctx = useMemo(() => ({ navigate, lenis: lenisRef }), [navigate])
  const onLoaded = useCallback(() => setLoading(false), [])

  return (
    <MotionConfig reducedMotion="user">
      <NavContext.Provider value={ctx}>
        <AnimatePresence>{loading && <Loader key="loader" onDone={onLoaded} fast={reduced} />}</AnimatePresence>
        {fine && !reduced && <Cursor />}
        <TransitionOverlay target={transitionTarget} />
        <Navbar />
        <div className="ocean-bg noise pointer-events-none fixed inset-0 -z-10" />
        <main className="relative overflow-x-clip">
          <Hero ready={!loading} />
          <Profile />
          <Biology />
          <Quirk />
          <Ultimates />
          <Origin />
          <Anatomy />
          <Weakness />
          <Philosophy />
          <ThreatReport />
        </main>
      </NavContext.Provider>
    </MotionConfig>
  )
}
