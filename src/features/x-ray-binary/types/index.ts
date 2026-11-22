import type {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import type { BaseSceneRef } from '@/types';

export type SceneParams = {
  accretorMass: number;
  donorMass: number;
  mdotLog: number;
  rocheLobes: boolean;
  starField: boolean;
};

export type MassParams = Pick<SceneParams, 'accretorMass' | 'donorMass'>;

export type AccretorType = 'neutron-star' | 'black-hole';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Corotating-frame geometry of the binary, in scene units. */
export interface Binary {
  m1: number;
  m2: number;
  /** Mass ratio m2 / m1. */
  q: number;
  x1: number;
  x2: number;
  gm1: number;
  gm2: number;
  omega: number;
  /** x of the inner Lagrange point. */
  l1x: number;
  phiL1: number;
  /** Outer disk radius. */
  diskOuter: number;
}

export interface Body {
  mesh: Mesh<SphereGeometry, MeshBasicMaterial>;
  glow: Mesh<SphereGeometry, ShaderMaterial>;
}

export interface Donor extends Body {
  /** Unit directions of the sphere vertices, kept so the donor can be reshaped repeatedly. */
  unit: Vec3[];
}

export interface LobeCurve {
  line: LineLoop<BufferGeometry, LineBasicMaterial>;
  positions: BufferAttribute;
}

export interface RocheLobes {
  group: Group;
  donor: LobeCurve;
  accretor: LobeCurve;
}

export interface AccretionDisk {
  group: Group;
  rings: Array<{ mesh: Mesh<RingGeometry, MeshBasicMaterial>; baseOpacity: number }>;
}

export interface SceneRef extends BaseSceneRef {
  entities: {
    system: Group;
    donor: Donor;
    neutronStar: Body;
    blackHole: Body;
    lobes: RocheLobes;
    disk: AccretionDisk;
  };
}

export interface StateRef {
  binary: Binary;
}
