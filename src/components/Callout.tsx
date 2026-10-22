import { MONO, SANS } from "../fonts";
import { C } from "../theme";

type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  title: string;
  body: string;
  color: string;
  align?: "start" | "end";
};

export function Callout({ x1, y1, x2, y2, title, body, color, align = "start" }: Props) {
  const textX = align === "end" ? x2 - 8 : x2 + 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <circle cx={x1} cy={y1} r={3.2} fill={color} />
      <circle cx={x2} cy={y2} r={2} fill={color} />
      <text
        x={textX}
        y={y2 - 8}
        textAnchor={align}
        fill={C.bone}
        fontFamily={SANS}
        fontSize={18}
        fontWeight={600}
      >
        {title}
      </text>
      <text
        x={textX}
        y={y2 + 14}
        textAnchor={align}
        fill={C.boneDim}
        fontFamily={MONO}
        fontSize={13}
      >
        {body}
      </text>
    </g>
  );
}
