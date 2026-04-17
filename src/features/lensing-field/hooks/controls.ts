import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { BackgroundDensity, SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'mass'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'mouseLens' | 'multipleLenses' | 'showLensMarker' | 'darkMatterMode'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<SceneParams, 'backgroundDensity'>;
}

const SLIDER_ITEMS = [
  {
    id: 'mass',
    label: 'LENS MASS',
    min: 0.1,
    max: 1000,
    step: 0.1,
    format: (v) => `${v.toFixed(1)} M☉`,
    tooltip: 'Mass of the invisible lensing body. Higher mass = stronger deflection, wider Einstein ring radius.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'mouseLens', label: 'MOUSE CONTROL' },
  { id: 'multipleLenses', label: 'MULTIPLE LENSES' },
  { id: 'showLensMarker', label: 'SHOW LENS LOCATION' },
  { id: 'darkMatterMode', label: 'DARK MATTER MODE' },
] as const satisfies ReadonlyArray<ToggleItem>;

const RADIO_ITEMS = [
  {
    id: 'backgroundDensity',
    label: 'Background',
    options: (['sparse', 'medium', 'dense'] satisfies Array<BackgroundDensity>).map((item) => ({
      id: item,
      label: item,
    })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(SCENE_PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
    radios: RADIO_ITEMS,
  });
  return { params, paramsRef, controls };
};
