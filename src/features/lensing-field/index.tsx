import { useRef } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { INITIAL_LENS_STATE } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useUpdate } from './hooks/update';
import type { LensState, SceneRef } from './types';

export default function LensingField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);
  const lensStateRef = useRef<LensState>(INITIAL_LENS_STATE);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params, lensStateRef);
  useAnimate(sceneRef, paramsRef, lensStateRef);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
