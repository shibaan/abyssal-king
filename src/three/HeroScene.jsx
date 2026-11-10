import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import WhaleKing from './WhaleKing'
import { CinematicLights, GodRays, HoloPlatform, MarineSnow } from './Atmosphere'

function Rig({ pointer, reduced, hoverRef, burstRef }) {
  const group = useRef()
  const spin = useRef(0)
  const { viewport, camera, size, clock } = useThree()
  const wide = size.width / size.height > 1.05

  useEffect(() => {
    const fire = () => (burstRef.current.time = clock.elapsedTime)
    window.addEventListener('abyssal-sonar', fire)
    return () => window.removeEventListener('abyssal-sonar', fire)
  }, [clock, burstRef])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return
    const p = pointer.current
    if (!reduced) spin.current += dt * (hoverRef.current ? 0.06 : 0.16)
    // slow continuous rotation combined with mouse parallax
    const targetY = spin.current + p.x * 0.45
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.06)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, p.y * 0.08, 0.05)
    g.position.y = (wide ? -0.2 : 0.7) + (reduced ? 0 : Math.sin(t * 0.8) * 0.12)
    // subtle camera parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.x * 0.5, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.3 + p.y * 0.3, 0.04)
    camera.lookAt(wide ? viewport.width * 0.06 : 0, 0.2, 0)
  })

  const x = wide ? Math.min(viewport.width * 0.22, 2.6) : 0
  const s = wide ? 0.76 : Math.min(0.66, viewport.width / 4.6)

  return (
    <group position={[x, 0, 0]} scale={s}>
      <group ref={group}>
        <WhaleKing
          pointer={pointer}
          hoverRef={hoverRef}
          burstRef={burstRef}
          animated={!reduced}
          onPointerOver={(e) => {
            e.stopPropagation()
            hoverRef.current = true
            document.documentElement.dataset.cursor = 'hover'
          }}
          onPointerOut={() => {
            hoverRef.current = false
            delete document.documentElement.dataset.cursor
          }}
          onClick={(e) => {
            e.stopPropagation()
            burstRef.current.time = clock.elapsedTime
          }}
        />
      </group>
      <HoloPlatform y={-2.55} />
    </group>
  )
}

export default function HeroScene({ pointer, reduced, mobile, active, eventSource }) {
  const hoverRef = useRef(false)
  const burstRef = useRef({ time: -10, glow: 1 })

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={mobile ? [1, 1.4] : [1, 1.8]}
      camera={{ position: [0, 0.3, 8.2], fov: 36 }}
      gl={{ antialias: !mobile, powerPreference: 'high-performance', alpha: true }}
      frameloop={active ? 'always' : 'never'}
      eventSource={eventSource}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      <fog attach="fog" args={['#030912', 7, 17]} />
      <CinematicLights />
      <Suspense fallback={null}>
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2.2} color="#76e5ff" position={[0, 5, -4]} scale={[10, 2, 1]} />
          <Lightformer intensity={1.4} color="#00d9ff" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
          <Lightformer intensity={0.8} color="#eaf7ff" position={[5, 2, 2]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
          <Lightformer intensity={0.15} color="#ff354d" position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[6, 2, 1]} />
        </Environment>
        <Rig pointer={pointer} reduced={reduced} hoverRef={hoverRef} burstRef={burstRef} />
      </Suspense>
      <GodRays count={mobile ? 3 : 5} />
      <MarineSnow count={mobile ? 260 : 700} />
      {!reduced && <Sparkles count={mobile ? 30 : 70} scale={[9, 6, 5]} size={2.2} speed={0.25} opacity={0.7} color="#00d9ff" />}
      {!mobile && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={1.15} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  )
}
