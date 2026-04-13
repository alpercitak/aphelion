import type { SceneRefType } from '@/types';
import { useCallback, type RefObject } from 'react';
import type { Params, Phase, SceneRef, StateRef } from '../types';

export const useReset = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  paramsRef: RefObject<Params>,
  setPhase: (phase: Phase) => void,
  setLiveMass: (mass: number) => void,
) =>
  useCallback(() => {
    const state = stateRef.current;
    state.mass = paramsRef.current.initialMass;
    state.phase = 'evaporating';
    state.flashOpacity = 0;
    state.pairs = [];
    state.lastPairTime = 0;
    setPhase('evaporating');
    setLiveMass(paramsRef.current.initialMass);

    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;
    entities.flash.material.opacity = 0;
    entities.horizon.visible = true;
    entities.photonGlow.visible = true;
    entities.outerGlow.visible = true;
  }, [sceneRef, stateRef, setPhase]);
