import type { SliderProps } from '@/components/ui/slider';
import { useSceneControls } from '@/hooks/scene-controls';
import { PARAMS } from '../constants';
import type { InspiralOption, Params } from '../types';
import type { ToggleProps } from '@/components/ui/toggle';
import type { RadioProps } from '@/components/ui/radio';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'mass1' | 'mass2' | 'waveAmplitude'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showGrid' | 'showWaveRings' | 'showDisks' | 'autoLoop'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<Params, 'inspiralRate'>;
}

const SLIDER_ITEMS = [
  {
    id: 'mass1',
    label: 'MASS 1',
    min: 1,
    max: 50,
    step: 0.5,
    tooltip:
      'Mass of the first black hole. Larger mass = bigger event horizon and stronger gravitational wave emission.',
    format: (v: number) => `${v.toFixed(1)} M☉`,
  },
  {
    id: 'mass2',
    label: 'MASS 2',
    min: 1,
    max: 50,
    step: 0.5,
    tooltip: 'Mass of the second black hole. Unequal masses produce orbital asymmetry and stronger waves.',
    format: (v: number) => `${v.toFixed(1)} M☉`,
  },
  {
    id: 'waveAmplitude',
    label: 'WAVE AMP',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v: number) => v.toFixed(2),
    tooltip:
      'Spacetime grid deformation intensity. Real gravitational waves distort space by less than a proton width — amplified here for visibility.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showGrid', label: 'Spacetime grid' },
  { id: 'showWaveRings', label: 'Wave rings' },
  { id: 'showDisks', label: 'Accretion disks' },
  { id: 'autoLoop', label: 'Auto loop' },
] as const satisfies ReadonlyArray<ToggleItem>;

const RADIO_ITEMS = [
  {
    id: 'inspiralRate',
    label: 'Inspiral',
    labelTooltip: 'How fast the orbit decays. Real inspiral takes millions of years — compressed here.',
    options: (['slow', 'medium', 'fast'] satisfies Array<InspiralOption>).map((item) => ({ id: item, label: item })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const useControls = (resetScene: () => void) => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
    buttons: [{ variant: 'secondary', onClick: resetScene, children: '↺ RESET' }],
  });
  return { params, paramsRef, controls };
};
