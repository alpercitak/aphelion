import type {
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export type Params = {
  initialMass: number; // 0.001–1 M☉
  timeCompression: TimeCompression;
  pairOpacity: number; // 0–1
  radiationIntensity: number; // 0–2
  showPairs: boolean;
  showHalo: boolean;
  showTempReadout: boolean;
  autoLoop: boolean;
};

export interface SceneRef extends BaseSceneRef {
  entities: {
    horizon: Mesh<SphereGeometry, MeshBasicMaterial>;
    photonGlow: Mesh<SphereGeometry, ShaderMaterial>;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    halo: Mesh<SphereGeometry, ShaderMaterial>;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
    pairPoints: Points;
    pairGeo: BufferGeometry;
    // typed uniform refs
    photonUniforms: {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };
    outerUniforms: {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };
    haloUniforms: {
      innerColor: UniformValue<Color>;
      outerColor: UniformValue<Color>;
      opacity: UniformValue<number>;
    };
  };
}

export type StateRef = {
  mass: number;
  phase: Phase;
  flashOpacity: number;
  pairs: Array<VirtualPair>;
  lastPairTime: number;
};

// Evaporation phases
export type Phase = 'evaporating' | 'flashing' | 'done';

export type TimeCompression = 'slow' | 'medium' | 'fast';

export type VirtualPair = {
  // Inward particle
  inPos: Vector3;
  inTarget: Vector3; // event horizon surface
  // Outward particle
  outPos: Vector3;
  outVel: Vector3;
  life: number; // 0–1
  color: Color;
};
