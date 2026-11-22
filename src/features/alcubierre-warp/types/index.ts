import type {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

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

export interface SceneRef extends BaseSceneRef {
  entities: {
    ship: Group;
    yorkGrid: YorkGrid;
    exoticMatter: Mesh<TorusGeometry, MeshBasicMaterial>;
    bubbleWall: Mesh<SphereGeometry, MeshBasicMaterial>;
  };
}
