import type {
  BufferAttribute,
  BufferGeometry,
  ConeGeometry,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

export type Phase = 'inspiral' | 'merger' | 'kilonova';
export type RemnantType = 'neutron-star' | 'hypermassive' | 'black-hole';
export type Dominant = 'BLUE' | 'RED';

export type SceneParams = {
  m1: number;
  m2: number;
  ejectaMass: number;
  days: number;
  autoPlay: boolean;
  grbJet: boolean;
  gwRings: boolean;
  starField: boolean;
};

export type RunParams = Pick<SceneParams, 'm1' | 'm2' | 'ejectaMass'>;
export type MassParams = Pick<SceneParams, 'm1' | 'm2'>;

export interface Body {
  mesh: Mesh<SphereGeometry, MeshBasicMaterial>;
  glow: Mesh<SphereGeometry, ShaderMaterial>;
}

export interface EjectaCloud {
  points: Points<BufferGeometry, PointsMaterial>;
  /** Unit-speed direction of each particle, scaled by its speed. Scaled as a whole by the cloud's radius. */
  positions: Float32Array;
  positionAttr: BufferAttribute;
}

export interface SceneRef extends BaseSceneRef {
  entities: {
    bodyA: Body;
    bodyB: Body;
    remnantNs: Body;
    remnantBh: Body;
    jetUp: Mesh<ConeGeometry, MeshBasicMaterial>;
    jetDown: Mesh<ConeGeometry, MeshBasicMaterial>;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
    blueEjecta: EjectaCloud;
    redEjecta: EjectaCloud;
  };
}

export interface StateRef {
  phase: Phase;
  frame: number;
  /** Real seconds since the run started. */
  elapsed: number;
  /** Seconds since the merger started. */
  mergeT: number;
  separation: number;
  mergeStartSeparation: number;
  angle: number;
  remnant: RemnantType;
  /** Days since merger, on the kilonova timeline. */
  days: number;
  lastRingTime: number;
  rings: Array<Mesh<RingGeometry, MeshBasicMaterial>>;
}

/** Run status shown in the HUD. Updated a few times per second, not every frame. */
export interface LiveState {
  phase: Phase;
  elapsed: number;
  separation: number;
  days: number;
  luminosity: number;
  dominant: Dominant;
}
