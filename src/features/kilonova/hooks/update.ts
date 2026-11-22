import { type RefObject, useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { MassParams, SceneParams, SceneRef, StateRef } from '../types';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  params: SceneParams,
  run: number,
  resetScene: (run: MassParams) => void,
) => {
  const { m1, m2, days, starField } = params;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `run` is the replay trigger
  useEffect(() => {
    resetScene({ m1, m2 });
  }, [m1, m2, run, resetScene]);

  // Scrubbing: the slider drives the kilonova clock; AUTO PLAY continues from there
  useEffect(() => {
    stateRef.current.days = days;
  }, [days, stateRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.core.stars.visible = starField;
  }, [starField, sceneRef]);
};
