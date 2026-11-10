// Seven unique animated SVG visualizations — one per Quirk ability.
import { createContext, useContext } from 'react'

const SliceCtx = createContext(false)
const C = '#00d9ff'
const ICE = '#76e5ff'
const RED = '#ff354d'

function Frame({ children, label }) {
  const slice = useContext(SliceCtx)
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'} role="img" aria-label={label}>
      <defs>
        <radialGradient id="av-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#0b2538" />
          <stop offset="1" stopColor="#030912" />
        </radialGradient>
        <filter id="av-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="av-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C} stopOpacity="0" />
          <stop offset="1" stopColor={C} stopOpacity=".55" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#av-bg)" />
      {children}
    </svg>
  )
}

function Radar() {
  const blips = [
    [190, 100, 0],
    [95, 175, 1.2],
    [205, 205, 2.1],
    [120, 90, 3],
  ]
  return (
    <Frame label="Sonar Vision radar">
      {[30, 60, 90, 120].map((r) => (
        <circle key={r} cx="150" cy="150" r={r} fill="none" stroke={C} strokeOpacity=".25" />
      ))}
      <path d="M150 30 V270 M30 150 H270" stroke={C} strokeOpacity=".15" />
      <g filter="url(#av-glow)">
        <path d="M150 150 L270 150 A120 120 0 0 0 253.9 90 Z" fill="url(#av-sweep)">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
      {blips.map(([x, y, d], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={i === 2 ? RED : C} filter="url(#av-glow)" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="4s" begin={`${d}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r="4" fill="none" stroke={i === 2 ? RED : C} opacity="0">
            <animate attributeName="r" values="4;16" dur="4s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;.8;0" dur="4s" begin={`${d}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <circle cx="150" cy="150" r="5" fill={C} filter="url(#av-glow)" />
    </Frame>
  )
}

function Cannon() {
  return (
    <Frame label="Sonic Cannon shockwave">
      <path d="M30 120 Q30 100 50 100 L80 100 Q92 100 92 115 L92 175 Q92 190 78 190 L50 190 Q30 190 30 170 Z" fill="#2a3846" stroke={ICE} strokeOpacity=".4" />
      <circle cx="84" cy="135" r="7" fill={C} filter="url(#av-glow)">
        <animate attributeName="r" values="5;10;5" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <path d="M92 135 L280 70 L280 200 Z" fill={C} opacity=".06" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d="M0 -30 Q18 0 0 30" fill="none" stroke={C} strokeWidth="3" filter="url(#av-glow)" opacity="0">
          <animateTransform attributeName="transform" type="translate" values="100 135; 270 135" dur="1.6s" begin={`${i * 0.32}s`} repeatCount="indefinite" additive="replace" />
          <animate attributeName="opacity" values="1;0" dur="1.6s" begin={`${i * 0.32}s`} repeatCount="indefinite" />
        </path>
      ))}
      {[[250, 90], [262, 175], [240, 210]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="10" height="10" fill="#8295a5" opacity=".7">
          <animateTransform attributeName="transform" type="translate" values="0 0; 30 -10" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".8;0" dur="1.6s" repeatCount="indefinite" />
        </rect>
      ))}
      <text x="150" y="270" textAnchor="middle" fill={ICE} fontSize="11" fontFamily="JetBrains Mono">FOCUSED SOUND PRESSURE</text>
    </Frame>
  )
}

function Shield() {
  const hex = (r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2
      return `${150 + r * Math.cos(a)},${150 + r * Math.sin(a)}`
    }).join(' ')
  return (
    <Frame label="Abyssal Body density shield">
      {[110, 85, 60].map((r, i) => (
        <polygon key={r} points={hex(r)} fill={C} fillOpacity={0.04 + i * 0.04} stroke={C} strokeOpacity={0.3 + i * 0.2} strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values={`${0.3 + i * 0.2};1;${0.3 + i * 0.2}`} dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </polygon>
      ))}
      <circle cx="150" cy="150" r="24" fill="#2a3846" stroke={ICE} />
      <path d="M140 150 h20 M150 140 v20" stroke={C} strokeWidth="2" />
      {[[40, 60, 0], [260, 110, 0.8], [70, 250, 1.6]].map(([x, y, d], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y} stroke={RED} strokeWidth="3">
            <animate attributeName="x2" values={`${x};${x + (150 - x) * 0.4}`} dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="y2" values={`${y};${y + (150 - y) * 0.4}`} dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;1;0" keyTimes="0;.4;1" dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
          </line>
          <circle cx={x + (150 - x) * 0.4} cy={y + (150 - y) * 0.4} r="2" fill="none" stroke={C} opacity="0">
            <animate attributeName="r" values="2;22" dur="2.4s" begin={`${d + 0.9}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${d + 0.9}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <text x="150" y="285" textAnchor="middle" fill={ICE} fontSize="11" fontFamily="JetBrains Mono">IMPACT ABSORBED</text>
    </Frame>
  )
}

function Dive() {
  return (
    <Frame label="Deep Diver descent">
      <rect x="0" y="0" width="300" height="300" fill="url(#av-bg)" />
      <line x1="60" y1="30" x2="60" y2="270" stroke={C} strokeOpacity=".4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1="52" x2="68" y1={30 + i * 60} y2={30 + i * 60} stroke={C} strokeOpacity=".6" />
          <text x="44" y={34 + i * 60} textAnchor="end" fill="#8295a5" fontSize="9" fontFamily="JetBrains Mono">{i * 500}m</text>
        </g>
      ))}
      <polygon points="68,0 78,-6 78,6" fill={C}>
        <animateTransform attributeName="transform" type="translate" values="0 30; 0 260; 0 260" keyTimes="0;.8;1" dur="5s" repeatCount="indefinite" />
      </polygon>
      <g>
        <ellipse cx="0" cy="0" rx="20" ry="12" fill="#2a3846" stroke={ICE} strokeOpacity=".5" />
        <circle cx="10" cy="-3" r="2" fill={C} filter="url(#av-glow)" />
        <animateTransform attributeName="transform" type="translate" values="180 40; 170 255; 170 255" keyTimes="0;.8;1" dur="5s" repeatCount="indefinite" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={150 + (i % 3) * 30} cy="280" r={2 + (i % 3)} fill="none" stroke={ICE} opacity="0">
          <animate attributeName="cy" values="280;20" dur={`${3 + (i % 3)}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;.7;0" dur={`${3 + (i % 3)}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="230" y="40" fill={ICE} fontSize="10" fontFamily="JetBrains Mono">O₂ STABLE</text>
    </Frame>
  )
}

function Lock() {
  const path = 'M70 200 C 110 80, 200 260, 230 110 S 120 60, 70 200'
  return (
    <Frame label="Predator Lock tracking">
      <path d={path} fill="none" stroke={C} strokeOpacity=".15" strokeDasharray="3 5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} r="10" fill="#8295a5" opacity=".08">
          <animateMotion dur="6s" begin={`${-i * 0.6}s`} repeatCount="indefinite" path={path} />
        </circle>
      ))}
      <g>
        <circle r="6" fill={RED} filter="url(#av-glow)" />
        <animateMotion dur="6s" repeatCount="indefinite" path={path} />
      </g>
      <g>
        <circle r="22" fill="none" stroke={C} strokeWidth="1.5" strokeDasharray="10 6">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M-32 0 h14 M18 0 h14 M0 -32 v14 M0 18 v14" stroke={C} strokeWidth="2" />
        <animateMotion dur="6s" begin="-0.15s" repeatCount="indefinite" path={path} />
      </g>
      <rect x="95" y="262" width="110" height="22" fill="none" stroke={RED} />
      <text x="150" y="277" textAnchor="middle" fill={RED} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
        TARGET LOCKED
        <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
      </text>
    </Frame>
  )
}

