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
  /** Mino-time velocities dr/dλ and dθ/dλ of NORMAL particles. */
  rDot: Float64Array;
  thetaDot: Float64Array;
  /** Geodesic constants E, L and Q of NORMAL particles. */
  energy: Float64Array;
  angMom: Float64Array;
  carter: Float64Array;
  /**
   * Fraction in [-1, 1], fixed per particle. Scales L against the prograde circular L for NORMAL particles and
   * the local Keplerian Ω for fragments.
   */
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
