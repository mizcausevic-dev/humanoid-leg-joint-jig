import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, type PlayerRef } from "@remotion/player";
import { LegJointJig } from "./LegJointJig";
import "./fonts";
import "./preview.css";
import { DURATION, FPS, HEIGHT, SHOTS, WIDTH, shotAt, timecode } from "./shots";

function Theater() {
  const ref = useRef<PlayerRef>(null);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const queryFrame = Number(params.get("frame"));
  const initialFrame = Number.isFinite(queryFrame) ? Math.max(0, Math.min(DURATION - 1, queryFrame)) : 0;
  const holdStill = params.has("frame") || reduced;
  const [frame, setFrame] = useState(initialFrame);
  const shot = shotAt(frame);

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const onFrame = (event: { detail: { frame: number } }) => setFrame(event.detail.frame);
    player.addEventListener("frameupdate", onFrame);
    return () => player.removeEventListener("frameupdate", onFrame);
  }, []);

  return (
    <div className="theater">
      <header className="top">
        <div>
          <p className="kicker">Kinetic Gain · Anatomy jig</p>
          <h1>High-torque-density humanoid knee</h1>
        </div>
        <p className="deck">
          Frameless outrunner, single-stage 6:1 planetary, integrated torque flexure. 34.00s · 1,020 frames · 30 fps.
        </p>
      </header>

      <div className="screen">
        <Player
          ref={ref}
          component={LegJointJig}
          durationInFrames={DURATION}
          fps={FPS}
          compositionWidth={WIDTH}
          compositionHeight={HEIGHT}
          style={{ width: "100%" }}
          controls
          loop={!holdStill}
          autoPlay={!holdStill}
          initialFrame={initialFrame}
          clickToPlay
          doubleClickToFullscreen
          spaceKeyToPlayOrPause
          acknowledgeRemotionLicense
        />
      </div>

      <div className="transport">
        <div className="now">
          <span className="id">{shot.id}</span>
          <span>
            <strong>{shot.title}</strong>
            <em>{shot.detail}</em>
          </span>
        </div>
        <div className="tc">{timecode(frame)}</div>
      </div>

      <ol className="shots">
        {SHOTS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={item.id === shot.id ? "on" : ""}
              style={{ borderColor: item.id === shot.id ? item.accent : undefined }}
              onClick={() => ref.current?.seekTo(item.start)}
            >
              <span>{item.id}</span>
              <strong>{item.title}</strong>
              <small>
                {item.kicker} · {(item.start / FPS).toFixed(1)}s
              </small>
            </button>
          </li>
        ))}
      </ol>

      <p className="fine">
        Rotor speed and spoke sag are slowed or enlarged so the mechanism stays readable. Violet torque traces are schematic, not a recorded test.
        Tooth counts 18 / 36 / 90 are the illustrated set: they close a 6:1 stage with three planets.
      </p>
      <p className="fine">
        <a href="./brief-Cursor.html">Shot sheet</a>
      </p>
    </div>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<Theater />);
