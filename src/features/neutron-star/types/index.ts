import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import type { createOrbitControls } from '@/utils/camera';
import type {
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
} from 'three';

export interface SceneRef {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  orbit: ReturnType<typeof createOrbitControls>;
  // objects
  starBody: Mesh<SphereGeometry, ShaderMaterial>;
  glow: Mesh<SphereGeometry, ShaderMaterial>;
  outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
  rotator: Object3D; // beams + star rotate together
  beams: Group;
  fieldLines: Group;
  accretionDisk: Group;
  flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
}

export type Params = {
  mass: number;
  rpm: number;
  fieldStrength: number;
  beamWidth: BeamWidth;
  showBeams: boolean;
  showFieldLines: boolean;
  showBeamFlash: boolean;
  showAccretionDisk: boolean;
};

export interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'mass' | 'rpm' | 'fieldStrength'>;
}

export interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showBeams' | 'showFieldLines' | 'showBeamFlash' | 'showAccretionDisk'>;
}

export type BeamWidth = 'narrow' | 'wide';
