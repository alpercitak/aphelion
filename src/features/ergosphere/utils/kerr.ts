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

/*
 * Timelike geodesics in Mino time λ (dτ = Σ dλ). Each particle has constants E (energy), L (axial angular momentum)
 * and Q (Carter constant). Radial and polar motion decouple: (dr/dλ)² = R(r), (dθ/dλ)² = Θ(θ).
 */

/** R(r) = P² − Δ (r² + (L − aE)² + Q), with P = E (r² + a²) − aL and Δ = r² − 2r + a². */
export const radialPotential = (r: number, a: number, e: number, l: number, q: number) => {
  const p = e * (r * r + a * a) - a * l;
  const delta = r * r - 2 * r + a * a;
  return p * p - delta * (r * r + (l - a * e) ** 2 + q);
};

/** Θ(θ) = Q − cos²θ (a²(1 − E²) + L² / sin²θ). */
export const polarPotential = (theta: number, a: number, e: number, l: number, q: number) => {
  const sin2 = Math.sin(theta) ** 2;
  return q - Math.cos(theta) ** 2 * (a * a * (1 - e * e) + (l * l) / sin2);
};

/** ½ R′(r): the Mino-time acceleration d²r/dλ². */
export const radialForce = (r: number, a: number, e: number, l: number, q: number) => {
  const p = e * (r * r + a * a) - a * l;
  const delta = r * r - 2 * r + a * a;
  return 2 * e * r * p - (r - 1) * (r * r + (l - a * e) ** 2 + q) - r * delta;
};

/** ½ Θ′(θ): the Mino-time acceleration d²θ/dλ². Independent of Q. */
export const polarForce = (theta: number, a: number, e: number, l: number) => {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  return a * a * (1 - e * e) * cos * sin + (l * l * cos) / sin ** 3;
};

/** dt/dλ = −a (aE sin²θ − L) + (r² + a²) P / Δ. */
export const timeRate = (r: number, theta: number, a: number, e: number, l: number) => {
  const p = e * (r * r + a * a) - a * l;
  const delta = r * r - 2 * r + a * a;
  return -a * (a * e * Math.sin(theta) ** 2 - l) + ((r * r + a * a) * p) / delta;
};

/** dφ/dλ = −(aE − L / sin²θ) + a P / Δ. */
export const azimuthRate = (r: number, theta: number, a: number, e: number, l: number) => {
  const p = e * (r * r + a * a) - a * l;
  const delta = r * r - 2 * r + a * a;
  return -(a * e - l / Math.sin(theta) ** 2) + (a * p) / delta;
};

/** Bardeen's prograde circular-orbit angular momentum, L = (r² − 2a√r + a²) / (r^¾ √(r^³/² − 3√r + 2a)). */
export const circularAngularMomentum = (r: number, a: number) =>
  (r * r - 2 * a * Math.sqrt(r) + a * a) / (r ** 0.75 * Math.sqrt(r ** 1.5 - 3 * Math.sqrt(r) + 2 * a));

/**
 * Larger root E of R(r) = 0 at a radial and polar turning point (ṙ = θ̇ = 0), with Q = Q(E, L, θ) substituted. With
 * s = sin²θ and c = cos²θ, R(r) = A E² − 4arL E + C, where A = (r² + a²)² − Δ a² s and C = a²L² − Δ (r² + L²/s + c a²).
 * Since dt/dλ = (A E − 2arL) / Δ, the larger root gives dt/dλ = √disc / Δ > 0: it is the future-directed one.
 * NaN if there is no real root.
 */
export const turningPointEnergy = (r: number, theta: number, a: number, l: number) => {
  const s = Math.sin(theta) ** 2;
  const c = 1 - s;
  const delta = r * r - 2 * r + a * a;
  const A = (r * r + a * a) ** 2 - delta * a * a * s;
  const C = a * a * l * l - delta * (r * r + (l * l) / s + c * a * a);
  return (2 * a * r * l + Math.sqrt(4 * a * a * r * r * l * l - A * C)) / A;
};
