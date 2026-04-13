import type {
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import type { RadioProps } from '@/components/ui/radio';
import type { createOrbitControls } from '@/utils/camera';

export type SceneRef = {
  renderer: WebGLRenderer;
  scene: Scene;
  portalScene: Scene; // secondary scene rendered to texture
  camera: PerspectiveCamera;
  portalCamera: PerspectiveCamera;
  orbit: ReturnType<typeof createOrbitControls>;
  renderTarget: WebGLRenderTarget;
  // objects
  rim: Mesh<TorusGeometry, ShaderMaterial>;
  portalDisc: Mesh<SphereGeometry, ShaderMaterial>;
  innerGlow: Mesh<SphereGeometry, ShaderMaterial>;
  outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
  lensingRings: Array<Mesh>;
  exoticHalo: Points;
  destinationStars: Points;
  stars: Points;
  rimUniforms: {
    viewVector: { value: Vector3 };
  };
  innerGlowUniforms: {
    viewVector: { value: Vector3 };
  };
  outerGlowUniforms: {
    viewVector: { value: Vector3 };
  };
  portalUniforms: {
    time: { value: number };
    distortion: { value: number };
  };
};

export type Params = {
  throatRadius: number;
  exoticDensity: number;
  lensingStrength: number;
  destination: Destination;
  showExoticHalo: boolean;
  showLensingRings: boolean;
  showStars: boolean;
};

export type Destination = 'distant' | 'nebula';
