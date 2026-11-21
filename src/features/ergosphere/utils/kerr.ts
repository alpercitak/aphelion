/** Kerr geometry in geometric units G = c = M = 1, Boyer–Lindquist coordinates. */

/** Outer horizon r₊ = 1 + √(1 − a²). */
export const horizonRadius = (a: number) => 1 + Math.sqrt(1 - a * a);

/** Ergosphere boundary r_E(θ) = 1 + √(1 − a² cos²θ). Equals 2 on the equator and r₊ at the poles. */
export const ergosphereRadius = (a: number, cosTheta: number) => 1 + Math.sqrt(1 - a * a * cosTheta * cosTheta);

/** Keplerian angular velocity of a prograde circular orbit, Ω_K = 1 / (r^(3/2) + a). */
export const keplerianOmega = (r: number, a: number) => 1 / (r ** 1.5 + a);

/**
 * Clamps an angular velocity to the range allowed for a timelike particle at (r, θ), Ω ∈ [Ω₋, Ω₊],
 * with Ω± = ω ± √(ω² − g_tt / g_φφ) and ω the frame-dragging angular velocity.
 * Outside the ergosphere Ω₋ < 0 (counter-rotation possible). Inside it g_tt > 0 and Ω₋ > 0.
 */
export const clampAngularVelocity = (own: number, r: number, theta: number, a: number) => {
  const a2 = a * a;
  const r2 = r * r;
  const sin2 = Math.sin(theta) ** 2;
  const sigma = r2 + a2 * (1 - sin2);
  const delta = r2 - 2 * r + a2;
  const gtt = -(1 - (2 * r) / sigma);
  const gpp = (r2 + a2 + (2 * a2 * r * sin2) / sigma) * sin2;
  const omega = (2 * a * r) / ((r2 + a2) ** 2 - a2 * delta * sin2);
  const root = Math.sqrt(omega * omega - gtt / gpp);
  return Math.min(omega + root, Math.max(omega - root, own));
};

/** Penrose process maximum efficiency η_max = ½(√(2/r₊) − 1). */
export const penroseEfficiency = (a: number) => 0.5 * (Math.sqrt(2 / horizonRadius(a)) - 1);

/** Extractable rotational energy fraction 1 − M_irr/M, with M_irr = √(2r₊)/2. */
export const extractableFraction = (a: number) => 1 - Math.sqrt(2 * horizonRadius(a)) / 2;
