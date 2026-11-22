import type {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Texture,
  TorusGeometry,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export type SceneParams = {
  velocity: number;
  radius: number;
  sigma: number;
  yorkGrid: boolean;
  exoticMatter: boolean;
  lensing: boolean;
  starField: boolean;
};

export type Bubble = Pick<SceneParams, 'velocity' | 'radius' | 'sigma'>;

export interface YorkGrid {
  line: LineSegments<BufferGeometry, LineBasicMaterial>;
  positions: BufferAttribute;
  colors: BufferAttribute;
}

export interface StreamStars {
  points: Points<BufferGeometry, PointsMaterial>;
  positions: BufferAttribute;
}

export type LensUniforms = {
  backgroundTex: UniformValue<Texture>;
  resolution: UniformValue<Vector2>;
  bubbleCenter: UniformValue<Vector2>;
  bubbleRadius: UniformValue<number>;
  motionDir: UniformValue<Vector2>;
  strength: UniformValue<number>;
  sigma: UniformValue<number>;
};

export interface SceneRef extends BaseSceneRef {
  entities: {
    streamStars: StreamStars;
    fgScene: Scene;
    ship: Group;
    yorkGrid: YorkGrid;
    exoticMatter: Mesh<TorusGeometry, MeshBasicMaterial>;
    bubbleWall: Mesh<SphereGeometry, MeshBasicMaterial>;
    renderTarget: WebGLRenderTarget;
    lensScene: Scene;
    lensCamera: OrthographicCamera;
    lensUniforms: LensUniforms;
  };
}
