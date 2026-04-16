import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneControls } from '@/hooks/scene-controls';
import { SCENE_PARAMS } from '../constants';
import type { SceneParams, StarquakeRate } from '../types';

interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<SceneParams, 'fieldStrength' | 'burstIntensity' | 'surfaceTemp'>;
}

interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<SceneParams, 'showFieldLines' | 'showStarquakes' | 'showGammaBursts' | 'showFieldDistortion'>;
}

interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<SceneParams, 'starquakeRate'>;
}

const SLIDER_ITEMS = [
  {
    id: 'fieldStrength',
    label: 'FIELD STRENGTH',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => `${v.toFixed(2)}`,
    tooltip: 'Magnetic field intensity. Controls field line density and writhing speed. Magnetars reach 10¹⁵ Gauss.',
  },
  {
    id: 'burstIntensity',
    label: 'BURST INTENSITY',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip:
      'Gamma ray burst brightness. Real magnetar bursts are detectable across the galaxy — SGR 1806-20 was visible in daylight.',
  },
  {
    id: 'surfaceTemp',
    label: 'SURFACE TEMP',
    min: 1e6,
    max: 1e8,
    step: 1e6,
    format: (v) => `${(v / 1e6).toFixed(0)}MK`,
    tooltip: 'Surface temperature in megakelvin. Drives surface color from orange-white to hard blue-white.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

const TOGGLE_ITEMS = [
  { id: 'showFieldLines', label: 'MAGNETIC FIELD LINES' },
  { id: 'showStarquakes', label: 'STARQUAKE EVENTS' },
  { id: 'showGammaBursts', label: 'GAMMA RAY BURSTS' },
  { id: 'showFieldDistortion', label: 'FIELD DISTORTION' },
] as const satisfies ReadonlyArray<ToggleItem>;

const RADIO_ITEMS = [
  {
    id: 'starquakeRate',
    label: 'STARQUAKE RATE',
    options: (['off', 'rare', 'frequent'] satisfies Array<StarquakeRate>).map((item) => ({ id: item, label: item })),
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
