import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------
 * ABYSSAL KING — fully procedural humanoid sperm-whale villain.
 * Local space: faces +Z, feet ≈ y -2.3, head top ≈ y 2.26.
 * ------------------------------------------------------------------ */

const CYAN = new THREE.Color('#00d9ff')

/** Procedural wrinkled whale-skin bump map (sperm whale skin is heavily furrowed). */
function makeSkinBump() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, size, size)
  for (let i = 0; i < 90; i++) {
    const y = Math.random() * size
    g.strokeStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'},${0.12 + Math.random() * 0.2})`
    g.lineWidth = 0.6 + Math.random() * 1.8
    g.beginPath()
    for (let x = -10; x <= size + 10; x += 8) {
      g.lineTo(x, y + Math.sin(x * 0.05 + i) * 4 + (Math.random() - 0.5) * 2)
    }
    g.stroke()
  }
  const img = g.getImageData(0, 0, size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 26
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  g.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  return tex
}

/** Injects animated sonar rings + flowing side lines into the head material (object-space, conforms to the surface). */
function patchSonarShader(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime
    shader.uniforms.uGlow = uniforms.uGlow
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;\nuniform float uTime;\nuniform float uGlow;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        vec3 p = vObjPos;
        // concentric sonar rings on the front of the forehead
        float front = smoothstep(0.62, 0.9, p.z);
        float r = length(p.xy - vec2(0.0, 0.08));
        float rings = pow(abs(sin(r * 26.0 - uTime * 3.2)), 26.0) * front * (1.0 - smoothstep(0.34, 0.46, r));
        float core = (1.0 - smoothstep(0.0, 0.07, r)) * front;
        // flowing echo lines along the sides
        float side = smoothstep(0.42, 0.51, abs(p.x));
        float band = smoothstep(-0.25, -0.05, p.y) * (1.0 - smoothstep(0.32, 0.45, p.y));
        float lines = pow(abs(sin(p.z * 13.0 + uTime * 2.4 + p.y * 3.0)), 40.0) * side * band;
        // crown line on top
        float top = smoothstep(0.45, 0.525, p.y) * pow(abs(sin(p.z * 9.0 - uTime * 1.6)), 30.0) * (1.0 - smoothstep(0.05, 0.12, abs(p.x)));
        float pattern = rings + core * 1.5 + lines * 0.9 + top * 0.8;
        totalEmissiveRadiance += vec3(0.0, 0.85, 1.0) * pattern * uGlow;`,
      )
  }
  material.customProgramCacheKey = () => 'abyssal-sonar-head'
}

function useMaterials() {
  return useMemo(() => {
    const bump = makeSkinBump()
    const uniforms = { uTime: { value: 0 }, uGlow: { value: 1.6 } }
    const skin = new THREE.MeshStandardMaterial({ color: '#34424f', roughness: 0.62, metalness: 0.12, bumpMap: bump, bumpScale: 0.9 })
    const head = new THREE.MeshStandardMaterial({ color: '#303d4a', roughness: 0.55, metalness: 0.15, bumpMap: bump, bumpScale: 1.1 })
    patchSonarShader(head, uniforms)
    const armor = new THREE.MeshStandardMaterial({ color: '#070f18', roughness: 0.32, metalness: 0.75 })
    const navy = new THREE.MeshStandardMaterial({ color: '#0e2438', roughness: 0.38, metalness: 0.65 })
    const metal = new THREE.MeshStandardMaterial({ color: '#7d8d9b', roughness: 0.24, metalness: 0.95 })
    const darkMetal = new THREE.MeshStandardMaterial({ color: '#3c4955', roughness: 0.3, metalness: 0.9 })
    const rubber = new THREE.MeshStandardMaterial({ color: '#0f161d', roughness: 0.85, metalness: 0.1 })
    const ivory = new THREE.MeshStandardMaterial({ color: '#d9d2bf', roughness: 0.4, metalness: 0.05 })
    const scar = new THREE.MeshStandardMaterial({ color: '#8a96a0', roughness: 0.7 })
    const cavity = new THREE.MeshBasicMaterial({ color: '#010306' })
    const glow = new THREE.MeshBasicMaterial({ color: CYAN.clone().multiplyScalar(2.2), toneMapped: false })
    const glowSoft = new THREE.MeshBasicMaterial({ color: CYAN.clone().multiplyScalar(1.4), toneMapped: false, transparent: true, opacity: 0.8 })
    const eye = new THREE.MeshBasicMaterial({ color: new THREE.Color('#bff6ff').multiplyScalar(3), toneMapped: false })
    const pulse = new THREE.MeshBasicMaterial({
      color: CYAN.clone().multiplyScalar(1.6),
      toneMapped: false,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { bump, uniforms, skin, head, armor, navy, metal, darkMetal, rubber, ivory, scar, cavity, glow, glowSoft, eye, pulse }
  }, [])
}

/* ---------------------------- Parts ---------------------------- */

function Head({ m, headRef }) {
  const teeth = useMemo(() => {
    const arr = []
    for (let s of [-1, 1]) for (let i = 0; i < 12; i++) arr.push([s * 0.15, 1.3, -0.05 + i * 0.095])
    return arr
  }, [])
  const scars = useMemo(
    () => [
      [0.512, 1.9, 0.45, 0.04], [0.512, 1.72, 0.2, 0.03], [0.512, 1.98, -0.05, 0.028], [0.512, 1.8, 0.75, 0.025],
      [-0.512, 1.84, 0.5, 0.035], [-0.512, 1.98, 0.1, 0.03], [-0.512, 1.7, -0.1, 0.025], [-0.512, 1.95, 0.7, 0.03],
    ],
    [],
  )
  return (
    <group ref={headRef} position={[0, 1.3, 0]}>
    <group position={[0, -1.3, 0]}>
      {/* Spermaceti "melon" forehead — the massive block head */}
      <RoundedBox args={[1.02, 1.05, 1.8]} radius={0.3} smoothness={5} position={[0, 1.83, 0.32]} material={m.head} />
      {/* Slight brow mass over the eyes */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.465, 1.58, 0.12]} rotation={[0, 0, s * 0.25]} material={m.head}>
            <capsuleGeometry args={[0.05, 0.16, 6, 12]} />
          </mesh>
          {/* deep-set socket */}
          <mesh position={[s * 0.465, 1.5, 0.12]} material={m.cavity}>
            <sphereGeometry args={[0.055, 16, 16]} />
          </mesh>
          {/* small intimidating eye */}
          <mesh position={[s * 0.49, 1.5, 0.13]} material={m.eye} name="eye">
            <sphereGeometry args={[0.024, 12, 12]} />
          </mesh>
        </group>
      ))}
      {/* Squid-sucker scars (a real sperm whale trait) */}
      {scars.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, Math.PI / 2, 0]} material={m.scar}>
          <torusGeometry args={[r, 0.005, 6, 18]} />
        </mesh>
      ))}
      <mesh position={[0.513, 1.93, 0.3]} rotation={[0, Math.PI / 2, 0.35]} material={m.scar}>
        <boxGeometry args={[0.42, 0.008, 0.004]} />
      </mesh>
      {/* Underslung narrow lower jaw */}
      <RoundedBox args={[0.42, 0.13, 1.3]} radius={0.05} position={[0, 1.2, 0.48]} rotation={[0.05, 0, 0]} material={m.skin} />
      <RoundedBox args={[0.46, 0.08, 0.7]} radius={0.03} position={[0, 1.15, 0.2]} material={m.darkMetal} />
      <mesh position={[0, 1.285, 0.48]} material={m.cavity}>
        <boxGeometry args={[0.36, 0.05, 1.2]} />
      </mesh>
      {teeth.map((p, i) => (
        <mesh key={i} position={p} material={m.ivory}>
          <coneGeometry args={[0.022, 0.08, 6]} />
        </mesh>
      ))}
      {/* Metallic crown plate & dorsal ridge */}
      <RoundedBox args={[0.74, 0.08, 0.7]} radius={0.03} position={[0, 2.36, -0.12]} material={m.metal} />
      <mesh position={[0, 2.405, -0.12]} material={m.glow}>
        <boxGeometry args={[0.02, 0.012, 0.65]} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 2.2 - i * 0.18, -0.6 - i * 0.02]} rotation={[-1.9, 0, 0]} material={m.darkMetal}>
          <coneGeometry args={[0.07 - i * 0.008, 0.18, 4]} />
        </mesh>
      ))}
    </group>
    </group>
  )
}

function Torso({ m, chestRef }) {
  return (
    <group>
      {/* thick neck + collar */}
      <mesh position={[0, 1.2, 0]} material={m.skin}>
        <cylinderGeometry args={[0.46, 0.58, 0.5, 28]} />
      </mesh>
      <mesh position={[0, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.metal}>
        <torusGeometry args={[0.55, 0.07, 12, 36]} />
      </mesh>
      <mesh position={[0, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.glow}>
        <torusGeometry args={[0.6, 0.008, 6, 48]} />
      </mesh>
      {/* trapezius */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.45, 1.1, -0.05]} scale={[1.25, 0.75, 1]} material={m.skin}>
          <sphereGeometry args={[0.36, 24, 18]} />
        </mesh>
      ))}
      <group ref={chestRef}>
        {/* chest mass */}
        <mesh position={[0, 0.62, 0]} scale={[0.95, 0.72, 0.6]} material={m.skin}>
          <sphereGeometry args={[1, 40, 30]} />
        </mesh>
        {/* pectoral armor plates */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <RoundedBox args={[0.68, 0.48, 0.22]} radius={0.08} position={[s * 0.37, 0.8, 0.44]} rotation={[-0.12, s * 0.28, 0]} material={m.navy} />
            <RoundedBox args={[0.6, 0.06, 0.2]} radius={0.02} position={[s * 0.4, 1.01, 0.47]} rotation={[-0.12, s * 0.28, 0]} material={m.metal} />
            <mesh position={[s * 0.4, 0.57, 0.53]} rotation={[0, s * 0.28, 0]} material={m.glow}>
              <boxGeometry args={[0.5, 0.018, 0.02]} />
            </mesh>
            {/* sonar chevrons on chest */}
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[s * (0.2 + i * 0.11), 0.78 - i * 0.04, 0.565]} rotation={[0, s * 0.28, s * 0.5]} material={m.glowSoft}>
                <boxGeometry args={[0.09, 0.012, 0.01]} />
              </mesh>
            ))}
          </group>
        ))}
        {/* sonar core reactor */}
        <mesh position={[0, 0.78, 0.58]} rotation={[Math.PI / 2, 0, 0]} material={m.darkMetal}>
          <cylinderGeometry args={[0.13, 0.15, 0.06, 32]} />
        </mesh>
        <mesh position={[0, 0.78, 0.615]} material={m.glow} name="core">
          <circleGeometry args={[0.075, 32]} />
        </mesh>
        <mesh position={[0, 0.78, 0.615]} material={m.glow}>
          <ringGeometry args={[0.1, 0.115, 40]} />
        </mesh>
        {/* segmented abdominal plates */}
        {[0.33, 0.13, -0.07].map((y, row) =>
          [-1, 1].map((s) => (
            <RoundedBox key={`${row}${s}`} args={[0.27, 0.17, 0.18]} radius={0.05} position={[s * 0.155, y, 0.4 - row * 0.02]} material={m.armor} />
          )),
        )}
        <mesh position={[0, 0.13, 0.49]} material={m.glow}>
          <boxGeometry args={[0.018, 0.55, 0.02]} />
        </mesh>
        {/* side ribs / obliques */}
        {[-1, 1].map((s) =>
          [0, 1, 2].map((i) => (
            <RoundedBox key={`${s}${i}`} args={[0.06, 0.22, 0.3]} radius={0.02} position={[s * (0.62 - i * 0.04), 0.55 - i * 0.2, 0.2]} rotation={[0, s * 0.6, s * 0.2]} material={m.darkMetal} />
          )),
        )}
      </group>
      {/* waist, belt and fluke buckle */}
      <mesh position={[0, -0.12, 0]} material={m.navy}>
        <cylinderGeometry args={[0.5, 0.46, 0.42, 28]} />
      </mesh>
      <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.metal}>
        <torusGeometry args={[0.48, 0.07, 12, 36]} />
      </mesh>
      <FlukeEmblem material={m.glow} position={[0, -0.32, 0.55]} />
      <mesh position={[0, -0.47, 0]} scale={[0.6, 0.33, 0.44]} material={m.armor}>
        <sphereGeometry args={[1, 28, 20]} />
      </mesh>
    </group>
  )
}

function FlukeEmblem({ material, position }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.06)
    s.quadraticCurveTo(0.05, 0.02, 0.14, 0.06)
    s.quadraticCurveTo(0.08, 0.0, 0.0, 0.02)
    s.quadraticCurveTo(-0.08, 0.0, -0.14, 0.06)
    s.quadraticCurveTo(-0.05, 0.02, 0, -0.06)
    return new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false })
  }, [])
  return <mesh geometry={geo} material={material} position={position} />
}

function Arm({ m, side, armRef }) {
  const s = side
  return (
    <group position={[s * 1.0, 0.92, 0]}>
      {/* deltoid + layered pauldron */}
      <mesh material={m.skin}>
        <sphereGeometry args={[0.36, 24, 18]} />
      </mesh>
      <group rotation={[0, 0, -s * 0.35]} position={[s * 0.04, 0.06, 0]}>
        <mesh scale={[1.15, 0.85, 1.15]} material={m.armor}>
          <sphereGeometry args={[0.45, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0, 0.12, 0]} scale={[1.0, 0.7, 1.0]} material={m.navy}>
          <sphereGeometry args={[0.4, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.glow}>
          <torusGeometry args={[0.515, 0.01, 6, 48]} />
        </mesh>
        {[-0.18, 0, 0.18].map((z, i) => (
          <mesh key={i} position={[s * 0.05, 0.32, z]} rotation={[0, 0, -s * 0.1]} material={m.metal}>
            <boxGeometry args={[0.32, 0.03, 0.04]} />
          </mesh>
        ))}
      </group>
      <group ref={armRef} rotation={[0, 0, s * 0.2]}>
        {/* upper arm with bicep */}
        <mesh position={[0, -0.42, 0]} material={m.skin}>
          <capsuleGeometry args={[0.24, 0.45, 8, 20]} />
        </mesh>
        <mesh position={[0, -0.38, 0.09]} material={m.skin}>
          <sphereGeometry args={[0.23, 20, 16]} />
        </mesh>
        <RoundedBox args={[0.1, 0.4, 0.3]} radius={0.03} position={[s * 0.22, -0.4, 0]} material={m.navy} />
        {/* forearm (oversized, armored gauntlet) */}
        <group position={[0, -0.82, 0]} rotation={[-0.38, 0, 0]}>
          <mesh material={m.darkMetal}>
            <sphereGeometry args={[0.2, 20, 16]} />
          </mesh>
          <mesh position={[0, -0.36, 0]} material={m.skin}>
            <cylinderGeometry args={[0.3, 0.24, 0.66, 24]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={m.armor}>
            <cylinderGeometry args={[0.325, 0.27, 0.48, 24, 1, true]} />
          </mesh>
          <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.glow}>
            <torusGeometry args={[0.327, 0.012, 6, 40]} />
          </mesh>
          <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.glow}>
            <torusGeometry args={[0.272, 0.012, 6, 40]} />
          </mesh>
          {/* whale-fin blade on the gauntlet */}
          <mesh position={[s * 0.33, -0.38, -0.02]} rotation={[0, 0, s * 0.06]} scale={[0.25, 1, 1]} material={m.metal}>
            <coneGeometry args={[0.18, 0.55, 4]} />
          </mesh>
          {/* fist */}
          <RoundedBox args={[0.36, 0.32, 0.38]} radius={0.09} position={[0, -0.82, 0.02]} material={m.skin} />
          <RoundedBox args={[0.38, 0.1, 0.14]} radius={0.03} position={[0, -0.9, 0.16]} material={m.metal} />
          <mesh position={[0, -0.9, 0.235]} material={m.glow}>
            <boxGeometry args={[0.3, 0.012, 0.005]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Leg({ m, side }) {
  const s = side
  return (
    <group position={[s * 0.3, -0.52, 0]} rotation={[0, 0, s * 0.04]}>
      <mesh position={[0, -0.4, 0]} material={m.skin}>
        <cylinderGeometry args={[0.3, 0.23, 0.78, 24]} />
      </mesh>
      <RoundedBox args={[0.32, 0.5, 0.1]} radius={0.04} position={[0, -0.36, 0.24]} rotation={[0.05, 0, 0]} material={m.navy} />
      <RoundedBox args={[0.1, 0.5, 0.32]} radius={0.03} position={[s * 0.26, -0.38, 0]} material={m.armor} />
      <mesh position={[0, -0.86, 0.02]} material={m.darkMetal}>
        <sphereGeometry args={[0.19, 20, 16]} />
      </mesh>
      <RoundedBox args={[0.24, 0.2, 0.1]} radius={0.04} position={[0, -0.86, 0.17]} material={m.metal} />
      <mesh position={[0, -1.24, 0]} material={m.armor}>
        <cylinderGeometry args={[0.23, 0.18, 0.72, 24]} />
      </mesh>
      <RoundedBox args={[0.26, 0.55, 0.1]} radius={0.04} position={[0, -1.22, 0.17]} material={m.navy} />
      <mesh position={[0, -1.22, 0.225]} material={m.glow}>
        <boxGeometry args={[0.018, 0.42, 0.01]} />
      </mesh>
      <RoundedBox args={[0.34, 0.28, 0.54]} radius={0.08} position={[0, -1.68, 0.08]} material={m.armor} />
      <RoundedBox args={[0.36, 0.06, 0.56]} radius={0.02} position={[0, -1.8, 0.08]} material={m.metal} />
    </group>
  )
}

function BackGear({ m }) {
  const tubes = useMemo(
    () =>
      [-1, 1].map(
        (s) =>
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(s * 0.26, 1.12, -0.76),
              new THREE.Vector3(s * 0.34, 1.38, -0.72),
              new THREE.Vector3(s * 0.3, 1.52, -0.52),
              new THREE.Vector3(s * 0.24, 1.42, -0.3),
            ]),
            28,
            0.04,
            8,
            false,
          ),
      ),
    [],
  )
  return (
    <group>
      <RoundedBox args={[1.0, 0.95, 0.2]} radius={0.06} position={[0, 0.66, -0.56]} material={m.armor} />
      <mesh position={[0, 0.62, -0.665]} material={m.glow}>
        <boxGeometry args={[0.025, 0.75, 0.01]} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <group key={s} position={[s * 0.26, 0.62, -0.78]}>
          <mesh material={m.metal}>
            <cylinderGeometry args={[0.16, 0.16, 0.82, 24]} />
          </mesh>
          <mesh position={[0, 0.41, 0]} material={m.metal}>
            <sphereGeometry args={[0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, -0.41, 0]} rotation={[Math.PI, 0, 0]} material={m.metal}>
            <sphereGeometry args={[0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, 0.52, 0]} material={m.darkMetal}>
            <cylinderGeometry args={[0.05, 0.06, 0.1, 12]} />
          </mesh>
          {[0.18, -0.05, -0.28].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.darkMetal}>
              <torusGeometry args={[0.163, 0.015, 6, 30]} />
            </mesh>
          ))}
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.glow}>
            <torusGeometry args={[0.166, 0.01, 6, 30]} />
          </mesh>
          <mesh geometry={tubes[i]} position={[-s * 0.26, -0.62, 0.78]} material={m.rubber} />
        </group>
      ))}
    </group>
  )
}

/** Expanding sonar pulses emitted from the forehead. */
function SonarPulses({ m, burstRef, count = 3 }) {
  const refs = useRef([])
  const mats = useMemo(() => Array.from({ length: count }, () => m.pulse.clone()), [m, count])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const burst = burstRef.current
    const sinceBurst = t - burst.time
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      let phase = ((t * 0.42 + i / count) % 1 + 1) % 1
      let strength = 0.55
      if (sinceBurst < 1.6) {
        phase = Math.min(1, sinceBurst / 1.6 + i * 0.12)
        strength = 1.3
      }
      const sc = 0.15 + phase * 3.2
      mesh.scale.setScalar(sc)
      mesh.position.z = 0.95 + phase * 1.8
      mats[i].opacity = (1 - phase) * strength * burst.glow
    })
  })
  return (
    <group position={[0, 1.9, 0.3]}>
      {mats.map((mat, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} material={mat}>
          <ringGeometry args={[0.28, 0.3, 64]} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * @param {object} props
 * @param {boolean} props.animated idle motion (breathing, head tracking, arms)
 * @param {React.MutableRefObject} props.pointer normalized pointer {x,y}
 * @param {React.MutableRefObject} [props.hoverRef] external hover flag
 */
export default function WhaleKing({ animated = true, pointer, hoverRef, burstRef: extBurst, pulses = true, ...props }) {
  const m = useMaterials()
  const headRef = useRef()
  const chestRef = useRef()
  const armL = useRef()
  const armR = useRef()
  const localBurst = useRef({ time: -10, glow: 1 })
  const burstRef = extBurst || localBurst

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    m.uniforms.uTime.value = t
    const hovered = hoverRef?.current
    const sinceBurst = t - burstRef.current.time
    const burstBoost = sinceBurst < 1.2 ? (1 - sinceBurst / 1.2) * 2.5 : 0
    const target = (hovered ? 2.8 : 1.6) + burstBoost
    m.uniforms.uGlow.value = THREE.MathUtils.lerp(m.uniforms.uGlow.value, target, Math.min(1, dt * 4))
    burstRef.current.glow = m.uniforms.uGlow.value / 1.6
    const breathe = 0.6 + Math.sin(t * 1.4) * 0.4
    m.glow.color.copy(CYAN).multiplyScalar(1.6 + breathe * 0.9 + (m.uniforms.uGlow.value - 1.6) * 0.8)
    m.eye.color.setRGB(0.75, 0.96, 1).multiplyScalar(2.2 + Math.sin(t * 3.1) * 0.4 + (hovered ? 1.5 : 0))

    if (!animated) return
    if (chestRef.current) chestRef.current.scale.set(1 + Math.sin(t * 1.4) * 0.008, 1 + Math.sin(t * 1.4) * 0.012, 1)
    if (headRef.current && pointer) {
      const p = pointer.current
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, p.x * 0.18, 0.05)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -p.y * 0.06, 0.05)
    }
    if (armL.current) armL.current.rotation.x = Math.sin(t * 0.9) * 0.05
    if (armR.current) armR.current.rotation.x = Math.sin(t * 0.9 + 1.2) * 0.05
  })

  return (
    <group {...props}>
      <Head m={m} headRef={headRef} />
      <Torso m={m} chestRef={chestRef} />
      <Arm m={m} side={-1} armRef={armL} />
      <Arm m={m} side={1} armRef={armR} />
      <Leg m={m} side={-1} />
      <Leg m={m} side={1} />
      <BackGear m={m} />
      {pulses && <SonarPulses m={m} burstRef={burstRef} />}
    </group>
  )
}
