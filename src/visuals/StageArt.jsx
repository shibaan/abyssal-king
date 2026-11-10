// Cinematic SVG illustrations for the PROJECT LEVIATHAN timeline.
const C = '#00d9ff'
const RED = '#ff354d'

const BODY = 'M-30 0 Q-34 -40 -22 -62 L22 -62 Q34 -40 30 0 L26 60 L10 60 L4 10 L-4 10 L-10 60 L-26 60 Z'
const ARMS = 'M-22 -58 L-40 -20 L-36 10 L-30 10 L-30 -18 L-20 -40 M22 -58 L40 -20 L36 10 L30 10 L30 -18 L20 -40'

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#071827" />
        <stop offset="1" stopColor="#030912" />
      </linearGradient>
      <filter id={`${id}-g`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id={`${id}-spot`} cx="50%" cy="40%" r="50%">
        <stop offset="0" stopColor={C} stopOpacity=".35" />
        <stop offset="1" stopColor={C} stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function Lab() {
  return (
    <>
      <Defs id="lab" />
      <rect width="480" height="300" fill="url(#lab-bg)" />
      <ellipse cx="240" cy="140" rx="160" ry="140" fill="url(#lab-spot)" />
      {[60, 400].map((x) => (
        <g key={x}>
          <rect x={x - 40} y="70" width="80" height="54" rx="3" fill="#04121f" stroke={C} strokeOpacity=".4" />
          <path d={`M${x - 34} 100 l10 0 l5 -14 l6 26 l6 -18 l5 6 l20 0`} fill="none" stroke={C} strokeWidth="1.5">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="2s" repeatCount="indefinite" />
          </path>
          <rect x={x - 40} y="134" width="80" height="6" fill={C} opacity=".2" />
          <rect x={x - 40} y="134" width="40" height="6" fill={C} opacity=".7">
            <animate attributeName="width" values="10;80;10" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>
      ))}
      <rect x="180" y="30" width="120" height="240" rx="56" fill={C} fillOpacity=".06" stroke={C} strokeOpacity=".55" strokeWidth="2" />
      <rect x="170" y="20" width="140" height="18" rx="4" fill="#3c4955" />
      <rect x="170" y="262" width="140" height="22" rx="4" fill="#3c4955" />
      <g transform="translate(240 160) scale(.9)" opacity=".85">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -9; 0 0" dur="5s" repeatCount="indefinite" />
          <circle cx="0" cy="-78" r="15" fill="#1c2833" />
          <path d={BODY} fill="#1c2833" />
          <path d={ARMS} fill="none" stroke="#1c2833" strokeWidth="10" strokeLinecap="round" />
        </g>
      </g>
      {[200, 230, 262, 280].map((x, i) => (
        <circle key={x} cx={x} cy="260" r={2 + (i % 2)} fill="none" stroke="#76e5ff" opacity=".7">
          <animate attributeName="cy" values="260;50" dur={`${3 + i * 0.7}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values=".8;0" dur={`${3 + i * 0.7}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M240 38 V70" stroke={C} strokeWidth="2" strokeDasharray="3 3" />
      <text x="16" y="286" fill={C} fontSize="10" fontFamily="JetBrains Mono" opacity=".8">SUBJECT LVT-07 // VITALS NOMINAL</text>
    </>
  )
}

function Dna() {
  const pts = Array.from({ length: 18 }, (_, i) => i)
  return (
    <>
      <Defs id="dna" />
      <rect width="480" height="300" fill="url(#dna-bg)" />
      <ellipse cx="240" cy="150" rx="200" ry="120" fill="url(#dna-spot)" />
      <g transform="translate(240 150) rotate(-18)">
        {pts.map((i) => {
          const x = -190 + i * 22
          return (
            <g key={i}>
              <line x1={x} x2={x} y1="-40" y2="40" stroke="#76e5ff" strokeOpacity=".35">
                <animate attributeName="y1" values="-40;40;-40" dur="3s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
                <animate attributeName="y2" values="40;-40;40" dur="3s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
              </line>
              <circle cx={x} r="5" fill={C} filter="url(#dna-g)">
                <animate attributeName="cy" values="-40;40;-40" dur="3s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="5;3;5" dur="3s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} r="4" fill={i % 3 === 0 ? RED : '#eaf7ff'} opacity=".85">
                <animate attributeName="cy" values="40;-40;40" dur="3s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
              </circle>
            </g>
          )
        })}
      </g>
      <g transform="translate(380 200)">
        <rect x="-12" y="-50" width="24" height="70" rx="6" fill={C} fillOpacity=".15" stroke={C} />
        <rect x="-10" y="-20" width="20" height="38" rx="4" fill={C} opacity=".7" filter="url(#dna-g)">
          <animate attributeName="opacity" values=".4;.9;.4" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="-8" y="-60" width="16" height="12" fill="#8295a5" />
      </g>
      <text x="16" y="286" fill={C} fontSize="10" fontFamily="JetBrains Mono" opacity=".8">SERUM LVT // PHYSETER SEQUENCE INJECTED</text>
    </>
  )
}

function Transform() {
  return (
    <>
      <Defs id="trf" />
      <rect width="480" height="300" fill="url(#trf-bg)" />
      <rect width="480" height="300" fill={RED} opacity="0">
        <animate attributeName="opacity" values="0;.18;0;0;.12;0" dur="2.2s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="240" cy="150" rx="180" ry="130" fill="url(#trf-spot)" />
      <g transform="translate(240 190)">
        {/* morphing head: human → whale forehead */}
        <rect fill="#2a3846" stroke={C} strokeWidth="1.5">
          <animate attributeName="x" values="-16;-44;-44;-16" keyTimes="0;.45;.85;1" dur="6s" repeatCount="indefinite" />
          <animate attributeName="y" values="-110;-150;-150;-110" keyTimes="0;.45;.85;1" dur="6s" repeatCount="indefinite" />
          <animate attributeName="width" values="32;90;90;32" keyTimes="0;.45;.85;1" dur="6s" repeatCount="indefinite" />
          <animate attributeName="height" values="34;84;84;34" keyTimes="0;.45;.85;1" dur="6s" repeatCount="indefinite" />
          <animate attributeName="rx" values="16;22;22;16" keyTimes="0;.45;.85;1" dur="6s" repeatCount="indefinite" />
        </rect>
        <g>
          <animateTransform attributeName="transform" type="scale" values="1 1;1.35 1.1;1.35 1.1;1 1" keyTimes="0;.45;.85;1" dur="6s" repeatCount="indefinite" />
          <path d={BODY} fill="#2a3846" />
          <path d={ARMS} fill="none" stroke="#2a3846" strokeWidth="11" strokeLinecap="round" />
        </g>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="0" cy="-100" r="10" fill="none" stroke={C} opacity="0">
            <animate attributeName="r" values="10;120" dur="2s" begin={`${i * 0.66}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values=".7;0" dur="2s" begin={`${i * 0.66}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      {[40, 110, 200, 250].map((y, i) => (
        <rect key={y} x="0" y={y} width="480" height="3" fill={C} opacity="0">
          <animate attributeName="opacity" values="0;.5;0" dur="0.8s" begin={`${i * 0.37}s`} repeatCount="indefinite" />
          <animate attributeName="x" values="-20;20;-20" dur="0.8s" begin={`${i * 0.37}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <rect x="300" y="22" width="160" height="26" fill="none" stroke={RED} />
      <text x="380" y="39" textAnchor="middle" fill={RED} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
        MUTATION UNSTABLE
        <animate attributeName="opacity" values="1;.2;1" dur=".9s" repeatCount="indefinite" />
      </text>
      <text x="16" y="286" fill={RED} fontSize="10" fontFamily="JetBrains Mono" opacity=".9">ERROR 0x0213 // IRREVERSIBLE CHANGE</text>
    </>
  )
}

function Abandon() {
  return (
    <>
      <Defs id="abn" />
      <rect width="480" height="300" fill="#02060c" />
      <path d="M0 0 L170 90 L170 230 L0 300 Z" fill="#050d16" />
      <path d="M480 0 L310 90 L310 230 L480 300 Z" fill="#050d16" />
      <rect x="170" y="90" width="140" height="140" fill="#030912" />
      <path d="M240 60 L180 300 L300 300 Z" fill="#76e5ff" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.01;0.07;0.02;0.06;0.06" keyTimes="0;.1;.15;.3;.35;1" dur="3s" repeatCount="indefinite" />
      </path>
      <rect x="225" y="56" width="30" height="6" fill="#76e5ff">
        <animate attributeName="opacity" values="1;.1;1;.2;1;1" keyTimes="0;.1;.15;.3;.35;1" dur="3s" repeatCount="indefinite" />
      </rect>
      <g transform="translate(240 255) scale(.75)">
        <circle cx="0" cy="-66" r="24" fill="#111a23" />
        <rect x="-36" y="-102" width="72" height="62" rx="18" fill="#111a23" />
        <path d="M-34 -40 Q-50 0 -40 30 L40 30 Q50 0 34 -40 Z" fill="#111a23" />
        <circle cx="-26" cy="-58" r="2" fill={C}>
          <animate attributeName="opacity" values=".2;1;.2" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={i} x1={(i * 53) % 480} x2={(i * 53) % 480 - 4} y1="-10" y2="6" stroke="#76e5ff" strokeOpacity=".25">
          <animateTransform attributeName="transform" type="translate" values="0 0; -20 320" dur={`${1.4 + (i % 4) * 0.3}s`} begin={`${(i % 7) * 0.2}s`} repeatCount="indefinite" />
        </line>
      ))}
      <g transform="translate(360 70) rotate(-12)">
        <rect x="-70" y="-18" width="140" height="36" fill="none" stroke={RED} strokeWidth="3" opacity=".85" />
        <text x="0" y="7" textAnchor="middle" fill={RED} fontSize="18" fontFamily="Chakra Petch" fontWeight="700" opacity=".85">
          DISCARDED
        </text>
      </g>
      <text x="16" y="286" fill="#8295a5" fontSize="10" fontFamily="JetBrains Mono">PROJECT STATUS: TERMINATED</text>
    </>
  )
}

function Rise() {
  return (
    <>
      <Defs id="rise" />
      <rect width="480" height="300" fill="url(#rise-bg)" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="240" cy="110" r="20" fill="none" stroke={C} strokeWidth="2" opacity="0">
          <animate attributeName="r" values="20;260" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values=".8;0" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <ellipse cx="240" cy="130" rx="150" ry="130" fill="url(#rise-spot)" />
      <path d="M0 300 L0 250 L30 250 L30 220 L60 220 L60 240 L90 240 L90 200 L120 200 L120 260 L150 260 L150 230 L330 230 L330 250 L360 250 L360 190 L392 190 L392 240 L420 240 L420 215 L450 215 L450 255 L480 255 L480 300Z" fill="#051320" />
      <g transform="translate(240 230)">
        <rect x="-46" y="-196" width="92" height="84" rx="24" fill="#0c1620" stroke={C} strokeOpacity=".6" />
        <path d="M-40 -112 Q-90 -100 -96 -60 L-80 40 L-58 40 L-50 -40 L-40 0 L40 0 L50 -40 L58 40 L80 40 L96 -60 Q90 -100 40 -112 Z" fill="#0c1620" stroke={C} strokeOpacity=".35" />
        <path d="M-30 0 L-34 70 L-8 70 L-4 10 L4 10 L8 70 L34 70 L30 0 Z" fill="#0c1620" />
        <circle cx="-38" cy="-128" r="3" fill="#bff6ff" filter="url(#rise-g)" />
        <circle cx="38" cy="-128" r="3" fill="#bff6ff" filter="url(#rise-g)" />
        <circle cx="0" cy="-160" r="18" fill="none" stroke={C} filter="url(#rise-g)" />
        <circle cx="0" cy="-160" r="6" fill={C} filter="url(#rise-g)">
          <animate attributeName="r" values="5;8;5" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="-60" r="7" fill={C} filter="url(#rise-g)" />
        <path d="M-60 -60 L-20 -40 M60 -60 L20 -40" stroke={C} strokeWidth="2" filter="url(#rise-g)" />
      </g>
      <text x="16" y="286" fill={RED} fontSize="10" fontFamily="JetBrains Mono">THREAT LEVEL: EXTREME // ABYSSAL KING ONLINE</text>
    </>
  )
}

const MAP = { lab: Lab, dna: Dna, transform: Transform, abandon: Abandon, rise: Rise }

export default function StageArt({ scene }) {
  const Comp = MAP[scene]
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={scene}>
      <Comp />
    </svg>
  )
}
