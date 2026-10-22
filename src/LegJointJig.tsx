import { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from "remotion";
import { Hud } from "./components/Hud";
import { shotVisible } from "./anim";
import "./fonts";
import { SceneCover } from "./scenes/SceneCover";
import { SceneLimb } from "./scenes/SceneLimb";
import { SceneMotor } from "./scenes/SceneMotor";
import { ScenePlanetary } from "./scenes/ScenePlanetary";
import { SceneTorque } from "./scenes/SceneTorque";
import { C } from "./theme";

export function LegJointJig() {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      continueRender(handle);
    };
    document.fonts.ready.then(finish).catch(finish);
    const timer = window.setTimeout(finish, 2500);
    return () => {
      settled = true;
      window.clearTimeout(timer);
    };
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: '"Space Grotesk", sans-serif' }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="plate-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(197,198,199,0.045)" strokeWidth="1" />
          </pattern>
          <radialGradient id="plate-vig" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#plate-grid)" />
        <rect width={1920} height={1080} fill="url(#plate-vig)" />
      </svg>
      {shotVisible(frame, 0, 151) ? <SceneCover frame={frame} /> : null}
      {shotVisible(frame, 151, 301) ? <SceneMotor frame={frame} /> : null}
      {shotVisible(frame, 301, 511) ? <ScenePlanetary frame={frame} /> : null}
      {shotVisible(frame, 511, 751) ? <SceneTorque frame={frame} /> : null}
      {shotVisible(frame, 751, 1020) ? <SceneLimb frame={frame} /> : null}
      <Hud frame={frame} />
    </AbsoluteFill>
  );
}
