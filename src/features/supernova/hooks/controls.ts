import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams, SupernovaType } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'progenitorMass' | 'playbackSpeed' | 'timeline'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'autoPlay' | 'showShockwave' | 'showEjecta' | 'showRemnant' | 'showNeutrinos'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<SceneParams, 'supernovaType'>;
}

const SLIDER_ITEMS = [
  {
    id: 'progenitorMass',
    label: 'PROGENITOR',
    min: 8,
    max: 150,
    step: 1,
    format: (v) => `${v.toFixed(0)} M☉`,
    tooltip:
      'Mass of the progenitor star. >8 M☉ produces a core-collapse supernova. >25 M☉ collapses directly to a black hole. >130 M☉ may trigger pair-instability.',
  },
  {
    id: 'playbackSpeed',
    label: 'SPEED',
    min: 0.1,
    max: 4.0,
    step: 0.1,
    format: (v) => `${v.toFixed(1)}×`,
    tooltip: 'Playback speed multiplier. The real event unfolds over days to millennia — compressed here to seconds.',
  },
  {
    id: 'timeline',
    label: 'TIMELINE',
    min: 0,
    max: 1,
    step: 0.001,
    format: (v) => `${(v * 100).toFixed(1)}%`,
    tooltip: 'Scrub through the supernova sequence manually. 0 = progenitor star, 1 = mature supernova remnant.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'autoPlay', label: 'AUTO PLAY' },
  { id: 'showShockwave', label: 'SHOCKWAVE' },
  { id: 'showEjecta', label: 'EJECTA SHELL' },
  { id: 'showRemnant', label: 'REMNANT' },
  { id: 'showNeutrinos', label: 'NEUTRINO BURST' },
] as const satisfies ReadonlyArray<ToggleItem>;

const RADIO_ITEMS = [
  {
    id: 'supernovaType',
    label: 'Type',
    options: (['type-ii', 'type-ia'] satisfies Array<SupernovaType>).map((item) => ({ id: item, label: item })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const useControls = () => {
  const { params, paramsRef, controls, set } = useSceneControls(SCENE_PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls, set };
};
