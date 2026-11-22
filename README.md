# Aphelion

![React](https://img.shields.io/badge/React-000000?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![Build](https://img.shields.io/github/actions/workflow/status/alpercitak/aphelion/build.yaml?style=flat-square&label=&color=2ea44f)
![License](https://img.shields.io/badge/MIT-2ea44f?style=flat-square)

Interactive deep-space physics renderer. Sixteen scenes exploring the most extreme objects in the universe: black holes, gravitational waves, quantum evaporation, cosmic strings. Built with Three.js and React.

**Live demo: [aphelion-app.pages.dev](https://aphelion-app.pages.dev/)**

Each scene is a self-contained physics simulation with real equations driving the visuals. The Hawking temperature formula determines glow color as a black hole evaporates. Keplerian orbital mechanics govern the binary merger inspiral. The conical spacetime deflection angle for a cosmic string is computed from Gµ. Nothing is purely decorative.

---

## Scenes

| #   | Scene                   | What it shows                                                                                                                                                                                         |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | **Black Hole**          | Schwarzschild metric, with Kerr spin approximated as horizon oblateness. Accretion disk with blackbody temperature coloring, relativistic jets, gravitational lensing, Doppler shift mode             |
| 02  | **Binary Merger**       | Two black holes in decaying orbit. Spacetime grid deformed by gravitational wave equation. Three-phase state machine: inspiral → merger → ringdown                                                    |
| 03  | **Neutron Star**        | Rotating pulsar with dipole magnetic field lines, lighthouse beam sweep, beam flash detection via dot product alignment                                                                               |
| 04  | **Magnetar**            | Chaotic multipole field topology, writhing field lines, starquake crack propagation, gamma ray burst flash                                                                                            |
| 05  | **Wormhole**            | Two-pass render. Einstein-Rosen bridge with a live portal to a second scene via `WebGLRenderTarget`. Exotic matter halo, geometry-based lensing approximation                                         |
| 06  | **White Hole**          | Time-reversal of a black hole. Spherical particle ejecta with blackbody temperature coloring, photon sphere on the outward face                                                                       |
| 07  | **Hawking Evaporation** | Micro black hole shrinking in real time. `T = ℏc³/8πGMk` drives glow color and pair spawn rate. Virtual particle pairs at the horizon                                                                 |
| 08  | **Lensing Field**       | No visible object. Full-screen UV displacement shader sampling a `WebGLRenderTarget`. Mouse-interactive invisible mass, Einstein rings, dark matter mode                                              |
| 09  | **Cosmic String**       | Three-pass render. `CatmullRomCurve3` oscillating filament, conical spacetime lensing shader, intercommutation loop events                                                                            |
| 10  | **Supernova**           | Five-phase scrubbable timeline: progenitor → collapse → shock breakout → ejecta expansion → remnant. Neutrino burst, element-composition particle colors, mass-dependent remnant type                 |
| 11  | **Tidal Disruption**    | A star torn apart by a black hole. Parabolic orbit, free-particle debris stream, `t^(-5/3)` fallback and circularization into a disk. Penetration factor β sets full or partial disruption            |
| 12  | **Ergosphere**          | Kerr black hole with spin. Ergosphere, frame dragging with no standing still inside it, Penrose process energy extraction, irreducible mass limit                                                     |
| 13  | **Kilonova**            | Two neutron stars merge. Inspiral with Peters decay and GW rings, a merger with a remnant set by total mass, then blue and red r-process ejecta over 21 days. Optional GRB jet                        |
| 14  | **X-ray Binary**        | A donor star fills its Roche lobe and spills gas through L1. The stream is Coriolis-deflected onto an accretion disk around a neutron star or black hole. Eddington ratio and `kT_in` in the HUD      |
| 15  | **Alcubierre Warp**     | A ship at rest in a warp bubble. York-time grid with contraction ahead and expansion behind, a negative-energy ring at the waist, streaming stars lensed at the bubble wall                           |
| 16  | **Time Dilation**       | Clocks hover around a black hole on Flamm's paraboloid. Deeper clocks tick slower, their light arrives redshifted, and pulses sent once per proper second arrive spread out. Optional orbiting clocks |

## Controls

- **Drag** to orbit the camera, **scroll** to zoom. Touch drag works on mobile.
- Each scene has a control panel (sliders, toggles, mode switches) and live stats.
- The glossary panel explains every term and formula shown in the scene.

---

## Stack

- **React 19** + **Vite**: component architecture, lazy-loaded scenes
- **Three.js**: WebGL renderer, custom `ShaderMaterial` throughout
- **TypeScript**: strict throughout, typed uniform refs, typed scene state
- **React Router**: scene routing, `lazy()` per scene for code splitting
- **CSS Modules**: scoped styles, CSS variables for the HUD design system

No UI component library. No state management library. No post-processing library: bloom and lensing effects are hand-written GLSL.

### Project layout

```
src/
  features/<scene>/   one folder per scene
    hooks/            init (build scene), update (react to params), animate (per frame), controls, hud
    utils/            mesh, material, and shader factories
    constants/        default params and tuning values
  components/app/     HUD, scene layout, glossary
  components/ui/      buttons, sliders, toggles
  utils/              renderer setup, orbit camera, physics formulas, scene registry
```

---

## Running locally

```bash
git clone https://github.com/alpercitak/aphelion
cd aphelion
bun install
bun run dev
```

Requires [Bun](https://bun.sh). No environment variables needed.

```bash
bun run build    # type-check and production build
bun run preview  # preview production build locally
bun run check    # lint and format check (Biome)
```

---

## Physics notes

The simulations are visually driven by real equations but are not numerically accurate: timescales are compressed, scales are adjusted for visibility, and several effects (gravitational lensing, Hawking radiation) are approximated rather than ray-traced. The goal is physical intuition, not simulation fidelity.

Notable real equations in use:

- Schwarzschild radius: `rₛ = 2GM/c²`
- Hawking temperature: `T = ℏc³ / (8πGMk)`
- Gravitational wave inspiral: `ω ∝ √M / r^1.5` (Keplerian)
- Gravitational lensing deflection: `δφ = 4GM / c²b`
- Cosmic string deficit angle: `Δ = 8πGµ`, light deflection per side: `δ = 4πGµ`
- Blackbody temperature → color: Wien's displacement law approximation
- Chirp mass: `ℳ = (m₁m₂)^(3/5) / (m₁+m₂)^(1/5)`
- Tidal radius: `r_t = R★ (M/m★)^(1/3)`
- Fallback rate: `Ṁ ∝ t^(-5/3)`
- r-process heating (kilonova): `L ∝ t^(-1.3)`
- Ergosphere radius: `r_E = M + √(M² − a² cos²θ)`
- Penrose efficiency limit: `η_max = ½(√(2M/r₊) − 1)`
- Roche lobe (Eggleton): `r_L/a = 0.49q^(2/3) / (0.6q^(2/3) + ln(1 + q^(1/3)))`
- Alcubierre shape function: `f(r) = [tanh σ(r+R) − tanh σ(r−R)] / (2 tanh σR)`, York time `θ = v_s (x/r) df/dr`
- Warp-bubble negative energy (Pfenning & Ford): `E ≈ −(1/12) v_s² R²/Δ`
- Gravitational time dilation: `dτ/dt = √(1 − Rₛ/r)` (static), `√(1 − 3Rₛ/2r)` (circular orbit); redshift `1 + z = dt/dτ`
- Accretion luminosity: `L = GMṀ/R`, Eddington `L_Edd ≈ 1.26×10³⁸ (M/M☉) erg/s`

---

## License

MIT
