import { BOLOMETRIC_PEAK_DAYS, DECAY_EXPONENT, RED_TAKEOVER_DAYS } from '../constants';
import type { Dominant } from '../types';

/**
 * Lightcurve shape, normalised to 1 at its peak: rises as (t/t_peak)² and
 * declines as (t/t_peak)^(−1.3), the r-process heating slope. The two halves meet at the peak.
 */
export const componentShape = (days: number, peakDays: number) => {
  if (days <= 0) {
    return 0;
  }
  const x = days / peakDays;
  return x < 1 ? x * x : x ** DECAY_EXPONENT;
};

/** Bolometric luminosity relative to its early peak; afterwards it tracks the heating rate t^(−1.3). */
export const relativeLuminosity = (days: number) => componentShape(days, BOLOMETRIC_PEAK_DAYS);

export const dominantComponent = (days: number): Dominant => (days < RED_TAKEOVER_DAYS ? 'BLUE' : 'RED');
