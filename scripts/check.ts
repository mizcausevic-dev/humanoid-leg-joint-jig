import { shotVisible } from "../src/anim";
import {
  CENTER_DIST,
  meshClearance,
  PLANET_TEETH,
  RATIO,
  RING_TEETH,
  SUN_TEETH,
  gearState,
  spurPath,
} from "../src/geom/gears";
import { layoutLimb, STRIKE_AT } from "../src/geom/limb";
import { POLES, SLOTS, slotAssignment } from "../src/geom/motor";
import { DURATION, SHOTS, shotAt } from "../src/shots";

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

if (SUN_TEETH !== 18 || PLANET_TEETH !== 36 || RING_TEETH !== 90) fail("tooth counts drifted");
if (RATIO !== 6) fail(`ratio ${RATIO}`);
if ((SUN_TEETH + RING_TEETH) % 3 !== 0) fail("planets will not assemble");
if (Math.abs(CENTER_DIST - (280 - 112)) > 1e-6) fail("center distance");

const gaps = meshClearance();
for (const [name, gap] of Object.entries(gaps)) {
  if (gap <= 0.4) fail(`${name} clearance ${gap}`);
}

const path = spurPath(18, 40, 56, 0);
if (!path.startsWith("M ") || !path.endsWith("Z")) fail("spur path not closed");
if ((path.match(/A /g) ?? []).length !== 36) fail("spur arc count");

const state = gearState(30);
if (Math.abs(state.sun / state.carrier - 6) > 1e-9) fail("sun/carrier");
if (Math.abs(state.planet / state.carrier + RING_TEETH / PLANET_TEETH) > 1e-9) fail("planet spin");

let lengths = 0;
for (const shot of SHOTS) {
  lengths += shot.end - shot.start;
  if (shotAt(shot.start).id !== shot.id) fail(`shot start ${shot.id}`);
  if (shot.end < DURATION && shotAt(shot.end).id === shot.id) fail(`shot end inclusive ${shot.id}`);
}
if (lengths !== DURATION) fail(`shot lengths ${lengths}`);
if (!shotVisible(150, 0, 151) || shotVisible(151, 0, 151)) fail("cover window");
if (!shotVisible(1019, 751, 1020)) fail("last frame");

const counts = [0, 0, 0];
for (let slot = 0; slot < SLOTS; slot++) counts[slotAssignment(slot).phase] += 1;
if (counts.some((n) => n < 4)) fail(`phase counts ${counts.join(",")}`);
if (POLES !== 20) fail("poles");

let minSwing = Infinity;
for (let frame = 751; frame < 1020; frame++) {
  const layout = layoutLimb(frame);
  const heelY = layout.hipY + layout.stance.heel.y;
  const toeY = layout.hipY + layout.stance.toe.y;
  const swingLow = layout.hipY + Math.max(layout.swing.heel.y, layout.swing.toe.y);
  minSwing = Math.min(minSwing, GROUND_CLEAR(swingLow));
  if (layout.local < STRIKE_AT) {
    if (heelY > 860 + 0.01) fail(`heel penetration ${frame} ${heelY}`);
    if (toeY > 860 + 0.01) fail(`toe penetration ${frame} ${toeY}`);
  } else {
    const low = Math.max(heelY, toeY);
    if (Math.abs(low - 860) > 0.02) fail(`stance not planted ${frame} ${low}`);
  }
  if (swingLow > 860 - 8) fail(`swing foot low ${frame} ${swingLow.toFixed(1)}`);
}

function GROUND_CLEAR(y: number) {
  return 860 - y;
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ratio: RATIO,
      clearance: gaps,
      phases: counts,
      minSwingClearance: Number(minSwing.toFixed(2)),
      shots: SHOTS.map((s) => [s.id, s.start, s.end]),
    },
    null,
    2,
  ),
);
