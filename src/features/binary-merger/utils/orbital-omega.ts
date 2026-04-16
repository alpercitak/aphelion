const OMEGA_SCALE = 0.6; // visual scale factor, not physically derived
const MASS_REF = 20; // reference mass in M☉ for normalisation
const MIN_SEPARATION = 0.3; // prevents division explosion near merger

// Orbital angular velocity (simplified, scales with separation) -> ω ∝ sqrt(M) / r^1.5 (Keplerian)
export const orbitalOmega = (separation: number, totalMass: number): number =>
  (OMEGA_SCALE * Math.sqrt(totalMass / MASS_REF)) / Math.pow(Math.max(separation, MIN_SEPARATION), 1.5);
