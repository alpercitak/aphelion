import type {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

export type SceneParams = {
  mass: number;
  innerRadius: number;
  timeRate: number;
  orbiting: boolean;
  signals: boolean;
  wellGrid: boolean;
  starField: boolean;
};

export interface Clock {
  /** Fixed direction around the hole. */
  bearing: number;
  /** Orbital angle since the run started (orbit mode only). */
  angle: number;
  /** Proper time on this clock, in display seconds. */
  tau: number;
  /** Proper time of this clock's next light pulse. */
  nextTick: number;
  group: Group;
  rim: Mesh<RingGeometry, MeshBasicMaterial>;
  ticks: LineSegments<BufferGeometry, LineBasicMaterial>;
  hand: Mesh<PlaneGeometry, MeshBasicMaterial>;
}

export interface Pulse {
  active: boolean;
  /** Radius on the well, in scene units. */
  r: number;
  /** Azimuth the pulse travels along. */
  bearing: number;
}

export interface Pulses {
  points: Points<BufferGeometry, PointsMaterial>;
  positions: BufferAttribute;
  colors: BufferAttribute;
  list: Array<Pulse>;
}

export interface SceneRef extends BaseSceneRef {
  entities: {
    clocks: Array<Clock>;
    well: LineSegments<BufferGeometry, LineBasicMaterial>;
    pulses: Pulses;
  };
}

export interface StateRef {
  /** Coordinate time of the distant observer, in display seconds. */
  t: number;
  frame: number;
}

/** Run state shown in the HUD. Refreshed every few frames, not every frame. */
export interface LiveState {
  t: number;
  tau: Array<number>;
}
