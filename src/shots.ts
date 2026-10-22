export const FPS = 30;
export const DURATION = 1020;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const STAGES = ["ROTOR", "SUN", "PLANETS", "CARRIER", "FLEXURE", "LINK"] as const;
export type Stage = (typeof STAGES)[number];

export type Shot = {
  id: string;
  title: string;
  kicker: string;
  detail: string;
  start: number;
  end: number;
  accent: string;
  stages: readonly Stage[];
};

/** Half-open frame windows. Frame 150 is 5.00s and still the cover plate.
 *  Frame 151 is the first motor frame. There is no frame 1020;
 *  duration 1020 is exactly 34.00s, last index 1019 (33.97s).
 */
export const SHOTS: readonly Shot[] = [
  {
    id: "01",
    title: "COVER RELEASE",
    kicker: "LATERAL 45°",
    detail: "Carbon-fiber dust cover slides off along the knee pivot.",
    start: 0,
    end: 151,
    accent: "#C5C6C7",
    stages: [],
  },
  {
    id: "02",
    title: "FRAMELESS OUTRUNNER",
    kicker: "AXIAL SECTION",
    detail: "High-pole rotor outside a concentrated 3-phase stator.",
    start: 151,
    end: 301,
    accent: "#00F5D4",
    stages: ["ROTOR"],
  },
  {
    id: "03",
    title: "6:1 PLANETARY",
    kicker: "SINGLE STAGE",
    detail: "Sun drives three planets on needle bearings. Ring is fixed.",
    start: 301,
    end: 511,
    accent: "#FF6B35",
    stages: ["SUN", "PLANETS", "CARRIER"],
  },
  {
    id: "04",
    title: "TORQUE FLEXURE",
    kicker: "OUTPUT SECTION",
    detail: "Spoke windup, bonded gauges, schematic 1 kHz bridge stream.",
    start: 511,
    end: 751,
    accent: "#7928CA",
    stages: ["FLEXURE"],
  },
  {
    id: "05",
    title: "HEEL STRIKE",
    kicker: "BIPEDAL LIMB",
    detail: "Hip, knee, and ankle share one illustrated impact.",
    start: 751,
    end: 1020,
    accent: "#C5C6C7",
    stages: ["ROTOR", "SUN", "PLANETS", "CARRIER", "FLEXURE", "LINK"],
  },
];

export function shotAt(frame: number): Shot {
  return SHOTS.find((shot) => frame >= shot.start && frame < shot.end) ?? SHOTS[SHOTS.length - 1];
}

export function timecode(frame: number): string {
  const sec = frame / FPS;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const hundredths = Math.floor((sec - Math.floor(sec)) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}
