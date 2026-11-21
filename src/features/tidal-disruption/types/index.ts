import type { Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry } from 'three';
import type { BaseSceneRef } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    horizon: Mesh<SphereGeometry, MeshBasicMaterial>;
    glow: Mesh<SphereGeometry, ShaderMaterial>;
    tidalSphere: Mesh<SphereGeometry, MeshBasicMaterial>;
  };
}

export type SceneParams = {
  logMass: number;
  starMass: number;
  beta: number;
  showTidal: boolean;
  showStars: boolean;
};

export type MassParams = Pick<SceneParams, 'logMass' | 'starMass'>;
