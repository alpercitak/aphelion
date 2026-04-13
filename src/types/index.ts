import type { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
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
