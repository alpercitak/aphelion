import type {
  BufferAttribute,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { BaseSceneRef } from '@/types';

export type Phase = 'approach' | 'disruption' | 'fallback' | 'disk' | 'swallowed';

export interface OrbitPath {
  line: Line<BufferGeometry, LineBasicMaterial>;
  positions: Float32Array;
  positionAttr: BufferAttribute;
}

export interface DebrisSystem {
  points: Points<BufferGeometry, PointsMaterial>;
  positions: Float32Array;
  colors: Float32Array;
  positionAttr: BufferAttribute;
  colorAttr: BufferAttribute;
  /** Fixed offset of each particle from the star center. */
  offsets: Float32Array;
  velocities: Float32Array;
  /** PARTICLE status per particle. */
  status: Uint8Array;
}

export interface SceneRef extends BaseSceneRef {
  entities: {
    horizon: Mesh<SphereGeometry, MeshBasicMaterial>;
    glow: Mesh<SphereGeometry, ShaderMaterial>;
    tidalSphere: Mesh<SphereGeometry, MeshBasicMaterial>;
    orbit: OrbitPath;
    debris: DebrisSystem;
  };
}

export interface StateRef {
  phase: Phase;
  swallowed: boolean;
  periapsis: number;
  horizonR: number;
  /** Time from disruption to fallback peak (scene units). */
  tMin: number;
  elapsed: number;
  released: boolean;
  releaseTime: number;
  boundFraction: number;
  diskReady: boolean;
  accreted: number;
  prevRadialDot: number;
  frame: number;
  /** Star center, integrated on the parabolic orbit. */
  starPos: Vector3;
  starVel: Vector3;
}

export type SceneParams = {
  logMass: number;
  starMass: number;
  beta: number;
  showTidal: boolean;
  showOrbit: boolean;
  showStars: boolean;
};

export type MassParams = Pick<SceneParams, 'logMass' | 'starMass'>;

export type RunParams = MassParams & Pick<SceneParams, 'beta'>;

/** Run status shown in the HUD. Updated a few times per second, not every frame. */
export interface LiveState {
  phase: Phase;
  /** Time since disruption (scene units). */
  t: number;
  tMin: number;
  boundFraction: number;
}
