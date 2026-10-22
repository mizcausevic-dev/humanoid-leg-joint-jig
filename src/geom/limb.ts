import { schematicPulse } from "./signals";

export const THIGH_LEN = 252;
export const SHANK_LEN = 238;
export const GROUND_Y = 860;
export const HIP_X = 690;
export const SWING_HIP_DX = -176;
export const STRIKE_AT = 86;
export const PULL_FRAMES = 124;
export const HEEL = { x: -12, y: 40 };
export const TOE = { x: 140, y: 40 };
export const FOOT_D = "M -30 14 L 152 10 L 164 24 L 140 40 L -12 40 L -34 24 Z";

export type Pose = {
  hip: number;
  knee: number;
  ankle: number;
  swingHip: number;
  swingKnee: number;
  swingAnkle: number;
  torque: number;
};

export function limbPose(frame: number): Pose {
  const local = Math.max(0, Math.min(268, frame - 751));
  const pre = Math.min(1, local / STRIKE_AT);
  const dt = Math.max(0, local - STRIKE_AT);
  const env = Math.exp(-dt / 26);
  const settle = dt === 0 ? 0 : Math.exp(-dt / 34) * Math.sin(dt / 6.2);

  const hip = 18 + pre * 6 + settle * 1.2;
  const knee = 14 + pre * 2 + env * Math.sin(Math.min(dt * 6.2, Math.PI)) * 16;
  const flat = hip - knee;
  const spike = dt > 0 ? Math.sin(Math.min(dt * 7, Math.PI)) * Math.exp(-dt / 12) * 11 : 0;
  const ankle = -14 * (1 - pre) + flat * pre + spike;

  const swingHip = -8 + Math.sin(local / 42) * 2;
  const swingKnee = 68 + Math.sin(local / 38) * 3;
  const swingAnkle = -4;
  const torque = dt > 0 ? schematicPulse(dt / 30, [0]) : pre * 0.05;

  return { hip, knee, ankle, swingHip, swingKnee, swingAnkle, torque };
}

export function rotPoint(x: number, y: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c - y * s, y: x * s + y * c };
}

/** Matches the nested SVG rotates in SceneLimb. Positive SVG angles are clockwise. */
export function legPoints(hipFlex: number, kneeFlex: number, anklePlant: number) {
  const hipRot = -hipFlex;
  const knee = rotPoint(0, THIGH_LEN, hipRot);
  const shankRot = hipRot + kneeFlex;
  const ankleOff = rotPoint(0, SHANK_LEN, shankRot);
  const ankle = { x: knee.x + ankleOff.x, y: knee.y + ankleOff.y };
  const footRot = shankRot + anklePlant;
  const heelOff = rotPoint(HEEL.x, HEEL.y, footRot);
  const toeOff = rotPoint(TOE.x, TOE.y, footRot);
  return {
    knee,
    ankle,
    heel: { x: ankle.x + heelOff.x, y: ankle.y + heelOff.y },
    toe: { x: ankle.x + toeOff.x, y: ankle.y + toeOff.y },
  };
}

export function layoutLimb(frame: number) {
  const pose = limbPose(frame);
  const local = Math.max(0, Math.min(268, frame - 751));
  const stance = legPoints(pose.hip, pose.knee, pose.ankle);
  const swing = legPoints(pose.swingHip, pose.swingKnee, pose.swingAnkle);
  const clearance = local < STRIKE_AT ? (1 - local / STRIKE_AT) * 70 : 0;
  const contact = local < STRIKE_AT ? stance.heel.y : Math.max(stance.heel.y, stance.toe.y);
  const hipY = GROUND_Y - contact - clearance;
  return { pose, stance, swing, hipX: HIP_X, hipY, local, clearance };
}

export function limbSeries() {
  const hip: number[] = [];
  const knee: number[] = [];
  const ankle: number[] = [];
  const torque: number[] = [];
  for (let frame = 751; frame < 1020; frame++) {
    const pose = limbPose(frame);
    hip.push(pose.hip);
    knee.push(pose.knee);
    ankle.push(pose.ankle);
    torque.push(pose.torque);
  }
  return { hip, knee, ankle, torque };
}

export const LIMB_SERIES = limbSeries();
