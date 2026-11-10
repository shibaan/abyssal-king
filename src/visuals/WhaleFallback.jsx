/** Hand-built SVG illustration of ABYSSAL KING — used when WebGL is unavailable. */
export default function WhaleFallback({ className = '' }) {
  return (
    <svg viewBox="0 0 400 600" className={className} role="img" aria-label="ABYSSAL KING illustration">
      <defs>
        <radialGradient id="wf-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#0b2538" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#030912" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wf-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a4a5a" />
          <stop offset="100%" stopColor="#141d27" />
        </linearGradient>
        <linearGradient id="wf-armor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14304a" />
          <stop offset="100%" stopColor="#050b13" />
        </linearGradient>
        <linearGradient id="wf-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#56636f" />
          <stop offset="50%" stopColor="#a7b5c2" />
          <stop offset="100%" stopColor="#47535e" />
        </linearGradient>
        <filter id="wf-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="200" cy="300" rx="200" ry="300" fill="url(#wf-bg)" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -8; 0 0" dur="5s" repeatCount="indefinite" />
        {/* legs */}
        <path d="M150 400 L140 520 L132 560 L182 560 L184 520 L196 410Z" fill="url(#wf-armor)" stroke="#0b2538" />
        <path d="M250 400 L260 520 L268 560 L218 560 L216 520 L204 410Z" fill="url(#wf-armor)" stroke="#0b2538" />
        <rect x="132" y="548" width="52" height="14" rx="4" fill="url(#wf-metal)" />
        <rect x="216" y="548" width="52" height="14" rx="4" fill="url(#wf-metal)" />
        <line x1="160" y1="470" x2="158" y2="530" stroke="#00d9ff" strokeWidth="2" filter="url(#wf-glow)" />
        <line x1="240" y1="470" x2="242" y2="530" stroke="#00d9ff" strokeWidth="2" filter="url(#wf-glow)" />
        {/* torso */}
        <path d="M120 215 Q200 190 280 215 L268 330 Q250 380 232 398 L168 398 Q150 380 132 330Z" fill="url(#wf-skin)" />
        <path d="M130 225 Q165 214 198 222 L196 290 Q160 296 136 282Z" fill="url(#wf-armor)" stroke="#1d3a52" />
        <path d="M270 225 Q235 214 202 222 L204 290 Q240 296 264 282Z" fill="url(#wf-armor)" stroke="#1d3a52" />
        {[300, 326, 352].map((y) => (
          <g key={y}>
            <rect x="168" y={y} width="30" height="20" rx="5" fill="#070f18" stroke="#1d3a52" />
            <rect x="202" y={y} width="30" height="20" rx="5" fill="#070f18" stroke="#1d3a52" />
          </g>
        ))}
        <line x1="200" y1="296" x2="200" y2="374" stroke="#00d9ff" strokeWidth="2" filter="url(#wf-glow)" />
        <circle cx="200" cy="252" r="14" fill="#0b141d" stroke="url(#wf-metal)" strokeWidth="3" />
        <circle cx="200" cy="252" r="7" fill="#00d9ff" filter="url(#wf-glow)">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="150" y="386" width="100" height="16" rx="6" fill="url(#wf-metal)" />
        <path d="M188 394 Q200 386 212 394 Q200 398 188 394Z" fill="#00d9ff" filter="url(#wf-glow)" />
        {/* arms */}
        {[
          { x: 92, flip: 1 },
          { x: 308, flip: -1 },
        ].map(({ x, flip }) => (
          <g key={x}>
            <path d={`M${x} 230 Q${x - flip * 18} 290 ${x - flip * 14} 320 L${x + flip * 22} 320 Q${x + flip * 30} 280 ${x + flip * 30} 236Z`} fill="url(#wf-skin)" />
            <path d={`M${x - flip * 22} 320 L${x - flip * 30} 410 L${x + flip * 24} 410 L${x + flip * 26} 320Z`} fill="url(#wf-armor)" stroke="#1d3a52" />
            <line x1={x - flip * 24} y1="330" x2={x + flip * 24} y2="330" stroke="#00d9ff" strokeWidth="2" filter="url(#wf-glow)" />
            <line x1={x - flip * 28} y1="400" x2={x + flip * 22} y2="400" stroke="#00d9ff" strokeWidth="2" filter="url(#wf-glow)" />
            <rect x={Math.min(x - flip * 30, x + flip * 26) - 2} y="410" width="58" height="44" rx="12" fill="url(#wf-skin)" />
            <rect x={Math.min(x - flip * 30, x + flip * 26)} y="440" width="54" height="10" rx="3" fill="url(#wf-metal)" />
            <ellipse cx={x} cy="218" rx="46" ry="30" fill="url(#wf-armor)" stroke="#2a4a66" />
            <path d={`M${x - 46} 222 Q${x} 196 ${x + 46} 222`} fill="none" stroke="#00d9ff" strokeWidth="1.5" filter="url(#wf-glow)" />
          </g>
        ))}
        {/* neck */}
        <path d="M158 196 L242 196 L254 222 L146 222Z" fill="url(#wf-skin)" />
        <rect x="146" y="206" width="108" height="10" rx="5" fill="url(#wf-metal)" />
        {/* head: massive sperm-whale forehead */}
        <rect x="118" y="34" width="164" height="150" rx="38" fill="url(#wf-skin)" stroke="#3b4c5c" />
        <path d="M130 60 Q200 40 270 60" fill="none" stroke="#4d5e6e" strokeWidth="1" opacity=".6" />
        <path d="M126 96 Q200 82 274 96" fill="none" stroke="#4d5e6e" strokeWidth="1" opacity=".5" />
        <rect x="160" y="26" width="80" height="12" rx="5" fill="url(#wf-metal)" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="200" cy="104" r={16 + i * 16} fill="none" stroke="#00d9ff" strokeWidth="1.5" opacity={0.85 - i * 0.22} filter="url(#wf-glow)">
            <animate attributeName="opacity" values={`${0.85 - i * 0.22};0.15;${0.85 - i * 0.22}`} dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <circle cx="200" cy="104" r="5" fill="#00d9ff" filter="url(#wf-glow)" />
        {/* squid scars */}
        <circle cx="140" cy="70" r="5" fill="none" stroke="#8a96a0" opacity=".6" />
        <circle cx="262" cy="80" r="4" fill="none" stroke="#8a96a0" opacity=".6" />
        <circle cx="252" cy="140" r="3.5" fill="none" stroke="#8a96a0" opacity=".6" />
        {/* small deep-set eyes */}
        <path d="M124 146 L146 140" stroke="#151e27" strokeWidth="6" strokeLinecap="round" />
        <path d="M276 146 L254 140" stroke="#151e27" strokeWidth="6" strokeLinecap="round" />
        <circle cx="136" cy="152" r="3" fill="#bff6ff" filter="url(#wf-glow)" />
        <circle cx="264" cy="152" r="3" fill="#bff6ff" filter="url(#wf-glow)" />
        {/* underslung jaw */}
        <rect x="172" y="180" width="56" height="16" rx="6" fill="#1c2833" stroke="#3b4c5c" />
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M${176 + i * 7.5} 182 l3 -6 l3 6z`} fill="#d9d2bf" />
        ))}
      </g>
      {/* emitted sonar rings */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="200" cy="104" r="20" fill="none" stroke="#00d9ff" strokeWidth="1">
          <animate attributeName="r" values="20;190" dur="3.6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="3.6s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <ellipse cx="200" cy="576" rx="130" ry="14" fill="none" stroke="#00d9ff" strokeOpacity=".5" />
      <ellipse cx="200" cy="576" rx="80" ry="8" fill="none" stroke="#00d9ff" strokeOpacity=".3" />
    </svg>
  )
}
