# A 34-second drawing of a humanoid knee, with the ratio left in the picture

This is a film of a mechanism, not a test report. The knee on screen is a quasi-direct-drive stack I drew so the parts stay countable: a frameless outrunner, one planetary stage, and a torque flexure on the output.

Quasi-direct drive, in this drawing, means the motor is almost the joint. The gear ratio is 6:1, not 50:1 or 100:1. Reflected inertia grows with the square of the ratio, so 6:1 multiplies motor inertia by 36. A 100:1 stage multiplies it by 10,000. That is why the limb can be back-driven when the foot hits the ground. The number 36 is on the planetary plate because it is `N²` for this `N`, not because a dyno measured it.

The gear set closes. Sun 18, planet 36, ring 90. With the ring fixed, carrier speed is sun speed times `Ns / (Ns + Nr)`, which is 1/6. Three planets fit because `18 + 90` divides by 3. The check script in the repo fails if that identity drifts. Tooth flanks are trapezoids so they read at 1080p. The pitch circles and the speed ratio are the part that is exact.

The motor plate is an 18-slot, 20-pole outrunner. The rotor is the outside ring. Ten pole pairs turn one mechanical revolution into ten electrical revolutions, which is why the field arrow laps the magnets. Coil marks use the usual dot and cross: toward the viewer, or away. Speed on that plate is 0.55 mechanical turns in five seconds. A real machine at torque would be a blur, so the plate says the speed is reduced.

The flexure plate is the honest one to be careful with. Spoke sag is in pixels and labeled as screen sag. The 1 kHz figure is the sample counter, stepping 1,000 counts per second while the film itself is 30 fps, so the words on the right are every sixth sample of a schematic bridge, not a captured log. The violet trace is a pulse train I defined. It is not a ground-reaction recording.

The last plate pulls back to both legs. Hip, knee, and ankle angles on the charts are the angles used to draw the limbs. After the heel strike, the stance sole is constrained to the ground line. The other foot stays clear. The violet spikes on those charts are the same kind of schematic as the flexure, scaled down at the hip and up at the knee and ankle so the impact reads as one shared event.

If this gets reused, the useful part is the stack, not the knee. Cover, section, reduction, sensor, limb. Swap the link pose and the tooth counts, then make the check script agree with the labels before the ratio goes on screen.

The player is a static site. It does not take an email address. Watching the heel strike is the whole action.
