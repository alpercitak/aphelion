import { useRef } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useTimeline } from './hooks/timeline';
import { useUpdate } from './hooks/update';
import type { SceneRef } from './types';

export default function Supernova() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);

  const { params, paramsRef, controls, set } = useControls();
  const { timelineRef, phase, updateTimeline } = useTimeline(params.timeline, params.autoPlay, set);
  const hud = useHud(params, phase);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params);
  useAnimate(sceneRef, paramsRef, timelineRef, updateTimeline);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
