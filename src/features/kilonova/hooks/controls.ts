import { useMemo } from 'react';
import type { ButtonProps } from '@/components/ui/button';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { KILONOVA_DAYS, SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'm1' | 'm2' | 'ejectaMass' | 'days'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'autoPlay' | 'grbJet' | 'gwRings' | 'starField'>;
}

const SLIDER_ITEMS = [
  {
    id: 'm1',
    label: 'MASS 1',
    min: 1.1,
    max: 2.0,
    step: 0.05,
    format: (v: number) => `${v.toFixed(2)} M☉`,
    tooltip: 'Mass of the first neutron star. Typical observed neutron stars are about 1.1–2.0 M☉.',
  },
  {
    id: 'm2',
    label: 'MASS 2',
    min: 1.1,
    max: 2.0,
    step: 0.05,
    format: (v: number) => `${v.toFixed(2)} M☉`,
    tooltip:
      'Mass of the second neutron star. The total mass sets the remnant: below 2.4 M☉ a neutron star, up to 2.9 M☉ a hypermassive star, above that a prompt black hole.',
  },
  {
    id: 'ejectaMass',
    label: 'EJECTA',
    min: 0.01,
    max: 0.08,
    step: 0.005,
    format: (v: number) => `${v.toFixed(3)} M☉`,
    tooltip: 'Mass ejected by the merger. It scales the kilonova brightness. 40% goes into the blue polar component.',
  },
  {
    id: 'days',
    label: 'TIMELINE',
    min: 0,
    max: KILONOVA_DAYS,
    step: 0.1,
    format: (v: number) => `${v.toFixed(1)} d`,
    tooltip:
      'Days since the merger, during the kilonova. With AUTO PLAY on it advances by itself from where you scrub.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'autoPlay', label: 'AUTO PLAY' },
  { id: 'grbJet', label: 'GRB JET' },
  { id: 'gwRings', label: 'GW RINGS' },
  { id: 'starField', label: 'Star field' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = (onReplay: () => void) => {
  const buttons = useMemo<ReadonlyArray<ButtonProps>>(
    () => [{ variant: 'secondary', onClick: onReplay, children: '↺ REPLAY' }],
    [onReplay],
  );
  const { params, paramsRef, controls, set } = useSceneControls(SCENE_PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
    buttons,
  });
  return { params, paramsRef, controls, set };
};
