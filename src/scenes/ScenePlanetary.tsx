import { interpolate } from "remotion";
import { MONO, SANS } from "../fonts";
import {
  CENTER_DIST,
  circlePath,
  externalRadii,
  gearState,
  internalRadii,
  PLANET_COUNT,
  planetOrbit,
  planetSpin,
  PLANET_PITCH,
  PLANET_TEETH,
  RATIO,
  RING_PITCH,
  RING_ROTATION,
  RING_TEETH,
  spurPath,
  SUN_PITCH,
  SUN_TEETH,
  sunRotation,
} from "../geom/gears";
import { C } from "../theme";

const SCREEN = { x: 980, y: 540 };

export function ScenePlanetary({ frame }: { frame: number }) {
  const local = Math.max(0, frame - 301);
  const zoom = interpolate(local, [8, 78], [1, 2.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const track = interpolate(local, [8, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbit0 = planetOrbit(local, 0);
  const meshX = SCREEN.x + Math.cos(orbit0) * SUN_PITCH;
  const meshY = SCREEN.y + Math.sin(orbit0) * SUN_PITCH;
  const camX = SCREEN.x + (meshX - SCREEN.x) * track;
  const camY = SCREEN.y + (meshY - SCREEN.y) * track;
  const project = (x: number, y: number) => ({
    x: SCREEN.x + (x - camX) * zoom,
    y: SCREEN.y + (y - camY) * zoom,
  });

  const sun = externalRadii(SUN_PITCH);
  const planet = externalRadii(PLANET_PITCH);
  const ring = internalRadii();
  const { carrier, sun: sunAng } = gearState(local);
  const breathe = 0.84 + 0.16 * Math.sin((local / 80) * Math.PI * 2);
  const sunFocus = project(meshX, meshY);
  const ringFocus = project(SCREEN.x + Math.cos(orbit0) * RING_PITCH, SCREEN.y + Math.sin(orbit0) * RING_PITCH);
  const pinFocus = project(SCREEN.x + Math.cos(orbit0) * CENTER_DIST, SCREEN.y + Math.sin(orbit0) * CENTER_DIST);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="gear-sun" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6A7484" />
          <stop offset="55%" stopColor="#3C4452" />
          <stop offset="100%" stopColor="#242A33" />
        </radialGradient>
        <radialGradient id="gear-planet" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#5C6778" />
          <stop offset="100%" stopColor="#2A313C" />
        </radialGradient>
        <radialGradient id="gear-hot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.orange} stopOpacity={0.95} />
          <stop offset="65%" stopColor={C.orange} stopOpacity={0.18} />
          <stop offset="100%" stopColor={C.orange} stopOpacity={0} />
        </radialGradient>
      </defs>

      <g transform={`translate(${SCREEN.x} ${SCREEN.y}) scale(${zoom}) translate(${-camX} ${-camY})`}>
        <g transform={`translate(${SCREEN.x} ${SCREEN.y})`}>
          <path
            d={`${circlePath(ring.root + 36)} ${spurPath(RING_TEETH, ring.root, ring.tip, RING_ROTATION)}`}
            fill={C.titanium}
            fillRule="evenodd"
          />
          <path
            d={spurPath(RING_TEETH, ring.root, ring.tip, RING_ROTATION)}
            fill="none"
            stroke="#1A1E26"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
          />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const br = ring.root + 22;
            return <circle key={i} cx={Math.cos(a) * br} cy={Math.sin(a) * br} r={5} fill="#1A1E26" stroke={C.titaniumHi} strokeWidth={1} />;
          })}
        </g>

        <g transform={`translate(${SCREEN.x} ${SCREEN.y}) rotate(${(carrier * 180) / Math.PI})`}>
          {Array.from({ length: PLANET_COUNT }, (_, k) => {
            const a = -Math.PI / 2 + (k * 2 * Math.PI) / PLANET_COUNT;
            return (
              <line
                key={k}
                x1={Math.cos(a) * 78}
                y1={Math.sin(a) * 78}
                x2={Math.cos(a) * (CENTER_DIST - 36)}
                y2={Math.sin(a) * (CENTER_DIST - 36)}
                stroke={C.titaniumHi}
                strokeWidth={12}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          <circle r={46} fill="none" stroke={C.titaniumHi} strokeWidth={8} vectorEffect="non-scaling-stroke" />
        </g>

        <g transform={`translate(${SCREEN.x} ${SCREEN.y}) rotate(${(sunRotation(local) * 180) / Math.PI})`}>
          <path d={spurPath(SUN_TEETH, sun.root, sun.tip, 0)} fill="url(#gear-sun)" stroke="#1A1E26" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <circle cx={sun.tip - 2} cy={0} r={3.5} fill={C.bone} />
        </g>

        {Array.from({ length: PLANET_COUNT }, (_, k) => {
          const a = planetOrbit(local, k);
          const px = SCREEN.x + Math.cos(a) * CENTER_DIST;
          const py = SCREEN.y + Math.sin(a) * CENTER_DIST;
          const spin = (planetSpin(local, k) * 180) / Math.PI;
          return (
            <g key={k} transform={`translate(${px} ${py})`}>
              <g transform={`rotate(${spin})`}>
                <path
                  d={spurPath(PLANET_TEETH, planet.root, planet.tip, 0)}
                  fill="url(#gear-planet)"
                  stroke="#1A1E26"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
              <circle r={30} fill={C.housing} />
              {Array.from({ length: 9 }, (_, n) => {
                const na = carrier * 3 + (n / 9) * Math.PI * 2;
                return <circle key={n} cx={Math.cos(na) * 22} cy={Math.sin(na) * 22} r={3.3} fill={C.titaniumHi} />;
              })}
              <circle r={12} fill={C.titanium} stroke={C.boneDim} strokeWidth={1} />
            </g>
          );
        })}

        {Array.from({ length: PLANET_COUNT }, (_, k) => {
          const a = planetOrbit(local, k);
          const sunMesh = { x: SCREEN.x + Math.cos(a) * SUN_PITCH, y: SCREEN.y + Math.sin(a) * SUN_PITCH };
          const ringMesh = { x: SCREEN.x + Math.cos(a) * RING_PITCH, y: SCREEN.y + Math.sin(a) * RING_PITCH };
          return (
            <g key={k} opacity={breathe}>
              <circle cx={sunMesh.x} cy={sunMesh.y} r={16} fill="url(#gear-hot)" />
              <circle cx={ringMesh.x} cy={ringMesh.y} r={16} fill="url(#gear-hot)" />
            </g>
          );
        })}

        <g transform={`translate(${SCREEN.x} ${SCREEN.y}) rotate(${(carrier * 180) / Math.PI})`}>
          {Array.from({ length: PLANET_COUNT }, (_, k) => {
            const a = -Math.PI / 2 + (k * 2 * Math.PI) / PLANET_COUNT;
            return (
              <line
                key={k}
                x1={Math.cos(a) * 58}
                y1={Math.sin(a) * 58}
                x2={Math.cos(a) * (CENTER_DIST - 6)}
                y2={Math.sin(a) * (CENTER_DIST - 6)}
                stroke={C.bone}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          <circle r={44} fill="none" stroke={C.bone} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </g>
      </g>

      <g fontFamily={SANS} fill={C.bone}>
        <CallLabel x={120} y={190} title="SUN" body={`${SUN_TEETH} teeth · motor side`} anchor={sunFocus} color={C.orange} showLine={zoom < 1.7} />
        <CallLabel x={120} y={270} title="PLANET" body={`${PLANET_TEETH} teeth · needle bore`} anchor={pinFocus} color={C.orange} showLine={zoom < 1.7} />
        <CallLabel x={120} y={350} title="RING FIXED" body={`${RING_TEETH} teeth · housing`} anchor={ringFocus} color={C.bone} showLine={zoom < 1.7} />
        <text x={120} y={430} fontSize={18} fontWeight={600}>
          CARRIER
        </text>
        <text x={120} y={456} fontFamily={MONO} fontSize={18} fill={C.orange}>
          RATIO {RATIO.toFixed(2)} : 1
        </text>
        <text x={120} y={820} fontFamily={MONO} fontSize={13} fill={C.boneDim}>
          SUN {(sunAng / (Math.PI * 2)).toFixed(2)} TURNS
        </text>
        <text x={120} y={842} fontFamily={MONO} fontSize={13} fill={C.boneDim}>
          CARRIER {(carrier / (Math.PI * 2)).toFixed(2)} TURNS
        </text>
        <text x={120} y={864} fontFamily={MONO} fontSize={13} fill={C.orange}>
          REFLECTED INERTIA SCALE N² = 36
        </text>
      </g>
    </svg>
  );
}

function CallLabel({
  x,
  y,
  title,
  body,
  anchor,
  color,
  showLine,
}: {
  x: number;
  y: number;
  title: string;
  body: string;
  anchor: { x: number; y: number };
  color: string;
  showLine: boolean;
}) {
  const onScreen = anchor.x > 360 && anchor.x < 1800 && anchor.y > 140 && anchor.y < 960;
  return (
    <g>
      <text x={x} y={y} fontSize={18} fontWeight={600}>
        {title}
      </text>
      <text x={x} y={y + 22} fontFamily={MONO} fontSize={13} fill={C.boneDim}>
        {body}
      </text>
      {showLine && onScreen ? (
        <line x1={x + 188} y1={y - 6} x2={anchor.x} y2={anchor.y} stroke={color} strokeWidth={1.15} />
      ) : null}
    </g>
  );
}
