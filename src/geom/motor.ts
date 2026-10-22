export const SLOTS = 18;
export const POLES = 20;
export const POLE_PAIRS = POLES / 2;
/** Mechanical turns across the 150-frame motor plate. Slow on purpose. */
export const MECH_TURNS = 0.55;

export function mechAngle(localFrame: number): number {
  const u = Math.min(1, Math.max(0, localFrame / 150));
  return u * MECH_TURNS * Math.PI * 2;
}

export function elecAngle(localFrame: number): number {
  return mechAngle(localFrame) * POLE_PAIRS;
}

export function phaseCurrent(localFrame: number, phase: 0 | 1 | 2): number {
  return Math.sin(elecAngle(localFrame) - (phase * 2 * Math.PI) / 3);
}

/** Nearest of the six phase axes (A/B/C and their returns). */
export function slotAssignment(slot: number): { phase: 0 | 1 | 2; sign: 1 | -1 } {
  let a = ((slot * POLE_PAIRS) / SLOTS) * Math.PI * 2;
  a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const axes = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  let bestP: 0 | 1 | 2 = 0;
  let bestSign: 1 | -1 = 1;
  let bestD = 99;
  for (let p = 0; p < 3; p++) {
    for (const sign of [1, -1] as const) {
      let axis = axes[p] + (sign === -1 ? Math.PI : 0);
      axis = ((axis % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      let d = Math.abs(a - axis);
      d = Math.min(d, Math.PI * 2 - d);
      if (d < bestD) {
        bestD = d;
        bestP = p as 0 | 1 | 2;
        bestSign = sign;
      }
    }
  }
  return { phase: bestP, sign: bestSign };
}

export function slotCurrent(localFrame: number, slot: number): number {
  const assigned = slotAssignment(slot);
  return phaseCurrent(localFrame, assigned.phase) * assigned.sign;
}
