import { useCallback, useRef, useState } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { INITIAL_LIVE, INITIAL_STATE } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useReset } from './hooks/reset';
import { useUpdate } from './hooks/update';
import type { LiveState, SceneRef, StateRef } from './types';

export default function Ergosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef>(INITIAL_STATE);
  const [live, setLive] = useState<LiveState>(INITIAL_LIVE);

  const resetScene = useReset(sceneRef, stateRef, setLive);

  const [run, setRun] = useState(0);
  const replay = useCallback(() => setRun((n) => n + 1), []);

  const { params, paramsRef, controls } = useControls(replay);
  const hud = useHud(params, live);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params, run, resetScene);
  useAnimate(sceneRef, stateRef, paramsRef, setLive);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
