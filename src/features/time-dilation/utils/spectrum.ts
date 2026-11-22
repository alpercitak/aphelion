import type { Color } from 'three';
import { EMITTED_WAVELENGTH_NM, INFRARED_RED, VISIBLE_MAX_NM } from '../constants';

/**
 * Bruton's piecewise-linear approximation of the visible spectrum (380–780 nm), written into `target`.
 * Wavelengths beyond the visible range return a dim deep red.
 */
export const wavelengthToColor = (nm: number, target: Color) => {
  if (nm > VISIBLE_MAX_NM) {
    return target.setRGB(INFRARED_RED, 0, 0);
  }
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) {
    r = (440 - nm) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = (510 - nm) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = (645 - nm) / 65;
  } else {
    r = 1;
  }

  // the eye's sensitivity fades at both ends of the visible range
  let fade = 1;
  if (nm < 420) {
    fade = 0.3 + (0.7 * (nm - 380)) / 40;
  } else if (nm > 700) {
    fade = 0.3 + (0.7 * (VISIBLE_MAX_NM - nm)) / 80;
  }
  return target.setRGB(r * fade, g * fade, b * fade);
};

/**
 * Colour of a clock's light as seen from far away. The emitted line is stretched by 1 + z = 1/rate and
 * dimmed by rate = 1/(1+z). Physical surface brightness falls as (1+z)⁻⁴; one power keeps the clocks readable.
 * For orbiting clocks the rate includes the transverse Doppler shift but not the line-of-sight Doppler term.
 */
export const clockColor = (rate: number, target: Color) =>
  wavelengthToColor(EMITTED_WAVELENGTH_NM / rate, target).multiplyScalar(rate);
