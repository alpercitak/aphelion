import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { DESTINATION_LABEL_MAP, DESTINATION_OPTIONS, PARAMS } from '../constants';
import type { Params } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'throatRadius' | 'exoticDensity' | 'lensingStrength'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showExoticHalo' | 'showLensingRings' | 'showStars'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<Params, 'destination'>;
}

const SLIDER_ITEMS = [
  {
    id: 'throatRadius',
    label: 'THROAT RADIUS',
    min: 0.4,
    max: 2.2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Radius of the wormhole throat. Larger throat = more visible interior and stronger lensing rim.',
  },
  {
    id: 'exoticDensity',
    label: 'EXOTIC MATTER',
    min: 0,
    max: 1,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip:
      'Density of exotic matter with negative energy — required to keep the wormhole stable and traversable. Purely theoretical.',
  },
  {
    id: 'lensingStrength',
    label: 'LENSING',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Intensity of spacetime curvature lensing around the throat. Bends light paths near the opening.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showExoticHalo', label: 'EXOTIC MATTER HALO' },
  { id: 'showLensingRings', label: 'LENSING RINGS' },
  { id: 'showStars', label: 'STAR FIELD' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const RADIO_ITEMS = [
  {
    id: 'destination',
    label: 'DESTINATION',
    options: DESTINATION_OPTIONS.map((id) => ({ id, label: DESTINATION_LABEL_MAP[id] })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
