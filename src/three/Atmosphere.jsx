import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** GPU-animated marine snow — positions drift entirely in the vertex shader (zero CPU per frame). */
export function MarineSnow({ count = 600, area = [14, 10, 10], color = '#76e5ff' }) {
  const matRef = useRef()
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area[0]
      pos[i * 3 + 1] = (Math.random() - 0.5) * area[1]
      pos[i * 3 + 2] = (Math.random() - 0.5) * area[2]
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count, area])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uHeight: { value: area[1] }, uPixel: { value: 1 } }),
    [color, area],
  )

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixel.value = state.gl.getPixelRatio()
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float aSeed;
          uniform float uTime; uniform float uHeight; uniform float uPixel;
          varying float vAlpha;
          void main(){
            vec3 p = position;
            float h = uHeight;
            p.y = mod(p.y + uTime * (0.08 + aSeed * 0.18) + h * 0.5, h) - h * 0.5;
            p.x += sin(uTime * 0.3 + aSeed * 30.0) * 0.25;
            p.z += cos(uTime * 0.25 + aSeed * 20.0) * 0.2;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.2 + aSeed * 2.6) * uPixel * (8.0 / -mv.z);
            vAlpha = (0.25 + aSeed * 0.6) * smoothstep(h * 0.5, h * 0.3, abs(p.y));
          }`}
        fragmentShader={`
          uniform vec3 uColor; varying float vAlpha;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor, a * vAlpha);
          }`}
      />
    </points>
  )
}

/** Volumetric-looking light shafts from the surface. */
export function GodRays({ count = 4 }) {
  const group = useRef()
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          varying vec2 vUv; uniform float uTime;
          void main(){
            float fall = pow(vUv.y, 1.6);
            float flicker = 0.75 + 0.25 * sin(uTime * 0.7 + vUv.x * 18.0);
            float edge = sin(vUv.x * 3.14159);
            gl_FragColor = vec4(0.25, 0.75, 1.0, fall * edge * flicker * 0.085);
          }`,
      }),
    [],
  )
  const rays = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ x: -3 + i * 2 + Math.random(), rz: -0.25 + Math.random() * 0.5, w: 0.8 + Math.random() * 1.2 })),
    [count],
  )
  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime
    if (group.current) group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05
  })
  return (
    <group ref={group} position={[0, 3, -2.5]}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 0, -i * 0.4]} rotation={[0, 0, r.rz]} material={mat}>
          <cylinderGeometry args={[r.w * 0.25, r.w, 12, 24, 1, true]} />
        </mesh>
      ))}
    </group>
  )
}

/** Holographic research-lab platform under the subject. */
export function HoloPlatform({ y = -2.45, radius = 1.9 }) {
  const ringA = useRef()
  const ringB = useRef()
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#00d9ff').multiplyScalar(1.8), toneMapped: false, transparent: true, opacity: 0.85, side: THREE.DoubleSide }), [])
  const dim = useMemo(() => new THREE.MeshBasicMaterial({ color: '#00d9ff', transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }), [])
  const ticks = useMemo(() => Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2), [])
  useFrame((_, dt) => {
    if (ringA.current) ringA.current.rotation.z += dt * 0.15
    if (ringB.current) ringB.current.rotation.z -= dt * 0.25
  })
  return (
    <group position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh material={dim}>
        <circleGeometry args={[radius, 64]} />
      </mesh>
      <mesh material={glow}>
        <ringGeometry args={[radius - 0.02, radius, 96]} />
      </mesh>
      <group ref={ringA}>
        {ticks.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * (radius - 0.15), Math.sin(a) * (radius - 0.15), 0.001]} rotation={[0, 0, a]} material={i % 4 === 0 ? glow : dim}>
            <planeGeometry args={[i % 4 === 0 ? 0.16 : 0.08, 0.015]} />
          </mesh>
        ))}
      </group>
      <group ref={ringB}>
        <mesh material={glow}>
          <ringGeometry args={[radius * 0.62, radius * 0.63, 96, 1, 0, Math.PI * 1.3]} />
        </mesh>
        <mesh material={glow}>
          <ringGeometry args={[radius * 0.62, radius * 0.63, 96, 1, Math.PI * 1.5, Math.PI * 0.35]} />
        </mesh>
      </group>
      <mesh material={dim}>
        <ringGeometry args={[radius * 0.3, radius * 0.32, 64]} />
      </mesh>
    </group>
  )
}

/** Lights shared by scenes: cinematic key, cyan rims, danger under-light and a slowly orbiting light. */
export function CinematicLights({ intensity = 1 }) {
  const orbit = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (orbit.current) orbit.current.position.set(Math.cos(t * 0.4) * 4, 1.5 + Math.sin(t * 0.6), Math.sin(t * 0.4) * 4)
  })
  return (
    <>
      <ambientLight intensity={0.18 * intensity} color="#5a86a6" />
      <hemisphereLight args={['#4fc3ff', '#030912', 0.45 * intensity]} />
      <spotLight position={[2.5, 7, 5]} angle={0.45} penumbra={1} intensity={3.2 * intensity} decay={0} color="#dff6ff" />
      <pointLight position={[-3.5, 2.5, -3]} intensity={3 * intensity} decay={0} distance={14} color="#00d9ff" />
      <pointLight position={[3.5, 1, -2.5]} intensity={2 * intensity} decay={0} distance={12} color="#76e5ff" />
      <pointLight position={[0, -3, 2.5]} intensity={0.35 * intensity} decay={0} distance={8} color="#ff354d" />
      <pointLight ref={orbit} intensity={1.4 * intensity} decay={0} distance={9} color="#00d9ff" />
    </>
  )
}
