import { type RefObject, useCallback } from 'react';
import type { SceneRefType } from '@/types';
import type { LiveState, SceneRef, StateRef } from '../types';
import { resetParticles } from '../utils/particles';

export const useReset = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  setLive: (live: LiveState) => void,
) =>
  useCallback(() => {
    const state = stateRef.current;
    state.events = 0;
    state.extracted = 0;
    state.frame = 0;

    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    resetParticles(refs.entities.particles);
    setLive({ events: 0, extracted: 0 });
  }, [sceneRef, stateRef, setLive]);
