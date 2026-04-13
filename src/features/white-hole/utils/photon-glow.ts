import { AdditiveBlending, BackSide, Color, FrontSide, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { massScale } from '@/utils/physics';

// Photon sphere glow — Fresnel but brighter on BackSide (outward facing)
const VERTEX_SHADER = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.65 - dot(vNormal, vNormel)), 3.0);
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

export const createPhotonGlow = (mass: number, cameraPos: Vector3): Mesh<SphereGeometry, ShaderMaterial> => {
  const s = massScale(mass) * 0.9 * 1.5; // photon sphere at 1.5× body radius
  return new Mesh(
    new SphereGeometry(s, 64, 64),
    new ShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(0xffdd88) },
        viewVector: { value: cameraPos.clone() },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: BackSide, // outward-facing — inverse of black hole
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
};

export const createOuterHalo = (mass: number, cameraPos: Vector3): Mesh<SphereGeometry, ShaderMaterial> => {
  const s = massScale(mass) * 0.9 * 2.4;
  return new Mesh(
    new SphereGeometry(s, 64, 64),
    new ShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(0xff8833) },
        viewVector: { value: cameraPos.clone() },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: FrontSide, // outer halo faces inward — warm ambient fill
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
};
