# TODO

## Open

- Social preview image: upload a scene screenshot in GitHub repo settings.
- Visibility toggles in magnetar, neutron-star, white-hole, and wormhole now rebuild geometry instead of only flipping `visible`; split rebuild and visibility effects if it shows up in profiling.
- Shader uniforms are cast once at construction (`material.uniforms as XUniforms`); cast-free would mean factories returning `{ mesh, uniforms }`.
- Large shared chunk: three.js is ~540 kB in the `setup` chunk (build warning).
- Tidal disruption: debris is non-self-gravitating test particles on frozen-in star velocity; no spiral shocks, and circularization is a radial-velocity drag only, so the disk is not forced into a plane.
- Tidal disruption: fallback peak `t_min` is an analytic estimate (energy spread `GM·R★/r²`), not measured from the debris. DISK starts at `2·t_min`, when ~37% of bound debris has returned.
- Tidal disruption: partial-disruption rule `|offset·r̂| > R★(1/β − 1)` is ad hoc; for β near 1 most of the star is released. Escaped debris is never removed.
- Tidal disruption: no flare luminosity or light curve; debris color uses a heuristic temperature, not viscous heating. Visual horizon is clamped to a minimum size below ~2×10⁶ M☉.
- Tidal disruption: `t_min` is ~20 s for β ≥ 1 and ~90 s for β = 0.6 at the fixed time scale; there is no time-scale control or scrubber.
- Ergosphere: test particles keep a fixed θ and only move in r and φ; no geodesic integration, so orbits are not exact Kerr geodesics.
- Ergosphere: particle own velocity is a fixed fraction of the Keplerian value at the current r; it is clamped to [Ω₋, Ω₊] each frame, not integrated.
- Ergosphere: Penrose split energies are not conserved; extracted energy is η_max per event in units of the particle energy, not computed from fragment four-momenta. Escape fragments fade out instead of respawning.
- Ergosphere: spin changes reshape the surfaces but do not reset particles; a replay is needed to clear the extracted-energy count.
- Ergosphere: spin is capped at 0.998, so the extremal case is not shown; no spin-down is applied as energy is extracted.
- Ergosphere: the ergosphere is a single translucent surface with no meridian lines; the particle color only encodes the sign of Ω, not its magnitude.
- Kilonova: the Peters decay has `a ∝ (1 − t/τ)^(1/4)`, so the last frame before contact still jumps a ≈ 2.3 → 0.8 scene units. During the merger the bodies orbit at the fixed contact rate.
- Kilonova: `τ` is a fixed constant, not a function of mass or initial separation. Real coalescence time scales with M⁻³ and a₀⁴. The orbital ω uses a normalised GM = 240·M, so the visual orbit is not at real frequency; only the HUD f_GW is in real units.
- Kilonova: remnant thresholds (2.4 and 2.9 M☉) and the 1 s hypermassive collapse delay are fixed. They do not depend on the equation of state, and the remnant is not mass-loss corrected.
- Kilonova: the bolometric lightcurve is a fixed `(t/1 d)²` rise then `t^(-1.3)` decline, and the dominant component flips at a fixed 2.5 d. Cloud brightness uses separate band shapes (blue optical peak 1 d, red near-infrared peak 7 d). Ejecta mass only scales brightness; it does not change the decline or the color shift. Blue-to-red color is linear in time.
- Kilonova: ejecta radius uses √day compression for the display, so the time axis is not physical. There is no opacity or temperature model for lanthanides, and no accretion disk after collapse.
- Kilonova: the GRB jet is a fixed-length cone with no beaming, Lorentz factor or afterglow. The glow shader takes the view-space z axis as the view direction, which is approximate for off-center bodies.

## Next scenes

Each follows the existing feature layout (`src/features/<scene>/`, registered in `src/utils/scene/index.ts`). Ordered by priority.

### Later

- **X-ray Binary**: Roche-lobe overflow stream onto a compact object; reuses neutron-star disk.
- **Alcubierre Warp**: compressed/expanded spacetime shell around a ship with lensing; reuses lensing-field render passes.
- **Time Dilation**: clocks at different radii in a gravity well with gravitational redshift; mostly HUD and physics utils.
