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
import type { BaseSceneRef, UniformValue } from '@/types';
import type { createOrbitControls } from '@/utils/camera';

export interface SceneRef extends BaseSceneRef {
  entities: {
    portalScene: Scene; // secondary scene rendered to texture
    portalCamera: PerspectiveCamera;
    renderTarget: WebGLRenderTarget;
    rim: Mesh<TorusGeometry, ShaderMaterial>;
    portalDisc: Mesh<SphereGeometry, ShaderMaterial>;
    innerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    lensingRings: Array<Mesh>;
    exoticHalo: Points;
    destinationStars: Points;
    rimUniforms: {
      viewVector: UniformValue<Vector3>;
    };
    innerGlowUniforms: {
      viewVector: UniformValue<Vector3>;
    };
    outerGlowUniforms: {
      viewVector: UniformValue<Vector3>;
    };
    portalUniforms: {
      time: UniformValue<number>;
      distortion: UniformValue<number>;
    };
  };
}

export type SceneParams = {
  throatRadius: number;
  exoticDensity: number;
  lensingStrength: number;
  destination: Destination;
  showExoticHalo: boolean;
  showLensingRings: boolean;
  showStars: boolean;
};

export type Destination = 'distant' | 'nebula';
