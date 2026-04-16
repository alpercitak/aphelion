import type {
  Group,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    body: Mesh<SphereGeometry, ShaderMaterial>;
    innerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    fieldLines: Group;
    fieldHalo: Points;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
    activeCracks: Array<ActiveCrack>;
    lastQuakeTime: number;
    lastBurstTime: number;
    burstOpacity: number;
  };
}

export type Params = {
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
  mesh: LineSegments;
  born: number;
};
