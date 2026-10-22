import { interpolate } from "remotion";
import { lerp, smoothstep } from "../anim";
import { MONO, SANS } from "../fonts";
import {
  FOOT_D,
  GROUND_Y,
  layoutLimb,
  LIMB_SERIES,
  PULL_FRAMES,
  SHANK_LEN,
  STRIKE_AT,
  SWING_HIP_DX,
  THIGH_LEN,
} from "../geom/limb";
import { C } from "../theme";

const SCREEN = { x: 700, y: 520 };

function Actuator({ r, sensor, gear }: { r: number; sensor: number; gear: number }) {
  return (
    <g>
      <circle r={r} fill={C.housing} stroke={C.titaniumHi} strokeWidth={2} />
      <circle r={r - 8} fill="none" stroke={C.titanium} strokeWidth={7} />
      <circle r={r * 0.62} fill="none" stroke={C.teal} strokeWidth={2.4} opacity={0.3 + gear * 0.6} />
      <path
        d={`M ${r * 0.15} ${-r * 0.05} A ${r * 0.32} ${r * 0.32} 0 0 1 ${-r * 0.12} ${r * 0.22}`}
        fill="none"
        stroke={C.orange}
        strokeWidth={2.2}
        opacity={0.85}
      />
      <circle cy={-r * 0.22} r={4.5} fill={C.violet} opacity={0.3 + Math.min(1, sensor) * 0.7} />
      <circle r={r * 0.15} fill={C.titanium} />
    </g>
  );
}

function Leg({
  hip,
  knee,
  ankle,
  torque,
  rear,
}: {
  hip: number;
  knee: number;
  ankle: number;
  torque: number;
  rear: boolean;
}) {
  const link = rear ? C.titaniumLo : "url(#limb-ti)";
  return (
    <g opacity={rear ? 0.72 : 1}>
      <g transform={`rotate(${-hip})`}>
        <rect x={-22} y={46} width={44} height={THIGH_LEN - 92} rx={8} fill={link} />
        <rect x={-9} y={80} width={18} height={THIGH_LEN - 160} rx={3} fill={C.housing} />
        <g transform={`translate(0 ${THIGH_LEN})`}>
          <g transform={`rotate(${knee})`}>
            <rect x={-18} y={44} width={36} height={SHANK_LEN - 88} rx={7} fill={link} />
            <rect x={-7} y={72} width={14} height={SHANK_LEN - 140} rx={3} fill={C.housing} />
            <g transform={`translate(0 ${SHANK_LEN})`}>
              <g transform={`rotate(${ankle})`}>
                <path d={FOOT_D} fill={link} />
                <rect x={-20} y={30} width={28} height={10} rx={2} fill={C.housing} />
              </g>
              <Actuator r={30} sensor={torque * 0.7} gear={0.45} />
            </g>
          </g>
          <Actuator r={48} sensor={torque} gear={0.85} />
        </g>
      </g>
      <Actuator r={38} sensor={torque * 0.35} gear={0.4} />
    </g>
  );
}

