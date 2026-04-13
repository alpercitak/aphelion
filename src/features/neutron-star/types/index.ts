import type { Group, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, ShaderMaterial, SphereGeometry } from 'three';
import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import type { BaseSceneRef } from '@/types';

export interface SceneRef extends BaseSceneRef {
  entities: {
    starBody: Mesh<SphereGeometry, ShaderMaterial>;
    glow: Mesh<SphereGeometry, ShaderMaterial>;
    outerGlow: Mesh<SphereGeometry, ShaderMaterial>;
    rotator: Object3D; // beams + star rotate together
    beams: Group;
    fieldLines: Group;
    accretionDisk: Group;
    flash: Mesh<PlaneGeometry, MeshBasicMaterial>;
  };
}

export type Params = {
  mass: number;
  rpm: number;
  fieldStrength: number;
  beamWidth: string; // wide | narrow
  showBeams: boolean;
  showFieldLines: boolean;
  showBeamFlash: boolean;
  showAccretionDisk: boolean;
};

export interface SliderItem extends Partial<SliderProps> {
  id: keyof Pick<Params, 'mass' | 'rpm' | 'fieldStrength'>;
}

export interface ToggleItem extends Partial<ToggleProps> {
  id: keyof Pick<Params, 'showBeams' | 'showFieldLines' | 'showBeamFlash' | 'showAccretionDisk'>;
}

export interface RadioItem extends Partial<RadioProps> {
  id: keyof Pick<Params, 'beamWidth'>;
}
