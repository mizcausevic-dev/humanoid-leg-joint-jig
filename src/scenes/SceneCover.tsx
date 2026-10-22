import { interpolate } from "remotion";
import { Callout } from "../components/Callout";
import { MONO } from "../fonts";
import { C } from "../theme";

const RX = 146;
const RY = 96;
const FACE_X = 128;

export function SceneCover({ frame }: { frame: number }) {
  const slide = interpolate(frame, [20, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = slide * slide * (3 - 2 * slide);
  const travel = eased * 320;
  const ang = (32 * Math.PI) / 180;
  const coverX = (FACE_X + travel) * Math.cos(ang);
  const coverY = (FACE_X + travel) * Math.sin(ang);
  const faceX = FACE_X * Math.cos(ang);
  const faceY = FACE_X * Math.sin(ang);
  const showNotes = frame > 58;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cover-ti" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.titaniumHi} />
          <stop offset="45%" stopColor={C.titanium} />
          <stop offset="100%" stopColor={C.titaniumLo} />
        </linearGradient>
        <linearGradient id="cover-housing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A3342" />
          <stop offset="50%" stopColor={C.housing} />
          <stop offset="100%" stopColor="#0C0F14" />
        </linearGradient>
        <pattern id="cover-cf" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
          <rect width="9" height="9" fill="#141820" />
          <rect width="4.5" height="9" fill="#1E2530" />
          <path d="M0 0 L0 9" stroke="#465066" strokeWidth="1.2" />
        </pattern>
        <pattern id="cover-cf2" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
          <path d="M0 0 L0 9" stroke="#6A7588" strokeWidth="0.8" opacity="0.55" />
        </pattern>
        <radialGradient id="cover-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#303848" />
          <stop offset="70%" stopColor="#171A21" />
          <stop offset="100%" stopColor="#0E1218" />
        </radialGradient>
      </defs>

      <g transform="translate(800 570) scale(1.16)">
        <ellipse cx={70} cy={230} rx={240} ry={26} fill="rgba(0,0,0,0.45)" />
        <g transform="rotate(-36)">
          <rect x={-32} y={-360} width={64} height={330} rx={8} fill="url(#cover-ti)" />
          <rect x={-14} y={-310} width={28} height={200} rx={3} fill="#232A34" />
          <circle cx={0} cy={-40} r={18} fill="#1A2028" stroke={C.titaniumHi} strokeWidth={3} />
        </g>
        <g transform="rotate(24)">
          <rect x={-28} y={48} width={56} height={270} rx={8} fill="url(#cover-ti)" />
          <rect x={-12} y={90} width={24} height={160} rx={3} fill="#232A34" />
        </g>

        <g transform="rotate(32)">
          <line
            x1={-48}
            y1={0}
            x2={FACE_X + 420}
            y2={0}
            stroke={C.boneFaint}
            strokeWidth={1.5}
            strokeDasharray="7 7"
          />
          <polygon points={`${FACE_X + 420},0 ${FACE_X + 404},-6 ${FACE_X + 404},6`} fill={C.boneDim} />
          <ellipse cx={0} cy={0} rx={RX} ry={RY} fill="#10141B" />
          <path
            d={`M 0 ${-RY} L ${FACE_X} ${-RY} A ${RX} ${RY} 0 0 1 ${FACE_X} ${RY} L 0 ${RY} A ${RX} ${RY} 0 0 0 0 ${-RY} Z`}
            fill="url(#cover-housing)"
          />
          {[32, 64, 96].map((x) => (
            <line key={x} x1={x} y1={-RY} x2={x} y2={RY} stroke="#0B0D12" strokeWidth={3} opacity={0.55} />
          ))}
          <path d={`M 8 ${-RY + 1} L ${FACE_X - 8} ${-RY + 1}`} stroke={C.titaniumHi} strokeWidth={3} opacity={0.8} />
          <ellipse cx={FACE_X} cy={0} rx={RX} ry={RY} fill="url(#cover-face)" />
          <ellipse cx={FACE_X} cy={0} rx={118} ry={76} fill="none" stroke={C.titanium} strokeWidth={12} />
          <ellipse cx={FACE_X} cy={0} rx={96} ry={62} fill="#12161C" stroke={C.teal} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={FACE_X + Math.cos(a) * 74}
                cy={Math.sin(a) * 48}
                r={5}
                fill={C.teal}
                opacity={0.45 + (i % 3) * 0.18}
              />
            );
          })}
          <ellipse cx={FACE_X} cy={0} rx={22} ry={14} fill={C.titanium} />
          <ellipse cx={FACE_X} cy={0} rx={RX} ry={RY} fill="none" stroke={C.titaniumHi} strokeWidth={3} />

          <g transform={`translate(${FACE_X + travel} 0)`}>
            <ellipse cx={0} cy={0} rx={158} ry={106} fill="url(#cover-cf)" />
            <ellipse cx={0} cy={0} rx={158} ry={106} fill="url(#cover-cf2)" />
            <ellipse cx={0} cy={0} rx={158} ry={106} fill="none" stroke="#8B95A6" strokeWidth={2.5} />
            <ellipse cx={0} cy={0} rx={118} ry={78} fill="none" stroke="#2C3442" strokeWidth={6} />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * 112}
                  cy={Math.sin(a) * 74}
                  r={6}
                  fill="#10141A"
                  stroke="#8B95A6"
                  strokeWidth={1.5}
                />
              );
            })}
            <ellipse cx={0} cy={0} rx={26} ry={16} fill="#10141A" stroke="#8B95A6" strokeWidth={2} />
          </g>

          <g transform={`translate(${FACE_X + 430} -18) rotate(-32)`}>
            <text fill={C.boneDim} fontFamily={MONO} fontSize={13} letterSpacing="0.14em">
              PIVOT AXIS
            </text>
          </g>

          {[
            [36, -70],
            [48, 78],
            [70, -40],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x} ${y} C ${x + 20} ${y + (y > 0 ? 40 : -40)}, ${x + 70} ${y + (y > 0 ? 70 : -80)}, ${x + 110} ${y + (y > 0 ? 110 : -120)}`}
              fill="none"
              stroke={C.teal}
              strokeWidth={2.4}
              opacity={0.85}
            />
          ))}
        </g>

        {showNotes ? (
          <g>
            <Callout
              x1={coverX}
              y1={coverY + 8}
              x2={430}
              y2={210}
              title="CF DUST COVER"
              body="Slides on the pivot axis"
              color={C.bone}
            />
            <Callout
              x1={faceX + 8}
              y1={faceY - 48}
              x2={210}
              y2={-250}
              title="ANODIZED HOUSING"
              body="Carries the frameless stator"
              color={C.bone}
            />
            <Callout
              x1={-150}
              y1={-180}
              x2={-430}
              y2={-250}
              title="Ti LINK"
              body="CNC thigh and shank clevis"
              color={C.titaniumHi}
              align="end"
            />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
