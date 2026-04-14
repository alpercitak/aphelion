import type { RefObject } from 'react';
import type { Color, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
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
