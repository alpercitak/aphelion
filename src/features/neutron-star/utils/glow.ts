import {
  AdditiveBlending,
  BackSide,
  Color,
  FrontSide,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Side,
} from 'three';
import { NS_RADIUS } from '../constants';

interface GlowOptions {
  radiusMultiplier: number;
  color: number | string;
  side?: Side;
  opacity?: number;
}

const VERTEX_SHADER = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.65 - dot(vNormal, vNormel)), 3.5);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.8);
  }
`;

/**
 * Creates a atmospheric glow mesh for celestial bodies
 */
export const createAtmosphericGlow = (
  cameraPos: Vector3,
  options: GlowOptions,
): Mesh<SphereGeometry, ShaderMaterial> => {
  const { radiusMultiplier, color, side = FrontSide } = options;

  const geo = new SphereGeometry(NS_RADIUS * radiusMultiplier, 48, 48);
  const mat = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(color) },
      viewVector: { value: cameraPos },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

  return new Mesh(geo, mat);
};

export const createGlow = (cameraPos: Vector3): Mesh<SphereGeometry, ShaderMaterial> =>
  createAtmosphericGlow(cameraPos, {
    radiusMultiplier: 1.6,
    color: 0x88bbff,
    side: FrontSide,
  });

export const createOuterGlow = (cameraPos: Vector3): Mesh<SphereGeometry, ShaderMaterial> =>
  createAtmosphericGlow(cameraPos, {
    radiusMultiplier: 2.4,
    color: 0x4488ff,
    side: BackSide,
  });
