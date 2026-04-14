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
import type { BaseSceneRef } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    blackHole: Mesh<SphereGeometry, MeshBasicMaterial>;
    diskGroup: Group;
    einsteinMat: MeshBasicMaterial;
    einsteinRing: Mesh<RingGeometry, MeshBasicMaterial>;
    jetsGroup: Group;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    photonMat: ShaderMaterial;
    photonRing: Mesh<RingGeometry, MeshBasicMaterial>;
    photonRingMat: MeshBasicMaterial;
    photonSphere: Mesh<SphereGeometry, ShaderMaterial>;
  };
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
