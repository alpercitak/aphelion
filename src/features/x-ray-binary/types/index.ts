import type {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
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

export interface Donor {
  mesh: Mesh<SphereGeometry, ShaderMaterial>;
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

/** Gas parcels from L1 and in the disk, one slot per particle. */
export interface Gas {
  points: Points<BufferGeometry, PointsMaterial>;
  /** 0 free, 1 stream, 2 disk. */
  mode: Uint8Array;
  positions: BufferAttribute;
  /** Stream velocity. */
  velocities: BufferAttribute;
  /** Disk state as (r, φ, y): radius from the accretor, azimuth, height above the plane. */
  disk: BufferAttribute;
  colors: BufferAttribute;
  /** Disk colour by radius (rgb), built once. */
  lut: BufferAttribute;
}

export interface SceneRef extends BaseSceneRef {
  entities: {
    system: Group;
    donor: Donor;
    neutronStar: Body;
    blackHole: Body;
    lobes: RocheLobes;
    disk: AccretionDisk;
    gas: Gas;
  };
}

export interface StateRef {
  binary: Binary;
  /** Fractional stream particles not yet spawned. */
  spawnCarry: number;
}
