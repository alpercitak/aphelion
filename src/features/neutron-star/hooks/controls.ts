import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'mass' | 'rpm' | 'fieldStrength'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'showBeams' | 'showFieldLines' | 'showBeamFlash' | 'showAccretionDisk'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<SceneParams, 'beamWidth'>;
}

const SLIDER_ITEMS = [
  {
    id: 'mass',
    label: 'MASS',
    min: 1.1,
    max: 2.5,
    step: 0.01,
    format: (v) => `${v.toFixed(2)} M☉`,
    tooltip: 'Neutron star mass. The TOV limit is ~2.1–2.5 M☉ — above this, collapse to a black hole is inevitable.',
  },
  {
    id: 'rpm',
    label: 'ROTATION',
    min: 0.1,
    max: 600,
    step: 0.1,
    format: (v) => `${v.toFixed(1)} RPM`,
    tooltip: 'Rotation speed. Millisecond pulsars spin up to 716 Hz (43,000 RPM) via accretion from a companion star.',
  },
  {
    id: 'fieldStrength',
    label: 'FIELD',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Magnetic field strength. Controls field line opacity and arc spread. Pulsars: ~10¹² G.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showBeams', label: 'PULSAR BEAMS' },
  { id: 'showFieldLines', label: 'MAGNETIC FIELD LINES' },
  { id: 'showBeamFlash', label: 'BEAM FLASH EFFECT' },
  { id: 'showAccretionDisk', label: 'ACCRETION DISK' },
] as const satisfies ReadonlyArray<ToggleItem>;

const RADIO_ITEMS = [
  {
    id: 'beamWidth',
    label: 'Beam width',
    options: ['narrow', 'wide'].map((item) => ({ id: item, label: item })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(SCENE_PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
