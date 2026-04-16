import { useRef } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useUpdate } from './hooks/update';
import type { SceneRef } from './types';

export default function Magnetar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params);
  useAnimate(sceneRef, paramsRef);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
