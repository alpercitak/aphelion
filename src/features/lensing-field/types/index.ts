import type {
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Sprite,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export type SceneParams = {
  mass: number;
  backgroundDensity: BackgroundDensity;
  mouseLens: boolean;
  multipleLenses: boolean;
  showLensMarker: boolean;
  darkMatterMode: boolean;
};

export interface SceneRef extends BaseSceneRef {
  entities: {
    bgScene: Scene; // background — rendered to texture
    lensScene: Scene; // fullscreen quad with lensing shader
    bgCamera: PerspectiveCamera;
    lensCamera: OrthographicCamera;
    renderTarget: WebGLRenderTarget;
    galaxies: Array<Sprite>;
    lensQuad: Mesh<PlaneGeometry, ShaderMaterial>;
    // typed uniform refs
    lensUniforms: LensUniforms;
  };
}

export interface LensUniforms {
  backgroundTex: UniformValue<WebGLRenderTarget['texture']>;
  resolution: UniformValue<Vector2>;
  lensCount: UniformValue<number>;
  lensPos: UniformValue<Array<Vector2>>;
  lensMass: UniformValue<Array<number>>;
  showMarkers: UniformValue<boolean>;
  darkMatterMode: UniformValue<boolean>;
  dmPos: UniformValue<Array<Vector2>>;
  dmMass: UniformValue<Array<number>>;
  dmLenses: {
    positions: Array<Vector2>;
    masses: Array<number>;
  };
}
export type BackgroundDensity = 'sparse' | 'medium' | 'dense';

export type LensState = {
  // primary lens position in NDC (-1..1)
  pos: Vector2;
  // auto-drift path
  driftTime: number;
  driftSpeed: number;
};
