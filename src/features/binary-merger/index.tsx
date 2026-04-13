import { useRef, useState } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { INITIAL_STATE } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useReset } from './hooks/reset';
import { useUpdate } from './hooks/update';
import type { Phase, SceneRef, StateRef } from './types';

export default function BinaryMerger() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef>(INITIAL_STATE);

  const [phase, setPhase] = useState<Phase>('orbit');

  const resetScene = useReset(sceneRef, stateRef, setPhase);

  const { params, paramsRef, controls } = useControls(resetScene);
  const hud = useHud(params, phase);

  useInit(canvasRef, sceneRef);
  useUpdate(sceneRef, params, phase);
  useAnimate(sceneRef, paramsRef, stateRef, setPhase, resetScene);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
