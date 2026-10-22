# Knee actuator anatomy jig

34-second Remotion plate of a quasi-direct-drive humanoid knee: frameless outrunner, single-stage 6:1 planetary, integrated torque flexure.

GitHub About: 34-second Remotion anatomy jig of a quasi-direct-drive humanoid knee: frameless outrunner, 6:1 planetary, and torque flexure.

Topics: `remotion` `motion-design` `robotics` `humanoid` `actuator` `planetary-gear` `github-pages` `svg-animation` `quasi-direct-drive` `mechanical-design`

## Run

```bash
npm install
npm run check
npm run dev
```

`npm run build` writes the Pages site to `dist/`. `npm run studio` opens the Remotion studio. `npm run still -- out/frame.png --frame=400` renders one frame.

## Plates

| Frames | Time | Plate |
| --- | --- | --- |
| 0–150 | 0.00–5.00s | Carbon-fiber cover slides on the knee pivot |
| 151–300 | 5.03–10.00s | 20-pole outrunner, 18-slot 3-phase stator |
| 301–510 | 10.03–17.00s | 18/36/90 planetary, three needle planets, ratio 6 |
| 511–750 | 17.03–25.00s | Spoke flexure, gauges, schematic 1 kHz stream |
| 751–1019 | 25.03–33.97s | Both legs, heel strike, illustrated compliance |

There is no frame 1020. `durationInFrames` 1020 at 30 fps is 34.00s, and the last index is 1019.

## What is exact, and what is drawn large

Exact for this drawing: tooth counts, the 6:1 identity `(Ns+Nr)/Ns`, three-planet assembly, 18 slots and 20 poles, and the stance foot contact after heel strike. `npm run check` asserts those.

Drawn for legibility: rotor speed (0.55 mechanical turns in the motor plate), spoke deflection in screen pixels, trapezoidal tooth flanks, and the violet torque traces. Those traces are labeled schematic. They are not a load-cell recording.

## Pages

The workflow `.github/workflows/pages.yml` runs `npm run check`, builds with Vite, and deploys `dist/` with GitHub Pages. Asset paths are relative, so the same `dist/` works at a project-pages subpath.

Pages source has to be **GitHub Actions**, not the branch default:

```bash
gh repo create mizcausevic-dev/humanoid-leg-joint-jig --public --source=. --remote=origin
git push -u origin main
gh api -X POST repos/mizcausevic-dev/humanoid-leg-joint-jig/pages -f build_type=workflow
gh repo edit mizcausevic-dev/humanoid-leg-joint-jig \
  --description "34-second Remotion anatomy jig of a quasi-direct-drive humanoid knee: frameless outrunner, 6:1 planetary, and torque flexure."
gh repo edit mizcausevic-dev/humanoid-leg-joint-jig \
  --add-topic remotion --add-topic motion-design --add-topic robotics \
  --add-topic humanoid --add-topic actuator --add-topic planetary-gear \
  --add-topic github-pages --add-topic svg-animation \
  --add-topic quasi-direct-drive --add-topic mechanical-design
```

Intended URL: `https://mizcausevic-dev.github.io/humanoid-leg-joint-jig/`

## Notes

Toolchain files keep the names Vite, Remotion, and GitHub Pages require (`index.html`, `package.json`). The shot sheet is `brief-Cursor.html`.

No form. A form would need a purpose, a notice, and a retention owner, and this piece does not collect anything.

Remotion has its own license: https://www.remotion.dev/docs/license

Copyright Kinetic Gain LLC. Dependency licenses stay with those packages.
