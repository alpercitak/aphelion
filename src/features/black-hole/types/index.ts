import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import type {
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three';

export interface SceneRef {
  blackHole: Mesh<SphereGeometry, MeshBasicMaterial>;
  diskGroup: Group;
  einsteinMat: MeshBasicMaterial;
  einsteinRing: Mesh<RingGeometry, MeshBasicMaterial>;
  jetsGroup: Group;
  photonMat: ShaderMaterial;
  photonRing: Mesh<RingGeometry, MeshBasicMaterial>;
  photonRingMat: MeshBasicMaterial;
  photonSphere: Mesh<SphereGeometry, ShaderMaterial>;
  outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
  renderer: WebGLRenderer;
  scene: Scene;
  stars: Points;
}

export interface Params {
  mass: number;
  spin: number;
  temp: number;
  lensStrength: number;
  showDisk: boolean;
  showJets: boolean;
  showStars: boolean;
  dopplerShift: boolean;
}

export interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'mass' | 'spin' | 'temp' | 'lensStrength'>;
}

export interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showDisk' | 'showJets' | 'showStars' | 'dopplerShift'>;
}
