import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'mass' | 'ejectionVelocity' | 'temperature'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'showTrails' | 'showPhotonSphere' | 'showEjectaHaze' | 'showStars'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<SceneParams, 'ejectionRate'>;
}

const RADIO_ITEMS = [
  {
    id: 'ejectionRate',
    label: 'EJECTION RATE',
    options: [
      { id: 'low', label: 'LOW' },
      { id: 'medium', label: 'MEDIUM' },
      { id: 'high', label: 'HIGH' },
      { id: 'extreme', label: 'EXTREME' },
    ],
  },
] as const satisfies ReadonlyArray<RadioItem>;

const SLIDER_ITEMS = [
  {
    id: 'mass',
    label: 'MASS',
    min: 1,
    max: 100,
    step: 0.5,
    format: (v) => `${v.toFixed(1)} M☉`,
    tooltip: 'Mass of the white hole. Sets the size of the central body and the photon sphere radius.',
  },
  {
    id: 'ejectionVelocity',
    label: 'EJECTION VEL',
    min: 0.1,
    max: 0.9,
    step: 0.01,
    format: (v) => `${v.toFixed(2)}c`,
    tooltip:
      'Outward velocity of ejected matter as a fraction of the speed of light. Higher velocity = longer particle trails.',
  },
  {
    id: 'temperature',
    label: 'EJECTA TEMP',
    min: 1000,
    max: 50000,
    step: 500,
    format: (v) => `${Math.round(v / 1000)}kK`,
    tooltip:
      'Temperature of ejected matter. Drives color from orange-red (cool) to blue-white (hot) via blackbody radiation.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showTrails', label: 'PARTICLE TRAILS' },
  { id: 'showPhotonSphere', label: 'PHOTON SPHERE' },
  { id: 'showEjectaHaze', label: 'EJECTA HAZE' },
  { id: 'showStars', label: 'STAR FIELD' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(SCENE_PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
