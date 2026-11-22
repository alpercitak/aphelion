import { useMemo } from 'react';
import type { ButtonProps } from '@/components/ui/button';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'mass' | 'innerRadius' | 'timeRate'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'orbiting' | 'signals' | 'wellGrid' | 'starField'>;
}

const SLIDER_ITEMS = [
  {
    id: 'mass',
    label: 'MASS',
    min: 1,
    max: 20,
    step: 0.5,
    format: (v: number) => `${v.toFixed(1)} M☉`,
    tooltip:
      'Mass of the hole. It only sets the real distances in the HUD: every ratio in the scene is the same for any mass.',
  },
  {
    id: 'innerRadius',
    label: 'INNER CLOCK',
    min: 1.1,
    max: 4,
    step: 0.05,
    format: (v: number) => `${v.toFixed(2)} Rₛ`,
    tooltip: 'Radius of the innermost clock. The others sit at twice, four and eight times this radius.',
  },
  {
    id: 'timeRate',
    label: 'TIME RATE',
    min: 0.25,
    max: 4,
    step: 0.25,
    format: (v: number) => `${v.toFixed(2)} ×`,
    tooltip: "How fast the distant observer's clock runs on screen.",
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'orbiting', label: 'ORBITING' },
  { id: 'signals', label: 'LIGHT PULSES' },
  { id: 'wellGrid', label: 'WELL' },
  { id: 'starField', label: 'Star field' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = (onReplay: () => void) => {
  const buttons = useMemo<ReadonlyArray<ButtonProps>>(
    () => [{ variant: 'secondary', onClick: onReplay, children: '↺ REPLAY' }],
    [onReplay],
  );
  const { params, paramsRef, controls } = useSceneControls(SCENE_PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
    buttons,
  });
  return { params, paramsRef, controls };
};
