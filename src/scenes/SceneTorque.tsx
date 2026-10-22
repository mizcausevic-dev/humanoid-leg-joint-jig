import { MONO, SANS } from "../fonts";
import { bridgeWord, flexureTorque } from "../geom/signals";
import { C } from "../theme";

const CX = 620;
const CY = 540;

export function SceneTorque({ frame }: { frame: number }) {
  const local = Math.max(0, frame - 511);
  const torque = flexureTorque(local);
  const sag = torque * 18;
  const wind = torque * 7;
  const sample = Math.floor((local / 30) * 1000);
  const words: string[] = [];
  for (let i = 23; i >= 0; i--) words.push(bridgeWord(Math.max(0, sample - i * 6)));

  const points: string[] = [];
  for (let f = 0; f <= 240; f += 2) {
    const v = flexureTorque(f);
    const x = 28 + (f / 240) * 700;
    const y = 328 - Math.min(v, 1.2) * 78;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const playX = 28 + (Math.min(local, 240) / 240) * 700;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="torque-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.titaniumHi} strokeWidth="1" />
        </pattern>
        <linearGradient id="torque-spoke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.titaniumHi} />
          <stop offset="100%" stopColor={C.titaniumLo} />
        </linearGradient>
      </defs>

      <g transform={`translate(${CX} ${CY})`}>
        <circle r={250} fill={C.housing} />
        <path
          d={arc(232, 0.55, Math.PI * 2 - 0.35)}
          stroke="url(#torque-spoke)"
          strokeWidth={36}
          fill="none"
          strokeLinecap="butt"
        />
        <g transform="rotate(28)">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={210} y1={-40 + i * 8} x2={258} y2={-40 + i * 8} stroke={C.titaniumHi} strokeWidth={1} />
          ))}
        </g>
        <text x={150} y={-20} fill={C.boneDim} fontFamily={MONO} fontSize={11}>
          CUT
        </text>

        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const aRoot = a + (wind * Math.PI) / 180;
          const n = a + Math.PI / 2;
          const r0 = 64;
          const r1 = 214;
          const midR = (r0 + r1) / 2;
          const x0 = Math.cos(aRoot) * r0;
          const y0 = Math.sin(aRoot) * r0;
          const x1 = Math.cos(a) * r1;
          const y1 = Math.sin(a) * r1;
          const mx = Math.cos(a) * midR + Math.cos(n) * sag;
          const my = Math.sin(a) * midR + Math.sin(n) * sag;
          const gr = r0 + (r1 - r0) * 0.46;
          const gx = Math.cos(a) * gr + Math.cos(n) * sag * 0.65;
          const gy = Math.sin(a) * gr + Math.sin(n) * sag * 0.65;
          const deg = (a * 180) / Math.PI;
          return (
            <g key={i}>
              <path d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} stroke="url(#torque-spoke)" strokeWidth={20} fill="none" strokeLinecap="round" />
              <circle cx={gx} cy={gy} r={18} fill={C.violet} opacity={torque * 0.28} />
              <g transform={`translate(${gx} ${gy}) rotate(${deg})`}>
                <rect x={-12} y={-5} width={24} height={10} rx={1.5} fill={C.violet} opacity={0.4 + Math.min(1, torque) * 0.6} />
                <rect x={-8} y={-2} width={16} height={4} fill={C.violetHot} opacity={0.35 + torque * 0.5} />
              </g>
            </g>
          );
        })}

        <g transform={`rotate(${wind})`}>
          <circle r={64} fill={C.housingHi} stroke={C.titaniumHi} strokeWidth={3} />
          <circle r={24} fill={C.ink} />
        </g>
        <circle r={214} fill="none" stroke={C.titaniumLo} strokeWidth={2} />
      </g>

      <g transform="translate(1040 150)">
        <rect width={760} height={760} rx={8} fill="rgba(23,26,33,0.92)" stroke={C.titanium} />
        <text x={28} y={42} fill={C.bone} fontFamily={SANS} fontSize={22} fontWeight={600}>
          TORQUE FLEXURE
        </text>
        <text x={28} y={66} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          SPOKE SAG IS EXAGGERATED · TRACE IS SCHEMATIC
        </text>

        <text x={28} y={120} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          SCREEN SAG
        </text>
        <text x={28} y={156} fill={C.violetHot} fontFamily={MONO} fontSize={36}>
          {sag.toFixed(1)} px
        </text>
        <text x={250} y={120} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          SCHEMATIC τ
        </text>
        <text x={250} y={156} fill={C.bone} fontFamily={MONO} fontSize={36}>
          {torque.toFixed(2)}
        </text>
        <text x={430} y={120} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          SAMPLE INDEX
        </text>
        <text x={430} y={156} fill={C.teal} fontFamily={MONO} fontSize={36}>
          {sample}
        </text>
        <text x={430} y={180} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          1 kHz · DISPLAY EVERY 6th
        </text>

        <text x={28} y={214} fill={C.boneDim} fontFamily={MONO} fontSize={12} letterSpacing="0.12em">
          IMPEDANCE STREAM
        </text>
        <rect x={28} y={224} width={700} height={120} fill="#10141A" stroke={C.titanium} />
        <polyline points={points.join(" ")} fill="none" stroke={C.violet} strokeWidth={2} />
        <line x1={playX} y1={224} x2={playX} y2={344} stroke={C.bone} strokeWidth={1} />

        <text x={28} y={400} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          BRIDGE WORDS
        </text>
        {Array.from({ length: 4 }, (_, row) => (
          <text key={row} x={28} y={430 + row * 28} fill={C.bone} fontFamily={MONO} fontSize={16}>
            {words.slice(row * 6, row * 6 + 6).join("  ")}
          </text>
        ))}

        <g transform="translate(80 620)">
          <Bridge />
        </g>
        <text x={360} y={640} fill={C.bone} fontFamily={SANS} fontSize={16} fontWeight={600}>
          FULL BRIDGE
        </text>
        <text x={360} y={664} fill={C.boneDim} fontFamily={MONO} fontSize={13}>
          Eight gauges on the spokes.
        </text>
        <text x={360} y={686} fill={C.boneDim} fontFamily={MONO} fontSize={13}>
          Four of them form the bridge.
        </text>
        <text x={360} y={720} fill={C.violet} fontFamily={MONO} fontSize={13}>
          JOINT IMPEDANCE FROM τ
        </text>
      </g>

      <line x1={760} y1={500} x2={1040} y2={430} stroke={C.violet} strokeWidth={1.2} />
    </svg>
  );
}

function arc(r: number, a0: number, a1: number): string {
  const p = (a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(a0)} A ${r} ${r} 0 ${large} 1 ${p(a1)}`;
}

function Bridge() {
  const nodes = [
    [0, 40],
    [80, 0],
    [160, 40],
    [80, 80],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  return (
    <g>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={C.violet}
          strokeWidth={3}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={C.violetHot} />
      ))}
      <text x={-8} y={108} fill={C.boneDim} fontFamily={MONO} fontSize={11}>
        WHEATSTONE
      </text>
    </g>
  );
}
