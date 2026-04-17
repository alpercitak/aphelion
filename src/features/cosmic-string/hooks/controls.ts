import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'linearDensity' | 'tension' | 'oscillationAmp'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'showDoubleImage' | 'showIntercommutation' | 'showGlow' | 'showCone'>;
}

const SLIDER_ITEMS = [
  {
    id: 'linearDensity',
    label: 'LINEAR DENSITY',
    min: 0.05,
    max: 1.0,
    step: 0.01,
    format: (v) => `Gµ ~10^${(-12 + v * 6).toFixed(1)}`,
    tooltip:
      'Linear mass density Gµ (G × mass/length / c²). Observational limits constrain Gµ < 10⁻⁷. Controls lensing strength and glow brightness.',
  },
  {
    id: 'tension',
    label: 'TENSION',
    min: 0.1,
    max: 1.0,
    step: 0.01,
    format: (v) => v.toFixed(2),
    tooltip:
      'String tension — the energy per unit length. For a cosmic string, tension equals linear mass density × c². Controls oscillation speed and wavelength.',
  },
  {
    id: 'oscillationAmp',
    label: 'OSCILLATION',
    min: 0,
    max: 2.0,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip:
      'Amplitude of transverse oscillations. Cosmic strings oscillate at close to the speed of light, radiating gravitational waves as they lose energy.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showDoubleImage', label: 'DOUBLE IMAGE EFFECT' },
  { id: 'showIntercommutation', label: 'INTERCOMMUTATION' },
  { id: 'showGlow', label: 'STRING GLOW' },
  { id: 'showCone', label: 'CONICAL GEOMETRY' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(SCENE_PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
