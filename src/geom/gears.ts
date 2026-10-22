/** Illustrated 6:1 single-stage set.
 *  Ns=18, Np=36, Nr=90. (Ns+Nr)/Ns = 6, and (Ns+Nr) is divisible by 3 planets.
 *  Addendum and dedendum are drawing factors, not a cut-tool spec.
 */
export const SUN_TEETH = 18;
export const PLANET_TEETH = 36;
export const RING_TEETH = 90;
export const PLANET_COUNT = 3;
export const RING_PITCH = 280;
export const MODULE = (2 * RING_PITCH) / RING_TEETH;
export const SUN_PITCH = (MODULE * SUN_TEETH) / 2;
export const PLANET_PITCH = (MODULE * PLANET_TEETH) / 2;
export const CENTER_DIST = SUN_PITCH + PLANET_PITCH;
export const ADDENDUM = 0.82;
export const DEDENDUM = 1.2;
export const RATIO = (SUN_TEETH + RING_TEETH) / SUN_TEETH;

const fmt = (n: number) => n.toFixed(2);

export function externalRadii(pitch: number) {
  return {
    pitch,
    root: pitch - DEDENDUM * MODULE,
    tip: pitch + ADDENDUM * MODULE,
  };
}

export function internalRadii() {
  return {
    pitch: RING_PITCH,
    tip: RING_PITCH - ADDENDUM * MODULE,
    root: RING_PITCH + DEDENDUM * MODULE,
  };
}

export function meshClearance() {
  const sun = externalRadii(SUN_PITCH);
  const planet = externalRadii(PLANET_PITCH);
  const ring = internalRadii();
  const external = CENTER_DIST - sun.tip - planet.root;
  const ringVsPlanetTip = ring.root - (CENTER_DIST + planet.tip);
  const ringToothVsPlanetRoot = ring.tip - (CENTER_DIST + planet.root);
  return { external, ringVsPlanetTip, ringToothVsPlanetRoot };
}

/** Closed spur outline around the origin. tipR < rootR draws an internal hole. */
export function spurPath(teeth: number, rootR: number, tipR: number, rotation: number): string {
  const pitch = (Math.PI * 2) / teeth;
  const cmds: string[] = [];
  const p = (r: number, a: number) => {
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    return `${fmt(x)} ${fmt(y)}`;
  };
  const arc = (r: number, a: number) =>
    `A ${fmt(Math.abs(r))} ${fmt(Math.abs(r))} 0 0 1 ${p(r, a)}`;

  for (let i = 0; i < teeth; i++) {
    const mid = rotation + i * pitch;
    const rootL = mid - pitch * 0.3;
    const tipL = mid - pitch * 0.1;
    const tipRight = mid + pitch * 0.1;
    const rootRight = mid + pitch * 0.3;
    const nextRootL = mid + pitch - pitch * 0.3;
    cmds.push(i === 0 ? `M ${p(rootR, rootL)}` : `L ${p(rootR, rootL)}`);
    cmds.push(`L ${p(tipR, tipL)}`);
    cmds.push(arc(tipR, tipRight));
    cmds.push(`L ${p(rootR, rootRight)}`);
    cmds.push(arc(rootR, nextRootL));
  }
  cmds.push("Z");
  return cmds.join(" ");
}

export function circlePath(r: number): string {
  return `M ${fmt(r)} 0 A ${fmt(r)} ${fmt(r)} 0 1 1 ${fmt(-r)} 0 A ${fmt(r)} ${fmt(r)} 0 1 1 ${fmt(r)} 0 Z`;
}

/** Carrier is the slow output. Sun is 6×. Planet spin is the fixed-frame angle. */
export function gearState(localFrame: number) {
  const turns = (Math.max(0, localFrame) / 210) * 0.62;
  const carrier = turns * Math.PI * 2;
  const sun = carrier * RATIO;
  const planet = -carrier * (RING_TEETH / PLANET_TEETH);
  return { carrier, sun, planet };
}

export function planetOrbit(localFrame: number, index: number): number {
  return -Math.PI / 2 + (index * 2 * Math.PI) / PLANET_COUNT + gearState(localFrame).carrier;
}

export function sunRotation(localFrame: number): number {
  return -Math.PI / 2 + gearState(localFrame).sun;
}

export function planetSpin(localFrame: number, index: number): number {
  const a0 = -Math.PI / 2 + (index * 2 * Math.PI) / PLANET_COUNT;
  const halfTooth = Math.PI / PLANET_TEETH;
  return a0 + Math.PI - halfTooth + gearState(localFrame).planet;
}

export const RING_ROTATION = -Math.PI / 2;
