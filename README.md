# Aphelion

![Build](https://img.shields.io/github/actions/workflow/status/alpercitak/aphelion/build.yaml?logo=github&label=Build)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-4ade80?style=flat-square)

Interactive deep-space physics renderer. Ten scenes exploring the most extreme objects in the universe: black holes, gravitational waves, quantum evaporation, cosmic strings. Built with Three.js and React.
 
Each scene is a self-contained physics simulation with real equations driving the visuals. The Hawking temperature formula determines glow color as a black hole evaporates. Keplerian orbital mechanics govern the binary merger inspiral. The conical spacetime deflection angle for a cosmic string is computed from Gµ. Nothing is purely decorative.
 
---
 
## Scenes
 
| # | Scene | What it shows |
|---|-------|---------------|
| 01 | **Black Hole** | Schwarzschild / Kerr metric. Accretion disk with blackbody temperature coloring, relativistic jets, gravitational lensing, Doppler shift mode |
| 02 | **Binary Merger** | Two black holes in decaying orbit. Spacetime grid deformed by gravitational wave equation. Three-phase state machine: inspiral → merger → ringdown |
| 03 | **Neutron Star** | Rotating pulsar with dipole magnetic field lines, lighthouse beam sweep, beam flash detection via dot product alignment |
| 04 | **Magnetar** | Chaotic multipole field topology, writhing field lines, starquake crack propagation, gamma ray burst flash |
| 05 | **Wormhole** | Two-pass render. Einstein-Rosen bridge with a live portal to a second scene via `WebGLRenderTarget`. Exotic matter halo, geometry-based lensing approximation |
| 06 | **White Hole** | Time-reversal of a black hole. Spherical particle ejecta with blackbody temperature coloring, photon sphere on the outward face |
| 07 | **Hawking Evaporation** | Micro black hole shrinking in real time. `T = ℏc³/8πGMk` drives glow color and pair spawn rate. Virtual particle pairs at the horizon |
| 08 | **Lensing Field** | No visible object. Full-screen UV displacement shader sampling a `WebGLRenderTarget`. Mouse-interactive invisible mass, Einstein rings, dark matter mode |
| 09 | **Cosmic String** | Three-pass render. `CatmullRomCurve3` oscillating filament, conical spacetime lensing shader, intercommutation loop events |
| 10 | **Supernova** | Five-phase scrubable timeline: progenitor → collapse → shock breakout → ejecta expansion → remnant. Neutrino burst, element-composition particle colors, mass-dependent remnant type |
 
---
 
## Stack
 
- **React 18** + **Vite**: component architecture, lazy-loaded scenes
- **Three.js**: WebGL renderer, custom `ShaderMaterial` throughout
- **TypeScript**: strict throughout, typed uniform refs, typed scene state
- **React Router**: scene routing, `lazy()` per scene for code splitting
- **CSS Modules**: scoped styles, CSS variables for the HUD design system
No UI component library. No state management library. No post-processing library, bloom and lensing effects are hand-written GLSL.

---
 
## Running locally
 
```bash
git clone https://github.com/alpercitak/aphelion
cd aphelion
bun install
bun run dev
```
 
Requires Node 18+. No environment variables needed.
 
```bash
bun run build    # production build
bun run preview  # preview production build locally
```

---

## Physics notes
 
The simulations are visually driven by real equations but are not numerically accurate, timescales are compressed, scales are adjusted for visibility, and several effects (gravitational lensing, Hawking radiation) are approximated rather than ray-traced. The goal is physical intuition, not simulation fidelity.
 
Notable real equations in use:
 
- Schwarzschild radius: `rₛ = 2GM/c²`
- Hawking temperature: `T = ℏc³ / (8πGMk)`
- Gravitational wave inspiral: `ω ∝ √M / r^1.5` (Keplerian)
- Gravitational lensing deflection: `δφ = 4GM / c²b`
- Cosmic string deflection: `δ = 8π²Gµ`
- Blackbody temperature → color: Wien's displacement law approximation
- Chirp mass: `ℳ = (m₁m₂)^(3/5) / (m₁+m₂)^(1/5)`
---
 
## License
 
MIT
