import { useEffect, useRef, useState } from 'react';
import SceneLayout from '@/components/app/scene-layout';
import { INITIAL_STATE, SCENE_PARAMS } from './constants';
import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import { useReset } from './hooks/reset';
import type { Phase, SceneRef, StateRef } from './types';

export default function HawkingEvaporation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);
  const stateRef = useRef<StateRef>({ ...INITIAL_STATE });

  const [phase, setPhase] = useState<Phase>('evaporating');
  const [liveMass, setLiveMass] = useState<number>(SCENE_PARAMS.initialMass);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params, liveMass, phase);

  useInit(canvasRef, sceneRef);

  const resetScene = useReset(sceneRef, stateRef, paramsRef, setPhase, setLiveMass);

  useEffect(() => {
    resetScene();
  }, [params.initialMass, resetScene]);

  useAnimate(sceneRef, paramsRef, stateRef, setPhase, setLiveMass, resetScene);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
