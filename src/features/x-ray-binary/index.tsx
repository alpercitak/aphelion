import { useRef } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { SCENE_PARAMS } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useUpdate } from './hooks/update';
import type { SceneRef, StateRef } from './types';
import { computeBinary } from './utils/roche';

const INITIAL_STATE: StateRef = { binary: computeBinary(SCENE_PARAMS), spawnCarry: 0 };

export default function XRayBinary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef>(INITIAL_STATE);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, stateRef, params);
  useAnimate(sceneRef, paramsRef, stateRef);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