export function SceneLimb({ frame }: { frame: number }) {
  const layout = layoutLimb(frame);
  const u = smoothstep(interpolate(layout.local, [0, PULL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const knee = { x: layout.hipX + layout.stance.knee.x, y: layout.hipY + layout.stance.knee.y };
  const body = { x: layout.hipX - 80, y: (layout.hipY + GROUND_Y) / 2 };
  const focus = { x: lerp(knee.x, body.x, u), y: lerp(knee.y, body.y, u) };
  const scale = lerp(2.75, 1, u);
  const project = (x: number, y: number) => ({
    x: SCREEN.x + (x - focus.x) * scale,
    y: SCREEN.y + (y - focus.y) * scale,
  });
  const charts = interpolate(layout.local, [70, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impact = layout.local >= STRIKE_AT ? Math.exp(-(layout.local - STRIKE_AT) / 18) : 0;
  const hipP = project(layout.hipX, layout.hipY);
  const kneeP = project(knee.x, knee.y);
  const ankleP = project(layout.hipX + layout.stance.ankle.x, layout.hipY + layout.stance.ankle.y);
  const heelP = project(layout.hipX + layout.stance.heel.x, layout.hipY + layout.stance.heel.y);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="limb-ti" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2A313C" />
          <stop offset="35%" stopColor="#5C6778" />
          <stop offset="100%" stopColor="#383E4A" />
        </linearGradient>
      </defs>

      <g transform={`translate(${SCREEN.x} ${SCREEN.y}) scale(${scale}) translate(${-focus.x} ${-focus.y})`}>
        <line x1={-700} y1={GROUND_Y} x2={1500} y2={GROUND_Y} stroke={C.boneFaint} strokeWidth={2} />
        {Array.from({ length: 28 }, (_, i) => (
          <line key={i} x1={-680 + i * 70} y1={GROUND_Y} x2={-650 + i * 70} y2={GROUND_Y + 18} stroke={C.boneFaint} strokeWidth={1} />
        ))}
        <g transform={`translate(${layout.hipX} ${layout.hipY})`}>
          <rect x={-250} y={-34} width={300} height={58} rx={8} fill={C.titanium} />
          <rect x={-220} y={-16} width={220} height={22} rx={3} fill={C.housing} />
          <g transform={`translate(${SWING_HIP_DX} 0)`}>
            <Leg
              hip={layout.pose.swingHip}
              knee={layout.pose.swingKnee}
              ankle={layout.pose.swingAnkle}
              torque={layout.pose.torque * 0.2}
              rear
            />
          </g>
          <Leg
            hip={layout.pose.hip}
            knee={layout.pose.knee}
            ankle={layout.pose.ankle}
            torque={layout.pose.torque}
            rear={false}
          />
        </g>
        {impact > 0.05 ? (
          <circle
            cx={layout.hipX + layout.stance.heel.x}
            cy={GROUND_Y}
            r={18 + (1 - impact) * 70}
            fill="none"
            stroke={C.bone}
            strokeWidth={2}
            opacity={impact * 0.7}
          />
        ) : null}
      </g>

      {u > 0.55 ? (
        <g fontFamily={MONO} fontSize={13} fill={C.boneDim} opacity={Math.min(1, (u - 0.55) / 0.3)}>
          <text x={hipP.x + 46} y={hipP.y - 8}>
            HIP
          </text>
          <text x={kneeP.x + 56} y={kneeP.y}>
            KNEE
          </text>
          <text x={ankleP.x + 40} y={ankleP.y}>
            ANKLE
          </text>
        </g>
      ) : null}

      {impact > 0.4 ? (
        <text x={heelP.x - 20} y={heelP.y - 30} fill={C.bone} fontFamily={SANS} fontSize={16} fontWeight={600}>
          HEEL STRIKE
        </text>
      ) : null}

      <g opacity={charts}>
        <Chart x={1180} y={150} title="HIP" series={LIMB_SERIES.hip} torque={LIMB_SERIES.torque} play={layout.local} scaleTorque={0.35} />
        <Chart x={1180} y={390} title="KNEE" series={LIMB_SERIES.knee} torque={LIMB_SERIES.torque} play={layout.local} scaleTorque={1} />
        <Chart x={1180} y={630} title="ANKLE" series={LIMB_SERIES.ankle} torque={LIMB_SERIES.torque} play={layout.local} scaleTorque={0.75} />
        <text x={1180} y={900} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
          SOLID ANGLE IS THE POSE ON SCREEN. VIOLET τ IS SCHEMATIC.
        </text>
      </g>
    </svg>
  );
}

function Chart({
  x,
  y,
  title,
  series,
  torque,
  play,
  scaleTorque,
}: {
  x: number;
  y: number;
  title: string;
  series: number[];
  torque: number[];
  play: number;
  scaleTorque: number;
}) {
  const w = 620;
  const h = 150;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const line = series
    .map((v, i) => {
      const px = x + (i / (series.length - 1)) * w;
      const py = y + 36 + (1 - (v - min) / span) * (h - 20);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  const tMax = Math.max(...torque, 0.001);
  const tLine = torque
    .map((v, i) => {
      const px = x + (i / (torque.length - 1)) * w;
      const py = y + 36 + (1 - (v * scaleTorque) / tMax) * (h - 20);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  const playX = x + (Math.min(play, series.length - 1) / (series.length - 1)) * w;
  const strikeX = x + (STRIKE_AT / (series.length - 1)) * w;
  return (
    <g>
      <text x={x} y={y} fill={C.bone} fontFamily={SANS} fontSize={16} fontWeight={600}>
        {title}
      </text>
      <text x={x + 70} y={y} fill={C.boneDim} fontFamily={MONO} fontSize={12}>
        ILLUSTRATED ANGLE
      </text>
      <rect x={x} y={y + 14} width={w} height={h} fill="rgba(23,26,33,0.8)" stroke={C.titanium} />
      <line x1={strikeX} y1={y + 14} x2={strikeX} y2={y + 14 + h} stroke={C.violet} strokeWidth={1} opacity={0.7} />
      <polyline points={tLine} fill="none" stroke={C.violet} strokeWidth={1.5} opacity={0.9} />
      <polyline points={line} fill="none" stroke={C.bone} strokeWidth={2} />
      <line x1={playX} y1={y + 14} x2={playX} y2={y + 14 + h} stroke={C.teal} strokeWidth={1.25} />
    </g>
  );
}
