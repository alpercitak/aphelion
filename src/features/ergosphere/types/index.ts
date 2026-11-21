import type {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

export interface ParticleSystem {
  points: Points<BufferGeometry, PointsMaterial>;
  positions: Float32Array;
  colors: Float32Array;
  positionAttr: BufferAttribute;
  colorAttr: BufferAttribute;
  /** Boyer–Lindquist r, θ and φ per particle. */
  r: Float64Array;
  theta: Float64Array;
  phi: Float64Array;
  /** Own angular velocity as a fraction of the local Keplerian value, in [-1, 1]. Fixed per particle. */
  frac: Float64Array;
  /** KIND per particle. */
  kind: Uint8Array;
}

export interface SceneRef extends BaseSceneRef {
  entities: {
    horizon: Mesh<SphereGeometry, MeshBasicMaterial>;
    ergosphere: Mesh<SphereGeometry, ShaderMaterial>;
    /** Unit-sphere vertex directions shared by both surfaces. */
    unit: Float32Array;
    particles: ParticleSystem;
  };
}

export interface StateRef {
  events: number;
  extracted: number;
  frame: number;
}

export type SceneParams = {
  spin: number;
  mass: number;
  showErgosphere: boolean;
  showPenrose: boolean;
  showStars: boolean;
};

/** Run status shown in the HUD. Updated a few times per second, not every frame. */
export interface LiveState {
  events: number;
  extracted: number;
}
