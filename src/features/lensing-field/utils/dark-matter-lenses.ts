import { Vector2 } from 'three';
import { DARK_MATTER_LENS_COUNT, DARK_MATTER_MASS_RANGE } from '../constants';

type DarkMatterLenses = {
  positions: Array<Vector2>;
  masses: Array<number>;
};

export const generateDarkMatterLenses = (): DarkMatterLenses => {
  const positions: Array<Vector2> = [];
  const masses: Array<number> = [];
  for (let i = 0; i < DARK_MATTER_LENS_COUNT; i++) {
    positions.push(new Vector2((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6));
    masses.push(DARK_MATTER_MASS_RANGE[0] + Math.random() * (DARK_MATTER_MASS_RANGE[1] - DARK_MATTER_MASS_RANGE[0]));
  }
  return { positions, masses };
};
