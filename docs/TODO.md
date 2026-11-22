# TODO

## Open

- Social preview image: upload a scene screenshot in GitHub repo settings.
- Tidal disruption: debris is non-self-gravitating test particles on frozen-in star velocity; no spiral shocks, and circularization is a radial-velocity drag only, so the disk is not forced into a plane.
- Tidal disruption: fallback peak `t_min` is an analytic estimate (energy spread `GM·R★/r²`), not measured from the debris. DISK starts at `2·t_min`, when ~37% of bound debris has returned.
- Tidal disruption: partial-disruption rule `|offset·r̂| > R★(1/β − 1)` is ad hoc; for β near 1 most of the star is released. Escaped debris is never removed.
- Tidal disruption: the flare L/L_Edd is the frozen-in estimate (Ṁ_peak = m★/3t_min, η = 0.1, zero before t_min, then (t/t_min)^-5/3) with no Eddington cap; partial disruptions scale it by the released particle fraction, not by mass in the stripped layers. Debris color uses a heuristic temperature, not viscous heating. Visual horizon is clamped to a minimum size below ~2×10⁶ M☉.
- Tidal disruption: `t_min` is ~20 s for β ≥ 1 and ~90 s for β = 0.6 at SPEED 1. There is no scrubber, since the debris is integrated forward.
- Ergosphere: test particles keep a fixed θ and only move in r and φ; no geodesic integration, so orbits are not exact Kerr geodesics.
- Ergosphere: particle own velocity is a fixed fraction of the Keplerian value at the current r; it is clamped to [Ω₋, Ω₊] each frame, not integrated.
- Ergosphere: Penrose split energies are not conserved; extracted energy is η_max per event in units of the particle energy, not computed from fragment four-momenta. Escape fragments fade out instead of respawning.
- Ergosphere: spin changes reshape the surfaces but do not reset particles; a replay is needed to clear the extracted-energy count.
- Ergosphere: spin is capped at 0.998, so the extremal case is not shown; no spin-down is applied as energy is extracted.
- Ergosphere: the ergosphere is a single translucent surface with no meridian lines; the particle color only encodes the sign of Ω, not its magnitude.
- Kilonova: the final approach is capped at 6 scene units/s for display, so contact comes ~0.4 s after the Peters τ. During the merger the bodies orbit at the fixed contact rate.
- Kilonova: `τ` scales as 1/(m₁m₂M) around 6 display seconds for the default masses (1.8–11 s across the slider range); a₀ is fixed, so there is no separation dependence. The orbital ω uses a normalised GM = 240·M, so the visual orbit is not at real frequency; only the HUD f_GW is in real units.
- Kilonova: remnant thresholds (2.4 and 2.9 M☉) and the 1 s hypermassive collapse delay are fixed. They do not depend on the equation of state, and the remnant is not mass-loss corrected.
- Kilonova: the bolometric lightcurve is a fixed `(t/1 d)²` rise then `t^(-1.3)` decline, and the dominant component flips at a fixed 2.5 d. Cloud brightness uses separate band shapes (blue optical peak 1 d, red near-infrared peak 7 d). Ejecta mass only scales brightness; it does not change the decline or the color shift. Blue-to-red color is linear in time.
- Kilonova: ejecta radius uses √day compression for the display, so the time axis is not physical. There is no opacity or temperature model for lanthanides, and no accretion disk after collapse.
- Kilonova: the GRB jet is a fixed-length cone with no beaming, Lorentz factor or afterglow. The glow shader takes the view-space z axis as the view direction, which is approximate for off-center bodies.
- X-ray Binary: the HUD period uses a fixed 3 R☉ separation, so P does not follow from the donor filling its lobe (no donor mass–radius relation). The scene ω grows with total mass, so heavy systems spin visibly faster.
- X-ray Binary: stream parcels switch to circular disk orbits at the tidal radius; no hot-spot shock, rim splash or disk thickness. Disk gas drifts inward on a fixed 5 s e-folding time, not α-disk inflow.
- X-ray Binary: displayed disk rotation is capped at 12 rad/s, so the inner ~20–30% of the disk turns rigidly. Disk colour and brightness are display mappings (T_in 30,000 K, brightness ∝ Ṁ^0.25), not tied to the HUD's kT_in.
- X-ray Binary: L and kT_in are Newtonian (GMṀ/R for a neutron star, GMṀ/2R_ISCO for a black hole, T_max = 0.488 T*), with no GR, colour correction or spin.
- X-ray Binary: steady Roche-lobe overflow only; no disk-instability outbursts, wind feeding (HMXB), jets or Eddington-limited outflow. The 5000-particle pool saturates above about Ṁ = 10^-8.2 M☉/yr.
- X-ray Binary: disk gas spreads by a random walk in radius (viscous diffusion, display rate), not a real α-disk. The donor has linear limb darkening only; no irradiation by the X-ray source or gravity darkening.
- Alcubierre Warp: the HUD energy is Pfenning & Ford's thin-wall estimate −(1/12) v² R²/Δ; the exact integral with the tanh shape function is about ⅔ of it, and the estimate fails for σR ≲ 3.
- Alcubierre Warp: the wall thickness Δ comes from the shape function's slope at R, not the quantum-inequality bound (Δ ≲ 10² v L_Planck), so −E is far smaller than physical estimates.
- Alcubierre Warp: lensing is a screen-space offset driven by f′ along the motion axis, not ray tracing through the metric; no aberration or Doppler shift, and it folds into mirrored slivers at high v·σR. It is subtle at the default star density.
- Alcubierre Warp: streaming star speed is display-scaled and capped, not v_s; nothing shows the horizon or the blue-shifted particle build-up at the front wall.
- Alcubierre Warp: the York grid is the y = 0 slice drawn at GRID_Y with θ in 1/scene-unit. The exotic-matter ring (tube 1.5/σ, opacity ∝ v²) is a hint, not a plot of ε(x, ρ).
- Time Dilation: redshift for orbiting clocks ignores the line-of-sight Doppler term, so approaching and receding sides look the same colour. Circular orbits between 1.5 and 3 Rₛ are unstable in reality but shown as steady.
- Time Dilation: clock brightness scales as (1+z)⁻¹ for readability; physical surface brightness falls as (1+z)⁻⁴. The emitted line is fixed at 500 nm (Bruton spectrum), and anything past 780 nm is the same dim red.
- Time Dilation: the orbital angle runs 3× faster than coordinate time for visibility; τ and pulse timing are not scaled. Pulses travel strictly radially at coordinate speed (1 − Rₛ/r), with no light bending or aberration.
- Time Dilation: the inner-clock slider stops at 2 Rₛ so the outermost clock (8×) stays on the 16 Rₛ grid. The black hole is drawn as a sphere at the paraboloid's throat; the embedding is undefined inside Rₛ.

## Next scenes

Each follows the existing feature layout (`src/features/<scene>/`, registered in `src/utils/scene/index.ts`). Ordered by priority.

### Later

No scenes queued.
