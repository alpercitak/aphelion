import type { Group, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, ShaderMaterial, SphereGeometry } from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    starBody: Mesh<SphereGeometry, ShaderMaterial>;
    glow: Mesh<SphereGeometry, ShaderMaterial>;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    rotator: Object3D; // beams + star rotate together
    fieldTilt: Object3D; // child of rotator that holds the beams
    bodyUniforms: BodyUniforms;
    beams: Group;
    fieldLines: Group;
    accretionDisk: Group;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
  };
}

export type BodyUniforms = {
  time: UniformValue<number>;
  rpm: UniformValue<number>;
  mass: UniformValue<number>;
};

export type SceneParams = {
  mass: number;
  rpm: number;
  fieldStrength: number;
  beamWidth: string; // wide | narrow
  showBeams: boolean;
  showFieldLines: boolean;
  showBeamFlash: boolean;
  showAccretionDisk: boolean;
};
