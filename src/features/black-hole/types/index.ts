import type {
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import type { createOrbitControls } from '@/utils/camera';

export interface SceneRef {
  blackHole: Mesh<SphereGeometry, MeshBasicMaterial>;
  camera: PerspectiveCamera;
  diskGroup: Group;
  einsteinMat: MeshBasicMaterial;
  einsteinRing: Mesh<RingGeometry, MeshBasicMaterial>;
  jetsGroup: Group;
  orbit: ReturnType<typeof createOrbitControls>;
  outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
  photonMat: ShaderMaterial;
  photonRing: Mesh<RingGeometry, MeshBasicMaterial>;
  photonRingMat: MeshBasicMaterial;
  photonSphere: Mesh<SphereGeometry, ShaderMaterial>;
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
