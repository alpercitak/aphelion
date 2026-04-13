import type {
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { BaseSceneRef } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    body: Mesh<SphereGeometry, ShaderMaterial>;
    photonGlow: Mesh<SphereGeometry, ShaderMaterial>;
    outerHalo: Mesh<SphereGeometry, ShaderMaterial>;
    ejectaHaze: Mesh<SphereGeometry, MeshBasicMaterial>;
    // particle system
    particleGeo: BufferGeometry;
    particlePoints: Points;
    particles: Array<Particle>;
    trailGroup: Group;
    // typed uniform refs
    photonUniforms: { viewVector: { value: Vector3 }; glowColor: { value: Color } };
    haloUniforms: { viewVector: { value: Vector3 } };
    bodyRadius: number;
  };
}

export type Params = {
  mass: number;
  ejectionRate: EjectionRate;
  ejectionVelocity: number; // 0.1–0.9 (fraction of c, visual only)
  temperature: number; // 1000–50000 K
  showTrails: boolean;
  showPhotonSphere: boolean;
  showEjectaHaze: boolean;
  showStars: boolean;
};

export type EjectionRate = 'low' | 'medium' | 'high' | 'extreme';

export interface Particle {
  pos: Vector3;
  vel: Vector3;
  life: number; // 0–1, 0 = dead
  maxLife: number;
  prevPos: Vector3;
  color: Color;
  trailLine: Line<BufferGeometry, LineBasicMaterial> | null;
}
