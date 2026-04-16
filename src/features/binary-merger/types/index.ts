import type {
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3DEventMap,
  PlaneGeometry,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    bh1: BlackHoleUnit;
    bh2: BlackHoleUnit;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
    grid: Mesh<PlaneGeometry, ShaderMaterial>;
    mergedBH: BlackHoleUnit;
    waveRingMeshes: Array<Mesh>;
  };
}

export interface StateRef {
  separation: number;
  angle: number;
  phase: Phase;
  mergeProgress: number;
  flashOpacity: number;
  waveRings: Array<WaveRing>;
  lastRingTime: number;
  sceneParams: SceneParams;
}

export type SceneParams = {
  mass1: number;
  mass2: number;
  waveAmplitude: number;
  showGrid: boolean;
  showWaveRings: boolean;
  showDisks: boolean;
  autoLoop: boolean;
  inspiralRate: InspiralOption;
};

export type InspiralOption = 'slow' | 'medium' | 'fast';

export type Phase = 'orbit' | 'merging' | 'merged';

export interface BlackHoleUnitData {
  bhMesh: Mesh;
  glowMesh: Mesh<SphereGeometry, ShaderMaterial>;
  glowMat: ShaderMaterial;
  haloMesh: Mesh<SphereGeometry, ShaderMaterial>;
  haloMat: ShaderMaterial;
  diskGroup: Group;
  baseScale: number;
}

export interface BlackHoleUnit extends Group {
  userData: BlackHoleUnitData;
}

export interface WaveRing {
  mesh: Mesh<RingGeometry, MeshBasicMaterial, Object3DEventMap>;
  born: number;
}

export type SetPhase = (phase: Phase) => void;

export type ResetScene = () => void;
