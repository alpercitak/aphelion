import { useSceneControls } from '@/hooks/scene-controls';
import { PARAMS, SLIDER_ITEMS, TOGGLE_ITEMS } from '../constants';

export const useControls = () => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
  });
  return { params, paramsRef, controls };
};
