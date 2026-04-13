import type {
  Group,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import type { createOrbitControls } from '@/utils/camera';

export type SceneRef = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  orbit: ReturnType<typeof createOrbitControls>;
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