function Impact() {
  return (
    <Frame label="Melon Crusher impact">
      <rect x="240" y="40" width="22" height="220" fill="#3c4955" />
      <g>
        <path d="M-60 -35 Q-60 -50 -40 -50 L0 -50 Q14 -50 14 -32 L14 32 Q14 50 0 50 L-40 50 Q-60 50 -60 35 Z" fill="#2a3846" stroke={C} strokeWidth="1.5" />
        <path d="M-6 -30 Q8 0 -6 30" fill="none" stroke={C} strokeWidth="2" filter="url(#av-glow)" />
        <animateTransform attributeName="transform" type="translate" values="40 150; 224 150; 214 150; 214 150" keyTimes="0;.45;.55;1" dur="2.4s" repeatCount="indefinite" />
      </g>
      {[0, 1, 2].map((i) => (
        <line key={i} x1="20" x2="90" y1={115 + i * 35} y2={115 + i * 35} stroke={ICE} strokeOpacity=".5">
          <animate attributeName="x1" values="0;160;160" keyTimes="0;.45;1" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="x2" values="60;210;210" keyTimes="0;.45;1" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".6;.6;0" keyTimes="0;.45;.5" dur="2.4s" repeatCount="indefinite" />
        </line>
      ))}
      <path d="M240 150 l12 -20 l-6 -18 l10 -20 M240 150 l14 18 l-4 22 l12 16 M240 150 l18 2" stroke={C} strokeWidth="2" fill="none" filter="url(#av-glow)" opacity="0">
        <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.44;.5;1" dur="2.4s" repeatCount="indefinite" />
      </path>
      {[0, 1].map((i) => (
        <circle key={i} cx="240" cy="150" r="10" fill="none" stroke={C} strokeWidth="2" opacity="0">
          <animate attributeName="r" values="10;10;110" keyTimes="0;.45;1" dur="2.4s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" keyTimes="0;.45;1" dur="2.4s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </Frame>
  )
}

function Oxygen() {
  const cells = []
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) cells.push([60 + c * 30, 70 + r * 30, r * 6 + c])
  return (
    <Frame label="Oxygen Reserve storage">
      {cells.map(([x, y, i]) => (
        <circle key={i} cx={x} cy={y} r="10" fill={C} fillOpacity="0.05" stroke={C} strokeOpacity=".3">
          <animate attributeName="fill-opacity" values="0.05;0.85;0.85;0.05" keyTimes="0;.15;.85;1" dur="5s" begin={`${(29 - i) * 0.08}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="250" y="60" width="16" height="140" rx="3" fill="none" stroke={ICE} strokeOpacity=".5" />
      <rect x="253" y="63" width="10" height="134" rx="2" fill={C} filter="url(#av-glow)">
        <animate attributeName="height" values="0;134;134;0" keyTimes="0;.5;.85;1" dur="5s" repeatCount="indefinite" />
        <animate attributeName="y" values="197;63;63;197" keyTimes="0;.5;.85;1" dur="5s" repeatCount="indefinite" />
      </rect>
      <text x="150" y="250" textAnchor="middle" fill={ICE} fontSize="11" fontFamily="JetBrains Mono">BLOOD / MUSCLE O₂ RESERVE</text>
    </Frame>
  )
}

const MAP = { radar: Radar, cannon: Cannon, shield: Shield, dive: Dive, lock: Lock, impact: Impact, oxygen: Oxygen }

export default function AbilityViz({ type, slice = false }) {
  const Comp = MAP[type] || Radar
  return (
    <SliceCtx.Provider value={slice}>
      <Comp />
    </SliceCtx.Provider>
  )
}
