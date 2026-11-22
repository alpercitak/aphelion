import { type RefObject, useCallback } from 'react';
import type { SceneRefType } from '@/types';
import { INITIAL_SEPARATION } from '../constants';
import type { LiveState, MassParams, SceneRef, StateRef } from '../types';
import { fillBlueEjecta, fillRedEjecta } from '../utils/ejecta';
import { clearWaveRings } from '../utils/gw-rings';
import { blackHoleVisualRadius, remnantType, totalMass } from '../utils/physics';
import { toLiveState } from '../utils/simulation';

export const useReset = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  setLive: (live: LiveState) => void,
  setDays: (days: number) => void,
) =>
  useCallback(
    (run: MassParams) => {
      const s = stateRef.current;
      const mass = totalMass(run);
      s.phase = 'inspiral';
      s.frame = 0;
      s.elapsed = 0;
      s.mergeT = 0;
      s.separation = INITIAL_SEPARATION;
      s.angle = 0;
      s.remnant = remnantType(mass);
      s.days = 0;
      s.lastRingTime = 0;

      const refs = sceneRef.current;
      if (!refs) {
        return;
      }
      const { entities } = refs;
      entities.remnantBh.mesh.scale.setScalar(blackHoleVisualRadius(mass));
      clearWaveRings(refs.core.scene, s.rings);
      fillBlueEjecta(entities.blueEjecta);
      fillRedEjecta(entities.redEjecta);
      setDays(0);
      setLive(toLiveState(s));
    },
    [sceneRef, stateRef, setLive, setDays],
  );
