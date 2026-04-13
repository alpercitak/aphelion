import { Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { massScale } from '@/utils/physics';

// Central body — bright emissive white-gold, blooms outward
const VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 coreColor;
  uniform vec3 rimColor;
  varying vec3 vNormal;
  void main() {
    // Edge brightens toward limb — inverse of a black hole
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
    vec3 col = mix(coreColor, rimColor, rim);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const createCentralBody = (mass: number): Mesh<SphereGeometry, ShaderMaterial> => {
  const s = massScale(mass) * 0.9;
  return new Mesh(
    new SphereGeometry(s, 64, 64),
    new ShaderMaterial({
      uniforms: {
        coreColor: { value: new Color(0xffffff) },
        rimColor: { value: new Color(0xffcc66) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    }),
  );
};
