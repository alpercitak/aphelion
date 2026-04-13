import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { PARAMS } from '../constants';
import type { Params } from '../types';

export interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'mass' | 'spin' | 'temp' | 'lensStrength'>;
}

export interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showDisk' | 'showJets' | 'showStars' | 'dopplerShift'>;
}

const SLIDER_ITEMS = [
  {
    id: 'mass',
    label: 'MASS',
    min: 1,
    max: 100,
    step: 0.5,
    format: (v: number) => `${v.toFixed(1)} M☉`,
    tooltip: 'Mass in solar units. Larger mass = bigger event horizon and stronger lensing.',
  },
  {
    id: 'spin',
    label: 'SPIN (a)',
    min: 0,
    max: 0.99,
    step: 0.01,
    format: (v: number) => v.toFixed(2),
    tooltip:
      'Dimensionless spin 0–0.99. Spinning BHs follow Kerr metric, flattening the horizon and dragging spacetime.',
  },
  {
    id: 'temp',
    label: 'DISK TEMP',
    min: 2000,
    max: 30000,
    step: 100,
    format: (v: number) => `${Math.round(v)} K`,
    tooltip: 'Inner disk blackbody temperature. Hotter = bluer. Real accretion disks reach 10,000–100,000 K.',
  },
  {
    id: 'lensStrength',
    label: 'LENSING',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v: number) => v.toFixed(2),
    tooltip:
      'Intensity of gravitational light bending. At max, background light wraps around forming an Einstein ring.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showDisk', label: 'Accretion disk' },
  { id: 'showJets', label: 'Relativistic jets' },
  { id: 'showStars', label: 'Star field' },
  { id: 'dopplerShift', label: 'Doppler shift' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
