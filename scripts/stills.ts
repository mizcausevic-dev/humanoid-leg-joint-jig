import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const browserExecutable = process.env.CHROME ?? "/usr/local/bin/google-chrome";
const frames = (process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n)));
const list = frames.length ? frames : [0, 80, 145, 180, 260, 400, 640, 800, 930, 1010];

const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
});

const composition = await selectComposition({
  serveUrl,
  id: "LegJointJig",
  browserExecutable,
});

for (const frame of list) {
  const output = path.resolve(`out/f${String(frame).padStart(4, "0")}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    browserExecutable,
    imageFormat: "png",
  });
  console.log(output);
}
