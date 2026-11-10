// Scientific-style animated diagrams for the Biology section (real-world sperm whale biology).

export const WHALE_PATH =
  'M0 22 Q0 2 30 2 L92 5 Q132 9 160 22 L184 29 L199 16 L195 31 L200 46 L184 35 Q150 50 100 50 L42 48 Q24 47 14 40 L30 40 L12 37 Q0 34 0 22 Z'

export function DepthDiagram({ reduced }) {
  const zones = [
    { y: 0, h: 60, label: 'EPIPELAGIC', th: 'เขตแสงส่องถึง', range: '0–200 m', c: '#0b3b56' },
    { y: 60, h: 110, label: 'MESOPELAGIC', th: 'เขตแสงสลัว', range: '200–1,000 m', c: '#082a40' },
    { y: 170, h: 230, label: 'BATHYPELAGIC', th: 'เขตมืดสนิท', range: '1,000–4,000 m', c: '#04121f' },
  ]
  const dive = 'M60 18 C 110 40, 120 120, 150 200 S 190 310, 200 330'
  return (
    <svg viewBox="0 0 340 400" className="h-full w-full" role="img" aria-label="แผนภาพความลึกของการดำน้ำของวาฬสเปิร์ม">
      <defs>
        <linearGradient id="dd-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#76e5ff" stopOpacity=".25" />
          <stop offset="1" stopColor="#76e5ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {zones.map((z) => (
        <g key={z.label}>
          <rect x="0" y={z.y} width="340" height={z.h} fill={z.c} />
          <line x1="0" y1={z.y} x2="340" y2={z.y} stroke="#76e5ff" strokeOpacity=".2" strokeDasharray="3 4" />
          <text x="334" y={z.y + 14} textAnchor="end" fill="#76e5ff" fontSize="9" fontFamily="JetBrains Mono" opacity=".8">
            {z.label}
          </text>
          <text x="334" y={z.y + 27} textAnchor="end" fill="#8295a5" fontSize="9" fontFamily="IBM Plex Sans Thai">
            {z.th} · {z.range}
          </text>
        </g>
      ))}
      <rect x="0" y="0" width="340" height="80" fill="url(#dd-fade)" />
      {/* scale */}
      {[0, 200, 1000, 2000, 3000].map((d) => {
        const y = d <= 200 ? (d / 200) * 60 : d <= 1000 ? 60 + ((d - 200) / 800) * 110 : 170 + ((d - 1000) / 3000) * 230
        return (
          <g key={d}>
            <line x1="0" x2="12" y1={y} y2={y} stroke="#eaf7ff" strokeOpacity=".6" />
            <text x="16" y={y + 3} fill="#eaf7ff" fontSize="8" fontFamily="JetBrains Mono" opacity=".7">
              {d.toLocaleString()} m
            </text>
          </g>
        )
      })}
      {/* 2,000 m threshold */}
      <line x1="0" x2="340" y1="246.7" y2="246.7" stroke="#00d9ff" strokeWidth="1" />
      <rect x="150" y="238" width="96" height="17" rx="2" fill="#030912" stroke="#00d9ff" />
      <text x="198" y="250" textAnchor="middle" fill="#00d9ff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">
        2,000 m+ DIVE
      </text>
      <path d={dive} fill="none" stroke="#00d9ff" strokeOpacity=".5" strokeDasharray="4 5" />
      <g>
        <path d={WHALE_PATH} transform="translate(25 -6) scale(-.25 .25)" fill="#8295a5" />
        {!reduced && <animateMotion dur="9s" repeatCount="indefinite" path={dive} rotate="auto" keyPoints="0;1;1" keyTimes="0;0.85;1" calcMode="linear" />}
      </g>
      {/* surface */}
      <path d="M0 4 Q20 0 40 4 T80 4 T120 4 T160 4 T200 4 T240 4 T280 4 T320 4 T360 4" fill="none" stroke="#76e5ff" strokeOpacity=".7" />
      {/* pressure arrows */}
      {[90, 160, 230].map((x, i) => (
        <g key={x} opacity={0.3 + i * 0.2}>
          <path d={`M${x} ${290 + i * 10} l0 ${14 + i * 4} m-4 -5 l4 5 l4 -5`} stroke="#76e5ff" fill="none" />
        </g>
      ))}
      <text x="20" y="388" fill="#8295a5" fontSize="8" fontFamily="JetBrains Mono">
        PRESSURE ↑ WITH DEPTH
      </text>
    </svg>
  )
}

export function EchoDiagram({ reduced }) {
  const arcs = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" role="img" aria-label="แผนภาพการใช้เสียงสะท้อนหาตำแหน่ง (Echolocation)">
      <rect width="400" height="220" fill="#04121f" />
      <g transform="translate(10 76)">
        <path d={WHALE_PATH} transform="translate(140 0) scale(-.7 .7)" fill="#2a3846" stroke="#76e5ff" strokeOpacity=".4" />
        <circle cx="134" cy="12" r="5" fill="#00d9ff" />
      </g>
      {/* outgoing clicks */}
      {arcs.map((i) => (
        <path key={`o${i}`} d="M0 -26 Q14 0 0 26" fill="none" stroke="#00d9ff" strokeWidth="2" transform="translate(160 92)">
          {!reduced && (
            <>
              <animateTransform attributeName="transform" type="translate" values="160 92; 300 92" dur="2.6s" begin={`${i * 0.65}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.2" dur="2.6s" begin={`${i * 0.65}s`} repeatCount="indefinite" />
            </>
          )}
        </path>
      ))}
      {/* returning echoes */}
      {arcs.map((i) => (
        <path key={`e${i}`} d="M0 -18 Q-10 0 0 18" fill="none" stroke="#76e5ff" strokeWidth="1.5" strokeDasharray="3 3" transform="translate(300 108)" opacity="0">
          {!reduced && (
            <>
              <animateTransform attributeName="transform" type="translate" values="300 108; 165 108" dur="2.6s" begin={`${1.3 + i * 0.65}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="2.6s" begin={`${1.3 + i * 0.65}s`} repeatCount="indefinite" />
            </>
          )}
        </path>
      ))}
      {/* squid */}
      <g transform="translate(330 96)">
        <ellipse cx="0" cy="0" rx="22" ry="9" fill="#5a3a48" />
        <path d="M-22 0 L-44 -8 M-22 2 L-46 2 M-22 4 L-44 12 M-20 -3 L-40 -14 M-20 6 L-40 18" stroke="#5a3a48" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 0 L32 -8 L32 8 Z" fill="#5a3a48" />
        <circle cx="-12" cy="-2" r="2" fill="#eaf7ff" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#ff354d" strokeDasharray="4 4" opacity=".7">
          {!reduced && <animate attributeName="r" values="26;34;26" dur="2s" repeatCount="indefinite" />}
        </circle>
      </g>
      <text x="20" y="200" fill="#00d9ff" fontSize="9" fontFamily="JetBrains Mono">→ CLICK (OUTGOING)</text>
      <text x="150" y="200" fill="#76e5ff" fontSize="9" fontFamily="JetBrains Mono">← ECHO (RETURN)</text>
      <text x="300" y="200" fill="#ff354d" fontSize="9" fontFamily="JetBrains Mono">PREY</text>
      <text x="20" y="22" fill="#8295a5" fontSize="9" fontFamily="JetBrains Mono">FIG. 02 — ECHOLOCATION</text>
    </svg>
  )
}
