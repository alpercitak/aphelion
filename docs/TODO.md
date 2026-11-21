# TODO

## Open

- Social preview image: upload a scene screenshot in GitHub repo settings.
- Visibility toggles in magnetar, neutron-star, white-hole, and wormhole now rebuild geometry instead of only flipping `visible`; split rebuild and visibility effects if it shows up in profiling.
- Shader uniforms are cast once at construction (`material.uniforms as XUniforms`); cast-free would mean factories returning `{ mesh, uniforms }`.
- Large shared chunk: three.js is ~540 kB in the `setup` chunk (build warning).

## Next scenes

Each follows the existing feature layout (`src/features/<scene>/`, registered in `src/utils/scene/index.ts`). Ordered by priority.

### 11 · Tidal Disruption

A star passes inside a black hole's tidal radius and is torn into a debris stream; roughly half the debris falls back and circularizes into a transient disk.

- Physics: tidal radius `r_t ≈ R★ (M_BH / m★)^(1/3)`; fallback rate `Ṁ ∝ t^(-5/3)`; star survives (partial disruption) when periapsis > r_t.
- Visuals: star as particle cloud on a parabolic orbit, stretched along the orbit after periapsis; bound half falls back, unbound half escapes; disk brightens as debris returns.
- Controls: BH mass, star mass, periapsis (in units of r_t), replay button.
- HUD: r_t, periapsis / r_t, time since disruption, fallback rate curve.
- Reuses: black-hole event horizon, lensing rings, accretion-disk coloring; binary-merger reset/phase pattern.

### 12 · Ergosphere (Penrose Process)

A real Kerr scene: rotating black hole with ergosphere, frame dragging, and energy extraction.

- Physics: horizon `r₊ = M + √(M² − a²)`; ergosphere `r_E(θ) = M + √(M² − a² cos²θ)`; frame-dragging angular velocity `ω = 2Mar / ((r² + a²)² − a²Δ sin²θ)`.
- Visuals: oblate horizon inside a pumpkin-shaped ergosphere; test particles dragged co-rotating inside it; Penrose events where a particle splits, one fragment falls in with negative energy, the other escapes faster.
- Controls: mass, spin a (0–0.998), particle count, Penrose events toggle.
- HUD: r₊, ergosphere equatorial radius, extracted energy, max efficiency (~20.7% at a → 1).
- Reuses: black-hole scene setup; replaces the README's shallow Kerr approximation with a dedicated scene.

### 13 · Kilonova

Two neutron stars inspiral and merge; r-process ejecta glow blue then red as heavy elements form.

- Physics: chirp mass (shared with binary merger), ejecta mass ~0.01–0.05 M☉, color shift from lanthanide-poor (blue, days) to lanthanide-rich (red, weeks).
- Visuals: inspiral → merger flash → expanding ejecta shell shifting blue to red; optional short GRB jet.
- Controls: component masses, timeline scrubber, jet toggle.
- HUD: chirp mass, ejecta mass, elapsed time, dominant element group.
- Reuses: binary-merger phase state machine and wave rings; supernova timeline and ejecta particles.

### Later

- **X-ray Binary**: Roche-lobe overflow stream onto a compact object; reuses neutron-star disk.
- **Alcubierre Warp**: compressed/expanded spacetime shell around a ship with lensing; reuses lensing-field render passes.
- **Time Dilation**: clocks at different radii in a gravity well with gravitational redshift; mostly HUD and physics utils.
