import type {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    body: Mesh<SphereGeometry, ShaderMaterial>;
    innerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    bodyUniforms: BodyUniforms;
    innerGlowUniforms: GlowUniforms;
    outerGlowUniforms: GlowUniforms;
    fieldLines: Group;
    fieldHalo: Points;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
    activeCracks: Array<ActiveCrack>;
    lastQuakeTime: number;
    lastBurstTime: number;
    burstOpacity: number;
  };
}

export type BodyUniforms = {
  time: UniformValue<number>;
  fieldStrength: UniformValue<number>;
  surfaceTemp: UniformValue<number>;
};

export type GlowUniforms = {
  viewVector: UniformValue<Vector3>;
};

export type SceneParams = {
  fieldStrength: number; // 0–2, visual scale for 10¹³–10¹⁵ G
  burstIntensity: number; // 0–2
  surfaceTemp: number; // 1e6–1e8 K
  starquakeRate: StarquakeRate;
  showFieldLines: boolean;
  showStarquakes: boolean;
  showGammaBursts: boolean;
  showFieldDistortion: boolean;
};

export type StarquakeRate = 'off' | 'rare' | 'frequent';

export type ActiveCrack = {
  mesh: LineSegments<BufferGeometry, LineBasicMaterial>;
  born: number;
};
