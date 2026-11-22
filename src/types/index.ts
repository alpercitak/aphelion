import type { RefObject } from 'react';
import type { IUniform, Object3D, PerspectiveCamera, Scene, ShaderMaterial, WebGLRenderer } from 'three';
import type { createOrbitControls } from '@/utils/camera';

export interface BaseSceneRef {
  core: {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
    orbit: ReturnType<typeof createOrbitControls>;
    stars: Object3D;
  };
}

export type CanvasRefType = RefObject<HTMLCanvasElement | null>;

export type SceneRefType<T> = RefObject<T | null>;

export type UniformValue<T> = {
  value: T;
};

export type TypedShaderMaterial<U extends Record<string, IUniform>> = ShaderMaterial & { uniforms: U };
