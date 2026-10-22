/** One-sided schematic hump. Not a recorded sensor. */
export function schematicPulse(tSec: number, hits: readonly number[]): number {
  let y = 0;
  for (const hit of hits) {
    const dt = tSec - hit;
    if (dt < 0 || dt > 1.4) continue;
    const hump = Math.sin(Math.min(dt * 6.2, Math.PI));
    y += Math.exp(-dt * 2.1) * hump;
  }
  return y;
}

export const FLEXURE_HITS = [0.42, 1.5, 2.7, 4.0, 5.4, 6.85] as const;

export function flexureTorque(localFrame: number): number {
  return schematicPulse(Math.max(0, localFrame) / 30, FLEXURE_HITS);
}

export function bridgeWord(sample: number): string {
  const t = sample / 1000;
  const v = schematicPulse(t % 8, FLEXURE_HITS);
  const q = Math.round((v + 1) * 4000);
  return (q & 0xffff).toString(16).padStart(4, "0");
}
