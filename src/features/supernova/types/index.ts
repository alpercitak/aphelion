import { Color, Mesh, MeshBasicMaterial, PlaneGeometry, Points, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import type { BaseSceneRef, UniformValue } from '@/types';

export type SceneParams = {
  progenitorMass: number; // 8–150 M☉
  supernovaType: SupernovaType;
  playbackSpeed: number; // 0.1–3
  timeline: number; // 0–1 scrubable
  autoPlay: boolean;
  showShockwave: boolean;
  showEjecta: boolean;
  showRemnant: boolean;
  showNeutrinos: boolean;
};

export interface SceneRef extends BaseSceneRef {
  entities: {
    star: Mesh<SphereGeometry, ShaderMaterial>;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
    shockwave: Mesh<SphereGeometry, ShaderMaterial>;
    ejectaShell: Mesh<SphereGeometry, MeshBasicMaterial>;
    ejectaParticles: Points;
    neutrinoParticles: Points;
    nebula: Mesh<SphereGeometry, ShaderMaterial>;
    remnant: Mesh<SphereGeometry, MeshBasicMaterial | ShaderMaterial> | null;
    // typed uniform refs
    starUniforms: StarUniforms;
    shockUniforms: ShockUniforms;
    nebulaUniforms: NebulaUniforms;
  };
}

export type StarUniforms = {
  time: UniformValue<number>;
  collapse: UniformValue<number>;
  mass: UniformValue<number>;
};

export type ShockUniforms = {
  innerColor: UniformValue<Color>;
  outerColor: UniformValue<Color>;
  opacity: UniformValue<number>;
};

export type NebulaUniforms = {
  viewVector: UniformValue<Vector3>;
  glowColor: UniformValue<Color>;
};

export type SupernovaType = 'type-ia' | 'type-ii';
export type Phase = 'PROGENITOR' | 'COLLAPSE' | 'FLASH' | 'EXPANSION' | 'NEBULA';
export type PhaseValue = [number, number];
export type RemnantType = 'neutron-star' | 'black-hole' | 'none';

export type SetPhase = (phase: Phase) => void;
export type SetTimeline = (timeline: number) => void;
