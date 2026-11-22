import { useMemo } from 'react';
import type { ButtonProps } from '@/components/ui/button';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'logMass' | 'starMass' | 'beta' | 'playbackSpeed'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'showTidal' | 'showOrbit' | 'showStars'>;
}

const SLIDER_ITEMS = [
  {
    id: 'logMass',
    label: 'BH MASS',
    min: 5,
    max: 8.5,
    step: 0.1,
    format: (v: number) => `10^${v.toFixed(1)} M☉`,
    tooltip:
      'Black hole mass as a power of ten in solar masses. Above ~10⁸ M☉ a Sun-like star is swallowed whole instead of torn apart.',
  },
  {
    id: 'starMass',
    label: 'STAR MASS',
    min: 0.3,
    max: 10,
    step: 0.1,
    format: (v: number) => `${v.toFixed(1)} M☉`,
    tooltip: 'Mass of the doomed star. Heavier stars are larger, so their tidal radius is larger too.',
  },
  {
    id: 'beta',
    label: 'PENETRATION β',
    min: 0.6,
    max: 3,
    step: 0.1,
    format: (v: number) => v.toFixed(1),
    tooltip:
      'Penetration factor r_t / r_p. At 1 the star is fully torn apart. Above 1 it dives deeper. Below 1 only its outer layers are stripped.',
  },
  {
    id: 'playbackSpeed',
    label: 'SPEED',
    min: 0.25,
    max: 4,
    step: 0.25,
    format: (v: number) => `${v.toFixed(2)}×`,
    tooltip: 'Playback speed. The real flare unfolds over months, compressed here to seconds.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showTidal', label: 'Tidal radius' },
  { id: 'showOrbit', label: 'Orbit path' },
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
