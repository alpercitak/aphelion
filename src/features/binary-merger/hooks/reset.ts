import { useCallback, type RefObject } from 'react';
import type { SceneRefType } from '@/types';
import { INITIAL_SEPARATION } from '../constants';
import { orbitalPositions } from '../utils/orbital-positions';
import type { Phase, SceneRef, StateRef } from '../types';

export const useReset = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  setPhase: (phase: Phase) => void,
) =>
  useCallback(() => {
    const s = stateRef.current;
    s.separation = INITIAL_SEPARATION;
    s.angle = 0;
    s.phase = 'orbit';
    s.mergeProgress = 0;
    s.flashOpacity = 0;
    s.waveRings = [];
    s.lastRingTime = 0;

    setPhase('orbit');

    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { core, entities } = refs;
    const { bh1, bh2, mergedBH, flash, waveRingMeshes } = entities;

    bh1.visible = true;
    bh2.visible = true;
    mergedBH.visible = false;
    flash.material.opacity = 0;

    waveRingMeshes.forEach((r) => core.scene.remove(r));
    entities.waveRingMeshes = [];

    const pos = orbitalPositions(0, INITIAL_SEPARATION);
    bh1.position.set(pos.x1, 0, pos.z1);
    bh2.position.set(pos.x2, 0, pos.z2);
  }, [sceneRef, stateRef, setPhase]);
