import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import WhaleKing from './WhaleKing'
import { CinematicLights, HoloPlatform, MarineSnow } from './Atmosphere'
import { ANATOMY } from '../data/content'

const facingAngle = ([x, , z]) => Math.atan2(x, z)

/*
 * Hotspot system
 * --------------
 * drei's <Html> creates a separate ReactDOM root per instance and unmounts it synchronously
 * inside a layout-effect cleanup. Under StrictMode (which R3F v9 mirrors into the Canvas) that
 * cleanup runs during the commit phase → "Attempted to synchronously unmount a root while React
 * was already rendering". Instead, hotspots are plain DOM nodes in the normal React tree (an
 * overlay next to the <Canvas>), and this projector — running inside the Canvas — writes their
 * screen position / visibility through refs every frame. No nested roots, no re-renders.
 */
function HotspotProjector({ groupRef, elsRef }) {
  const { camera, size } = useThree()
  const world = useMemo(() => new THREE.Vector3(), [])
  const normal = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    g.updateWorldMatrix(true, false)
    ANATOMY.forEach((spot, i) => {
      const el = elsRef.current[i]
      if (!el) return
      // 3D local position → screen pixels
      world.set(spot.pos[0], spot.pos[1], spot.pos[2])
      g.localToWorld(world)
      world.project(camera)
      const x = (world.x * 0.5 + 0.5) * size.width
      const y = (-world.y * 0.5 + 0.5) * size.height
      // rotate the hotspot's horizontal normal by the model's yaw; hide when it faces away from the camera
      normal.set(spot.pos[0], 0, spot.pos[2]).normalize().applyAxisAngle(THREE.Object3D.DEFAULT_UP, g.rotation.y)
      const visible = normal.z > -0.05 && world.z < 1
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      el.style.opacity = visible ? '1' : '0'
      el.style.pointerEvents = visible ? 'auto' : 'none'
    })
  })
  return null
}

function HotspotButton({ spot, index, active, onSelect, elRef }) {
  return (
    <div ref={elRef} className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 will-change-transform" style={{ pointerEvents: 'none' }}>
      <button
        type="button"
        onClick={() => onSelect(spot.id)}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={spot.en}
        aria-pressed={active}
        className={`group relative grid h-8 w-8 place-items-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
          active ? 'scale-125 border-cyan bg-cyan/30' : 'border-cyan/60 bg-abyss/60 hover:scale-110 hover:border-cyan'
        }`}
      >
        <span className="absolute inset-0 animate-ping rounded-full border border-cyan/50" />
        <span className="font-mono text-[10px] font-bold text-cyan">{String(index + 1).padStart(2, '0')}</span>
        <span className="pointer-events-none absolute left-10 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded border border-cyan/30 bg-abyss/90 px-2 py-1 font-mono text-[10px] tracking-widest text-ice opacity-0 transition-opacity group-hover:opacity-100 md:block">
          {spot.en}
        </span>
      </button>
    </div>
  )
}

function Model({ selected, dragRef, reduced, elsRef }) {
  const group = useRef()
  const target = useRef(0.5)
  const pointer = useRef({ x: 0, y: 0 })
  const { size } = useThree()

  useEffect(() => {
    const spot = ANATOMY.find((a) => a.id === selected)
    if (spot) {
      const desired = -facingAngle(spot.pos)
      // pick the closest equivalent angle so it rotates the short way
      const cur = group.current ? group.current.rotation.y : 0
      let d = desired - cur
      d = Math.atan2(Math.sin(d), Math.cos(d))
      target.current = cur + d
      dragRef.current.idle = 0
    }
  }, [selected, dragRef])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const drag = dragRef.current
    if (drag.delta) {
      target.current += drag.delta * 0.008
      drag.delta = 0
    }
    drag.idle += dt
    if (!reduced && drag.idle > 4 && !selected) target.current += dt * 0.18
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current, 0.08)
    g.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.05
  })

  const s = size.width < 500 ? 0.72 : 0.84
  return (
    <group scale={s} position={[0, -0.05, 0]}>
      <group ref={group}>
        <WhaleKing pointer={pointer} animated={!reduced} pulses={false} />
      </group>
      <HoloPlatform y={-2.5} radius={1.6} />
      <HotspotProjector groupRef={group} elsRef={elsRef} />
    </group>
  )
}

export default function AnatomyScene({ selected, onSelect, active, mobile, reduced }) {
  const dragRef = useRef({ delta: 0, down: false, x: 0, idle: 10 })
  const elsRef = useRef([])

  const onDown = (e) => {
    dragRef.current.down = true
    dragRef.current.x = e.clientX
  }
  const onMove = (e) => {
    const d = dragRef.current
    if (!d.down) return
    d.delta += e.clientX - d.x
    d.x = e.clientX
    d.idle = 0
  }
  const onUp = () => (dragRef.current.down = false)

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
    >
      <Canvas
        dpr={mobile ? [1, 1.4] : [1, 1.75]}
        camera={{ position: [0, 0.2, 7.4], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={active ? 'always' : 'never'}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.15
        }}
      >
        <fog attach="fog" args={['#030912', 8, 16]} />
        <CinematicLights intensity={1.1} />
        <Suspense fallback={null}>
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2} color="#76e5ff" position={[0, 5, -4]} scale={[10, 2, 1]} />
            <Lightformer intensity={1.2} color="#00d9ff" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
            <Lightformer intensity={1} color="#eaf7ff" position={[5, 2, 3]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
          </Environment>
          <Model selected={selected} dragRef={dragRef} reduced={reduced} elsRef={elsRef} />
        </Suspense>
        <MarineSnow count={mobile ? 120 : 260} area={[10, 8, 6]} />
      </Canvas>
      {/* DOM hotspot overlay — positioned every frame by <HotspotProjector /> */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {ANATOMY.map((spot, i) => (
          <HotspotButton
            key={spot.id}
            spot={spot}
            index={i}
            active={selected === spot.id}
            onSelect={onSelect}
            elRef={(el) => {
              elsRef.current[i] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}
