import { MONO, SANS } from "../fonts";
import { SHOTS, STAGES, shotAt, timecode } from "../shots";
import { C } from "../theme";

export function Hud({ frame }: { frame: number }) {
  const shot = shotAt(frame);
  const shotIndex = SHOTS.findIndex((item) => item.id === shot.id);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: SANS,
        color: C.bone,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 22,
          border: `1px solid ${C.boneFaint}`,
        }}
      />
      <div style={{ position: "absolute", top: 36, left: 44, right: 44, display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.16em", color: C.boneDim }}>
            KINETIC GAIN · PLATE {shot.id} / 05 · {shot.kicker}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 4 }}>{shot.title}</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: MONO }}>
          <div style={{ fontSize: 28, fontWeight: 500, color: shot.accent }}>{timecode(frame)}</div>
          <div style={{ fontSize: 13, color: C.boneDim, marginTop: 4 }}>
            F {String(frame).padStart(4, "0")} / 1019 · 30 FPS · DUR 34.00s
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          bottom: 78,
          display: "flex",
          gap: 18,
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: "0.14em",
        }}
      >
        {STAGES.map((stage) => {
          const on = shot.stages.includes(stage);
          const color = stage === "ROTOR" ? C.teal : stage === "FLEXURE" ? C.violet : stage === "LINK" ? C.bone : C.orange;
          return (
            <span key={stage} style={{ color: on ? color : "rgba(197,198,199,0.28)" }}>
              {stage}
            </span>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 44, right: 44, bottom: 38, display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {SHOTS.map((item, index) => {
            const width = ((item.end - item.start) / 1020) * 100;
            const played =
              frame >= item.end ? 1 : frame < item.start ? 0 : (frame - item.start) / (item.end - item.start);
            return (
              <div
                key={item.id}
                style={{
                  width: `${width}%`,
                  height: 6,
                  background: "rgba(197,198,199,0.12)",
                  position: "relative",
                  outline: index === shotIndex ? `1px solid ${item.accent}` : "none",
                }}
              >
                <div style={{ width: `${played * 100}%`, height: "100%", background: item.accent }} />
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.boneDim, width: 520, textAlign: "right" }}>{shot.detail}</div>
      </div>
    </div>
  );
}
