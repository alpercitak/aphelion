import type { RefObject } from 'react';
import { Color, Vector3 } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import {
  CLOCK_LIFT,
  CLOCK_PERIOD,
  LIVE_REFRESH_FRAMES,
  MAX_FRAME_DT,
  ORBIT_DISPLAY_SCALE,
  PULSE_INTERVAL,
  TAU,
} from '../constants';
import type { LiveState, SceneParams, SceneRef, StateRef } from '../types';
import {
  canOrbit,
  clockRadius,
  clockRate,
  orbitDopplerRate,
  orbitOmega,
  orbitSpeed,
  surfaceHeight,
} from '../utils/physics';
import { emitPulse, stepPulses } from '../utils/pulses';
import { clockColor } from '../utils/spectrum';

const toCamera = new Vector3();
const scratchColor = new Color();

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  paramsRef: RefObject<SceneParams>,
  stateRef: RefObject<StateRef>,
  setLive: (live: LiveState) => void,
) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    const params = paramsRef.current;
    const state = stateRef.current;
    core.orbit.updateCamera(core.camera);

    const dt = Math.min(delta, MAX_FRAME_DT) * params.timeRate;
    state.t += dt;
    entities.clocks.forEach((clock, i) => {
      const r = clockRadius(params.innerRadius, i);
      clock.tau += clockRate(r, params.orbiting) * dt;
      if (params.orbiting && canOrbit(r)) {
        clock.angle += ORBIT_DISPLAY_SCALE * orbitOmega(r) * dt;
      }

      const azimuth = clock.bearing + clock.angle;
      clock.group.position.set(r * Math.cos(azimuth), surfaceHeight(r) + CLOCK_LIFT, r * Math.sin(azimuth));
      if (params.orbiting && canOrbit(r)) {
        toCamera.subVectors(core.camera.position, clock.group.position).normalize();
        const vDotN = orbitSpeed(r) * (-Math.sin(azimuth) * toCamera.x + Math.cos(azimuth) * toCamera.z);
        clockColor(orbitDopplerRate(r, vDotN), scratchColor);
        clock.rim.material.color.copy(scratchColor);
        clock.ticks.material.color.copy(scratchColor);
        clock.hand.material.color.copy(scratchColor);
      }
      clock.group.quaternion.copy(core.camera.quaternion);
      clock.hand.rotation.z = -(TAU * clock.tau) / CLOCK_PERIOD;

      while (clock.tau >= clock.nextTick) {
        if (params.signals) {
          emitPulse(entities.pulses, r, azimuth, clock.rim.material.color);
        }
        clock.nextTick += PULSE_INTERVAL;
      }
    });
    stepPulses(entities.pulses, dt);

    state.frame++;
    if (state.frame % LIVE_REFRESH_FRAMES === 0) {
      setLive({ t: state.t, tau: entities.clocks.map((clock) => clock.tau) });
    }
    core.renderer.render(core.scene, core.camera);
  });
};
