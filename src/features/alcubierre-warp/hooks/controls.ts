import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS, SCENE_UNIT_M } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'velocity' | 'radius' | 'sigma'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'yorkGrid' | 'exoticMatter' | 'lensing' | 'starField'>;
}

const SLIDER_ITEMS = [
  {
    id: 'velocity',
    label: 'SPEED',
    min: 0,
    max: 10,
    step: 0.1,
    format: (v: number) => `${v.toFixed(1)} c`,
    tooltip:
      'Coordinate speed of the bubble. Inside, the ship is in free fall and feels no acceleration. Above 1 the bubble outruns light, which special relativity does not forbid because space itself moves.',
  },
  {
    id: 'radius',
    label: 'RADIUS',
    min: 1,
    max: 4,
    step: 0.1,
    format: (v: number) => `${(v * SCENE_UNIT_M).toFixed(0)} m`,
    tooltip: 'Radius of the bubble, the region of flat spacetime that carries the ship.',
  },
  {
    id: 'sigma',
    label: 'WALL σ',
    min: 1,
    max: 8,
    step: 0.5,
    format: (v: number) => v.toFixed(1),
    tooltip: 'Larger σ makes a thinner wall and needs more negative energy.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'yorkGrid', label: 'YORK TIME' },
  { id: 'exoticMatter', label: 'EXOTIC MATTER' },
  { id: 'lensing', label: 'LENSING' },
  { id: 'starField', label: 'Star field' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(SCENE_PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
