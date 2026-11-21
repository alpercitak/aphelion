import { useRef, useState } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { INITIAL_LIVE, INITIAL_STATE } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useReset } from './hooks/reset';
import { useUpdate } from './hooks/update';
import type { LiveState, SceneRef, StateRef } from './types';

export default function TidalDisruption() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef>(INITIAL_STATE);
  const [live, setLive] = useState<LiveState>(INITIAL_LIVE);

  const resetScene = useReset(sceneRef, stateRef, setLive);

  const { params, paramsRef, controls } = useControls(() => resetScene(paramsRef.current));
  const hud = useHud(params, live);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params, resetScene);
  useAnimate(sceneRef, stateRef, setLive);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
