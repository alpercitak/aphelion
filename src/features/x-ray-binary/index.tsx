import { useRef } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useUpdate } from './hooks/update';
import type { SceneRef, StateRef } from './types';

export default function XRayBinary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef | null>(null);

  const { params, controls } = useControls();
  const hud = useHud(params);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, stateRef, params);
  useAnimate(sceneRef, stateRef);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
