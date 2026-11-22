import { type RefObject, useEffect } from 'react';
import { Color } from 'three';
import type { SceneRefType } from '@/types';
import { PULSE_INTERVAL } from '../constants';
import type { SceneParams, SceneRef, StateRef } from '../types';
import { setClockColor } from '../utils/clock';
import { clockRadius, clockRate } from '../utils/physics';
import { clearPulses } from '../utils/pulses';
import { clockColor } from '../utils/spectrum';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  params: SceneParams,
  run: number,
) => {
  const { innerRadius, orbiting, signals, wellGrid, starField } = params;

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const color = new Color();
    refs.entities.clocks.forEach((clock, i) => {
      setClockColor(clock, clockColor(clockRate(clockRadius(innerRadius, i), orbiting), color));
    });
  }, [innerRadius, orbiting, sceneRef]);

  // Replay, a new inner radius or orbit mode restart every clock together
  // biome-ignore lint/correctness/useExhaustiveDependencies: `run` is the replay trigger
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const state = stateRef.current;
    state.t = 0;
    for (const clock of refs.entities.clocks) {
      clock.tau = 0;
      clock.angle = 0;
      clock.nextTick = PULSE_INTERVAL;
    }
    clearPulses(refs.entities.pulses);
  }, [innerRadius, orbiting, run, sceneRef, stateRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.entities.well.visible = wellGrid;
    refs.entities.pulses.points.visible = signals;
    refs.core.stars.visible = starField;
  }, [wellGrid, signals, starField, sceneRef]);
};
