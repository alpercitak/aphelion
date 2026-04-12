import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Side,
} from 'three';
import { massScale } from '@/utils/physics';

interface BlackHoleUnitData {
  bhMesh: Mesh;
  glowMesh: Mesh<SphereGeometry, ShaderMaterial>;
  glowMat: ShaderMaterial;
  haloMesh: Mesh<SphereGeometry, ShaderMaterial>;
  haloMat: ShaderMaterial;
  diskGroup: Group;
  baseScale: number;
}

interface BlackHoleUnit extends Group {
  userData: BlackHoleUnitData;
}

// Fresnel glow
const VERTEX_SHADER = `
  uniform vec3 viewVector;
  uniform float power;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.7 - dot(vNormal, vNormel)), power);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.85);
  }
`;

const DISK_RING_COLORS = [0xff9944, 0xff6633, 0xdd4422, 0x882211] as const;

const DISK_RING_COUNT = 12;

const MERGER_MASS_FACTOR = 1.2; // ~80% mass retention, rest radiated as gravitational waves

const BINARY_VISUAL_SCALE = 0.7; // scale down BH units relative to standalone scene

const createFresnelMaterial = (color: number, side: Side, power: number, viewVector: Vector3) =>
  new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(color) },
      viewVector: { value: viewVector.clone() },
      power: { value: power },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

export const createBlackHoleUnit = (massSolar: number, cameraPos?: Vector3): BlackHoleUnit => {
  const group = new Group();
  const s = massScale(massSolar, 20) * 0.7;
  const defaultCameraPos = cameraPos?.clone() ?? new Vector3(0, 3, 8);

  // Event horizon
  const bhMesh = new Mesh(new SphereGeometry(1, 48, 48), new MeshBasicMaterial({ color: 0x000000 }));
  bhMesh.scale.setScalar(s);

  // Photon glow
  const glowMat = createFresnelMaterial(0xffaa44, FrontSide, 3.0, defaultCameraPos);
  const glowMesh = new Mesh(new SphereGeometry(1.55, 48, 48), glowMat);
  glowMesh.scale.setScalar(s);

  // Outer halo
  const haloMat = createFresnelMaterial(0xff6b1a, BackSide, 4.0, defaultCameraPos);
  const haloMesh = new Mesh(new SphereGeometry(2.1, 48, 48), haloMat);
  haloMesh.scale.setScalar(s);

  // Mini accretion disk
  const diskGroup = new Group();
  const innerR = 1.6 * s;
  const outerR = 3.2 * s;
  for (let i = 0; i < DISK_RING_COUNT; i++) {
    const t = i / DISK_RING_COUNT;
    const r = innerR + t * (outerR - innerR);
    const w = ((outerR - innerR) / DISK_RING_COUNT) * 1.1;
    const col = DISK_RING_COLORS[Math.floor(t * DISK_RING_COLORS.length)];
    const mesh = new Mesh(
      new RingGeometry(r, r + w, 80, 1),
      new MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: Math.pow(1 - t, 1.5) * 0.7 + 0.05,
        side: DoubleSide,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    diskGroup.add(mesh);
  }

  group.add(bhMesh, glowMesh, haloMesh, diskGroup);
  group.userData = { bhMesh, glowMesh, glowMat, haloMesh, haloMat, diskGroup, baseScale: s };

  return group as BlackHoleUnit;
};

export const createMergedBlackHole = (mass1: number, mass2: number, cameraPos?: Vector3): BlackHoleUnit => {
  const combinedMass = mass1 + mass2;
  return createBlackHoleUnit(combinedMass * MERGER_MASS_FACTOR, cameraPos);
};

export const applyBlackHoleScale = (unit: BlackHoleUnit, mass: number) => {
  const s = massScale(mass, 20) * BINARY_VISUAL_SCALE;
  unit.userData.bhMesh.scale.setScalar(s);
  unit.userData.glowMesh.scale.setScalar(s);
  unit.userData.haloMesh.scale.setScalar(s);
};
