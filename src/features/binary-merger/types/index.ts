import type {
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3DEventMap,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import type { createOrbitControls } from '@/utils/camera';

export interface SceneRef {
  bh1: BlackHoleUnit;
  bh2: BlackHoleUnit;
  camera: PerspectiveCamera;
  flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
  grid: Mesh<PlaneGeometry, ShaderMaterial>;
  mergedBH: BlackHoleUnit;
  orbit: ReturnType<typeof createOrbitControls>;
  renderer: WebGLRenderer;
  scene: Scene;
  stars: Points;
  waveRingMeshes: Array<Mesh>;
}

export interface StateRef {
  separation: number;
  angle: number;
  phase: Phase;
  mergeProgress: number;
  flashOpacity: number;
  waveRings: Array<WaveRing>;
  lastRingTime: number;
  params: Params;
}

export interface Params {
  mass1: number;
  mass2: number;
  waveAmplitude: number;
  showGrid: boolean;
  showWaveRings: boolean;
  showDisks: boolean;
  autoLoop: boolean;
  inspiralRate: InspiralOption;
}

export interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'mass1' | 'mass2' | 'waveAmplitude'>;
}

export interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showGrid' | 'showWaveRings' | 'showDisks' | 'autoLoop'>;
}

export interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<Params, 'inspiralRate'>;
}

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
