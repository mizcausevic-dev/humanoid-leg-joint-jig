import { MONO, SANS } from "../fonts";
import { elecAngle, mechAngle, POLES, SLOTS, slotAssignment, slotCurrent } from "../geom/motor";
import { PHASE_TEAL, C } from "../theme";

const CX = 1040;
const CY = 530;

function sector(a0: number, a1: number, r0: number, r1: number): string {
  const p = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(r0, a0)} L ${p(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 ${large} 0 ${p(r0, a0)} Z`;
}

export function SceneMotor({ frame }: { frame: number }) {
  const local = frame - 151;
  const mech = mechAngle(local);
  const elec = elecAngle(local);
  const mechDeg = (mech * 180) / Math.PI;
  const elecDeg = (elec * 180) / Math.PI;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="motor-steel" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#4A5564" />
          <stop offset="100%" stopColor="#2A313C" />
        </radialGradient>
        <filter id="motor-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${CX} ${CY})`}>
        <g transform={`rotate(${mechDeg})`}>
          <circle r={332} fill={C.housing} />
          <circle r={300} fill="#12161C" />
          {Array.from({ length: POLES }, (_, i) => {
            const pitch = (Math.PI * 2) / POLES;
            const mid = -Math.PI / 2 + i * pitch;
            const span = pitch * 0.78;
            const north = i % 2 === 0;
            return (
              <g key={i}>
                <path d={sector(mid - span / 2, mid + span / 2, 248, 292)} fill={north ? "#4E5968" : "#2C333E"} />
                <text
                  x={Math.cos(mid) * 270}
                  y={Math.sin(mid) * 270}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={C.bone}
                  fontFamily={MONO}
                  fontSize={11}
                  transform={`rotate(${(-mechDeg).toFixed(2)} ${Math.cos(mid) * 270} ${Math.sin(mid) * 270})`}
                >
                  {north ? "N" : "S"}
                </text>
              </g>
            );
          })}
          <circle r={332} fill="none" stroke={C.titaniumHi} strokeWidth={3} />
          <path d="M 248 -248 A 300 300 0 0 1 292 -70" fill="none" stroke={C.bone} strokeWidth={2} />
          <polygon points="292,-70 278,-78 286,-58" fill={C.bone} />
        </g>

        <circle r={228} fill="url(#motor-steel)" />
        <circle r={108} fill={C.housing} />
        {Array.from({ length: SLOTS }, (_, i) => {
          const pitch = (Math.PI * 2) / SLOTS;
          const mid = -Math.PI / 2 + i * pitch;
          const span = pitch * 0.52;
          return <path key={i} d={sector(mid - span / 2, mid + span / 2, 112, 226)} fill="#2E3642" stroke="#1A1E26" strokeWidth={1} />;
        })}
        {Array.from({ length: SLOTS }, (_, i) => {
          const pitch = (Math.PI * 2) / SLOTS;
          const mid = -Math.PI / 2 + (i + 0.5) * pitch;
          const current = slotCurrent(local, i);
          const phase = slotAssignment(i).phase;
          const color = PHASE_TEAL[phase];
          const mag = Math.min(1, Math.abs(current));
          const r = 7 + mag * 8;
          const x = Math.cos(mid) * 176;
          const y = Math.sin(mid) * 176;
          const toward = current >= 0;
          return (
            <g key={i} opacity={0.4 + mag * 0.6} filter="url(#motor-glow)">
              <circle cx={x} cy={y} r={r} fill={toward ? color : "none"} stroke={color} strokeWidth={2} />
              {toward ? (
                <circle cx={x} cy={y} r={r * 0.28} fill={C.tealInk} />
              ) : (
                <path
                  d={`M ${x - r * 0.45} ${y - r * 0.45} L ${x + r * 0.45} ${y + r * 0.45} M ${x + r * 0.45} ${y - r * 0.45} L ${x - r * 0.45} ${y + r * 0.45}`}
                  stroke={color}
                  strokeWidth={1.7}
                />
              )}
            </g>
          );
        })}

        <circle r={236} fill="none" stroke={C.teal} strokeWidth={1.5} strokeDasharray="3 5" opacity={0.85} />
        <circle r={64} fill={C.ink} stroke={C.titanium} strokeWidth={3} />

        <g transform={`rotate(${elecDeg})`}>
          <line x1={0} y1={0} x2={52} y2={0} stroke={C.teal} strokeWidth={3} />
          <polygon points="52,0 42,-5 42,5" fill={C.teal} />
        </g>
        {[0, 120, 240].map((deg, i) => (
          <line
            key={deg}
            x1={0}
            y1={0}
            x2={36 * Math.cos((deg * Math.PI) / 180)}
            y2={36 * Math.sin((deg * Math.PI) / 180)}
            stroke={PHASE_TEAL[i]}
            strokeWidth={1}
            opacity={0.45}
          />
        ))}
      </g>

      <g fontFamily={SANS} fill={C.bone}>
        <text x={120} y={180} fontSize={18} fontWeight={600}>
          PM ROTOR
        </text>
        <text x={120} y={202} fontFamily={MONO} fontSize={13} fill={C.boneDim}>
          {POLES} poles, outside the stator
        </text>
        <line x1={250} y1={188} x2={760} y2={250} stroke={C.bone} strokeWidth={1.2} />

        <text x={120} y={280} fontSize={18} fontWeight={600}>
          STATOR COILS
        </text>
        <text x={120} y={302} fontFamily={MONO} fontSize={13} fill={C.boneDim}>
          {SLOTS} slots, concentrated 3-phase
        </text>
        <line x1={280} y1={286} x2={900} y2={470} stroke={C.teal} strokeWidth={1.2} />

        <text x={120} y={640} fontSize={18} fontWeight={600}>
          AIR GAP
        </text>
        <text x={120} y={662} fontFamily={MONO} fontSize={13} fill={C.boneDim}>
          Shear between magnet and tooth
        </text>
        <line x1={360} y1={648} x2={780} y2={560} stroke={C.teal} strokeWidth={1.2} />
      </g>

      <g transform="translate(120 790)">
        <text fill={C.boneDim} fontFamily={MONO} fontSize={12} letterSpacing="0.12em">
          DOT TOWARD · CROSS AWAY · SPEED REDUCED
        </text>
        {[0, 1, 2].map((phase) => (
          <polyline
            key={phase}
            fill="none"
            stroke={PHASE_TEAL[phase]}
            strokeWidth={2}
            points={Array.from({ length: 90 }, (_, i) => {
              const u = i / 89;
              const ang = elec - (1 - u) * Math.PI * 4;
              const s = Math.sin(ang - (phase * 2 * Math.PI) / 3);
              return `${u * 460},${70 + phase * 28 - s * 10}`;
            }).join(" ")}
          />
        ))}
        {["A", "B", "C"].map((label, i) => (
          <text key={label} x={470} y={74 + i * 28} fill={PHASE_TEAL[i]} fontFamily={MONO} fontSize={12}>
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
}
