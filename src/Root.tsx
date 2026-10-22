import { Composition } from "remotion";
import { LegJointJig } from "./LegJointJig";
import { DURATION, FPS, HEIGHT, WIDTH } from "./shots";

export function RemotionRoot() {
  return (
    <Composition
      id="LegJointJig"
      component={LegJointJig}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
}
