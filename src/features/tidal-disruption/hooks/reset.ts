import { type RefObject, useCallback } from 'react';
import type { SceneRefType } from '@/types';
import { R_TIDAL_VISUAL } from '../constants';
import type { LiveState, RunParams, SceneRef, StateRef } from '../types';
import { fillOrbitPath, periapsisOf, setParabolicState, startAnomaly } from '../utils/orbit';
import { horizonVisualRadius, isSwallowed } from '../utils/physics';
import { fallbackTimescale, resetParticles, toLiveState } from '../utils/simulation';

export const useReset = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  setLive: (live: LiveState) => void,
) =>
  useCallback(
    (run: RunParams) => {
      const s = stateRef.current;
      const periapsis = periapsisOf(run.beta);
      const nu0 = startAnomaly(periapsis);

      setParabolicState(periapsis, -nu0, s.starPos, s.starVel);
      s.periapsis = periapsis;
      s.swallowed = isSwallowed(run);
      s.horizonR = horizonVisualRadius(run);
      s.tMin = fallbackTimescale(Math.max(periapsis, R_TIDAL_VISUAL));
      s.phase = s.swallowed ? 'swallowed' : 'approach';
      s.elapsed = 0;
      s.released = false;
      s.releaseTime = 0;
      s.boundFraction = 0;
      s.releasedFraction = 0;
      s.accreted = 0;
      s.prevRadialDot = s.starPos.dot(s.starVel);
      s.frame = 0;

      const refs = sceneRef.current;
      if (!refs) {
        return;
      }
      const { horizon, glow, orbit, debris } = refs.entities;
      horizon.scale.setScalar(s.horizonR);
      glow.scale.setScalar(s.horizonR);
      fillOrbitPath(orbit.positions, periapsis, nu0);
      orbit.positionAttr.needsUpdate = true;
      resetParticles(debris, s);
      setLive(toLiveState(s));
    },
    [sceneRef, stateRef, setLive],
  );
