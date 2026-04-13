import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { PARAMS } from '../constants';
import type { Params } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'initialMass' | 'pairOpacity' | 'radiationIntensity'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showPairs' | 'showHalo' | 'showTempReadout' | 'autoLoop'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<Params, 'timeCompression'>;
}

const SLIDER_ITEMS = [
  {
    id: 'initialMass',
    label: 'INITIAL MASS',
    min: 0.001,
    max: 1.0,
    step: 0.001,
    format: (v) => `${v.toFixed(3)} M☉`,
    tooltip: 'Starting mass of the micro black hole. Smaller mass = higher Hawking temperature = faster evaporation.',
  },
  {
    id: 'pairOpacity',
    label: 'PAIR OPACITY',
    min: 0,
    max: 1,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Visibility of virtual particle pairs forming near the event horizon.',
  },
  {
    id: 'radiationIntensity',
    label: 'RADIATION',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Brightness of the Hawking radiation halo. Scales with temperature as mass decreases.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showPairs', label: 'VIRTUAL PAIRS' },
  { id: 'showHalo', label: 'RADIATION HALO' },
  { id: 'showTempReadout', label: 'TEMP READOUT' },
  { id: 'autoLoop', label: 'AUTO LOOP' },
] as const satisfies ReadonlyArray<ToggleItem>;

const RADIO_ITEMS = [
  {
    id: 'timeCompression',
    label: 'TIME COMPRESSION',
    options: [
      { id: 'slow', label: 'SLOW' },
      { id: 'medium', label: 'MEDIUM' },
      { id: 'fast', label: 'FAST' },
    ],
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
    radios: RADIO_ITEMS,
  });
  return { params, paramsRef, controls };
};
