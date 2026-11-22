import { BLUE_MASS_FRACTION, BLUE_PEAK_DAYS, DECAY_EXPONENT, KILONOVA_DAYS, RED_PEAK_DAYS } from '../constants';
import type { Dominant } from '../types';

/**
 * Per-component lightcurve shape, normalised to 1 at its peak: rises as (t/t_peak)² and
 * declines as (t/t_peak)^(−1.3), the r-process heating slope. The two halves meet at the peak.
 */
export const componentShape = (days: number, peakDays: number) => {
  if (days <= 0) {
    return 0;
  }
  const x = days / peakDays;
  return x < 1 ? x * x : x ** DECAY_EXPONENT;
};

const blueWeight = (days: number) => BLUE_MASS_FRACTION * componentShape(days, BLUE_PEAK_DAYS);
const redWeight = (days: number) => (1 - BLUE_MASS_FRACTION) * componentShape(days, RED_PEAK_DAYS);

/** Total luminosity at a given time, in arbitrary units. */
const luminosityAt = (days: number) => blueWeight(days) + redWeight(days);

/** Peak of the total luminosity over the timeline. Relative luminosity is measured against it. */
const TOTAL_PEAK = (() => {
  let peak = 0;
  for (let days = 0; days <= KILONOVA_DAYS; days += 0.05) {
    peak = Math.max(peak, luminosityAt(days));
  }
  return peak;
})();

export const relativeLuminosity = (days: number) => luminosityAt(days) / TOTAL_PEAK;

export const dominantComponent = (days: number): Dominant => (blueWeight(days) >= redWeight(days) ? 'BLUE' : 'RED');
