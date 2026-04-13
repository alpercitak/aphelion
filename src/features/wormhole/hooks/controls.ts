import { useSceneControls } from '@/hooks/scene-controls';
import { PARAMS, RADIO_ITEMS, SLIDER_ITEMS, TOGGLE_ITEMS } from '../constants';

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
