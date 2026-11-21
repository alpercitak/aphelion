import { useRef } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { INITIAL_STATE } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useReset } from './hooks/reset';
import { useUpdate } from './hooks/update';
import type { SceneRef, StateRef } from './types';

export default function TidalDisruption() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef>(INITIAL_STATE);

  const resetScene = useReset(sceneRef, stateRef);

  const { params, controls } = useControls();
  const hud = useHud(params);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params, resetScene);
  useAnimate(sceneRef, stateRef);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
