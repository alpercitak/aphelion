import { useSceneControls } from '@/hooks/scene-controls';
import { PARAMS, RADIO_ITEMS, SLIDER_ITEMS, TOGGLE_ITEMS } from '../constants';

export const useControls = (resetScene: () => void) => {
  const { params, paramsRef, controls } = useSceneControls(PARAMS, {
    radios: RADIO_ITEMS,
    sliders: SLIDER_ITEMS,
    toggles: TOGGLE_ITEMS,
    buttons: [{ variant: 'secondary', onClick: resetScene, children: '↺ RESET' }],
  });
  return { params, paramsRef, controls };
};
