import { useMemo } from 'react';
import type { ButtonProps } from '@/components/ui/button';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'spin' | 'mass'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'showErgosphere' | 'showPenrose' | 'showStars'>;
}

const SLIDER_ITEMS = [
  {
    id: 'spin',
    label: 'SPIN a',
    min: 0,
    max: 0.998,
    step: 0.002,
    format: (v: number) => v.toFixed(3),
    tooltip:
      'Dimensionless spin a = J/M², capped at 0.998 (the extremal limit is not reached). Higher spin enlarges the ergosphere and raises the Penrose limit.',
  },
  {
    id: 'mass',
    label: 'MASS',
    min: 1,
    max: 100,
    step: 1,
    format: (v: number) => `${v.toFixed(0)} M☉`,
    tooltip: 'Solar masses. Only changes the HUD (km and Hz). The simulation runs in units of GM/c².',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showErgosphere', label: 'Ergosphere surface' },
  { id: 'showPenrose', label: 'Penrose events' },
  { id: 'showStars', label: 'Star field' },
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
