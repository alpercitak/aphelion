import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    stringScene: Scene; // string rendered on top of lensed background
    lensScene: Scene; // fullscreen lensing pass
    lensCamera: OrthographicCamera;
    renderTarget: WebGLRenderTarget;
    stringCore: Mesh<TubeGeometry, MeshBasicMaterial>;
    stringGlow: Mesh<TubeGeometry, MeshBasicMaterial>;
    coneMesh: Mesh<BufferGeometry, MeshBasicMaterial> | null;
    lensQuad: Mesh<PlaneGeometry, ShaderMaterial>;
    loops: Array<CommutationLoop>;
    lastLoopTime: number;
    lastRebuildTime: number;
    lensUniforms: LensUniforms;
  };
}

export type SceneParams = {
  linearDensity: number; // Gµ visual scale 0–1 (maps 10⁻¹² – 10⁻⁶)
  tension: number; // 0.1–1
  oscillationAmp: number; // 0–2
  showDoubleImage: boolean;
  showIntercommutation: boolean;
  showGlow: boolean;
  showCone: boolean;
};

export type LensUniforms = {
  backgroundTex: UniformValue<WebGLRenderTarget['texture']>;
  resolution: UniformValue<Vector2>;
  linearDensity: UniformValue<number>;
  showDoubleImage: UniformValue<boolean>;
  stringA: UniformValue<Vector2>;
  stringB: UniformValue<Vector2>;
};

// Intercommutation loop — shrinking tube loop at intersection point
export type CommutationLoop = {
  mesh: Mesh<TubeGeometry, MeshBasicMaterial>;
  born: number;
  radius: number;
};
