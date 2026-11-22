import { type RefObject, useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { RunParams, SceneParams, SceneRef, StateRef } from '../types';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  params: SceneParams,
  run: number,
  resetScene: (run: RunParams) => void,
) => {
  const { m1, m2, ejectaMass, days, autoPlay, starField } = params;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `run` is the replay trigger
  useEffect(() => {
    resetScene({ m1, m2, ejectaMass });
  }, [m1, m2, ejectaMass, run, resetScene]);

  // Scrubbing: with AUTO PLAY off the slider drives the kilonova clock
  useEffect(() => {
    if (!autoPlay) {
      stateRef.current.days = days;
    }
  }, [days, autoPlay, stateRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.core.stars.visible = starField;
  }, [starField, sceneRef]);
};
