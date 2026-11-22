import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'accretorMass' | 'donorMass' | 'mdotLog'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'rocheLobes' | 'starField'>;
}

const SLIDER_ITEMS = [
  {
    id: 'accretorMass',
    label: 'ACCRETOR',
    min: 1.2,
    max: 15,
    step: 0.1,
    format: (v: number) => `${v.toFixed(1)} M☉`,
    tooltip: 'Mass of the compact accretor. Below 3 M☉ it is a neutron star, above that a black hole.',
  },
  {
    id: 'donorMass',
    label: 'DONOR',
    min: 0.2,
    max: 1.5,
    step: 0.05,
    format: (v: number) => `${v.toFixed(2)} M☉`,
    tooltip: 'Mass of the donor star. It swells to fill its Roche lobe, and the mass ratio sets the lobe size.',
  },
  {
    id: 'mdotLog',
    label: 'TRANSFER',
    min: -10,
    max: -7,
    step: 0.1,
    format: (v: number) => `1e${v.toFixed(1)} M☉/yr`,
    tooltip: 'Rate at which the donor loses mass through L1. It sets the disk brightness and the X-ray luminosity.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'rocheLobes', label: 'ROCHE LOBES' },
  { id: 'starField', label: 'Star field' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = () => {
  const { params, controls } = useSceneControls(SCENE_PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, controls };
};
